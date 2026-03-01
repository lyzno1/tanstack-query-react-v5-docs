---
id: migrating-to-react-query-3
title: 迁移到 React Query 3
---

<!--
translation-source-path: framework/react/guides/migrating-to-react-query-3.md
translation-source-ref: v5.90.3
translation-source-hash: e94de1ea594743578b158a394f49b7ab7ad50d985924cfd5f2ce8bdc209b6c7a
translation-status: translated
-->


React Query 的早期版本已经非常优秀，带来了很多惊艳的新特性、更多“魔法”，以及整体更好的使用体验。它们也带来了大规模采用，同时伴随大量打磨（issues/contributions），让我们发现了一些仍需抛光的地方。v3 就是这次集中打磨的结果。

## 概览

- 更可扩展、可测试的缓存配置
- 更好的 SSR 支持
- 随处可用的数据滞后（此前为 `usePaginatedQuery`）
- 双向无限查询
- 查询数据选择器
- 可在使用前完整配置查询和/或变更默认项
- 可选渲染优化拥有更细粒度控制
- 新增 `useQueries` hook！（可变长度并行查询执行）
- `useIsFetching()` hook 支持查询过滤器
- 变更支持重试/离线/回放
- 可在 React 之外观察查询/变更
- 在任何地方复用 React Query 核心逻辑
- `react-query/devtools` 内置/同仓库 Devtools
- 缓存持久化到 web storage（实验性：`react-query/persistQueryClient-experimental` 与 `react-query/createWebStoragePersistor-experimental`）

## 破坏性变更

### `QueryCache` 已拆分为 `QueryClient` 以及更底层的 `QueryCache`、`MutationCache` 实例

`QueryCache` 包含所有查询，`MutationCache` 包含所有变更，而 `QueryClient` 用于配置它们并与它们交互。

这带来以下好处：

- 支持不同类型的缓存。
- 多个配置不同的 client 可共用同一缓存。
- client 可用于跟踪查询，这在 SSR 共享缓存场景很有用。
- client API 更聚焦通用用法。
- 更容易单独测试各个组件。

当你创建 `new QueryClient()` 时，如果没有显式提供，系统会自动创建 `QueryCache` 与 `MutationCache`。

```tsx
import { QueryClient } from 'react-query'

const queryClient = new QueryClient()
```

### `ReactQueryConfigProvider` 与 `ReactQueryCacheProvider` 均被 `QueryClientProvider` 取代

现在可以在 `QueryClient` 上指定查询与变更默认选项：

**注意：现在是 `defaultOptions`，不再是 `defaultConfig`**

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // query options
    },
    mutations: {
      // mutation options
    },
  },
})
```

`QueryClientProvider` 组件现在用于把 `QueryClient` 连接到应用：

```tsx
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

### 默认 `QueryCache` 已移除。**这次是真的！**

和之前弃用提示所说一致，主包不再创建或导出默认 `QueryCache`。**你必须自行创建：`new QueryClient()` 或 `new QueryCache()`（然后把后者传给 `new QueryClient({ queryCache })`）**。

### 已弃用的 `makeQueryCache` 工具已移除

它该退场很久了，现在终于移除了 :)

### `QueryCache.prefetchQuery()` 已迁移到 `QueryClient.prefetchQuery()`

新的 `QueryClient.prefetchQuery()` 是异步函数，但**不会返回查询数据**。如果你需要数据，请使用新的 `QueryClient.fetchQuery()`。

```tsx
// Prefetch a query:
await queryClient.prefetchQuery('posts', fetchPosts)

// Fetch a query:
try {
  const data = await queryClient.fetchQuery('posts', fetchPosts)
} catch (error) {
  // Error handling
}
```

### `ReactQueryErrorResetBoundary` 与 `QueryCache.resetErrorBoundaries()` 被 `QueryErrorResetBoundary` 与 `useQueryErrorResetBoundary()` 取代

它们组合后提供了与之前相同的体验，同时增加了对“重置哪些组件树”的控制。更多信息见：

- [QueryErrorResetBoundary](../../reference/QueryErrorResetBoundary.md)
- [useQueryErrorResetBoundary](../../reference/useQueryErrorResetBoundary.md)

### `QueryCache.getQuery()` 已替换为 `QueryCache.find()`

