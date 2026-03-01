---
id: useQuery
title: useQuery
---

<!--
translation-source-path: framework/react/reference/useQuery.md
translation-source-ref: v5.90.3
translation-source-hash: 92cbc1f9cabb80891d6cf0500e386a578326675ca84b820e4b974fd5b19d30d4
translation-status: translated
-->


```tsx
const {
  data,
  dataUpdatedAt,
  error,
  errorUpdatedAt,
  failureCount,
  failureReason,
  fetchStatus,
  isError,
  isFetched,
  isFetchedAfterMount,
  isFetching,
  isInitialLoading,
  isLoading,
  isLoadingError,
  isPaused,
  isPending,
  isPlaceholderData,
  isRefetchError,
  isRefetching,
  isStale,
  isSuccess,
  isEnabled,
  promise,
  refetch,
  status,
} = useQuery(
  {
    queryKey,
    queryFn,
    gcTime,
    enabled,
    networkMode,
    initialData,
    initialDataUpdatedAt,
    meta,
    notifyOnChangeProps,
    placeholderData,
    queryKeyHashFn,
    refetchInterval,
    refetchIntervalInBackground,
    refetchOnMount,
    refetchOnReconnect,
    refetchOnWindowFocus,
    retry,
    retryOnMount,
    retryDelay,
    select,
    staleTime,
    structuralSharing,
    subscribed,
    throwOnError,
  },
  queryClient,
)
```

**参数1（Options）**

- `queryKey: unknown[]`
  - **必填**
  - 用于该查询的查询键。
  - 查询键会被哈希为稳定哈希值。更多信息见 [Query Keys](../../guides/query-keys.md)。
  - 当此键变化时，查询会自动更新（前提是 `enabled` 不为 `false`）。
