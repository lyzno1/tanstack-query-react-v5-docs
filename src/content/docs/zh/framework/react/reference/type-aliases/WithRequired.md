---
id: WithRequired
title: WithRequired
---


```ts
type WithRequired<TTarget, TKey> = TTarget & { [_ in TKey]: {} };
```

定义于： [packages/query-core/src/types.ts:579](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L579)

## 类型参数

### TTarget

`TTarget`

### TKey

`TKey` *extends* keyof `TTarget`