现在应使用 `QueryCache.find()` 在缓存中查找单个查询。

### `QueryCache.getQueries()` 已迁移为 `QueryCache.findAll()`

现在应使用 `QueryCache.findAll()` 在缓存中查找多个查询。

### `QueryCache.isFetching` 已迁移到 `QueryClient.isFetching()`

**注意：它现在是函数，不再是属性。**

### `useQueryCache` hook 已替换为 `useQueryClient` hook

它返回当前组件树注入的 `queryClient`，除了重命名，基本无需额外调整。

### 查询键的各部分不再自动展开传入查询函数

现在推荐用内联函数向查询函数传参：

```tsx
// Old
useQuery(['post', id], (_key, id) => fetchPost(id))

// New
useQuery(['post', id], () => fetchPost(id))
```

如果你仍坚持不使用内联函数，可以使用新增的 `QueryFunctionContext`：

```tsx
useQuery(['post', id], (context) => fetchPost(context.queryKey[1]))
```

### 无限查询页参数现在通过 `QueryFunctionContext.pageParam` 传递

过去它作为查询键的最后一个参数附加到查询函数里，但这在某些模式下不太好用。

```tsx
// Old
useInfiniteQuery(['posts'], (_key, pageParam = 0) => fetchPosts(pageParam))

// New
useInfiniteQuery(['posts'], ({ pageParam = 0 }) => fetchPosts(pageParam))
```

### `usePaginatedQuery()` 已移除，改用 `keepPreviousData` 选项

新的 `keepPreviousData` 选项同时适用于 `useQuery` 与 `useInfiniteQuery`，并保留相同的数据“滞后”效果：

```tsx
import { useQuery } from 'react-query'

function Page({ page }) {
  const { data } = useQuery(['page', page], fetchPage, {
    keepPreviousData: true,
  })
}
```

### `useInfiniteQuery()` 现在是双向的

`useInfiniteQuery()` 接口已经变更，以完整支持双向无限列表。

- `options.getFetchMore` 重命名为 `options.getNextPageParam`
- `queryResult.canFetchMore` 重命名为 `queryResult.hasNextPage`
- `queryResult.fetchMore` 重命名为 `queryResult.fetchNextPage`
- `queryResult.isFetchingMore` 重命名为 `queryResult.isFetchingNextPage`
- 新增 `options.getPreviousPageParam`
- 新增 `queryResult.hasPreviousPage`
- 新增 `queryResult.fetchPreviousPage`
- 新增 `queryResult.isFetchingPreviousPage`
- 无限查询的 `data` 现在是一个对象，包含 `pages` 与对应的 `pageParams`：`{ pages: [data, data, data], pageParams: [...]}`

单向：

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery(
    'projects',
    ({ pageParam = 0 }) => fetchProjects(pageParam),
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    },
  )
```

双向：

```tsx
const {
  data,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
} = useInfiniteQuery(
  'projects',
  ({ pageParam = 0 }) => fetchProjects(pageParam),
  {
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
  },
)
```

单向反转：

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery(
    'projects',
    ({ pageParam = 0 }) => fetchProjects(pageParam),
    {
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    },
  )
```

### 无限查询数据现在包含用于获取页面的 `pages` 数组与 `pageParams`

这让数据和页参数更容易操作。比如，移除第一页及其参数：

```tsx
queryClient.setQueryData(['projects'], (data) => ({
  pages: data.pages.slice(1),
  pageParams: data.pageParams.slice(1),
}))
```

### `useMutation` 现在返回对象而不是数组

旧写法确实让人想起第一次发现 `useState` 的温暖感觉，但这种感觉并不持久。现在变更返回值统一为单个对象。

```tsx
// Old:
const [mutate, { status, reset }] = useMutation()

// New:
const { mutate, status, reset } = useMutation()
```

### `mutation.mutate` 不再返回 Promise

- 原先 `[mutate]` 变量已变为 `mutation.mutate` 函数
- 新增 `mutation.mutateAsync` 函数

我们收到很多关于该行为的问题，用户普遍期望它像普通 Promise 一样工作。

因此 `mutate` 现在被拆分为 `mutate` 与 `mutateAsync`。

使用回调时可用 `mutate`：

