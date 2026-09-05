---
id: infiniteQueryOptions
title: infiniteQueryOptions
redirect_from:
  - framework/react/reference/infiniteQueryOptions
---

## 调用签名

```ts
function infiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options): UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object & QueryKeyWithDataTag<TQueryKey, InfiniteData<TQueryFnData, unknown>, TError>;
```

定义于： [react-query/src/infiniteQueryOptions.ts:170](https://github.com/TanStack/query/blob/main/packages/react-query/src/infiniteQueryOptions.ts#L170)

通常，所有能够传给 `useInfiniteQuery` 的选项都可以传给 `infiniteQueryOptions`。
这些选项可以在 Hook 与 `queryClient.infiniteQuery` 等命令式 API 之间共享。
`options.queryKey` 为必填项，即要为其生成选项的查询键。

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

### 返回值

返回同一个选项对象，但类型会使 `queryKey` 携带推断出的数据类型。

### 另请参阅

使用 [useInfiniteQuery](useInfiniteQuery.md) 运行采用这些选项的无限查询。

### 说明

有关通过单击按钮或在用户滚动时自动获取后续页面的示例，请参阅 [useInfiniteQuery](useInfiniteQuery.md)。

### 示例

```tsx
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const projectsOptions = infiniteQueryOptions({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextId,
  initialData: { pages: [], pageParams: [] },
})

function Projects() {
  // 得益于 `initialData`，`data` 永远不会是 `undefined`；即使重新获取失败，
  // 列表也会与错误信息一同保持可见。
  const { data, isError, error } = useInfiniteQuery(projectsOptions)

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
function infiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options): OmitKeyof<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, "queryFn"> & object & QueryKeyWithDataTag<TQueryKey, InfiniteData<TQueryFnData, unknown>, TError>;
```

定义于： [react-query/src/infiniteQueryOptions.ts:232](https://github.com/TanStack/query/blob/main/packages/react-query/src/infiniteQueryOptions.ts#L232)

通常，所有能够传给 `useInfiniteQuery` 的选项都可以传给 `infiniteQueryOptions`。
这些选项可以在 Hook 与 `queryClient.infiniteQuery` 等命令式 API 之间共享。
`options.queryKey` 为必填项，即要为其生成选项的查询键。

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

[`UnusedSkipTokenInfiniteOptions`](../type-aliases/UnusedSkipTokenInfiniteOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

要使用的 [UnusedSkipTokenInfiniteOptions](../type-aliases/UnusedSkipTokenInfiniteOptions.md)，即所有可以传给 `useInfiniteQuery` 的选项。

### 返回值

返回同一个选项对象，但类型会使 `queryKey` 携带推断出的数据类型。

### 说明

有关通过单击按钮或在用户滚动时自动获取后续页面的示例，请参阅 [useInfiniteQuery](useInfiniteQuery.md)。

### 示例

一个参数化工厂，可让每个 `postId` 复用同一个选项对象：
```tsx
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const commentsOptions = (postId: string) =>
  infiniteQueryOptions({
    queryKey: ['post', postId, 'comments'],
    queryFn: ({ pageParam }) => fetchComments(postId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

function Comments({ postId }: { postId: string }) {
  const { data, isPending, isError, error } = useInfiniteQuery(commentsOptions(postId))

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return (
    <ul>
      {data.pages.map((page) => page.comments.map((c) => <li key={c.id}>{c.text}</li>))}
    </ul>
  )
}
```

### 另请参阅

使用 [useInfiniteQuery](useInfiniteQuery.md) 运行采用这些选项的无限查询。

## 调用签名

```ts
function infiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options): UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object & QueryKeyWithDataTag<TQueryKey, InfiniteData<TQueryFnData, unknown>, TError>;
```

定义于： [react-query/src/infiniteQueryOptions.ts:294](https://github.com/TanStack/query/blob/main/packages/react-query/src/infiniteQueryOptions.ts#L294)

通常，所有能够传给 `useInfiniteQuery` 的选项都可以传给 `infiniteQueryOptions`。
这些选项可以在 Hook 与 `queryClient.infiniteQuery` 等命令式 API 之间共享。
`options.queryKey` 为必填项，即要为其生成选项的查询键。

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

### 返回值

返回同一个选项对象，但类型会使 `queryKey` 携带推断出的数据类型。

### 说明

有关通过单击按钮或在用户滚动时自动获取后续页面，以及在设置 `postId` 之前使用 `skipToken`
禁用查询的示例，请参阅 [useInfiniteQuery](useInfiniteQuery.md)。

### 示例

一个参数化工厂，可让每个 `postId` 复用同一个选项对象：
```tsx
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const commentsOptions = (postId: string) =>
  infiniteQueryOptions({
    queryKey: ['post', postId, 'comments'],
    queryFn: ({ pageParam }) => fetchComments(postId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

function Comments({ postId }: { postId: string }) {
  const { data, isPending, isError, error } = useInfiniteQuery(commentsOptions(postId))

  if (isPending) return '正在加载……'
  if (isError) return <span>错误：{error.message}</span>

  return (
    <ul>
      {data.pages.map((page) => page.comments.map((c) => <li key={c.id}>{c.text}</li>))}
    </ul>
  )
}
```

### 另请参阅

使用 [useInfiniteQuery](useInfiniteQuery.md) 运行采用这些选项的无限查询。
