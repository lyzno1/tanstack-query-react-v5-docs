---
id: placeholder-query-data
title: 占位查询数据
---

<!--
translation-source-path: framework/react/guides/placeholder-query-data.md
translation-source-ref: v5.90.3
translation-source-hash: e051631eba8661aa5442249fd1d5e877061cbef3ef379cc6e2dccc36713e4b54
translation-status: translated
-->


## 什么是占位数据？

占位数据允许查询的行为就像它已经有数据一样，类似于 `initialData` 选项，但**数据不会持久保存到缓存中**。当您有足够的部分（或假）数据来成功呈现查询，而实际数据在后台获取时，这会派上用场。

> 示例：单个博客文章查询可以从仅包含标题和帖子正文的一小部分的博客文章父列表中提取“预览”数据。您不希望将部分数据保留到单个查询的查询结果中，但它对于在实际查询完成获取整个对象时尽快显示内容布局很有用。

有几种方法可以在需要之前向缓存提供查询的占位数据：

- 声明式：
  - 向查询提供 `placeholderData` 以预填充其缓存（如果为空）
- 命令式：
  - [使用 `queryClient` 和 `placeholderData` 选项进行预获取或获取数据](../prefetching.md)

当我们使用 `placeholderData` 时，我们的查询将不会处于 `pending` 状态 - 它将开始处于 `success` 状态，因为我们要显示 `data` - 即使该数据只是“占位符”数据。为了将其与“真实”数据区分开来，我们还将查询结果上的 `isPlaceholderData` 标志设置为 `true`。

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

如果访问查询占位数据的过程很密集，或者只是不想在每次渲染时执行，则可以记住该值：

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

`placeholderData` 也可以是一个函数，您可以在其中访问“先前”成功查询的数据和查询元信息。这对于您想要使用一个查询中的数据作为另一查询的占位数据的情况非常有用。当 QueryKey 改变时，例如从`['todos', 1]`到`['todos', 2]`，我们可以继续显示“旧”数据，而不必在数据从一个查询过渡到下一个查询时显示加载指示器。欲了解更多信息，请参阅[Paginated Queries](../paginated-queries.md)。

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

在某些情况下，您也许能够从另一个查询的缓存结果中为查询提供占位数据。一个很好的例子是从博客文章列表查询中搜索缓存数据以获取该文章的预览版本，然后将其用作单个帖子查询的占位数据：

[//]: # 'ExampleCache'

```tsx
function Todo({ blogPostId }) {
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

如需`Placeholder Data` 和`Initial Data` 之间的比较，请查看[Community Resources](../../community/tkdodos-blog.md#9-placeholder-and-initial-data-in-react-query)。

[//]: # 'Materials'
