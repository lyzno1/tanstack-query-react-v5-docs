---
id: AnyUseMutationOptions
title: AnyUseMutationOptions
---

```ts
type AnyUseMutationOptions = UseMutationOptions<any, any, any, any>;
```

定义于： [packages/react-query/src/types.ts:402](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L402)

将 [UseMutationOptions](../interfaces/UseMutationOptions.md) 的所有类型参数设为 `any`。当具体类型并不重要时很有用，
例如在辅助函数中接收任意 mutation 的选项。
