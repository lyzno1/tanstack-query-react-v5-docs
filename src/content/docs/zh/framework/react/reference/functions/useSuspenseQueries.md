---
id: useSuspenseQueries
title: useSuspenseQueries
redirect_from:
  - framework/react/reference/useSuspenseQueries
---

## 调用签名

```ts
function useSuspenseQueries<T, TCombinedResult>(options, queryClient?): TCombinedResult;
```

定义于： [react-query/src/useSuspenseQueries.ts:349](https://github.com/TanStack/query/blob/main/packages/react-query/src/useSuspenseQueries.ts#L349)

`useSuspenseQueries` 的选项与 `useQueries` 相同，但不支持顶层 `subscribed` 选项，并且每个 `query`
都不能包含 `throwOnError`、`enabled` 或 `placeholderData`。

### 类型参数

#### T

`T` *extends* `any`[]

#### TCombinedResult

`TCombinedResult` = `T` *extends* \[\] ? \[\] : `T` *extends* \[`Head`\] ? \[`GetUseSuspenseQueryResult`\<`Head`\>\] : `T` *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseSuspenseQueryResult`\<`Head`\>, `GetUseSuspenseQueryResult`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseSuspenseQueryResult`\<`Head`\>, `GetUseSuspenseQueryResult`\<`Head`\>, `GetUseSuspenseQueryResult`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...(...)[]`\] *extends* \[\] ? \[\] : ... *extends* ... ? ... : ... : \[`...{ [K in (...)]: (...) }[]`\] : \[...\{ \[K in string \| number \| symbol\]: GetUseSuspenseQueryResult\<Tails\[K\<(...)\>\]\> \}\[\]\] : \{ \[K in string \| number \| symbol\]: GetUseSuspenseQueryResult\<T\[K\<K\>\]\> \}

### 参数

#### options

要在 Suspense 中运行的 `queries` 数组，以及一个可选的 `combine` 函数。

##### combine?

(`result`) => `TCombinedResult`

使用此函数将多个查询的结果合并为单个值。结果会进行结构共享，以尽可能保持引用稳定。

##### queries

  \| readonly \[`T` *extends* \[\] ? \[\] : `T` *extends* \[`Head`\] ? \[`GetUseSuspenseQueryOptions`\<`Head`\>\] : `T` *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseSuspenseQueryOptions`\<`Head`\>, `GetUseSuspenseQueryOptions`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...(...)[]`\] *extends* \[\] ? \[\] : ... *extends* ... ? ... : ... : ...[] *extends* \[`...(...)[]`\] ? \[`...(...)[]`\] : ... *extends* ... ? ... : ... : `unknown`[] *extends* `T` ? `T` : `T` *extends* [`UseSuspenseQueryOptions`](../interfaces/UseSuspenseQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>[] ? [`UseSuspenseQueryOptions`](../interfaces/UseSuspenseQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>[] : [`UseSuspenseQueryOptions`](../interfaces/UseSuspenseQueryOptions.md)\<`unknown`, `Error`, `unknown`, readonly ...[]\>[]\]
  \| readonly \[\{ \[K in string \| number \| symbol\]: GetUseSuspenseQueryOptions\<T\[K\<K\>\]\> \}\]

一个查询选项对象数组，其中的选项与 `useSuspenseQuery` 完全相同。

#### queryClient?

`QueryClient`

使用此参数可提供自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

### 返回值

`TCombinedResult`

返回与 `useQueries` 相同的结构，但保证每个 `query` 的 `data` 已定义，不包含 `isPlaceholderData`，
并且 `status` 只可能是 `success` 或 `error`（相应的派生标志也会随之设置）。

注意：只有全部查询加载完成后，组件才会重新挂载。因此，如果某个查询在等待全部查询完成期间已经过期，
它会在重新挂载时再次获取。为避免这种情况，请确保设置足够长的 `staleTime`。不支持取消请求。

### 示例

如果获取失败且尚无缓存数据，查询错误会被抛出，因此需要在 `<Suspense>` 外包裹错误边界。
而后台重新获取失败时，仍会继续渲染缓存数据。使用
[QueryErrorResetBoundary](QueryErrorResetBoundary.md) 可以让用户在出现此类错误后重试：
```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseQueries,
} from '@tanstack/react-query'

function Posts({ ids }: { ids: Array<number> }) {
  // 保证每个结果都已定义，无需分别检查各查询的 `isPending`。
  const postQueries = useSuspenseQueries({
    queries: ids.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
    })),
  })

  return (
    <ul>
      {postQueries.map((query) => (
        <li key={query.data.id}>{query.data.title}</li>
      ))}
    </ul>
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
            <Posts ids={[1, 2, 3]} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

对于多个不同查询，请使用 `useSuspenseQueries`，而不是多次调用 `useSuspenseQuery`，
这样它们会并行获取，而不是依次挂起：
```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseQueries,
} from '@tanstack/react-query'

function Dashboard() {
  const [usersQuery, teamsQuery, projectsQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['users'], queryFn: fetchUsers },
      { queryKey: ['teams'], queryFn: fetchTeams },
      { queryKey: ['projects'], queryFn: fetchProjects },
    ],
  })

  return (
    <div>
      <UserList users={usersQuery.data} />
      <TeamList teams={teamsQuery.data} />
      <ProjectList projects={projectsQuery.data} />
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
          <Suspense fallback={<h1>正在加载仪表盘……</h1>}>
            <Dashboard />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

`combine` 将结果合并为单个布尔值，因此 `Refresh` 只会在该布尔值变化时重新渲染，
而不会在每个查询单独更新时都重新渲染。只有此重载接受 `combine`：
```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseQueries,
} from '@tanstack/react-query'

