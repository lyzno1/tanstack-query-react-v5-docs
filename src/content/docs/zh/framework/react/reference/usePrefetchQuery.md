---
id: usePrefetchQuery
title: usePrefetchQuery
---

<!--
translation-source-path: framework/react/reference/usePrefetchQuery.md
translation-source-ref: v5.90.3
translation-source-hash: 10cbd4f5a64ea597ea28a0306e1b674442cde34b6fa4e39ba57db360e614d2da
translation-status: translated
-->


```tsx
usePrefetchQuery(options)
```

**选项**

你可以向 `usePrefetchQuery` 传入所有可传给 [`queryClient.prefetchQuery`](../../../../reference/QueryClient.md#queryclientprefetchquery) 的选项。注意其中有些是必填项，如下：

- `queryKey: QueryKey`
  - **必填**
  - 在渲染期间用于预获取的查询键

- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **必填，但仅在未定义默认查询函数时**。更多信息见 [Default Query Function](../../guides/default-query-function.md)。

**返回值**

`usePrefetchQuery` 不会返回任何内容。它仅用于在渲染期间触发一次预获取，且应位于包裹使用 [`useSuspenseQuery`](../useSuspenseQuery.md) 组件的 suspense 边界之前。
