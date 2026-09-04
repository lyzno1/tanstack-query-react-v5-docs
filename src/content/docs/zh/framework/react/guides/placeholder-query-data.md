---
id: placeholder-query-data
title: 占位查询数据
---

<!--
translation-source-path: framework/react/guides/placeholder-query-data.md
translation-source-ref: main
translation-source-hash: dc0bf8b698ec4f1ee1e95920b641d827535e4b1b6eab82821ae5952fd3f573b3
translation-status: translated
-->


## 什么是占位数据？

占位数据让查询表现得像是已经拥有数据，类似于 `initialData` 选项，但**这些数据不会持久化到缓存中**。当你已有足以完成渲染的部分数据（或模拟数据），而真实数据仍在后台获取时，这会非常有用。

> 例如，单篇博客文章的查询可以从文章列表中取得“预览”数据；列表里可能只有标题和正文摘要。你不会希望把这份不完整的数据持久化为单篇文章查询的结果，但在真实查询获取完整对象期间，它可以帮助页面尽快展示内容布局。

在真正需要数据前，可以通过以下方式为查询提供占位数据：

- 声明式：
  - 向查询传入 `placeholderData`，在缓存为空时提供占位内容
- 命令式：
  - [使用 `queryClient` 预取或获取数据，并配合 `placeholderData` 选项](./prefetching.md)

使用 `placeholderData` 后，查询不会从 `pending` 状态开始，而会直接处于 `success` 状态，因为此时已经有可供展示的 `data`——哪怕它只是占位数据。为了与真实数据区分，查询结果中的 `isPlaceholderData` 会被设为 `true`。

## 作为值的占位数据

[//]: # 'ExampleValue'

```tsx
function Todos() {
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    placeholderData: placeholderTodos,
  })
}
```

[//]: # 'ExampleValue'
[//]: # 'Memoization'

### 占位数据记忆化

如果生成查询占位数据的开销较大，或只是不希望每次渲染都重复执行，可以对该值进行记忆化：

```tsx
function Todos() {
  const placeholderData = useMemo(() => generateFakeTodos(), [])
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    placeholderData,
  })
}
```

[//]: # 'Memoization'

## 作为函数的占位数据

`placeholderData` 也可以是一个函数，你可以通过它访问“上一个”成功查询的数据和查询元信息。当你想把一个查询的数据用作另一个查询的占位数据时，这非常有用。当查询键发生变化（例如从 `['todos', 1]` 变为 `['todos', 2]`）时，我们可以继续显示“旧”数据，而不必在数据从一个查询过渡到下一个查询期间显示加载指示器。详情请参阅[分页查询](./paginated-queries.md)。

[//]: # 'ExampleFunction'

```tsx
const result = useQuery({
  queryKey: ['todos', id],
  queryFn: () => fetch(`/todos/${id}`),
  placeholderData: (previousData, previousQuery) => previousData,
})
```

[//]: # 'ExampleFunction'

### 来自缓存的占位数据

某些情况下，可以从另一个查询的缓存结果中取得占位数据。例如，在博客文章列表查询的缓存中找到某篇文章的预览版本，再将其用作单篇文章查询的占位数据：

[//]: # 'ExampleCache'

```tsx
function BlogPost({ blogPostId }) {
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['blogPost', blogPostId],
    queryFn: () => fetch(`/blogPosts/${blogPostId}`),
    placeholderData: () => {
      // Use the smaller/preview version of the blogPost from the 'blogPosts'
      // query as the placeholder data for this blogPost query
      return queryClient
        .getQueryData(['blogPosts'])
        ?.find((d) => d.id === blogPostId)
    },
  })
}
```

[//]: # 'ExampleCache'
[//]: # 'Materials'

## 进一步阅读

关于占位数据与初始数据的比较，请参阅 [TkDodo 的文章](https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query)。

[//]: # 'Materials'
