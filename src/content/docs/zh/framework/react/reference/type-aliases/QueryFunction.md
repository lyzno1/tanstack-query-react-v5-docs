---
id: QueryFunction
title: QueryFunction
---


```ts
type QueryFunction<T, TQueryKey, TPageParam> = (context: QueryFunctionContext<TQueryKey, TPageParam>) => T | Promise<T>;
```

定义于： [packages/query-core/src/types.ts:130](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L130)

## 类型参数

### T

`T` = `unknown`

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](QueryKey.md) = [`QueryKey`](QueryKey.md)

### TPageParam

`TPageParam` = `never`

## 参数

### context

[`QueryFunctionContext`](QueryFunctionContext.md)\<`TQueryKey`, `TPageParam`\>

## 返回值

`T` \| `Promise`\<`T`\>
