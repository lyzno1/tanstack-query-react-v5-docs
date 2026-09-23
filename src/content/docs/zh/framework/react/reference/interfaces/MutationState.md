---
id: MutationState
title: MutationState
---


定义于： [packages/query-core/src/mutation.ts:30](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L30)

存储在 `Mutation` 实例上的原始状态；观察者结果（如 `MutationObserverResult`）由此派生。

## 由以下类型扩展

- [`MutationObserverBaseResult`](MutationObserverBaseResult.md)

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TVariables

`TVariables` = `unknown`

### TOnMutateResult

`TOnMutateResult` = `unknown`

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="context"></a> `context` | `TOnMutateResult` \| `undefined` | `onMutate` 定义后返回的值，作为 mutation 的上下文传给 `onSuccess`、`onError` 和 `onSettled`。 |
| <a id="data"></a> `data` | `TData` \| `undefined` | mutation 最近一次成功返回的数据。 |
| <a id="error"></a> `error` | `TError` \| `null` | 如果最近一次尝试出错，记录 mutation 的错误对象；默认为 `null`。 |
| <a id="failurecount"></a> `failureCount` | `number` | 本次尝试中 mutation 函数的失败次数。 |
| <a id="failurereason"></a> `failureReason` | `TError` \| `null` | 由重试器报告的本次尝试失败原因。 |
| <a id="ispaused"></a> `isPaused` | `boolean` | mutation 当前是否暂停（参见网络模式），或正在等待同一 `scope` 中的另一个 mutation 完成。 |
| <a id="status"></a> `status` | `"error"` \| `"pending"` \| `"success"` \| `"idle"` | mutation 的状态。 |
| <a id="submittedat"></a> `submittedAt` | `number` | mutation 提交时的时间戳。 |
| <a id="variables"></a> `variables` | `TVariables` \| `undefined` | 最近一次调用 mutation 时传入的变量。 |
