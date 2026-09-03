---
id: UseMutateFunction
title: UseMutateFunction
---

<!--
translation-source-path: framework/react/reference/type-aliases/UseMutateFunction.md
translation-source-ref: main
translation-source-hash: c0205e05550fe8fc1aa617a341d0d56d1f752b49acb9dae3742be085095ad424
translation-status: translated
-->


```ts
type UseMutateFunction<TData, TError, TVariables, TOnMutateResult> = (...args) => void;
```

定义于：[react-query/src/types.ts:433](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L433)

`useMutation` 所返回的 `mutate` 的类型。它会将变量（以及每次调用时可选的
`onSuccess`/`onError`/`onSettled`）转发给底层 `mutate` 调用。调用只负责触发变更，不等待结果——
错误会通过变更结果呈现，而不会被抛出。

## 类型参数

### TData

`TData` = `unknown`

变更函数 resolve 后得到的值的类型。

### TError

`TError` = `DefaultError`

变更函数可能抛出的错误类型。

### TVariables

`TVariables` = `void`

传给 `mutate` 的变量类型。

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` 的返回值类型。该值会作为 `onMutateResult` 参数传给
`onSuccess`/`onError`/`onSettled`，可用于保存乐观更新的回滚数据。

## 参数

### args

...`Parameters`\<`MutateFunction`\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>\>

## 返回值

`void`
