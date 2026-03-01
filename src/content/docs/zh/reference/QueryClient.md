---
id: QueryClient
title: QueryClient
---

<!--
translation-source-path: reference/QueryClient.md
translation-source-ref: v5.90.3
translation-source-hash: b0a3e940dd8fa648f8d4e1e255e715f906b0456931589f93b82756499a89ad35
translation-status: translated
-->


## `QueryClient`

`QueryClient` 可用于与缓存交互：

```tsx
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

await queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: fetchPosts })
```

它提供的方法有：

- [`queryClient.fetchQuery`](#queryclientfetchquery)
- [`queryClient.fetchInfiniteQuery`](#queryclientfetchinfinitequery)
- [`queryClient.prefetchQuery`](#queryclientprefetchquery)
- [`queryClient.prefetchInfiniteQuery`](#queryclientprefetchinfinitequery)
- [`queryClient.getQueryData`](#queryclientgetquerydata)
- [`queryClient.ensureQueryData`](#queryclientensurequerydata)
- [`queryClient.ensureInfiniteQueryData`](#queryclientensureinfinitequerydata)
- [`queryClient.getQueriesData`](#queryclientgetqueriesdata)
- [`queryClient.setQueryData`](#queryclientsetquerydata)
- [`queryClient.getQueryState`](#queryclientgetquerystate)
- [`queryClient.setQueriesData`](#queryclientsetqueriesdata)
- [`queryClient.invalidateQueries`](#queryclientinvalidatequeries)
- [`queryClient.refetchQueries`](#queryclientrefetchqueries)
- [`queryClient.cancelQueries`](#queryclientcancelqueries)
- [`queryClient.removeQueries`](#queryclientremovequeries)
- [`queryClient.resetQueries`](#queryclientresetqueries)
- [`queryClient.isFetching`](#queryclientisfetching)
- [`queryClient.isMutating`](#queryclientismutating)
- [`queryClient.getDefaultOptions`](#queryclientgetdefaultoptions)
- [`queryClient.setDefaultOptions`](#queryclientsetdefaultoptions)
- [`queryClient.getQueryDefaults`](#queryclientgetquerydefaults)
- [`queryClient.setQueryDefaults`](#queryclientsetquerydefaults)
- [`queryClient.getMutationDefaults`](#queryclientgetmutationdefaults)
- [`queryClient.setMutationDefaults`](#queryclientsetmutationdefaults)
- [`queryClient.getQueryCache`](#queryclientgetquerycache)
- [`queryClient.getMutationCache`](#queryclientgetmutationcache)
- [`queryClient.clear`](#queryclientclear)
- [`queryClient.resumePausedMutations`](#queryclientresumepausedmutations)

**选项**

- `queryCache?: QueryCache`
  - 可选
  - 该客户端连接的查询缓存。
- `mutationCache?: MutationCache`
  - 可选
  - 该客户端连接的变更缓存。
- `defaultOptions?: DefaultOptions`
  - 可选
  - 为使用此 queryClient 的所有查询与变更定义默认选项。
  - 你也可以定义用于 [hydration](../../framework/react/reference/hydration.md) 的默认值。

## `queryClient.fetchQuery`

`fetchQuery` 是一个异步方法，可用于获取并缓存查询。它会在成功时 resolve 数据，失败时抛出错误。如果你只想获取查询而不需要结果，请使用 `prefetchQuery`。

如果查询已存在，且数据未被失效，或未超过给定的 `staleTime`，则会返回缓存中的数据。否则会尝试获取最新数据。

```tsx
try {
  const data = await queryClient.fetchQuery({ queryKey, queryFn })
} catch (error) {
  console.log(error)
}
```

你可以指定 `staleTime`，只在数据超过该时间后才重新获取：

```tsx
try {
  const data = await queryClient.fetchQuery({
    queryKey,
    queryFn,
    staleTime: 10000,
  })
} catch (error) {
  console.log(error)
}
```

**选项**

`fetchQuery` 的选项与 [`useQuery`](../../framework/react/reference/useQuery.md) 完全一致，但以下选项除外：`enabled, refetchInterval, refetchIntervalInBackground, refetchOnWindowFocus, refetchOnReconnect, refetchOnMount, notifyOnChangeProps, throwOnError, select, suspense, placeholderData`；这些仅用于 useQuery 和 useInfiniteQuery。你可以查看[源码](https://github.com/TanStack/query/blob/7cd2d192e6da3df0b08e334ea1cf04cd70478827/packages/query-core/src/types.ts#L119)以获得更清晰的说明。

**返回值**

- `Promise<TData>`

## `queryClient.fetchInfiniteQuery`

`fetchInfiniteQuery` 与 `fetchQuery` 类似，但用于获取并缓存无限查询。

```tsx
try {
  const data = await queryClient.fetchInfiniteQuery({ queryKey, queryFn })
  console.log(data.pages)
} catch (error) {
  console.log(error)
}
```

**选项**

`fetchInfiniteQuery` 的选项与 [`fetchQuery`](#queryclientfetchquery) 完全一致。

**返回值**

- `Promise<InfiniteData<TData, TPageParam>>`

## `queryClient.prefetchQuery`

`prefetchQuery` 是一个异步方法，可在查询被需要或通过 `useQuery` 等方式渲染之前进行预获取。其行为与 `fetchQuery` 相同，不同点是它不会抛错，也不会返回任何数据。

```tsx
await queryClient.prefetchQuery({ queryKey, queryFn })
```

你甚至可以在配置中配合默认 queryFn 使用它。

```tsx
await queryClient.prefetchQuery({ queryKey })
```

**选项**

`prefetchQuery` 的选项与 [`fetchQuery`](#queryclientfetchquery) 完全一致。

**返回值**

- `Promise<void>`
  - 返回一个 Promise：如果无需获取会立即 resolve，否则会在查询执行后 resolve。它不会返回数据，也不会抛出错误。

## `queryClient.prefetchInfiniteQuery`

`prefetchInfiniteQuery` 与 `prefetchQuery` 类似，但可用于预获取并缓存无限查询。

```tsx
await queryClient.prefetchInfiniteQuery({ queryKey, queryFn })
```

**选项**

`prefetchInfiniteQuery` 的选项与 [`fetchQuery`](#queryclientfetchquery) 完全一致。

**返回值**

- `Promise<void>`
  - 返回一个 Promise：如果无需获取会立即 resolve，否则会在查询执行后 resolve。它不会返回数据，也不会抛出错误。

## `queryClient.getQueryData`

`getQueryData` 是一个同步函数，可用于获取现有查询的缓存数据。如果查询不存在，将返回 `undefined`。

```tsx
const data = queryClient.getQueryData(queryKey)
```

**选项**

- `queryKey: QueryKey`: [Query Keys](../../framework/react/guides/query-keys.md)

**返回值**

- `data: TQueryFnData | undefined`
  - 该缓存查询对应的数据；若查询不存在则为 `undefined`。

## `queryClient.ensureQueryData`

`ensureQueryData` 是一个异步函数，可用于获取现有查询的缓存数据。如果查询不存在，会调用 `queryClient.fetchQuery` 并返回其结果。

```tsx
const data = await queryClient.ensureQueryData({ queryKey, queryFn })
```

**选项**

- 与 [`fetchQuery`](#queryclientfetchquery) 相同的选项
- `revalidateIfStale: boolean`
  - 可选
  - 默认为 `false`
  - 若设为 `true`，过期数据会在后台重新获取，但会立即返回缓存数据。

**返回值**

- `Promise<TData>`

## `queryClient.ensureInfiniteQueryData`

`ensureInfiniteQueryData` 是一个异步函数，可用于获取现有无限查询的缓存数据。如果查询不存在，会调用 `queryClient.fetchInfiniteQuery` 并返回其结果。

```tsx
const data = await queryClient.ensureInfiniteQueryData({
  queryKey,
  queryFn,
  initialPageParam,
  getNextPageParam,
})
```

**选项**

- 与 [`fetchInfiniteQuery`](#queryclientfetchinfinitequery) 相同的选项
- `revalidateIfStale: boolean`
  - 可选
  - 默认为 `false`
  - 若设为 `true`，过期数据会在后台重新获取，但会立即返回缓存数据。

**返回值**

- `Promise<InfiniteData<TData, TPageParam>>`

## `queryClient.getQueriesData`

`getQueriesData` 是一个同步函数，可用于获取多个查询的缓存数据。只会返回匹配传入 queryKey 或 queryFilter 的查询。如果没有匹配项，将返回空数组。

```tsx
const data = queryClient.getQueriesData(filters)
```

**选项**

- `filters: QueryFilters`: [Query Filters](../../framework/react/guides/filters.md#query-filters)
  - 传入过滤器后，会返回与过滤器匹配的 queryKey 对应数据。

**返回值**

- `[queryKey: QueryKey, data: TQueryFnData | undefined][]`
  - 匹配到的 queryKey 与数据组成的元组数组；若无匹配则为 `[]`。

**Caveats**

由于返回数组中每个元组的数据结构可能不同（例如，用过滤器返回“active”查询会得到不同数据类型），`TData` 泛型默认是 `unknown`。如果你为 `TData` 指定了更具体的类型，即表示你确认每个元组的数据项类型都一致。

这种区分更多是给清楚返回结构的 TypeScript 开发者提供的“便利”。

## `queryClient.setQueryData`

`setQueryData` 是一个同步函数，可用于立即更新某个查询的缓存数据。如果查询不存在，会创建该查询。**如果查询在默认 `gcTime`（5 分钟）内没有被任何查询 hook 使用，该查询会被垃圾回收**。若要一次更新多个查询并按 query key 部分匹配，请改用 [`queryClient.setQueriesData`](#queryclientsetqueriesdata)。

> `setQueryData` 与 `fetchQuery` 的区别是：`setQueryData` 是同步方法，并假设你已经同步拿到了可用数据。如果你需要异步获取数据，建议重新获取该 query key，或使用 `fetchQuery` 处理异步获取。

```tsx
queryClient.setQueryData(queryKey, updater)
```

**选项**

- `queryKey: QueryKey`: [Query Keys](../../framework/react/guides/query-keys.md)
- `updater: TQueryFnData | undefined | ((oldData: TQueryFnData | undefined) => TQueryFnData | undefined)`
  - 传入非函数值时，数据会被更新为该值。
  - 传入函数时，会接收旧数据值并应返回新值。

**Using an updater value**

```tsx
setQueryData(queryKey, newData)
```

如果该值为 `undefined`，查询数据不会被更新。

**Using an updater function**

为便于书写，也可以传入 updater 函数。它会接收当前数据并返回新数据：

```tsx
setQueryData(queryKey, (oldData) => newData)
```

如果 updater 函数返回 `undefined`，查询数据不会更新。如果 updater 函数接收到的输入是 `undefined`，你可以返回 `undefined` 以中止更新，从而_不_创建新的缓存条目。

**Immutability**

通过 `setQueryData` 更新数据时，必须使用_不可变_方式。**不要**直接修改 `oldData`，或原地修改通过 `getQueryData` 取出的数据并写回缓存。

## `queryClient.getQueryState`

`getQueryState` 是一个同步函数，可用于获取现有查询的状态。如果查询不存在，将返回 `undefined`。

```tsx
const state = queryClient.getQueryState(queryKey)
console.log(state.dataUpdatedAt)
```

**选项**

- `queryKey: QueryKey`: [Query Keys](../../framework/react/guides/query-keys.md)

## `queryClient.setQueriesData`

`setQueriesData` 是一个同步函数，可通过过滤函数或部分匹配 query key，立即更新多个查询的缓存数据。仅会更新匹配传入 queryKey 或 queryFilter 的查询，不会创建新的缓存条目。其底层会对每个已有查询调用 [`setQueryData`](#queryclientsetquerydata)。

```tsx
queryClient.setQueriesData(filters, updater)
```

**选项**

- `filters: QueryFilters`: [Query Filters](../../framework/react/guides/filters.md#query-filters)
  - 传入过滤器后，会更新与过滤器匹配的 queryKey。
- `updater: TQueryFnData | (oldData: TQueryFnData | undefined) => TQueryFnData`
  - [setQueryData](#queryclientsetquerydata) 的 updater 函数或新数据，会对每个匹配的 queryKey 调用。

## `queryClient.invalidateQueries`

`invalidateQueries` 可用于根据查询键或查询的其他可访问属性/状态，使缓存中的一个或多个查询失效并重新获取。默认会立即将所有匹配查询标记为失效，并在后台重新获取活跃查询。

- 如果你**不希望活跃查询重新获取**，只想标记为失效，可使用 `refetchType: 'none'`。
- 如果你**也希望非活跃查询重新获取**，可使用 `refetchType: 'all'`。
- 重新获取时会调用 [queryClient.refetchQueries](#queryclientrefetchqueries)。

```tsx
await queryClient.invalidateQueries(
  {
    queryKey: ['posts'],
    exact,
    refetchType: 'active',
  },
  { throwOnError, cancelRefetch },
)
```

**选项**

- `filters?: QueryFilters`: [Query Filters](../../framework/react/guides/filters.md#query-filters)
  - `queryKey?: QueryKey`: [Query Keys](../../framework/react/guides/query-keys.md)
  - `refetchType?: 'active' | 'inactive' | 'all' | 'none'`
    - 默认为 `'active'`
    - 设为 `active` 时，只会后台重新获取符合条件且正通过 `useQuery` 等方式活跃渲染的查询。
    - 设为 `inactive` 时，只会后台重新获取符合条件但**未**通过 `useQuery` 等方式活跃渲染的查询。
    - 设为 `all` 时，会后台重新获取所有符合条件的查询。
    - 设为 `none` 时，不会重新获取任何查询，只将符合条件的查询标记为失效。
- `options?: InvalidateOptions`:
  - `throwOnError?: boolean`
    - 设为 `true` 时，如果任一查询重新获取失败，此方法会抛错。
  - `cancelRefetch?: boolean`
    - 默认为 `true`
      - 默认情况下，发起新请求前会先取消当前进行中的请求。
    - 设为 `false` 时，如果已有请求进行中，则不会再发起重新获取。

## `queryClient.refetchQueries`

`refetchQueries` 可用于按特定条件重新获取查询。

示例：

```tsx
// refetch all queries:
await queryClient.refetchQueries()

// refetch all stale queries:
await queryClient.refetchQueries({ stale: true })

// refetch all active queries partially matching a query key:
await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })

// refetch all active queries exactly matching a query key:
await queryClient.refetchQueries({
  queryKey: ['posts', 1],
  type: 'active',
  exact: true,
})
```

**选项**

- `filters?: QueryFilters`: [Query Filters](../../framework/react/guides/filters.md#query-filters)
- `options?: RefetchOptions`:
  - `throwOnError?: boolean`
    - 设为 `true` 时，如果任一查询重新获取失败，此方法会抛错。
  - `cancelRefetch?: boolean`
    - 默认为 `true`
      - 默认情况下，发起新请求前会先取消当前进行中的请求。
    - 设为 `false` 时，如果已有请求进行中，则不会再发起重新获取。

**返回值**

该函数返回一个 Promise，会在所有查询完成重新获取后 resolve。默认情况下，即使其中某些查询重新获取失败，**也不会**抛错；可通过将 `throwOnError` 设为 `true` 来更改该行为。

**Notes**

- 仅有禁用 Observer 的“disabled”查询永远不会被重新获取。
- 仅有 Static StaleTime Observer 的“static”查询永远不会被重新获取。

## `queryClient.cancelQueries`

`cancelQueries` 可用于根据查询键或查询的其他可访问属性/状态，取消正在进行的查询。

这在执行乐观更新时尤其有用，因为你通常需要取消正在进行的查询重新获取，避免其完成后覆盖你的乐观更新。

```tsx
await queryClient.cancelQueries(
  { queryKey: ['posts'], exact: true },
  { silent: true },
)
```

**选项**

- `filters?: QueryFilters`: [Query Filters](../../framework/react/guides/filters.md#query-filters)
- `cancelOptions?: CancelOptions`: [Cancel Options](../../framework/react/guides/query-cancellation.md#cancel-options)

**返回值**

此方法不返回任何内容。

## `queryClient.removeQueries`

`removeQueries` 可用于根据查询键或查询的其他可访问属性/状态，从缓存中移除查询。

```tsx
queryClient.removeQueries({ queryKey, exact: true })
```

**选项**

- `filters?: QueryFilters`: [Query Filters](../../framework/react/guides/filters.md#query-filters)

**返回值**

此方法不返回任何内容。

## `queryClient.resetQueries`

`resetQueries` 可用于根据查询键或查询的其他可访问属性/状态，将缓存中的查询重置为初始状态。

它会通知订阅者 &mdash; 不同于会移除全部订阅者的 `clear` &mdash; 并把查询重置到预加载状态 &mdash; 不同于 `invalidateQueries`。如果查询配置了 `initialData`，其数据会重置为该值。如果查询处于活跃状态，它会被重新获取。

```tsx
queryClient.resetQueries({ queryKey, exact: true })
```

**选项**

- `filters?: QueryFilters`: [Query Filters](../../framework/react/guides/filters.md#query-filters)
- `options?: ResetOptions`:
  - `throwOnError?: boolean`
    - 设为 `true` 时，如果任一查询重新获取失败，此方法会抛错。
  - `cancelRefetch?: boolean`
    - 默认为 `true`
      - 默认情况下，发起新请求前会先取消当前进行中的请求。
    - 设为 `false` 时，如果已有请求进行中，则不会再发起重新获取。

**返回值**

该方法返回一个 Promise，会在所有活跃查询完成重新获取后 resolve。

## `queryClient.isFetching`

`isFetching` 方法返回一个 `integer`，表示当前缓存中正在获取的查询数量（包括后台获取、加载新页、或加载更多无限查询结果）。

```tsx
if (queryClient.isFetching()) {
  console.log('At least one query is fetching!')
}
```

TanStack Query 还提供了便捷的 [`useIsFetching`](../../framework/react/reference/useIsFetching.md) hook，使你无需手动订阅 query cache，也能在组件中订阅该状态。

**选项**

- `filters?: QueryFilters`: [Query Filters](../../framework/react/guides/filters.md#query-filters)

**返回值**

该方法返回正在获取的查询数量。

## `queryClient.isMutating`

`isMutating` 方法返回一个 `integer`，表示当前缓存中正在获取的 mutation 数量。

```tsx
if (queryClient.isMutating()) {
  console.log('At least one mutation is fetching!')
}
```

TanStack Query 还提供了便捷的 [`useIsMutating`](../../framework/react/reference/useIsMutating.md) hook，使你无需手动订阅 mutation cache，也能在组件中订阅该状态。

**选项**

- `filters: MutationFilters`: [Mutation Filters](../../framework/react/guides/filters.md#mutation-filters)

**返回值**

该方法返回正在获取的 mutation 数量。

## `queryClient.getDefaultOptions`

`getDefaultOptions` 方法会返回在创建客户端时或通过 `setDefaultOptions` 设置的默认选项。

```tsx
const defaultOptions = queryClient.getDefaultOptions()
```

## `queryClient.setDefaultOptions`

`setDefaultOptions` 方法可用于动态设置该 queryClient 的默认选项。此前定义的默认选项会被覆盖。

```tsx
queryClient.setDefaultOptions({
  queries: {
    staleTime: Infinity,
  },
})
```

## `queryClient.getQueryDefaults`

`getQueryDefaults` 方法会返回为特定查询设置的默认选项：

```tsx
const defaultOptions = queryClient.getQueryDefaults(['posts'])
```

> 注意：如果有多个查询默认项匹配给定 query key，它们会按注册顺序进行合并。
> 参见 [`setQueryDefaults`](#queryclientsetquerydefaults)。

## `queryClient.setQueryDefaults`

`setQueryDefaults` 可用于为特定查询设置默认选项：

```tsx
queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })

function Component() {
  const { data } = useQuery({ queryKey: ['posts'] })
}
```

**选项**

- `queryKey: QueryKey`: [Query Keys](../../framework/react/guides/query-keys.md)
- `options: QueryOptions`

> 如 [`getQueryDefaults`](#queryclientgetquerydefaults) 所述，查询默认项的注册顺序确实很重要。
> 由于 `getQueryDefaults` 会合并匹配到的默认项，注册顺序应为：从**最通用的 key**到**最具体的 key**。
> 这样更具体的默认项就能覆盖更通用的默认项。

## `queryClient.getMutationDefaults`

`getMutationDefaults` 方法会返回为特定 mutation 设置的默认选项：

```tsx
const defaultOptions = queryClient.getMutationDefaults(['addPost'])
```

## `queryClient.setMutationDefaults`

`setMutationDefaults` 可用于为特定 mutation 设置默认选项：

```tsx
queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })

function Component() {
  const { data } = useMutation({ mutationKey: ['addPost'] })
}
```

**选项**

- `mutationKey: unknown[]`
- `options: MutationOptions`

> 与 [`setQueryDefaults`](#queryclientsetquerydefaults) 类似，这里的注册顺序同样很重要。

## `queryClient.getQueryCache`

`getQueryCache` 方法会返回该客户端连接的查询缓存。

```tsx
const queryCache = queryClient.getQueryCache()
```

## `queryClient.getMutationCache`

`getMutationCache` 方法会返回该客户端连接的变更缓存。

```tsx
const mutationCache = queryClient.getMutationCache()
```

## `queryClient.clear`

`clear` 方法会清空所有关联缓存。

```tsx
queryClient.clear()
```

## `queryClient.resumePausedMutations`

可用于恢复因无网络连接而暂停的 mutation。

```tsx
queryClient.resumePausedMutations()
```
