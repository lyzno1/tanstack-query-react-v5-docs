---
id: advanced-ssr
title: 高级服务端渲染
---

<!--
translation-source-path: framework/react/guides/advanced-ssr.md
translation-source-ref: v5.90.3
translation-source-hash: d2b60a8cb55729f73e54c59518457ebd6d0949c6fd96496270cf78176457e18a
translation-status: translated
-->


欢迎来到高级服务端渲染指南。在这里你将学习如何将 React Query 与流式传输（streaming）、Server Components 以及 Next.js app router 结合使用。

在阅读本文前，你可能会先看一下 [Server Rendering & Hydration 指南](../ssr.md)。它讲解了 React Query 与 SSR 配合的基础知识；另外，[Performance & Request Waterfalls](../request-waterfalls.md) 和 [Prefetching & Router Integration](../prefetching.md) 也包含了很有价值的背景信息。

开始前先说明：SSR 指南中提到的 `initialData` 方案同样适用于 Server Components，不过本指南将重点放在 hydration API 上。

## Server Components 与 Next.js app router

这里不会深入讲 Server Components，简要来说：它们是保证**只在服务端**运行的组件，不仅在初次页面渲染时如此，**在页面切换时也一样**。这与 Next.js 的 `getServerSideProps`/`getStaticProps` 和 Remix 的 `loader` 有些相似，它们也都总是在服务端运行；不同点是，这些 loader 只能返回数据，而 Server Components 能做的事情更多。不过对 React Query 来说，数据部分最关键，所以我们聚焦在这里。

如何把我们在 Server Rendering 指南中学到的“[将框架 loader 中预取的数据传给应用](../ssr.md#using-the-hydration-apis)”应用到 Server Components 与 Next.js app router？最好的思考方式是把 Server Components 看作“只是另一种框架 loader”。

### 术语快速说明

到目前为止，这些指南里我们一直在讨论 _server_ 和 _client_。需要注意的是，容易混淆的一点在于：这并不与 _Server Components_ 和 _Client Components_ 一一对应。Server Components 保证只在服务端运行，而 Client Components 实际上可以在两端运行。原因是它们也可能在首次 _server rendering_ 阶段参与渲染。

一种理解方式是：虽然 Server Components 也会 _render_，但它发生在“loader phase”（始终在服务端）；而 Client Components 运行在“application phase”。这个 application 既可能在 SSR 期间运行在服务端，也可能运行在浏览器等环境。它具体在哪运行、SSR 时是否运行，会因框架而异。

### 初始设置

任何 React Query 配置的第一步，始终是创建 `queryClient` 并用 `QueryClientProvider` 包裹应用。在 Server Components 场景下，各框架做法基本类似，区别之一是文件命名约定：

```tsx
// In Next.js, this file would be called: app/providers.tsx
'use client'

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

```tsx
// In Next.js, this file would be called: app/layout.tsx
import Providers from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

这部分和 SSR 指南中做的事情非常相似，只是现在要拆成两个文件。

### 预取与数据 de/hydrate

接下来看看如何实际预取数据、再做 dehydrate 和 hydrate。下面是 **Next.js Pages Router** 中的写法：

```tsx
// pages/posts.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query'

// This could also be getServerSideProps
export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

function Posts() {
  // This useQuery could just as well happen in some deeper child to
  // the <PostsRoute>, data will be available immediately either way
  //
  // Note that we are using useQuery here instead of useSuspenseQuery.
  // Because this data has already been prefetched, there is no need to
  // ever suspend in the component itself. If we forget or remove the
  // prefetch, this will instead fetch the data on the client, while
  // using useSuspenseQuery would have had worse side effects.
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts })

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  // ...
}

export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  )
}
```

迁移到 app router 后整体上依然很像，只是需要稍微调整位置。首先创建一个 Server Component 负责预取：

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

再看看 Client Component 这部分：

```tsx
// app/posts/posts.tsx
'use client'

export default function Posts() {
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  })

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix.
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  // ...
}
```

上面示例有个很棒的点：这里唯一与 Next.js 强绑定的其实只有文件名。其余部分在任何支持 Server Components 的框架里都几乎一致。

我们在 SSR 指南中提到过，可以去掉每个路由都写 `<HydrationBoundary>` 的样板代码。但在 Server Components 场景下，这点做不到。

> 注意：如果你在使用异步 Server Components 时遇到类型错误，且 TypeScript 版本低于 `5.1.3`、`@types/react` 版本低于 `18.2.8`，建议升级到最新版本。或者可临时在组件被其他组件调用时添加 `{/* @ts-expect-error Server Component */}` 作为权宜方案。详见 Next.js 13 文档中的 [Async Server Component TypeScript Error](https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error)。

> 注意：如果你遇到错误 `Only plain objects, and a few built-ins, can be passed to Server Actions. Classes or null prototypes are not supported.`，请确保传给 queryFn 的**不是**函数引用，而是直接调用函数。因为 queryFn 参数里有很多属性，并非全部可序列化。参见 [Server Action only works when queryFn isn't a reference](https://github.com/TanStack/query/issues/6264)。

### 嵌套 Server Components

Server Components 的一个优点是可嵌套，并可出现在 React 树的多个层级中。这样可以把预取数据放到更接近实际使用位置的地方，而不必只能放在应用顶层（类似 Remix loader）。最简单的情况是一个 Server Component 再渲染另一个 Server Component（为简洁起见，这里省略 Client Components）：

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'
import CommentsServerComponent from './comments-server'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
      <CommentsServerComponent />
    </HydrationBoundary>
  )
}

