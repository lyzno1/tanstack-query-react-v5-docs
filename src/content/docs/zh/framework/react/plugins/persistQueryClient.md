---
id: persistQueryClient
title: persistQueryClient
---

<!--
translation-source-path: framework/react/plugins/persistQueryClient.md
translation-source-ref: v5.90.3
translation-source-hash: f8ab3a7f119a8bb3905826cc00aa7aab87838dbbb04d7dc842e9eecdc1130734
translation-status: translated
-->


这是一组用于与 “persister” 交互的工具。persister 可以保存你的 queryClient 供后续使用。你可以使用不同的 **persister**，将 client 和缓存存入不同的存储层。

## 构建 Persister

- [createSyncStoragePersister](../createSyncStoragePersister.md)
- [createAsyncStoragePersister](../createAsyncStoragePersister.md)
- [创建自定义 persister](#persisters)

## 工作原理

**重要**：要让持久化正常工作，你通常需要给 `QueryClient` 传入 `gcTime` 值，在水合时覆盖默认值（如上所示）。

如果在创建 `QueryClient` 实例时未设置该值，水合时默认会使用 `300000`（5 分钟），并在 5 分钟无活动后丢弃已存储的缓存。这是默认的垃圾回收行为。

它应设置为与 persistQueryClient 的 `maxAge` 选项相同或更大。例如，如果 `maxAge` 是 24 小时（默认值），则 `gcTime` 应为 24 小时或更大。如果 `gcTime` 小于 `maxAge`，垃圾回收会更早触发，导致存储缓存比预期更早被丢弃。

你也可以把它设为 `Infinity` 来完全禁用垃圾回收行为。

受 JavaScript 限制影响，`gcTime` 的最大允许值大约是 [24 天](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value)。不过可以通过 [timeoutManager.setTimeoutProvider](../../../../reference/timeoutManager.md#timeoutmanagersettimeoutprovider) 绕过该限制。

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})
```

### 缓存失效（Cache Busting）

有时你可能会对应用或数据做出变更，从而立刻使所有缓存数据失效。发生这种情况时，你可以传入 `buster` 字符串选项。如果找到的缓存不带该 `buster` 字符串，就会被丢弃。以下函数都接受该选项：

```tsx
persistQueryClient({ queryClient, persister, buster: buildHash })
persistQueryClientSave({ queryClient, persister, buster: buildHash })
persistQueryClientRestore({ queryClient, persister, buster: buildHash })
```

### 移除

如果发现的数据属于以下任意情况：

1. 已过期（见 `maxAge`）
2. 已失效（见 `buster`）
3. 出错（例如：`throws ...`）
4. 为空（例如：`undefined`）

则会调用 persister 的 `removeClient()`，缓存会被立即丢弃。

## API

### `persistQueryClientSave`

- 你的 query/mutation 会被 [`dehydrate`](../../reference/hydration.md#dehydrate) 并通过你提供的 persister 存储。
- `createSyncStoragePersister` 和 `createAsyncStoragePersister` 会将该操作节流为最多每秒执行一次，以减少可能昂贵的写入开销。可查看它们的文档了解如何自定义节流时间。

你可以用它在你选择的时机显式持久化缓存。

```tsx
persistQueryClientSave({
  queryClient,
  persister,
  buster = '',
  dehydrateOptions = undefined,
})
```

### `persistQueryClientSubscribe`

当 `queryClient` 的缓存发生变化时，执行 `persistQueryClientSave`。例如：用户登录并勾选 “Remember me” 时，你可以启动该 `subscribe`。

- 它会返回一个 `unsubscribe` 函数，你可以用它停止监听，从而结束对持久化缓存的更新。
- 如果你希望在 `unsubscribe` 之后清除已持久化缓存，可以向 `persistQueryClientRestore` 传一个新的 `buster`，这会触发 persister 的 `removeClient` 函数并丢弃持久化缓存。

```tsx
persistQueryClientSubscribe({
  queryClient,
  persister,
  buster = '',
  dehydrateOptions = undefined,
})
```

### `persistQueryClientRestore`

- 尝试将 persister 中之前持久化的、已脱水（dehydrated）的 query/mutation 缓存恢复到传入 query client 的查询缓存中。
- 如果找到的缓存超过 `maxAge`（默认 24 小时），它会被丢弃。该时长可按需自定义。

你可以用它在你选择的时机恢复缓存。

```tsx
persistQueryClientRestore({
  queryClient,
  persister,
  maxAge = 1000 * 60 * 60 * 24, // 24 hours
  buster = '',
  hydrateOptions = undefined,
})
```

### `persistQueryClient`

执行以下操作：

1. 立即恢复任何已持久化缓存（[见 `persistQueryClientRestore`](#persistqueryclientrestore)）
2. 订阅查询缓存并返回 `unsubscribe` 函数（[见 `persistQueryClientSubscribe`](#persistqueryclientsubscribe)）。

该功能继承自 3.x 版本。

```tsx
persistQueryClient({
  queryClient,
  persister,
  maxAge = 1000 * 60 * 60 * 24, // 24 hours
  buster = '',
  hydrateOptions = undefined,
  dehydrateOptions = undefined,
})
```

### `Options`

可用选项如下：

```tsx
interface PersistQueryClientOptions {
  /** The QueryClient to persist */
  queryClient: QueryClient
  /** The Persister interface for storing and restoring the cache
   * to/from a persisted location */
  persister: Persister
  /** The max-allowed age of the cache in milliseconds.
   * If a persisted cache is found that is older than this
   * time, it will be **silently** discarded
   * (defaults to 24 hours) */
  maxAge?: number
  /** A unique string that can be used to forcefully
   * invalidate existing caches if they do not share the same buster string */
  buster?: string
  /** The options passed to the hydrate function
   * Not used on `persistQueryClientSave` or `persistQueryClientSubscribe` */
  hydrateOptions?: HydrateOptions
  /** The options passed to the dehydrate function
   * Not used on `persistQueryClientRestore` */
  dehydrateOptions?: DehydrateOptions
}
```

实际上有三个可用接口：

- `PersistedQueryClientSaveOptions` 用于 `persistQueryClientSave` 和 `persistQueryClientSubscribe`（不使用 `hydrateOptions`）。
- `PersistedQueryClientRestoreOptions` 用于 `persistQueryClientRestore`（不使用 `dehydrateOptions`）。
- `PersistQueryClientOptions` 用于 `persistQueryClient`

## 与 React 一起使用

[persistQueryClient](#persistQueryClient) 会尝试恢复缓存，并自动订阅后续变化，从而将 client 同步到所提供的存储。

但恢复过程是异步的，因为 persister 天生都是异步的。这意味着如果你在恢复期间渲染 App，当某个查询同时挂载并请求时，可能会出现竞态条件。

另外，如果你在 React 组件生命周期之外订阅变化，就无法取消订阅：

```tsx
// 🚨 never unsubscribes from syncing
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
})

