---
id: GetPreviousPageParamFunction
title: GetPreviousPageParamFunction
---


```ts
type GetPreviousPageParamFunction<TPageParam, TQueryFnData> = (firstPage: TQueryFnData, allPages: TQueryFnData[], firstPageParam: TPageParam, allPageParams: TPageParam[]) => TPageParam | undefined | null;
```

定义于： [packages/query-core/src/types.ts:232](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L232)

## 类型参数

### TPageParam

`TPageParam`

### TQueryFnData

`TQueryFnData` = `unknown`

## 参数

### firstPage

`TQueryFnData`

### allPages

`TQueryFnData`[]

### firstPageParam

`TPageParam`

### allPageParams

`TPageParam`[]

## 返回值

`TPageParam` \| `undefined` \| `null`
