---
id: prefetching
title: 预取和路由器集成
---

<!--
translation-source-path: framework/react/guides/prefetching.md
translation-source-ref: v5.90.3
translation-source-hash: 4f863e6b667bd7a6680d8e37ae66d2d8bc05e9cd490ce14c502b3c25ee3fa1c1
translation-status: translated
-->


当您知道或怀疑需要某条数据时，您可以使用预取来提前用该数据填充缓存，从而获得更快的体验。

有几种不同的预取模式：

1. 在事件处理程序中
2. 在组件中
3. 通过路由器集成
4. 在服务器渲染期间（路由器集成的另一种形式）

在本指南中，我们将了解前三个，而第四个将在 [Server Rendering & Hydration guide](../ssr.md) 和 [Advanced Server Rendering guide](../advanced-ssr.md) 中深入介绍。

预取的一种具体用途是避免请求瀑布流，有关这些内容的深入背景和说明，请参阅[Performance & Request Waterfalls guide](../request-waterfalls.md)。

## prefetchQuery 和 prefetchInfiniteQuery

在开始讨论不同的特定预取模式之前，让我们先看一下`prefetchQuery` 和`prefetchInfiniteQuery` 函数。首先是一些基础知识：

- 这些函数开箱即用，使用为`queryClient`配置的默认`staleTime`来确定缓存中的现有数据是新鲜的还是需要再次获取
- 您还可以传递特定的`staleTime`，如下所示：`prefetchQuery({ queryKey: ['todos'], queryFn: fn, staleTime: 5000 })`
  - 这个`staleTime`仅用于预取，您仍然需要为任何`useQuery`调用设置它
  - 如果您想忽略 `staleTime` 并始终返回缓存中可用的数据，则可以使用 `ensureQueryData` 函数。
  - 提示：如果您在服务器上预取，请为 `queryClient` 设置高于 `0` 的默认 `staleTime`，以避免必须向每个预取调用传递特定的 `staleTime`
- 如果预取查询没有出现 `useQuery` 实例，则在 `gcTime` 中指定的时间后它将被删除并进行垃圾回收
- 这些函数返回`Promise<void>`，因此从不返回查询数据。如果这是您需要的，请改用`fetchQuery`/`fetchInfiniteQuery`。
- 预取函数永远不会抛出错误，因为它们通常会尝试在 `useQuery` 中再次获取，这是一个很好的优雅回退。如果您需要捕获错误，请改用`fetchQuery`/`fetchInfiniteQuery`。

这是使用`prefetchQuery`的方式：