// app/posts/comments-server.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Comments from './comments'

export default async function CommentsServerComponent() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments />
    </HydrationBoundary>
  )
}
```

可以看到，在多个位置使用 `<HydrationBoundary>` 完全没问题；为预取创建并 dehydrate 多个 `queryClient` 也没问题。

注意：由于我们在渲染 `CommentsServerComponent` 前 `await` 了 `getPosts`，这会形成服务端瀑布：

```
1. |> getPosts()
2.   |> getComments()
```

如果服务端到数据源的延迟很低，这可能不是大问题，但仍值得指出。

在 Next.js 中，除了在 `page.tsx` 里预取数据，也可以在 `layout.tsx` 和[并行路由](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)中进行。由于这些都属于路由体系，Next.js 知道如何并行拉取它们。所以如果上面的 `CommentsServerComponent` 改为并行路由表达，瀑布会自动被打平。

随着更多框架开始支持 Server Components，它们可能会有不同路由约定。具体细节请查阅对应框架文档。

### 可选方案：使用单个 `queryClient` 进行预取

上面的示例中，我们为每个取数的 Server Component 创建新的 `queryClient`。这是推荐方式。但如果你愿意，也可以创建一个单例并在所有 Server Components 之间复用：

```tsx
// app/getQueryClient.tsx
import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(() => new QueryClient())
export default getQueryClient
```

好处是：在任何由 Server Component 调用的地方（包括工具函数）都可以 `getQueryClient()` 拿到这个 client。坏处是：每次调用 `dehydrate(getQueryClient())` 都会序列化_整个_ `queryClient`，包括此前已序列化过且与当前 Server Component 无关的查询，带来不必要开销。

Next.js 对 `fetch()` 请求已做去重；但如果你的 `queryFn` 使用的是其他请求方式，或你所用框架**不会**自动去重，那么使用上述“单个 `queryClient`”方案在某些情况下依然有意义，即使会有重复序列化。

> 未来我们可能会考虑提供 `dehydrateNew()`（名称待定）之类的方法，仅 dehydrate 自上次 `dehydrateNew()` 调用后新增的查询。如果你对这个方向感兴趣并愿意参与，欢迎联系我们。

### 数据所有权与重新验证

在 Server Components 场景下，必须认真考虑数据所有权和重新验证（revalidation）。先看一个基于上文改造的示例：

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  // Note we are now using fetchQuery()
  const posts = await queryClient.fetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* This is the new part */}
      <div>Nr of posts: {posts.length}</div>
      <Posts />
    </HydrationBoundary>
  )
}
```

现在我们在 Server Component 和 Client Component 中都在渲染 `getPosts` 查询数据。首次页面渲染没问题，但当 `staleTime` 过期后，若客户端出于某种原因触发重新验证会怎样？

