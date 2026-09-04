---
id: QueryClient
title: QueryClient
redirect_from:
  - framework/react/reference/QueryClient
---

<!--
translation-source-path: reference/QueryClient.md
translation-source-ref: main
translation-source-hash: 01dcfff3d2766f5096da082fdc4b905d4ff72f5b55d772c3106865a0a5391649
translation-status: translated
-->


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

await queryClient.query({ queryKey: ['posts'], queryFn: fetchPosts })
```

它提供的方法有：

- [`queryClient.query`](#queryclient-query)
- [`queryClient.infiniteQuery`](#queryclient-infinitequery)
- [`queryClient.getQueryData`](#queryclient-getquerydata)
- [`queryClient.getQueriesData`](#queryclient-getqueriesdata)
- [`queryClient.setQueryData`](#queryclient-setquerydata)
- [`queryClient.getQueryState`](#queryclient-getquerystate)
- [`queryClient.setQueriesData`](#queryclient-setqueriesdata)
- [`queryClient.invalidateQueries`](#queryclient-invalidatequeries)
- [`queryClient.refetchQueries`](#queryclient-refetchqueries)
- [`queryClient.cancelQueries`](#queryclient-cancelqueries)
- [`queryClient.removeQueries`](#queryclient-removequeries)
- [`queryClient.resetQueries`](#queryclient-resetqueries)
- [`queryClient.isFetching`](#queryclient-isfetching)
- [`queryClient.isMutating`](#queryclient-ismutating)
- [`queryClient.getDefaultOptions`](#queryclient-getdefaultoptions)
- [`queryClient.setDefaultOptions`](#queryclient-setdefaultoptions)
- [`queryClient.getQueryDefaults`](#queryclient-getquerydefaults)
- [`queryClient.setQueryDefaults`](#queryclient-setquerydefaults)
- [`queryClient.getMutationDefaults`](#queryclient-getmutationdefaults)
- [`queryClient.setMutationDefaults`](#queryclient-setmutationdefaults)
- [`queryClient.getQueryCache`](#queryclient-getquerycache)
- [`queryClient.getMutationCache`](#queryclient-getmutationcache)
- [`queryClient.clear`](#queryclient-clear)
- [`queryClient.resumePausedMutations`](#queryclient-resumepausedmutations)

**选项**

- `queryCache?: QueryCache`
  - 可选
  - 该客户端连接的查询缓存。
- `mutationCache?: MutationCache`
  - 可选
  - 该客户端连接的变更缓存。
- `defaultOptions?: DefaultOptions`
  - 可选
  - 为所有使用此 Query Client 的查询与变更定义默认选项。
  - 你还可以定义用于[水合](../framework/react/guides/ssr.md)的默认选项。

## `queryClient.query`

`query` 是一个异步方法，可用于获取并缓存查询。它会返回查询数据，或者抛出错误。

如果查询已存在，并且数据既未失效、数据年龄也未超过给定的 `staleTime`，则会返回缓存中的数据。否则会尝试获取最新数据。

```tsx
try {
  const data = await queryClient.query({ queryKey, queryFn })
} catch (error) {
  console.log(error)
}
```

你可以指定 `staleTime`，只在数据超过该时间后才重新获取：

```tsx
try {
  const data = await queryClient.query({
    queryKey,
    queryFn,
    staleTime: 10000,
    select: (data) => data.items,
  })
} catch (error) {
  console.log(error)
}
```

**选项**

`query` 的选项与 [`useQuery`](../framework/react/reference/functions/useQuery.md) 完全相同，但不包括以下选项：`enabled, refetchInterval, refetchIntervalInBackground, refetchOnWindowFocus, refetchOnReconnect, refetchOnMount, notifyOnChangeProps, throwOnError, suspense, placeholderData`；这些选项仅用于 useQuery 和 useInfiniteQuery。你可以查看[源代码](https://github.com/TanStack/query/blob/7cd2d192e6da3df0b08e334ea1cf04cd70478827/packages/query-core/src/types.ts#L119)了解更多细节。

**返回值**

- `Promise<TData>`

## `queryClient.infiniteQuery`

`infiniteQuery` 与 `query` 类似，但它用于获取并缓存无限查询。

```tsx
try {
  const data = await queryClient.infiniteQuery({ queryKey, queryFn })
  console.log(data.pages)
} catch (error) {
  console.log(error)
}
```

**选项**

`infiniteQuery` 的选项与 [`query`](#queryclient-query) 完全相同，并额外支持 [`useInfiniteQuery`](../framework/react/reference/functions/useInfiniteQuery.md) 中的 `initialPageParam`、`pages` 和 `getNextPageParam` 选项。

**返回值**

- `Promise<InfiniteData<TData, TPageParam>>`

## `queryClient.getQueriesData`

`getQueriesData` 是一个同步函数，可用于获取多个查询的缓存数据。只会返回匹配传入 queryKey 或 queryFilter 的查询。如果没有匹配项，将返回空数组。

```tsx
const data = queryClient.getQueriesData(filters)
```

**选项**

- `filters: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)
  - 传入过滤器后，会返回与过滤器匹配的 queryKey 对应数据。

