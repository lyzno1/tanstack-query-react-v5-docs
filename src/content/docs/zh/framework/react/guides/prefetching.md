---
id: prefetching
title: 预取和路由器集成
---

当你知道或怀疑需要某条数据时，你可以使用预取来提前用该数据填充缓存，从而获得更快的体验。

有几种不同的预取模式：

1. 在事件处理程序中
2. 在组件中
3. 通过路由器集成
4. 在服务器渲染期间（路由器集成的另一种形式）

本指南介绍前三种模式；第四种模式会在[服务端渲染与水合指南](./ssr.md)和[高级服务端渲染指南](./advanced-ssr.md)中深入讲解。

预取的一个典型用途是避免请求瀑布。关于请求瀑布的背景和深入说明，请参阅[性能与请求瀑布指南](./request-waterfalls.md)。

## 使用 `query` 预取

> [!NOTE]
> 以下建议取代了现已弃用的 `prefetchQuery` 和 `ensureQueryData` 方法。如果你看过本指南的旧版本，请注意，这些方法将在 TanStack Query 的下一个主版本中移除。

预取查询需要使用 `query` 方法。默认情况下，该方法会：

- 运行查询函数
- 缓存结果
- 返回查询结果
- 遇到任何错误时抛出异常

用于预取时，通常需要调整这些默认行为：

- `query` 默认使用 `queryClient` 配置的 `staleTime`，判断缓存中的现有数据仍然新鲜，还是需要再次获取
- 你也可以传入特定的 `staleTime`，例如：`query({ queryKey: ['todos'], queryFn: fn, staleTime: 5000 })`
  - 这里的 `staleTime` 仅用于此次查询获取；在调用 `useQuery` 时仍需单独设置
  - 如果无论默认 `staleTime` 如何，只要缓存中有数据就直接返回，可以将 `staleTime` 设为 `"static"`
  - 提示：如果在服务端预取，可为该 `queryClient` 设置高于 `0` 的默认 `staleTime`，避免每次预取都单独传入
- 如果预取的查询没有任何 `useQuery` 实例，它会在 `gcTime` 指定的时间后被删除并进行垃圾回收
- 如果预取的是非关键数据，可以用 `void` 丢弃 Promise，并通过 `.catch(noop)` 忽略错误。该查询通常会在 `useQuery` 中再次尝试获取，这是一个自然的降级方案

下面是使用 `query` 进行预取的方式：

