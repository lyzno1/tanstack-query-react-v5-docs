---
id: useIsRestoring
title: useIsRestoring
---

```ts
function useIsRestoring(): boolean;
```

定义于： [react-query/src/IsRestoringProvider.ts:13](https://github.com/TanStack/query/blob/main/packages/react-query/src/IsRestoringProvider.ts#L13)

如果正在使用 `PersistQueryClientProvider`，还可以配合 `useIsRestoring` Hook 检查恢复过程是否正在进行。
`useQuery` 等 API 也会在内部检查这一状态，以避免恢复过程与查询挂载之间出现竞态条件。

## 返回值

`boolean`

正在恢复持久化的客户端时为 `true`，否则为 `false`。
