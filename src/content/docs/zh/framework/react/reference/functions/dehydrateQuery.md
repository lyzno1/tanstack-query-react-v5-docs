---
id: dehydrateQuery
title: dehydrateQuery
---


```ts
function dehydrateQuery(
   query: Query, 
   serializeData?: TransformerFn, 
   shouldRedactErrors?: (error: unknown) => boolean): DehydratedQuery;
```

定义于： [packages/query-core/src/hydration.ts:149](https://github.com/TanStack/query/blob/main/packages/query-core/src/hydration.ts#L149)

将单个 `Query` 转换为可序列化的 `DehydratedQuery` 快照。大多数查询配置（如 `queryFn`、`staleTime`）不会包含在快照中，而应在使用这些经过 dehydrate/hydrate 的数据时重新配置，通常在客户端使用 `useQuery`。若查询仍处于 `pending`，正在执行的 Promise 也会被包含，以便在另一端继续使用，而无需重新获取。

## 参数

### query

[`Query`](../classes/Query.md)

要执行 dehydrate 的查询。

### serializeData?

`TransformerFn`

可选的转换函数，在 `query.state.data` 写入快照前执行。

### shouldRedactErrors?

(`error`: `unknown`) => `boolean`

可选谓词；如果它对 Promise 拒绝时的错误返回 `false`，该错误会原样保留，而不会被遮蔽。

## 返回值

`DehydratedQuery`
