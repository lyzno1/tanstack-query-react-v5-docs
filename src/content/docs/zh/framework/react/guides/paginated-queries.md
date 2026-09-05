---
id: paginated-queries
title: 分页/滞后查询
---

渲染分页数据是一种非常常见的 UI 模式。在 TanStack Query 中，只需将分页信息包含在查询键中即可：

[//]: # 'Example'

```tsx
const result = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
})
```

[//]: # 'Example'

不过，运行这个简单示例后，你可能会注意到一个问题：

**由于每个新页面都被视为全新的查询，UI 会在 `success` 和 `pending` 状态之间来回切换。**

这种体验并不理想，许多工具却只能如此工作。TanStack Query 则提供了 `placeholderData`，让我们可以避开这个问题。

## 使用 `placeholderData` 改善分页查询

设想一个需要递增查询 `pageIndex`（或游标）的场景。直接使用 `useQuery` **在技术上完全可行**，但每个页面或游标对应的查询不断创建与销毁时，UI 会在 `success` 和 `pending` 状态之间来回切换。将 `placeholderData` 设为 `(previousData) => previousData`，或使用 TanStack Query 导出的 `keepPreviousData` 函数后，会带来以下变化：

- **即使查询键已经变化，请求新数据期间仍可使用上次成功获取的数据。**
- 新数据到达后，会无缝替换先前的 `data`。
- 可以通过 `isPlaceholderData` 判断查询当前提供的是否为占位数据。

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

虽然不太常见，但 `placeholderData` 同样适用于 `useInfiniteQuery` Hook。这样，即使无限查询的查询键不断变化，用户仍能无缝地继续查看缓存数据。