// 🚨 happens at the same time as restoring
ReactDOM.createRoot(rootElement).render(<App />)
```

### PersistQueryClientProvider

针对这个用例，你可以使用 `PersistQueryClientProvider`。它会确保按 React 组件生命周期正确地订阅/取消订阅，也会确保在恢复尚未完成时，查询不会开始请求。查询仍会渲染，但在数据恢复前会保持在 `fetchingState: 'idle'`。恢复完成后，除非恢复的数据足够 _fresh_，否则会重新获取，且会遵循 _initialData_。它可以用来_替代_普通的 [QueryClientProvider](../../reference/QueryClientProvider.md)：

```tsx
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})

ReactDOM.createRoot(rootElement).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
  >
    <App />
  </PersistQueryClientProvider>,
)
```

#### Props

`PersistQueryClientProvider` 接收与 [QueryClientProvider](../../reference/QueryClientProvider.md) 相同的 props，另外还有：

- `persistOptions: PersistQueryClientOptions`
  - 你可传给 [persistQueryClient](#persistqueryclient) 的所有[选项](#options)，但不包含 QueryClient 本身
- `onSuccess?: () => Promise<unknown> | unknown`
  - 可选
  - 初次恢复完成时会被调用
  - 可用于 [resumePausedMutations](../../../../reference/QueryClient.md#queryclientresumepausedmutations)
  - 如果返回 Promise，会等待其完成；在此之前恢复仍视为进行中
- `onError?: () => Promise<unknown> | unknown`
  - 可选
  - 恢复过程中抛出错误时会被调用
  - 如果返回 Promise，会等待其完成

### useIsRestoring

如果你在使用 `PersistQueryClientProvider`，还可以配合 `useIsRestoring` hook 检查当前是否正在恢复。`useQuery` 及其相关 hook 在内部也会检查这一状态，以避免恢复与查询挂载之间的竞态条件。

## Persisters

### Persisters Interface

Persister 的接口如下：

```tsx
export interface Persister {
  persistClient(persistClient: PersistedClient): Promisable<void>
  restoreClient(): Promisable<PersistedClient | undefined>
  removeClient(): Promisable<void>
}
```

Persisted Client 条目的接口如下：

```tsx
export interface PersistedClient {
  timestamp: number
  buster: string
  clientState: DehydratedState
}
```

你可以导入这些类型（用于构建 persister）：

```tsx
import {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client'
```

### 构建 Persister

你可以按任意方式实现持久化。以下是一个构建 [Indexed DB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) persister 的示例。相比 `Web Storage API`，Indexed DB 更快、可存储超过 5MB，并且不需要序列化。这意味着它可以直接存储 JavaScript 原生类型，比如 `Date` 和 `File`。

```tsx
import { get, set, del } from 'idb-keyval'
import {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client'

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client)
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey)
    },
    removeClient: async () => {
      await del(idbValidKey)
    },
  } satisfies Persister
}
```
