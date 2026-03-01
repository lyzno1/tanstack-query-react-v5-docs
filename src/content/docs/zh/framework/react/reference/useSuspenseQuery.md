---
id: useSuspenseQuery
title: useSuspenseQuery
---

<!--
translation-source-path: framework/react/reference/useSuspenseQuery.md
translation-source-ref: v5.90.3
translation-source-hash: b6a9a58bb2c5b10c0cfa8c0ffc6ed693f1ef00738624119e17e65c3df4ceaa72
translation-status: translated
-->


```tsx
const result = useSuspenseQuery(options)
```

**选项**

与 [useQuery](../useQuery.md) 相同，但不包括：

- `throwOnError`
- `enabled`
- `placeholderData`

**返回值**

返回对象与 [useQuery](../useQuery.md) 相同，但有以下差异：

- `data` 保证已定义
- 不包含 `isPlaceholderData`
- `status` 仅可能为 `success` 或 `error`
  - 对应的派生标志也会据此设置。

**注意事项**

[Cancellation](../../guides/query-cancellation.md) 不生效。
