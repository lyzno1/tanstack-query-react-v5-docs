---
id: MutationCache
title: MutationCache
redirect_from:
  - framework/react/reference/MutationCache
---

<!--
translation-source-path: reference/MutationCache.md
translation-source-ref: main
translation-source-hash: 86c01ebf1703f84bcca2acf3378f123f3bab30dec675def8da9b47f0f5790856
translation-status: translated
-->


`MutationCache` 用于存储变更。

**通常你不会直接与 MutationCache 交互，而是通过 `QueryClient` 来操作。**

```tsx
import { MutationCache } from '@tanstack/react-query'

const mutationCache = new MutationCache({
  onError: (error) => {
    console.log(error)
  },
  onSuccess: (data) => {
    console.log(data)
  },
})
```

它提供的方法有：

- [`getAll`](#mutationcache-getall)
- [`subscribe`](#mutationcache-subscribe)
- [`clear`](#mutationcache-clear)

**选项**

- `onError?: (error: unknown, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 当某个变更出错时会调用此函数。
  - 如果返回 Promise，会等待其完成。
- `onSuccess?: (data: unknown, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 当某个变更成功时会调用此函数。
  - 如果返回 Promise，会等待其完成。
- `onSettled?: (data: unknown | undefined, error: unknown | null, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 当某个变更结束（无论成功还是出错）时会调用此函数。
  - 如果返回 Promise，会等待其完成。
- `onMutate?: (variables: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 在某个变更执行前会调用此函数。
  - 如果返回 Promise，会等待其完成。

## 全局回调

MutationCache 上的 `onError`、`onSuccess`、`onSettled` 和 `onMutate` 回调可用于在全局层面处理这些事件。它们与 QueryClient 的 `defaultOptions` 不同，因为：

- `defaultOptions` 可被每个 Mutation 覆盖，而全局回调**总会**被调用。
- `onMutate` 不允许返回结果。

## `mutationCache.getAll`

`getAll` 会返回缓存中的所有变更。

> 注意：大多数应用通常不需要此方法，但在少数需要了解更多变更信息的场景下，它会很有帮助。

```tsx
const mutations = mutationCache.getAll()
```

**返回值**

- `Mutation[]`
  - 缓存中的 Mutation 实例

## `mutationCache.subscribe`

`subscribe` 可用于订阅整个变更缓存，并在缓存发生安全且已知的更新时收到通知，例如变更状态发生变化，或者变更被更新、添加或移除。

```tsx
const callback = (event) => {
  console.log(event.type, event.mutation)
}

const unsubscribe = mutationCache.subscribe(callback)
```

**选项**

- `callback: (mutation?: MutationCacheNotifyEvent) => void`
  - 每当变更缓存更新时，都会调用此函数。

**返回值**

- `unsubscribe: Function => void`
  - 该函数用于取消回调对变更缓存的订阅。

## `mutationCache.clear`

`clear` 可用于完全清空缓存并重新开始。

```tsx
mutationCache.clear()
```