function Refresh() {
  const anyFetching = useSuspenseQueries({
    queries: [
      { queryKey: ['users'], queryFn: fetchUsers },
      { queryKey: ['teams'], queryFn: fetchTeams },
    ],
    combine: (results) => results.some((result) => result.isFetching),
  })

  return anyFetching ? <span>正在刷新……</span> : null
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
          <Suspense fallback={<h1>正在加载仪表盘……</h1>}>
            <Refresh />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

## 调用签名

```ts
function useSuspenseQueries<T, TCombinedResult>(options, queryClient?): TCombinedResult;
```

定义于： [react-query/src/useSuspenseQueries.ts:489](https://github.com/TanStack/query/blob/main/packages/react-query/src/useSuspenseQueries.ts#L489)

`useSuspenseQueries` 的选项与 `useQueries` 相同，但不支持顶层 `subscribed` 选项，并且每个 `query`
都不能包含 `throwOnError`、`enabled` 或 `placeholderData`。

### 类型参数

#### T

`T` *extends* `any`[]

#### TCombinedResult

`TCombinedResult` = `T` *extends* \[\] ? \[\] : `T` *extends* \[`Head`\] ? \[`GetUseSuspenseQueryResult`\<`Head`\>\] : `T` *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseSuspenseQueryResult`\<`Head`\>, `GetUseSuspenseQueryResult`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseSuspenseQueryResult`\<`Head`\>, `GetUseSuspenseQueryResult`\<`Head`\>, `GetUseSuspenseQueryResult`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...(...)[]`\] *extends* \[\] ? \[\] : ... *extends* ... ? ... : ... : \[`...{ [K in (...)]: (...) }[]`\] : \[...\{ \[K in string \| number \| symbol\]: GetUseSuspenseQueryResult\<Tails\[K\<(...)\>\]\> \}\[\]\] : \{ \[K in string \| number \| symbol\]: GetUseSuspenseQueryResult\<T\[K\<K\>\]\> \}

### 参数

#### options

要在 Suspense 中运行的 `queries` 数组，以及一个可选的 `combine` 函数。

##### combine?

(`result`) => `TCombinedResult`

使用此函数将多个查询的结果合并为单个值。结果会进行结构共享，以尽可能保持引用稳定。

##### queries

readonly \[`T` *extends* \[\] ? \[\] : `T` *extends* \[`Head`\] ? \[`GetUseSuspenseQueryOptions`\<`Head`\>\] : `T` *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseSuspenseQueryOptions`\<`Head`\>, `GetUseSuspenseQueryOptions`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...(...)[]`\] *extends* \[...\] ? \[..., ..., ...\] : ... *extends* ... ? ... : ... : `unknown`[] *extends* \[`...Tails[]`\] ? \[`...Tails[]`\] : \[`...(...)[]`\] *extends* ...[] ? ...[] : ...[] : `unknown`[] *extends* `T` ? `T` : `T` *extends* [`UseSuspenseQueryOptions`](../interfaces/UseSuspenseQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>[] ? [`UseSuspenseQueryOptions`](../interfaces/UseSuspenseQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>[] : [`UseSuspenseQueryOptions`](../interfaces/UseSuspenseQueryOptions.md)\<`unknown`, `Error`, `unknown`, readonly `unknown`[]\>[]\]

一个查询选项对象数组，其中的选项与 `useSuspenseQuery` 完全相同。

#### queryClient?

`QueryClient`

使用此参数可提供自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

### 返回值

`TCombinedResult`

返回与 `useQueries` 相同的结构，但保证每个 `query` 的 `data` 已定义，不包含 `isPlaceholderData`，
并且 `status` 只可能是 `success` 或 `error`（相应的派生标志也会随之设置）。

注意：只有全部查询加载完成后，组件才会重新挂载。因此，如果某个查询在等待全部查询完成期间已经过期，
它会在重新挂载时再次获取。为避免这种情况，请确保设置足够长的 `staleTime`。不支持取消请求。

### 示例

如果获取失败且尚无缓存数据，查询错误会被抛出，因此需要在 `<Suspense>` 外包裹错误边界。
而后台重新获取失败时，仍会继续渲染缓存数据。使用
[QueryErrorResetBoundary](QueryErrorResetBoundary.md) 可以让用户在出现此类错误后重试：
```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseQueries,
} from '@tanstack/react-query'

function Posts({ ids }: { ids: Array<number> }) {
  // 保证每个结果都已定义，无需分别检查各查询的 `isPending`。
  const postQueries = useSuspenseQueries({
    queries: ids.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
    })),
  })

  return (
    <ul>
      {postQueries.map((query) => (
        <li key={query.data.id}>{query.data.title}</li>
      ))}
    </ul>
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
            <Posts ids={[1, 2, 3]} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

对于多个不同查询，请使用 `useSuspenseQueries`，而不是多次调用 `useSuspenseQuery`，
这样它们会并行获取，而不是依次挂起：
```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseQueries,
} from '@tanstack/react-query'

function Dashboard() {
  const [usersQuery, teamsQuery, projectsQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['users'], queryFn: fetchUsers },
      { queryKey: ['teams'], queryFn: fetchTeams },
      { queryKey: ['projects'], queryFn: fetchProjects },
    ],
  })

  return (
    <div>
      <UserList users={usersQuery.data} />
      <TeamList teams={teamsQuery.data} />
      <ProjectList projects={projectsQuery.data} />
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
          <Suspense fallback={<h1>正在加载仪表盘……</h1>}>
            <Dashboard />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```
