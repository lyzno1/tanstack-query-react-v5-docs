---
id: migrating-to-react-query-4
title: 迁移到 React Query 4
---

<!--
translation-source-path: framework/react/guides/migrating-to-react-query-4.md
translation-source-ref: v5.90.3
translation-source-hash: 6b5b58892e4d8607e71dfbf4383d62ef7140a129da77ff1bac4fada32996ef2b
translation-status: translated
-->


## 重大变化

v4 是一个主要版本，因此需要注意一些重大更改：

### react-query 现在是 @tanstack/react-query

您将需要卸载/安装依赖项并更改导入：

```
npm uninstall react-query
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

```tsx
- import { useQuery } from 'react-query' // [!code --]
- import { ReactQueryDevtools } from 'react-query/devtools' // [!code --]

+ import { useQuery } from '@tanstack/react-query' // [!code ++]
+ import { ReactQueryDevtools } from '@tanstack/react-query-devtools' // [!code ++]
```

#### Codemod

为了使导入迁移更容易，v4 附带了一个 codemod。

> codemod 会尽力帮助你迁移这些破坏性变更。请务必仔细检查生成的代码！另外，codemod 无法覆盖某些边界情况，请留意日志输出。

您可以使用以下命令之一（或两个）轻松应用它：

如果您想针对 `.js` 或 `.jsx` 文件运行它，请使用以下命令：

```
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js
```

如果您想针对 `.ts` 或 `.tsx` 文件运行它，请使用以下命令：

```
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js
```

请注意，在 `TypeScript` 的情况下，您需要使用 `tsx` 作为解析器；否则，codemod将无法正确应用！

**注意：** 应用 codemod 可能会破坏您的代码格式，因此请不要忘记在应用 codemod 后运行 `prettier` 和/或 `eslint`！

**注意：** codemod 将_仅_更改导入 - 您仍然需要手动安装单独的开发工具包。

### 查询键（和变更键）需要是一个数组

在 v3 中，查询和变更键可以是字符串或数组。在内部，React Query 始终仅使用数组键，我们有时会将其暴露给消费者。例如，在 `queryFn` 中，您始终会以数组形式获取密钥，以便更轻松地使用 [Default Query Functions](../default-query-function.md)。

然而，我们并没有在所有 API 中都遵循这个概念。例如，当在 [Query Filters](../filters.md) 上使用 `predicate` 函数时，您将获得原始查询键。如果您使用混合数组和字符串的查询键，这使得使用此类函数变得困难。使用全局回调时也是如此。

为了简化所有 api，我们决定仅将所有键设为数组：

```tsx
;-useQuery('todos', fetchTodos) + // [!code --]
  useQuery(['todos'], fetchTodos) // [!code ++]
```

#### Codemod

为了使迁移更容易，我们决定提供一个 codemod。

> codemod 会尽力帮助你迁移这些破坏性变更。请务必仔细检查生成的代码！另外，codemod 无法覆盖某些边界情况，请留意日志输出。

您可以使用以下命令之一（或两个）轻松应用它：

如果您想针对 `.js` 或 `.jsx` 文件运行它，请使用以下命令：

```
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/key-transformation.js
```

如果您想针对 `.ts` 或 `.tsx` 文件运行它，请使用以下命令：

```
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/key-transformation.js
```

请注意，在 `TypeScript` 的情况下，您需要使用 `tsx` 作为解析器；否则，codemod将无法正确应用！

**注意：** 应用 codemod 可能会破坏您的代码格式，因此请不要忘记在应用 codemod 后运行 `prettier` 和/或 `eslint`！

### 空闲状态已被移除

随着新的 [fetchStatus](../queries.md#fetchstatus) 的引入以提供更好的离线支持，`idle` 状态变得无关紧要，因为 `fetchStatus: 'idle'` 可以更好地捕获相同的状态。欲了解更多信息，请阅读[Why two different states](../queries.md#why-two-different-states)。

这将主要影响还没有任何`data`的`disabled`查询，因为它们之前处于`idle`状态：

```tsx
- status: 'idle' // [!code --]
+ status: 'loading'  // [!code ++]
+ fetchStatus: 'idle' // [!code ++]
```

另外，看看[the guide on dependent queries](../dependent-queries.md)

#### 禁用查询

由于此更改，禁用的查询（即使是暂时禁用的查询）将以 `loading` 状态启动。为了使迁移更容易，特别是为了有一个好的标志来知道何时显示加载指示器，您可以检查 `isInitialLoading` 而不是 `isLoading`：

```tsx
;-isLoading + // [!code --]
  isInitialLoading // [!code ++]