```tsx
const { mutate } = useMutation({ mutationFn: addTodo })

mutate('todo', {
  onSuccess: (data) => {
    console.log(data)
  },
  onError: (error) => {
    console.error(error)
  },
  onSettled: () => {
    console.log('settled')
  },
})
```

使用 async/await 时可用 `mutateAsync`：

```tsx
const { mutateAsync } = useMutation({ mutationFn: addTodo })

try {
  const data = await mutateAsync('todo')
  console.log(data)
} catch (error) {
  console.error(error)
} finally {
  console.log('settled')
}
```

### `useQuery` 的对象语法现在采用扁平化配置

```tsx
// Old:
useQuery({
  queryKey: 'posts',
  queryFn: fetchPosts,
  config: { staleTime: Infinity },
})

// New:
useQuery({
  queryKey: 'posts',
  queryFn: fetchPosts,
  staleTime: Infinity,
})
```

### `QueryOptions.enabled` 若设置，必须是布尔值（`true`/`false`）

`enabled` 查询选项现在只有在值为 `false` 时才会禁用查询。
若有需要，可通过 `!!userId` 或 `Boolean(userId)` 转换值。传入非布尔值时会抛出明确错误。

### `QueryOptions.initialStale` 选项已移除

`initialStale` 已被移除，初始数据现在按普通数据处理。
这意味着只要提供了 `initialData`，查询默认会在挂载时重新获取。
如果你不希望立即重新获取，可以设置 `staleTime`。

### `QueryOptions.forceFetchOnMount` 已替换为 `refetchOnMount: 'always'`

说实话，我们当时的 `refetchOn____` 选项已经越来越多了，这次调整能让配置更清晰。

### `QueryOptions.refetchOnMount` 现在只作用于其所属组件，而不再影响所有查询观察者

过去把 `refetchOnMount` 设为 `false` 会阻止其他额外挂载组件在挂载时重新获取。
在 v3 中，只有设置了该选项的组件本身不会在挂载时重新获取。

### `QueryOptions.queryFnParamsFilter` 已移除，改用新的 `QueryFunctionContext` 对象

之所以移除 `queryFnParamsFilter`，是因为查询函数现在接收 `QueryFunctionContext`，不再直接接收查询键。

如果需要，你仍可在查询函数内部过滤参数，因为 `QueryFunctionContext` 同样包含查询键。

### `QueryOptions.notifyOnStatusChange` 已被新的 `notifyOnChangeProps` 与 `notifyOnChangePropsExclusions` 取代

借助这两个选项，你可以更细粒度地控制组件何时重新渲染。

仅在 `data` 或 `error` 变化时重渲染：

```tsx
import { useQuery } from 'react-query'

function User() {
  const { data } = useQuery(['user'], fetchUser, {
    notifyOnChangeProps: ['data', 'error'],
  })
  return <div>Username: {data.username}</div>
}
```

当 `isStale` 变化时不触发重渲染：

```tsx
import { useQuery } from 'react-query'

function User() {
  const { data } = useQuery(['user'], fetchUser, {
    notifyOnChangePropsExclusions: ['isStale'],
  })
  return <div>Username: {data.username}</div>
}
```

### `QueryResult.clear()` 已重命名为 `QueryResult.remove()`

它虽然叫 `clear`，但本质只是把查询从缓存里移除。新名称更符合实际功能。

### `QueryResult.updatedAt` 已拆分为 `QueryResult.dataUpdatedAt` 与 `QueryResult.errorUpdatedAt`

由于数据与错误可能同时存在，`updatedAt` 现已拆分为 `dataUpdatedAt` 和 `errorUpdatedAt`。

### `setConsole()` 已替换为新的 `setLogger()`

```tsx
import { setLogger } from 'react-query'

// Log with Sentry
setLogger({
  error: (error) => {
    Sentry.captureException(error)
  },
})

// Log with Winston
setLogger(winston.createLogger())
```

### React Native 不再需要手动覆盖 logger

过去为了避免查询失败时 React Native 弹出错误屏，需要手动改写 Console：

```tsx
import { setConsole } from 'react-query'

setConsole({
  log: console.log,
  warn: console.warn,
  error: console.warn,
})
```

在 v3 中，**React Query 在 React Native 环境会自动处理这件事**。

### TypeScript

