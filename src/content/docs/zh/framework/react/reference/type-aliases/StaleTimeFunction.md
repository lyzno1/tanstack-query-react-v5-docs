---
id: StaleTimeFunction
title: StaleTimeFunction
---


```ts
type StaleTimeFunction<TQueryFnData, TError, TData, TQueryKey> = 
  | number | "static"
  | (query: Query<TQueryFnData, TError, TData, TQueryKey>) => number | "static";
```

定义于： [packages/query-core/src/types.ts:140](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L140)

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)

### TData

`TData` = `TQueryFnData`

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](QueryKey.md) = [`QueryKey`](QueryKey.md)
