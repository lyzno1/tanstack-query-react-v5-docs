---
id: AnyUseInfiniteQueryOptions
title: AnyUseInfiniteQueryOptions
---

```ts
type AnyUseInfiniteQueryOptions = UseInfiniteQueryOptions<any, any, any, any, any>;
```

定义于：[react-query/src/types.ts:219](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L219)

将 [UseInfiniteQueryOptions](../interfaces/UseInfiniteQueryOptions.md) 的所有类型参数设为 `any`。当具体类型并不重要时很有用，
例如在辅助函数中接收任意查询的选项。