#### `QueryStatus` 已从 [enum](https://www.typescriptlang.org/docs/handbook/enums.html#string-enums) 改为 [union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

因此，如果你之前用 `QueryStatus` 枚举值比较查询或变更的 `status`，现在需要改为与该枚举原先对应的字符串字面量比较。

对应关系如下：

- `QueryStatus.Idle` -> `'idle'`
- `QueryStatus.Loading` -> `'loading'`
- `QueryStatus.Error` -> `'error'`
- `QueryStatus.Success` -> `'success'`

下面是你需要做的变更示例：

```tsx
- import { useQuery, QueryStatus } from 'react-query'; // [!code --]
+ import { useQuery } from 'react-query'; // [!code ++]

const { data, status } = useQuery(['post', id], () => fetchPost(id))

- if (status === QueryStatus.Loading) { // [!code --]
+ if (status === 'loading') { // [!code ++]
  ...
}

- if (status === QueryStatus.Error) { // [!code --]
+ if (status === 'error') { // [!code ++]
  ...
}
```

## 新特性

#### 查询数据选择器

`useQuery` 和 `useInfiniteQuery` hook 现在支持 `select` 选项，可选择或转换查询结果的某一部分。

```tsx
import { useQuery } from 'react-query'

function User() {
  const { data } = useQuery(['user'], fetchUser, {
    select: (user) => user.username,
  })
  return <div>Username: {data}</div>
}
```

把 `notifyOnChangeProps` 设为 `['data', 'error']`，即可仅在选中数据变化时重新渲染。

#### `useQueries()` hook：可变长度并行查询执行

想在循环里跑 `useQuery`？Hook 规则不允许。但有了新的 `useQueries()`，你可以做到。

```tsx
import { useQueries } from 'react-query'

function Overview() {
  const results = useQueries([
    { queryKey: ['post', 1], queryFn: fetchPost },
    { queryKey: ['post', 2], queryFn: fetchPost },
  ])
  return (
    <ul>
      {results.map(({ data }) => data && <li key={data.id}>{data.title})</li>)}
    </ul>
  )
}
```

#### 变更重试/离线能力

默认情况下，React Query 不会在变更报错后自动重试，但你可以用 `retry` 选项开启：

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  retry: 3,
})
```

若变更因设备离线失败，会在设备重连后按原顺序重试。

#### 持久化变更

变更现在可以持久化到存储并在稍后恢复。更多信息可见变更文档。

#### QueryObserver

`QueryObserver` 可用于创建和/或观察查询：

```tsx
const observer = new QueryObserver(queryClient, { queryKey: 'posts' })

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

#### InfiniteQueryObserver

`InfiniteQueryObserver` 可用于创建和/或观察无限查询：

```tsx
const observer = new InfiniteQueryObserver(queryClient, {
  queryKey: 'posts',
  queryFn: fetchPosts,
  getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
})

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

#### QueriesObserver

`QueriesObserver` 可用于创建和/或观察多个查询：

```tsx
const observer = new QueriesObserver(queryClient, [
  { queryKey: ['post', 1], queryFn: fetchPost },
  { queryKey: ['post', 2], queryFn: fetchPost },
])

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

#### 为特定查询设置默认选项

`QueryClient.setQueryDefaults()` 可用于给特定查询设置默认选项：

```tsx
queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })

function Component() {
  const { data } = useQuery(['posts'])
}
```

#### 为特定变更设置默认选项

`QueryClient.setMutationDefaults()` 可用于给特定变更设置默认选项：

```tsx
queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })

function Component() {
  const { mutate } = useMutation({ mutationKey: ['addPost'] })
}
```

#### useIsFetching()

`useIsFetching()` hook 现在支持过滤器，例如只为某类查询显示加载指示器：

```tsx
const fetches = useIsFetching({ queryKey: ['posts'] })
```

#### 核心拆分

React Query 的核心已与 React 完全解耦，因此也可独立或在其他框架中使用。若只需核心能力，可从 `react-query/core` 入口导入：

```tsx
import { QueryClient } from 'react-query/core'
```

### Devtools 现已并入主仓库与 npm 包

Devtools 现已包含在 `react-query` 包内，导入路径为 `react-query/devtools`。将 `react-query-devtools` 的导入替换为 `react-query/devtools` 即可。
