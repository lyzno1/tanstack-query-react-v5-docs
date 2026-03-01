---
id: useMutation
title: useMutation
---

<!--
translation-source-path: framework/react/reference/useMutation.md
translation-source-ref: v5.90.3
translation-source-hash: d8350e2e7a74cfa1bb154458ed955b05dda4be83f3067800797f1b9a9bc3c839
translation-status: translated
-->


```tsx
const {
  data,
  error,
  isError,
  isIdle,
  isPending,
  isPaused,
  isSuccess,
  failureCount,
  failureReason,
  mutate,
  mutateAsync,
  reset,
  status,
  submittedAt,
  variables,
} = useMutation(
  {
    mutationFn,
    gcTime,
    meta,
    mutationKey,
    networkMode,
    onError,
    onMutate,
    onSettled,
    onSuccess,
    retry,
    retryDelay,
    scope,
    throwOnError,
  },
  queryClient,
)

mutate(variables, {
  onError,
  onSettled,
  onSuccess,
})
```

**参数1（Options）**

- `mutationFn: (variables: TVariables, context: MutationFunctionContext) => Promise<TData>`
  - **必填，但仅在未定义默认 mutation 函数时**
  - 一个执行异步任务并返回 promise 的函数。
  - `variables` 是 `mutate` 会传给 `mutationFn` 的对象。
  - `context` 是 `mutate` 会传给 `mutationFn` 的对象，包含对 `QueryClient`、`mutationKey` 以及可选 `meta` 对象的引用。
- `gcTime: number | Infinity`
  - 未使用/非活跃的缓存数据在内存中保留的毫秒时间。当 mutation 的缓存变为未使用或非活跃后，这些缓存数据会在该时长后被垃圾回收。若指定了不同缓存时长，将使用最长的那个。
  - 设为 `Infinity` 可禁用垃圾回收。
  - 注意：允许的最大时间约为 [24 天](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value)，但可通过 [timeoutManager.setTimeoutProvider](../../../../reference/timeoutManager.md#timeoutmanagersettimeoutprovider) 绕过该限制。
- `mutationKey: unknown[]`
  - 可选
  - 可设置 mutation key，以继承 `queryClient.setMutationDefaults` 配置的默认值。
- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - 可选
  - 默认为 `'online'`
  - 更多信息见 [Network Mode](../../guides/network-mode.md)。
- `onMutate: (variables: TVariables) => Promise<TOnMutateResult | void> | TOnMutateResult | void`
  - 可选
  - 该函数会在 mutation 函数触发前执行，并接收与 mutation 函数相同的 variables。
  - 适合用于执行乐观更新，以期 mutation 成功。
  - 该函数返回的值会在 mutation 失败时传给 `onError` 与 `onSettled`，可用于回滚乐观更新。
- `onSuccess: (data: TData, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 该函数会在 mutation 成功时触发，并接收 mutation 的结果。
  - 若返回 promise，会在继续之前等待其完成。
- `onError: (err: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 该函数会在 mutation 出错时触发，并接收错误对象。
  - 若返回 promise，会在继续之前等待其完成。
- `onSettled: (data: TData, error: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 该函数会在 mutation 成功获取或发生错误后触发，并接收 data 或 error。
  - 若返回 promise，会在继续之前等待其完成。
- `retry: boolean | number | (failureCount: number, error: TError) => boolean`
  - 默认值为 `0`。
  - 若为 `false`，失败的 mutation 不会重试。
  - 若为 `true`，失败的 mutation 会无限重试。
  - 若设为 `number`（如 `3`），失败的 mutation 会重试直到失败次数达到该值。
- `retryDelay: number | (retryAttempt: number, error: TError) => number`
  - 该函数接收 `retryAttempt` 整数和实际 Error，并返回下一次尝试前要等待的毫秒数。
  - 如 `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` 可实现指数退避。
  - 如 `attempt => attempt * 1000` 可实现线性退避。
- `scope: { id: string }`
  - 可选
  - 默认为唯一 id（因此所有 mutation 默认并行执行）。
  - 具有相同 scope id 的 mutation 将串行执行。
- `throwOnError: undefined | boolean | (error: TError) => boolean`
  - 设为 `true` 时，mutation 错误会在渲染阶段抛出并传播到最近的错误边界。
  - 设为 `false` 可禁用向错误边界抛错的行为。
  - 若设为函数，会接收 error，并应返回布尔值，以决定是在错误边界中显示错误（`true`）还是将错误作为状态返回（`false`）。
- `meta: Record<string, unknown>`
  - 可选
  - 若设置，会在 mutation 缓存条目上存储额外信息，可按需使用。凡是能访问 `mutation` 的位置（如 `MutationCache` 的 `onError`、`onSuccess` 函数）都可读取该信息。

**参数2（QueryClient）**

- `queryClient?: QueryClient`
  - 使用此项可传入自定义 QueryClient。否则会使用最近上下文中的实例。

**返回值**

- `mutate: (variables: TVariables, { onSuccess, onSettled, onError }) => void`
  - 你可调用的 mutation 函数。它接收 variables 触发 mutation，并可额外传入回调选项。
  - `variables: TVariables`
    - 可选
    - 传给 `mutationFn` 的 variables 对象。
  - `onSuccess: (data: TData, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - 可选
    - 该函数会在 mutation 成功时触发，并接收 mutation 的结果。
    - 这是 void 函数，返回值会被忽略。
  - `onError: (err: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - 可选
    - 该函数会在 mutation 出错时触发，并接收错误对象。
    - 这是 void 函数，返回值会被忽略。
  - `onSettled: (data: TData | undefined, error: TError | null, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void`
    - 可选
    - 该函数会在 mutation 成功获取或发生错误后触发，并接收 data 或 error。
    - 这是 void 函数，返回值会被忽略。
  - 如果你发起了多次请求，`onSuccess` 只会在你最后一次调用后触发。
- `mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>`
  - 与 `mutate` 类似，但返回一个可 `await` 的 promise。
- `status: MutationStatus`
  - 可能为：
    - `idle`：mutation 函数执行前的初始状态。
    - `pending`：mutation 当前正在执行。
    - `error`：最近一次 mutation 尝试产生错误。
    - `success`：最近一次 mutation 尝试成功。
- `isIdle`、`isPending`、`isSuccess`、`isError`：从 `status` 派生的 boolean 变量
- `isPaused: boolean`
  - 若 mutation 处于 `paused`，则为 `true`。
  - 更多信息见 [Network Mode](../../guides/network-mode.md)。
- `data: undefined | unknown`
  - 默认值为 `undefined`
  - mutation 最近一次成功解析的数据。
- `error: null | TError`
  - 查询的错误对象（若发生错误）。
- `reset: () => void`
  - 用于清理 mutation 内部状态的函数（即将 mutation 重置为初始状态）。
- `failureCount: number`
  - mutation 的失败次数。
  - 每次 mutation 失败都会递增。
  - mutation 成功时重置为 `0`。
- `failureReason: null | TError`
  - mutation 重试失败的原因。
  - mutation 成功时重置为 `null`。
- `submittedAt: number`
  - mutation 提交时的时间戳。
  - 默认值为 `0`。
- `variables: undefined | TVariables`
  - 传给 `mutationFn` 的 `variables` 对象。
  - 默认值为 `undefined`。
