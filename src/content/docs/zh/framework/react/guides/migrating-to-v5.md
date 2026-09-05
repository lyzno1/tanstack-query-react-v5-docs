---
id: migrating-to-tanstack-query-5
title: 迁移到 TanStack Query v5
---

## 重大变化

v5 是一个主要版本，因此需要注意一些重大更改：

### 支持单一签名、单一对象

useQuery 等 API 过去在 TypeScript 中有许多重载：调用函数的不同方式。这不仅在类型方面难以维护，而且还需要运行时检查来查看第一个和第二个参数的类型，以正确创建选项。

现在我们只支持对象格式。

```tsx
useQuery(key, fn, options) // [!code --]
useQuery({ queryKey, queryFn, ...options }) // [!code ++]
useInfiniteQuery(key, fn, options) // [!code --]
useInfiniteQuery({ queryKey, queryFn, ...options }) // [!code ++]
useMutation(fn, options) // [!code --]
useMutation({ mutationFn, ...options }) // [!code ++]
useIsFetching(key, filters) // [!code --]
useIsFetching({ queryKey, ...filters }) // [!code ++]
useIsMutating(key, filters) // [!code --]
useIsMutating({ mutationKey, ...filters }) // [!code ++]
```

```tsx
queryClient.isFetching(key, filters) // [!code --]
queryClient.isFetching({ queryKey, ...filters }) // [!code ++]
queryClient.getQueriesData(key, filters) // [!code --]
queryClient.getQueriesData({ queryKey, ...filters }) // [!code ++]
queryClient.setQueriesData(key, updater, filters, options) // [!code --]
queryClient.setQueriesData({ queryKey, ...filters }, updater, options) // [!code ++]
queryClient.removeQueries(key, filters) // [!code --]
queryClient.removeQueries({ queryKey, ...filters }) // [!code ++]
queryClient.resetQueries(key, filters, options) // [!code --]
queryClient.resetQueries({ queryKey, ...filters }, options) // [!code ++]
queryClient.cancelQueries(key, filters, options) // [!code --]
queryClient.cancelQueries({ queryKey, ...filters }, options) // [!code ++]
queryClient.invalidateQueries(key, filters, options) // [!code --]
queryClient.invalidateQueries({ queryKey, ...filters }, options) // [!code ++]
queryClient.refetchQueries(key, filters, options) // [!code --]
queryClient.refetchQueries({ queryKey, ...filters }, options) // [!code ++]
```

```tsx
queryCache.find(key, filters) // [!code --]
queryCache.find({ queryKey, ...filters }) // [!code ++]
queryCache.findAll(key, filters) // [!code --]
queryCache.findAll({ queryKey, ...filters }) // [!code ++]
```

### QueryClient 的命令式方法

随着 `queryClient.query` 和 `queryClient.infiniteQuery` 的引入，以下方法已被弃用，并将在 v6 中删除。

如果你从 v4 或更早版本迁移：

```tsx
queryClient.fetchQuery(key, fn, options) // [!code --]
queryClient.query({ queryKey: key, queryFn: fn, ...options }) // [!code ++]
queryClient.fetchInfiniteQuery(key, fn, options) // [!code --]
queryClient.infiniteQuery({
  queryKey: key,
  queryFn: fn,
  ...options,
}) // [!code ++]

queryClient.prefetchQuery(key, fn, options) // [!code --]
queryClient.query({ queryKey: key, queryFn: fn, ...options }).catch(noop) // [!code ++]

queryClient.prefetchInfiniteQuery(key, fn, options) // [!code --]
queryClient
  .infiniteQuery({ queryKey: key, queryFn: fn, ...options })
  .catch(noop) // [!code ++]

queryClient.ensureQueryData(key, options) // [!code --]
queryClient.query({ queryKey: key, ...options, staleTime: 'static' }) // [!code ++]

queryClient.ensureInfiniteQueryData(key, options) // [!code --]
queryClient.infiniteQuery({ queryKey: key, ...options, staleTime: 'static' }) // [!code ++]
```

如果你要更新较早的 v5 代码，迁移方式与上面相同，只需继续使用单个 options 对象。

### `queryClient.getQueryData` 现在仅接受 queryKey 作为参数

`queryClient.getQueryData` 参数更改为仅接受 `queryKey`

```tsx
queryClient.getQueryData(queryKey, filters) // [!code --]
queryClient.getQueryData(queryKey) // [!code ++]
```

