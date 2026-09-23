---
id: MutationFunction
title: MutationFunction
---


```ts
type MutationFunction<TData, TVariables> = (variables: TVariables, context: MutationFunctionContext) => Promise<TData>;
```

定义于： [packages/query-core/src/types.ts:1272](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1272)

## 类型参数

### TData

`TData` = `unknown`

### TVariables

`TVariables` = `unknown`

## 参数

### variables

`TVariables`

### context

[`MutationFunctionContext`](MutationFunctionContext.md)

## 返回值

`Promise`\<`TData`\>
