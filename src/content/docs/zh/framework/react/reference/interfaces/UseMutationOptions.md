---
id: UseMutationOptions
title: UseMutationOptions
---

<!--
translation-source-path: framework/react/reference/interfaces/UseMutationOptions.md
translation-source-ref: main
translation-source-hash: e4ec45173ee97e6f9840dcd56e114fc51f1883e5be258c2a66830a7e2c4e4de8
translation-status: translated
-->


定义于：[react-query/src/types.ts:412](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L412)

`useMutation` 接受的选项。它与 `@tanstack/query-core` 中的 `MutationObserverOptions` 相同，
但移除了内部使用的 `_defaulted` 标记。

## 扩展

- `OmitKeyof`\<`MutationObserverOptions`\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"_defaulted"`\>

## 类型参数

### TData

`TData` = `unknown`

变更函数所解析出的数据类型。

### TError

`TError` = `DefaultError`

变更函数可能抛出的错误类型。

### TVariables

`TVariables` = `void`

传给 `mutate`/`mutateAsync` 的变量类型。

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` 返回值的类型。该值会作为 `onMutateResult` 参数传给
`onSuccess`/`onError`/`onSettled`，可用于保存乐观更新的回滚数据。