### `queryClient.getQueryState` 现在仅接受 queryKey 作为参数

`queryClient.getQueryState` 参数更改为仅接受 `queryKey`

```tsx
queryClient.getQueryState(queryKey, filters) // [!code --]
queryClient.getQueryState(queryKey) // [!code ++]
```

#### Codemod

为了使删除重载迁移更容易，v5 附带了一个 codemod。

> codemod 会尽力帮助你迁移这些破坏性变更。请务必仔细检查生成的代码！另外，codemod 无法覆盖某些边界情况，请留意日志输出。

如果你想针对 `.js` 或 `.jsx` 文件运行它，请使用以下命令：

```
npx jscodeshift@latest ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/src/v5/remove-overloads/remove-overloads.cjs
```

如果你想针对 `.ts` 或 `.tsx` 文件运行它，请使用以下命令：

```
npx jscodeshift@latest ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/src/v5/remove-overloads/remove-overloads.cjs
```

请注意，处理 TypeScript 时需要使用 `tsx` 解析器，否则 codemod 无法正确执行。

**注意：** 应用 codemod 可能会破坏你的代码格式，因此请不要忘记在应用 codemod 后运行 `prettier` 和/或 `eslint`！

关于 codemod 工作原理的一些注意事项：

- 最理想的情况是，第一个参数已是包含 `queryKey` 或 `mutationKey` 的对象表达式（具体取决于正在转换的 Hook 或方法）。这表示代码已符合新签名，codemod 不会改动它。🎉
- 如果不满足上述条件，则 codemod 将检查第一个参数是否是数组表达式或引用数组表达式的标识符。如果是这种情况，codemod 会将其放入对象表达式中，然后它将成为第一个参数。
- 如果可以推断出对象参数，codemod 会尝试把已有属性复制到新创建的对象表达式中。
- 如果 codemod 无法推断用法，则会在控制台上留下一条消息。该消息包含文件名和使用的行号。在这种情况下，你需要手动进行迁移。
- 如果转换导致错误，你还会在控制台上看到一条消息。此消息将通知你发生了意外情况，请手动进行迁移。

### useQuery（和 QueryObserver）上的回调已被删除

