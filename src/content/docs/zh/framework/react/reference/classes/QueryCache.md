---
id: QueryCache
title: QueryCache
redirect_from:
  - reference/QueryCache
  - framework/react/reference/QueryCache
---


定义于： [packages/query-core/src/queryCache.ts:123](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L123)

`QueryCache` 是 TanStack Query 的查询存储机制，保存查询的数据、元数据和状态。

通常无需直接操作 `QueryCache`，而应通过对应的 `QueryClient` 访问。你可以使用从 `Subscribable` 继承的订阅能力，接收查询添加、移除或更新等受缓存追踪的通知。若绕过缓存自身的追踪机制直接修改查询状态对象，订阅者不会收到通知。

## 示例

```ts
const unsubscribe = queryCache.subscribe((event) => {
  console.log(event.type, event.query)
})
```

## 继承

- `Subscribable`\<`QueryCacheListener`\>

## 构造函数

### 构造函数

```ts
new QueryCache(config: QueryCacheConfig): QueryCache;
```

定义于： [packages/query-core/src/queryCache.ts:126](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L126)

#### 参数

##### config

[`QueryCacheConfig`](../interfaces/QueryCacheConfig.md) = `{}`

#### 返回值

`QueryCache`

#### 重写

```ts
Subscribable<QueryCacheListener>.constructor
```

## 属性

### config

```ts
config: QueryCacheConfig = {};
```

定义于： [packages/query-core/src/queryCache.ts:126](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L126)

## 方法

### build()

```ts
build<TQueryFnData, TError, TData, TQueryKey>(
   client: QueryClient, 
   options: WithRequired<QueryOptions<TQueryFnData, TError, TData, TQueryKey, never>, "queryKey">, 
state?: QueryState<TData, TError>): Query<TQueryFnData, TError, TData, TQueryKey>;
```

定义于： [packages/query-core/src/queryCache.ts:147](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L147)

根据选项中的 `queryKey` / `queryHash` 返回已有的 `Query` 实例；若不存在，则创建实例并加入缓存。框架适配器和广播、持久化等插件可借此直接获取或创建 `Query`，绕过响应式的 `QueryObserver` 机制。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### client

[`QueryClient`](QueryClient.md)

##### options

