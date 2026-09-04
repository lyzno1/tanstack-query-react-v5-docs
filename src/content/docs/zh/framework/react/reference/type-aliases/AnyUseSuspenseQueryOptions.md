---
id: AnyUseSuspenseQueryOptions
title: AnyUseSuspenseQueryOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/AnyUseSuspenseQueryOptions.md
translation-source-ref: main
translation-source-hash: b622898e4b31b602f0ccec304604c49699405c8154556f0f9faed822debb2bad
translation-status: translated
-->


```ts
type AnyUseSuspenseQueryOptions = UseSuspenseQueryOptions<any, any, any, any>;
```

定义于：[react-query/src/types.ts:179](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L179)

将 [UseSuspenseQueryOptions](../interfaces/UseSuspenseQueryOptions.md) 的所有类型参数设为 `any`。当具体类型并不重要时很有用，
例如在辅助函数中接收任意查询的选项。