[//]: # 'ExamplePrefetchQuery'

```tsx
import { noop } from '@tanstack/react-query'

const prefetchTodos = async () => {
  await queryClient
    .query({
      queryKey: ['todos'],
      queryFn: fetchTodos,
      // Swallow errors here, because usually they will fetch again in `useQuery`
    })
    .catch(noop)
}
```

[//]: # 'ExamplePrefetchQuery'

无限查询可以像常规查询一样预取。默认只会预取第一页，并存储在指定的查询键下。如果要预取多页，可以使用 `pages` 选项；此时还必须提供 `getNextPageParam` 函数：

[//]: # 'ExamplePrefetchInfiniteQuery'

```tsx
import { noop } from '@tanstack/react-query'

const prefetchProjects = () => {
  await queryClient
    .infiniteQuery({
      queryKey: ['projects'],
      queryFn: fetchProjects,
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      pages: 3, // prefetch the first 3 pages
    })
    .catch(noop)
}
```

[//]: # 'ExamplePrefetchInfiniteQuery'

接下来，让我们看看如何在不同情况下使用这些方法和其他方法进行预取。

## 事件处理程序中的预取

一种直接的预取方式是在用户与某个元素交互时触发。下面使用 `queryClient.query`，在 `onMouseEnter` 或 `onFocus` 时开始预取。

[//]: # 'ExampleEventHandler'

```tsx
function ShowDetailsButton() {
  const queryClient = useQueryClient()

  const prefetch = () => {
    void queryClient.query({
      queryKey: ['details'],
      queryFn: getDetailsData,
      // Prefetch only fires when data is older than the staleTime,
      // so in a case like this you definitely want to set one
      staleTime: 60000,
    }).catch(noop)
  }

  return (
    <button onMouseEnter={prefetch} onFocus={prefetch} onClick={...}>
      Show Details
    </button>
  )
}
```

[//]: # 'ExampleEventHandler'

## 在组件中预取

如果我们知道某个子组件或后代组件会需要特定数据，但必须等另一个查询加载完成后才能渲染它，
那么在组件生命周期内预取就很有用。下面借用请求瀑布指南中的例子来说明：

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

这会形成如下请求瀑布：

```
1. |> getArticleById()
2.   |> getArticleCommentsById()
```

正如该指南所述，可以将 `getArticleCommentsById` 查询提升到父组件，再通过 prop 向下传递结果，
以此压平瀑布并提高性能。但如果这样做并不可行或不够理想，例如两个组件彼此无关且相隔多层，该怎么办？

这时可以在父组件中预取查询。最简单的做法是调用查询 Hook，但忽略其结果：

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

这样会立即开始获取 `'article-comments'`，从而压平瀑布：

```
1. |> getArticleById()
1. |> getArticleCommentsById()
```

[//]: # 'Suspense'

如果想配合 Suspense 进行预取，需要采用稍有不同的方式。不能用 `useSuspenseQueries` 预取，
因为它会阻止组件渲染；也不能用 `useQuery` 预取，因为它要等触发 Suspense 的查询 resolve 后才会开始。
此时可以使用库提供的 [`usePrefetchQuery`](../reference/functions/usePrefetchQuery.md) 或
[`usePrefetchInfiniteQuery`](../reference/functions/usePrefetchInfiniteQuery.md) Hook。

随后可以在真正需要数据的组件中使用 `useSuspenseQuery`。可以考虑为这个后续组件单独设置
`<Suspense>` 边界，以免正在预取的“次要”查询阻塞“主要”数据的渲染。

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

另一种方式是在查询函数内部预取。如果你知道每次获取文章后很可能还需要评论，这种方式就很合适。这里使用 `queryClient.query`：

```tsx
const queryClient = useQueryClient()
const { data: articleData, isPending } = useQuery({
  queryKey: ['article', id],
  queryFn: (...args) => {
    void queryClient
      .query({
        queryKey: ['article-comments', id],
        queryFn: getArticleCommentsById,
      })
      .catch(noop)

    return getArticleById(...args)
  },
})
```

也可以在 effect 中预取。但请注意，如果同一组件还使用了 `useSuspenseQuery`，该 effect 要等查询完成后
才会运行，这可能并不是你想要的时机。

```tsx
const queryClient = useQueryClient()

useEffect(() => {
  void queryClient
    .query({
      queryKey: ['article-comments', id],
      queryFn: getArticleCommentsById,
    })
    .catch(noop)
}, [queryClient, id])
```

总结一下，如果想在组件生命周期内预取查询，可以从以下方式中选择最适合当前场景的一种：

- 使用 `usePrefetchQuery` 或 `usePrefetchInfiniteQuery` Hook 在 Suspense 边界之前预取
- 使用 `useQuery` 或 `useSuspenseQueries` 并忽略结果
- 在查询函数中预取
- 在 Effect 中预取

接下来让我们看一个稍微高级的案例。

[//]: # 'Suspense'

### 依赖查询和代码分割

有时我们希望根据另一次获取的结果有条件地预取。请看这个借自[性能与请求瀑布指南](./request-waterfalls.md)的例子：

[//]: # 'ExampleConditionally1'

```tsx
// This lazy loads the GraphFeedItem component, meaning
// it won't start loading until something renders it
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

正如该指南所述，这个示例会形成如下双重请求瀑布：

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

如果无法重构 API，让 `getFeed()` 在必要时一并返回 `getGraphDataById()` 的数据，就无法消除
`getFeed -> getGraphDataById` 这层瀑布。不过，通过条件预取，至少可以并行加载代码和数据。
如上所述，实现方式有多种；本例选择在查询函数中预取：

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
          void queryClient.query({
            queryKey: ['graph', feedItem.id],
            queryFn: getGraphDataById,
          }).catch(noop)
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

不过这里存在权衡：`getGraphDataById` 的代码现在会进入父级 bundle，而不再只包含在
`<GraphFeedItem>` 的 JS 中，因此需要根据具体场景判断。如果 `GraphFeedItem` 很可能出现，
把这段代码放进父级 bundle 通常值得；如果它极少出现，则可能并不划算。

[//]: # 'Router'

## 路由器集成

组件树中的数据获取很容易形成请求瀑布，而随着应用中此类问题不断累积，逐个修复会越来越繁琐。
因此，在路由器层集成预取是一种很有吸引力的方案。

在这种方式下，你需要提前为每条_路由_显式声明其组件树所需的数据。传统的服务端渲染必须先加载全部数据才能开始渲染，因此长期以来，这一直是 SSR 应用的主流方式。它至今仍很常见，详情请参阅[服务端渲染与水合指南](./ssr.md)。

现在先关注客户端场景，看看如何通过 [TanStack Router](https://tanstack.com/router) 实现。为了保持简洁，
示例省略了大量设置与样板代码；完整细节可查看 [TanStack Router 的 React Query 示例](https://tanstack.com/router/latest/docs/framework/react/examples/basic-react-query-file-based)
和 [TanStack Router 文档](https://tanstack.com/router/latest/docs)。

在路由器级别集成时，你可以选择“阻止”该路由的渲染，直到所有数据都存在，或者你可以启动预取但不等待结果。这样，你就可以尽快开始渲染路由。你还可以混合这两种方法并等待一些关键数据，但在所有辅助数据完成加载之前开始渲染。在此示例中，我们将配置 `/article` 路由，使其在文章数据加载完成之前不渲染，并尽快开始预取评论，但如果评论尚未完成加载，则不会阻止渲染路由。

请注意，许多路由加载器会借助错误边界触发错误回退。此前我们一直使用 `.catch(noop)` 忽略那些之后会由 `useQuery` 重试的数据错误；但对于路由正常工作所必需的关键数据，应直接 `await` Promise，不要使用 `noop`，并在 `try` 块或路由器自身的错误处理机制（例如 TanStack Router 的 `errorComponent`）中处理错误。

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
    // Fetch comments asap, but don't block or throw errors
    void queryClient.query(commentsQueryOptions).catch(noop)

    // Don't render the route at all until article has been fetched
    // As this is critical data we want the error component to trigger
    // as soon as possible if something goes wrong
    await queryClient.query({
      ...articleQueryOptions,
      // If we have the article loaded already, we don't want to block on
      // an extra prefetch; fallback on the default useQuery behavior to
      // keep the data fresh
      staleTime: 'static'
    })
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

也可以与其他路由器集成；[react-router 示例](../examples/react-router)提供了另一种演示。

[//]: # 'Router'

## 手动预填充查询缓存

如果已经有同步可用的查询数据，就不必预取。可以使用 [Query Client 的 `setQueryData` 方法](../../../reference/QueryClient.md#queryclientsetquerydata)，直接按查询键添加或更新缓存结果。

[//]: # 'ExampleManualPriming'

```tsx
queryClient.setQueryData(['todos'], todos)
```

[//]: # 'ExampleManualPriming'
[//]: # 'Materials'

## 进一步阅读

要深入了解如何在获取数据之前预先填充查询缓存，请参阅 TkDodo 的 [Seeding the Query Cache](https://tkdodo.eu/blog/seeding-the-query-cache)。

与服务端路由器和框架的集成方式与刚才非常相似，区别在于还需把数据从服务端传给客户端，再水合到客户端缓存中。具体做法请继续阅读[服务端渲染与水合指南](./ssr.md)。

[//]: # 'Materials'
