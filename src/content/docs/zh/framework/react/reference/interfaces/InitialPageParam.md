---
id: InitialPageParam
title: InitialPageParam
---


定义于： [packages/query-core/src/types.ts:395](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L395)

## 由以下类型扩展

- [`InfiniteQueryPageParamsOptions`](InfiniteQueryPageParamsOptions.md)

## 类型参数

### TPageParam

`TPageParam` = `unknown`

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="initialpageparam"></a> `initialPageParam` | `TPageParam` | 无限查询尚无页面时使用的初始页参数。获取第一页时，它会作为 `pageParam` 传给 `queryFn`；之后每一页使用 `getNextPageParam` 或 `getPreviousPageParam` 返回的值。它只在查询还没有页面时生效：已有第一页后，重新获取会使用该页自己的参数。 |
