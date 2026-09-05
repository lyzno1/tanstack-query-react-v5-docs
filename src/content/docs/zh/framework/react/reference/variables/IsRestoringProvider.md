---
id: IsRestoringProvider
title: IsRestoringProvider
---

```ts
const IsRestoringProvider: Provider<boolean> = IsRestoringContext.Provider;
```

定义于：[react-query/src/IsRestoringProvider.ts:19](https://github.com/TanStack/query/blob/main/packages/react-query/src/IsRestoringProvider.ts#L19)

`PersistQueryClientProvider` 使用此 Provider 来标记持久化的客户端当前是否正在恢复，
`useIsRestoring` 会读取该状态。
