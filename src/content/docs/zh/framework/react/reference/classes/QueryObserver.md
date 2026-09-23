---
id: QueryObserver
title: QueryObserver
redirect_from:
  - reference/QueryObserver
  - framework/react/reference/QueryObserver
---

<!--
translation-source-path: framework/react/reference/classes/QueryObserver.md
translation-source-ref: main
translation-source-hash: b2d19a5bf7b2eb6e8b5f09e6dfe547a11fe6c5a441630b334ad4775be5697d2b
-->


定义于： [packages/query-core/src/queryObserver.ts:57](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L57)

`QueryObserver` 观察 `QueryCache` 中的单个查询，并根据其状态计算 `QueryObserverResult`。底层查询或观察者选项变化时，它会重新计算结果并通知订阅者。框架适配器（如 `useQuery`）以它为基础实现 Hook；你也可以直接使用它，在框架之外观察或切换查询。

## 示例

```ts
const observer = new QueryObserver(queryClient, {
  queryKey: ['posts'],
  queryFn: fetchPosts,
})

const unsubscribe = observer.subscribe((result) => {
  console.log(result.data)
})
```

## 继承

- `Subscribable`\<`QueryObserverListener`\<`TData`, `TError`\>\>

## 由以下类型扩展

- [`InfiniteQueryObserver`](InfiniteQueryObserver.md)

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TData

`TData` = `TQueryFnData`

### TQueryData

`TQueryData` = `TQueryFnData`

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](../type-aliases/QueryKey.md) = [`QueryKey`](../type-aliases/QueryKey.md)

## 构造函数

### 构造函数

```ts
new QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>(client: QueryClient, options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
```

定义于： [packages/query-core/src/queryObserver.ts:87](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L87)

#### 参数

##### client

[`QueryClient`](QueryClient.md)

##### options

