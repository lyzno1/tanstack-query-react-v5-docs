---
id: EnsureInfiniteQueryDataOptions
title: EnsureInfiniteQueryDataOptions
---


```ts
type EnsureInfiniteQueryDataOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object;
```

定义于： [packages/query-core/src/types.ts:690](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L690)

## 类型声明

### ~~revalidateIfStale?~~

```ts
optional revalidateIfStale: boolean;
```

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)

### TData

`TData` = `TQueryFnData`

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](QueryKey.md) = [`QueryKey`](QueryKey.md)

### TPageParam

`TPageParam` = `unknown`

## 已弃用
