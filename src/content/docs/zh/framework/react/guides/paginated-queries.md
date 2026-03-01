---
id: paginated-queries
title: 分页/滞后查询
---

<!--
translation-source-path: framework/react/guides/paginated-queries.md
translation-source-ref: v5.90.3
translation-source-hash: 656f0a1f3e4e1b49fa42a2562e0a554c19aa09cd65bc7f87c47bccd89f023d5f
translation-status: translated
-->


渲染分页数据是一种非常常见的 UI 模式，在 TanStack Query 中，它通过在查询键中包含页面信息来“正常工作”：

[//]: # 'Example'

```tsx
const result = useQuery({
  queryKey: ['projects', page],
  queryFn: fetchProjects,
})
```

[//]: # 'Example'

但是，如果您运行这个简单的示例，您可能会注意到一些奇怪的事情：

**UI 会跳进跳出 `success` 和 `pending` 状态，因为每个新页面都被视为一个全新的查询。**

这种体验并不是最佳的，不幸的是，今天有很多工具坚持工作。但不是 TanStack Query！正如您可能已经猜到的，TanStack Query 附带了一个名为 `placeholderData` 的出色功能，它使我们能够解决这个问题。

## 使用`placeholderData` 更好的分页查询

考虑以下示例，我们理想情况下希望为查询增加 pageIndex（或游标）。如果我们使用 `useQuery`，**从技术上来说它仍然可以正常工作**，但是当为每个页面或游标创建和销毁不同的查询时，UI 会跳入和跳出 `success` 和 `pending` 状态。通过将`placeholderData`设置为`(previousData) => previousData`或从TanStack Query导出的`keepPreviousData`函数，我们得到了一些新东西：

- **即使查询键已更改，在请求新数据时，上次成功获取的数据仍然可用**。
- 当新数据到达时，之前的`data`会无缝交换以显示新数据。
- `isPlaceholderData` 可用于了解查询当前为您提供哪些数据

[//]: # 'Example2'

```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'

function Todos() {
  const [page, setPage] = React.useState(0)

  const fetchProjects = (page = 0) =>
    fetch('/api/projects?page=' + page).then((res) => res.json())

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ['projects', page],
      queryFn: () => fetchProjects(page),
      placeholderData: keepPreviousData,
    })

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPlaceholderData && data.hasMore) {
            setPage((old) => old + 1)
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPlaceholderData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}
    </div>
  )
}
```

[//]: # 'Example2'

## 使用 `placeholderData` 滞后无限查询结果

虽然不常见，但 `placeholderData` 选项也可以与 `useInfiniteQuery` Hook 完美配合，因此您可以无缝地允许用户继续查看缓存的数据，同时无限查询键随时间变化。
