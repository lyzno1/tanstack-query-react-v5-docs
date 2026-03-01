---
id: suspense
title: Suspense
---

<!--
translation-source-path: framework/react/guides/suspense.md
translation-source-ref: v5.90.3
translation-source-hash: 93a5597ea2cb791eac02990b1830a84d08ffce2f0a84912bacaeae342993f51a
translation-status: translated
-->


React Query 也可以与 React 的 Suspense 数据获取 API 一起使用。为此我们提供了专用 hooks：

- [useSuspenseQuery](../../reference/useSuspenseQuery.md)
- [useSuspenseInfiniteQuery](../../reference/useSuspenseInfiniteQuery.md)
- [useSuspenseQueries](../../reference/useSuspenseQueries.md)
- 此外，你还可以使用 `useQuery().promise` 与 `React.use()`（实验性）

在 suspense 模式下，不再需要 `status` 状态和 `error` 对象，而是改用 `React.Suspense` 组件（包括 `fallback` 属性）以及用于捕获错误的 React Error Boundary。请阅读 [重置 Error Boundary](#resetting-error-boundaries)，并查看 [Suspense 示例](../../examples/suspense) 了解如何配置 suspense 模式。

如果你希望变更也像查询一样把错误传播到最近的 error boundary，可以把 `throwOnError` 也设为 `true`。

为查询启用 suspense 模式：

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

const { data } = useSuspenseQuery({ queryKey, queryFn })
```

这在 TypeScript 中体验很好，因为 `data` 保证已定义（错误和加载状态由 Suspense 与 Error Boundaries 处理）。

另一方面，你将无法再按条件启用/禁用 Query。对于依赖查询通常也不需要这样做，因为在 suspense 下，同一组件中的所有 Query 会串行获取。

这个 Query 也不支持 `placeholderData`。如果想避免更新时 UI 被 fallback 替换，请把会改变 QueryKey 的更新包在 [startTransition](https://react.dev/reference/react/Suspense#preventing-unwanted-fallbacks) 中。

### `throwOnError` 默认值

默认并不是所有错误都会抛给最近的 Error Boundary。只有在没有其他可展示数据时才会抛错。这意味着只要某个 Query 曾成功拿到过缓存数据，即使数据已经 `stale`，组件也会继续渲染。因此 `throwOnError` 的默认值是：

```
throwOnError: (error, query) => typeof query.state.data === 'undefined'
```

由于你不能修改 `throwOnError`（否则会让 `data` 可能变成 `undefined`），如果你希望所有错误都由 Error Boundary 处理，需要手动抛错：

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

const { data, error, isFetching } = useSuspenseQuery({ queryKey, queryFn })

if (error && !isFetching) {
  throw error
}

// continue rendering data
```

## Resetting Error Boundaries

无论你在查询中使用的是 **suspense** 还是 **throwOnError**，当发生错误后重新渲染时，你都需要一种方式告诉查询“再试一次”。

查询错误可以通过 `QueryErrorResetBoundary` 组件或 `useQueryErrorResetBoundary` hook 来重置。

使用组件时，它会重置该组件边界内的所有查询错误：

```tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          </div>
        )}
      >
        <Page />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
)
```

使用 hook 时，它会重置最近的 `QueryErrorResetBoundary` 范围内的查询错误。如果没有定义边界，则会全局重置：

```tsx
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div>
          There was an error!
          <Button onClick={() => resetErrorBoundary()}>Try again</Button>
        </div>
      )}
    >
      <Page />
    </ErrorBoundary>
  )
}
```

## Fetch-on-render 与 Render-as-you-fetch

默认情况下，React Query 在 `suspense` 模式下作为 **Fetch-on-render** 方案工作得很好，无需额外配置。这意味着当组件尝试挂载时，会触发查询并进入 suspend，但前提是组件已经被导入并挂载。

如果你想进一步实现 **Render-as-you-fetch** 模型，我们建议在路由回调和/或用户交互事件中实现 [预获取](../prefetching.md)，在组件挂载前（理想情况下甚至在导入或挂载父组件前）就启动查询加载。

## 在服务端通过流式传输使用 Suspense

如果你使用 `NextJs`，可以使用我们针对服务端 Suspense 的**实验性**集成：`@tanstack/react-query-next-experimental`。该包允许你在客户端组件中仅通过调用 `useSuspenseQuery` 就在服务端获取数据，结果会在 SuspenseBoundary 逐步 resolve 时从服务端流式发送到客户端。

为此，请使用 `ReactQueryStreamedHydration` 包裹应用：

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

更多信息请查看 [NextJs Suspense Streaming 示例](../../examples/nextjs-suspense-streaming) 和 [Advanced Rendering & Hydration](../advanced-ssr.md) 指南。

## 使用 `useQuery().promise` 与 `React.use()`（实验性）

> 启用该特性时，需要在创建 `QueryClient` 时将 `experimental_prefetchInRender` 设为 `true`

**示例代码：**

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
})
```

**用法：**

```tsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTodos, type Todo } from './api'

function TodoList({ query }: { query: UseQueryResult<Todo[]> }) {
  const data = React.use(query.promise)

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}

export function App() {
  const query = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })

  return (
    <>
      <h1>Todos</h1>
      <React.Suspense fallback={<div>Loading...</div>}>
        <TodoList query={query} />
      </React.Suspense>
    </>
  )
}
```

更完整的示例见 [GitHub 上的 suspense 示例](https://github.com/TanStack/query/tree/main/examples/react/suspense)。

Next.js 流式示例见 [GitHub 上的 nextjs-suspense-streaming 示例](https://github.com/TanStack/query/tree/main/examples/react/nextjs-suspense-streaming)。
