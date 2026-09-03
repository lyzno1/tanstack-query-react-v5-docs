---
id: IsRestoringProvider
title: IsRestoringProvider
---

<!--
translation-source-path: framework/react/reference/variables/IsRestoringProvider.md
translation-source-ref: main
translation-source-hash: c78eaf029a8ac170aa556e68f4ef04d42f8d6168b726f00eb0bf3bcec779e982
translation-status: translated
-->


```ts
const IsRestoringProvider: Provider<boolean> = IsRestoringContext.Provider;
```

定义于：[react-query/src/IsRestoringProvider.ts:19](https://github.com/TanStack/query/blob/main/packages/react-query/src/IsRestoringProvider.ts#L19)

`PersistQueryClientProvider` 使用此 Provider 来标记持久化的客户端当前是否正在恢复，
`useIsRestoring` 会读取该状态。
