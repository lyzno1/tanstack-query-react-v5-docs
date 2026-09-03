---
id: migrating-to-react-query-4
title: 迁移到 React Query 4
---

<!--
translation-source-path: framework/react/guides/migrating-to-react-query-4.md
translation-source-ref: main
translation-source-hash: 38ed6abf06e0e9ef4bb167acd441bef67763bfa59a767bc6d6eb9079d414f247
translation-status: translated
-->


## 重大变化

v4 是一个主要版本，因此需要注意一些重大更改：

### react-query 现在是 @tanstack/react-query

你将需要卸载/安装依赖项并更改导入：

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

你可以使用以下命令之一（或两个）轻松应用它：

如果你想针对 `.js` 或 `.jsx` 文件运行它，请使用以下命令：

```
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js
```

如果你想针对 `.ts` 或 `.tsx` 文件运行它，请使用以下命令：

```
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js
```

请注意，处理 TypeScript 时需要使用 `tsx` 解析器，否则 codemod 无法正确应用！

**注意：** 应用 codemod 可能会破坏你的代码格式，因此请不要忘记在应用 codemod 后运行 `prettier` 和/或 `eslint`！

**注意：** codemod _只会_更改导入，你仍需手动安装独立的 Devtools 包。

### 查询键（和变更键）需要是一个数组

在 v3 中，查询键和变更键可以是字符串，也可以是数组。React Query 内部一直只使用数组形式的键，有时这一细节也会暴露给使用者。例如，`queryFn` 收到的键始终是数组，从而更方便地配合[默认查询函数](./default-query-function.md)使用。

但这个规则并未贯彻到所有 API 中。例如，在[查询过滤器](./filters.md)的 `predicate` 函数中，你拿到的是原始查询键。如果同时使用数组和字符串形式的查询键，这类函数便很难处理。全局回调也有相同问题。

为了统一所有 API，我们决定只允许使用数组形式的键：

```tsx
;-useQuery('todos', fetchTodos) + // [!code --]
  useQuery(['todos'], fetchTodos) // [!code ++]
```

#### Codemod

为了使迁移更容易，我们决定提供一个 codemod。

> codemod 会尽力帮助你迁移这些破坏性变更。请务必仔细检查生成的代码！另外，codemod 无法覆盖某些边界情况，请留意日志输出。

你可以使用以下命令之一（或两个）轻松应用它：

如果你想针对 `.js` 或 `.jsx` 文件运行它，请使用以下命令：

```
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/key-transformation.js
```

如果你想针对 `.ts` 或 `.tsx` 文件运行它，请使用以下命令：

```
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/codemods/v4/key-transformation.js
```

请注意，处理 TypeScript 时需要使用 `tsx` 解析器，否则 codemod 无法正确应用！

**注意：** 应用 codemod 可能会破坏你的代码格式，因此请不要忘记在应用 codemod 后运行 `prettier` 和/或 `eslint`！

### 空闲状态已被移除

