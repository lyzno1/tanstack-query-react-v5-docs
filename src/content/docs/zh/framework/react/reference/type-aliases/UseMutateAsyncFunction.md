---
id: UseMutateAsyncFunction
title: UseMutateAsyncFunction
---

```ts
type UseMutateAsyncFunction<TData, TError, TVariables, TOnMutateResult> = MutateFunction<TData, TError, TVariables, TOnMutateResult>;
```

定义于：[react-query/src/types.ts:454](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L454)

`useMutation` 所返回的 `mutateAsync` 的类型。它与 [UseMutateFunction](UseMutateFunction.md) 类似，
但会返回一个可供 `await` 等待的 promise。

## 类型参数

### TData

`TData` = `unknown`

变更函数 resolve 后得到的值的类型。

### TError

`TError` = `DefaultError`

变更函数可能抛出的错误类型。

### TVariables

`TVariables` = `void`

传给 `mutateAsync` 的变量类型。

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` 的返回值类型。该值会作为 `onMutateResult` 参数传给
`onSuccess`/`onError`/`onSettled`，可用于保存乐观更新的回滚数据。
