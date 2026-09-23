---
id: DistributiveOmit
title: DistributiveOmit
---


```ts
type DistributiveOmit<TObject, TKey> = TObject extends any ? Omit<TObject, TKey> : never;
```

定义于： [packages/query-core/src/types.ts:14](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L14)

## 类型参数

### TObject

`TObject`

### TKey

`TKey` *extends* keyof `TObject`
