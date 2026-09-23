---
id: MutationMeta
title: MutationMeta
---


```ts
type MutationMeta = Register extends object ? TMutationMeta extends Record<string, unknown> ? TMutationMeta : Record<string, unknown> : Record<string, unknown>;
```

定义于： [packages/query-core/src/types.ts:1257](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1257)

可附加到 mutation 的 `meta` 对象类型，可从 `mutationFn`、回调和缓存级处理函数中读取。默认为 `Record<string, unknown>`；可在 [Register](../interfaces/Register.md) 上声明 `mutationMeta` 以收窄该类型。
