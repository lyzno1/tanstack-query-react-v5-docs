---
id: QueryClient
title: QueryClient
redirect_from:
  - reference/QueryClient
  - framework/react/reference/QueryClient
---

<!--
translation-source-path: framework/react/reference/classes/QueryClient.md
translation-source-ref: main
translation-source-hash: 09ad266b6a0965db28579fec7df85303c7b395c7723a076355115ab59c9c38c5
-->


定义于： [packages/query-core/src/queryClient.ts:79](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L79)

`QueryClient` 用于操作查询和 mutation 的缓存。它持有 `QueryCache` 与 `MutationCache`（如果没有传入则创建默认实例），并保存通过它创建的查询和 mutation 所采用的默认选项。

## 示例

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

await queryClient.query({ queryKey: ['posts'], queryFn: fetchPosts })
```

## 构造函数

### 构造函数

```ts
new QueryClient(config: QueryClientConfig): QueryClient;
```

定义于： [packages/query-core/src/queryClient.ts:89](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L89)

#### 参数

##### config

[`QueryClientConfig`](../interfaces/QueryClientConfig.md) = `{}`

#### 返回值

`QueryClient`

## 方法

### cancelQueries()

```ts
cancelQueries<TTaggedQueryKey>(filters?: QueryFilters<TTaggedQueryKey>, cancelOptions?: CancelOptions): Promise<void>;
```

定义于： [packages/query-core/src/queryClient.ts:441](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L441)

取消符合给定过滤条件的查询正在进行的获取。这在执行乐观更新时尤其有用，因为稍后完成的重新获取可能覆盖乐观更新。默认情况下（`revert: true`），取消后会将查询数据恢复到本次获取开始前的状态。

即使单个取消操作失败，返回的 Promise 也不会 reject。

#### 类型参数

##### TTaggedQueryKey

`TTaggedQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### filters?

[`QueryFilters`](../interfaces/QueryFilters.md)\<`TTaggedQueryKey`\>

##### cancelOptions?

[`CancelOptions`](../interfaces/CancelOptions.md) = `{}`

#### 返回值

`Promise`\<`void`\>

#### 示例

```ts
await queryClient.cancelQueries({ queryKey: ['posts'], exact: true })
```

***

### clear()

```ts
clear(): void;
```

定义于： [packages/query-core/src/queryClient.ts:1096](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L1096)

清空此客户端连接的查询缓存和 mutation 缓存。

#### 返回值

`void`

#### 示例

```ts
import { QueryClient } from '@tanstack/query-core'

const queryClient = new QueryClient()
queryClient.clear()
```

***

### defaultMutationOptions()

```ts
defaultMutationOptions<T>(options?: T): T;
```

定义于： [packages/query-core/src/queryClient.ts:1070](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L1070)

