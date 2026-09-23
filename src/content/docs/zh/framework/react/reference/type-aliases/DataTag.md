---
id: DataTag
title: DataTag
---


```ts
type DataTag<TType, TValue, TError> = TType extends AnyDataTag ? TType : TType & object;
```

定义于： [packages/query-core/src/types.ts:98](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L98)

## 类型参数

### TType

`TType`

### TValue

`TValue`

### TError

`TError` = [`UnsetMarker`](UnsetMarker.md)
