---
id: queryOptions
title: queryOptions
---

<!--
translation-source-path: framework/react/reference/queryOptions.md
translation-source-ref: v5.90.3
translation-source-hash: 6566582ce14963502fa9c88bed8fff2079256e85e27015d5f300718bc96a03b3
translation-status: translated
-->


```tsx
queryOptions({
  queryKey,
  ...options,
})
```

**选项**

通常你可以把传给 [`useQuery`](../useQuery.md) 的所有内容也传给 `queryOptions`。某些选项在转发到 `queryClient.prefetchQuery` 这类函数时不会生效，但 TypeScript 仍能接受这些多余属性。

- `queryKey: QueryKey`
  - **必填**
  - 用于生成选项的查询键。
- `experimental_prefetchInRender?: boolean`
  - 可选
  - 默认值为 `false`
  - 设为 `true` 时，查询会在渲染阶段预取，这在某些优化场景下很有用
  - 使用实验性的 `useQuery().promise` 功能时需要启用

[//]: # 'Materials'

## 延伸阅读

要进一步了解 `QueryOptions`，可查看社区资源中的 [The Query Options API](../../community/tkdodos-blog.md#24-the-query-options-api)。

[//]: # 'Materials'
