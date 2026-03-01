---
id: infiniteQueryOptions
title: infiniteQueryOptions
---

<!--
translation-source-path: framework/react/reference/infiniteQueryOptions.md
translation-source-ref: v5.90.3
translation-source-hash: 3397d4776faf3509ff0eee0bccd736fbc6705615b0d09ac4d92474b6ec6f12e4
translation-status: translated
-->


```tsx
infiniteQueryOptions({
  queryKey,
  ...options,
})
```

**选项**

通常你可以把传给 [`useInfiniteQuery`](../useInfiniteQuery.md) 的所有内容也传给 `infiniteQueryOptions`。某些选项在转发到 `queryClient.prefetchInfiniteQuery` 这类函数时不会生效，但 TypeScript 仍能接受这些多余属性。

- `queryKey: QueryKey`
  - **必填**
  - 用于生成选项的查询键。

更多信息见 [useInfiniteQuery](../useInfiniteQuery.md)。
