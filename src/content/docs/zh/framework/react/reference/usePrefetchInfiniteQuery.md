---
id: usePrefetchInfiniteQuery
title: usePrefetchInfiniteQuery
---

<!--
translation-source-path: framework/react/reference/usePrefetchInfiniteQuery.md
translation-source-ref: v5.90.3
translation-source-hash: 054ea49f1891e4bcecf5c872ea29ddb2484f995e03c6bb6983a011d86c36aec9
translation-status: translated
-->


```tsx
usePrefetchInfiniteQuery(options)
```

**选项**

你可以向 `usePrefetchInfiniteQuery` 传入所有可传给 [`queryClient.prefetchInfiniteQuery`](../../../../reference/QueryClient.md#queryclientprefetchinfinitequery) 的选项。注意其中有些是必填项，如下：

- `queryKey: QueryKey`
  - **必填**
  - 在渲染期间用于预获取的查询键

- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **必填，但仅在未定义默认查询函数时**。更多信息见 [Default Query Function](../../guides/default-query-function.md)。

- `initialPageParam: TPageParam`
  - **必填**
  - 获取第一页时使用的默认 page param。

- `getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => TPageParam | undefined | null`
  - **必填**
  - 当该查询收到新数据时，此函数会接收无限列表的最后一页数据与所有页面的完整数组，以及 pageParam 信息。
  - 它应返回一个**单一变量**，作为最后一个可选参数传给你的查询函数。
  - 返回 `undefined` 或 `null` 表示没有下一页可用。

- **返回值**

`usePrefetchInfiniteQuery` 不会返回任何内容。它仅用于在渲染期间触发一次预获取，且应位于包裹使用 [`useSuspenseInfiniteQuery`](../useSuspenseInfiniteQuery.md) 组件的 suspense 边界之前。
