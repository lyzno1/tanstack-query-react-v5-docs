---
id: AnyUseMutationOptions
title: AnyUseMutationOptions
---

```ts
type AnyUseMutationOptions = UseMutationOptions<any, any, any, any>;
```

定义于：[react-query/src/types.ts:401](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L401)

将 [UseMutationOptions](../interfaces/UseMutationOptions.md) 的所有类型参数设为 `any`。当具体类型并不重要时很有用，
例如在辅助函数中接收任意变更的选项。