React Query 并不知道如何去_重新验证 Server Component_。因此如果它在客户端重新获取数据并触发 React 重新渲染帖子列表，`Nr of posts: {posts.length}` 这部分就会与客户端视图不同步。

如果你设置 `staleTime: Infinity`，让 React Query 永不重新验证，这个问题就不存在。但这通常又不是你使用 React Query 的初衷。

在以下场景中，React Query 与 Server Components 组合通常更有意义：

- 你已有基于 React Query 的应用，并希望迁移到 Server Components，而不重写全部数据获取逻辑
- 你想保留熟悉的编程范式，同时在合适位置引入 Server Components 的收益
- 你有 React Query 能覆盖，但所选框架本身不覆盖的用例

很难给出“何时应配合使用 React Query 与 Server Components”的统一答案。**如果你是从零开始一个全新的 Server Components 应用，我们建议先使用框架原生的数据获取工具，直到你真的需要时再引入 React Query。** 你也可能永远不需要它，这完全没问题，按场景选对工具即可。

如果你确实使用它，一个经验法则是：除非你需要捕获错误，否则尽量避免 `queryClient.fetchQuery`。即便使用了，也不要在服务端渲染它的结果，或把结果传给其他组件（即使是 Client Component）。

从 React Query 角度看，请把 Server Components 当作“预取数据的地方”，仅此而已。

当然，让一部分数据由 Server Components 拥有、另一部分由 Client Components 拥有也是可以的，只要确保这两套现实不会失同步。

## 使用 Server Components 进行流式传输

Next.js app router 会自动将应用中已就绪的部分尽早流式发送给浏览器，因此无需等待仍在 pending 的内容就能先显示已完成内容。它沿着 `<Suspense>` 边界进行。注意：如果你创建了 `loading.tsx` 文件，Next.js 会在幕后自动创建一个 `<Suspense>` 边界。

配合上文的预取模式，React Query 与这种 streaming 形式完全兼容。随着每个 Suspense 边界的数据就绪，Next.js 可立即渲染并把完成内容流式发送到浏览器。即便你像上文那样使用 `useQuery` 也可以工作，因为真正的 suspend 发生在你 `await` 预取时。

从 React Query v5.40.0 开始，要实现这一点不再要求你 `await` 所有预取，因为 `pending` 查询也可以被 dehydrate 并发送到客户端。这让你可以尽早发起预取，而不必让它们阻塞整个 Suspense 边界；当查询完成时，_数据_会再流到客户端。比如你想预取一些只有在用户交互后才可见的内容，或者你想 `await` 并渲染无限查询的第一页，同时提前预取第二页且不阻塞渲染，这都很有用。

要实现它，我们需要让 `queryClient` 在 `dehydrate` 时也包含 pending 查询。可以全局配置，也可以在调用 `dehydrate` 时直接传入。

另外，我们需要把 `getQueryClient()` 从 `app/providers.tsx` 移出去，因为服务端组件和客户端 provider 都要用到它。

```tsx
// app/get-query-client.ts
import {
  isServer,
  QueryClient,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: (error) => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false
        },
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
```

> 注意：这在 NextJs 和 Server Components 中可行，是因为 React 能把 Promise 通过边界序列化后传递给 Client Components。

然后，我们只需要提供 `HydrationBoundary`，但不再需要 `await` 预取：

```tsx
// app/posts/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from './get-query-client'
import Posts from './posts'

// the function doesn't need to be `async` because we don't `await` anything
export default function PostsPage() {
  const queryClient = getQueryClient()

  // look ma, no await
  queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

在客户端，这个 Promise 会自动进入 QueryCache。这意味着我们可以在 `Posts` 组件内调用 `useSuspenseQuery` 来“消费”这个 Promise（它是在服务端创建的）：

```tsx
// app/posts/posts.tsx
'use client'

