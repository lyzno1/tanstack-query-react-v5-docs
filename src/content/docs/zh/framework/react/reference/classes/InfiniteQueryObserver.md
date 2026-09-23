---
id: InfiniteQueryObserver
title: InfiniteQueryObserver
redirect_from:
  - reference/InfiniteQueryObserver
  - framework/react/reference/InfiniteQueryObserver
---

<!--
translation-source-path: framework/react/reference/classes/InfiniteQueryObserver.md
translation-source-ref: main
translation-source-hash: ab5a644c819886669f988a3fb28a62bd1b9045407d81e23b8f427d13a13a2459
-->


定义于： [packages/query-core/src/infiniteQueryObserver.ts:41](https://github.com/TanStack/query/blob/main/packages/query-core/src/infiniteQueryObserver.ts#L41)

`InfiniteQueryObserver` 扩展了 `QueryObserver`，用于观察和切换无限查询。它为基础的 `QueryObserverResult` 增加了无限查询专用的字段和方法，例如 `hasNextPage` 和 `fetchNextPage`。框架适配器（如 `useInfiniteQuery`）以它为基础实现 Hook。

## 示例

```ts
const observer = new InfiniteQueryObserver(queryClient, {
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

const unsubscribe = observer.subscribe((result) => console.log(result))
```

## 继承

- [`QueryObserver`](QueryObserver.md)\<`TQueryFnData`, `TError`, `TData`, [`InfiniteData`](../interfaces/InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TData

`TData` = [`InfiniteData`](../interfaces/InfiniteData.md)\<`TQueryFnData`\>

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](../type-aliases/QueryKey.md) = [`QueryKey`](../type-aliases/QueryKey.md)

### TPageParam

`TPageParam` = `unknown`

## 构造函数

### 构造函数

```ts
new InfiniteQueryObserver<TQueryFnData, TError, TData, TQueryKey, TPageParam>(client: QueryClient, options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): InfiniteQueryObserver<TQueryFnData, TError, TData, TQueryKey, TPageParam>;
```

定义于： [packages/query-core/src/infiniteQueryObserver.ts:83](https://github.com/TanStack/query/blob/main/packages/query-core/src/infiniteQueryObserver.ts#L83)

#### 参数

##### client

[`QueryClient`](QueryClient.md)

##### options

[`InfiniteQueryObserverOptions`](../interfaces/InfiniteQueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 返回值

`InfiniteQueryObserver`\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 重写

[`QueryObserver`](QueryObserver.md).[`constructor`](QueryObserver.md#constructor)

## 属性

### getCurrentResult

```ts
getCurrentResult: ReplaceReturnType<() => QueryObserverResult<TData, TError>, InfiniteQueryObserverResult<TData, TError>>;
```

定义于： [packages/query-core/src/infiniteQueryObserver.ts:60](https://github.com/TanStack/query/blob/main/packages/query-core/src/infiniteQueryObserver.ts#L60)

返回观察中查询最近计算出的 `QueryObserverResult`。这只是读取当前结果；若需要接收后续更新，请通过继承的 `subscribe` 方法订阅观察者。

#### 示例

```ts
const result = observer.getCurrentResult()
console.log(result.status, result.data)
```

#### 重写

```ts
QueryObserver.getCurrentResult
```

***

### options

```ts
options: QueryObserverOptions<TQueryFnData, TError, TData, InfiniteData<TQueryFnData, TPageParam>, TQueryKey>;
```

定义于： [packages/query-core/src/queryObserver.ts:89](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L89)

#### 继承自

[`QueryObserver`](QueryObserver.md).[`options`](QueryObserver.md#options)

***

### subscribe()

```ts
subscribe: (listener: InfiniteQueryObserverListener) => () => void;
```

定义于： [packages/query-core/src/infiniteQueryObserver.ts:55](https://github.com/TanStack/query/blob/main/packages/query-core/src/infiniteQueryObserver.ts#L55)

注册一个监听器，在此对象每次发出更新通知时调用。返回值是移除该监听器的函数；调用它即可停止监听。基类不会自行移除监听器，但某些子类会在 `destroy()` 中清除全部监听器。

#### 参数

##### listener

`InfiniteQueryObserverListener`

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

#### 重写

```ts
QueryObserver.subscribe
```

## 方法

### destroy()

```ts
destroy(): void;
```

定义于： [packages/query-core/src/queryObserver.ts:161](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L161)

停止观察当前查询：清除所有监听器，取消 stale 和定时重新获取计时器，并从原查询中移除该观察者。

#### 返回值

`void`

#### 继承自

[`QueryObserver`](QueryObserver.md).[`destroy`](QueryObserver.md#destroy)

***

### fetchNextPage()

```ts
fetchNextPage(options?: FetchNextPageOptions): Promise<InfiniteQueryObserverResult<TData, TError>>;
```

定义于： [packages/query-core/src/infiniteQueryObserver.ts:161](https://github.com/TanStack/query/blob/main/packages/query-core/src/infiniteQueryObserver.ts#L161)

获取无限查询的下一页，返回解析为相应 `InfiniteQueryObserverResult` 的 Promise。本次获取使用的分页参数由 `getNextPageParam` 决定；该函数接收当前页面及其分页参数，其返回值也决定 `hasNextPage`。

#### 参数

##### options?

[`FetchNextPageOptions`](../interfaces/FetchNextPageOptions.md)

#### 返回值

`Promise`\<[`InfiniteQueryObserverResult`](../type-aliases/InfiniteQueryObserverResult.md)\<`TData`, `TError`\>\>

#### 示例

```ts
const { hasNextPage } = observer.getCurrentResult()

if (hasNextPage) {
  await observer.fetchNextPage()
}
```

#### 另请参阅

[InfiniteQueryObserver#fetchPreviousPage](#fetchpreviouspage)

***

### fetchOptimistic()

```ts
fetchOptimistic(options: QueryObserverOptions<TQueryFnData, TError, TData, InfiniteData<TQueryFnData, TPageParam>, TQueryKey>): Promise<QueryObserverResult<TData, TError>>;
```

定义于： [packages/query-core/src/queryObserver.ts:395](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L395)

按给定选项获取查询，不影响该观察者自身跟踪的查询或结果。返回的 Promise 解析为本次获取的 `QueryObserverResult`。这适合提前获取其他观察者所需的数据，例如即将导航到的查询。

#### 参数

##### options

[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, [`InfiniteData`](../interfaces/InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>

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

#### 继承自

[`QueryObserver`](QueryObserver.md).[`fetchOptimistic`](QueryObserver.md#fetchoptimistic)

***

### fetchPreviousPage()

```ts
fetchPreviousPage(options?: FetchPreviousPageOptions): Promise<InfiniteQueryObserverResult<TData, TError>>;
```

定义于： [packages/query-core/src/infiniteQueryObserver.ts:190](https://github.com/TanStack/query/blob/main/packages/query-core/src/infiniteQueryObserver.ts#L190)

获取无限查询的上一页，返回解析为相应 `InfiniteQueryObserverResult` 的 Promise。本次获取使用的分页参数由 `getPreviousPageParam` 决定；该函数接收当前页面及其分页参数，其返回值也决定 `hasPreviousPage`。

#### 参数

##### options?

[`FetchPreviousPageOptions`](../interfaces/FetchPreviousPageOptions.md)

#### 返回值

`Promise`\<[`InfiniteQueryObserverResult`](../type-aliases/InfiniteQueryObserverResult.md)\<`TData`, `TError`\>\>

#### 示例

```ts
const { hasPreviousPage } = observer.getCurrentResult()

if (hasPreviousPage) {
  await observer.fetchPreviousPage()
}
```

#### 另请参阅

[InfiniteQueryObserver#fetchNextPage](#fetchnextpage)

***

### getCurrentQuery()

```ts
getCurrentQuery(): Query<TQueryFnData, TError, InfiniteData<TQueryFnData, TPageParam>, TQueryKey>;
```

定义于： [packages/query-core/src/queryObserver.ts:357](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L357)

返回该观察者当前观察的 `Query` 实例。

#### 返回值

[`Query`](Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](../interfaces/InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>

#### 继承自

[`QueryObserver`](QueryObserver.md).[`getCurrentQuery`](QueryObserver.md#getcurrentquery)

***

### getOptimisticResult()

```ts
getOptimisticResult(options: DefaultedInfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): InfiniteQueryObserverResult<TData, TError>;
```

定义于： [packages/query-core/src/infiniteQueryObserver.ts:127](https://github.com/TanStack/query/blob/main/packages/query-core/src/infiniteQueryObserver.ts#L127)

对应无限查询的 [QueryObserver#getOptimisticResult](QueryObserver.md#getoptimisticresult)：先将选项标记为无限查询，再委托给该方法。框架适配器（如 `useInfiniteQuery`）会在订阅前调用它，同步计算当前的 `InfiniteQueryObserverResult`。

#### 参数

##### options

[`DefaultedInfiniteQueryObserverOptions`](../type-aliases/DefaultedInfiniteQueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 返回值

[`InfiniteQueryObserverResult`](../type-aliases/InfiniteQueryObserverResult.md)\<`TData`, `TError`\>

#### 重写

[`QueryObserver`](QueryObserver.md).[`getOptimisticResult`](QueryObserver.md#getoptimisticresult)

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

[`QueryObserver`](QueryObserver.md).[`hasListeners`](QueryObserver.md#haslisteners)

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

#### 继承自

[`QueryObserver`](QueryObserver.md).[`refetch`](QueryObserver.md#refetch)

***

### setOptions()

```ts
setOptions(options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): void;
```

定义于： [packages/query-core/src/infiniteQueryObserver.ts:108](https://github.com/TanStack/query/blob/main/packages/query-core/src/infiniteQueryObserver.ts#L108)

更新观察者的选项。行为与 `QueryObserver.setOptions` 相同，但在委托给基类实现之前，额外将选项标记为无限查询。

#### 参数

##### options

[`InfiniteQueryObserverOptions`](../interfaces/InfiniteQueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 返回值

`void`

#### 重写

[`QueryObserver`](QueryObserver.md).[`setOptions`](QueryObserver.md#setoptions)

***

### shouldFetchOnReconnect()

```ts
shouldFetchOnReconnect(): boolean;
```

定义于： [packages/query-core/src/queryObserver.ts:135](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L135)

返回观察中的查询当前是否处于 stale 状态，且是否配置为网络重新连接时重新获取（通过 `refetchOnReconnect` 选项）。

#### 返回值

`boolean`

#### 继承自

[`QueryObserver`](QueryObserver.md).[`shouldFetchOnReconnect`](QueryObserver.md#shouldfetchonreconnect)

***

### shouldFetchOnWindowFocus()

```ts
shouldFetchOnWindowFocus(): boolean;
```

定义于： [packages/query-core/src/queryObserver.ts:148](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L148)

返回观察中的查询当前是否处于 stale 状态，且是否配置为窗口重新获得焦点时重新获取（通过 `refetchOnWindowFocus` 选项）。

#### 返回值

`boolean`

#### 继承自

[`QueryObserver`](QueryObserver.md).[`shouldFetchOnWindowFocus`](QueryObserver.md#shouldfetchonwindowfocus)

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

记录给定的 `QueryObserverResult` 属性已被读取，使后续更新仅在已跟踪的属性实际变化时通知该观察者。通常由 [QueryObserver#trackResult](QueryObserver.md#trackresult) 的代理间接调用；对于自行跟踪属性访问的适配器（例如通过自己的响应式系统），也可以直接调用。

#### 参数

##### key

`"error"` | `"data"` | `"isError"` | `"isPending"` | `"isLoading"` | `"isLoadingError"` | `"isRefetchError"` | `"isSuccess"` | `"isPlaceholderData"` | `"status"` | `"dataUpdatedAt"` | `"errorUpdatedAt"` | `"failureCount"` | `"failureReason"` | `"errorUpdateCount"` | `"isFetched"` | `"isFetchedAfterMount"` | `"isFetching"` | `"isInitialLoading"` | `"isPaused"` | `"isRefetching"` | `"isStale"` | `"isEnabled"` | `"refetch"` | `"fetchStatus"`

#### 返回值

`void`

#### 继承自

[`QueryObserver`](QueryObserver.md).[`trackProp`](QueryObserver.md#trackprop)

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

使用 `Proxy` 包装 `QueryObserverResult`，通过 [QueryObserver#trackProp](QueryObserver.md#trackprop)（以及可选的 `onPropTracked` 回调）记录被读取的属性。框架适配器在未设置 `notifyOnChangeProps` 时使用它，实现默认的“仅在实际读取的属性变化时重新渲染”行为。

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

#### 继承自

[`QueryObserver`](QueryObserver.md).[`trackResult`](QueryObserver.md#trackresult)

***

### updateResult()

```ts
updateResult(): void;
```

定义于： [packages/query-core/src/queryObserver.ts:735](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts#L735)

根据当前查询和选项重新计算并保存结果；结果变化时通知监听器。框架适配器在订阅后立即调用此方法，避免遗漏从创建观察者到完成订阅之间发生的查询更新。

#### 返回值

`void`

#### 继承自

[`QueryObserver`](QueryObserver.md).[`updateResult`](QueryObserver.md#updateresult)