```

另请参阅[disabling queries](../disabling-queries.md#isInitialLoading) 上的指南

### `useQueries` 的新 API

`useQueries` Hook 现在接受带有 `queries` 属性的对象作为其输入。 `queries` 属性的值是一个查询数组（该数组与 v3 中传递给 `useQueries` 的数组相同）。

```tsx
;-useQueries([
  { queryKey1, queryFn1, options1 },
  { queryKey2, queryFn2, options2 },
]) + // [!code --]
  useQueries({
    queries: [
      { queryKey1, queryFn1, options1 },
      { queryKey2, queryFn2, options2 },
    ],
  }) // [!code ++]
```

### 未定义是成功查询的非法缓存值

为了通过返回 `undefined` 来避免更新，我们必须将 `undefined` 设置为非法缓存值。这与反应查询的其他概念一致，例如，从 [initialData function](../initial-query-data.md#initial-data-function) 返回 `undefined` 也不会设置数据。

此外，通过在 queryFn 中添加日志记录来生成 `Promise<void>` 是一个很容易的错误：

```tsx
useQuery(['key'], () =>
  axios.get(url).then((result) => console.log(result.data)),
)
```

现在在类型级别上不允许这样做；在运行时，`undefined`将被转换为_失败的Promise_，这意味着你将得到一个`error`，它也会在开发模式下记录到控制台。

### 默认情况下，查询和变更需要网络连接才能运行

请阅读[New Features announcement](#proper-offline-support)有关在线/离线支持的信息，以及有关[Network mode](../network-mode.md)的专用页面

尽管 React Query 是一个异步状态管理器，可用于产生 Promise 的任何内容，但它最常与数据获取库结合用于数据获取。这就是为什么默认情况下，如果没有网络连接，查询和变更将为`paused`。如果您想选择之前的行为，您可以为查询和变更全局设置`networkMode: offlineFirst`：

```tsx
new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})
```

### `notifyOnChangeProps` 属性不再接受 `"tracked"` 作为值

`notifyOnChangeProps` 选项不再接受`"tracked"` 值。相反，`useQuery` 默认跟踪属性。所有使用 `notifyOnChangeProps: "tracked"` 的查询都应通过删除此选项进行更新。

如果您想在任何查询中绕过此设置，以模拟每当查询更改时重新渲染的 v3 默认行为，`notifyOnChangeProps` 现在接受 `"all"` 值以选择退出默认智能跟踪优化。

### `notifyOnChangePropsExclusion` 已被删除

在 v4 中，`notifyOnChangeProps` 默认为 v3 的 `"tracked"` 行为，而不是 `undefined`。现在 `"tracked"` 是 v4 的默认行为，包含此配置选项不再有意义。

### `cancelRefetch` 的一致行为

`cancelRefetch` 选项可以传递给所有强制获取查询的函数，即：

- `queryClient.refetchQueries`
- `queryClient.invalidateQueries`
- `queryClient.resetQueries`
- `refetch` 从 `useQuery` 返回
- `fetchNextPage` 和`fetchPreviousPage` 从`useInfiniteQuery` 返回

除了 `fetchNextPage` 和 `fetchPreviousPage` 之外，此标志默认为 `false`，这是不一致的并且可能会带来麻烦：如果先前的慢速获取已经在进行，则在变更后调用 `refetchQueries` 或 `invalidateQueries` 可能不会产生最新结果，因为本次重新获取将被跳过。

我们相信，如果您编写的某些代码主动重新获取查询，则默认情况下，它应该重新启动获取。

这就是为什么对于上述所有方法，该标志现在默认为 _true_ 。这也意味着，如果您连续调用 `refetchQueries` 两次，而不等待它，它现在将取消第一次获取并重新启动第二次获取：

```
queryClient.refetchQueries({ queryKey: ['todos'] })
// this will abort the previous refetch and start a new fetch
queryClient.refetchQueries({ queryKey: ['todos'] })
```

您可以通过显式传递 `cancelRefetch:false` 来选择退出此行为：

```
queryClient.refetchQueries({ queryKey: ['todos'] })
// this will not abort the previous refetch - it will just be ignored
queryClient.refetchQueries({ queryKey: ['todos'] }, { cancelRefetch: false })
```

> 注意：自动触发的提取的行为没有变化，例如因为安装了查询或因为窗口焦点重新获取。

### 查询过滤器

[query filter](../filters.md) 是一个具有某些条件来匹配查询的对象。从历史上看，过滤器选项主要是布尔标志的组合。然而，组合这些标志可能会导致不可能的状态。具体来说：

```
active?: boolean
  - When set to true it will match active queries.
  - When set to false it will match inactive queries.
