---
id: experimental_streamedQuery
title: experimental_streamedQuery
redirect_from:
  - reference/streamedQuery
---


```ts
function experimental_streamedQuery<TQueryFnData, TData, TQueryKey>(streamFn: StreamedQueryParams<TQueryFnData, TData, TQueryKey>): (context: object) => TData | Promise<TData>;
```

定义于： [packages/query-core/src/streamedQuery.ts:68](https://github.com/TanStack/query/blob/main/packages/query-core/src/streamedQuery.ts#L68)

此辅助函数创建一个从 AsyncIterable 流式读取数据的查询函数。数据是已接收的所有数据块组成的数组。收到第一个数据块前，查询保持 `pending`；之后变为 `success`。直到流结束，`fetchStatus` 都保持 `fetching`。

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TData

`TData` = `TQueryFnData`[]

### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

## 参数

### streamFn

`StreamedQueryParams`\<`TQueryFnData`, `TData`, `TQueryKey`\>

返回用于读取数据流的 AsyncIterable 的函数。

## 返回值

```ts
(context: object): TData | Promise<TData>;
```

### 参数

#### context

##### client

[`QueryClient`](../classes/QueryClient.md)

##### direction?

`unknown`

**已弃用**

如需访问方向信息，可将其加入 `pageParam`。

##### meta

`Record`\<`string`, `unknown`\> \| `undefined`

##### pageParam?

`unknown`

##### queryKey

`TQueryKey`

##### signal

`AbortSignal`

### 返回值

`TData` \| `Promise`\<`TData`\>

## 示例

```ts
await queryClient.query({
  queryKey: ['data'],
  queryFn: streamedQuery({
    streamFn: fetchDataInChunks,
  }),
})
```
