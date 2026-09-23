---
id: MutationCache
title: MutationCache
redirect_from:
  - reference/MutationCache
  - framework/react/reference/MutationCache
---


定义于： [packages/query-core/src/mutationCache.ts:124](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L124)

`MutationCache` 用于存储 mutation。

通常无需直接操作 `MutationCache`，而应使用 `QueryClient`。你可以通过从 `Subscribable` 继承的订阅能力，接收缓存中已知且受控的更新通知，例如 mutation 的添加、移除或更新。

## 示例

```ts
const unsubscribe = mutationCache.subscribe((event) => {
  console.log(event.type, event.mutation)
})
```

## 继承

- `Subscribable`\<`MutationCacheListener`\>

## 构造函数

### 构造函数

```ts
new MutationCache(config: MutationCacheConfig): MutationCache;
```

定义于： [packages/query-core/src/mutationCache.ts:129](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L129)

#### 参数

##### config

[`MutationCacheConfig`](../interfaces/MutationCacheConfig.md) = `{}`

#### 返回值

`MutationCache`

#### 重写

```ts
Subscribable<MutationCacheListener>.constructor
```

## 属性

### config

```ts
config: MutationCacheConfig = {};
```

定义于： [packages/query-core/src/mutationCache.ts:129](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L129)

## 方法

### clear()

```ts
clear(): void;
```

定义于： [packages/query-core/src/mutationCache.ts:236](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L236)

从缓存中移除所有 mutation。

#### 返回值

`void`

#### 示例

```ts
const mutationCache = queryClient.getMutationCache()

mutationCache.clear()
```

***

### find()

```ts
find<TData, TError, TVariables, TOnMutateResult>(filters: MutationFilters): 
  | Mutation<TData, TError, TVariables, TOnMutateResult>
  | undefined;
```

定义于： [packages/query-core/src/mutationCache.ts:278](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L278)

较底层的方法，用于从缓存取得已有的 mutation 实例；不存在时返回 `undefined`。

大多数应用通常用不到此方法，但在少数需要查看某个 mutation 更多信息的场景中会有帮助。

#### 类型参数

##### TData

`TData` = `unknown`

##### TError

`TError` = `Error`

##### TVariables

`TVariables` = `any`

##### TOnMutateResult

`TOnMutateResult` = `unknown`

#### 参数

##### filters

[`MutationFilters`](../interfaces/MutationFilters.md)

#### 返回值

  \| [`Mutation`](Mutation.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>
  \| `undefined`

#### 另请参阅

[MutationCache#findAll](#findall)

#### 示例

```ts
const mutationCache = queryClient.getMutationCache()

const mutation = mutationCache.find({ mutationKey: ['addPost'] })
```

***

### findAll()

```ts
findAll(filters: MutationFilters): Mutation<unknown, Error, unknown, unknown>[];
```

定义于： [packages/query-core/src/mutationCache.ts:308](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L308)

更底层的方法，用于从缓存取得符合给定过滤条件的 mutation 实例；没有匹配项时返回空数组。

大多数应用通常用不到此方法，但在少数需要查看多个 mutation 更多信息的场景中会有帮助。

#### 参数

##### filters

[`MutationFilters`](../interfaces/MutationFilters.md) = `{}`

#### 返回值

[`Mutation`](Mutation.md)\<`unknown`, `Error`, `unknown`, `unknown`\>[]

#### 另请参阅

[MutationCache#find](#find)

#### 示例

```ts
const mutationCache = queryClient.getMutationCache()

const mutations = mutationCache.findAll({ mutationKey: ['addPost'] })
```

***

### getAll()

```ts
getAll(): Mutation<unknown, Error, unknown, unknown>[];
```

定义于： [packages/query-core/src/mutationCache.ts:259](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L259)

返回缓存中的所有 mutation。

大多数应用通常用不到此方法，但在少数需要查看某个 mutation 更多信息的场景中会有帮助。

#### 返回值

[`Mutation`](Mutation.md)\<`unknown`, `Error`, `unknown`, `unknown`\>[]

#### 示例

```ts
const mutationCache = queryClient.getMutationCache()

const mutations = mutationCache.getAll()
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

### subscribe()

```ts
subscribe(listener: MutationCacheListener): () => void;
```

定义于： [packages/query-core/src/subscribable.ts:27](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L27)

注册一个监听器，在此对象每次发出更新通知时调用。返回值是移除该监听器的函数；调用它即可停止监听。基类不会自行移除监听器，但某些子类会在 `destroy()` 中清除全部监听器。

#### 参数

##### listener

`MutationCacheListener`

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
