---
id: PlaceholderDataFunction
title: PlaceholderDataFunction
---


```ts
type PlaceholderDataFunction<TQueryFnData, TError, TQueryData, TQueryKey> = (previousData: TQueryData | undefined, previousQuery: 
  | Query<TQueryFnData, TError, TQueryData, TQueryKey>
  | undefined) => TQueryData | undefined;
```

定义于： [packages/query-core/src/types.ts:211](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L211)

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)

### TQueryData

`TQueryData` = `TQueryFnData`

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](QueryKey.md) = [`QueryKey`](QueryKey.md)

## 参数

### previousData

`TQueryData` | `undefined`

### previousQuery

[`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, `TQueryData`, `TQueryKey`\> | `undefined`

## 返回值

`TQueryData` \| `undefined`