[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

#### 返回值

`QueryObserver`\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

#### 重写

```ts
Subscribable<QueryObserverListener<TData, TError>>.constructor
```

## 属性

### options

```ts
options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
```

定义于： [packages/query-core/src/queryObserver.ts:89](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L89)

## 方法

### destroy()

```ts
destroy(): void;
```

定义于： [packages/query-core/src/queryObserver.ts:161](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L161)

停止观察当前查询：清除所有监听器，取消 stale 和定时重新获取计时器，并从原查询中移除该观察者。

#### 返回值

`void`

***

### fetchOptimistic()

```ts
fetchOptimistic(options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): Promise<QueryObserverResult<TData, TError>>;
```

定义于： [packages/query-core/src/queryObserver.ts:395](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L395)

按给定选项获取查询，不影响该观察者自身跟踪的查询或结果。返回的 Promise 解析为本次获取的 `QueryObserverResult`。这适合提前获取其他观察者所需的数据，例如即将导航到的查询。

#### 参数

##### options

[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

#### 返回值

`Promise`\<[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)\<`TData`, `TError`\>\>

#### 示例

```ts
const result = await observer.fetchOptimistic({
  queryKey: ['posts', 2],
  queryFn: () => fetchPost(2),
})
console.log(result.data)
```

***

### getCurrentQuery()

```ts
getCurrentQuery(): Query<TQueryFnData, TError, TQueryData, TQueryKey>;
```

定义于： [packages/query-core/src/queryObserver.ts:357](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L357)

返回该观察者当前观察的 `Query` 实例。

#### 返回值

[`Query`](Query.md)\<`TQueryFnData`, `TError`, `TQueryData`, `TQueryKey`\>

***

### getCurrentResult()

```ts
getCurrentResult(): QueryObserverResult<TData, TError>;
```

定义于： [packages/query-core/src/queryObserver.ts:321](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L321)

返回观察中查询最近计算出的 `QueryObserverResult`。这只是读取当前结果；若需要接收后续更新，请通过继承的 `subscribe` 方法订阅观察者。

#### 返回值

[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)\<`TData`, `TError`\>

#### 示例

```ts
const result = observer.getCurrentResult()
console.log(result.status, result.data)
```

***

### getOptimisticResult()

```ts
getOptimisticResult(options: DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): QueryObserverResult<TData, TError>;
```

定义于： [packages/query-core/src/queryObserver.ts:272](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L272)

根据已补全默认值的选项，立即计算观察者当前应产生的结果；若底层 `Query` 尚不存在则创建它，无须等待订阅回调。框架适配器（如 `useQuery`）在每次渲染时调用此方法，以便在 `setOptions` 触发实际获取前同步取得结果。

#### 参数

##### options

[`DefaultedQueryObserverOptions`](../type-aliases/DefaultedQueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

#### 返回值

[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)\<`TData`, `TError`\>

***

### hasListeners()

```ts
hasListeners(): boolean;
```

定义于： [packages/query-core/src/subscribable.ts:41](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L41)

至少注册了一个监听器时返回 `true`；所有监听器都取消订阅后返回 `false`。

#### 返回值

`boolean`

#### 继承自

```ts
Subscribable.hasListeners
```

***

### refetch()

```ts
refetch(__namedParameters: RefetchOptions): Promise<QueryObserverResult<TData, TError>>;
```

定义于： [packages/query-core/src/queryObserver.ts:371](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L371)

重新获取观察中的查询，返回解析为相应 `QueryObserverResult` 的 Promise。

#### 参数

##### \_\_namedParameters

[`RefetchOptions`](../interfaces/RefetchOptions.md) = `{}`

#### 返回值

`Promise`\<[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)\<`TData`, `TError`\>\>

#### 示例

```ts
const result = await observer.refetch({ cancelRefetch: false })
console.log(result.data)
```

***

### setOptions()

```ts
setOptions(options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): void;
```

定义于： [packages/query-core/src/queryObserver.ts:182](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L182)

更新观察者的选项。这会重新确定观察中的查询（`queryKey` 变化时切换查询）；如果新选项要求获取且存在订阅者，则触发获取；随后重新计算当前结果，并按需重设 stale 和定时重新获取计时器。

#### 参数

##### options

[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

#### 返回值

`void`

#### 示例

```ts
observer.setOptions({ queryKey: ['posts', 1], queryFn: () => fetchPost(1) })
// later: switch to a different query, reusing the same observer
observer.setOptions({ queryKey: ['posts', 2], queryFn: () => fetchPost(2) })
```

***

### shouldFetchOnReconnect()

```ts
shouldFetchOnReconnect(): boolean;
```

定义于： [packages/query-core/src/queryObserver.ts:135](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L135)

返回观察中的查询当前是否处于 stale 状态，且是否配置为网络重新连接时重新获取（通过 `refetchOnReconnect` 选项）。

#### 返回值

`boolean`

***

### shouldFetchOnWindowFocus()

```ts
shouldFetchOnWindowFocus(): boolean;
```

定义于： [packages/query-core/src/queryObserver.ts:148](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L148)

返回观察中的查询当前是否处于 stale 状态，且是否配置为窗口重新获得焦点时重新获取（通过 `refetchOnWindowFocus` 选项）。

#### 返回值

`boolean`

***

### subscribe()

```ts
subscribe(listener: QueryObserverListener): () => void;
```

定义于： [packages/query-core/src/subscribable.ts:27](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L27)

注册一个监听器，在此对象每次发出更新通知时调用。返回值是移除该监听器的函数；调用它即可停止监听。基类不会自行移除监听器，但某些子类会在 `destroy()` 中清除全部监听器。

#### 参数

##### listener

`QueryObserverListener`

每次更新时调用，参数由子类传给订阅者。

#### 返回值

```ts
(): void;
```

##### 返回值

`void`

#### 示例

```ts
const unsubscribe = subscribable.subscribe(() => {
  // react to the update
})

unsubscribe()
```

#### 继承自

```ts
Subscribable.subscribe
```

***

### trackProp()

```ts
trackProp(key: 
  | "error"
  | "data"
  | "isError"
  | "isPending"
  | "isLoading"
  | "isLoadingError"
  | "isRefetchError"
  | "isSuccess"
  | "isPlaceholderData"
  | "status"
  | "dataUpdatedAt"
  | "errorUpdatedAt"
  | "failureCount"
  | "failureReason"
  | "errorUpdateCount"
  | "isFetched"
  | "isFetchedAfterMount"
  | "isFetching"
  | "isInitialLoading"
  | "isPaused"
  | "isRefetching"
  | "isStale"
  | "isEnabled"
  | "refetch"
  | "fetchStatus"): void;
```

定义于： [packages/query-core/src/queryObserver.ts:350](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L350)

记录给定的 `QueryObserverResult` 属性已被读取，使后续更新仅在已跟踪的属性实际变化时通知该观察者。通常由 [QueryObserver#trackResult](#trackresult) 的代理间接调用；对于自行跟踪属性访问的适配器（例如通过自己的响应式系统），也可以直接调用。

#### 参数

##### key

`"error"` | `"data"` | `"isError"` | `"isPending"` | `"isLoading"` | `"isLoadingError"` | `"isRefetchError"` | `"isSuccess"` | `"isPlaceholderData"` | `"status"` | `"dataUpdatedAt"` | `"errorUpdatedAt"` | `"failureCount"` | `"failureReason"` | `"errorUpdateCount"` | `"isFetched"` | `"isFetchedAfterMount"` | `"isFetching"` | `"isInitialLoading"` | `"isPaused"` | `"isRefetching"` | `"isStale"` | `"isEnabled"` | `"refetch"` | `"fetchStatus"`

#### 返回值

`void`

***

### trackResult()

```ts
trackResult(result: QueryObserverResult<TData, TError>, onPropTracked?: (key: 
  | "error"
  | "data"
  | "isError"
  | "isPending"
  | "isLoading"
  | "isLoadingError"
  | "isRefetchError"
  | "isSuccess"
  | "isPlaceholderData"
  | "status"
  | "dataUpdatedAt"
  | "errorUpdatedAt"
  | "failureCount"
  | "failureReason"
  | "errorUpdateCount"
  | "isFetched"
  | "isFetchedAfterMount"
  | "isFetching"
  | "isInitialLoading"
  | "isPaused"
  | "isRefetching"
  | "isStale"
  | "isEnabled"
  | "refetch"
| "fetchStatus") => void): QueryObserverResult<TData, TError>;
```

定义于： [packages/query-core/src/queryObserver.ts:331](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L331)

使用 `Proxy` 包装 `QueryObserverResult`，通过 [QueryObserver#trackProp](#trackprop)（以及可选的 `onPropTracked` 回调）记录被读取的属性。框架适配器在未设置 `notifyOnChangeProps` 时使用它，实现默认的“仅在实际读取的属性变化时重新渲染”行为。

#### 参数

##### result

[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)\<`TData`, `TError`\>

##### onPropTracked?

(`key`: 
  \| `"error"`
  \| `"data"`
  \| `"isError"`
  \| `"isPending"`
  \| `"isLoading"`
  \| `"isLoadingError"`
  \| `"isRefetchError"`
  \| `"isSuccess"`
  \| `"isPlaceholderData"`
  \| `"status"`
  \| `"dataUpdatedAt"`
  \| `"errorUpdatedAt"`
  \| `"failureCount"`
  \| `"failureReason"`
  \| `"errorUpdateCount"`
  \| `"isFetched"`
  \| `"isFetchedAfterMount"`
  \| `"isFetching"`
  \| `"isInitialLoading"`
  \| `"isPaused"`
  \| `"isRefetching"`
  \| `"isStale"`
  \| `"isEnabled"`
  \| `"refetch"`
  \| `"fetchStatus"`) => `void`

#### 返回值

[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)\<`TData`, `TError`\>

***

### updateResult()

```ts
updateResult(): void;
```

定义于： [packages/query-core/src/queryObserver.ts:735](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L735)

根据当前查询和选项重新计算并保存结果；结果变化时通知监听器。框架适配器在订阅后立即调用此方法，避免遗漏从创建观察者到完成订阅之间发生的查询更新。

#### 返回值

`void`
