---
id: Query
title: Query
---


定义于： [packages/query-core/src/query.ts:225](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L225)

表示缓存中的单个查询。`Query` 保存查询键、选项、状态（数据、错误和执行状态），以及当前订阅它的观察者。

实例由 `QueryCache` 在内部创建和管理。应用代码通常通过 `QueryClient` 或 `useQuery` 等框架 Hook 间接操作查询。若要检查缓存状态，也可通过 `queryCache.find()` / `findAll()` 直接获取 `Query` 实例。

## 示例

```ts
const queryCache = queryClient.getQueryCache()
const query = queryCache.find({ queryKey: ['posts'] })

if (query) {
  console.log(query.state.dataUpdatedAt)
}
```

## 继承

- `Removable`

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TData

`TData` = `TQueryFnData`

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](../type-aliases/QueryKey.md) = [`QueryKey`](../type-aliases/QueryKey.md)

## 构造函数

### 构造函数

```ts
new Query<TQueryFnData, TError, TData, TQueryKey>(config: QueryConfig<TQueryFnData, TError, TData, TQueryKey>): Query<TQueryFnData, TError, TData, TQueryKey>;
```

定义于： [packages/query-core/src/query.ts:246](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L246)

#### 参数

##### config

`QueryConfig`\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

#### 返回值

`Query`\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

#### 重写

```ts
Removable.constructor
```

## 属性

### gcTime

```ts
gcTime: number;
```

