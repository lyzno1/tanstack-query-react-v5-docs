---
id: createAsyncStoragePersister
title: createAsyncStoragePersister
---

<!--
translation-source-path: framework/react/plugins/createAsyncStoragePersister.md
translation-source-ref: v5.90.3
translation-source-hash: d3148d03de20057a3a35f575be7f6fb4a25f680bdd3d7ef626ea2298f55abbe2
translation-status: translated
-->


## 安装

该工具以独立包形式提供，可通过 `'@tanstack/query-async-storage-persister'` 导入。

```bash
npm install @tanstack/query-async-storage-persister @tanstack/react-query-persist-client
```

或

```bash
pnpm add @tanstack/query-async-storage-persister @tanstack/react-query-persist-client
```

或

```bash
yarn add @tanstack/query-async-storage-persister @tanstack/react-query-persist-client
```

或

```bash
bun add @tanstack/query-async-storage-persister @tanstack/react-query-persist-client
```

## 用法

- 导入 `createAsyncStoragePersister` 函数
- 创建一个新的 asyncStoragePersister
  - 你可以传入任意符合 `AsyncStorage` 接口的 `storage`。下面示例使用的是 React Native 的 async-storage。
  - 像 `window.localStorage` 这样同步读写的 storage 也符合 `AsyncStorage` 接口，因此同样可以与 `createAsyncStoragePersister` 搭配使用。
- 使用 [`PersistQueryClientProvider`](../persistQueryClient.md#persistqueryclientprovider) 组件包裹你的应用。

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

const Root = () => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister: asyncStoragePersister }}
  >
    <App />
  </PersistQueryClientProvider>
)

export default Root
```

## 重试

重试机制与 [SyncStoragePersister](../createSyncStoragePersister.md) 相同，不同点是这里的重试也可以是异步的。你也可以使用所有预定义的重试处理器。

## API

### `createAsyncStoragePersister`

调用此函数可创建一个 asyncStoragePersister，后续可与 `persistQueryClient` 搭配使用。

```tsx
createAsyncStoragePersister(options: CreateAsyncStoragePersisterOptions)
```

### `Options`

```tsx
interface CreateAsyncStoragePersisterOptions {
  /** The storage client used for setting an retrieving items from cache */
  storage: AsyncStorage | undefined | null
  /** The key to use when storing the cache to localStorage */
  key?: string
  /** To avoid localStorage spamming,
   * pass a time in ms to throttle saving the cache to disk */
  throttleTime?: number
  /** How to serialize the data to storage */
  serialize?: (client: PersistedClient) => string
  /** How to deserialize the data from storage */
  deserialize?: (cachedString: string) => PersistedClient
  /** How to retry persistence on error **/
  retry?: AsyncPersistRetryer
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
  key = `REACT_QUERY_OFFLINE_CACHE`,
  throttleTime = 1000,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}
```
