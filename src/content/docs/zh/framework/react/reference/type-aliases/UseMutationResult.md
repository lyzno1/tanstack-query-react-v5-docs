---
id: UseMutationResult
title: UseMutationResult
---

```ts
type UseMutationResult<TData, TError, TVariables, TOnMutateResult> = UseBaseMutationResult<TData, TError, TVariables, TOnMutateResult>;
```

定义于： [packages/react-query/src/types.ts:501](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L501)

`useMutation` 的结果。与 [UseBaseMutationResult](UseBaseMutationResult.md) 相同。

## 类型参数

### TData

`TData` = `unknown`

mutation 函数 resolve 后得到的值的类型。

### TError

`TError` = [`DefaultError`](DefaultError.md)

mutation 函数可能抛出的错误类型。

### TVariables

`TVariables` = `unknown`

传给 `mutate`/`mutateAsync` 的变量类型。

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` 的返回值类型。该值会作为 `onMutateResult` 参数传给
`onSuccess`/`onError`/`onSettled`，可用于保存乐观更新的回滚数据。
