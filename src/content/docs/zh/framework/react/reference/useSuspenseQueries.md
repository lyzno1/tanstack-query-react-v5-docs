---
id: useSuspenseQueries
title: useSuspenseQueries
---

<!--
translation-source-path: framework/react/reference/useSuspenseQueries.md
translation-source-ref: v5.90.3
translation-source-hash: f939a399b79d004dbc04ce0ff177ad3ca08e2fdbbdd2aff38cc9044a1a24e9a4
translation-status: translated
-->


```tsx
const result = useSuspenseQueries(options)
```

**选项**

与 [useQueries](../useQueries.md) 相同，但每个 `query` 不能包含：

- `suspense`
- `throwOnError`
- `enabled`
- `placeholderData`

**返回值**

返回结构与 [useQueries](../useQueries.md) 相同，但对每个 `query` 而言：

- `data` 保证已定义
- 不包含 `isPlaceholderData`
- `status` 仅可能为 `success` 或 `error`
  - 对应的派生标志也会据此设置。

**Caveats**

请注意，组件只有在**所有查询**都加载完成后才会重新挂载。因此，如果某个查询在等待所有查询完成期间变为过期，组件重新挂载时会再次获取。为避免此情况，请确保设置足够高的 `staleTime`。

[Cancellation](../../guides/query-cancellation.md) 不生效。