inactive?: boolean
  - When set to true it will match inactive queries.
  - When set to false it will match active queries.
```

这些标志一起使用时效果不佳，因为它们是互斥的。从描述来看，为两个标志设置 `false` 可以匹配所有查询，也可以不匹配任何查询，这没有多大意义。

在 v4 中，这些过滤器已合并为单个过滤器，以更好地显示意图：

```tsx
- active?: boolean // [!code --]
- inactive?: boolean // [!code --]
+ type?: 'active' | 'inactive' | 'all' // [!code ++]
```

过滤器默认为`all`，您可以选择仅匹配`active` 或`inactive` 查询。

#### 重新获取活动/重新获取非活动

[queryClient.invalidateQueries](../../../../reference/QueryClient.md#queryclientinvalidatequeries) 有两个额外的类似标志：

```
refetchActive: Boolean
  - Defaults to true
  - When set to false, queries that match the refetch predicate and are actively being rendered
    via useQuery and friends will NOT be refetched in the background, and only marked as invalid.
refetchInactive: Boolean
  - Defaults to false
  - When set to true, queries that match the refetch predicate and are not being rendered
    via useQuery and friends will be both marked as invalid and also refetched in the background
```

出于同样的原因，这些也被合并：

```tsx
- refetchActive?: boolean // [!code --]
- refetchInactive?: boolean // [!code --]
+ refetchType?: 'active' | 'inactive' | 'all' | 'none' // [!code ++]
```

该标志默认为`active`，因为`refetchActive` 默认为`true`。这意味着我们还需要一种方法来告诉`invalidateQueries`根本不重新获取，这就是为什么这里也允许第四个选项（`none`）。

### `onSuccess` 不再从 `setQueryData` 调用

这让许多人感到困惑，并且如果从 `onSuccess` 内部调用 `setQueryData`，也会产生无限循环。当与 `staleTime` 结合使用时，它也是一个常见的错误源，因为如果仅从缓存中读取数据，`onSuccess` 不会被调用。

与`onError` 和`onSettled` 类似，`onSuccess` 回调现在与发出的请求相关联。没有请求 -> 没有回调。

如果您想监听`data`字段的变化，最好使用`useEffect`来实现，其中`data`是依赖数组的一部分。由于 React Query 通过结构共享确保数据稳定，因此效果不会在每次后台重新获取时执行，但仅当数据中的某些内容发生更改时才执行：

```
const { data } = useQuery({ queryKey, queryFn })
React.useEffect(() => mySideEffectHere(data), [data])
```

### `persistQueryClient` 和相应的持久化插件不再是实验性的，并且已被重命名

插件`createWebStoragePersistor` 和`createAsyncStoragePersistor` 已分别重命名为[`createSyncStoragePersister`](../../plugins/createSyncStoragePersister.md) 和[`createAsyncStoragePersister`](../../plugins/createAsyncStoragePersister.md)。 `persistQueryClient` 中的接口`Persistor` 也已重命名为`Persister`。查看[this stackexchange](https://english.stackexchange.com/questions/206893/persister-or-persistor) 以了解此更改的动机。

由于这些插件不再是实验性的，因此它们的导入路径也已更新：

```tsx
- import { persistQueryClient } from 'react-query/persistQueryClient-experimental' // [!code --]
- import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental' // [!code --]
- import { createAsyncStoragePersistor } from 'react-query/createAsyncStoragePersistor-experimental' // [!code --]

+ import { persistQueryClient } from '@tanstack/react-query-persist-client' // [!code ++]
+ import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister' // [!code ++]
+ import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'  // [!code ++]
```

### 不再支持 Promise 上的 `cancel` 方法

[旧的 `promise.cancel` 方法](../query-cancellation.md#old-cancel-function) 允许您在 Promise 上定义 `cancel` 函数，然后库使用该函数来支持查询取消，该 [旧的 `promise.cancel` 方法](../query-cancellation.md#old-cancel-function) 已被删除。我们建议使用[newer API](../query-cancellation.md)（v3.30.0中引入）进行查询取消，它内部使用[`AbortController` API](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)，并为您的查询函数提供[`AbortSignal` instance](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)以支持查询取消。

### 打字稿

类型现在需要使用 TypeScript v4.1 或更高版本

### 支持的浏览器

从 v4 开始，React Query 针对现代浏览器进行了优化。我们更新了浏览器列表，以生成更现代、更高性能且更小的捆绑包。您可以阅读有关要求[here](../../installation#requirements)。

### `setLogger` 已删除

可以通过调用 `setLogger` 来全局更改记录器。在 v4 中，创建 `QueryClient` 时该函数被替换为可选字段。

```tsx
- import { QueryClient, setLogger } from 'react-query'; // [!code --]
+ import { QueryClient } from '@tanstack/react-query'; // [!code ++]

