---
id: useMutationState
title: useMutationState
---

<!--
translation-source-path: framework/react/reference/useMutationState.md
translation-source-ref: v5.90.3
translation-source-hash: 0ac2ff1e7a95d3b5a211f92824e467ad1a9968328ac4fd88cb22467a6279d530
translation-status: translated
-->


`useMutationState` 是一个 Hook，可让你访问 `MutationCache` 中的所有变更。你可以传入 `filters` 来缩小变更范围，也可以用 `select` 转换变更状态。

**示例 1：获取所有运行中变更的 variables**

```tsx
import { useMutationState } from '@tanstack/react-query'

const variables = useMutationState({
  filters: { status: 'pending' },
  select: (mutation) => mutation.state.variables,
})
```

**示例 2：通过 `mutationKey` 获取特定变更的全部数据**

```tsx
import { useMutation, useMutationState } from '@tanstack/react-query'

const mutationKey = ['posts']

// 我们希望获取其状态的某个变更
const mutation = useMutation({
  mutationKey,
  mutationFn: (newPost) => {
    return axios.post('/posts', newPost)
  },
})

const data = useMutationState({
  // 这里的 mutation key 需要与给定变更的 mutation key 匹配（见上方）
  filters: { mutationKey },
  select: (mutation) => mutation.state.data,
})
```

**示例 3：通过 `mutationKey` 访问最新一次变更数据**。
每次调用 `mutate`，都会向变更缓存新增一条记录，保留 `gcTime` 毫秒。

要访问最新一次调用结果，你可以读取 `useMutationState` 返回数组中的最后一项。

```tsx
import { useMutation, useMutationState } from '@tanstack/react-query'

const mutationKey = ['posts']

// 我们希望获取其状态的某个变更
const mutation = useMutation({
  mutationKey,
  mutationFn: (newPost) => {
    return axios.post('/posts', newPost)
  },
})

const data = useMutationState({
  // 这里的 mutation key 需要与给定变更的 mutation key 匹配（见上方）
  filters: { mutationKey },
  select: (mutation) => mutation.state.data,
})

// 最新的变更数据
const latest = data[data.length - 1]
```

**选项**

- `options`
  - `filters?: MutationFilters`：[Mutation Filters](../../guides/filters.md#mutation-filters)
  - `select?: (mutation: Mutation) => TResult`
    - 使用此项可转换变更状态。
- `queryClient?: QueryClient`
  - 使用此项可传入自定义 QueryClient。否则会使用最近上下文中的实例。

**返回值**

- `Array<TResult>`
  - 返回一个数组，包含每个匹配变更经过 `select` 处理后的结果。
