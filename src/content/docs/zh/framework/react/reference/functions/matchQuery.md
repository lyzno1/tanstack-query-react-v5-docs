---
id: matchQuery
title: matchQuery
---


```ts
function matchQuery(filters: QueryFilters, query: Query<any, any, any, any>): boolean;
```

定义于： [packages/query-core/src/utils.ts:175](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L175)

检查查询是否符合给定的 [QueryFilters](../interfaces/QueryFilters.md)。所有已指定的过滤条件都必须匹配；未指定的条件会被忽略。

## 参数

### filters

[`QueryFilters`](../interfaces/QueryFilters.md)

### query

[`Query`](../classes/Query.md)\<`any`, `any`, `any`, `any`\>

## 返回值

`boolean`

## 示例

```ts
const queryCache = queryClient.getQueryCache()

const matchingQueries = queryCache
  .getAll()
  .filter((query) => matchQuery({ queryKey: ['posts'] }, query))
```