- setLogger(customLogger) // [!code --]
- const queryClient = new QueryClient(); // [!code --]
+ const queryClient = new QueryClient({ logger: customLogger }) // [!code ++]
```

### 无_默认_手动垃圾回收服务器端

在 v3 中，React Query 将默认缓存查询结果 5 分钟，然后手动垃圾回收该数据。此默认值也适用于服务器端 React Query。

这会导致高内存消耗和挂起进程等待手动垃圾回收完成。在 v4 中，默认情况下，服务器端 `cacheTime` 现在设置为 `Infinity`，有效禁用手动垃圾回收（一旦请求完成，NodeJS 进程将清除所有内容）。

此更改仅影响服务器端 React Query 的用户，例如 Next.js。如果您手动设置 `cacheTime`，这不会影响您（不过您可能希望保持行为一致）。

### 登录生产环境

从 v4 开始，react-query 将不再在生产模式下将错误（例如失败的获取）记录到控制台，因为这让许多人感到困惑。
在开发模式下错误仍然会出现。

### 支持 package exports 与环境管理

React Query 现在支持 [package.json `exports`](https://nodejs.org/api/packages.html#exports) 并与 Node 的 CommonJS 和 ESM 原生解析完全兼容。我们不希望这对大多数用户来说是一个重大变化，但这限制了您可以导入到项目中的文件仅限于我们正式支持的入口点。

### 简化的通知事件

手动订阅 `QueryCache` 始终会为您提供 `QueryCacheNotifyEvent`，但 `MutationCache` 则不然。我们简化了行为并相应地调整了事件名称。

#### 查询缓存通知事件

```tsx
- type: 'queryAdded' // [!code --]
+ type: 'added' // [!code ++]
- type: 'queryRemoved' // [!code --]
+ type: 'removed' // [!code ++]
- type: 'queryUpdated' // [!code --]
+ type: 'updated' // [!code ++]
```

#### 变更缓存通知事件

`MutationCacheNotifyEvent` 使用与 `QueryCacheNotifyEvent` 相同的类型。

> 注意：仅当您通过 `queryCache.subscribe` 或 `mutationCache.subscribe` 手动订阅缓存时，这才相关

### 单独的水化导出已被删除

在 [3.22.0](https://github.com/tannerlinsley/react-query/releases/tag/v3.22.0) 版本中，水合实用程序移至 React Query 核心。在 v3 中，您仍然可以使用 `react-query/hydration` 中的旧导出，但这些导出已在 v4 中删除。

```tsx
- import { dehydrate, hydrate, useHydrate, Hydrate } from 'react-query/hydration' // [!code --]
+ import { dehydrate, hydrate, useHydrate, Hydrate } from '@tanstack/react-query' // [!code ++]
```

### 从 `queryClient`、`query` 和 `mutation` 中删除了未记录的方法

`QueryClient` 上的方法 `cancelMutations` 和 `executeMutation` 未记录且内部未使用，因此我们删除了它们。由于它只是 `mutationCache` 上可用方法的包装，因此您仍然可以使用 `executeMutation` 的功能

```tsx
- executeMutation< // [!code --]
-   TData = unknown, // [!code --]
-   TError = unknown, // [!code --]
-   TVariables = void, // [!code --]
-   TContext = unknown // [!code --]
- >( // [!code --]
-   options: MutationOptions<TData, TError, TVariables, TContext> // [!code --]
- ): Promise<TData> { // [!code --]
-   return this.mutationCache.build(this, options).execute() // [!code --]
- } // [!code --]
```

此外，`query.setDefaultOptions` 也被删除，因为它也未被使用。 `mutation.cancel` 已被删除，因为它实际上并未取消传出请求。

### `src/react` 目录已重命名为`src/reactjs`

以前，React Query 有一个名为 `react` 的目录，它是从 `react` 模块导入的。这可能会导致某些 Jest 配置出现问题，从而导致运行测试时出现错误，例如：

```
TypeError: Cannot read property 'createContext' of undefined
```

重命名目录后，这不再是问题。

如果您直接在项目中从 `'react-query/react'` 导入任何内容（而不是仅 `'react-query'`），那么您需要更新导入：

```tsx
- import { QueryClientProvider } from 'react-query/react'; // [!code --]
+ import { QueryClientProvider } from '@tanstack/react-query/reactjs'; // [!code ++]
```

## 新功能🚀

v4 附带了一组很棒的新功能：

### 支持 React 18

React 18 于今年早些时候发布，v4 现在对其及其带来的新并发功能拥有一流的支持。

### 适当的离线支持

在 v3 中，React Query 始终会触发查询和变更，但随后假设如果您想重试，则需要连接到互联网。这导致了几种令人困惑的情况：

- 您处于离线状态并挂载查询 - 它会进入加载状态，请求失败，并且它会保持加载状态，直到您再次上线，即使它并没有真正获取。
- 同样，如果您处于离线状态并且关闭了重试，您的查询将触发并失败，并且查询将进入错误状态。
- 您处于离线状态，想要启动一个不一定需要网络连接的查询（因为您_可以_使用 React Query 进行数据获取以外的其他操作），但由于某些其他原因而失败。该查询现在将暂停，直到您再次上线。
- 如果您处于离线状态，窗口焦点重新获取根本不会执行任何操作。

在 v4 中，React Query 引入了新的 `networkMode` 来解决所有这些问题。请阅读有关新[Network mode](../network-mode) 的专用页面以获取更多信息。

### 默认跟踪查询

React Query 默认为“跟踪”查询属性，这应该会给您带来渲染优化的良好提升。该功能自 [v3.6.0](https://github.com/tannerlinsley/react-query/releases/tag/v3.6.0) 以来就已经存在，现在已成为 v4 的默认行为。

### 使用 setQueryData 避免更新

使用[functional updater form of setQueryData](../../../../reference/QueryClient.md#queryclientsetquerydata)时，您现在可以通过返回`undefined`来退​​出更新。如果 `undefined` 作为 `previousValue` 提供给您，这会很有帮助，这意味着当前不存在缓存条目，并且您不想/无法创建一个条目，就像切换待办事项的示例一样：

```tsx
queryClient.setQueryData(['todo', id], (previousTodo) =>
  previousTodo ? { ...previousTodo, done: true } : undefined,
)
```

### 变更缓存垃圾回收

就像查询一样，现在也可以自动对变更进行垃圾回收。变更的默认 `cacheTime` 也设置为 5 分钟。

### 多个提供商的自定义上下文

现在可以指定自定义上下文来将Hook与其匹配的 `Provider` 配对。当组件树中可能有多个 React Query `Provider` 实例时，这一点至关重要，并且您需要确保您的Hook使用正确的 `Provider` 实例。

一个例子：

1. 创建数据包。

```tsx
// Our first data package: @my-scope/container-data