[//]: # 'ExamplePrefetchQuery'

```tsx
const prefetchTodos = async () => {
  // The results of this query will be cached like a normal query
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })
}
```

[//]: # 'ExamplePrefetchQuery'

无限查询可以像常规查询一样预取。默认情况下，仅预取查询的第一页并将其存储在给定的 QueryKey 下。如果你想预取不止一页，你可以使用`pages`选项，在这种情况下你还必须提供`getNextPageParam`函数：

[//]: # 'ExamplePrefetchInfiniteQuery'

```tsx
const prefetchProjects = async () => {
  // The results of this query will be cached like a normal query
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    pages: 3, // prefetch the first 3 pages
  })
}
```

[//]: # 'ExamplePrefetchInfiniteQuery'

接下来，让我们看看如何在不同情况下使用这些方法和其他方法进行预取。

## 事件处理程序中的预取

预取的一种简单形式是在用户与某物交互时进行预取。在此示例中，我们将使用`queryClient.prefetchQuery` 在`onMouseEnter` 或`onFocus` 上启动预取。

[//]: # 'ExampleEventHandler'

```tsx
function ShowDetailsButton() {
  const queryClient = useQueryClient()

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['details'],
      queryFn: getDetailsData,
      // Prefetch only fires when data is older than the staleTime,
      // so in a case like this you definitely want to set one
      staleTime: 60000,
    })
  }

  return (
    <button onMouseEnter={prefetch} onFocus={prefetch} onClick={...}>
      Show Details
    </button>
  )
}
```

[//]: # 'ExampleEventHandler'

## 组件中预取

当我们知道某些子级或后代将需要特定的数据，但在其他查询完成加载之前我们无法呈现该数据时，在组件生命周期期间预取非常有用。我们借用Request Waterfall指南中的一个例子来解释一下：

[//]: # 'ExampleComponent'

```tsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  if (isPending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  )
}

function Comments({ id }) {
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  ...
}
```

[//]: # 'ExampleComponent'

这会导致请求瀑布流如下所示：

```
1. |> getArticleById()
2.   |> getArticleCommentsById()
```

正如该指南中提到的，压平瀑布并提高性能的一种方法是将 `getArticleCommentsById` 查询提升到父级并将结果作为 prop 传递下来，但如果这是不可行或不理想的，例如当组件不相关并且它们之间有多个级别时，该怎么办？

在这种情况下，我们可以在父级中预取查询。最简单的方法是使用查询但忽略结果：

[//]: # 'ExampleParentComponent'

```tsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  // Prefetch
  useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
    // Optional optimization to avoid rerenders when this query changes:
    notifyOnChangeProps: [],
  })

  if (isPending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} />
    </>
  )
}

function Comments({ id }) {
  const { data, isPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  ...
}
```

[//]: # 'ExampleParentComponent'

这会立即开始获取 `'article-comments'` 并使瀑布变平：

```
1. |> getArticleById()
1. |> getArticleCommentsById()
```

[//]: # 'Suspense'

如果您想与 Suspense 一起预取，则必须采取一些不同的做法。您不能使用 `useSuspenseQueries` 进行预取，因为预取会阻止组件渲染。您也不能使用 `useQuery` 进行预取，因为只有在pending 查询 resolve 之后才会启动预取。对于这种情况，您可以使用库中提供的 [`usePrefetchQuery`](../../reference/usePrefetchQuery.md) 或 [`usePrefetchInfiniteQuery`](../../reference/usePrefetchInfiniteQuery.md) Hook。

您现在可以在实际需要数据的组件中使用`useSuspenseQuery`。您可能希望将后面的组件包装在其自己的 `<Suspense>` 边界中，以便我们预取的“辅助”查询不会阻止“主要”数据的呈现。

```tsx
function ArticleLayout({ id }) {
  usePrefetchQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  return (
    <Suspense fallback="Loading article">
      <Article id={id} />
    </Suspense>
  )
}

function Article({ id }) {
  const { data: articleData, isPending } = useSuspenseQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  ...
}
```

另一种方法是在查询函数内部预取。如果您知道每次获取文章时很可能还需要评论，那么这是有道理的。为此，我们将使用`queryClient.prefetchQuery`：

```tsx
const queryClient = useQueryClient()
const { data: articleData, isPending } = useQuery({
  queryKey: ['article', id],
  queryFn: (...args) => {
    queryClient.prefetchQuery({
      queryKey: ['article-comments', id],
      queryFn: getArticleCommentsById,
    })

    return getArticleById(...args)
  },
})
```

在效果中预取也可以，但请注意，如果您在同一组件中使用`useSuspenseQuery`，则该效果将在查询完成后运行，这可能不是您想要的。

```tsx
const queryClient = useQueryClient()

useEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })
}, [queryClient, id])
```

回顾一下，如果您想在组件生命周期期间预取查询，有几种不同的方法可以实现，请选择最适合您情况的一种：

- 使用 `usePrefetchQuery` 或 `usePrefetchInfiniteQuery` Hook 在 Suspense 边界之前预取
- 使用`useQuery`或`useSuspenseQueries`并忽略结果
- 在查询函数中预取
- 在效果中预取

接下来让我们看一个稍微高级的案例。

[//]: # 'Suspense'

### 相关查询和代码分割

有时我们希望根据另一次获取的结果有条件地预取。考虑这个从 [Performance & Request Waterfalls guide](../request-waterfalls.md) 借来的例子：

[//]: # 'ExampleConditionally1'

```tsx
// This lazy loads the GraphFeedItem component, meaning
// it wont start loading until something renders it
const GraphFeedItem = React.lazy(() => import('./GraphFeedItem'))

function Feed() {
  const { data, isPending } = useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
  })

  if (isPending) {
    return 'Loading feed...'
  }

  return (
    <>
      {data.map((feedItem) => {
        if (feedItem.type === 'GRAPH') {
          return <GraphFeedItem key={feedItem.id} feedItem={feedItem} />
        }

        return <StandardFeedItem key={feedItem.id} feedItem={feedItem} />
      })}
    </>
  )
}

// GraphFeedItem.tsx
function GraphFeedItem({ feedItem }) {
  const { data, isPending } = useQuery({
    queryKey: ['graph', feedItem.id],
    queryFn: getGraphDataById,
  })

  ...
}
```

[//]: # 'ExampleConditionally1'

正如该指南中所述，此示例导致以下双请求瀑布流：

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

如果我们不能重构我们的API，让`getFeed()`在必要时也返回`getGraphDataById()`数据，就无法摆脱`getFeed->getGraphDataById`瀑布，但通过利用条件预取，我们至少可以并行加载代码和数据。就像上面描述的那样，有多种方法可以执行此操作，但对于本例，我们将在查询函数中执行此操作：

[//]: # 'ExampleConditionally2'

```tsx
function Feed() {
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: ['feed'],
    queryFn: async (...args) => {
      const feed = await getFeed(...args)

      for (const feedItem of feed) {
        if (feedItem.type === 'GRAPH') {
          queryClient.prefetchQuery({
            queryKey: ['graph', feedItem.id],
            queryFn: getGraphDataById,
          })
        }
      }

      return feed
    }
  })

  ...
}
```

[//]: # 'ExampleConditionally2'

这将并行加载代码和数据：

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
2.   |> getGraphDataById()
```

然而，存在一个权衡，因为 `getGraphDataById` 的代码现在包含在父包中，而不是包含在 `JS for <GraphFeedItem>` 中，因此您需要根据具体情况确定最佳性能权衡。如果 `GraphFeedItem` 可能，则可能值得将代码包含在父级中。如果它们极其罕见，那可能就不是了。

[//]: # 'Router'

## 路由器集成

由于组件树本身中的数据获取很容易导致请求瀑布流，并且随着它们在整个应用程序中累积，针对该问题的不同修复可能会很麻烦，因此进行预取的一种有吸引力的方法是将其集成在路由器级别。

在这种方法中，您可以提前为每个_route_显式声明该组件树需要哪些数据。由于服务器渲染传统上需要在渲染开始之前加载所有数据，因此长期以来这一直是 SSR 应用程序的主导方法。这仍然是一种常见的方法，您可以在[Server Rendering & Hydration guide](../ssr.md) 中阅读更多相关信息。

现在，让我们关注客户端案例，并看一个示例，了解如何使用 [TanStack Router](https://tanstack.com/router) 来实现此目的。为了保持简洁，这些示例省略了很多设置和样板文件，您可以在 [TanStack Router docs](https://tanstack.com/router/latest/docs) 中查看 [full React Query example](https://tanstack.com/router/.latest/docs/framework/react/examples/basic-react-query-file-based)。

在路由器级别集成时，您可以选择“阻止”该路由的渲染，直到所有数据都存在，或者您可以启动预取但不等待结果。这样，您就可以尽快开始渲染路由。您还可以混合这两种方法并等待一些关键数据，但在所有辅助数据完成加载之前开始渲染。在此示例中，我们将配置 `/article` 路由，使其在文章数据加载完成之前不渲染，并尽快开始预取评论，但如果评论尚未完成加载，则不会阻止渲染路由。

```tsx
const queryClient = new QueryClient()
const routerContext = new RouterContext()
const rootRoute = routerContext.createRootRoute({
  component: () => { ... }
})

const articleRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'article',
  beforeLoad: () => {
    return {
      articleQueryOptions: { queryKey: ['article'], queryFn: fetchArticle },
      commentsQueryOptions: { queryKey: ['comments'], queryFn: fetchComments },
    }
  },
  loader: async ({
    context: { queryClient },
    routeContext: { articleQueryOptions, commentsQueryOptions },
  }) => {
    // Fetch comments asap, but don't block
    queryClient.prefetchQuery(commentsQueryOptions)

    // Don't render the route at all until article has been fetched
    await queryClient.prefetchQuery(articleQueryOptions)
  },
  component: ({ useRouteContext }) => {
    const { articleQueryOptions, commentsQueryOptions } = useRouteContext()
    const articleQuery = useQuery(articleQueryOptions)
    const commentsQuery = useQuery(commentsQueryOptions)

    return (
      ...
    )
  },
  errorComponent: () => 'Oh crap!',
})
```

也可以与其他路由器集成，请参阅[react-router](../../examples/react-router) 的另一个演示。

[//]: # 'Router'

## 手动启动查询

如果您已经拥有同步可用的查询数据，则无需预取它。您可以使用[Query Client 的 `setQueryData` 方法](../../../../reference/QueryClient.md#queryclientsetquerydata)直接按键添加或更新查询的缓存结果。

[//]: # 'ExampleManualPriming'

```tsx
queryClient.setQueryData(['todos'], todos)
```

[//]: # 'ExampleManualPriming'
[//]: # 'Materials'

## 进一步阅读

要深入了解如何在获取数据之前将数据放入查询缓存，请查看社区资源中的[#17: Seeding the Query Cache](../../community/tkdodos-blog.md#17-seeding-the-query-cache)。

与服务器端路由器和框架的集成与我们刚刚看到的非常相似，此外数据必须从服务器传递到客户端才能被合并到缓存中。要了解具体操作方法，请继续访问[Server Rendering & Hydration guide](../ssr.md)。

[//]: # 'Materials'
