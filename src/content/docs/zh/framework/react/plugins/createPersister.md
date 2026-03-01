---
id: createPersister
title: experimental_createQueryPersister
---

<!--
translation-source-path: framework/react/plugins/createPersister.md
translation-source-ref: v5.90.3
translation-source-hash: 62b1d064d4fcd4f3dd0e7649bd40e4cfdecb3039b7e18b42ce85b32a83601c24
translation-status: translated
-->


## 安装

该工具以独立包形式提供，可通过 `'@tanstack/query-persist-client-core'` 导入。

```bash
npm install @tanstack/query-persist-client-core
```

或

```bash
pnpm add @tanstack/query-persist-client-core
```

或

```bash
yarn add @tanstack/query-persist-client-core
```

或

```bash
bun add @tanstack/query-persist-client-core
```

> 注意：该工具也包含在 `@tanstack/react-query-persist-client` 包中，因此如果你已经在使用该包，就不需要单独安装。

## 用法

- 导入 `experimental_createQueryPersister` 函数
- 创建一个新的 `experimental_createQueryPersister`
  - 你可以传入任意符合 `AsyncStorage` 接口的 `storage`。下面示例使用的是 React Native 的 async-storage。
- 将该 `persister` 作为选项传给你的 Query。可以在 `QueryClient` 的 `defaultOptions` 中传入，也可以在任意 `useQuery` hook 实例上单独传入。
  - 如果你将该 `persister` 作为 `defaultOptions` 传入，所有查询都会被持久化到提供的 `storage`。你还可以通过传入 `filters` 进一步缩小范围。与 `persistClient` 插件不同的是，这里不会把整个 query client 作为单个条目持久化，而是每个查询分别持久化，并使用查询 hash 作为 key。
  - 如果你只将该 `persister` 提供给某一个 `useQuery` hook，则只会持久化这一个 Query。
- 注意：`queryClient.setQueryData()` 操作不会被持久化。这意味着如果你做了乐观更新，并在查询失效之前刷新页面，对查询数据的修改会丢失。参见 https://github.com/TanStack/query/issues/6310

这样你就不需要存储整个 `QueryClient`，而是可以自行决定应用中哪些内容值得持久化。每个查询都会按需恢复（首次使用该 Query 时）并在持久化（每次执行 `queryFn` 之后）时写入，因此无需节流。恢复后也会遵循 `staleTime`：如果数据被视为 `stale`，恢复后会立刻重新获取；如果数据是 `fresh`，则不会执行 `queryFn`。

将 Query 从内存中进行垃圾回收**不会**影响已持久化的数据。这意味着可以缩短 Query 在内存中的保留时间，以提升**内存效率**。下次使用时，它们会再次从持久化存储中恢复。

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient } from '@tanstack/react-query'
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core'

const persister = experimental_createQueryPersister({
  storage: AsyncStorage,
  maxAge: 1000 * 60 * 60 * 12, // 12 hours
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 30, // 30 seconds
      persister: persister.persisterFn,
    },
  },
})
```

### 调整后的默认行为

`createPersister` 插件在技术上是对 `queryFn` 的包装，因此如果 `queryFn` 不执行，就不会进行恢复。也就是说，它充当了 Query 与网络之间的缓存层。因此，当使用 persister 时，`networkMode` 默认是 `'offlineFirst'`，这样即使没有网络连接，也可以从持久化存储中恢复。

## 附加工具

调用 `experimental_createQueryPersister` 时，除了 `persisterFn` 外，还会返回一些附加工具函数，便于实现业务层功能。

### `persistQueryByKey(queryKey: QueryKey, queryClient: QueryClient): Promise<void>`

该函数会把 `Query` 持久化到创建 persister 时定义的 storage 和 key。  
该工具可与 `setQueryData` 配合使用，以在不等待失效的情况下，将乐观更新持久化到存储中。

```tsx
const persister = experimental_createQueryPersister({
  storage: AsyncStorage,
  maxAge: 1000 * 60 * 60 * 12, // 12 hours
})

const queryClient = useQueryClient()

useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    ...
    // Optimistically update to the new value
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo])
    // And persist it to storage
    persister.persistQueryByKey(['todos'], queryClient)
    ...
  },
})
```

### `retrieveQuery<T>(queryHash: string): Promise<T | undefined>`

该函数会尝试通过 `queryHash` 获取已持久化的查询。  
如果 `query` 已 `expired`、`busted` 或 `malformed`，则会将其从存储中移除，并返回 `undefined`。

### `persisterGc(): Promise<void>`

该函数可用于间歇性清理存储中 `expired`、`busted` 或 `malformed` 的条目。

要使该函数生效，你的 storage 必须暴露 `entries` 方法，并返回 `key-value tuple array`。  
例如 `localStorage` 的 `Object.entries(localStorage)`，或 `idb-keyval` 的 `entries`。

### `restoreQueries(queryClient: QueryClient, filters): Promise<void>`

该函数可用于恢复当前由 persister 存储的查询。  
例如应用以离线模式启动时，或者你希望上一会话中的全部或部分数据可以立刻可用，而无需中间 `loading` 状态。

过滤对象支持以下属性：

- `queryKey?: QueryKey`
  - 设置该属性来定义要匹配的查询键。
- `exact?: boolean`
  - 如果你不希望按查询键进行包含式匹配，可传入 `exact: true`，仅返回与你传入查询键完全一致的查询。

要使该函数生效，你的 storage 必须暴露 `entries` 方法，并返回 `key-value tuple array`。  
例如 `localStorage` 的 `Object.entries(localStorage)`，或 `idb-keyval` 的 `entries`。

## API

### `experimental_createQueryPersister`

```tsx
experimental_createQueryPersister(options: StoragePersisterOptions)
```

#### `Options`

```tsx
export interface StoragePersisterOptions {
  /** The storage client used for setting and retrieving items from cache.
   * For SSR pass in `undefined`.
   */
  storage: AsyncStorage | Storage | undefined | null
  /**
   * How to serialize the data to storage.
   * @default `JSON.stringify`
   */
  serialize?: (persistedQuery: PersistedQuery) => string
  /**
   * How to deserialize the data from storage.
   * @default `JSON.parse`
   */
  deserialize?: (cachedString: string) => PersistedQuery
  /**
   * A unique string that can be used to forcefully invalidate existing caches,
   * if they do not share the same buster string
   */
  buster?: string
  /**
   * The max-allowed age of the cache in milliseconds.
   * If a persisted cache is found that is older than this
   * time, it will be discarded
   * @default 24 hours
   */
  maxAge?: number
  /**
   * Prefix to be used for storage key.
   * Storage key is a combination of prefix and query hash in a form of `prefix-queryHash`.
   */
  prefix?: string
  /**
   * Filters to narrow down which Queries should be persisted.
   */
  filters?: QueryFilters
}

interface AsyncStorage<TStorageValue = string> {
  getItem: (key: string) => MaybePromise<TStorageValue | undefined | null>
  setItem: (key: string, value: TStorageValue) => MaybePromise<unknown>
  removeItem: (key: string) => MaybePromise<void>
  entries?: () => MaybePromise<Array<[key: string, value: TStorageValue]>>
}
```

默认选项为：

```tsx
{
  prefix = 'tanstack-query',
  maxAge = 1000 * 60 * 60 * 24,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}
```
