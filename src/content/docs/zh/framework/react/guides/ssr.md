---
id: ssr
title: 服务端渲染与水合
---

<!--
translation-source-path: framework/react/guides/ssr.md
translation-source-ref: v5.90.3
translation-source-hash: 95363fa22c0dfac564703848137a5d094d9d12fd75e100139456f8f9093f7c61
translation-status: translated
-->


本指南将介绍如何在服务端渲染中使用 React Query。

你可以先阅读 [预获取与路由集成](../prefetching.md) 作为背景，也建议先看一下 [性能与请求瀑布指南](../request-waterfalls.md)。

如果你想了解更高级的服务端渲染模式（如流式渲染、Server Components 以及新的 Next.js app router），请参阅 [高级服务端渲染指南](../advanced-ssr.md)。

如果你只想先看代码，可以直接跳到下方的 [Full Next.js pages router example](#full-nextjs-pages-router-example) 或 [Full Remix example](#full-remix-example)。

## 服务端渲染与 React Query

先明确一下什么是服务端渲染。下文默认你已经熟悉该概念，但我们还是花点时间看它与 React Query 的关系。服务端渲染是指在服务端生成初始 HTML，让用户在页面加载后尽快看到内容。它可以在请求到来时按需进行（SSR），也可以提前完成（比如复用先前缓存请求结果，或在构建阶段完成，即 SSG）。

如果你看过请求瀑布指南，可能记得这个过程：

```
1. |-> Markup (without content)
2.   |-> JS
3.     |-> Query
```

在纯客户端渲染应用中，这是用户看到任何内容前至少需要经历的 3 次服务端往返。换个角度看，服务端渲染会把它变成：

```
1. |-> Markup (with content AND initial data)
2.   |-> JS
```

当 **1.** 完成时，用户立刻能看到内容；当 **2.** 完成时，页面变得可交互可点击。由于 markup 已包含初始数据，客户端至少在首次渲染阶段无需再执行 **3.**，除非你之后要重新校验数据。

以上是从客户端视角。服务端侧我们需要在生成/渲染 markup 之前先**预获取（prefetch）**数据，再把数据**脱水（dehydrate）**为可序列化格式嵌入 markup；客户端再把这些数据**水合（hydrate）**进 React Query 缓存，避免再次发起获取。

继续阅读，了解如何用 React Query 实现这三个步骤。

## 关于 Suspense 的简短说明

本指南使用常规 `useQuery` API。虽然不一定推荐，但你也可以改用 `useSuspenseQuery`，前提是**始终预获取所有查询**。优点是你可以在客户端用 `<Suspense>` 处理加载状态。

如果在使用 `useSuspenseQuery` 时漏掉了某个预获取查询，后果取决于你使用的框架。在一些情况下，数据会在服务端 suspend 并被获取，但不会水合到客户端，导致客户端再次获取。这会造成 markup 水合不匹配，因为服务端和客户端渲染了不同内容。

## 初始设置

使用 React Query 的第一步始终是创建 `queryClient`，并用 `<QueryClientProvider>` 包裹应用。在服务端渲染中，关键点是要在**应用内部**（React state 中，或实例 ref 也可）创建 `queryClient` 实例。**这样可以确保不同用户与请求之间不会共享数据**，同时仍保证在组件生命周期内只创建一次 `queryClient`。

Next.js pages router：

```tsx
// _app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// NEVER DO THIS:
// const queryClient = new QueryClient()
//
// Creating the queryClient at the file root level makes the cache shared
// between all requests and means _all_ data gets passed to _all_ users.
// Besides being bad for performance, this also leaks any sensitive data.

export default function MyApp({ Component, pageProps }) {
  // Instead do this, which ensures each request has its own cache:
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
```

Remix：

```tsx
// app/root.tsx
import { Outlet } from '@remix-run/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function MyApp() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
```

## 用 `initialData` 快速起步

最快的起步方式是：在预获取阶段先不引入 React Query，也不使用 `dehydrate`/`hydrate` API，而是把原始数据作为 `initialData` 传给 `useQuery`。下面以 Next.js pages router 的 `getServerSideProps` 为例：

```tsx
export async function getServerSideProps() {
  const posts = await getPosts()
  return { props: { posts } }
}

function Posts(props) {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialData: props.posts,
  })

  // ...
}
```

这同样适用于 `getStaticProps`，甚至更早的 `getInitialProps`，也可以套用到其他提供等价能力的框架中。下面是 Remix 的同一模式：

```tsx
export async function loader() {
  const posts = await getPosts()
  return json({ posts })
}

function Posts() {
  const { posts } = useLoaderData<typeof loader>()

  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialData: posts,
  })

  // ...
}
```

这个方案配置最少，在某些场景下很快可用，但和完整方案相比有**几个权衡**：

- 如果你在树更深层组件里调用 `useQuery`，就需要把 `initialData` 层层往下传
- 如果在多个位置调用同一个 `useQuery`，只给其中一个传 `initialData` 会很脆弱，应用结构变动后容易失效。如果带 `initialData` 的那个组件被移除或移动，更深层的 `useQuery` 可能就没数据了。而给**所有**需要它的查询都传 `initialData` 又会很繁琐。
- 无法知道查询在服务端“何时”被获取，因此 `dataUpdatedAt` 以及是否需要重新获取的判断，都会基于页面加载时间而不是服务端获取时间
- 若缓存里已存在该查询数据，`initialData` 永远不会覆盖它，**即便新数据比旧数据更新**
  - 这个问题为何严重？以上面 `getServerSideProps` 为例：如果你来回多次访问页面，`getServerSideProps` 每次都会执行并拿到新数据，但由于用了 `initialData`，客户端缓存和数据不会更新。

完整水合方案也很直观，而且没有这些缺点。后续内容将重点介绍完整方案。

## 使用 Hydration APIs

只需增加一点配置，你就可以在预加载阶段使用 `queryClient` 预获取查询，再把该 `queryClient` 的序列化结果传给应用渲染部分并复用，从而规避上述缺点。你可以直接跳到完整 Next.js pages router 与 Remix 示例；在通用层面，额外步骤如下：

- 在框架 loader 函数中创建 `const queryClient = new QueryClient(options)`
- 在 loader 中，对每个要预获取的查询执行 `await queryClient.prefetchQuery(...)`
  - 可并行时建议用 `await Promise.all(...)`
  - 有些查询不预获取也没问题。它们不会参与服务端渲染，而是在应用可交互后于客户端获取。这对仅在交互后显示的内容，或页面较靠下、避免阻塞关键内容的内容很有价值。
- 从 loader 返回 `dehydrate(queryClient)`；注意不同框架返回语法不同
- 使用 `<HydrationBoundary state={dehydratedState}>` 包裹组件树，其中 `dehydratedState` 来自框架 loader。`dehydratedState` 的获取方式也因框架而异。
  - 你可以在每条路由上做，也可以在应用顶层做以减少样板，见示例

> 一个有趣细节是：这里实际上有 _三个_ `queryClient`。框架 loader 属于渲染前的“预加载”阶段，这个阶段有自己的 `queryClient` 负责预获取。该阶段脱水后的结果会传给**服务端渲染流程**和**客户端渲染流程**，而两边各自又有自己的 `queryClient`。这样可确保双方从相同数据起步，返回一致 markup。

> Server Components 也是一种“预加载”阶段，也能“预加载”（预渲染）React 组件树的一部分。详见 [高级服务端渲染指南](../advanced-ssr.md)。

### Full Next.js pages router example

> 关于 app router 文档，请参阅 [高级服务端渲染指南](../advanced-ssr.md)。

初始设置：

```tsx
// _app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
```

每条路由中：

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

### Full Remix example

初始设置：

```tsx
// app/root.tsx
import { Outlet } from '@remix-run/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function MyApp() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
```

每条路由中都可以这样做，嵌套路由同样适用：

```tsx
// app/routes/posts.tsx
import { json } from '@remix-run/node'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query'

export async function loader() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return json({ dehydratedState: dehydrate(queryClient) })
}

function Posts() {
  // This useQuery could just as well happen in some deeper child to
  // the <PostsRoute>, data will be available immediately either way
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts })

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  // ...
}

export default function PostsRoute() {
  const { dehydratedState } = useLoaderData<typeof loader>()
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  )
}
```

## 可选：移除样板代码

如果每条路由都写下面这段，可能会觉得样板代码偏多：

```tsx
export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  )
}
```

这种做法本身没问题。但如果你想减少样板，在 Next.js 中可以这样调整：

```tsx
// _app.tsx
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

// pages/posts.tsx
// Remove PostsRoute with the HydrationBoundary and instead export Posts directly:
export default function Posts() { ... }
```

在 Remix 中，这件事稍微复杂一些，推荐查看 [use-dehydrated-state](https://github.com/maplegrove-io/use-dehydrated-state) 包。

## 预获取依赖查询

我们在预获取指南中学习了如何[预获取依赖查询](../prefetching.md#dependent-queries--code-splitting)，但在框架 loader 中怎么做？看下面这段代码，摘自[依赖查询指南](../dependent-queries.md)：

```tsx
// Get the user
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
})

const userId = user?.id

// Then get the user's projects
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // The query will not execute until the userId exists
  enabled: !!userId,
})
```

要让它可以服务端渲染，预获取可以这样写：

```tsx
// For Remix, rename this to loader instead
export async function getServerSideProps() {
  const queryClient = new QueryClient()

  const user = await queryClient.fetchQuery({
    queryKey: ['user', email],
    queryFn: getUserByEmail,
  })

  if (user?.userId) {
    await queryClient.prefetchQuery({
      queryKey: ['projects', userId],
      queryFn: getProjectsByUser,
    })
  }

  // For Remix:
  // return json({ dehydratedState: dehydrate(queryClient) })
  return { props: { dehydratedState: dehydrate(queryClient) } }
}
```

当然，实际逻辑可能更复杂。但这些 loader 函数本质就是 JavaScript，你可以充分利用语言能力组织逻辑。务必预获取所有你希望参与服务端渲染的查询。

## 错误处理

React Query 默认采用“优雅降级”策略，意味着：

- `queryClient.prefetchQuery(...)` 不会抛出错误
- `dehydrate(...)` 只包含成功查询，不包含失败查询

这会导致失败查询在客户端重试，同时服务端输出中会是加载态而非完整内容。

这是一个不错的默认行为，但有时你不想这样。比如关键内容缺失时，你可能希望返回 404 或 500。此时可改用 `queryClient.fetchQuery(...)`，它在失败时会抛错，便于你按框架方式处理。

```tsx
let result

try {
  result = await queryClient.fetchQuery(...)
} catch (error) {
  // Handle the error, refer to your framework documentation
}

// You might also want to check and handle any invalid `result` here
```

如果你确实希望在脱水状态中包含失败查询以避免重试，可以通过 `shouldDehydrateQuery` 选项覆盖默认逻辑：

```tsx
dehydrate(queryClient, {
  shouldDehydrateQuery: (query) => {
    // This will include all queries, including failed ones,
    // but you can also implement your own logic by inspecting `query`
    return true
  },
})
```

## 序列化

在 Next.js 里执行 `return { props: { dehydratedState: dehydrate(queryClient) } }`，或在 Remix 里执行 `return json({ dehydratedState: dehydrate(queryClient) })` 时，框架会把 `queryClient` 的 `dehydratedState` 表示进行序列化，嵌入到 markup 并传输给客户端。

默认情况下，这些框架只支持返回安全可序列化/可解析的值，因此不支持 `undefined`、`Error`、`Date`、`Map`、`Set`、`BigInt`、`Infinity`、`NaN`、`-0`、正则表达式等。这也意味着你的查询结果里不能返回这些值。如果你确实需要返回它们，可以考虑 [superjson](https://github.com/blitz-js/superjson) 或类似包。

如果你使用自定义 SSR 方案，这一步要自己处理。很多人第一反应是 `JSON.stringify(dehydratedState)`，但它默认不会转义 `<script>alert('Oh no..')</script>` 这类内容，容易导致应用出现 **XSS 漏洞**。[superjson](https://github.com/blitz-js/superjson) 本身也**不会**做值转义，在自定义 SSR 里单独使用并不安全（除非你额外加转义步骤）。我们更推荐 [Serialize JavaScript](https://github.com/yahoo/serialize-javascript) 或 [devalue](https://github.com/Rich-Harris/devalue)，两者都默认具备防 XSS 注入能力。

## 关于请求瀑布的补充说明

在[性能与请求瀑布指南](../request-waterfalls.md)中，我们提到会回到一个更复杂的嵌套瀑布场景，说明服务端渲染如何改变它。你可以查看那个[具体代码示例](../request-waterfalls#code-splitting)。这里简单回顾：在 `<Feed>` 组件里有一个代码分割的 `<GraphFeedItem>`，只有 feed 中包含 graph 项时才渲染，且两个组件各自获取自己的数据。客户端渲染下会形成如下请求瀑布：

```
1. |> Markup (without content)
2.   |> JS for <Feed>
3.     |> getFeed()
4.       |> JS for <GraphFeedItem>
5.         |> getGraphDataById()
```

服务端渲染的好处是可以把它变成：

```
1. |> Markup (with content AND initial data)
2.   |> JS for <Feed>
2.   |> JS for <GraphFeedItem>
```

注意查询已不在客户端获取，其数据已经包含在 markup 里。JS 之所以能并行加载，是因为 `<GraphFeedItem>` 已在服务端渲染，我们已知客户端也需要这个 chunk，于是可以在 markup 中插入对应 script-tag。不过在服务端，这个请求瀑布依然存在：

```
1. |> getFeed()
2.   |> getGraphDataById()
```

因为在拿到 feed 之前，我们无法知道是否也需要 graph 数据，它们是依赖查询。好在这发生在服务端，延迟通常更低且更稳定，因此问题往往没那么严重。

很棒，我们已经压平了大部分瀑布。但还有一个前提。假设这个页面是 `/feed`，另一个页面是 `/posts`。如果你在地址栏直接输入 `www.example.com/feed` 并回车，会获得上述服务端渲染收益；但如果你先进入 `www.example.com/posts`，再**点击链接**跳转到 `/feed`，又会回到下面这个模式：

```
1. |> JS for <Feed>
2.   |> getFeed()
3.     |> JS for <GraphFeedItem>
4.       |> getGraphDataById()
```

这是因为在 SPA 中，服务端渲染只对首次页面加载生效，后续导航不生效。

现代框架通常会尝试并行获取初始代码与数据。所以如果你在 Next.js 或 Remix 中采用了本指南提到的预获取模式（包括依赖查询预获取），实际会更像这样：

```
1. |> JS for <Feed>
1. |> getFeed() + getGraphDataById()
2.   |> JS for <GraphFeedItem>
```

这已经好很多了。如果还想进一步优化，可以借助 Server Components 压平到一次往返。详见 [高级服务端渲染指南](../advanced-ssr.md)。

## 提示、技巧与注意事项

### 过期时间以服务端获取时刻为准

查询是否过期取决于其 `dataUpdatedAt`。这里有个前提：服务端时间必须准确。好在内部使用 UTC 时间，不受时区影响。

由于 `staleTime` 默认是 `0`，页面加载时默认会在后台重新获取。你可以提高 `staleTime` 来避免这次“双重获取”，尤其是在你不缓存 markup 的情况下。

当你把 markup 缓存在 CDN 时，这种“过期后后台重新获取”机制非常合适。你可以把页面本身缓存时间设得较高，避免服务端频繁重渲染；同时把查询 `staleTime` 设得较低，确保用户访问页面时能在后台尽快刷新数据。比如页面缓存一周，但数据只要超过一天就在加载时自动刷新。

### 服务端高内存占用

如果你为每个请求都创建 `QueryClient`，React Query 会为其创建隔离缓存，并在 `gcTime` 周期内保留在内存中。若该时间段请求量很大，服务端内存占用可能升高。

在服务端，`gcTime` 默认是 `Infinity`，会禁用手动垃圾回收，并在请求结束后自动清理内存。如果你显式设置了非 Infinity 的 `gcTime`，就需要自行更早清理缓存。

避免把 `gcTime` 设为 `0`，这可能导致水合错误。原因是 [Hydration Boundary](../../reference/hydration.md#hydrationboundary) 会把渲染所需数据放入缓存，若渲染完成前就被垃圾回收移除，可能出问题。如果你需要更短 `gcTime`，建议设为 `2 * 1000`，给应用留出足够时间引用数据。

若要在不再需要后清理缓存并降低内存占用，可在请求处理完、且脱水状态已发送给客户端后调用 [`queryClient.clear()`](../../../../reference/QueryClient.md#queryclientclear)。

或者，你也可以设置更小的 `gcTime`。

### Next.js rewrites 的注意事项

如果你把 [Next.js rewrites 特性](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites) 与 [Automatic Static Optimization](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization) 或 `getStaticProps` 一起使用，需要注意：React Query 会发生第二次水合。这是因为 [Next.js 需要在客户端解析 rewrites](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites#rewrite-parameters)，并在水合后收集参数，以便提供给 `router.query`。

结果是所有水合数据会丢失引用相等性，这会影响例如把数据作为组件 props 使用、或放在 `useEffect`/`useMemo` 依赖数组中的场景。
