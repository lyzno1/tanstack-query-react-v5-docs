---
id: QueriesObserver
title: QueriesObserver
redirect_from:
  - reference/QueriesObserver
  - framework/react/reference/QueriesObserver
---


定义于： [packages/query-core/src/queriesObserver.ts:56](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L56)

`QueriesObserver` 同时观察一组查询，将其作为 `QueryObserverResult` 数组暴露；设置 `combine` 时，返回从该数组派生的合并值。它为每个查询管理一个内部 `QueryObserver`，是 `useQueries` 等框架 Hook 的底层基础。

## 示例

```ts
const observer = new QueriesObserver(queryClient, [
  { queryKey: ['post', 1], queryFn: fetchPost },
  { queryKey: ['post', 2], queryFn: fetchPost },
])

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
})
```

## 继承

- `Subscribable`\<`QueriesObserverListener`\>

## 类型参数

### TCombinedResult

`TCombinedResult` = [`QueryObserverResult`](../type-aliases/QueryObserverResult.md)[]

## 构造函数

### 构造函数

```ts
new QueriesObserver<TCombinedResult>(
   client: QueryClient, 
   queries: QueryObserverOptions<any, any, any, any, any, never>[], 
options?: QueriesObserverOptions<TCombinedResult>): QueriesObserver<TCombinedResult>;
```

定义于： [packages/query-core/src/queriesObserver.ts:70](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L70)

#### 参数

##### client

[`QueryClient`](QueryClient.md)

##### queries

[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`any`, `any`, `any`, `any`, `any`, `never`\>[]

##### options?

[`QueriesObserverOptions`](../interfaces/QueriesObserverOptions.md)\<`TCombinedResult`\>

#### 返回值

`QueriesObserver`\<`TCombinedResult`\>

#### 重写

```ts
Subscribable<QueriesObserverListener>.constructor
```

## 方法

### destroy()

```ts
destroy(): void;
```

定义于： [packages/query-core/src/queriesObserver.ts:106](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L106)

停止观察所有查询：清除全部监听器，并销毁由此观察者管理的所有底层 `QueryObserver`。

#### 返回值

`void`

***

### getCurrentResult()

```ts
getCurrentResult(): QueryObserverResult[];
```

定义于： [packages/query-core/src/queriesObserver.ts:210](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L210)

返回最近计算的 `QueryObserverResult` 数组，每个被观察的查询对应一项；顺序与传给构造函数或 `setQueries` 的查询相同。

#### 返回值

[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)[]

#### 示例

```ts
const results = observer.getCurrentResult()
const data = results.map((result) => result.data)
```

***

### getObservers()

```ts
getObservers(): QueryObserver<unknown, Error, unknown, unknown, readonly unknown[]>[];
```

定义于： [packages/query-core/src/queriesObserver.ts:227](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L227)

返回此观察者管理的底层 `QueryObserver` 实例，顺序与传给构造函数或 `setQueries` 的查询相同。

#### 返回值

[`QueryObserver`](QueryObserver.md)\<`unknown`, `Error`, `unknown`, `unknown`, readonly `unknown`[]\>[]

***

### getOptimisticResult()

```ts
getOptimisticResult(queries: QueryObserverOptions<unknown, Error, unknown, unknown, readonly unknown[], never>[], combine: CombineFn<TCombinedResult> | undefined): [QueryObserverResult[], (r?: QueryObserverResult[]) => TCombinedResult, () => QueryObserverResult[]];
```

定义于： [packages/query-core/src/queriesObserver.ts:238](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L238)

这是 `QueriesObserver` 中与 [QueryObserver#getOptimisticResult](QueryObserver.md#getoptimisticresult) 对应的方法：同步计算给定查询（已填充默认选项）的当前结果。框架适配器（如 `useQueries`）在订阅之前调用它，得到由逐项原始结果、从中计算合并结果的函数，以及用于包装结果以追踪属性访问的函数组成的元组。

#### 参数

##### queries

[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`unknown`, `Error`, `unknown`, `unknown`, readonly `unknown`[], `never`\>[]

##### combine

`CombineFn`\<`TCombinedResult`\> | `undefined`

#### 返回值

\[[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)[], (`r?`: [`QueryObserverResult`](../type-aliases/QueryObserverResult.md)[]) => `TCombinedResult`, () => [`QueryObserverResult`](../type-aliases/QueryObserverResult.md)[]\]

***

### getQueries()

```ts
getQueries(): Query<unknown, Error, unknown, readonly unknown[]>[];
```

定义于： [packages/query-core/src/queriesObserver.ts:218](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L218)

返回当前观察的底层 `Query` 实例，顺序与传给构造函数或 `setQueries` 的查询相同。

#### 返回值

[`Query`](Query.md)\<`unknown`, `Error`, `unknown`, readonly `unknown`[]\>[]

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

### setQueries()

```ts
setQueries(queries: QueryObserverOptions<unknown, Error, unknown, unknown, readonly unknown[], never>[], options?: QueriesObserverOptions<TCombinedResult>): void;
```

定义于： [packages/query-core/src/queriesObserver.ts:127](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L127)

替换正在观察的查询集合。查询哈希仍与已观察的查询匹配时，会复用原有 `QueryObserver`；不再存在的查询对应的观察者会被销毁，新增查询则会创建并订阅新的观察者。

#### 参数

##### queries

[`QueryObserverOptions`](../interfaces/QueryObserverOptions.md)\<`unknown`, `Error`, `unknown`, `unknown`, readonly `unknown`[], `never`\>[]

##### options?

[`QueriesObserverOptions`](../interfaces/QueriesObserverOptions.md)\<`TCombinedResult`\>

#### 返回值

`void`

#### 示例

```ts
observer.setQueries([
  { queryKey: ['post', 1], queryFn: fetchPost },
  { queryKey: ['post', 3], queryFn: fetchPost },
])
```

***

### subscribe()

```ts
subscribe(listener: QueriesObserverListener): () => void;
```

定义于： [packages/query-core/src/subscribable.ts:27](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L27)

注册一个监听器，在此对象每次发出更新通知时调用。返回值是移除该监听器的函数；调用它即可停止监听。基类不会自行移除监听器，但某些子类会在 `destroy()` 中清除全部监听器。

#### 参数

##### listener

`QueriesObserverListener`

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
