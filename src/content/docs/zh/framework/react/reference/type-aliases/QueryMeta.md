---
id: QueryMeta
title: QueryMeta
---


```ts
type QueryMeta = Register extends object ? TQueryMeta extends Record<string, unknown> ? TQueryMeta : Record<string, unknown> : Record<string, unknown>;
```

定义于： [packages/query-core/src/types.ts:260](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L260)

可附加到查询的 `meta` 对象类型，可从 `queryFn`、回调和缓存级处理函数中读取。默认为 `Record<string, unknown>`；可在 [Register](../interfaces/Register.md) 上声明 `queryMeta` 以收窄该类型。
