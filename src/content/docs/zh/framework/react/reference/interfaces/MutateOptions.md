---
id: MutateOptions
title: MutateOptions
---


定义于： [packages/query-core/src/types.ts:1404](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1404)

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TVariables

`TVariables` = `void`

### TOnMutateResult

`TOnMutateResult` = `unknown`

## 属性

| 属性 | 类型 |
| ------ | ------ |
| <a id="onerror"></a> `onError?` | (`error`: `TError`, `variables`: `TVariables`, `onMutateResult`: `TOnMutateResult` \| `undefined`, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `void` |
| <a id="onsettled"></a> `onSettled?` | (`data`: `TData` \| `undefined`, `error`: `TError` \| `null`, `variables`: `TVariables`, `onMutateResult`: `TOnMutateResult` \| `undefined`, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `void` |
| <a id="onsuccess"></a> `onSuccess?` | (`data`: `TData`, `variables`: `TVariables`, `onMutateResult`: `TOnMutateResult` \| `undefined`, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `void` |
