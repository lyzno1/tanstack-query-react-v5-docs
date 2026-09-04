---
id: useMutationState
title: useMutationState
redirect_from:
  - framework/react/reference/useMutationState
---

<!--
translation-source-path: framework/react/reference/functions/useMutationState.md
translation-source-ref: main
translation-source-hash: dfbaa45813eb48e2fd2f63a1300ac4f5c7c6481fd47c307c9d23ff8694831d5e
translation-status: translated
-->


```ts
function useMutationState<TResult, TMutation>(options, queryClient?): TResult[];
```

定义于： [react-query/src/useMutationState.ts:157](https://github.com/TanStack/query/blob/main/packages/react-query/src/useMutationState.ts#L157)

`useMutationState` 是一个可以访问 `MutationCache` 中所有变更的 Hook。可以传入 `filters`
（MutationFilters）缩小变更范围，并通过 `select` 转换变更状态。

## 类型参数

### TResult

`TResult` = `MutationState`\<`unknown`, `Error`, `unknown`, `unknown`\>

### TMutation

`TMutation` *extends* `Mutation`\<`any`, `any`, `any`, `any`\> = `MutationTypeFromResult`\<`TResult`\>

## 参数

### options

`MutationStateOptions`\<`TResult`, `TMutation`\> = `{}`

用于缩小变更匹配范围的 `filters`，以及用于转换变更状态的可选 `select`。

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

`TResult`[]

一个数组，其中包含 `select` 为每个匹配变更所返回的值。

## 示例

获取所有正在运行的变更的全部变量：
```tsx
import { useMutationState } from '@tanstack/react-query'

function PendingPosts() {
  const pendingVariables = useMutationState({
    filters: { status: 'pending' },
    select: (mutation) => mutation.state.variables,
  })

  return <>正在保存 {pendingVariables.length} 篇文章……</>
}
```

通过 `mutationKey` 获取特定变更的全部数据：
```tsx
import { useMutation, useMutationState } from '@tanstack/react-query'

const mutationKey = ['posts']

function Posts() {
  // 某个需要获取其状态的变更
  const mutation = useMutation({
    mutationKey,
    mutationFn: createPosts,
  })

  const savedPosts = useMutationState({
    // 此变更键需要与给定变更的变更键匹配（见上文）
    filters: { mutationKey, status: 'success' },
    select: (mutation) => mutation.state.data,
  })

  return (
    <button onClick={() => mutation.mutate(['New Post'])}>
      创建文章（目前已保存 {savedPosts.length} 篇）
    </button>
  )
}
```

通过 `mutationKey` 访问最近一次成功变更的数据。每次调用 `mutate` 都会在变更缓存中添加一个新条目，
并保留 `gcTime` 毫秒。配合下面的 `status: 'success'` 过滤器，读取 `useMutationState` 返回的最后一项，
即可获得最近一次成功调用的结果：
```tsx
import { useMutationState } from '@tanstack/react-query'

function LatestPost() {
  const savedPosts = useMutationState({
    filters: { mutationKey: ['posts'], status: 'success' },
    select: (mutation) => mutation.state.data,
  })

  const latestSavedPost = savedPosts[savedPosts.length - 1]

  return <>{latestSavedPost ? '已保存' : '尚未保存'}</>
}
```
