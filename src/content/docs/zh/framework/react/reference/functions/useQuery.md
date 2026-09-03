---
id: useQuery
title: useQuery
redirect_from:
  - framework/react/reference/useQuery
---

<!--
translation-source-path: framework/react/reference/functions/useQuery.md
translation-source-ref: main
translation-source-hash: f2418847ec2ebb63892199aab376f69a1655eb970af473b4ddcf6590cb9a60ae
translation-status: translated
-->


## 调用签名

```ts
function useQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient?): DefinedUseQueryResult<TData, TError>;
```

定义于： [react-query/src/useQuery.ts:50](https://github.com/TanStack/query/blob/main/packages/react-query/src/useQuery.ts#L50)

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

#### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

### 返回值

[`DefinedUseQueryResult`](../type-aliases/DefinedUseQueryResult.md)\<`TData`, `TError`\>

当前查询结果。其类型中的 `status` 为 `success`；如果获取尝试失败但保留了已有数据，则为 `error`
（在此重载的类型中，`status` 永远不会变为 `pending`，因为 `initialData` 保证一开始就有数据）。
`isSuccess` 和 `isError` 是便于使用的派生布尔值。

### 另请参阅

使用 [queryOptions](queryOptions.md) 在 `useQuery` 与 `queryClient.query` 等命令式 API 之间共享这些选项。

### 示例

```tsx
import { useQuery } from '@tanstack/react-query'

function Posts() {
  // 得益于 `initialData`，`data` 是 `Post[]`，永远不会是 `undefined`；即使重新获取失败，
  // 列表也会与错误信息一同保持可见。
  const { data, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialData: [],
  })

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
function useQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient?): UseQueryResult<TData, TError>;
```

定义于： [react-query/src/useQuery.ts:117](https://github.com/TanStack/query/blob/main/packages/react-query/src/useQuery.ts#L117)

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

#### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

### 返回值

[`UseQueryResult`](../type-aliases/UseQueryResult.md)\<`TData`, `TError`\>

当前查询结果。如果没有可显示的缓存数据，`status` 为 `pending`；如果最近一次获取尝试失败，则为
`error`；如果查询有可显示的数据，则为 `success`。`isPending`、`isSuccess` 和 `isError` 是便于使用的派生布尔值。

### 另请参阅

使用 [queryOptions](queryOptions.md) 在 `useQuery` 与 `queryClient.query` 等命令式 API 之间共享这些选项。

### 示例

```tsx
import { useQuery } from '@tanstack/react-query'

function Posts() {
  const { status, data, error, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (status === 'pending') return '正在加载……'
  if (status === 'error') return <span>错误：{error.message}</span>

  return (
    <div>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <div>{isFetching ? '正在后台更新……' : ' '}</div>
    </div>
  )
}
```

同一个查询，改为检查 `isPending` 和 `isError`，而不是 `status`；选择你认为可读性更好的方式即可：
```tsx
import { useQuery } from '@tanstack/react-query'

function Posts() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return (
    <ul>
      {data.map((post) => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}
```

## 调用签名

```ts
function useQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient?): UseQueryResult<TData, TError>;
```

定义于： [react-query/src/useQuery.ts:281](https://github.com/TanStack/query/blob/main/packages/react-query/src/useQuery.ts#L281)

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

[`UseQueryOptions`](../interfaces/UseQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

要使用的 [UseQueryOptions](../interfaces/UseQueryOptions.md)，即所有可以传给 `useQuery` 的选项。

#### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

### 返回值

[`UseQueryResult`](../type-aliases/UseQueryResult.md)\<`TData`, `TError`\>

当前查询结果。如果没有可显示的缓存数据，`status` 为 `pending`；如果最近一次获取尝试失败，则为
`error`；如果查询有可显示的数据，则为 `success`。`isPending`、`isSuccess` 和 `isError` 是便于使用的派生布尔值。

### 另请参阅

使用 [queryOptions](queryOptions.md) 在 `useQuery` 与 `queryClient.query` 等命令式 API 之间共享这些选项。

### 示例

```tsx
import { useQuery } from '@tanstack/react-query'

function Posts() {
  const { status, data, error, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (status === 'pending') return '正在加载……'
  if (status === 'error') return <span>错误：{error.message}</span>

  return (
    <div>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <div>{isFetching ? '正在后台更新……' : ' '}</div>
    </div>
  )
}
```

`select` 从缓存值中派生组件所需的 `data`，但不会改变缓存中的实际内容：缓存仍保存完整的 `Post[]`，
而此处的 `data` 是一个 `number`：
```tsx
import { useQuery } from '@tanstack/react-query'

function PostCount() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    select: (posts) => posts.length,
  })

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return <span>{data} 篇文章</span>
}
```

依赖查询只在设置 `postId` 后启用。请使用 `isLoading` 而不是 `isPending`，避免在查询被禁用时显示加载状态：
```tsx
import { useQuery } from '@tanstack/react-query'

function Post({ postId }: { postId: number | undefined }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId!),
    enabled: postId != null,
  })

  if (postId == null) return '请选择一篇文章'
  if (isLoading) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return <h1>{data?.title}</h1>
}
```

以类型安全方式实现同一个依赖查询：`skipToken` 会禁用查询，无需使用上面的非空断言，
因为只有定义了 `postId` 时才会调用 `queryFn`。
当 `queryFn` 为 `skipToken` 时，`refetch` 不起作用。如果需要手动触发查询，请改用 `enabled: false`：
```tsx
import { skipToken, useQuery } from '@tanstack/react-query'

function Post({ postId }: { postId: number | undefined }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: postId != null ? () => fetchPost(postId) : skipToken,
  })

  if (postId == null) return '请选择一篇文章'
  if (isLoading) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return <h1>{data?.title}</h1>
}
```

使用已经缓存的列表为详情查询提供初始数据，从而跳过加载状态：
```tsx
import { useQuery, useQueryClient } from '@tanstack/react-query'

function Post({ postId }: { postId: number }) {
  const queryClient = useQueryClient()

  const { data, isError, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
    initialData: () =>
      queryClient
        .getQueryData<Array<Post>>(['posts'])
        ?.find((post) => post.id === postId),
  })

  if (isError) return <span>错误：{error.message}</span>

  return <h1>{data?.title}</h1>
}
```

分页数据：加载下一页时保持显示上一页的数据：
```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

function Posts() {
  const [page, setPage] = useState(0)

  const { data, isPlaceholderData, isError, error } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData,
  })

  if (isError) return <span>错误：{error.message}</span>

  return (
    <div>
      <ul>
        {data?.map((post) => <li key={post.id}>{post.title}</li>)}
      </ul>
      <button
        disabled={isPlaceholderData}
        onClick={() => setPage((old) => old + 1)}
      >
        下一页
      </button>
    </div>
  )
}
```
