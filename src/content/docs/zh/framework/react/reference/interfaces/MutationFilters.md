---
id: MutationFilters
title: MutationFilters
---


定义于： [packages/query-core/src/utils.ts:64](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L64)

用于筛选 mutation 的过滤条件，例如传给 `mutationCache.findAll` 或 `queryClient.isMutating`。所有提供的条件都必须匹配；未指定的条件会被忽略。

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TVariables

`TVariables` = `unknown`

### TOnMutateResult

`TOnMutateResult` = `unknown`

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="exact"></a> `exact?` | `boolean` | 精确匹配 mutation 键 |
| <a id="mutationkey"></a> `mutationKey?` | readonly `unknown`[] | 包含匹配此 mutation 键的 mutation |
| <a id="predicate"></a> `predicate?` | (`mutation`: [`Mutation`](../classes/Mutation.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>) => `boolean` | 包含符合此谓词函数的 mutation |
| <a id="status"></a> `status?` | `"error"` \| `"pending"` \| `"success"` \| `"idle"` | 按 mutation 状态过滤 |
