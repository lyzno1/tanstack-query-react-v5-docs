---
id: suspense
title: Suspense
---

<!--
translation-source-path: framework/react/guides/suspense.md
translation-source-ref: main
translation-source-hash: f228f8c90851e928b4a3a168457636ee174e0a82c32056dfb0855cbb5094a22e
translation-status: translated
-->


React Query 也可以与 React 的 Suspense 数据获取 API 一起使用。为此我们提供了专用 Hook：

- [useSuspenseQuery](../reference/functions/useSuspenseQuery.md)
- [useSuspenseInfiniteQuery](../reference/functions/useSuspenseInfiniteQuery.md)
- [useSuspenseQueries](../reference/functions/useSuspenseQueries.md)

使用 Suspense 模式时，不再需要自行处理 `status` 状态和 `error` 对象；这些工作改由 `React.Suspense`
组件（包括 `fallback` prop）和用于捕获错误的 React Error Boundary 完成。有关如何配置 Suspense 模式，
请阅读[重置错误边界](#resetting-error-boundaries)，并查看 [Suspense 示例](../examples/suspense)。

如果你希望变更也像查询一样将错误传播到最近的 Error Boundary，可以把 `throwOnError` 也设为 `true`。

为查询启用 Suspense 模式：

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

const { data } = useSuspenseQuery({ queryKey, queryFn })
```

这与 TypeScript 配合得很好，因为 `data` 保证已定义（错误和加载状态由 Suspense 与 Error Boundary 处理）。

相应地，你无法再按条件启用或禁用查询。对于依赖查询，通常也不需要这样做，因为在 Suspense 模式下，
同一组件中的所有查询会串行获取。

这类查询也不支持 `placeholderData`。如果想避免更新期间 UI 被 fallback 替换，请将会改变查询键的更新
包在 [`startTransition`](https://react.dev/reference/react/Suspense#preventing-unwanted-fallbacks) 中。

### `throwOnError` 默认值

默认情况下，并非所有错误都会抛给最近的 Error Boundary。只有在没有其他可展示数据时才会抛错。
这意味着，只要某个查询曾成功将数据写入缓存，即使数据已经过期，组件仍会继续渲染。因此，
`throwOnError` 的默认值是：

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

## 重置错误边界

无论你在查询中使用的是 **suspense** 还是 **throwOnError**，当发生错误后重新渲染时，你都需要一种方式告诉查询“再试一次”。

可以通过 `QueryErrorResetBoundary` 组件或 `useQueryErrorResetBoundary` Hook 重置查询错误。

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

默认情况下，React Query 在 Suspense 模式下无需额外配置，就是很好的 **Fetch-on-render** 方案。
组件尝试挂载时会触发查询并暂停渲染，但这要等到组件已被导入并开始挂载之后才会发生。

如果你想进一步实现 **Render-as-you-fetch** 模型，我们建议在路由回调和/或用户交互事件中进行[预取](./prefetching.md)，在组件挂载前（理想情况下甚至在导入或挂载父组件前）就启动查询加载。

## 在服务端通过流式传输使用 Suspense

如果你使用 Next.js，可以使用我们面向服务端 Suspense 的**实验性**集成：
`@tanstack/react-query-next-experimental`。在客户端组件中调用 `useSuspenseQuery`，该包便可在服务端获取数据；
随着各个 Suspense Boundary resolve，结果会从服务端流式发送到客户端。

为此，请使用 `ReactQueryStreamedHydration` 包裹应用：

```tsx
// app/providers.tsx
'use client'

import {
  environmentManager,
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
  if (environmentManager.isServer()) {
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

更多信息请查看 [Next.js Suspense Streaming 示例](../examples/nextjs-suspense-streaming)和
[高级渲染与水合](./advanced-ssr.md)指南。
