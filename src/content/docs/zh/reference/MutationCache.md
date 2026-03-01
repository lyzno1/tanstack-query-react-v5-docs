---
id: MutationCache
title: MutationCache
---

<!--
translation-source-path: reference/MutationCache.md
translation-source-ref: v5.90.3
translation-source-hash: 8f6964ee32b5ca01b1dc6d2ce99792dcf3d6abf6244a37216ba87a003e253e11
translation-status: translated
-->


`MutationCache` 是用于存储变更（mutation）的缓存。

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

- [`getAll`](#mutationcachegetall)
- [`subscribe`](#mutationcachesubscribe)
- [`clear`](#mutationcacheclear)

**选项**

- `onError?: (error: unknown, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 当某个 mutation 出错时会调用此函数。
  - 如果返回 Promise，会等待其完成。
- `onSuccess?: (data: unknown, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 当某个 mutation 成功时会调用此函数。
  - 如果返回 Promise，会等待其完成。
- `onSettled?: (data: unknown | undefined, error: unknown | null, variables: unknown, onMutateResult: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 当某个 mutation 完成（无论成功还是失败）时会调用此函数。
  - 如果返回 Promise，会等待其完成。
- `onMutate?: (variables: unknown, mutation: Mutation, mutationFnContext: MutationFunctionContext) => Promise<unknown> | unknown`
  - 可选
  - 在某个 mutation 执行前会调用此函数。
  - 如果返回 Promise，会等待其完成。

## Global callbacks

MutationCache 上的 `onError`、`onSuccess`、`onSettled` 和 `onMutate` 回调可用于在全局层面处理这些事件。它们与 QueryClient 的 `defaultOptions` 不同，因为：

- `defaultOptions` 可被每个 Mutation 覆盖，而全局回调**总会**被调用。
- `onMutate` 不允许返回结果。

## `mutationCache.getAll`

`getAll` 会返回缓存中的所有 mutation。

> 注意：这通常不是大多数应用所必需的，但在少数需要更多 mutation 信息的场景下会很有帮助。

```tsx
const mutations = mutationCache.getAll()
```

**返回值**

- `Mutation[]`
  - 缓存中的 Mutation 实例

## `mutationCache.subscribe`

`subscribe` 可用于订阅整个 mutation cache，并在缓存发生安全且已知的更新时收到通知，例如 mutation 状态变化，或 mutation 被更新、添加、移除。

```tsx
const callback = (event) => {
  console.log(event.type, event.mutation)
}

const unsubscribe = mutationCache.subscribe(callback)
```

**选项**

- `callback: (mutation?: MutationCacheNotifyEvent) => void`
  - 每当 mutation cache 更新时，都会调用此函数。

**返回值**

- `unsubscribe: Function => void`
  - 该函数用于取消 mutation cache 的回调订阅。

## `mutationCache.clear`

`clear` 可用于完全清空缓存并重新开始。

```tsx
mutationCache.clear()
```
