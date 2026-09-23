---
id: MutationKey
title: MutationKey
---


```ts
type MutationKey = Register extends object ? TMutationKey extends ReadonlyArray<unknown> ? TMutationKey : TMutationKey extends unknown[] ? TMutationKey : ReadonlyArray<unknown> : ReadonlyArray<unknown>;
```

定义于： [packages/query-core/src/types.ts:1231](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1231)

mutation 键的类型：用于标识和过滤 mutation 的可序列化数组。默认为 `ReadonlyArray<unknown>`；可在 [Register](../interfaces/Register.md) 上声明 `mutationKey`，在整个项目中收窄该类型。
