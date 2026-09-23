---
id: InfiniteQueryPageParamsOptions
title: InfiniteQueryPageParamsOptions
---


定义于： [packages/query-core/src/types.ts:406](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L406)

## 继承

- [`InitialPageParam`](InitialPageParam.md)\<`TPageParam`\>

## 由以下类型扩展

- [`InfiniteQueryObserverOptions`](InfiniteQueryObserverOptions.md)

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TPageParam

`TPageParam` = `unknown`

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="getnextpageparam"></a> `getNextPageParam` | (`lastPage`: `TQueryFnData`, `allPages`: `TQueryFnData`[], `lastPageParam`: `TPageParam`, `allPageParams`: `TPageParam`[]) => `TPageParam` \| `null` \| `undefined` | 可设置此函数，自动取得无限查询下一页的游标；其结果还用于判断 `hasNextPage`。 |
| <a id="getpreviouspageparam"></a> `getPreviousPageParam?` | (`firstPage`: `TQueryFnData`, `allPages`: `TQueryFnData`[], `firstPageParam`: `TPageParam`, `allPageParams`: `TPageParam`[]) => `TPageParam` \| `null` \| `undefined` | 可设置此函数，自动取得无限查询上一页的游标；其结果还用于判断 `hasPreviousPage`。 |
| <a id="initialpageparam"></a> `initialPageParam` | `TPageParam` | 无限查询尚无页面时使用的初始页参数。获取第一页时，它会作为 `pageParam` 传给 `queryFn`；之后每一页使用 `getNextPageParam` 或 `getPreviousPageParam` 返回的值。它只在查询还没有页面时生效：已有第一页后，重新获取会使用该页自己的参数。 |