定义于： [packages/query-core/src/removable.ts:11](https://github.com/TanStack/query/blob/main/packages/query-core/src/removable.ts#L11)

#### 继承自

```ts
Removable.gcTime
```

***

### observers

```ts
observers: QueryObserver<any, any, any, any, any>[];
```

定义于： [packages/query-core/src/query.ts:242](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L242)

***

### options

```ts
options: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
```

定义于： [packages/query-core/src/query.ts:233](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L233)

***

### queryHash

```ts
queryHash: string;
```

定义于： [packages/query-core/src/query.ts:232](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L232)

***

### queryKey

```ts
queryKey: TQueryKey;
```

定义于： [packages/query-core/src/query.ts:231](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L231)

***

### state

```ts
state: QueryState<TData, TError>;
```

定义于： [packages/query-core/src/query.ts:234](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L234)

## 访问器

### meta

#### Getter 签名

```ts
get meta(): Record<string, unknown> | undefined;
```

定义于： [packages/query-core/src/query.ts:264](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L264)

查询选项中提供的 `meta` 对象（如果有）。

##### 返回值

`Record`\<`string`, `unknown`\> \| `undefined`

***

### promise

#### Getter 签名

```ts
get promise(): Promise<TData> | undefined;
```

定义于： [packages/query-core/src/query.ts:277](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L277)

若查询正在获取数据，则为当前获取过程的 Promise；否则为 `undefined`。

##### 返回值

`Promise`\<`TData`\> \| `undefined`

## 方法

### cancel()

```ts
cancel(options?: CancelOptions): Promise<void>;
```

定义于： [packages/query-core/src/query.ts:348](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L348)

取消此查询当前正在进行的获取（如果有）。
- 返回一个在取消操作结束后完成的 Promise。
- 若没有正在进行的获取，则立即完成。

#### 参数

##### options?

[`CancelOptions`](../interfaces/CancelOptions.md)

#### 返回值

`Promise`\<`void`\>

#### 示例

```ts
await query.cancel()
```

***

### destroy()

```ts
destroy(): void;
```

定义于： [packages/query-core/src/query.ts:361](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L361)

清除查询的垃圾回收定时器，并静默取消正在进行的获取。`QueryCache` 从缓存移除查询时会调用此方法。

#### 返回值

`void`

#### 另请参阅

[Query#cancel](#cancel)

#### 重写

```ts
Removable.destroy
```

***

### fetch()

```ts
fetch(options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey, never>, fetchOptions?: FetchOptions<TQueryFnData>): Promise<TData>;
```

定义于： [packages/query-core/src/query.ts:590](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L590)

获取查询数据：通过已配置的重试器或行为运行 `queryFn`，并以结果更新查询状态。
- 若已有获取正在进行，则返回其 Promise，不另起一次获取；但若设置了 `fetchOptions.cancelRefetch` 且查询已有数据，会先静默取消当前获取。
- 若传入 `options`，会在获取前替换查询当前的选项。

#### 参数

##### options?

[`QueryOptions`](../interfaces/QueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `never`\>

##### fetchOptions?

`FetchOptions`\<`TQueryFnData`\>

#### 返回值

`Promise`\<`TData`\>

***

### getObserversCount()

```ts
getObserversCount(): number;
```

定义于： [packages/query-core/src/query.ts:560](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L560)

返回当前订阅此查询的观察者数量。

#### 返回值

`number`

#### 示例

```ts
if (query.getObserversCount() === 0) {
  // no component is currently watching this query
}
```

***

### invalidate()

```ts
invalidate(): void;
```

定义于： [packages/query-core/src/query.ts:574](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L574)

将查询标记为失效（若尚未失效）。这会更新 `state.isInvalidated` 并通知观察者，但本身不会触发重新获取。

#### 返回值

`void`

#### 示例

```ts
query.invalidate()
```

***

### isActive()

```ts
isActive(): boolean;
```

定义于： [packages/query-core/src/query.ts:386](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L386)

如果查询至少有一个观察者的 `enabled` 未解析为 `false`，则返回 `true`。

#### 返回值

`boolean`

***

### isDisabled()

```ts
isDisabled(): boolean;
```

定义于： [packages/query-core/src/query.ts:400](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L400)

查询被禁用（不会自动获取）时返回 `true`。
- 若有观察者，当它们都不活跃时，查询被禁用（参阅 `isActive`）。
- 若没有观察者，当 `queryFn` 为 `skipToken` 或查询从未获取过数据时，查询被禁用。

#### 返回值

`boolean`

***

### isFetched()

```ts
isFetched(): boolean;
```

定义于： [packages/query-core/src/query.ts:412](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L412)

查询至少完成过一次获取（返回数据或错误）时返回 `true`。

#### 返回值

`boolean`

***

### isStale()

```ts
isStale(): boolean;
```

定义于： [packages/query-core/src/query.ts:447](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L447)

查询处于 stale 状态时返回 `true`。
- 若有观察者，以任一观察者当前结果的 `isStale` 为准；该值会考虑各自的 `staleTime` 和 `enabled` 状态。
- 若没有观察者，当查询没有数据或已失效时视为 stale。

#### 返回值

`boolean`

#### 另请参阅

[Query#isStaleByTime](#isstalebytime)

#### 示例

```ts
if (query.isStale()) {
  // refetch or otherwise treat the cached data as outdated
}
```

***

### isStaleByTime()

```ts
isStaleByTime(staleTime: number | "static"): boolean;
```

定义于： [packages/query-core/src/query.ts:473](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L473)

相对于给定 `staleTime`（默认 `0`），查询数据处于 stale 状态时返回 `true`。
- 没有数据的查询始终 stale。
- `staleTime: 'static'` 永远不会因时间变为 stale。
- 已失效的查询始终 stale。
- 其他情况根据 `dataUpdatedAt` 之后经过的时间判断。

#### 参数

##### staleTime

`number` | `"static"`

#### 返回值

`boolean`

#### 另请参阅

[Query#isStale](#isstale)

#### 示例

```ts
const isStale = query.isStaleByTime(1000 * 60)
```

***

### isStatic()

```ts
isStatic(): boolean;
```

定义于： [packages/query-core/src/query.ts:420](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L420)

查询至少有一个观察者配置了 `staleTime: 'static'` 时返回 `true`，表示该查询被视为永不 stale。

#### 返回值

`boolean`

***

### reset()

```ts
reset(): void;
```

定义于： [packages/query-core/src/query.ts:377](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L377)

先销毁查询以取消正在进行的获取，再将查询重置为创建时的初始状态（例如包含 `initialData` 的状态）。

#### 返回值

`void`

***

### setState()

```ts
setState(state: Partial<QueryState<TData, TError>>): void;
```

定义于： [packages/query-core/src/query.ts:334](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L334)

将给定的部分状态直接合并到此查询的状态中，并通知观察者。持久化和广播插件可用它恢复状态快照；Devtools 可让用户手动触发加载或错误状态，或编辑缓存数据。

#### 参数

##### state

`Partial`\<[`QueryState`](../interfaces/QueryState.md)\<`TData`, `TError`\>\>

#### 返回值

`void`