[`WithRequired`](../type-aliases/WithRequired.md)\<[`QueryOptions`](../interfaces/QueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `never`\>, `"queryKey"`\>

##### state?

[`QueryState`](../interfaces/QueryState.md)\<`TData`, `TError`\>

#### 返回值

[`Query`](Query.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

#### 示例

```ts
const queryCache = queryClient.getQueryCache()

const query = queryCache.build(queryClient, {
  queryKey: ['posts'],
  queryFn: fetchPosts,
})
```

***

### clear()

```ts
clear(): void;
```

定义于： [packages/query-core/src/queryCache.ts:228](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L228)

从缓存中移除所有查询。

#### 返回值

`void`

#### 示例

```ts
const queryCache = queryClient.getQueryCache()

queryCache.clear()
```

***

### find()

```ts
find<TQueryFnData, TError, TData>(filters: WithRequired<QueryFilters<readonly unknown[]>, "queryKey">): 
  | Query<TQueryFnData, TError, TData, readonly unknown[]>
  | undefined;
```

定义于： [packages/query-core/src/queryCache.ts:295](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L295)

较底层的方法，用于从缓存中获取已有的查询实例。实例不仅包含查询状态，还包含查询本身的内部实现和关联对象；若查询不存在，则返回 `undefined`。

大多数应用通常用不到此方法，但在少数需要了解查询更多信息的场景中很有用，例如检查 `query.state.dataUpdatedAt`，判断查询数据是否足够新，可用作初始值。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

#### 参数

##### filters

[`WithRequired`](../type-aliases/WithRequired.md)\<[`QueryFilters`](../interfaces/QueryFilters.md)\<readonly `unknown`[]\>, `"queryKey"`\>

#### 返回值

  \| [`Query`](Query.md)\<`TQueryFnData`, `TError`, `TData`, readonly `unknown`[]\>
  \| `undefined`

#### 另请参阅

[QueryCache#findAll](#findall)

#### 示例

```ts
const queryCache = queryClient.getQueryCache()

const query = queryCache.find({ queryKey: ['posts'] })
```

***

### findAll()

```ts
findAll(filters: QueryFilters<any>): Query<unknown, Error, unknown, readonly unknown[]>[];
```

定义于： [packages/query-core/src/queryCache.ts:320](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L320)

更底层的方法，用于从缓存获取查询键部分匹配的已有查询实例；没有匹配项时返回空数组。

大多数应用通常用不到此方法，但在少数需要获取多个查询的详细信息的场景中会有帮助。

#### 参数

##### filters

[`QueryFilters`](../interfaces/QueryFilters.md)\<`any`\> = `{}`

#### 返回值

[`Query`](Query.md)\<`unknown`, `Error`, `unknown`, readonly `unknown`[]\>[]

#### 另请参阅

[QueryCache#find](#find)

#### 示例

```ts
const queryCache = queryClient.getQueryCache()

const queries = queryCache.findAll({ queryKey: ['posts'] })
```

***

### get()

```ts
get<TQueryFnData, TError, TData, TQueryKey>(queryHash: string): 
  | Query<TQueryFnData, TError, TData, TQueryKey>
  | undefined;
```

定义于： [packages/query-core/src/queryCache.ts:250](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L250)

返回给定 `queryHash` 对应的 `Query` 实例；不存在时返回 `undefined`。与 [QueryCache#find](#find) 不同，此方法直接使用已计算的哈希值查找，而非通过 `QueryFilters`。广播、hydration 等已经持有哈希值的插件可直接使用。

#### 类型参数

##### TQueryFnData

`TQueryFnData` = `unknown`

##### TError

`TError` = `Error`

##### TData

`TData` = `TQueryFnData`

##### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### 参数

##### queryHash

`string`

#### 返回值

  \| [`Query`](Query.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>
  \| `undefined`

#### 示例

```ts
const queryCache = queryClient.getQueryCache()
const queryHash = hashKey(['posts'])

const query = queryCache.get(queryHash)
```

***

### getAll()

```ts
getAll(): Query<unknown, Error, unknown, readonly unknown[]>[];
```

定义于： [packages/query-core/src/queryCache.ts:273](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L273)

返回缓存中的所有查询。

#### 返回值

[`Query`](Query.md)\<`unknown`, `Error`, `unknown`, readonly `unknown`[]\>[]

#### 示例

```ts
const queryCache = queryClient.getQueryCache()

const queries = queryCache.getAll()
```

***

### hasListeners()

```ts
hasListeners(): boolean;
```

定义于： [packages/query-core/src/subscribable.ts:41](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L41)

至少注册了一个监听器时返回 `true`；所有监听器都取消订阅后返回 `false`。

#### 返回值

`boolean`

#### 继承自

```ts
Subscribable.hasListeners
```

***

### remove()

```ts
remove(query: Query<any, any, any, any>): void;
```

定义于： [packages/query-core/src/queryCache.ts:208](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L208)

销毁给定 `Query` 并将其从缓存移除，向订阅者发送 `'removed'` 事件。如果该查询已不是其哈希值对应的当前实例（例如已被替换），则不执行任何操作。广播客户端等插件可用它在不同 `QueryCache` 实例之间同步移除操作。

#### 参数

##### query

[`Query`](Query.md)\<`any`, `any`, `any`, `any`\>

#### 返回值

`void`

#### 示例

```ts
const queryCache = queryClient.getQueryCache()
const query = queryCache.find({ queryKey: ['posts'] })

if (query) {
  queryCache.remove(query)
}
```

***

### subscribe()

```ts
subscribe(listener: QueryCacheListener): () => void;
```

定义于： [packages/query-core/src/subscribable.ts:27](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L27)

注册一个监听器，在此对象每次发出更新通知时调用。返回值是移除该监听器的函数；调用它即可停止监听。基类不会自行移除监听器，但某些子类会在 `destroy()` 中清除全部监听器。

#### 参数

##### listener

`QueryCacheListener`

每次更新时调用，参数由子类传给订阅者。

#### 返回值

```ts
(): void;
```

##### 返回值

`void`

#### 示例

```ts
const unsubscribe = subscribable.subscribe(() => {
  // react to the update
})

unsubscribe()
```

#### 继承自

```ts
Subscribable.subscribe
```
