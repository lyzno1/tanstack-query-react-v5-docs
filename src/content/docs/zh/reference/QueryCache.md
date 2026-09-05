---
id: QueryCache
title: QueryCache
redirect_from:
  - framework/react/reference/QueryCache
---

`QueryCache` 是 TanStack Query 的缓存存储机制。它会保存其包含的查询的所有数据、元信息和状态。

**通常你不会直接与 QueryCache 交互，而是通过 `QueryClient` 操作某个具体缓存。**

```tsx
import { QueryCache } from '@tanstack/react-query'

const queryCache = new QueryCache({
  onError: (error) => {
    console.log(error)
  },
  onSuccess: (data) => {
    console.log(data)
  },
  onSettled: (data, error) => {
    console.log(data, error)
  },
})

const query = queryCache.find({ queryKey: ['posts'] })
```

它提供的方法有：

- [`queryCache.find`](#querycache-find)
- [`queryCache.findAll`](#querycache-findall)
- [`queryCache.subscribe`](#querycache-subscribe)
- [`queryCache.clear`](#querycache-clear)
- [延伸阅读](#further-reading)

**选项**

- `onError?: (error: unknown, query: Query) => void`
  - 可选
  - 当某个查询发生错误时会调用此函数。
- `onSuccess?: (data: unknown, query: Query) => void`
  - 可选
  - 当某个查询成功时会调用此函数。
- `onSettled?: (data: unknown | undefined, error: unknown | null, query: Query) => void`
  - 可选
  - 当某个查询完成（无论成功还是失败）时会调用此函数。

## `queryCache.find`

`find` 是一个稍高级的同步方法，可用于从缓存中获取已有查询实例。该实例不仅包含该查询的**全部**状态，还包含查询相关的所有实例与底层内部信息。如果查询不存在，将返回 `undefined`。

> 注意：这通常不是大多数应用所必需的，但在少数需要更多查询信息的场景下会很有帮助（例如查看 `query.state.dataUpdatedAt` 时间戳，以决定某个查询是否足够新鲜，可作为初始值）。

```tsx
const query = queryCache.find({ queryKey })
```

**选项**

- `filters: QueryFilters`：[查询过滤器](../framework/react/guides/filters#query-filters)
  - `queryKey: QueryKey`：[查询键](../framework/react/guides/query-keys.md)

**返回值**

- `Query`
  - 缓存中的查询实例

## `queryCache.findAll`

`findAll` 是更高级的同步方法，可用于从缓存中获取与查询键部分匹配的已有查询实例。如果查询不存在，将返回空数组。

> 注意：这通常不是大多数应用所必需的，但在少数需要更多查询信息的场景下会很有帮助。

```tsx
const queries = queryCache.findAll({ queryKey })
```

**选项**

- `filters?: QueryFilters`：[查询过滤器](../framework/react/guides/filters.md#query-filters)

**返回值**

- `Query[]`
  - 缓存中的查询实例

## `queryCache.subscribe`

`subscribe` 可用于订阅整个查询缓存，并在缓存发生安全且已知的更新时收到通知，例如查询状态发生变化，或者查询被更新、添加或移除。

```tsx
const callback = (event) => {
  console.log(event.type, event.query)
}

const unsubscribe = queryCache.subscribe(callback)
```

**选项**

- `callback: (event: QueryCacheNotifyEvent) => void`
  - 每当查询缓存通过其受追踪的更新机制（如 `query.setState`、`queryClient.removeQueries` 等）更新时，都会调用此函数。不建议绕过这些机制直接变更缓存；这类变更不会触发订阅回调。

**返回值**

- `unsubscribe: Function => void`
  - 该函数用于取消回调对查询缓存的订阅。

## `queryCache.clear`

`clear` 可用于完全清空缓存并重新开始。

```tsx
queryCache.clear()
```

[//]: # 'Materials'

## 延伸阅读

若想进一步了解 QueryCache 的内部工作原理，请阅读 TkDodo 的 [Inside React Query](https://tkdodo.eu/blog/inside-react-query) 一文。

[//]: # 'Materials'
