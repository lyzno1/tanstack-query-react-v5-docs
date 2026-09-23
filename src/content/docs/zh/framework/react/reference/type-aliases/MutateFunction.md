---
id: MutateFunction
title: MutateFunction
---


```ts
type MutateFunction<TData, TError, TVariables, TOnMutateResult> = (...rest: MutateFunctionRest<TData, TError, TVariables, TOnMutateResult>) => Promise<TData>;
```

定义于： [packages/query-core/src/types.ts:1446](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1446)

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)

### TVariables

`TVariables` = `void`

### TOnMutateResult

`TOnMutateResult` = `unknown`

## 参数

### rest

...[`MutateFunctionRest`](MutateFunctionRest.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

## 返回值

`Promise`\<`TData`\>
