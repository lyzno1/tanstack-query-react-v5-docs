---
id: DefaultError
title: DefaultError
---


```ts
type DefaultError = Register extends object ? TError : Error;
```

定义于： [packages/query-core/src/types.ts:68](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L68)

未显式指定错误类型参数时使用的错误类型。默认为 `Error`；可在 [Register](../interfaces/Register.md) 上声明 `defaultError`，统一修改该类型。