export default function Posts() {
  const { data } = useSuspenseQuery({ queryKey: ['posts'], queryFn: getPosts })

  // ...
}
```

> 注意：你也可以用 `useQuery` 代替 `useSuspenseQuery`，Promise 依然会被正确接管。但在这种情况下 NextJs 不会 suspend，组件会以 `pending` 状态渲染，同时也会退出服务端内容渲染。

如果你使用的是非 JSON 数据类型，并在服务端序列化查询结果，可以在边界两侧分别使用 `dehydrate.serializeData` 与 `hydrate.deserializeData` 来序列化/反序列化数据，确保服务端与客户端缓存中的数据格式一致：

```tsx
// app/get-query-client.ts
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'
import { deserialize, serialize } from './transformer'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // ...
      hydrate: {
        deserializeData: deserialize,
      },
      dehydrate: {
        serializeData: serialize,
      },
    },
  })
}

// ...
```

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getQueryClient } from './get-query-client'
import { serialize } from './transformer'
import Posts from './posts'

export default function PostsPage() {
  const queryClient = getQueryClient()

  // look ma, no await
  queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts().then(serialize), // <-- serialize the data on the server
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

```tsx
// app/posts/posts.tsx
'use client'

export default function Posts() {
  const { data } = useSuspenseQuery({ queryKey: ['posts'], queryFn: getPosts })

  // ...
}
```

现在你的 `getPosts` 函数就可以返回例如 `Temporal` 日期时间对象。只要 transformer 能处理这些类型，数据就会在客户端完成序列化与反序列化。

更多信息可参考 [Next.js App with Prefetching Example](../../examples/nextjs-app-prefetching)。

## Next.js 中不做预取的实验性流式方案

虽然我们推荐上面的预取方案，因为它能在首次页面加载**和**后续页面导航中都打平请求瀑布，但还有一种实验性方案：完全跳过预取，同时仍让 streaming SSR 工作，即 `@tanstack/react-query-next-experimental`。

这个包允许你在组件中直接调用 `useSuspenseQuery`，就在服务端（Client Component 中）取到数据。结果会随着 Suspense 边界的解决从服务端流到客户端。如果你调用 `useSuspenseQuery` 时没有用 `<Suspense>` 包裹，HTML 响应会等到请求完成后才开始发送。某些场景这可能正是你想要的，但要注意它会影响 TTFB。

要实现这一点，用 `ReactQueryStreamedHydration` 包裹应用：

```tsx
// app/providers.tsx
'use client'

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import * as React from 'react'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Providers(props: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
```

更多信息可参考 [NextJs Suspense Streaming Example](../../examples/nextjs-suspense-streaming)。

这个方案最大的优点是：你不再需要手动预取查询就能让 SSR 工作，而且结果仍可流式传输。开发体验（DX）很好，代码复杂度也更低。

缺点可以回看 Performance & Request Waterfalls 指南中的[复杂请求瀑布示例](../request-waterfalls.md#code-splitting)。使用带预取的 Server Components，能在首次页面加载**和**后续导航中都有效消除请求瀑布。而这个“无预取”方案只能在首次加载时打平瀑布，页面导航时又会回到原始示例中的深层瀑布：

```
1. |> JS for <Feed>
2.   |> getFeed()
3.     |> JS for <GraphFeedItem>
4.       |> getGraphDataById()
```

这甚至比 `getServerSideProps`/`getStaticProps` 更差，因为后者至少还能并行拉取数据与代码。

如果你更重视 DX、迭代速度与交付速度，且希望代码复杂度低于性能；或者你的查询嵌套不深；又或者你已经通过 `useSuspenseQueries` 等手段很好地控制了请求瀑布，那么这可能是可接受的权衡。

> 理论上或许可以组合两种方式，但我们自己也还没尝试过。如果你做了尝试，欢迎反馈结果，甚至直接更新本文分享经验。

## 最后

Server Components 与 streaming 仍是比较新的概念。我们也还在持续探索 React Query 在其中的最佳定位，以及 API 还能如何改进。欢迎任何建议、反馈和 bug 报告。

同样，要在第一版指南里覆盖这个新范式的全部细节几乎不可能。如果你觉得这里缺少某些关键信息，或对内容改进有建议，欢迎联系我们。更欢迎直接点击下方 “Edit on GitHub” 按钮，一起完善文档。

[//]: # 'Materials'

## 延伸阅读

如果你想判断应用在使用 Server Components 时是否还能从 React Query 中获益，可阅读社区资源中的 [You Might Not Need React Query](../../community/tkdodos-blog.md#20-you-might-not-need-react-query)。

[//]: # 'Materials'
