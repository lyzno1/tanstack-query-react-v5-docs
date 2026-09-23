---
id: hydrate
title: hydrate
---


```ts
function hydrate(
   client: QueryClient, 
   dehydratedState: Partial<DehydratedState>, 
   options?: HydrateOptions): void;
```

定义于： [packages/query-core/src/hydration.ts:265](https://github.com/TanStack/query/blob/main/packages/query-core/src/hydration.ts#L265)

将 `dehydrate` 生成的 `DehydratedState` 恢复到 `QueryClient` 缓存中，通常用服务端已获取的数据填充客户端缓存。`dehydratedState` 中的 `mutations` 和 `queries` 都是可选的。缓存中尚不存在的查询会根据快照创建；已存在的查询仅在快照数据更新时才会更新。新建查询的 `fetchStatus` 会重置为 `'idle'`，避免 hydrate 后卡在获取状态。如果快照中的查询仍有正在执行的 Promise，则通过 `query.fetch()` 将其作为 `initialPromise` 复用，而不会再次调用 `queryFn`。

## 参数

### client

[`QueryClient`](../classes/QueryClient.md)

### dehydratedState

`Partial`\<[`DehydratedState`](../interfaces/DehydratedState.md)\>

### options?

[`HydrateOptions`](../interfaces/HydrateOptions.md)

## 返回值

`void`

## 示例

```ts
// dehydratedState was produced by `dehydrate` on the server
// and sent to the client, e.g. embedded in server-rendered markup.
const queryClient = new QueryClient()

hydrate(queryClient, dehydratedState)
```
