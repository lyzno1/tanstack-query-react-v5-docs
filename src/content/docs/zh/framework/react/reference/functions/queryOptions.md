---
id: queryOptions
title: queryOptions
redirect_from:
  - framework/react/reference/queryOptions
---

<!--
translation-source-path: framework/react/reference/functions/queryOptions.md
translation-source-ref: main
translation-source-hash: cdceb06dd2c7a99a11968ecf481cb321aa2a1597195d74de74ce4b915a29b38b
translation-status: translated
-->


## 调用签名

```ts
function queryOptions<TQueryFnData, TError, TData, TQueryKey>(options): Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & object & QueryKeyWithDataTag<TQueryKey, TQueryFnData, TError>;
```

定义于： [react-query/src/queryOptions.ts:142](https://github.com/TanStack/query/blob/main/packages/react-query/src/queryOptions.ts#L142)

通常，所有能够传给 `useQuery` 的选项都可以传给 `queryOptions`。这些选项可以在 Hook 与
`queryClient.query` 等命令式 API 之间共享。`options.queryKey` 为必填项，即要为其生成选项的查询键。

设置 `initialData` 时会选择此重载，因此返回的 `data` 永远不会是 `undefined`。

### 类型参数

#### TQueryFnData

`TQueryFnData` = `unknown`

#### TError

`TError` = `Error`

#### TData

`TData` = `TQueryFnData`

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

### 参数

#### options

[`DefinedInitialDataOptions`](../type-aliases/DefinedInitialDataOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

要使用的 [DefinedInitialDataOptions](../type-aliases/DefinedInitialDataOptions.md)，即所有可以传给 `useQuery` 的选项，并且已设置 `initialData`。

### 返回值

返回同一个选项对象，但类型会使 `queryKey` 携带推断出的数据类型。

### 另请参阅

 - 使用 [useQuery](useQuery.md) 运行采用这些选项的查询。
 - 参阅 [Query Options API](https://tkdodo.eu/blog/the-query-options-api)，进一步了解这种模式。

### 示例

```tsx
import { queryOptions, useQuery } from '@tanstack/react-query'

export const postsOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  initialData: [],
})

function Posts() {
  // 得益于 `initialData`，`data` 是 `Post[]`，永远不会是 `undefined`；即使重新获取失败，
  // 列表也会与错误信息一同保持可见。
  const { data, isError, error } = useQuery(postsOptions)

  return (
    <div>
      {isError ? <span>错误：{error.message}</span> : null}
      <ul>
        {data.map((post) => <li key={post.id}>{post.title}</li>)}
      </ul>
    </div>
  )
}
```

## 调用签名

```ts
function queryOptions<TQueryFnData, TError, TData, TQueryKey>(options): OmitKeyof<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & object & QueryKeyWithDataTag<TQueryKey, TQueryFnData, TError>;
```

定义于： [react-query/src/queryOptions.ts:183](https://github.com/TanStack/query/blob/main/packages/react-query/src/queryOptions.ts#L183)

通常，所有能够传给 `useQuery` 的选项都可以传给 `queryOptions`。这些选项可以在 Hook 与
`queryClient.query` 等命令式 API 之间共享。`options.queryKey` 为必填项，即要为其生成选项的查询键。

### 类型参数

#### TQueryFnData

`TQueryFnData` = `unknown`

#### TError

`TError` = `Error`

#### TData

`TData` = `TQueryFnData`

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

### 参数

#### options

[`UnusedSkipTokenOptions`](../type-aliases/UnusedSkipTokenOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

要使用的 [UnusedSkipTokenOptions](../type-aliases/UnusedSkipTokenOptions.md)，即所有可以传给 `useQuery` 的选项。

### 返回值

返回同一个选项对象，但类型会使 `queryKey` 携带推断出的数据类型。

### 另请参阅

 - 使用 [useQuery](useQuery.md) 运行采用这些选项的查询。
 - 参阅 [Query Options API](https://tkdodo.eu/blog/the-query-options-api)，进一步了解这种模式。

### 示例

一个参数化工厂，可让每个 `id` 复用同一个选项对象：
```tsx
import { queryOptions, useQuery } from '@tanstack/react-query'

export const postOptions = (id: string) =>
  queryOptions({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  })

function Post({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery(postOptions(id))

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return <h1>{data.title}</h1>
}
```

## 调用签名

```ts
function queryOptions<TQueryFnData, TError, TData, TQueryKey>(options): UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & object & QueryKeyWithDataTag<TQueryKey, TQueryFnData, TError>;
```

定义于： [react-query/src/queryOptions.ts:247](https://github.com/TanStack/query/blob/main/packages/react-query/src/queryOptions.ts#L247)

通常，所有能够传给 `useQuery` 的选项都可以传给 `queryOptions`。这些选项可以在 Hook 与
`queryClient.query` 等命令式 API 之间共享。`options.queryKey` 为必填项，即要为其生成选项的查询键。

### 类型参数

#### TQueryFnData

`TQueryFnData` = `unknown`

#### TError

`TError` = `Error`

#### TData

`TData` = `TQueryFnData`

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

### 参数

#### options

[`UndefinedInitialDataOptions`](../type-aliases/UndefinedInitialDataOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

要使用的 [UndefinedInitialDataOptions](../type-aliases/UndefinedInitialDataOptions.md)，即所有可以传给 `useQuery` 的选项。

### 返回值

返回同一个选项对象，但类型会使 `queryKey` 携带推断出的数据类型。

### 另请参阅

 - 使用 [useQuery](useQuery.md) 运行采用这些选项的查询。
 - 参阅 [Query Options API](https://tkdodo.eu/blog/the-query-options-api)，进一步了解这种模式。

### 说明

这是唯一接受 `queryFn: skipToken` 的重载，如下所示。

### 示例

一个参数化工厂，可让每个 `id` 复用同一个选项对象：
```tsx
import { queryOptions, useQuery } from '@tanstack/react-query'

export const postOptions = (id: string) =>
  queryOptions({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  })

function Post({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery(postOptions(id))

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return <h1>{data.title}</h1>
}
```

一个以类型安全方式禁用查询，直至设置 `postId` 的工厂：
```tsx
import { queryOptions, skipToken, useQuery } from '@tanstack/react-query'

export const postOptions = (postId: number | undefined) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: postId != null ? () => fetchPost(postId) : skipToken,
  })

function Post({ postId }: { postId: number | undefined }) {
  const { data, isLoading, isError, error } = useQuery(postOptions(postId))

  if (postId == null) return '请选择一篇文章'
  if (isLoading) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return <h1>{data?.title}</h1>
}
```
