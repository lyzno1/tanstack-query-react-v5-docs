---
id: MutationScope
title: MutationScope
---


```ts
type MutationScope = object;
```

定义于： [packages/query-core/src/types.ts:1249](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1249)

将 mutation 分组，使组内的 mutation 串行而非并行执行。具有相同 `id` 的 mutation 会组成队列：当其中一个正在运行时，其余 mutation 会以 `isPaused: true` 状态等待，轮到它们时自动恢复。未设置 scope 的 mutation 始终并行执行。

## 属性

| 属性 | 类型 |
| ------ | ------ |
| <a id="id"></a> `id` | `string` |
