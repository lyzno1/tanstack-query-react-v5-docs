---
id: MutateFunctionRest
title: MutateFunctionRest
---


```ts
type MutateFunctionRest<TData, TError, TVariables, TOnMutateResult> = undefined extends TVariables ? [TVariables, MutateOptions<TData, TError, TVariables, TOnMutateResult>] : [TVariables, MutateOptions<TData, TError, TVariables, TOnMutateResult>];
```

定义于： [packages/query-core/src/types.ts:1431](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1431)

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)

### TVariables

`TVariables` = `void`

### TOnMutateResult

`TOnMutateResult` = `unknown`
