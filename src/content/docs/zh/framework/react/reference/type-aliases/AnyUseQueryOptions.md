---
id: AnyUseQueryOptions
title: AnyUseQueryOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/AnyUseQueryOptions.md
translation-source-ref: main
translation-source-hash: c194b57d2d218a4ff9200088639dc22277dcae061d64507735dbea84e0c44123
translation-status: translated
-->


```ts
type AnyUseQueryOptions = UseQueryOptions<any, any, any, any>;
```

定义于：[react-query/src/types.ts:154](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L154)

将 [UseQueryOptions](../interfaces/UseQueryOptions.md) 的所有类型参数设为 `any`。当具体类型并不重要时很有用，
例如在辅助函数中接收任意查询的选项。
