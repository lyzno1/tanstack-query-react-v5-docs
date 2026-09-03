---
id: AnyUseSuspenseInfiniteQueryOptions
title: AnyUseSuspenseInfiniteQueryOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/AnyUseSuspenseInfiniteQueryOptions.md
translation-source-ref: main
translation-source-hash: aa389e432053d3be2f6ec4b2abaad43d643fb53b6a4321917dd197dd099559d0
translation-status: translated
-->


```ts
type AnyUseSuspenseInfiniteQueryOptions = UseSuspenseInfiniteQueryOptions<any, any, any, any, any>;
```

定义于：[react-query/src/types.ts:266](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L266)

将 [UseSuspenseInfiniteQueryOptions](../interfaces/UseSuspenseInfiniteQueryOptions.md) 的所有类型参数设为 `any`。
当具体类型并不重要时很有用，例如在辅助函数中接收任意查询的选项。
