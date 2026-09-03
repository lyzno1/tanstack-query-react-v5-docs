---
id: AnyUseBaseQueryOptions
title: AnyUseBaseQueryOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/AnyUseBaseQueryOptions.md
translation-source-ref: main
translation-source-hash: a77ceda37a42bfb34a023df09a64b2483ae6de1726ff72caf97215882ff43925
translation-status: translated
-->


```ts
type AnyUseBaseQueryOptions = UseBaseQueryOptions<any, any, any, any, any>;
```

定义于：[react-query/src/types.ts:28](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L28)

将 [UseBaseQueryOptions](../interfaces/UseBaseQueryOptions.md) 的所有类型参数设为 `any`。当具体类型并不重要时很有用，
例如在辅助函数中接收任意查询的选项。
