---
id: dehydrate
title: dehydrate
---


```ts
function dehydrate(client: QueryClient, options: DehydrateOptions): DehydratedState;
```

定义于： [packages/query-core/src/hydration.ts:208](https://github.com/TanStack/query/blob/main/packages/query-core/src/hydration.ts#L208)

将 `QueryClient` 缓存中的查询和 mutation 转换为可序列化的普通 `DehydratedState`，通常用于嵌入服务端渲染的标记，再通过 `hydrate` 恢复到客户端的 `QueryClient`。`options` 控制包含哪些查询和 mutation、如何转换其数据与错误；未设置时依次回退到客户端的 `dehydrate` 默认选项，以及 `defaultShouldDehydrateQuery` / `defaultShouldDehydrateMutation`。

## 参数

### client

[`QueryClient`](../classes/QueryClient.md)

### options

[`DehydrateOptions`](../interfaces/DehydrateOptions.md) = `{}`

## 返回值

[`DehydratedState`](../interfaces/DehydratedState.md)

## 示例

```ts
const queryClient = new QueryClient()

await queryClient.prefetchQuery({
  queryKey: ['posts'],
  queryFn: getPosts,
})

const dehydratedState = dehydrate(queryClient)
```
