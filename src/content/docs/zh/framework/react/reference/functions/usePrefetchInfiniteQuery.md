---
id: usePrefetchInfiniteQuery
title: usePrefetchInfiniteQuery
redirect_from:
  - framework/react/reference/usePrefetchInfiniteQuery
---

```ts
function usePrefetchInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options, queryClient?): void;
```

定义于： [react-query/src/usePrefetchInfiniteQuery.tsx:56](https://github.com/TanStack/query/blob/main/packages/react-query/src/usePrefetchInfiniteQuery.tsx#L56)

`usePrefetchInfiniteQuery` 不返回任何内容。它只用于在渲染期间触发预取，并且应位于 Suspense 边界之前；
该边界包裹着使用 `useSuspenseInfiniteQuery` 的组件。所有能够传给 `queryClient.infiniteQuery` 的选项
都可以传给 `usePrefetchInfiniteQuery`，但 `queryKey`、`initialPageParam` 和 `getNextPageParam` 始终是必填项；
除非已经定义默认查询函数，否则 `queryFn` 也是必填项。

`getNextPageParam` 会接收无限数据列表的最后一页、包含所有页面的完整数组以及 `pageParam` 信息，
并且应返回一个变量，该变量会以 `context.pageParam` 的形式传给查询函数。返回 `undefined` 或 `null`
表示没有可用的下一页。

如果查询已经具有任何缓存状态（包括上一次尝试遗留的 `pending` 或 `error` 状态），就会跳过预取。
因此，每次渲染时调用此 Hook 的开销很小，既不会重新获取已经存在的数据，也不会重复发起正在进行的请求。

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = `Error`

### TData

`TData` = `InfiniteData`\<`TQueryFnData`, `unknown`\>

### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

### TPageParam

`TPageParam` = `unknown`

## 参数

### options

[`UsePrefetchInfiniteQueryOptions`](../type-aliases/UsePrefetchInfiniteQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

要使用的 [UsePrefetchInfiniteQueryOptions](../type-aliases/UsePrefetchInfiniteQueryOptions.md)，即所有可以传给 `queryClient.infiniteQuery` 的选项。

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

`void`

`void`，即不返回任何内容。

## 示例

```tsx
import { Suspense } from 'react'
import { infiniteQueryOptions, usePrefetchInfiniteQuery } from '@tanstack/react-query'

const projectsOptions = infiniteQueryOptions({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextId,
})

function App() {
  // 在渲染期间、下方 Suspense 边界之前触发预取。
  usePrefetchInfiniteQuery(projectsOptions)

  return (
    <Suspense fallback={<h1>正在加载项目……</h1>}>
      <Projects />
    </Suspense>
  )
}
```