- `queryFn: (context: QueryFunctionContext) => Promise<TData>`
  - **必填，但仅在未定义默认查询函数时**。更多信息见 [Default Query Function](../../guides/default-query-function.md)。
  - 查询用来请求数据的函数。
  - 会接收一个 [QueryFunctionContext](../../guides/query-functions.md#queryfunctioncontext)。
  - 必须返回一个 promise：要么 resolve 数据，要么抛出错误。数据不能为 `undefined`。
- `enabled: boolean | (query: Query) => boolean`
  - 设为 `false` 可禁用该查询的自动运行。
  - 可用于[依赖查询](../../guides/dependent-queries.md)。
- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - 可选
  - 默认为 `'online'`
  - 更多信息见 [Network Mode](../../guides/network-mode.md)。
- `retry: boolean | number | (failureCount: number, error: TError) => boolean`
  - 若为 `false`，失败查询默认不重试。
  - 若为 `true`，失败查询会无限重试。
  - 若设为 `number`（如 `3`），失败查询会重试直到失败次数达到该值。
  - 客户端默认 `3`，服务端默认 `0`。
- `retryOnMount: boolean`
  - 若设为 `false`，当查询包含错误时，挂载时不会重试。默认值是 `true`。
- `retryDelay: number | (retryAttempt: number, error: TError) => number`
  - 该函数接收 `retryAttempt` 整数和实际 Error，并返回下一次尝试前要等待的毫秒数。
  - 如 `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` 可实现指数退避。
  - 如 `attempt => attempt * 1000` 可实现线性退避。
- `staleTime: number | 'static' | ((query: Query) => number | 'static')`
  - 可选
  - 默认值为 `0`
  - 数据被视为过期前的毫秒时间。该值仅作用于定义它的这个 Hook。
  - 若设为 `Infinity`，数据不会被视为过期，除非手动失效。
  - 若设为函数，会以 query 为参数执行该函数来计算 `staleTime`。
  - 若设为 `'static'`，数据永远不会被视为过期。
- `gcTime: number | Infinity`
  - 默认值为 `5 * 60 * 1000`（5 分钟），SSR 期间为 `Infinity`。
  - 未使用/非活跃的缓存数据在内存中保留的毫秒时间。当查询缓存变为未使用或非活跃后，这些缓存数据会在该时长后被垃圾回收。若指定了不同垃圾回收时长，将使用最长的那个。
  - 注意：允许的最大时间约为 [24 天](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value)，但可通过 [timeoutManager.setTimeoutProvider](../../../../reference/timeoutManager.md#timeoutmanagersettimeoutprovider) 绕过该限制。
  - 设为 `Infinity` 可禁用垃圾回收。
- `queryKeyHashFn: (queryKey: QueryKey) => string`
  - 可选
  - 若指定，将使用该函数把 `queryKey` 哈希为字符串。
- `refetchInterval: number | false | ((query: Query) => number | false | undefined)`
  - 可选
  - 若设为数字，所有查询会按该毫秒频率持续重新获取。
  - 若设为函数，会以 query 为参数执行该函数来计算频率。
- `refetchIntervalInBackground: boolean`
  - 可选
  - 若设为 `true`，配置了 `refetchInterval` 持续重新获取的查询会在标签页/窗口位于后台时继续重新获取。
- `refetchOnMount: boolean | "always" | ((query: Query) => boolean | "always")`
  - 可选
  - 默认值为 `true`
  - 若设为 `true`，当数据过期时，查询会在挂载时重新获取。
  - 若设为 `false`，查询在挂载时不会重新获取。
  - 若设为 `"always"`，查询在挂载时总是重新获取（使用 `staleTime: 'static'` 时除外）。
  - 若设为函数，会以 query 为参数执行该函数来计算该值。
- `refetchOnWindowFocus: boolean | "always" | ((query: Query) => boolean | "always")`
  - 可选
  - 默认值为 `true`
  - 若设为 `true`，当数据过期时，查询会在窗口聚焦时重新获取。
  - 若设为 `false`，查询在窗口聚焦时不会重新获取。
  - 若设为 `"always"`，查询在窗口聚焦时总是重新获取（使用 `staleTime: 'static'` 时除外）。
  - 若设为函数，会以 query 为参数执行该函数来计算该值。
- `refetchOnReconnect: boolean | "always" | ((query: Query) => boolean | "always")`
  - 可选
  - 默认值为 `true`
  - 若设为 `true`，当数据过期时，查询会在重连时重新获取。
  - 若设为 `false`，查询在重连时不会重新获取。
  - 若设为 `"always"`，查询在重连时总是重新获取（使用 `staleTime: 'static'` 时除外）。
  - 若设为函数，会以 query 为参数执行该函数来计算该值。
- `notifyOnChangeProps: string[] | "all" | (() => string[] | "all" | undefined)`
  - 可选
  - 若设置，组件仅会在列出的属性发生变化时重新渲染。
  - 例如设为 `['data', 'error']` 时，组件仅会在 `data` 或 `error` 变化时重新渲染。
  - 若设为 `"all"`，组件将退出智能追踪，并在任一查询更新时重新渲染。
  - 若设为函数，会执行该函数来计算属性列表。
  - 默认情况下，会追踪属性访问，组件仅在某个被追踪属性变化时重新渲染。
- `select: (data: TData) => unknown`
  - 可选
  - 该选项可用于转换或选择查询函数返回数据的一部分。它会影响返回的 `data` 值，但不会影响写入查询缓存的内容。
  - `select` 函数仅在 `data` 变化，或 `select` 函数自身引用变化时执行。为优化性能，可用 `useCallback` 包裹该函数。
- `initialData: TData | () => TData`
  - 可选
  - 若设置，该值会作为查询缓存的初始数据（前提是该查询尚未被创建或缓存）。
  - 若设为函数，该函数会在共享/根查询初始化期间仅调用**一次**，并应同步返回 initialData。
  - 初始数据默认被视为过期，除非设置了 `staleTime`。
  - `initialData` **会被持久化**到缓存。
- `initialDataUpdatedAt: number | (() => number | undefined)`
  - 可选
  - 若设置，该值会用作 `initialData` 最近一次更新时间（毫秒）。
- `placeholderData: TData | (previousValue: TData | undefined, previousQuery: Query | undefined) => TData`
  - 可选
  - 若设置，在查询仍处于 `pending` 状态时，该值会作为此查询观察者的占位数据。
  - `placeholderData` **不会持久化**到缓存。
  - 若 `placeholderData` 提供函数，第一个参数会接收先前观察到的查询数据（若可用），第二个参数会接收完整的 previousQuery 实例。
- `structuralSharing: boolean | (oldData: unknown | undefined, newData: unknown) => unknown`
  - 可选
  - 默认值为 `true`
  - 若设为 `false`，将禁用查询结果之间的结构共享。
  - 若设为函数，旧数据与新数据会传入该函数，函数应将它们合并为查询的最终解析数据。这样即使数据包含不可序列化值，你也可保留旧数据中的引用以提升性能。
- `subscribed: boolean`
  - 可选
  - 默认值为 `true`
  - 若设为 `false`，此 `useQuery` 实例不会订阅缓存。这意味着它不会自行触发 `queryFn`，且也不会在数据通过其他方式进入缓存时接收更新。
- `throwOnError: undefined | boolean | (error: TError, query: Query) => boolean`
  - 设为 `true` 时，错误会在渲染阶段抛出并传播到最近的错误边界。
  - 设为 `false` 可禁用 `suspense` 将错误抛到错误边界的默认行为。
  - 若设为函数，会接收 error 与 query，并应返回布尔值，以决定是在错误边界中显示错误（`true`）还是将错误作为状态返回（`false`）。
- `meta: Record<string, unknown>`
  - 可选
  - 若设置，会在查询缓存条目上存储额外信息，可按需使用。凡是能访问 `query` 的位置都可读取，并且它也是传给 `queryFn` 的 `QueryFunctionContext` 的一部分。

**参数2（QueryClient）**

- `queryClient?: QueryClient`
  - 使用此项可传入自定义 QueryClient。否则会使用最近上下文中的实例。

**返回值**

- `status: QueryStatus`
  - 可能为：
    - `pending`：没有缓存数据，且尚未完成任何一次查询尝试。
    - `error`：查询尝试产生错误。对应的 `error` 属性会包含该次获取得到的错误。
    - `success`：查询已收到无错误响应并可展示数据。对应的 `data` 属性为成功获取的数据；或者当查询 `enabled` 为 `false` 且尚未获取时，`data` 为初始化时提供给查询的首个 `initialData`。
- `isPending: boolean`
  - 从上方 `status` 变量派生的布尔值，便于使用。
- `isSuccess: boolean`
  - 从上方 `status` 变量派生的布尔值，便于使用。
- `isError: boolean`
  - 从上方 `status` 变量派生的布尔值，便于使用。
- `isLoadingError: boolean`
  - 若查询在首次获取时失败，则为 `true`。
- `isRefetchError: boolean`
  - 若查询在重新获取时失败，则为 `true`。
- `data: TData`
  - 默认值为 `undefined`。
  - 查询最近一次成功解析的数据。
- `dataUpdatedAt: number`
  - 查询最近一次返回 `status` 为 `"success"` 的时间戳。
- `error: null | TError`
  - 默认值为 `null`
  - 查询的错误对象（若抛出了错误）。
- `errorUpdatedAt: number`
  - 查询最近一次返回 `status` 为 `"error"` 的时间戳。
- `isStale: boolean`
  - 当缓存数据被失效，或数据早于给定 `staleTime` 时为 `true`。
- `isPlaceholderData: boolean`
  - 当展示的数据是占位数据时为 `true`。
- `isFetched: boolean`
  - 当查询已获取过时为 `true`。
- `isFetchedAfterMount: boolean`
  - 当查询在组件挂载后获取过时为 `true`。
  - 该属性可用于避免展示之前缓存的数据。
- `fetchStatus: FetchStatus`
  - `fetching`：只要 queryFn 在执行就为 `true`，包括初始 `pending` 和后台重新获取。
  - `paused`：查询原本想获取，但已被 `paused`。
  - `idle`：查询当前未获取。
  - 更多信息见 [Network Mode](../../guides/network-mode.md)。
- `isFetching: boolean`
  - 从上方 `fetchStatus` 变量派生的布尔值，便于使用。
- `isPaused: boolean`
  - 从上方 `fetchStatus` 变量派生的布尔值，便于使用。
- `isRefetching: boolean`
  - 当后台重新获取进行中时为 `true`，其中_不包含_初始 `pending`。
  - 等同于 `isFetching && !isPending`。
- `isLoading: boolean`
  - 当查询首次获取进行中时为 `true`。
  - 等同于 `isFetching && isPending`。
- `isInitialLoading: boolean`
  - **已弃用**
  - `isLoading` 的别名，将在下一个主版本移除。
- `isEnabled: boolean`
  - 当该查询观察者启用时为 `true`，否则为 `false`。
- `failureCount: number`
  - 查询的失败次数。
  - 每次查询失败都会递增。
  - 查询成功时重置为 `0`。
- `failureReason: null | TError`
  - 查询重试失败的原因。
  - 查询成功时重置为 `null`。
- `errorUpdateCount: number`
  - 所有错误的总次数。
- `refetch: (options: { throwOnError: boolean, cancelRefetch: boolean }) => Promise<UseQueryResult>`
  - 手动重新获取查询的函数。
  - 若查询报错，错误默认只会被记录日志。若你希望抛出错误，请传入 `throwOnError: true` 选项。
  - `cancelRefetch?: boolean`
    - 默认值为 `true`
      - 默认情况下，发起新请求前会取消当前正在运行的请求。
    - 设为 `false` 时，若已有请求在运行，则不会再发起新的重新获取。
- `promise: Promise<TData>`
  - 一个稳定的 promise，会以查询数据作为结果 resolve。
  - 需要在 `QueryClient` 上启用 `experimental_prefetchInRender` 功能标志。
