---
id: useInfiniteQuery
title: useInfiniteQuery
redirect_from:
  - framework/react/reference/useInfiniteQuery
---

<!--
translation-source-path: framework/react/reference/functions/useInfiniteQuery.md
translation-source-ref: main
translation-source-hash: 09dfd528eb0daca1a7f1073e3a0bd8662e95ab1a8b3c6d1da5cf9d5dbbf783af
translation-status: translated
-->


## 调用签名

```ts
function useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options, queryClient?): DefinedUseInfiniteQueryResult<TData, TError>;
```

定义于： [react-query/src/useInfiniteQuery.ts:65](https://github.com/TanStack/query/blob/main/packages/react-query/src/useInfiniteQuery.ts#L65)

`useInfiniteQuery` 的选项与 `useQuery` 完全相同，此外还增加了 `initialPageParam`、
`getNextPageParam`、`getPreviousPageParam` 和 `maxPages`。

设置 `initialData` 时会选择此重载。

### 类型参数

#### TQueryFnData

`TQueryFnData`

#### TError

`TError` = `Error`

#### TData

`TData` = `InfiniteData`\<`TQueryFnData`, `unknown`\>

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### TPageParam

`TPageParam` = `unknown`

### 参数

#### options

[`DefinedInitialDataInfiniteOptions`](../type-aliases/DefinedInitialDataInfiniteOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

要使用的 [DefinedInitialDataInfiniteOptions](../type-aliases/DefinedInitialDataInfiniteOptions.md)，即所有可以传给 `useInfiniteQuery` 的选项，并且已设置 `initialData`。

#### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

### 返回值

[`DefinedUseInfiniteQueryResult`](../type-aliases/DefinedUseInfiniteQueryResult.md)\<`TData`, `TError`\>

返回与 `useQuery` 相同的属性，此外还增加了 `fetchNextPage`、`fetchPreviousPage`、`hasNextPage`、
`hasPreviousPage`、`isFetchingNextPage` 和 `isFetchingPreviousPage`。只要 `select` 没有将 `TData`
从默认的 `InfiniteData<TQueryFnData>` 结构转换为其他结构，还会包含 `data.pages` 和 `data.pageParams`。

### 说明

请注意，`fetchNextPage` 等命令式获取调用可能会干扰默认的重新获取行为，导致数据过时。
请确保只在响应用户操作时调用这些函数，或添加 `hasNextPage && !isFetching` 等条件。

### 另请参阅

使用 [infiniteQueryOptions](infiniteQueryOptions.md) 在 `useInfiniteQuery` 与 `queryClient.infiniteQuery` 等命令式 API 之间共享这些选项。

### 示例

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function Projects() {
  // 得益于 `initialData`，`data` 永远不会是 `undefined`；即使重新获取失败，
  // 列表也会与错误信息一同保持可见。
  const { data, isError, error } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam }) => fetchProjects(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
    initialData: { pages: [], pageParams: [] },
  })

  return (
    <div>
      {isError ? <span>错误：{error.message}</span> : null}
      <ul>
        {data.pages.map((page) => page.projects.map((p) => <li key={p.id}>{p.name}</li>))}
      </ul>
    </div>
  )
}
```

## 调用签名

```ts
function useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options, queryClient?): UseInfiniteQueryResult<TData, TError>;
```

定义于： [react-query/src/useInfiniteQuery.ts:191](https://github.com/TanStack/query/blob/main/packages/react-query/src/useInfiniteQuery.ts#L191)

`useInfiniteQuery` 的选项与 `useQuery` 完全相同，此外还增加了 `initialPageParam`、
`getNextPageParam`、`getPreviousPageParam` 和 `maxPages`。

### 类型参数

#### TQueryFnData

`TQueryFnData`

#### TError

`TError` = `Error`

#### TData

`TData` = `InfiniteData`\<`TQueryFnData`, `unknown`\>

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### TPageParam

`TPageParam` = `unknown`

### 参数

#### options

[`UndefinedInitialDataInfiniteOptions`](../type-aliases/UndefinedInitialDataInfiniteOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

要使用的 [UndefinedInitialDataInfiniteOptions](../type-aliases/UndefinedInitialDataInfiniteOptions.md)，即所有可以传给 `useInfiniteQuery` 的选项。

#### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

### 返回值

[`UseInfiniteQueryResult`](../type-aliases/UseInfiniteQueryResult.md)\<`TData`, `TError`\>

返回与 `useQuery` 相同的属性，此外还增加了 `fetchNextPage`、`fetchPreviousPage`、`hasNextPage`、
`hasPreviousPage`、`isFetchingNextPage` 和 `isFetchingPreviousPage`。只要 `select` 没有将 `TData`
从默认的 `InfiniteData<TQueryFnData>` 结构转换为其他结构，还会包含 `data.pages` 和 `data.pageParams`。

### 说明

请注意，`fetchNextPage` 等命令式获取调用可能会干扰默认的重新获取行为，导致数据过时。
请确保只在响应用户操作时调用这些函数，或添加 `hasNextPage && !isFetching` 等条件。

### 另请参阅

使用 [infiniteQueryOptions](infiniteQueryOptions.md) 在 `useInfiniteQuery` 与 `queryClient.infiniteQuery` 等命令式 API 之间共享这些选项。

### 示例

单击“加载更多”按钮获取下一页：
```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function Projects() {
  const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['projects'],
      queryFn: ({ pageParam }) => fetchProjects(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextId,
    })

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return (
    <>
      <ul>
        {data.pages.map((page) =>
          page.projects.map((project) => <li key={project.id}>{project.name}</li>),
        )}
      </ul>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetching}
      >
        {isFetchingNextPage
          ? '正在加载更多……'
          : hasNextPage
            ? '加载更多'
            : '没有更多内容了'}
      </button>
    </>
  )
}
```

用户滚动时自动获取下一页：在列表后的哨兵元素上使用 `IntersectionObserver`：
```tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

