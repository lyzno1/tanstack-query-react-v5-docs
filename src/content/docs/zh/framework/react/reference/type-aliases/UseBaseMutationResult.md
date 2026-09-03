---
id: UseBaseMutationResult
title: UseBaseMutationResult
---

<!--
translation-source-path: framework/react/reference/type-aliases/UseBaseMutationResult.md
translation-source-ref: main
translation-source-hash: c93dee01dbb5e624f59da77aae9aab256b18d1704c8737f1cd5da9e0008a8d6c
translation-status: translated
-->


```ts
type UseBaseMutationResult<TData, TError, TVariables, TOnMutateResult> = Override<MutationObserverResult<TData, TError, TVariables, TOnMutateResult>, {
  mutate: UseMutateFunction<TData, TError, TVariables, TOnMutateResult>;
}> & object;
```

定义于：[react-query/src/types.ts:471](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L471)

`useMutation` 的结果。它与 `@tanstack/query-core` 中的 `MutationObserverResult` 相同，但将
`mutate` 收窄为只触发、不等待结果的 [UseMutateFunction](UseMutateFunction.md) 签名，并额外添加了 `mutateAsync`。

## 类型声明

### mutateAsync

```ts
mutateAsync: UseMutateAsyncFunction<TData, TError, TVariables, TOnMutateResult>;
```

与 `mutate` 类似，但会返回一个可供 `await` 等待的 promise。

## 类型参数

### TData

`TData` = `unknown`

变更函数 resolve 后得到的值的类型。

### TError

`TError` = `DefaultError`

变更函数可能抛出的错误类型。

### TVariables

`TVariables` = `unknown`

传给 `mutate`/`mutateAsync` 的变量类型。

### TOnMutateResult

`TOnMutateResult` = `unknown`

`onMutate` 的返回值类型。该值会作为 `onMutateResult` 参数传给
`onSuccess`/`onError`/`onSettled`，可用于保存乐观更新的回滚数据。
