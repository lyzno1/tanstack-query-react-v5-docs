---
id: request-waterfalls
title: 性能与请求瀑布
---

<!--
translation-source-path: framework/react/guides/request-waterfalls.md
translation-source-ref: v5.90.3
translation-source-hash: 14b2e5cfb6612af6b378b49338592597ccb5daa2b2b3e12fba4a8ff25796dcf6
translation-status: translated
-->


应用性能是一个广泛且复杂的话题。虽然 React Query 不能让你的 API 本身变快，但在使用 React Query 的方式上仍有很多需要注意的点，才能获得最佳性能。

使用 React Query（以及任何允许在组件内获取数据的库）时，最大的性能陷阱之一就是请求瀑布（request waterfalls）。本页将解释它是什么、如何识别它，以及如何通过重构应用或 API 来避免它。

[预获取与路由集成指南](../prefetching.md) 在此基础上进一步说明：当你无法或不适合重构应用或 API 时，如何提前预获取数据。

[服务端渲染与水合指南](../ssr.md) 会介绍如何在服务端预获取数据并传给客户端，从而避免再次获取。

[高级服务端渲染指南](../advanced-ssr.md) 还会进一步说明如何把这些模式应用到 Server Components 与流式服务端渲染中。

## 什么是请求瀑布？

请求瀑布指的是：某个资源（代码、css、图片、数据）的请求，必须等到另一个资源请求完成后才开始。

以一个网页为例。在加载 CSS、JS 等资源之前，浏览器必须先加载标记（markup）。这就是请求瀑布。

```
1. |-> Markup
2.   |-> CSS
2.   |-> JS
2.   |-> Image
```

如果你在 JS 文件里再去获取 CSS，就会变成双重瀑布：

```
1. |-> Markup
2.   |-> JS
3.     |-> CSS
```

如果该 CSS 又使用了背景图，就会变成三重瀑布：

```
1. |-> Markup
2.   |-> JS
3.     |-> CSS
4.       |-> Image
```

识别和分析请求瀑布最好的方式，通常是在浏览器开发者工具的 “Network” 标签页中观察。

每一层瀑布通常至少代表一次到服务器的往返（若资源本地缓存则例外）。在实践中，有些瀑布甚至可能代表不止一次往返，因为浏览器建立连接也需要来回交互（这里先忽略）。因此，请求瀑布的负面影响高度依赖用户延迟。以三重瀑布为例，它实际代表 4 次服务端往返。在 250ms 延迟下（3G 网络或较差网络条件并不少见），总耗时仅延迟部分就有 4\*250=1000ms。若能压平到第一个示例那样只需 2 次往返，则是 500ms，背景图可能快一倍加载完成。

## 请求瀑布与 React Query

现在来看 React Query。先聚焦不使用服务端渲染的情况。我们在发起查询前必须先加载 JS，所以在把数据展示到屏幕前，天然会有一个双重瀑布：

```
1. |-> Markup
2.   |-> JS
3.     |-> Query
```

基于这个前提，我们来看几种在 React Query 中常见的请求瀑布模式，以及如何避免它们。

- 单组件瀑布 / 串行查询
- 嵌套组件瀑布
- 代码分割

### 单组件瀑布 / 串行查询

当单个组件先获取一个查询，再获取另一个查询时，就形成了请求瀑布。这常见于第二个查询是[依赖查询](../dependent-queries.md)的场景，即它的获取依赖第一个查询的数据：

```tsx
// Get the user
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
})

const userId = user?.id

// Then get the user's projects
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // The query will not execute until the userId exists
  enabled: !!userId,
})
```

虽然并不总是可行，但从最佳性能角度看，通常更推荐重构 API，让这两份数据能在一个查询中拿到。比如上面的场景，与其先 `getUserByEmail` 再 `getProjectsByUser`，可以引入 `getProjectsByUserEmail` 查询来压平瀑布。

> 另一种无需重构 API 的缓解方式是把瀑布迁移到延迟更低的服务端。这正是 Server Components 的思路之一，详见 [高级服务端渲染指南](../advanced-ssr.md)。

串行查询的另一个例子是将 React Query 与 Suspense 一起使用：

```tsx
function App () {
  // The following queries will execute in serial, causing separate roundtrips to the server:
  const usersQuery = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useSuspenseQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useSuspenseQuery({ queryKey: ['projects'], queryFn: fetchProjects })

  // Note that since the queries above suspend rendering, no data
  // gets rendered until all of the queries finished
  ...
}
```

注意：如果是常规 `useQuery`，这些查询会并行执行。

好消息是这很容易修复。当组件中有多个 suspense 查询时，始终使用 `useSuspenseQueries` 即可。

```tsx
const [usersQuery, teamsQuery, projectsQuery] = useSuspenseQueries({
  queries: [
    { queryKey: ['users'], queryFn: fetchUsers },
    { queryKey: ['teams'], queryFn: fetchTeams },
    { queryKey: ['projects'], queryFn: fetchProjects },
  ],
})
```

### 嵌套组件瀑布

嵌套组件瀑布指的是父子组件都包含查询，且父组件在自己的查询完成前不会渲染子组件。这既可能发生在 `useQuery`，也可能发生在 `useSuspenseQuery`。

