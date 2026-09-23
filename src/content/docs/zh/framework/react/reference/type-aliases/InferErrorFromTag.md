---
id: InferErrorFromTag
title: InferErrorFromTag
---


```ts
type InferErrorFromTag<TError, TTaggedQueryKey> = TTaggedQueryKey extends DataTag<unknown, unknown, infer TaggedError> ? TaggedError extends UnsetMarker ? TError : TaggedError : TError;
```

定义于： [packages/query-core/src/types.ts:122](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L122)

## 类型参数

### TError

`TError`

### TTaggedQueryKey

`TTaggedQueryKey` *extends* [`QueryKey`](QueryKey.md)