**返回值**

- `[queryKey: QueryKey, data: TQueryFnData | undefined][]`
  - 匹配到的 queryKey 与数据组成的元组数组；若无匹配则为 `[]`。

**注意事项**

由于返回数组中每个元组的数据结构可能不同（例如，用过滤器返回“active”查询会得到不同数据类型），`TData` 泛型默认是 `unknown`。如果你为 `TData` 指定了更具体的类型，即表示你确认每个元组的数据项类型都一致。

这种区分更多是给清楚返回结构的 TypeScript 开发者提供的“便利”。

## `queryClient.setQueryData`

`setQueryData` 是一个同步函数，可用于立即更新某个查询的缓存数据。如果查询不存在，会创建该查询。**如果查询在默认 `gcTime` 内没有被查询 Hook 使用，它将被垃圾回收。若未配置默认 `gcTime`，其值为 5 分钟。**若要一次更新多个查询并对查询键进行部分匹配，请改用 [`queryClient.setQueriesData`](#queryclient-setqueriesdata)。

> `setQueryData` 与 `query` 的区别在于：`setQueryData` 是同步方法，并假定你已经能够同步获得数据。如果需要异步获取数据，建议重新获取该查询键，或者使用 `query` 处理异步获取。

```tsx
queryClient.setQueryData(queryKey, updater)
```

**选项**

- `queryKey: QueryKey`：[查询键](../framework/react/guides/query-keys.md)
- `updater: TQueryFnData | undefined | ((oldData: TQueryFnData | undefined) => TQueryFnData | undefined)`
  - 传入非函数值时，数据会被更新为该值。
  - 传入函数时，会接收旧数据值并应返回新值。

**使用更新值**

```tsx
setQueryData(queryKey, newData)
```

如果该值为 `undefined`，查询数据不会被更新。

**使用更新函数**

为便于书写，也可以传入 updater 函数。它会接收当前数据并返回新数据：

```tsx
setQueryData(queryKey, (oldData) => newData)
```

如果 updater 函数返回 `undefined`，查询数据不会更新。如果 updater 函数接收到的输入是 `undefined`，你可以返回 `undefined` 以中止更新，从而_不_创建新的缓存条目。

**不可变性**

通过 `setQueryData` 更新数据时，必须使用_不可变_方式。**不要**直接修改 `oldData`，或原地修改通过 `getQueryData` 取出的数据并写回缓存。

## `queryClient.getQueryState`

`getQueryState` 是一个同步函数，可用于获取现有查询的状态。如果查询不存在，将返回 `undefined`。

```tsx
const state = queryClient.getQueryState(queryKey)
console.log(state.dataUpdatedAt)
```

**选项**

- `queryKey: QueryKey`：[查询键](../framework/react/guides/query-keys.md)

## `queryClient.setQueriesData`

`setQueriesData` 是一个同步函数，可通过过滤函数或部分匹配查询键，立即更新多个查询的缓存数据。只会更新与传入的 queryKey 或 queryFilter 匹配的查询，不会创建新的缓存条目。其底层会对每个已有查询调用 [`setQueryData`](#queryclient-setquerydata)。

```tsx
queryClient.setQueriesData(filters, updater)
```

**选项**

- `filters: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)
  - 传入过滤器后，会更新与过滤器匹配的 queryKey。
- `updater: TQueryFnData | (oldData: TQueryFnData | undefined) => TQueryFnData`
  - [setQueryData](#queryclient-setquerydata) 的更新函数或新数据，会应用于每个匹配的 queryKey。

## `queryClient.invalidateQueries`

`invalidateQueries` 可用于根据查询键或查询的其他可访问属性/状态，使缓存中的一个或多个查询失效并重新获取。默认会立即将所有匹配查询标记为失效，并在后台重新获取活跃查询。

- 如果你**不希望活跃查询重新获取**，只想标记为失效，可使用 `refetchType: 'none'`。
- 如果你**也希望非活跃查询重新获取**，可使用 `refetchType: 'all'`。
- 重新获取时会调用 [queryClient.refetchQueries](#queryclient-refetchqueries)。

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

- `filters?: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)
  - `queryKey?: QueryKey`：[查询键](../framework/react/guides/query-keys.md)
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

**说明**

- 与 [`refetchQueries`](#queryclient-refetchqueries) 不同，`invalidateQueries` 会先将匹配的查询标记为失效，然后重新获取 `active` 查询（除非通过 `refetchType` 选项另行指定）。
- 与 [`removeQueries`](#queryclient-removequeries) 不同，`invalidateQueries` 会将匹配的查询保留在缓存中。

## `queryClient.refetchQueries`

`refetchQueries` 可用于按特定条件重新获取查询。

示例：

```tsx
// 重新获取所有查询：
await queryClient.refetchQueries()

// 重新获取所有过期查询：
await queryClient.refetchQueries({ stale: true })

// 重新获取与查询键部分匹配的所有活跃查询：
await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })

// 重新获取与查询键完全匹配的所有活跃查询：
await queryClient.refetchQueries({
  queryKey: ['posts', 1],
  type: 'active',
  exact: true,
})
```

**选项**

- `filters?: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)
- `options?: RefetchOptions`:
  - `throwOnError?: boolean`
    - 设为 `true` 时，如果任一查询重新获取失败，此方法会抛错。
  - `cancelRefetch?: boolean`
    - 默认为 `true`
      - 默认情况下，发起新请求前会先取消当前进行中的请求。
    - 设为 `false` 时，如果已有请求进行中，则不会再发起重新获取。

**返回值**

该函数返回一个 Promise，会在所有查询完成重新获取后 resolve。默认情况下，即使其中某些查询重新获取失败，**也不会**抛错；可通过将 `throwOnError` 设为 `true` 来更改该行为。

**说明**

- 如果一个查询的 observer 全部处于禁用状态，那么这个“disabled”查询永远不会被重新获取。
- 如果一个查询的 observer 全都使用 `staleTime: 'static'`，那么这个“static”查询永远不会被重新获取。
- 与 [`invalidateQueries`](#queryclient-invalidatequeries) 不同，`refetchQueries` 会重新获取所有匹配的查询。

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

- `filters?: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)
- `cancelOptions?: CancelOptions`：[取消选项](../framework/react/guides/query-cancellation.md#cancel-options)

**返回值**

此方法不返回任何内容。

## `queryClient.removeQueries`

`removeQueries` 可用于根据查询键或查询的其他可访问属性/状态，从缓存中移除查询。

```tsx
queryClient.removeQueries({ queryKey, exact: true })
```

**选项**

- `filters?: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)

**返回值**

此方法不返回任何内容。

**说明**

- 与 [`invalidateQueries`](#queryclient-invalidatequeries) 或 [`refetchQueries`](#queryclient-refetchqueries) 不同，`removeQueries` 会从缓存中移除匹配的查询，而不是重新获取它们。

## `queryClient.resetQueries`

`resetQueries` 可用于根据查询键或查询的其他可访问属性/状态，将缓存中的查询重置为初始状态。

它会通知订阅者 &mdash; 不同于会移除全部订阅者的 `clear` &mdash; 并把查询重置到预加载状态 &mdash; 不同于 `invalidateQueries`。如果查询配置了 `initialData`，其数据会重置为该值。如果查询处于活跃状态，它会被重新获取。

```tsx
queryClient.resetQueries({ queryKey, exact: true })
```

**选项**

- `filters?: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)
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

`isFetching` 方法返回一个整数，表示当前缓存中正在获取的查询数量（包括后台获取、加载新页面或加载更多无限查询结果）。

```tsx
if (queryClient.isFetching()) {
  console.log('At least one query is fetching!')
}
```

TanStack Query 还导出了便捷的 [`useIsFetching`](../framework/react/reference/functions/useIsFetching.md) Hook，使你无需手动订阅查询缓存，也能在组件中订阅该状态。

**选项**

- `filters?: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)

**返回值**

该方法返回正在获取的查询数量。

## `queryClient.isMutating`

`isMutating` 方法返回一个整数，表示当前缓存中正在执行的变更数量。

```tsx
if (queryClient.isMutating()) {
  console.log('At least one mutation is fetching!')
}
```

TanStack Query 还导出了便捷的 [`useIsMutating`](../framework/react/reference/functions/useIsMutating.md) Hook，使你无需手动订阅变更缓存，也能在组件中订阅该状态。

**选项**

- `filters: MutationFilters`：[变更过滤器](../framework/react/guides/filters.md#mutation-filters)

**返回值**

该方法返回正在执行的变更数量。

## `queryClient.getDefaultOptions`

`getDefaultOptions` 方法会返回在创建客户端时或通过 `setDefaultOptions` 设置的默认选项。

```tsx
const defaultOptions = queryClient.getDefaultOptions()
```

## `queryClient.setDefaultOptions`

`setDefaultOptions` 方法可用于动态设置此 Query Client 的默认选项。之前定义的默认选项会被覆盖。

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

> 注意：如果有多个查询默认选项与给定的查询键匹配，它们会按照注册顺序合并。
> 参见 [`setQueryDefaults`](#queryclient-setquerydefaults)。

## `queryClient.setQueryDefaults`

`setQueryDefaults` 可用于为特定查询设置默认选项：

```tsx
queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })

