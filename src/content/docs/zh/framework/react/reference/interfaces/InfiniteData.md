---
id: InfiniteData
title: InfiniteData
---


定义于： [packages/query-core/src/types.ts:251](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L251)

无限查询的数据结构：包含目前已获取的每一页，以及获取每一页时使用的页参数。`pages` 与 `pageParams` 按索引对应；`pageParams[i]` 是产生 `pages[i]` 的参数。

## 类型参数

### TData

`TData`

### TPageParam

`TPageParam` = `unknown`

## 属性

| 属性 | 类型 |
| ------ | ------ |
| <a id="pageparams"></a> `pageParams` | `TPageParam`[] |
| <a id="pages"></a> `pages` | `TData`[] |
