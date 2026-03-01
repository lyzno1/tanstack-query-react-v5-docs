---
id: useSuspenseInfiniteQuery
title: useSuspenseInfiniteQuery
---

<!--
translation-source-path: framework/react/reference/useSuspenseInfiniteQuery.md
translation-source-ref: v5.90.3
translation-source-hash: fe00e1c23f78f173ae76ddc3ce5ec6f6358c0431d0ba0abc6a266c7a6cd74bd8
translation-status: translated
-->


```tsx
const result = useSuspenseInfiniteQuery(options)
```

**选项**

与 [useInfiniteQuery](../useInfiniteQuery.md) 相同，但不包括：

- `suspense`
- `throwOnError`
- `enabled`
- `placeholderData`

**返回值**

返回对象与 [useInfiniteQuery](../useInfiniteQuery.md) 相同，但有以下差异：

- `data` 保证已定义
- 不包含 `isPlaceholderData`
- `status` 仅可能为 `success` 或 `error`
  - 对应的派生标志也会据此设置。

**注意事项**

[Cancellation](../../guides/query-cancellation.md) 不生效。