function Component() {
  const { data } = useQuery({ queryKey: ['posts'] })
}
```

**选项**

- `queryKey: QueryKey`：[查询键](../framework/react/guides/query-keys.md)
- `options: QueryOptions`

> 如 [`getQueryDefaults`](#queryclient-getquerydefaults) 所述，查询默认选项的注册顺序确实很重要。
> 由于 `getQueryDefaults` 会合并匹配的默认选项，注册顺序应为：从**最通用的键**到**最具体的键**。
> 这样更具体的默认项就能覆盖更通用的默认项。

## `queryClient.getMutationDefaults`

`getMutationDefaults` 方法会返回为特定变更设置的默认选项：

```tsx
const defaultOptions = queryClient.getMutationDefaults(['addPost'])
```

## `queryClient.setMutationDefaults`

`setMutationDefaults` 可用于为特定变更设置默认选项：

```tsx
queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })

function Component() {
  const { data } = useMutation({ mutationKey: ['addPost'] })
}
```

**选项**

- `mutationKey: unknown[]`
- `options: MutationOptions`

> 与 [`setQueryDefaults`](#queryclient-setquerydefaults) 类似，这里的注册顺序同样很重要。

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

可用于恢复因没有网络连接而暂停的变更。

```tsx
queryClient.resumePausedMutations()
```
