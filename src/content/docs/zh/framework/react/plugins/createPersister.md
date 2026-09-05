---
id: createPersister
title: experimental_createQueryPersister
---

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
  - 你可以传入任意符合 `AsyncStorage` 接口的 `storage`。下面示例使用 React Native 的 async-storage。
- 将该 `persister` 作为选项传给查询。既可以将它传入 `QueryClient` 的 `defaultOptions`，也可以传给任意 `useQuery` Hook 实例。
  - 如果将该 `persister` 作为 `defaultOptions` 传入，所有查询都会持久化到提供的 `storage`。还可以通过传入 `filters` 进一步缩小范围。与 `persistClient` 插件不同，这里不会将整个 Query Client 持久化为单个条目，而是分别持久化每个查询，并以查询哈希作为键。
  - 如果只将该 `persister` 提供给某一个 `useQuery` Hook，则只会持久化这个查询。
- 注意：`queryClient.setQueryData()` 操作不会被持久化。这意味着如果你做了乐观更新，并在查询失效之前刷新页面，对查询数据的修改会丢失。参见 https://github.com/TanStack/query/issues/6310

这样便无需存储整个 `QueryClient`，而是可以自行决定应用中哪些内容值得持久化。每个查询都会按需恢复（首次使用该查询时），并在每次执行 `queryFn` 后持久化，因此无需节流。恢复查询后也会遵循 `staleTime`：如果数据被视为过期，恢复后会立即重新获取；如果数据仍然新鲜，则不会执行 `queryFn`。

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
    // 乐观更新为新值
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo])
    // 并将其持久化到存储中
    persister.persistQueryByKey(['todos'], queryClient)
    ...
  },
})
```

### `retrieveQuery<T>(queryHash: string): Promise<T | undefined>`

该函数会尝试通过 `queryHash` 获取已持久化的查询。  
如果 `query` 已过期（`expired`）、buster 不匹配（`busted`）或格式错误（`malformed`），则会将其从存储中移除，并返回 `undefined`。

### `persisterGc(): Promise<void>`

该函数可用于不定期清理存储中已过期、buster 不匹配或格式错误的条目。

要使该函数生效，你的 storage 必须暴露 `entries` 方法，并返回键值元组数组。
例如 `localStorage` 的 `Object.entries(localStorage)`，或 `idb-keyval` 的 `entries`。

### `restoreQueries(queryClient: QueryClient, filters): Promise<void>`

该函数可用于恢复当前由 persister 存储的查询。  
例如应用以离线模式启动时，或者你希望上一会话中的全部或部分数据可以立刻可用，而无需中间 `loading` 状态。

过滤对象支持以下属性：

- `queryKey?: QueryKey`
  - 设置该属性来定义要匹配的查询键。
- `exact?: boolean`
  - 如果你不希望按查询键进行包含式匹配，可传入 `exact: true`，仅返回与你传入查询键完全一致的查询。

要使该函数生效，你的 storage 必须暴露 `entries` 方法，并返回键值元组数组。
例如 `localStorage` 的 `Object.entries(localStorage)`，或 `idb-keyval` 的 `entries`。

### `removeQueries(filters): Promise<void>`

使用 `queryClient.removeQueries` 时，数据仍会保留在 persister 中，需要单独移除。
该函数可用于移除当前由 persister 存储的查询。

过滤对象支持以下属性：

- `queryKey?: QueryKey`
  - 设置该属性来定义要匹配的查询键。
- `exact?: boolean`
  - 如果不想按查询键进行包含式匹配，可以传入 `exact: true` 选项，只处理查询键与你传入的键完全相同的查询。

要使该函数生效，你的 storage 必须暴露 `entries` 方法，并返回键值元组数组。
例如 `localStorage` 的 `Object.entries(localStorage)`，或 `idb-keyval` 的 `entries`。

## API

### `experimental_createQueryPersister`

```tsx
experimental_createQueryPersister(options: StoragePersisterOptions)
```

#### `Options`

```tsx
export interface StoragePersisterOptions {
  /** 用于在缓存中设置和获取条目的存储客户端。
   * SSR 环境请传入 `undefined`。
   */
  storage: AsyncStorage | Storage | undefined | null
  /**
   * 如何序列化要写入存储的数据。
   * @default `JSON.stringify`
   */
  serialize?: (persistedQuery: PersistedQuery) => string
  /**
   * 如何反序列化存储中的数据。
   * @default `JSON.parse`
   */
  deserialize?: (cachedString: string) => PersistedQuery
  /**
   * 唯一字符串。现有缓存的 buster 字符串与其不同时，
   * 可用它强制废弃这些缓存。
   */
  buster?: string
  /**
   * 缓存允许保留的最长时间（毫秒）。
   * 如果找到的持久化缓存早于此时间，
   * 该缓存将被丢弃。
   * @default 24 小时
   */
  maxAge?: number
  /**
   * 存储键使用的前缀。
   * 存储键由前缀和查询哈希组成，格式为 `prefix-queryHash`。
   */
  prefix?: string
  /**
   * 设为 `true` 时，如果成功恢复查询后数据已经过期，查询会重新获取。
   * 设为 `false` 时，成功恢复查询后不会重新获取。
   * 设为 `'always'` 时，成功恢复查询后始终重新获取。
   * 默认为 `true`。
   */
  refetchOnRestore?: boolean | 'always'
  /**
   * 用于缩小需要持久化的查询范围的过滤器。
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
  refetchOnRestore = true,
}
```