const context = React.createContext<QueryClient | undefined>(undefined)
const queryClient = new QueryClient()

export const useUser = () => {
  return useQuery(USER_KEY, USER_FETCHER, {
    context,
  })
}

export const ContainerDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient} context={context}>
      {children}
    </QueryClientProvider>
  )
}
```

2. 创建第二个数据包。

```tsx
// Our second data package: @my-scope/my-component-data

const context = React.createContext<QueryClient | undefined>(undefined)
const queryClient = new QueryClient()

export const useItems = () => {
  return useQuery(ITEMS_KEY, ITEMS_FETCHER, {
    context,
  })
}

export const MyComponentDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient} context={context}>
      {children}
    </QueryClientProvider>
  )
}
```

3. 在您的应用程序中使用这两个数据包。

```tsx
// Our application

import { ContainerDataProvider, useUser } from "@my-scope/container-data";
import { AppDataProvider } from "@my-scope/app-data";
import { MyComponentDataProvider, useItems } from "@my-scope/my-component-data";

<ContainerDataProvider> // <-- Provides container data (like "user") using its own React Query provider
  ...
  <AppDataProvider> // <-- Provides app data using its own React Query provider (unused in this example)
    ...
      <MyComponentDataProvider> // <-- Provides component data (like "items") using its own React Query provider
        <MyComponent />
      </MyComponentDataProvider>
    ...
  </AppDataProvider>
  ...
</ContainerDataProvider>

// Example of hooks provided by the "DataProvider" components above:
const MyComponent = () => {
  const user = useUser() // <-- Uses the context specified in ContainerDataProvider.
  const items = useItems() // <-- Uses the context specified in MyComponentDataProvider
  ...
}
```
