---
id: ThrowOnError
title: ThrowOnError
---


```ts
type ThrowOnError<TQueryFnData, TError, TQueryData, TQueryKey> = 
  | boolean
  | (error: TError, query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean;
```

定义于： [packages/query-core/src/types.ts:423](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L423)

## 类型参数

### TQueryFnData

`TQueryFnData`

### TError

`TError`

### TQueryData

`TQueryData`

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](QueryKey.md)