为了更好地支持离线场景，我们引入了新的 [`fetchStatus`](./queries.md#fetchstatus)。此后 `idle` 状态就显得多余了，因为 `fetchStatus: 'idle'` 能更准确地表达同一种情况。详情请阅读[为什么有两种不同的状态](./queries.md#why-two-different-states)。

这主要会影响尚无任何 `data` 的禁用查询，因为它们过去处于 `idle` 状态：

```tsx
- status: 'idle' // [!code --]
+ status: 'loading'  // [!code ++]
+ fetchStatus: 'idle' // [!code ++]
```

另请参阅[依赖查询指南](./dependent-queries.md)。

#### 禁用查询

由于这项变更，禁用查询（包括暂时禁用的查询）会从 `loading` 状态开始。为了方便迁移，并准确判断何时显示加载指示器，可以检查 `isInitialLoading`，而不是 `isLoading`：

```tsx
;-isLoading + // [!code --]
  isInitialLoading // [!code ++]
```

另请参阅[禁用查询指南](./disabling-queries.md#isloading-previously-isinitialloading)。

### `useQueries` 的新 API

`useQueries` Hook 现在接收一个带 `queries` 属性的对象。`queries` 的值是查询数组，与 v3 中直接传给 `useQueries` 的数组相同。

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

为了能够通过返回 `undefined` 退出更新，我们必须禁止将 `undefined` 作为成功查询的缓存值。这与 React Query 中的其他设计一致：例如，从 [`initialData` 函数](./initial-query-data.md#initial-data-function)返回 `undefined` 同样_不会_设置数据。

此外，只是在 `queryFn` 中增加日志，就很容易意外产生 `Promise<void>`：

```tsx
useQuery(['key'], () =>
  axios.get(url).then((result) => console.log(result.data)),
)
```

现在类型层面已禁止这种情况；在运行时，`undefined` 会转为一个_失败的 Promise_，查询会进入 `error` 状态，并在开发模式下把错误记录到控制台。

### 默认情况下，查询和变更需要网络连接才能运行

请阅读[新功能公告](#proper-offline-support)中关于在线/离线支持的说明，以及专门的[网络模式](./network-mode.md)页面。

尽管 React Query 是异步状态管理器，可用于任何产生 Promise 的任务，但它最常与数据获取库配合获取数据。因此，默认情况下，没有网络连接时查询和变更会进入 `paused` 状态。如果希望恢复此前的行为，可以为查询和变更全局设置 `networkMode: offlineFirst`：

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

如果你想在任何查询中绕过此设置，以模拟每当查询更改时重新渲染的 v3 默认行为，`notifyOnChangeProps` 现在接受 `"all"` 值以选择退出默认智能跟踪优化。

### `notifyOnChangePropsExclusion` 已被删除

在 v4 中，`notifyOnChangeProps` 默认为 v3 的 `"tracked"` 行为，而不是 `undefined`。现在 `"tracked"` 是 v4 的默认行为，包含此配置选项不再有意义。

### `cancelRefetch` 的一致行为

`cancelRefetch` 选项可以传给所有以命令式方式获取查询的函数，包括：

- `queryClient.refetchQueries`
- `queryClient.invalidateQueries`
- `queryClient.resetQueries`
- `useQuery` 返回的 `refetch`
- `useInfiniteQuery` 返回的 `fetchNextPage` 和 `fetchPreviousPage`

除 `fetchNextPage` 和 `fetchPreviousPage` 外，这个标志过去都默认为 `false`。这种不一致可能带来问题：如果之前已有一个较慢的获取正在进行，那么在变更后调用 `refetchQueries` 或 `invalidateQueries` 时，本次重新获取会被跳过，最终结果可能不是最新的。

我们认为，当代码主动要求重新获取查询时，默认就应该重新启动获取。

因此，上述所有方法现在都将该标志默认设为 _true_。这也意味着，如果不等待第一次调用完成就再次调用 `refetchQueries`，现在会取消第一次获取，并启动新的获取：

```
queryClient.refetchQueries({ queryKey: ['todos'] })
// this will abort the previous refetch and start a new fetch
queryClient.refetchQueries({ queryKey: ['todos'] })
```

可以通过显式传入 `cancelRefetch: false` 禁用此行为：

```
queryClient.refetchQueries({ queryKey: ['todos'] })
// this will not abort the previous refetch - it will just be ignored
queryClient.refetchQueries({ queryKey: ['todos'] }, { cancelRefetch: false })
```

> 注意：自动触发的获取行为没有变化，例如查询挂载或窗口重新获得焦点时发生的重新获取。

### 查询过滤器

[查询过滤器](./filters.md)是一个包含特定条件、用于匹配查询的对象。过去，过滤选项大多由多个布尔标志组合而成。但这些标志组合起来可能产生不可能的状态。具体如下：

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

过滤器默认为 `all`，你也可以选择只匹配 `active` 或 `inactive` 查询。

#### 重新获取活动/重新获取非活动

[`queryClient.invalidateQueries`](../../../reference/QueryClient.md#queryclientinvalidatequeries) 还有两个额外且相似的标志：

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

该标志默认为 `active`，因为 `refetchActive` 过去默认为 `true`。我们还需要一种方式告诉 `invalidateQueries` 完全不要重新获取，因此这里也允许第四个选项 `none`。

### `onSuccess` 不再从 `setQueryData` 调用

这让许多人感到困惑，并且如果从 `onSuccess` 内部调用 `setQueryData`，也会产生无限循环。当与 `staleTime` 结合使用时，它也是一个常见的错误源，因为如果仅从缓存中读取数据，`onSuccess` 不会被调用。

与 `onError` 和 `onSettled` 类似，`onSuccess` 回调现在只与实际发出的请求绑定：没有请求，就没有回调。

如果你想监听 `data` 字段的变化，最好使用 `useEffect`，并把 `data` 放入依赖数组。React Query 会通过结构共享保持数据引用稳定，因此 Effect 不会在每次后台重新获取时都执行，而只会在数据内容实际发生变化时执行：

```
const { data } = useQuery({ queryKey, queryFn })
React.useEffect(() => mySideEffectHere(data), [data])
```

### `persistQueryClient` 和相应的持久化插件不再是实验性的，并且已被重命名

插件 `createWebStoragePersistor` 和 `createAsyncStoragePersistor` 已分别更名为 [`createSyncStoragePersister`](../plugins/createSyncStoragePersister.md) 和 [`createAsyncStoragePersister`](../plugins/createAsyncStoragePersister.md)。`persistQueryClient` 中的 `Persistor` 接口也更名为了 `Persister`。更名原因可参阅这个 [Stack Exchange 问题](https://english.stackexchange.com/questions/206893/persister-or-persistor)。

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

旧的 `cancel` 方法允许你在 Promise 上定义 `cancel` 函数，库再通过它支持取消查询。该方法现已删除。我们建议使用 v3.30.0 引入的[新 API](./query-cancellation.md) 来取消查询。它在内部使用 [`AbortController` API](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)，并向查询函数提供 [`AbortSignal` 实例](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。

### TypeScript

类型现在需要使用 TypeScript v4.1 或更高版本

### 支持的浏览器

从 v4 开始，React Query 针对现代浏览器进行了优化。我们更新了 browserslist，以生成更现代、性能更好且体积更小的构建产物。你可以在[这里](../installation#requirements)查看具体要求。

### `setLogger` 已删除

可以通过调用 `setLogger` 来全局更改记录器。在 v4 中，创建 `QueryClient` 时该函数被替换为可选字段。

```tsx
- import { QueryClient, setLogger } from 'react-query'; // [!code --]
+ import { QueryClient } from '@tanstack/react-query'; // [!code ++]

- setLogger(customLogger) // [!code --]
- const queryClient = new QueryClient(); // [!code --]
+ const queryClient = new QueryClient({ logger: customLogger }) // [!code ++]
```

### 服务端默认_不再_手动进行垃圾回收

在 v3 中，React Query 将默认缓存查询结果 5 分钟，然后手动垃圾回收该数据。此默认值也适用于服务器端 React Query。

这会导致较高的内存占用，并让进程一直等待手动垃圾回收完成。在 v4 中，服务端 `cacheTime` 默认改为 `Infinity`，实际上禁用了手动垃圾回收（请求完成后，Node.js 进程会自行清除所有内容）。

此更改仅影响服务器端 React Query 的用户，例如 Next.js。如果你手动设置 `cacheTime`，这不会影响你（不过你可能希望保持行为一致）。

### 生产环境中的日志记录

从 v4 开始，react-query 将不再在生产模式下将错误（例如失败的获取）记录到控制台，因为这让许多人感到困惑。
在开发模式下错误仍然会出现。

### ESM 支持

React Query 现在支持 [package.json `"exports"`](https://nodejs.org/api/packages.html#exports)，并完全兼容 Node 对 CommonJS 和 ESM 的原生解析。我们预计这不会给大多数用户带来破坏性影响，但此后项目只能从官方支持的入口点导入文件。

### 简化的通知事件

手动订阅 `QueryCache` 始终会为你提供 `QueryCacheNotifyEvent`，但 `MutationCache` 则不然。我们简化了行为并相应地调整了事件名称。

#### QueryCacheNotifyEvent

```tsx
- type: 'queryAdded' // [!code --]
+ type: 'added' // [!code ++]
- type: 'queryRemoved' // [!code --]
+ type: 'removed' // [!code ++]
- type: 'queryUpdated' // [!code --]
+ type: 'updated' // [!code ++]
```

#### MutationCacheNotifyEvent

`MutationCacheNotifyEvent` 使用与 `QueryCacheNotifyEvent` 相同的类型。

> 注意：仅当你通过 `queryCache.subscribe` 或 `mutationCache.subscribe` 手动订阅缓存时，这才相关

### 单独的水合导出已被删除

从 [3.22.0](https://github.com/TanStack/query/releases/tag/v3.22.0) 开始，水合工具已迁移到 React Query 核心包。在 v3 中，你仍可以从 `react-query/hydration` 使用旧导出，但 v4 已将这些导出删除。

```tsx
- import { dehydrate, hydrate, useHydrate, Hydrate } from 'react-query/hydration' // [!code --]
+ import { dehydrate, hydrate, useHydrate, Hydrate } from '@tanstack/react-query' // [!code ++]
```

### 从 `queryClient`、`query` 和 `mutation` 中删除了未记录的方法

`QueryClient` 上的 `cancelMutations` 和 `executeMutation` 既没有文档，内部也未使用，因此现已删除。`executeMutation` 只是对 `mutationCache` 上可用方法的一层封装，所以你仍可以直接通过 `mutationCache` 实现相同功能。

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

此外，`query.setDefaultOptions` 也因未被使用而删除。`mutation.cancel` 同样已被删除，因为它实际上并不会取消已发出的请求。

### `src/react` 目录已重命名为 `src/reactjs`

过去，React Query 有一个名为 `react` 的目录，同时还会从 `react` 模块导入内容。这可能与某些 Jest 配置冲突，运行测试时会出现如下错误：

```
TypeError: Cannot read property 'createContext' of undefined
```

重命名目录后，这不再是问题。

如果你直接在项目中从 `'react-query/react'` 导入任何内容（而不是仅 `'react-query'`），那么你需要更新导入：

```tsx
- import { QueryClientProvider } from 'react-query/react'; // [!code --]
+ import { QueryClientProvider } from '@tanstack/react-query/reactjs'; // [!code ++]
```

## 新功能 🚀

v4 附带了一组很棒的新功能：

### 支持 React 18

React 18 于当年早些时候发布，v4 现在已对它及其带来的新并发特性提供完整支持。

### 完善的离线支持

在 v3 中，React Query 始终会触发查询和变更，但随后假设如果你想重试，则需要连接到互联网。这导致了几种令人困惑的情况：

- 你处于离线状态并挂载查询 - 它会进入加载状态，请求失败，并且它会保持加载状态，直到你再次上线，即使它并没有真正获取。
- 同样，如果你处于离线状态并且关闭了重试，你的查询将触发并失败，并且查询将进入错误状态。
- 你处于离线状态，想要启动一个不一定需要网络连接的查询（因为你_可以_使用 React Query 进行数据获取以外的其他操作），但由于某些其他原因而失败。该查询现在将暂停，直到你再次上线。
- 如果你处于离线状态，窗口焦点重新获取根本不会执行任何操作。

在 v4 中，React Query 引入了新的 `networkMode` 来解决这些问题。详情请阅读专门的[网络模式](./network-mode)页面。

### 默认跟踪查询

React Query 默认会“跟踪”查询属性，这能显著优化渲染。该功能自 [v3.6.0](https://github.com/TanStack/query/releases/tag/v3.6.0) 起就已存在，现在成为了 v4 的默认行为。

### 使用 setQueryData 避免更新

使用 [`setQueryData` 的函数式 updater](../../../reference/QueryClient.md#queryclientsetquerydata) 时，现在可以通过返回 `undefined` 退出更新。当你收到的 `previousValue` 是 `undefined` 时，这会很有用：它表示当前没有缓存条目，而你不想或无法创建条目。例如以下切换 todo 状态的示例：

```tsx
queryClient.setQueryData(['todo', id], (previousTodo) =>
  previousTodo ? { ...previousTodo, done: true } : undefined,
)
```

### 变更缓存垃圾回收

就像查询一样，现在也可以自动对变更进行垃圾回收。变更的默认 `cacheTime` 也设置为 5 分钟。

### 为多个 Provider 自定义上下文

现在可以指定自定义上下文，将 Hook 与对应的 `Provider` 匹配起来。当组件树中存在多个 React Query `Provider` 实例时，这一点尤其重要：你需要确保 Hook 使用正确的 `Provider` 实例。

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

3. 在你的应用程序中使用这两个数据包。

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
