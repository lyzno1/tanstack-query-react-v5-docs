---
id: QueryKey
title: QueryKey
---


```ts
type QueryKey = Register extends object ? TQueryKey extends ReadonlyArray<unknown> ? TQueryKey : TQueryKey extends unknown[] ? TQueryKey : ReadonlyArray<unknown> : ReadonlyArray<unknown>;
```

定义于： [packages/query-core/src/types.ts:78](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L78)

查询键的类型：用于标识缓存中查询的可序列化数组。默认为 `ReadonlyArray<unknown>`；可在 [Register](../interfaces/Register.md) 上声明 `queryKey`，在整个项目中收窄该类型。