查询中的 `onSuccess`、`onError` 和 `onSettled` 已被删除，变更中的同名回调不受影响。关于此更改的原因及迁移方式，请参阅[这份 RFC](https://github.com/TanStack/query/discussions/5279)。

### `refetchInterval` 回调现在只接收 `query`

这统一了回调的调用方式（`refetchOnWindowFocus`、`refetchOnMount` 和 `refetchOnReconnect` 回调也只接收查询），同时解决了回调接收经 `select` 转换的数据时的一些类型问题。

```tsx
- refetchInterval: number | false | ((data: TData | undefined, query: Query) => number | false | undefined) // [!code --]
+ refetchInterval: number | false | ((query: Query) => number | false | undefined) // [!code ++]
```

你仍可以通过 `query.state.data` 访问数据，但该数据尚未经过 `select` 转换。如果需要转换后的数据，可以对 `query.state.data` 再次执行相同的转换。

### `remove` 方法已从 useQuery 中删除

过去，`remove` 用于在不通知观察者的情况下从 `queryCache` 删除查询。它通常用于以命令式方式移除不再需要的数据，例如用户退出登录时。

但是，在查询仍处于活动状态时执行此操作没有多大意义，因为它只会在下一次重新渲染时触发无缓存数据时的初始加载状态。

如果仍需删除查询，可以使用 `queryClient.removeQueries({ queryKey: key })`。

```tsx
const queryClient = useQueryClient()
const query = useQuery({ queryKey, queryFn })

query.remove() // [!code --]
queryClient.removeQueries({ queryKey }) // [!code ++]
```

### 现在所需的最低 TypeScript 版本是 4.7

主要原因是 TypeScript 4.7 包含一项重要的类型推断修复。更多信息请参阅这个 [TypeScript issue](https://github.com/microsoft/TypeScript/issues/43371)。

### `isDataEqual` 选项已从 useQuery 中删除

以前，此函数用于决定将旧 `data`（`true`）还是新数据（`false`）作为查询的最终数据。

你可以通过将函数传递给 `structuralSharing` 来实现相同的功能：

```tsx
import { replaceEqualDeep } from '@tanstack/react-query'

- isDataEqual: (oldData, newData) => customCheck(oldData, newData) // [!code --]
+ structuralSharing: (oldData, newData) => customCheck(oldData, newData) ? oldData : replaceEqualDeep(oldData, newData) // [!code ++]
```

### 已弃用的自定义 logger 已被删除

自定义 logger 已在 v4 中弃用，并在此版本中删除。日志只会在开发模式下输出，而在开发模式中没有必要传入自定义 logger。

### 支持的浏览器

我们更新了 browserslist，以生成更现代、性能更好且体积更小的构建产物。你可以在[这里](../installation#requirements)查看具体要求。

### 私有类字段和方法

TanStack Query 的类一直包含私有字段和方法，但它们过去并非真正私有，只是在 TypeScript 类型层面标记为私有。现在我们改用 [ECMAScript 私有类特性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)，因此这些字段在运行时也真正不可从外部访问。

### 将 `cacheTime` 重命名为 `gcTime`

几乎所有人都会误解 `cacheTime`。它听起来像“数据会被缓存多久”，但实际并非如此。

只要查询仍在使用，`cacheTime` 就不起作用；只有查询不再被使用时才开始计时。计时结束后，数据会被“垃圾回收”，以避免缓存无限增长。

`gc` 指“垃圾回收（garbage collection）”时间。这个名称更偏技术，但 `GC` 也是计算机科学中[广为人知的缩写](<https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)>)。

```tsx
const MINUTE = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
-      cacheTime: 10 * MINUTE, // [!code --]
+      gcTime: 10 * MINUTE, // [!code ++]
    },
  },
})
```

### `useErrorBoundary` 选项已重命名为 `throwOnError`

为了让 `useErrorBoundary` 选项不再绑定特定框架，并避免与 React Hook 惯用的 `use` 函数前缀及 `ErrorBoundary` 组件名称混淆，该选项已重命名为 `throwOnError`，以更准确地表达其功能。

### TypeScript：`Error` 现在是错误的默认类型，而不是 `unknown`

尽管 JavaScript 允许 `throw` 任意值（因此 `unknown` 在理论上最准确），但实际抛出的几乎总是 `Error` 或其子类。对大多数场景而言，这项改动会让 TypeScript 中的 `error` 字段更易使用。

如果你确实要抛出非 `Error` 值，现在需要自行显式指定泛型：

```ts
useQuery<number, string>({
  queryKey: ['some-query'],
  queryFn: async () => {
    if (Math.random() > 0.5) {
      throw 'some error'
    }
    return 42
  },
})
```

如需全局设置不同的 Error 类型，请参阅 [TypeScript 指南](../typescript.md#registering-a-global-error)。

### eslint `prefer-query-object-syntax` 规则已删除

由于现在唯一支持的语法是对象语法，因此不再需要此规则

### 移除 `keepPreviousData`，改用 `placeholderData` 恒等函数

我们删除了 `keepPreviousData` 选项和 `isPreviousData` 标志，因为它们的作用与 `placeholderData` 和 `isPlaceholderData` 基本相同。

为了实现与 `keepPreviousData` 相同的功能，我们把上一次查询的 `data` 作为参数传给 `placeholderData`，使其可以接受恒等函数。因此，你只需向 `placeholderData` 提供一个恒等函数，或使用 TanStack Query 内置的 `keepPreviousData` 函数。

> 需要注意的是，`useQueries` 的 `placeholderData` 函数不会接收到 `previousData` 参数。由于数组中查询的数量和类型是动态的，占位数据与 `queryFn` 结果的数据结构可能并不相同。

```tsx
import {
   useQuery,
+  keepPreviousData // [!code ++]
} from "@tanstack/react-query";

const {
   data,
-  isPreviousData, // [!code --]
+  isPlaceholderData, // [!code ++]
} = useQuery({
  queryKey,
  queryFn,
- keepPreviousData: true, // [!code --]
+ placeholderData: keepPreviousData // [!code ++]
});
```

在 TanStack Query 中，恒等函数是指始终原样返回传入参数（即数据）的函数。

```ts
useQuery({
  queryKey,
  queryFn,
  placeholderData: (previousData, previousQuery) => previousData, // identity function with the same behaviour as `keepPreviousData`
})
```

不过，这项变更有几点需要注意：

- `placeholderData` 会始终让查询处于 `success` 状态，而 `keepPreviousData` 会保留上一个查询的状态。如果首次获取成功，但后台重新获取失败，上一个查询可能处于 `error` 状态。然而，错误本身并不会随之传递，因此我们选择保留 `placeholderData` 原有的行为。
- `keepPreviousData` 会提供上一份数据的 `dataUpdatedAt` 时间戳，而使用 `placeholderData` 时，`dataUpdatedAt` 会保持为 `0`。如果需要在界面上连续显示该时间戳，这可能不太方便。你可以用 `useEffect` 保留上一个有效值。

  ```ts
  const [updatedAt, setUpdatedAt] = useState(0)

  const { data, dataUpdatedAt } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => fetchProjects(page),
  })

  useEffect(() => {
    if (dataUpdatedAt > updatedAt) {
      setUpdatedAt(dataUpdatedAt)
    }
  }, [dataUpdatedAt])
  ```

### 窗口焦点重新获取不再监听 `focus` 事件

现在只监听 `visibilitychange` 事件。由于目前支持的浏览器都具备该事件，因此可以这样调整，并由此修复了[这里列出的许多问题](https://github.com/TanStack/query/pull/4805)。

### 网络状态不再依赖 `navigator.onLine` 属性

`navigator.onLine` 在 Chromium 系浏览器中表现不佳，存在[大量假阴性问题](https://bugs.chromium.org/p/chromium/issues/list?q=navigator.online)，会导致查询被错误标记为 `offline`。

为了避免这个问题，我们现在总是从 `online: true` 开始，并且只监听 `online` 和 `offline` 事件来更新状态。

这样可以降低假阴性的概率，但也可能把通过 Service Worker 加载、即使没有互联网连接仍能工作的离线应用误判为在线。

### 删除了自定义 `context` 属性，转而使用自定义 `queryClient` 实例

在 v4 中，我们允许向所有 React Query Hook 传入自定义 `context`，以便在微前端场景中正确隔离各个实例。

然而，`context` 是 React 特有的能力，它在这里所做的只是让我们可以访问 `queryClient`。直接允许传入自定义 `queryClient`，同样可以实现这种隔离。
这样一来，其他框架也能以不绑定特定框架的方式获得同样的能力。

```tsx
import { queryClient } from './my-client'

const { data } = useQuery(
  {
    queryKey: ['users', id],
    queryFn: () => fetch(...),
-   context: customContext // [!code --]
  },
+  queryClient, // [!code ++]
)
```

### 删除了 `refetchPage`，改用 `maxPages`

在 v4 中，我们引入了 `refetchPage` 函数，用于指定无限查询要重新获取哪些页面。

但是，重新获取所有页面可能导致 UI 不一致。此外，该选项虽然可传给 `queryClient.refetchQueries` 等 API，却只对无限查询生效，对普通查询没有作用。

v5 为无限查询新增了 `maxPages` 选项，用于限制查询数据中保存及后续重新获取的页面数量。它覆盖了最初为 `refetchPage` 设想的用例，同时避免了相关问题。

### 新的 `dehydrate` API

可传给 `dehydrate` 的选项已经简化。查询和变更现在始终会按默认函数的规则进行脱水。如需改变此行为，请实现对应的 `shouldDehydrateQuery` 或 `shouldDehydrateMutation` 函数，而不再使用已删除的 `dehydrateMutations` 和 `dehydrateQueries` 布尔选项。如果要恢复“完全不脱水查询或变更”的旧行为，可传入 `() => false`。

```tsx
- dehydrateMutations?: boolean // [!code --]
- dehydrateQueries?: boolean // [!code --]
```

### 无限查询现在需要 `initialPageParam`

以前，我们会把 `undefined` 作为 `pageParam` 传给 `queryFn`，你则可以在 `queryFn` 的函数签名中为 `pageParam` 设置默认值。这种方式的缺点是，它会把无法序列化的 `undefined` 存入 `queryCache`。

现在，你必须在无限查询选项中显式传入 `initialPageParam`，它将作为第一页的 `pageParam`：

```tsx
useInfiniteQuery({
   queryKey,
-  queryFn: ({ pageParam = 0 }) => fetchSomething(pageParam), // [!code --]
+  queryFn: ({ pageParam }) => fetchSomething(pageParam), // [!code ++]
+  initialPageParam: 0, // [!code ++]
   getNextPageParam: (lastPage) => lastPage.next,
})
```

### 无限查询的手动模式已被删除

过去，可以把 `pageParam` 直接传给 `fetchNextPage` 或 `fetchPreviousPage`，以覆盖 `getNextPageParam` 或 `getPreviousPageParam` 返回的页面参数。但此功能完全不适用于重新获取，也很少有人了解或使用。因此，无限查询现在必须提供 `getNextPageParam`。

### `getNextPageParam` 或 `getPreviousPageParam` 返回 `null` 现在也表示没有更多页面

在 v4 中，你需要显式返回 `undefined` 来表示没有更多页面。现在，这项判定也会接受 `null`。

### 服务端不再重试

在服务端，`retry` 现在默认为 `0` 而不是 `3`。预取一直默认不重试；但从 React 18 开始，启用了 `suspense` 的查询也能直接在服务端执行，因此必须确保服务端完全不进行重试。

### `status: loading` 改为 `status: pending`，`isLoading` 改为 `isPending`，`isInitialLoading` 则重命名为 `isLoading`

`loading` 状态已重命名为 `pending`，类似地，派生的 `isLoading` 标志已重命名为 `isPending`。

对于变更，`status` 也从 `loading` 改为 `pending`，`isLoading` 标志则改为 `isPending`。

最后，查询新增了派生标志 `isLoading`，其计算方式为 `isPending && isFetching`。它与 `isInitialLoading` 含义相同，但 `isInitialLoading` 现已弃用，并将在下一个主要版本中删除。

要了解此更改背后的原因，请查看[v5 roadmap discussion](https://github.com/TanStack/query/discussions/4252)。

### `hashQueryKey` 已重命名为 `hashKey`

因为它也能对变更键进行哈希，并可用于 `useIsMutating` 和 `useMutationState` 的 `predicate` 函数；这些函数会接收变更对象。

[//]: # 'FrameworkSpecificBreakingChanges'

### 现在所需的最低 React 版本是 18.0

React Query v5 需要 React 18.0 或更高版本。这是因为我们使用了新的 `useSyncExternalStore` Hook，该 Hook 仅在 React 18.0 及更高版本中可用。此前我们一直使用 React 提供的 shim。

### `contextSharing` 属性已从 QueryClientProvider 中删除

过去可以使用 `contextSharing` 属性，让整个窗口共享最先创建的 Query Client 上下文实例。这样，即使 TanStack Query 来自不同的 bundle 或微前端，它们也会使用同一个上下文实例，而不受模块作用域影响。

v5 已删除自定义 `context` 属性，请参阅[移除自定义 context 属性，改用自定义 queryClient 实例](#removed-custom-context-prop-in-favor-of-custom-queryclient-instance)一节。如果希望在应用的多个包之间共享同一个 Query Client，可以直接传入共享的自定义 `queryClient` 实例。

### 不再使用 `unstable_batchedUpdates` 作为 React 和 React Native 中的批处理函数

由于 `unstable_batchedUpdates` 在 React 18 中已是空操作，`react-query` 不再自动将其设为批处理函数。

如果你的框架提供自定义批处理函数，可以通过 `notifyManager.setBatchNotifyFunction` 将它告知 TanStack Query。

例如，`solid-query` 中的批处理函数可以这样设置：

```ts
import { notifyManager } from '@tanstack/query-core'
import { batch } from 'solid-js'

notifyManager.setBatchNotifyFunction(batch)
```

### 水合 API 更改

为了更好地支持并发特性和过渡，我们调整了水合 API。`Hydrate` 组件已更名为 `HydrationBoundary`，`useHydrate` Hook 已被删除。

`HydrationBoundary` 现在只水合查询，不再水合变更。如需水合变更，请使用底层 `hydrate` API 或 `persistQueryClient` 插件。

还有一项技术细节：查询的水合时机略有变化。新查询仍在渲染阶段水合，以保证 SSR 正常工作；对于缓存中已存在的查询，只要传入的数据比缓存数据更新，现在就会在 Effect 中水合。如果你只在应用启动时水合一次，这项变化不会产生影响。但如果你使用 Server Components，并在页面导航时传入新数据进行水合，则可能会短暂看到旧数据，随后页面立即以新数据重新渲染。

这在技术上属于破坏性变更，目的是避免在页面过渡完全提交前，过早更新_当前_页面的内容。你无需采取任何操作。

```tsx
- import { Hydrate } from '@tanstack/react-query' // [!code --]
+ import { HydrationBoundary } from '@tanstack/react-query' // [!code ++]


- <Hydrate state={dehydratedState}> // [!code --]
+ <HydrationBoundary state={dehydratedState}> // [!code ++]
  <App />
- </Hydrate> // [!code --]
+ </HydrationBoundary> // [!code ++]
```

### 查询默认值更改

`queryClient.getQueryDefaults` 现在会将所有匹配的注册合并在一起，而不是仅返回第一个匹配的注册。

因此，对 `queryClient.setQueryDefaults` 的调用现在应按_具体程度递增_的顺序排列。
也就是说，应按照从**最通用的查询键**到**最具体的查询键**的顺序注册。

例如：

```ts
+ queryClient.setQueryDefaults(['todo'], {   // [!code ++]
+   retry: false,  // [!code ++]
+   staleTime: 60_000,  // [!code ++]
+ })  // [!code ++]
queryClient.setQueryDefaults(['todo', 'detail'], {
+   retry: true,  // [!code --]
  retryDelay: 1_000,
  staleTime: 10_000,
})
- queryClient.setQueryDefaults(['todo'], { // [!code --]
-   retry: false, // [!code --]
-   staleTime: 60_000, // [!code --]
- }) // [!code --]
```

请注意，在这个示例中，需要为 `['todo', 'detail']` 的注册添加 `retry: true`，以抵消它现在从更通用注册中继承的 `retry: false`。要维持原有行为，具体需要怎样调整取决于你的默认配置。

[//]: # 'FrameworkSpecificBreakingChanges'

## 新功能 🚀

v5 还带来了以下新功能：

### 简化的乐观更新

现在可以利用 `useMutation` 返回的 `variables`，以一种更简单的方式执行乐观更新：

```tsx
const queryInfo = useTodos()
const addTodoMutation = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})

if (queryInfo.data) {
  return (
    <ul>
      {queryInfo.data.items.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
      {addTodoMutation.isPending && (
        <li key={String(addTodoMutation.submittedAt)} style={{ opacity: 0.5 }}>
          {addTodoMutation.variables}
        </li>
      )}
    </ul>
  )
}
```

在这里，我们只是在变更运行期间改变 UI 的显示，而没有直接把数据写入缓存。如果只有一个位置需要展示乐观更新，这种方式最为合适。详情请参阅[乐观更新文档](./optimistic-updates.md)。

### 使用新的 `maxPages` 选项限制无限查询的页数

当需要无限滚动或分页时，无限查询非常有用。
但是，获取的页面越多，消耗的内存就越多，并且这也会减慢查询重新获取过程，因为所有页面都是按顺序重新获取的。

v5 为无限查询新增了 `maxPages` 选项，允许开发者限制查询数据中保存及后续重新获取的页面数量。
你可以根据你想要提供的用户体验和重新获取性能来调整 `maxPages` 值。

请注意，无限列表必须是双向的，这需要同时定义 `getNextPageParam` 和 `getPreviousPageParam`。

### 无限查询可以预取多个页面

无限查询可以像普通查询一样进行预取。默认只会预取查询的第一页，并将其存储在给定的查询键下。如果希望预取多页，可以使用 `pages` 选项。详情请阅读[预取指南](./prefetching.md)。

### `useQueries` 的新 `combine` 选项

详情请参阅 [`useQueries` 文档](../reference/functions/useQueries.md#combine)。

### 实验性 `fine grained storage persister`

详情请参阅 [`experimental_createPersister` 文档](../plugins/createPersister.md)。

[//]: # 'FrameworkSpecificNewFeatures'

### 创建查询选项的类型安全方法

详情请参阅 [TypeScript 文档](../typescript.md#typing-query-options)。

### 新的 Suspense Hook

到了 v5，用于数据获取的 Suspense 终于变得“稳定”。我们新增了专用的 `useSuspenseQuery`、`useSuspenseInfiniteQuery` 和 `useSuspenseQueries` Hook。使用这些 Hook 时，`data` 在类型层面不再可能是 `undefined`：

```js
const { data: post } = useSuspenseQuery({
  // ^? const post: Post
  queryKey: ['post', postId],
  queryFn: () => fetchPost(postId),
})
```

查询 Hook 上实验性的 `suspense: boolean` 标志已被删除。

你可以在 [Suspense 文档](./suspense.md)中了解更多信息。

[//]: # 'FrameworkSpecificNewFeatures'
