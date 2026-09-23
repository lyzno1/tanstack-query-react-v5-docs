---
id: QueryKeyWithDataTag
title: QueryKeyWithDataTag
---


```ts
type QueryKeyWithDataTag<TQueryKey, TQueryFnData, TError> = object;
```

定义于： [packages/query-core/src/types.ts:109](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L109)

## 类型参数

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](QueryKey.md) = [`QueryKey`](QueryKey.md)

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)

## 属性

| 属性 | 类型 |
| ------ | ------ |
| <a id="querykey"></a> `queryKey` | [`DataTag`](DataTag.md)\<`TQueryKey`, `TQueryFnData`, `TError`\> |
