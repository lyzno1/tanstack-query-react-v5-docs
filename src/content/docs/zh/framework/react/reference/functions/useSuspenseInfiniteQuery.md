---
id: useSuspenseInfiniteQuery
title: useSuspenseInfiniteQuery
redirect_from:
  - framework/react/reference/useSuspenseInfiniteQuery
---

<!--
translation-source-path: framework/react/reference/functions/useSuspenseInfiniteQuery.md
translation-source-ref: main
translation-source-hash: 15f8c8f4cfc123f21d3d6e6afd53162b9c325bf9892a04af9a48a50d4a24d3e6
translation-status: translated
-->


```ts
function useSuspenseInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options, queryClient?): UseSuspenseInfiniteQueryResult<TData, TError>;
```

定义于： [react-query/src/useSuspenseInfiniteQuery.ts:104](https://github.com/TanStack/query/blob/main/packages/react-query/src/useSuspenseInfiniteQuery.ts#L104)

`useSuspenseInfiniteQuery` 的选项与 `useInfiniteQuery` 相同，但不包括 `throwOnError`、`enabled`
和 `placeholderData`。

注意：不支持取消请求。

## 类型参数

### TQueryFnData

`TQueryFnData`

### TError

`TError` = `Error`

### TData

`TData` = `InfiniteData`\<`TQueryFnData`, `unknown`\>

### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

### TPageParam

`TPageParam` = `unknown`

## 参数

### options

[`UseSuspenseInfiniteQueryOptions`](../interfaces/UseSuspenseInfiniteQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

要使用的 [UseSuspenseInfiniteQueryOptions](../interfaces/UseSuspenseInfiniteQueryOptions.md)，即 `useInfiniteQuery` 的选项减去上面列出的选项。

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

[`UseSuspenseInfiniteQueryResult`](../type-aliases/UseSuspenseInfiniteQueryResult.md)\<`TData`, `TError`\>

返回与 `useInfiniteQuery` 相同的对象，但保证 `data` 已定义，不包含 `isPlaceholderData`，并且
`status` 只可能是 `success` 或 `error`（相应的派生标志也会随之设置）。

## 说明

同一组件中多个使用 Suspense 的查询调用会依次触发挂起，从而形成请求瀑布：每个查询都会阻塞渲染，
直到自身完成，后续查询在此之前甚至不会开始获取。在 Suspense 下无法并行执行多个无限查询。
另请注意，`fetchNextPage` 等命令式获取调用可能会干扰默认的重新获取行为，导致数据过时。
请确保只在响应用户操作时调用这些函数，或添加 `hasNextPage && !isFetching` 等条件。

## 另请参阅

此 Hook 的非 Suspense 版本请参阅 [useInfiniteQuery](useInfiniteQuery.md)。

## 示例

如果获取失败且尚无缓存数据，查询错误会被抛出，因此需要在 `<Suspense>` 外包裹错误边界。
而后台重新获取失败时，仍会继续渲染缓存数据。使用
[QueryErrorResetBoundary](QueryErrorResetBoundary.md) 可以让用户在出现此类错误后重试：
```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'

function Projects() {
  // 此处保证 `data` 已定义，无需检查 `isPending`。
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['projects'],
      queryFn: ({ pageParam }) => fetchProjects(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextId,
    })

  return (
    <div>
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
    </div>
  )
}

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              出错了！
              <button onClick={() => resetErrorBoundary()}>重试</button>
            </div>
          )}
        >
          <Suspense fallback={<h1>正在加载项目……</h1>}>
            <Projects />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```
