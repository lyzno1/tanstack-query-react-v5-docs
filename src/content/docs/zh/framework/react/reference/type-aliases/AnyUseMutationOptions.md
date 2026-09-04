---
id: AnyUseMutationOptions
title: AnyUseMutationOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/AnyUseMutationOptions.md
translation-source-ref: main
translation-source-hash: 2aec0afece0bd41296fa9991cbf065a8e8a42c406554bff1eb8118f0c3adfd45
translation-status: translated
-->


```ts
type AnyUseMutationOptions = UseMutationOptions<any, any, any, any>;
```

定义于：[react-query/src/types.ts:401](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L401)

将 [UseMutationOptions](../interfaces/UseMutationOptions.md) 的所有类型参数设为 `any`。当具体类型并不重要时很有用，
例如在辅助函数中接收任意变更的选项。
