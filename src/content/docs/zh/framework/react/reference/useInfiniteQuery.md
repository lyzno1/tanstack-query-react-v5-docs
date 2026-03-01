---
id: useInfiniteQuery
title: useInfiniteQuery
---

<!--
translation-source-path: framework/react/reference/useInfiniteQuery.md
translation-source-ref: v5.90.3
translation-source-hash: 18bb1024b70aa3849ef956cf37f75072aac88c99458b7959364f12c54441ba4f
translation-status: translated
-->


```tsx
const {
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
  promise,
  ...result
} = useInfiniteQuery({
  queryKey,
  queryFn: ({ pageParam }) => fetchPage(pageParam),
  initialPageParam: 1,
  ...options,
  getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
    lastPage.nextCursor,
  getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) =>
    firstPage.prevCursor,
})
```

**选项**

`useInfiniteQuery` 的选项与 [`useQuery` hook](../../reference/useQuery.md) 相同，另外新增以下内容：

- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **必填，但仅当未定义默认查询函数时** [`defaultQueryFn`](../../guides/default-query-function.md)
  - 查询用于请求数据的函数。
  - 接收一个 [QueryFunctionContext](../../guides/query-functions.md#queryfunctioncontext)
  - 必须返回一个 promise，最终要么 resolve 出数据，要么抛出错误。
- `initialPageParam: TPageParam`
  - **必填**
  - 获取第一页时使用的默认页参数。
- `getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => TPageParam | undefined | null`
  - **必填**
  - 当该查询收到新数据时，此函数会收到无限列表数据的最后一页、全部页面数组以及 pageParam 信息。
  - 它应返回一个**单一变量**，该变量会作为最后一个可选参数传给你的查询函数。
  - 返回 `undefined` 或 `null` 表示没有下一页可用。
- `getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) => TPageParam | undefined | null`
  - 当该查询收到新数据时，此函数会收到无限列表数据的第一页、全部页面数组以及 pageParam 信息。
  - 它应返回一个**单一变量**，该变量会作为最后一个可选参数传给你的查询函数。
  - 返回 `undefined` 或 `null` 表示没有上一页可用。
- `maxPages: number | undefined`
  - 无限查询数据中最多存储的页面数。
  - 当达到最大页数后，再获取新页面会根据方向从 `pages` 数组中移除第一页或最后一页。
  - 如果为 `undefined` 或等于 `0`，则页面数量无限制
  - 默认值是 `undefined`
  - 当 `maxPages` 大于 `0` 时，必须正确实现 `getNextPageParam` 和 `getPreviousPageParam`，以便在需要时支持双向翻页获取。

**返回值**

`useInfiniteQuery` 的返回属性与 [`useQuery` hook](../../reference/useQuery.md) 相同，另外增加了以下属性，并且 `isRefetching` 与 `isRefetchError` 有细微差异：

- `data.pages: TData[]`
  - 包含所有页面的数组。
- `data.pageParams: unknown[]`
  - 包含所有页参数的数组。
- `isFetchingNextPage: boolean`
  - 使用 `fetchNextPage` 获取下一页时为 `true`。
- `isFetchingPreviousPage: boolean`
  - 使用 `fetchPreviousPage` 获取上一页时为 `true`。
- `fetchNextPage: (options?: FetchNextPageOptions) => Promise<UseInfiniteQueryResult>`
  - 该函数允许你获取结果的下一“页”。
  - `options.cancelRefetch: boolean` 如果设为 `true`，重复调用 `fetchNextPage` 会在每次调用时都触发 `queryFn`，无论前一次
    调用是否已完成。同时会忽略前一次调用的结果。如果设为 `false`，在第一次调用完成前，重复调用 `fetchNextPage`
    不会产生效果。默认值为 `true`。
- `fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<UseInfiniteQueryResult>`
  - 该函数允许你获取结果的上一“页”。
  - `options.cancelRefetch: boolean` 与 `fetchNextPage` 相同。
- `hasNextPage: boolean`
  - 如果存在可获取的下一页（由 `getNextPageParam` 选项决定），则为 `true`。
- `hasPreviousPage: boolean`
  - 如果存在可获取的上一页（由 `getPreviousPageParam` 选项决定），则为 `true`。
- `isFetchNextPageError: boolean`
  - 如果获取下一页时查询失败，则为 `true`。
- `isFetchPreviousPageError: boolean`
  - 如果获取上一页时查询失败，则为 `true`。
- `isRefetching: boolean`
  - 只要后台重新获取正在进行中就为 `true`，这_不包括_初次 `pending` 或获取下一页/上一页
  - 等价于 `isFetching && !isPending && !isFetchingNextPage && !isFetchingPreviousPage`
- `isRefetchError: boolean`
  - 如果重新获取某一页时查询失败，则为 `true`。
- `promise: Promise<TData>`
  - 一个稳定的 promise，会 resolve 为查询结果。
  - 可配合 `React.use()` 获取数据
  - 需要在 `QueryClient` 上启用 `experimental_prefetchInRender` 特性开关。

请注意，命令式获取调用（例如 `fetchNextPage`）可能会干扰默认的重新获取行为，导致数据过期。请确保仅在用户操作响应中调用这些函数，或添加 `hasNextPage && !isFetching` 之类的条件。
