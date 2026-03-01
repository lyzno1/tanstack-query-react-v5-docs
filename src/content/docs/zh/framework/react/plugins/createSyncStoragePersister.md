---
id: createSyncStoragePersister
title: createSyncStoragePersister
---

<!--
translation-source-path: framework/react/plugins/createSyncStoragePersister.md
translation-source-ref: v5.90.3
translation-source-hash: 40ba179988da3dc593d8360cb2cc147efc023bebbeb4111e0f57b2202b6f612a
translation-status: translated
-->


## 已弃用

该插件已弃用，并将在下一个大版本中移除。
你可以直接改用 ['@tanstack/query-async-storage-persister'](../createAsyncStoragePersister.md)。

## 安装

该工具以独立包形式提供，可通过 `'@tanstack/query-sync-storage-persister'` 导入。

```bash
npm install @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

或

```bash
pnpm add @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

或

```bash
yarn add @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

或

```bash
bun add @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

## 用法

- 导入 `createSyncStoragePersister` 函数
- 创建一个新的 syncStoragePersister
- 将它传给 [`persistQueryClient`](../persistQueryClient.md) 函数

```tsx
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})
// const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
})
```

## 重试

持久化可能失败，例如待写入数据超过了存储可用空间。可以通过向 persister 提供 `retry` 函数来优雅处理错误。

`retry` 函数会接收尝试保存的 `persistedClient`、`error` 和 `errorCount`。它需要返回一个_新的_ `PersistedClient` 以便再次尝试持久化。如果返回 _undefined_，则不会再继续尝试。

```tsx
export type PersistRetryer = (props: {
  persistedClient: PersistedClient
  error: Error
  errorCount: number
}) => PersistedClient | undefined
```

### 预定义策略

默认情况下不会进行重试。你可以使用预定义策略之一来处理重试。它们可通过 `'@tanstack/react-query-persist-client'` 导入：

- `removeOldestQuery`
  - 会返回一个新的 `PersistedClient`，并移除其中最旧的查询。

```tsx
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  retry: removeOldestQuery,
})
```

## API

### `createSyncStoragePersister`

调用此函数可创建一个 syncStoragePersister，后续可与 `persistQueryClient` 搭配使用。

```tsx
createSyncStoragePersister(options: CreateSyncStoragePersisterOptions)
```

### `Options`

```tsx
interface CreateSyncStoragePersisterOptions {
  /** The storage client used for setting an retrieving items from cache (window.localStorage or window.sessionStorage) */
  storage: Storage | undefined | null
  /** The key to use when storing the cache */
  key?: string
  /** To avoid spamming,
   * pass a time in ms to throttle saving the cache to disk */
  throttleTime?: number
  /** How to serialize the data to storage */
  serialize?: (client: PersistedClient) => string
  /** How to deserialize the data from storage */
  deserialize?: (cachedString: string) => PersistedClient
  /** How to retry persistence on error **/
  retry?: PersistRetryer
}
```

默认选项为：

```tsx
{
  key = `REACT_QUERY_OFFLINE_CACHE`,
  throttleTime = 1000,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}
```

#### `serialize` 与 `deserialize` 选项

`localStorage` 可存储的数据量是有限的。
如果你需要在 `localStorage` 中存储更多数据，可以通过类似 [lz-string](https://github.com/pieroxy/lz-string/) 的库重写 `serialize` 和 `deserialize` 函数，对数据进行压缩与解压。

```tsx
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { compress, decompress } from 'lz-string'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
})

persistQueryClient({
  queryClient: queryClient,
  persister: createSyncStoragePersister({
    storage: window.localStorage,
    serialize: (data) => compress(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decompress(data)),
  }),
  maxAge: Infinity,
})
```
