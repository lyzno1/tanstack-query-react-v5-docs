---
id: usePrefetchQuery
title: usePrefetchQuery
redirect_from:
  - framework/react/reference/usePrefetchQuery
---

<!--
translation-source-path: framework/react/reference/functions/usePrefetchQuery.md
translation-source-ref: main
translation-source-hash: d6880e4264f6a56c7f4b4aa02328a3d985a0ac25ad9a3da410c51bbbce953695
translation-status: translated
-->


```ts
function usePrefetchQuery<TQueryFnData, TError, TData, TQueryData, TQueryKey>(options, queryClient?): void;
```

定义于： [react-query/src/usePrefetchQuery.tsx:42](https://github.com/TanStack/query/blob/main/packages/react-query/src/usePrefetchQuery.tsx#L42)

`usePrefetchQuery` 不返回任何内容。它只用于在渲染期间触发预获取，并且应位于 Suspense 边界之前；
该边界包裹着使用 `useSuspenseQuery` 的组件。所有能够传给 `queryClient.query` 的选项都可以传给
`usePrefetchQuery`，但 `queryKey` 始终是必填项；除非已经定义默认查询函数，否则 `queryFn` 也是必填项。

如果查询已经具有任何缓存状态（包括上一次尝试遗留的 `pending` 或 `error` 状态），就会跳过预获取。
因此，每次渲染时调用此 Hook 的开销很小，既不会重新获取已经存在的数据，也不会重复发起正在进行的请求。

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = `Error`

### TData

`TData` = `TQueryFnData`

### TQueryData

`TQueryData` = `TQueryFnData`

### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

## 参数

### options

[`UsePrefetchQueryOptions`](../type-aliases/UsePrefetchQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

要使用的 [UsePrefetchQueryOptions](../type-aliases/UsePrefetchQueryOptions.md)，即所有可以传给 `queryClient.query` 的选项。

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

`void`

`void`，即不返回任何内容。

## 示例

```tsx
import { Suspense } from 'react'
import { usePrefetchQuery } from '@tanstack/react-query'

function App() {
  // 在渲染期间、下方 Suspense 边界之前触发预获取。
  usePrefetchQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  return (
    <Suspense fallback={<h1>正在加载文章……</h1>}>
      <Posts />
    </Suspense>
  )
}
```