function Projects() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam }) => fetchProjects(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (sentinel == null || !hasNextPage || isFetching) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) fetchNextPage()
    })
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasNextPage, isFetching, fetchNextPage])

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return (
    <>
      <ul>
        {data.pages.map((page) =>
          page.projects.map((project) => <li key={project.id}>{project.name}</li>),
        )}
      </ul>
      <div ref={sentinelRef}>{isFetchingNextPage ? '正在加载更多……' : null}</div>
    </>
  )
}
```

## 调用签名

```ts
function useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options, queryClient?): UseInfiniteQueryResult<TData, TError>;
```

定义于： [react-query/src/useInfiniteQuery.ts:347](https://github.com/TanStack/query/blob/main/packages/react-query/src/useInfiniteQuery.ts#L347)

`useInfiniteQuery` 的选项与 `useQuery` 完全相同，此外还增加了 `initialPageParam`、
`getNextPageParam`、`getPreviousPageParam` 和 `maxPages`。

### 类型参数

#### TQueryFnData

`TQueryFnData`

#### TError

`TError` = `Error`

#### TData

`TData` = `InfiniteData`\<`TQueryFnData`, `unknown`\>

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### TPageParam

`TPageParam` = `unknown`

### 参数

#### options

[`UseInfiniteQueryOptions`](../interfaces/UseInfiniteQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

要使用的 [UseInfiniteQueryOptions](../interfaces/UseInfiniteQueryOptions.md)，即所有可以传给 `useInfiniteQuery` 的选项。

#### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

### 返回值

[`UseInfiniteQueryResult`](../type-aliases/UseInfiniteQueryResult.md)\<`TData`, `TError`\>

返回与 `useQuery` 相同的属性，此外还增加了 `fetchNextPage`、`fetchPreviousPage`、`hasNextPage`、
`hasPreviousPage`、`isFetchingNextPage` 和 `isFetchingPreviousPage`。只要 `select` 没有将 `TData`
从默认的 `InfiniteData<TQueryFnData>` 结构转换为其他结构，还会包含 `data.pages` 和 `data.pageParams`。

### 说明

请注意，`fetchNextPage` 等命令式获取调用可能会干扰默认的重新获取行为，导致数据过时。
请确保只在响应用户操作时调用这些函数，或添加 `hasNextPage && !isFetching` 等条件。

### 另请参阅

使用 [infiniteQueryOptions](infiniteQueryOptions.md) 在 `useInfiniteQuery` 与 `queryClient.infiniteQuery` 等命令式 API 之间共享这些选项。

### 示例

单击“加载更多”按钮获取下一页：
```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function Projects() {
  const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['projects'],
      queryFn: ({ pageParam }) => fetchProjects(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextId,
    })

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return (
    <>
      <ul>
        {data.pages.map((page) =>
          page.projects.map((project) => <li key={project.id}>{project.name}</li>),
        )}
      </ul>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetching}
      >
        {isFetchingNextPage
          ? '正在加载更多……'
          : hasNextPage
            ? '加载更多'
            : '没有更多内容了'}
      </button>
    </>
  )
}
```

用户滚动时自动获取下一页：在列表后的哨兵元素上使用 `IntersectionObserver`：
```tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

function Projects() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam }) => fetchProjects(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (sentinel == null || !hasNextPage || isFetching) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) fetchNextPage()
    })
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasNextPage, isFetching, fetchNextPage])

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return (
    <>
      <ul>
        {data.pages.map((page) =>
          page.projects.map((project) => <li key={project.id}>{project.name}</li>),
        )}
      </ul>
      <div ref={sentinelRef}>{isFetchingNextPage ? '正在加载更多……' : null}</div>
    </>
  )
}
```

以类型安全方式禁用查询，直至设置 `postId`：将 `skipToken` 作为 `queryFn` 传入，
而不是设置 `enabled: false`：
```tsx
import { skipToken, useInfiniteQuery } from '@tanstack/react-query'

function Comments({ postId }: { postId: string | undefined }) {
  // 使用 `isLoading` 而不是 `isPending`，避免在查询被禁用时显示加载状态。
  const { data, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn:
      postId != null
        ? ({ pageParam }) => fetchComments(postId, pageParam)
        : skipToken,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

  if (postId == null) return '请选择一篇文章'
  if (isLoading) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return (
    <ul>
      {data?.pages.map((page) => page.comments.map((c) => <li key={c.id}>{c.text}</li>))}
    </ul>
  )
}
```
