---
id: useSuspenseQuery
title: useSuspenseQuery
redirect_from:
  - framework/react/reference/useSuspenseQuery
---

```ts
function useSuspenseQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient?): UseSuspenseQueryResult<TData, TError>;
```

定义于： [react-query/src/useSuspenseQuery.ts:75](https://github.com/TanStack/query/blob/main/packages/react-query/src/useSuspenseQuery.ts#L75)

`useSuspenseQuery` 的选项与 `useQuery` 相同，但不包括 `throwOnError`、`enabled` 和 `placeholderData`；
此外，`queryFn` 不能是 `skipToken`，因为 Suspense Hook 无法渲染“已禁用”状态。

注意：不支持取消请求。

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = `Error`

### TData

`TData` = `TQueryFnData`

### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

## 参数

### options

[`UseSuspenseQueryOptions`](../interfaces/UseSuspenseQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

要使用的 [UseSuspenseQueryOptions](../interfaces/UseSuspenseQueryOptions.md)，即 `useQuery` 的选项减去上面列出的选项。

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

[`UseSuspenseQueryResult`](../type-aliases/UseSuspenseQueryResult.md)\<`TData`, `TError`\>

返回与 `useQuery` 相同的对象，但保证 `data` 已定义，不包含 `isPlaceholderData`，并且 `status`
只可能是 `success` 或 `error`（相应的派生标志也会随之设置）。

## 说明

在同一组件中多次调用 `useSuspenseQuery` 会依次触发挂起，从而形成请求瀑布：每个查询都会阻塞渲染，
直到自身完成，后续查询在此之前甚至不会开始获取。如果一个组件中有多个使用 Suspense 的查询，
请改用 [useSuspenseQueries](useSuspenseQueries.md)，让它们并行获取。

## 示例

如果获取失败且尚无缓存数据，查询错误会被抛出，因此需要在 `<Suspense>` 外包裹错误边界。
而后台重新获取失败时，仍会继续渲染缓存数据。使用
[QueryErrorResetBoundary](QueryErrorResetBoundary.md) 可以让用户在出现此类错误后重试：
```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'

function Posts() {
  // 此处保证 `data` 已定义，无需检查 `isPending`。
  const { data, isFetching } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  return (
    <div>
      <h1>Posts {isFetching ? '(refreshing...)' : null}</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
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
          <Suspense fallback={<h1>正在加载文章……</h1>}>
            <Posts />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```
