---
id: infinite-queries
title: 无限查询
---

<!--
translation-source-path: framework/react/guides/infinite-queries.md
translation-source-ref: v5.90.3
translation-source-hash: 64073828df79abc313624be94e0ea3257a3b0394b4a36766d33e31a58608d3b0
translation-status: translated
-->


可在已有数据集合上持续“加载更多”或实现“无限滚动”的列表，是非常常见的 UI 模式。TanStack Query 为此提供了 `useQuery` 的一个实用变体：`useInfiniteQuery`。

使用 `useInfiniteQuery` 时，你会注意到一些差异：

- `data` 现在是一个包含无限查询数据的对象：
- `data.pages`：包含已获取页面的数组
- `data.pageParams`：包含用于获取各页的 page param 数组
- 可使用 `fetchNextPage` 和 `fetchPreviousPage`（其中 `fetchNextPage` 是必需的）
- 可使用（且必须提供）`initialPageParam` 来指定初始 page param
- 可使用 `getNextPageParam` 与 `getPreviousPageParam`，既用于判断是否还有更多数据，也用于给出下一次获取所需信息。该信息会作为额外参数传入查询函数
- 新增 `hasNextPage` 布尔值：当 `getNextPageParam` 返回非 `null` / `undefined` 时为 `true`
- 新增 `hasPreviousPage` 布尔值：当 `getPreviousPageParam` 返回非 `null` / `undefined` 时为 `true`
- 新增 `isFetchingNextPage` 与 `isFetchingPreviousPage` 布尔值，用于区分后台刷新状态与“加载更多”状态

> 注意：`initialData` 或 `placeholderData` 需要遵循同样的数据结构，即包含 `data.pages` 与 `data.pageParams` 属性的对象。

## 示例

假设我们有一个 API，它基于 `cursor` 索引每次返回 3 条 `projects`，并同时返回可用于获取下一组项目的游标：

```tsx
fetch('/api/projects?cursor=0')
// { data: [...], nextCursor: 3}
fetch('/api/projects?cursor=3')
// { data: [...], nextCursor: 6}
fetch('/api/projects?cursor=6')
// { data: [...], nextCursor: 9}
fetch('/api/projects?cursor=9')
// { data: [...] }
```

基于这些信息，我们可以这样实现“加载更多”UI：

- 默认等待 `useInfiniteQuery` 请求第一组数据
- 在 `getNextPageParam` 中返回下一次查询所需信息
- 调用 `fetchNextPage` 函数

[//]: # 'Example'

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function Projects() {
  const fetchProjects = async ({ pageParam }) => {
    const res = await fetch('/api/projects?cursor=' + pageParam)
    return res.json()
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  )
}
```

[//]: # 'Example'

需要特别理解的是：当已有请求仍在进行时调用 `fetchNextPage`，会有覆盖后台数据刷新结果的风险。这个问题在“渲染列表的同时触发 `fetchNextPage`”时尤为关键。

请记住，一个 InfiniteQuery 在同一时刻只能有一个进行中的获取。所有页面共享同一个缓存条目，同时尝试两次获取可能导致数据被覆盖。

如果你希望允许并发获取，可以在 `fetchNextPage` 中使用 `{ cancelRefetch: false }` 选项（默认是 `true`）。

为了避免冲突并确保查询流程顺畅，强烈建议先确认查询不处于 `isFetching` 状态，尤其是在用户并不直接控制该调用时。

[//]: # 'Example1'

```jsx
<List onEndReached={() => hasNextPage && !isFetching && fetchNextPage()} />
```

[//]: # 'Example1'

## 当无限查询需要重新获取时会发生什么？

当无限查询变为 `stale` 并需要重新获取时，会从第一页开始按组**顺序**重新获取。这样即使底层数据发生变更，也能避免使用过期游标，从而减少重复或漏项风险。如果某个无限查询的结果被从 queryCache 移除，分页会回到初始状态，仅请求初始分组。

## 如果我想实现双向无限列表怎么办？

双向列表可通过 `getPreviousPageParam`、`fetchPreviousPage`、`hasPreviousPage` 和 `isFetchingPreviousPage` 等属性与函数实现。

[//]: # 'Example3'

```tsx
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
})
```

[//]: # 'Example3'

## 如果我想倒序展示页面怎么办？

有时你可能想按相反顺序显示页面。这种情况下可以使用 `select` 选项：

[//]: # 'Example4'

```tsx
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  select: (data) => ({
    pages: [...data.pages].reverse(),
    pageParams: [...data.pageParams].reverse(),
  }),
})
```

[//]: # 'Example4'

## 如果我想手动更新无限查询怎么办？

### 手动移除第一页：

[//]: # 'Example5'

```tsx
queryClient.setQueryData(['projects'], (data) => ({
  pages: data.pages.slice(1),
  pageParams: data.pageParams.slice(1),
}))
```

[//]: # 'Example5'

### 手动从某一页中移除一个值：

[//]: # 'Example6'

```tsx
const newPagesArray =
  oldPagesArray?.pages.map((page) =>
    page.filter((val) => val.id !== updatedId),
  ) ?? []

queryClient.setQueryData(['projects'], (data) => ({
  pages: newPagesArray,
  pageParams: data.pageParams,
}))
```

[//]: # 'Example6'

### 仅保留第一页：

[//]: # 'Example7'

```tsx
queryClient.setQueryData(['projects'], (data) => ({
  pages: data.pages.slice(0, 1),
  pageParams: data.pageParams.slice(0, 1),
}))
```

[//]: # 'Example7'

请务必始终保持 `pages` 与 `pageParams` 的数据结构一致。

## 如果我想限制页面数量怎么办？

在某些场景中，你可能希望限制查询数据中保存的页面数量，以改善性能与体验：

- 用户可能会加载大量页面（内存占用）
- 你需要重新获取一个包含几十页的无限查询（网络占用：所有页面都会被顺序重新获取）

解决方案是使用“Limited Infinite Query”。通过将 `maxPages` 与 `getNextPageParam`、`getPreviousPageParam` 结合，就可以在双向按需获取页面。

在下面示例中，查询数据的 pages 数组只保留 3 页。如果需要重新获取，也只会顺序重新获取这 3 页。

[//]: # 'Example8'

```tsx
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
  maxPages: 3,
})
```

[//]: # 'Example8'

## 如果我的 API 不返回游标怎么办？

如果 API 不返回游标，也可以把 `pageParam` 当作游标使用。因为 `getNextPageParam` 与 `getPreviousPageParam` 也会拿到当前页的 `pageParam`，所以你可以据此计算下一页/上一页的 page param。

[//]: # 'Example9'

```tsx
return useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages, lastPageParam) => {
    if (lastPage.length === 0) {
      return undefined
    }
    return lastPageParam + 1
  },
  getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
    if (firstPageParam <= 1) {
      return undefined
    }
    return firstPageParam - 1
  },
})
```

[//]: # 'Example9'
[//]: # 'Materials'

## 延伸阅读

若想更深入理解 Infinite Queries 的底层工作方式，可阅读社区资源中的 [How Infinite Queries work](../../community/tkdodos-blog.md#26-how-infinite-queries-work)。

[//]: # 'Materials'
