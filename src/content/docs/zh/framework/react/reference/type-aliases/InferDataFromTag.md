---
id: InferDataFromTag
title: InferDataFromTag
---


```ts
type InferDataFromTag<TQueryFnData, TTaggedQueryKey> = TTaggedQueryKey extends DataTag<unknown, infer TaggedValue, unknown> ? TaggedValue : TQueryFnData;
```

定义于： [packages/query-core/src/types.ts:117](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L117)

## 类型参数

### TQueryFnData

`TQueryFnData`

### TTaggedQueryKey

`TTaggedQueryKey` *extends* [`QueryKey`](QueryKey.md)