如果子组件是否渲染取决于父组件数据，或子组件查询依赖父组件通过 props 传入的结果，我们就会遇到“依赖型”嵌套组件瀑布。

先看一个子组件**不依赖**父组件数据的例子：

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

虽然 `<Comments>` 的 `id` 来自父组件，但在 `<Article>` 渲染时这个 `id` 已经可用，因此没有理由不能和文章查询同时获取评论。真实项目里子组件可能嵌套很深，这类瀑布更难发现和修复。就这个示例而言，一种压平方式是把评论查询上提到父组件：

```tsx
function Article({ id }) {
  const { data: articleData, isPending: articlePending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  const { data: commentsData, isPending: commentsPending } = useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
  })

  if (articlePending) {
    return 'Loading article...'
  }

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      {commentsPending ? (
        'Loading comments...'
      ) : (
        <Comments commentsData={commentsData} />
      )}
    </>
  )
}
```

这样两个查询就会并行获取。若你使用 suspense，通常应把它们合并为一个 `useSuspenseQueries`。

压平这个瀑布的另一种方式是在 `<Article>` 组件里预获取评论，或者在页面加载/路由跳转时于路由层预获取这两个查询。详见 [预获取与路由集成指南](../prefetching.md)。

接着看一个“依赖型嵌套组件瀑布”的例子。

```tsx
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

function GraphFeedItem({ feedItem }) {
  const { data, isPending } = useQuery({
    queryKey: ['graph', feedItem.id],
    queryFn: getGraphDataById,
  })

  ...
}
```

第二个查询 `getGraphDataById` 在两个维度依赖父级：第一，只有 `feedItem` 是 graph 时才会发生；第二，它需要父组件提供的 `id`。

```
1. |> getFeed()
2.   |> getGraphDataById()
```

这个例子里，我们无法仅靠把查询上提到父级，或简单添加预获取来轻易压平瀑布。和本指南开头的依赖查询例子类似，一种方案是重构 API，把 graph 数据直接包含在 `getFeed` 查询里。更高级的方案是借助 Server Components 把瀑布迁移到低延迟服务端（详见 [高级服务端渲染指南](../advanced-ssr.md)），但这可能是一次很大的架构变更。

即使应用里存在少量查询瀑布，性能也可能很好。关键是要认识到它们是常见性能问题，并保持关注。尤其隐蔽的一种情况是和代码分割叠加时，下面来看。

### Code Splitting

把应用 JS 代码拆成更小分块并按需加载，通常是实现高性能的关键步骤。但它也有副作用：经常会引入请求瀑布。当被拆分的代码块里还包含查询时，问题会更严重。

看一下 Feed 示例的一个小改版：

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

这个例子会形成双重瀑布：

```
1. |> getFeed()
2.   |> JS for <GraphFeedItem>
3.     |> getGraphDataById()
```

但这只是从示例代码视角看。如果考虑该页面首次加载，实际上在渲染图表前我们要完成 5 次到服务端的往返：

```
1. |> Markup
2.   |> JS for <Feed>
3.     |> getFeed()
4.       |> JS for <GraphFeedItem>
5.         |> getGraphDataById()
```

注意：在服务端渲染时，这个图景会有些不同，我们会在 [服务端渲染与水合指南](../ssr.md) 里进一步展开。另一个常见情况是包含 `<Feed>` 的路由本身也做了代码分割，这会再增加一跳。

在代码分割场景下，把 `getGraphDataById` 查询上提到 `<Feed>` 并按条件执行，或加一个条件预获取，可能反而更有帮助。这样该查询就能与代码并行获取，使示例变成：

```
1. |> getFeed()
2.   |> getGraphDataById()
2.   |> JS for <GraphFeedItem>
```

不过这本质上是权衡。你现在把 `getGraphDataById` 的数据获取代码放进了和 `<Feed>` 相同的 bundle，需要结合场景评估取舍。如何实践可参考 [预获取与路由集成指南](../prefetching.md)。

> 下面这组权衡并不理想：
>
> - 把全部数据获取代码放进主 bundle，即便它很少被用到
> - 把数据获取代码放入代码分割 bundle，但承受请求瀑布
>
> 这也是推动 Server Components 的动机之一。使用 Server Components 可以同时规避这两点。关于其在 React Query 中的应用，详见 [高级服务端渲染指南](../advanced-ssr.md)。

## 总结与要点

请求瀑布是非常常见且复杂的性能问题，伴随着大量权衡。你的应用里有很多方式会不小心引入它：

- 在子组件加了查询，却没意识到父组件已有查询
- 在父组件加了查询，却没意识到子组件已有查询
- 把一个含查询（且其后代也有查询）的组件迁移到新的父级，碰上了祖先中的查询
- 等等

由于这种“意外复杂度”，持续关注瀑布并定期检查应用非常值得（一个好办法是时不时查看 Network 标签页）。你不一定要把所有瀑布都压平才能获得好性能，但要重点关注影响最大的那些。

在下一篇指南中，我们会继续通过 [预获取与路由集成](../prefetching.md) 介绍更多压平瀑布的方法。
