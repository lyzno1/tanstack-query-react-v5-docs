---
id: matchMutation
title: matchMutation
---


```ts
function matchMutation(filters: MutationFilters, mutation: Mutation<any, any>): boolean;
```

定义于： [packages/query-core/src/utils.ts:237](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L237)

检查 mutation 是否符合给定的 [MutationFilters](../interfaces/MutationFilters.md)。所有已指定的条件都必须匹配；未指定的条件会被忽略。如果过滤条件包含 `mutationKey`，而 mutation 自身没有 `mutationKey`，则不会匹配。

## 参数

### filters

[`MutationFilters`](../interfaces/MutationFilters.md)

### mutation

[`Mutation`](../classes/Mutation.md)\<`any`, `any`\>

## 返回值

`boolean`

## 示例

```ts
const mutationCache = queryClient.getMutationCache()

const matchingMutations = mutationCache
  .getAll()
  .filter((mutation) => matchMutation({ mutationKey: ['addPost'] }, mutation))
```
