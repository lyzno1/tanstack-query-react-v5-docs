---
id: MutationObserverSuccessResult
title: MutationObserverSuccessResult
---


定义于： [packages/query-core/src/types.ts:1583](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1583)

存储在 `Mutation` 实例上的原始状态；观察者结果（如 `MutationObserverResult`）由此派生。

## 继承

- [`MutationObserverBaseResult`](MutationObserverBaseResult.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TVariables

`TVariables` = `void`

### TOnMutateResult

`TOnMutateResult` = `unknown`

## 属性

| 属性 | 类型 | 说明 | Overrides |
| ------ | ------ | ------ | ------ |
| <a id="context"></a> `context` | `TOnMutateResult` \| `undefined` | `onMutate` 定义后返回的值，作为 mutation 的上下文传给 `onSuccess`、`onError` 和 `onSettled`。 | - |
| <a id="data"></a> `data` | `TData` | mutation 最近一次成功返回的数据。 | [`MutationObserverBaseResult`](MutationObserverBaseResult.md).[`data`](MutationObserverBaseResult.md#data) |
| <a id="error"></a> `error` | `null` | mutation 出错时的错误对象；默认为 `null`。 | [`MutationObserverBaseResult`](MutationObserverBaseResult.md).[`error`](MutationObserverBaseResult.md#error) |
| <a id="failurecount"></a> `failureCount` | `number` | 本次尝试中 mutation 函数的失败次数。 | - |
| <a id="failurereason"></a> `failureReason` | `TError` \| `null` | 由重试器报告的本次尝试失败原因。 | - |
| <a id="iserror"></a> `isError` | `false` | 由 `status` 派生的布尔值；最近一次 mutation 尝试出错时为 `true`。 | [`MutationObserverBaseResult`](MutationObserverBaseResult.md).[`isError`](MutationObserverBaseResult.md#iserror) |
| <a id="isidle"></a> `isIdle` | `false` | 由 `status` 派生的布尔值；mutation 尚未执行且处于初始状态时为 `true`。 | [`MutationObserverBaseResult`](MutationObserverBaseResult.md).[`isIdle`](MutationObserverBaseResult.md#isidle) |
| <a id="ispaused"></a> `isPaused` | `boolean` | mutation 当前是否暂停（参见网络模式），或正在等待同一 `scope` 中的另一个 mutation 完成。 | - |
| <a id="ispending"></a> `isPending` | `false` | 由 `status` 派生的布尔值；mutation 正在执行时为 `true`。 | [`MutationObserverBaseResult`](MutationObserverBaseResult.md).[`isPending`](MutationObserverBaseResult.md#ispending) |
| <a id="issuccess"></a> `isSuccess` | `true` | 由 `status` 派生的布尔值；最近一次 mutation 尝试成功时为 `true`。 | [`MutationObserverBaseResult`](MutationObserverBaseResult.md).[`isSuccess`](MutationObserverBaseResult.md#issuccess) |
| <a id="mutate"></a> `mutate` | [`MutateFunction`](../type-aliases/MutateFunction.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\> | 调用 `mutate` 并传入变量以触发 mutation，也可传入额外的回调选项。**参数**：传给 `mutationFn` 的变量。**回调**：成功时调用 `onSuccess` 并传入结果；出错时调用 `onError` 并传入错误；结束时调用 `onSettled` 并传入数据或错误。**说明**：连续调用时，额外传入的 `onSuccess` 只对最后一次调用触发；这些回调均无返回值，返回的值会被忽略。 | - |
| <a id="reset"></a> `reset` | () => `void` | 清理 mutation 内部状态的函数，将其重置为初始状态。 | - |
| <a id="status"></a> `status` | `"success"` | mutation 的状态：`idle` 表示尚未执行 mutation 函数；`pending` 表示正在执行；`error` 表示最近一次尝试出错；`success` 表示最近一次尝试成功。 | [`MutationObserverBaseResult`](MutationObserverBaseResult.md).[`status`](MutationObserverBaseResult.md#status) |
| <a id="submittedat"></a> `submittedAt` | `number` | mutation 提交时的时间戳。 | - |
| <a id="variables"></a> `variables` | `TVariables` | 传给 `mutationFn` 的变量对象。 | [`MutationObserverBaseResult`](MutationObserverBaseResult.md).[`variables`](MutationObserverBaseResult.md#variables) |
