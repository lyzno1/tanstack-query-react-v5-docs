---
id: MutationOptions
title: MutationOptions
---


定义于： [packages/query-core/src/types.ts:1277](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1277)

## 由以下类型扩展

- [`MutationObserverOptions`](MutationObserverOptions.md)

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

| 属性 | 类型 | 默认值 | 说明 |
| ------ | ------ | ------ | ------ |
| <a id="gctime"></a> `gcTime?` | `number` | `undefined` | 未使用或非活跃的 mutation 在内存中保留多少毫秒后进行垃圾回收；默认为 `5 * 60 * 1000`（5 分钟），SSR 期间为 `Infinity`。 |
| <a id="meta"></a> `meta?` | `Record`\<`string`, `unknown`\> | `undefined` | 存储在 mutation 缓存条目上的附加信息。在可访问该 mutation 的位置均可读取，例如 `MutationCache` 的 `onError` 和 `onSuccess` 回调。 |
| <a id="mutationfn"></a> `mutationFn?` | (`variables`: `TVariables`, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `Promise`\<`TData`\> | `undefined` | 执行此 mutation 异步任务的函数。除非通过 `queryClient.setMutationDefaults` 为匹配的 `mutationKey` 设置了默认函数，否则必填。接收传给 `mutate` 的 `variables`，以及包含 `QueryClient`、`mutationKey` 和 `meta` 的 [MutationFunctionContext](../type-aliases/MutationFunctionContext.md)。必须返回一个解析为 mutation 数据的 Promise。 |
| <a id="mutationkey"></a> `mutationKey?` | readonly `unknown`[] | `undefined` | 此 mutation 的键。可选，但若要继承 `queryClient.setMutationDefaults` 注册的默认选项，或用 `useMutationState`、`queryClient.isMutating` 匹配此 mutation，则必须设置。 |
| <a id="networkmode"></a> `networkMode?` | `"online"` \| `"always"` \| `"offlineFirst"` | `'online'` | 根据当前网络连接状态，控制 mutation 是否可以运行。详情参阅[网络模式](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode)。 |
| <a id="onerror"></a> `onError?` | (`error`: `TError`, `variables`: `TVariables`, `onMutateResult`: `TOnMutateResult` \| `undefined`, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `unknown` | `undefined` | mutation 出错时触发并接收错误。若返回 Promise，会在执行 `onSettled` 前等待其完成。 |
| <a id="onmutate"></a> `onMutate?` | (`variables`: `TVariables`, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `TOnMutateResult` \| `Promise`\<`TOnMutateResult`\> | `undefined` | mutation 函数运行前触发，接收相同的变量。可用于预计 mutation 会成功而先执行的乐观更新。返回值作为 `onMutateResult` 传给 `onSuccess`、`onError` 和 `onSettled`，通常在这里回滚乐观更新。若返回 Promise，会在运行 mutation 函数前等待其完成。 |
| <a id="onsettled"></a> `onSettled?` | (`data`: `TData` \| `undefined`, `error`: `TError` \| `null`, `variables`: `TVariables`, `onMutateResult`: `TOnMutateResult` \| `undefined`, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `unknown` | `undefined` | mutation 成功或出错后触发，接收数据或错误。若返回 Promise，会在将 mutation 标记为结束前等待其完成。 |
| <a id="onsuccess"></a> `onSuccess?` | (`data`: `TData`, `variables`: `TVariables`, `onMutateResult`: `TOnMutateResult`, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `unknown` | `undefined` | mutation 成功后触发，接收 mutation 结果。若返回 Promise，会在执行 `onSettled` 前等待其完成。 |
| <a id="retry"></a> `retry?` | \| `number` \| `false` \| `true` \| (`failureCount`: `number`, `error`: `TError`) => `boolean` | `0` | 设为 `false` 时，mutation 失败后默认不重试；设为 `true` 时无限重试；设为整数（如 `3`）时，失败次数达到该值后停止重试；设为函数 `(failureCount, error) => boolean` 时，重试直到函数返回 `false`。 |
| <a id="retrydelay"></a> `retryDelay?` | `number` \| (`failureCount`: `number`, `error`: `TError`) => `number` | `undefined` | 此函数接收重试次数 `retryAttempt` 和实际错误，返回下次重试前等待的毫秒数。例如 `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` 实现指数退避，`attempt => attempt * 1000` 实现线性退避。默认采用指数退避，最长等待 30 秒。 |
| <a id="scope"></a> `scope?` | [`MutationScope`](../type-aliases/MutationScope.md) | `undefined` | 控制此 mutation 与其他 mutation 并行运行还是排队等待。相同 `scope.id` 的 mutation 按触发顺序串行执行；未设置 scope 时，mutation 触发后立即运行。 |
