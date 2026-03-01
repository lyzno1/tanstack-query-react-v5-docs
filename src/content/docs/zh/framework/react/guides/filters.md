---
id: filters
title: 过滤器
---

<!--
translation-source-path: framework/react/guides/filters.md
translation-source-ref: v5.90.3
translation-source-hash: 6789540681506d95b701e56c6f04dc9808faacb8c9c038429ccd48861b92a067
translation-status: translated
-->


TanStack Query 中有些方法会接收 `QueryFilters` 或 `MutationFilters` 对象。

## `Query Filters`

查询过滤器是一个带条件的对象，用于匹配查询：

```tsx
// Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: ['posts'], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
```

查询过滤器对象支持以下属性：

- `queryKey?: QueryKey`
  - 设置该属性以定义要匹配的查询键。
- `exact?: boolean`
  - 如果你不想按查询键做包含匹配，可以传入 `exact: true`，只返回与传入查询键完全一致的查询。
- `type?: 'active' | 'inactive' | 'all'`
  - 默认为 `all`
  - 设为 `active` 时会匹配活跃查询。
  - 设为 `inactive` 时会匹配非活跃查询。
- `stale?: boolean`
  - 设为 `true` 时会匹配过期查询。
  - 设为 `false` 时会匹配新鲜（未过期）查询。
- `fetchStatus?: FetchStatus`
  - 设为 `fetching` 时会匹配当前正在获取的查询。
  - 设为 `paused` 时会匹配本应获取但已 `paused` 的查询。
  - 设为 `idle` 时会匹配未在获取的查询。
- `predicate?: (query: Query) => boolean`
  - 这个谓词函数会作为所有已匹配查询的最终过滤条件。如果未指定其他过滤器，该函数会对缓存中的每个查询执行判断。

## `Mutation Filters`

变更过滤器是一个带条件的对象，用于匹配变更：

```tsx
// Get the number of all fetching mutations
await queryClient.isMutating()

// Filter mutations by mutationKey
await queryClient.isMutating({ mutationKey: ['post'] })

// Filter mutations using a predicate function
await queryClient.isMutating({
  predicate: (mutation) => mutation.state.variables?.id === 1,
})
```

变更过滤器对象支持以下属性：

- `mutationKey?: MutationKey`
  - 设置该属性以定义要匹配的变更键。
- `exact?: boolean`
  - 如果你不想按变更键做包含匹配，可以传入 `exact: true`，只返回与传入变更键完全一致的变更。
- `status?: MutationStatus`
  - 允许按变更状态过滤。
- `predicate?: (mutation: Mutation) => boolean`
  - 这个谓词函数会作为所有已匹配变更的最终过滤条件。如果未指定其他过滤器，该函数会对缓存中的每个变更执行判断。

## Utils

### `matchQuery`

```tsx
const isMatching = matchQuery(filters, query)
```

返回一个布尔值，用于表示某个查询是否匹配给定的查询过滤条件。

### `matchMutation`

```tsx
const isMatching = matchMutation(filters, mutation)
```

返回一个布尔值，用于表示某个变更是否匹配给定的变更过滤条件。