与 [QueryClient#defaultQueryOptions](#defaultqueryoptions) 对应的 mutation 方法。框架适配器（例如在 `useMutation` 内部）调用它，将调用方传入的选项与该客户端的默认 mutation 选项及匹配 `mutationKey` 的默认值合并。

#### 类型参数

##### T

`T` *extends* [`MutationOptions`](../interfaces/MutationOptions.md)\<`any`, `any`, `any`, `any`\>

#### 参数

##### options?

`T`

#### 返回值

`T`

***

### defaultQueryOptions()

```ts
defaultQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>(options: 
  | QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>
| DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
```

定义于： [packages/query-core/src/queryClient.ts:983](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L983)

框架适配器（如 `useQuery` 内部）调用此方法，将调用方传入的选项解析为补全默认值后的最终形式：合并给定 `queryKey` 对应的 `queryClient.setQueryDefaults` 默认值、客户端的 `defaultOptions.queries`，最后覆盖调用方的选项。如果选项已补全默认值（`_defaulted: true`），则不作处理。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryData

`TQueryData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TPageParam

`TPageParam` = `never`

#### 参数

##### options

[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`, `TPageParam`\> | [`DefaultedQueryObserverOptions`](../type-aliases/DefaultedQueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

#### 返回值

[`DefaultedQueryObserverOptions`](../type-aliases/DefaultedQueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

***

### ~~ensureInfiniteQueryData()~~

```ts
ensureInfiniteQueryData<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options: EnsureInfiniteQueryDataOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<InfiniteData<TData, TPageParam>>;
```

定义于： [packages/query-core/src/queryClient.ts:747](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L747)

#### 类型参数

##### TQueryFnData

`TQueryFnData`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TPageParam

`TPageParam` = `unknown`

#### 参数

##### options

[`EnsureInfiniteQueryDataOptions`](../type-aliases/EnsureInfiniteQueryDataOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 返回值

`Promise`\<[`InfiniteData`](../interfaces/InfiniteData.md)\<`TData`, `TPageParam`\>\>

#### 已弃用

请改用 `queryClient.infiniteQuery({ ...options, staleTime: 'static' })`。此方法将在下一个主版本移除。

***

### ~~ensureQueryData()~~

```ts
ensureQueryData<TQueryFnData, TError, TData, TQueryKey>(options: EnsureQueryDataOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<TData>;
```

定义于： [packages/query-core/src/queryClient.ts:198](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L198)

#### 类型参数

##### TQueryFnData

`TQueryFnData`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### options

[`EnsureQueryDataOptions`](../interfaces/EnsureQueryDataOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

#### 返回值

`Promise`\<`TData`\>

#### 已弃用

请改用 `queryClient.query({ ...options, staleTime: 'static' })`。此方法将在下一个主版本移除。

***

### ~~fetchInfiniteQuery()~~

```ts
fetchInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options: FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<InfiniteData<TData, TPageParam>>;
```

定义于： [packages/query-core/src/queryClient.ts:702](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L702)

#### 类型参数

##### TQueryFnData

`TQueryFnData`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TPageParam

`TPageParam` = `unknown`

#### 参数

##### options

[`FetchInfiniteQueryOptions`](../type-aliases/FetchInfiniteQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 返回值

`Promise`\<[`InfiniteData`](../interfaces/InfiniteData.md)\<`TData`, `TPageParam`\>\>

#### 已弃用

请改用 `queryClient.infiniteQuery(options)`。此方法将在下一个主版本移除。

***

### ~~fetchQuery()~~

```ts
fetchQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<TData>;
```

定义于： [packages/query-core/src/queryClient.ts:609](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L609)

#### 类型参数

##### TQueryFnData

`TQueryFnData`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TPageParam

`TPageParam` = `never`

#### 参数

##### options

[`FetchQueryOptions`](../interfaces/FetchQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 返回值

`Promise`\<`TData`\>

#### 已弃用

请改用 `queryClient.query(options)`。此方法将在下一个主版本移除。

***

### getDefaultOptions()

```ts
getDefaultOptions(): DefaultOptions;
```

定义于： [packages/query-core/src/queryClient.ts:831](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L831)

返回创建客户端时设置的默认选项，或通过 [QueryClient#setDefaultOptions](#setdefaultoptions) 设置的默认选项。

#### 返回值

[`DefaultOptions`](../interfaces/DefaultOptions.md)

#### 示例

```ts
import { QueryClient } from '@tanstack/query-core'

const queryClient = new QueryClient()
const defaultOptions = queryClient.getDefaultOptions()
```

***

### getMutationCache()

```ts
getMutationCache(): MutationCache;
```

定义于： [packages/query-core/src/queryClient.ts:815](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L815)

返回此客户端连接的 mutation 缓存。

#### 返回值

[`MutationCache`](MutationCache.md)

#### 示例

```ts
import { QueryClient } from '@tanstack/query-core'

const queryClient = new QueryClient()
const mutationCache = queryClient.getMutationCache()
const mutations = mutationCache.findAll({ status: 'pending' })
```

***

### getMutationDefaults()

```ts
getMutationDefaults(mutationKey: readonly unknown[]): OmitKeyof<MutationObserverOptions<any, any, any, any>, "mutationKey">;
```

定义于： [packages/query-core/src/queryClient.ts:958](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L958)

返回通过 [QueryClient#setMutationDefaults](#setmutationdefaults) 注册的、mutation key 与给定 `mutationKey` 部分匹配的默认选项。如果有多个匹配项，会按注册顺序合并。

#### 参数

##### mutationKey

readonly `unknown`[]

#### 返回值

[`OmitKeyof`](../type-aliases/OmitKeyof.md)\<[`MutationObserverOptions`](../interfaces/MutationObserverOptions.md)\<`any`, `any`, `any`, `any`\>, `"mutationKey"`\>

#### 示例

```ts
const defaultOptions = queryClient.getMutationDefaults(['addPost'])
```

***

### getQueriesData()

```ts
getQueriesData<TQueryFnData, TQueryFilters>(filters: TQueryFilters): [readonly unknown[], TQueryFnData | undefined][];
```

定义于： [packages/query-core/src/queryClient.ts:244](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L244)

通过命令式（非响应式）方法，一次获取多个查询的缓存数据。仅返回符合给定过滤条件的查询；没有匹配项时返回空数组。

匹配的查询可能包含不同形状的数据（例如宽泛的过滤条件会匹配数据类型互不相关的查询），因此泛型 `TQueryFnData` 默认为 `unknown`，不会进行推断。调用方若确定所有匹配查询的数据形状相同，可传入更具体的类型；实际缓存内容不会据此进行校验。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TQueryFilters

`TQueryFilters` *extends* [`QueryFilters`](../interfaces/QueryFilters.md)\<`any`\> = [`QueryFilters`](../interfaces/QueryFilters.md)\<readonly `unknown`[]\>

#### 参数

##### filters

`TQueryFilters`

#### 返回值

\[readonly `unknown`[], `TQueryFnData` \| `undefined`\][]

查询键与数据组成的数组。如果某个查询没有缓存数据，对应的数据为 `undefined`。

#### 另请参阅

[QueryClient#getQueryData](#getquerydata)

#### 示例

```ts
const data = queryClient.getQueriesData({ queryKey: ['posts'] })
```

***

### getQueryCache()

```ts
getQueryCache(): QueryCache;
```

定义于： [packages/query-core/src/queryClient.ts:799](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L799)

返回此客户端连接的查询缓存。

#### 返回值

[`QueryCache`](QueryCache.md)

#### 示例

```ts
import { QueryClient } from '@tanstack/query-core'

const queryClient = new QueryClient()
const queryCache = queryClient.getQueryCache()
const queries = queryCache.findAll({ queryKey: ['posts'] })
```

***

### getQueryData()

```ts
getQueryData<TQueryFnData, TTaggedQueryKey, TInferredQueryFnData>(queryKey: TTaggedQueryKey): TInferredQueryFnData | undefined;
```

定义于： [packages/query-core/src/queryClient.ts:184](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L184)

通过命令式（非响应式）方法获取某个查询键对应的数据。仅适合在需要读取最新数据的回调或函数中使用，例如乐观更新。

提示：不要在组件内部调用此函数，因为组件不会收到更新。请使用 `useQuery` 创建订阅变化的 `QueryObserver`。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TTaggedQueryKey

`TTaggedQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TInferredQueryFnData

`TInferredQueryFnData` = [`InferDataFromTag`](../type-aliases/InferDataFromTag.md)\<`TQueryFnData`, `TTaggedQueryKey`\>

#### 参数

##### queryKey

`TTaggedQueryKey`

#### 返回值

`TInferredQueryFnData` \| `undefined`

查询的缓存数据；如果该键尚未对应任何被观察的查询，则返回 `undefined`。

#### 另请参阅

[QueryClient#getQueriesData](#getqueriesdata)

***

### getQueryDefaults()

```ts
getQueryDefaults(queryKey: readonly unknown[]): OmitKeyof<QueryObserverOptions<any, any, any, any, any>, "queryKey">;
```

定义于： [packages/query-core/src/queryClient.ts:901](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L901)

返回通过 [QueryClient#setQueryDefaults](#setquerydefaults) 注册的、查询键与给定 `queryKey` 部分匹配的默认选项。如果有多个匹配项，会按注册顺序合并。

#### 参数

##### queryKey

readonly `unknown`[]

#### 返回值

[`OmitKeyof`](../type-aliases/OmitKeyof.md)\<[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`any`, `any`, `any`, `any`, `any`\>, `"queryKey"`\>

#### 示例

```ts
const defaultOptions = queryClient.getQueryDefaults(['posts'])
```

***

### getQueryState()

```ts
getQueryState<TQueryFnData, TError, TTaggedQueryKey, TInferredQueryFnData, TInferredError>(queryKey: TTaggedQueryKey): 
  | QueryState<TInferredQueryFnData, TInferredError>
  | undefined;
```

定义于： [packages/query-core/src/queryClient.ts:359](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L359)

通过命令式（非响应式）方法读取现有查询的状态。如果查询不存在，返回 `undefined`。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TError

`TError` = `Error`

##### TTaggedQueryKey

`TTaggedQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TInferredQueryFnData

`TInferredQueryFnData` = [`InferDataFromTag`](../type-aliases/InferDataFromTag.md)\<`TQueryFnData`, `TTaggedQueryKey`\>

##### TInferredError

`TInferredError` = [`InferErrorFromTag`](../type-aliases/InferErrorFromTag.md)\<`TError`, `TTaggedQueryKey`\>

#### 参数

##### queryKey

`TTaggedQueryKey`

#### 返回值

  \| [`QueryState`](../interfaces/QueryState.md)\<`TInferredQueryFnData`, `TInferredError`\>
  \| `undefined`

#### 示例

```ts
const state = queryClient.getQueryState(['posts'])
console.log(state?.dataUpdatedAt)
```

***

### infiniteQuery()

```ts
infiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options: InfiniteQueryExecuteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<TData[] extends InfiniteData<TQueryFnData, unknown>[] ? InfiniteData<TQueryFnData, TPageParam> : TData>;
```

定义于： [packages/query-core/src/queryClient.ts:676](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L676)

异步获取并缓存无限查询，成功时解析为 [InfiniteData](../interfaces/InfiniteData.md) 对象，失败时抛出错误。

行为类似 [QueryClient#query](#query)：接受相同选项（除 `initialPageParam` 外），另外要求提供 `initialPageParam`，并可选传入 `pages` 与 `getNextPageParam`，用于从头重新获取固定数量的页面。

此方法取代已弃用的 `fetchInfiniteQuery`；配合 `{ staleTime: 'static' }` 时，也取代已弃用的 `ensureInfiniteQueryData`。

#### 类型参数

##### TQueryFnData

`TQueryFnData`

##### TError

`TError` = `Error`

##### TData

`TData` = [`InfiniteData`](../interfaces/InfiniteData.md)\<`TQueryFnData`, `unknown`\>

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TPageParam

`TPageParam` = `unknown`

#### 参数

##### options

[`InfiniteQueryExecuteOptions`](../type-aliases/InfiniteQueryExecuteOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 返回值

`Promise`\<`TData`[] *extends* [`InfiniteData`](../interfaces/InfiniteData.md)\<`TQueryFnData`, `unknown`\>[] ? [`InfiniteData`](../interfaces/InfiniteData.md)\<`TQueryFnData`, `TPageParam`\> : `TData`\>

#### 示例

```ts
try {
  const data = await queryClient.infiniteQuery({ queryKey, queryFn, initialPageParam: 0 })
  console.log(data.pages)
} catch (error) {
  console.log(error)
}
```

***

### invalidateQueries()

```ts
invalidateQueries<TTaggedQueryKey>(filters?: InvalidateQueryFilters<TTaggedQueryKey>, options?: InvalidateOptions): Promise<void>;
```

定义于： [packages/query-core/src/queryClient.ts:469](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L469)

将符合给定过滤条件的查询标记为失效。与 [QueryClient#removeQueries](#removequeries) 不同，失效查询仍保留在缓存中。

除非 `filters.refetchType` 为 `'none'`，否则会通过 [QueryClient#refetchQueries](#refetchqueries) 重新获取匹配的查询。重新获取类型优先使用 `filters.refetchType`，其次是 `filters.type`，默认是 `'active'`。

#### 类型参数

##### TTaggedQueryKey

`TTaggedQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### filters?

[`InvalidateQueryFilters`](../interfaces/InvalidateQueryFilters.md)\<`TTaggedQueryKey`\>

##### options?

[`InvalidateOptions`](../interfaces/InvalidateOptions.md) = `{}`

#### 返回值

`Promise`\<`void`\>

#### 示例

```ts
await queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'active' })
```

***

### isFetching()

```ts
isFetching<TQueryFilters>(filters?: TQueryFilters): number;
```

定义于： [packages/query-core/src/queryClient.ts:150](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L150)

返回缓存中当前正在获取的查询数量，可用过滤条件限定范围。包括后台获取、新页面加载和无限查询的后续页面加载。

#### 类型参数

##### TQueryFilters

`TQueryFilters` *extends* [`QueryFilters`](../interfaces/QueryFilters.md)\<`any`\> = [`QueryFilters`](../interfaces/QueryFilters.md)\<readonly `unknown`[]\>

#### 参数

##### filters?

`TQueryFilters`

#### 返回值

`number`

#### 示例

```ts
if (queryClient.isFetching()) {
  console.log('At least one query is fetching!')
}
```

***

### isMutating()

```ts
isMutating<TMutationFilters>(filters?: TMutationFilters): number;
```

定义于： [packages/query-core/src/queryClient.ts:168](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L168)

返回缓存中当前处于 pending 状态的 mutation 数量，可用过滤条件限定范围。

#### 类型参数

##### TMutationFilters

`TMutationFilters` *extends* [`MutationFilters`](../interfaces/MutationFilters.md)\<`any`, `any`, `unknown`, `unknown`\> = [`MutationFilters`](../interfaces/MutationFilters.md)\<`unknown`, `Error`, `unknown`, `unknown`\>

#### 参数

##### filters?

`TMutationFilters`

#### 返回值

`number`

#### 示例

```ts
if (queryClient.isMutating()) {
  console.log('At least one mutation is pending!')
}
```

***

### mount()

```ts
mount(): void;
```

定义于： [packages/query-core/src/queryClient.ts:104](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L104)

框架适配器中的 `QueryClientProvider` 等组件在挂载时调用此方法，开始监听焦点和网络状态事件，并恢复暂停的 mutation。内部通过挂载计数管理引用，因此嵌套或多个 Provider 共用同一 `QueryClient` 时，只有最后一个卸载后才会移除共享监听器。

#### 返回值

`void`

***

### ~~prefetchInfiniteQuery()~~

```ts
prefetchInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options: FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<void>;
```

定义于： [packages/query-core/src/queryClient.ts:725](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L725)

#### 类型参数

##### TQueryFnData

`TQueryFnData`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TPageParam

`TPageParam` = `unknown`

#### 参数

##### options

[`FetchInfiniteQueryOptions`](../type-aliases/FetchInfiniteQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

#### 返回值

`Promise`\<`void`\>

#### 已弃用

请改用 `queryClient.infiniteQuery(options)`。可以使用 `.catch(noop)` 忽略错误。此方法将在下一个主版本移除。

***

### ~~prefetchQuery()~~

```ts
prefetchQuery<TQueryFnData, TError, TData, TQueryKey>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<void>;
```

定义于： [packages/query-core/src/queryClient.ts:643](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L643)

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### options

[`FetchQueryOptions`](../interfaces/FetchQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

#### 返回值

`Promise`\<`void`\>

#### 已弃用

请改用 `queryClient.query(options)`。可以使用 `.catch(noop)` 忽略错误。此方法将在下一个主版本移除。

***

### query()

```ts
query<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>(options: QueryExecuteOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>): Promise<TData>;
```

定义于： [packages/query-core/src/queryClient.ts:563](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L563)

异步获取并缓存查询；成功时解析为数据，失败时抛出错误。

如果查询已存在于缓存中，且其数据根据给定 `staleTime` 尚未过期，则直接返回缓存数据，不会发起获取。否则执行获取，并在完成后解析 Promise。如果提供了 `select` 函数，不论数据来自缓存还是新获取，返回前都会应用该函数。

与响应式观察者不同，这里默认禁用重试（`retry: false`），除非显式配置；因为这里没有组件能捕获抛出的错误并通过重新渲染进行重试。

接受的选项是 `QueryObserverOptions` 去除仅对响应式观察者有意义的字段：此方法不接受 `enabled`、`refetchInterval`、`refetchIntervalInBackground`、`refetchOnWindowFocus`、`refetchOnReconnect`、`refetchOnMount`、`retryOnMount`、`notifyOnChangeProps`、`throwOnError`、`suspense` 和 `placeholderData`。

此方法取代已弃用的 `fetchQuery`；配合 `{ staleTime: 'static' }` 时，也取代已弃用的 `ensureQueryData`。

#### 类型参数

##### TQueryFnData

`TQueryFnData`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryData

`TQueryData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TPageParam

`TPageParam` = `never`

#### 参数

##### options

[`QueryExecuteOptions`](../interfaces/QueryExecuteOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`, `TPageParam`\>

#### 返回值

`Promise`\<`TData`\>

#### 示例

```ts
try {
  const data = await queryClient.query({ queryKey, queryFn, staleTime: 10000 })
} catch (error) {
  console.log(error)
}
```

***

### refetchQueries()

```ts
refetchQueries<TTaggedQueryKey>(filters?: RefetchQueryFilters<TTaggedQueryKey>, options?: RefetchOptions): Promise<void>;
```

定义于： [packages/query-core/src/queryClient.ts:506](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L506)

重新获取符合给定过滤条件的查询，无论其数据是否已过期。不提供过滤条件时，重新获取缓存中的所有查询。已禁用的查询，以及仅有 `staleTime` 为 `'static'` 的观察者的静态查询，不会重新获取。

默认情况下（`cancelRefetch: true`），新获取开始前会取消正在进行的获取。返回的 Promise 在所有匹配查询完成后解析；单个查询失败不会使其 reject，除非设置 `throwOnError`。

#### 类型参数

##### TTaggedQueryKey

`TTaggedQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### filters?

[`RefetchQueryFilters`](../interfaces/RefetchQueryFilters.md)\<`TTaggedQueryKey`\>

##### options?

[`RefetchOptions`](../interfaces/RefetchOptions.md) = `{}`

#### 返回值

`Promise`\<`void`\>

#### 示例

```ts
// refetch all active queries partially matching a query key:
await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
```

***

### removeQueries()

```ts
removeQueries<TTaggedQueryKey>(filters?: QueryFilters<TTaggedQueryKey>): void;
```

定义于： [packages/query-core/src/queryClient.ts:385](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L385)

从缓存中移除符合给定过滤条件的查询。与 [QueryClient#invalidateQueries](#invalidatequeries) 或 [QueryClient#refetchQueries](#refetchqueries) 不同，此方法直接移除匹配查询，而非重新获取。未指定过滤条件时，会移除缓存中的所有查询。

#### 类型参数

##### TTaggedQueryKey

`TTaggedQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### filters?

[`QueryFilters`](../interfaces/QueryFilters.md)\<`TTaggedQueryKey`\>

#### 返回值

`void`

#### 示例

```ts
queryClient.removeQueries({ queryKey: ['posts'], exact: true })
```

***

### resetQueries()

```ts
resetQueries<TTaggedQueryKey>(filters?: QueryFilters<TTaggedQueryKey>, options?: ResetOptions): Promise<void>;
```

定义于： [packages/query-core/src/queryClient.ts:406](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L406)

将符合给定过滤条件的查询重置为初始状态（如 `initialData`），通知订阅者，而不是移除查询。匹配的活跃查询随后会重新获取；返回的 Promise 在重新获取完成后解析。

#### 类型参数

##### TTaggedQueryKey

`TTaggedQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### filters?

[`QueryFilters`](../interfaces/QueryFilters.md)\<`TTaggedQueryKey`\>

##### options?

[`ResetOptions`](../interfaces/ResetOptions.md)

#### 返回值

`Promise`\<`void`\>

#### 示例

```ts
await queryClient.resetQueries({ queryKey: ['posts'], exact: true })
```

***

### resumePausedMutations()

```ts
resumePausedMutations(): Promise<unknown>;
```

定义于： [packages/query-core/src/queryClient.ts:780](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L780)

恢复因网络断开而暂停的 mutation。如果客户端当前处于离线状态，则不作处理并立即解析 Promise。

#### 返回值

`Promise`\<`unknown`\>

#### 示例

```ts
import { QueryClient } from '@tanstack/query-core'

const queryClient = new QueryClient()
await queryClient.resumePausedMutations()
```

***

### setDefaultOptions()

```ts
setDefaultOptions(options: DefaultOptions): void;
```

定义于： [packages/query-core/src/queryClient.ts:852](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L852)

动态设置此客户端的默认选项，覆盖之前定义的默认选项。

#### 参数

##### options

[`DefaultOptions`](../interfaces/DefaultOptions.md)

#### 返回值

`void`

#### 另请参阅

[QueryClient#getDefaultOptions](#getdefaultoptions)

#### 示例

```ts
import { QueryClient } from '@tanstack/query-core'

const queryClient = new QueryClient()
queryClient.setDefaultOptions({
  queries: {
    staleTime: Infinity,
  },
})
```

***

### setMutationDefaults()

```ts
setMutationDefaults<TData, TError, TVariables, TOnMutateResult>(mutationKey: readonly unknown[], options: OmitKeyof<MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">): void;
```

定义于： [packages/query-core/src/queryClient.ts:930](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L930)

为 mutation key 与给定 `mutationKey` 部分匹配的 mutation 设置默认选项。与 [QueryClient#setQueryDefaults](#setquerydefaults) 一样，如果同一个 mutation key 匹配多个已注册的默认值，注册顺序会影响结果。

#### 类型参数

##### TData

`TData` = `unknown`

##### TError

`TError` = `Error`

##### TVariables

`TVariables` = `void`

##### TOnMutateResult

`TOnMutateResult` = `unknown`

#### 参数

##### mutationKey

readonly `unknown`[]

##### options

[`OmitKeyof`](../type-aliases/OmitKeyof.md)\<[`MutationObserverOptions`](../interfaces/MutationObserverOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

#### 返回值

`void`

#### 另请参阅

[QueryClient#getMutationDefaults](#getmutationdefaults)

#### 示例

```ts
queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })
```

***

### setQueriesData()

```ts
setQueriesData<TQueryFnData, TQueryFilters>(
   filters: TQueryFilters, 
   updater: Updater<NoInfer<TQueryFnData> | undefined, NoInfer<TQueryFnData> | undefined>, 
   options?: SetDataOptions): [readonly unknown[], TQueryFnData | undefined][];
```

定义于： [packages/query-core/src/queryClient.ts:328](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L328)

通过同步方法立即更新多个查询的缓存数据，可使用过滤条件或部分匹配的查询键。仅更新已存在且符合条件的查询，不会创建新的缓存条目。内部会对每个匹配查询调用 [QueryClient#setQueryData](#setquerydata)。

#### 类型参数

##### TQueryFnData

`TQueryFnData`

##### TQueryFilters

`TQueryFilters` *extends* [`QueryFilters`](../interfaces/QueryFilters.md)\<`any`\> = [`QueryFilters`](../interfaces/QueryFilters.md)\<readonly `unknown`[]\>

#### 参数

##### filters

`TQueryFilters`

##### updater

[`Updater`](../type-aliases/Updater.md)\<`NoInfer`\<`TQueryFnData`\> \| `undefined`, `NoInfer`\<`TQueryFnData`\> \| `undefined`\>

##### options?

[`SetDataOptions`](../interfaces/SetDataOptions.md)

#### 返回值

\[readonly `unknown`[], `TQueryFnData` \| `undefined`\][]

每个匹配查询对应一个 `[queryKey, data]` 元组；形状与 [QueryClient#setQueryData](#setquerydata) 相同，数据也可能为 `undefined`。

#### 示例

```ts
queryClient.setQueriesData({ queryKey: ['posts'] }, (oldPosts) =>
  oldPosts ? oldPosts.filter((post) => post.id !== deletedId) : oldPosts,
)
```

***

### setQueryData()

```ts
setQueryData<TQueryFnData, TTaggedQueryKey, TInferredQueryFnData>(
   queryKey: TTaggedQueryKey, 
   updater: Updater<NoInfer<TInferredQueryFnData> | undefined, NoInfer<TInferredQueryFnData> | undefined>, 
   options?: SetDataOptions): NoInfer<TInferredQueryFnData> | undefined;
```

定义于： [packages/query-core/src/queryClient.ts:278](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L278)

通过同步方法立即更新查询的缓存数据。如果 updater（或传入的值）得到 `undefined`，则不修改缓存，也不创建查询；否则，如果查询尚不存在，会创建它。如需通过查询键部分匹配并一次更新多个查询，请使用 [QueryClient#setQueriesData](#setqueriesdata)。

更新时必须保持不可变性：不要原地修改 `oldData`，也不要原地修改之前通过 [QueryClient#getQueryData](#getquerydata) 获取的数据。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TTaggedQueryKey

`TTaggedQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

##### TInferredQueryFnData

`TInferredQueryFnData` = [`InferDataFromTag`](../type-aliases/InferDataFromTag.md)\<`TQueryFnData`, `TTaggedQueryKey`\>

#### 参数

##### queryKey

`TTaggedQueryKey`

要设置数据的查询键。

##### updater

[`Updater`](../type-aliases/Updater.md)\<`NoInfer`\<`TInferredQueryFnData`\> \| `undefined`, `NoInfer`\<`TInferredQueryFnData`\> \| `undefined`\>

可以是新数据，也可以是接收当前数据（可能为 `undefined`）并返回新数据的函数。

##### options?

[`SetDataOptions`](../interfaces/SetDataOptions.md)

设置 `updatedAt` 可覆盖写入数据所记录的时间戳。

#### 返回值

`NoInfer`\<`TInferredQueryFnData`\> \| `undefined`

已写入的数据；如果 updater 返回 `undefined`，则结果为 `undefined`，此时会跳过写入，缓存保持不变。

#### 示例

```ts
queryClient.setQueryData(['posts'], newPosts)

// Or, using an updater function that receives the current data:
queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost])
```

***

### setQueryDefaults()

```ts
setQueryDefaults<TQueryFnData, TError, TData, TQueryData>(queryKey: readonly unknown[], options: Partial<OmitKeyof<QueryObserverOptions<TQueryFnData, TError, TData, TQueryData>, "queryKey">>): void;
```

定义于： [packages/query-core/src/queryClient.ts:871](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L871)

为查询键与给定 `queryKey` 部分匹配的查询设置默认选项。

如果某个查询键匹配多个已注册的默认值，[QueryClient#getQueryDefaults](#getquerydefaults) 会按注册顺序合并它们。因此应先注册最宽泛的键，再注册更具体的键，使后者覆盖前者。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryData

`TQueryData` = `TQueryFnData`

#### 参数

##### queryKey

readonly `unknown`[]

##### options

`Partial`\<[`OmitKeyof`](../type-aliases/OmitKeyof.md)\<[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryData`\>, `"queryKey"`\>\>

#### 返回值

`void`

#### 示例

```ts
queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })

await queryClient.query({ queryKey: ['posts'] })
```

***

### unmount()

```ts
unmount(): void;
```

定义于： [packages/query-core/src/queryClient.ts:127](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryClient.ts#L127)

与 [QueryClient#mount](#mount) 相反：框架适配器中的 `QueryClientProvider` 等组件在卸载时调用。只有挂载计数降至 `0` 时，才会移除焦点和网络状态监听器。

#### 返回值

`void`
