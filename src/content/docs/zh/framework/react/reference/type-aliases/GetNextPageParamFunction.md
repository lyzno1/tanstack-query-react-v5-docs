---
id: GetNextPageParamFunction
title: GetNextPageParamFunction
---


```ts
type GetNextPageParamFunction<TPageParam, TQueryFnData> = (lastPage: TQueryFnData, allPages: TQueryFnData[], lastPageParam: TPageParam, allPageParams: TPageParam[]) => TPageParam | undefined | null;
```

定义于： [packages/query-core/src/types.ts:240](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L240)

## 类型参数

### TPageParam

`TPageParam`

### TQueryFnData

`TQueryFnData` = `unknown`

## 参数

### lastPage

`TQueryFnData`

### allPages

`TQueryFnData`[]

### lastPageParam

`TPageParam`

### allPageParams

`TPageParam`[]

## 返回值

`TPageParam` \| `undefined` \| `null`
