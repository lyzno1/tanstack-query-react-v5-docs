---
id: QueryFunctionContext
title: QueryFunctionContext
---


```ts
type QueryFunctionContext<TQueryKey, TPageParam> = [TPageParam] extends [never] ? object : object;
```

定义于： [packages/query-core/src/types.ts:176](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L176)

## 类型参数

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](QueryKey.md) = [`QueryKey`](QueryKey.md)

### TPageParam

`TPageParam` = `never`
