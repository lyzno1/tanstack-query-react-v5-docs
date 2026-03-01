---
id: migrating-to-tanstack-query-5
title: 迁移到 TanStack Query v5
---

<!--
translation-source-path: framework/react/guides/migrating-to-v5.md
translation-source-ref: v5.90.3
translation-source-hash: ad69ae96a8c5e7ab2c6cdbb11a9b6646250f921afce8ca4d8dbfb0e322556ffd
translation-status: translated
-->


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
queryClient.ensureQueryData(key, filters) // [!code --]
queryClient.ensureQueryData({ queryKey, ...filters }) // [!code ++]
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
queryClient.fetchQuery(key, fn, options) // [!code --]
queryClient.fetchQuery({ queryKey, queryFn, ...options }) // [!code ++]
queryClient.prefetchQuery(key, fn, options) // [!code --]
queryClient.prefetchQuery({ queryKey, queryFn, ...options }) // [!code ++]
queryClient.fetchInfiniteQuery(key, fn, options) // [!code --]
queryClient.fetchInfiniteQuery({ queryKey, queryFn, ...options }) // [!code ++]
queryClient.prefetchInfiniteQuery(key, fn, options) // [!code --]
queryClient.prefetchInfiniteQuery({ queryKey, queryFn, ...options }) // [!code ++]
```

```tsx
queryCache.find(key, filters) // [!code --]
queryCache.find({ queryKey, ...filters }) // [!code ++]
queryCache.findAll(key, filters) // [!code --]
queryCache.findAll({ queryKey, ...filters }) // [!code ++]
```

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

如果您想针对 `.js` 或 `.jsx` 文件运行它，请使用以下命令：

```
npx jscodeshift@latest ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/src/v5/remove-overloads/remove-overloads.cjs
```

如果您想针对 `.ts` 或 `.tsx` 文件运行它，请使用以下命令：

```
npx jscodeshift@latest ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/src/v5/remove-overloads/remove-overloads.cjs
```

请注意，在 `TypeScript` 的情况下，您需要使用 `tsx` 作为解析器；否则，codemod将无法正确应用！

**注意：** 应用 codemod 可能会破坏您的代码格式，因此请不要忘记在应用 codemod 后运行 `prettier` 和/或 `eslint`！

关于 codemod 工作原理的一些注意事项：

- 一般来说，我们正在寻找幸运的情况，即第一个参数是对象表达式并包含“queryKey”或“mutationKey”属性（取决于正在转换的Hook/方法调用）。如果是这种情况，则您的代码已经与新签名匹配，因此 codemod 不会触及它。 🎉
- 如果不满足上述条件，则 codemod 将检查第一个参数是否是数组表达式或引用数组表达式的标识符。如果是这种情况，codemod 会将其放入对象表达式中，然后它将成为第一个参数。
- 如果可以推断对象参数，codemod 将尝试将现有属性复制到新创建的属性。
- 如果 codemod 无法推断用法，则会在控制台上留下一条消息。该消息包含文件名和使用的行号。在这种情况下，您需要手动进行迁移。
- 如果转换导致错误，您还会在控制台上看到一条消息。此消息将通知您发生了意外情况，请手动进行迁移。

### useQuery（和 QueryObserver）上的回调已被删除

`onSuccess`、`onError` 和 `onSettled` 已从查询中删除。他们没有受到变更的影响。请参阅[this RFC](https://github.com/TanStack/query/discussions/5279) 了解此更改背后的动机以及该怎么做。

### `refetchInterval`回调函数仅获取`query`传递

这简化了回调的调用方式（`refetchOnWindowFocus`、`refetchOnMount` 和 `refetchOnReconnect` 回调也都只传递查询），并且修复了当回调获取 `select` 转换的数据时的一些打字问题。

```tsx
- refetchInterval: number | false | ((data: TData | undefined, query: Query) => number | false | undefined) // [!code --]
+ refetchInterval: number | false | ((query: Query) => number | false | undefined) // [!code ++]
```

您仍然可以使用`query.state.data`访问数据，但是，它不会是经过`select`转换的数据。如果您需要访问转换后的数据，可以在`query.state.data`上再次调用转换。

### `remove` 方法已从 useQuery 中删除

以前，remove 方法用于从 queryCache 中删除查询，而不通知观察者。它最好用于强制删除不再需要的数据，例如当用户注销时。

但是，在查询仍处于活动状态时执行此操作没有多大意义，因为它只会在下一次重新渲染时触发硬加载状态。

如果您仍然需要删除查询，可以使用`queryClient.removeQueries({queryKey: key})`

```tsx
const queryClient = useQueryClient()
const query = useQuery({ queryKey, queryFn })

query.remove() // [!code --]
queryClient.removeQueries({ queryKey }) // [!code ++]
```

### 现在所需的最低 TypeScript 版本是 4.7

主要是因为围绕类型推断进行了重要修复。请参阅此[TypeScript issue](https://github.com/microsoft/TypeScript/issues/43371) 了解更多信息。

### `isDataEqual` 选项已从 useQuery 中删除

以前，此函数用于指示是使用先前的`data` (`true`) 还是新数据(`false`) 作为查询的已解析数据。

您可以通过将函数传递给 `structuralSharing` 来实现相同的功能：

```tsx
import { replaceEqualDeep } from '@tanstack/react-query'

- isDataEqual: (oldData, newData) => customCheck(oldData, newData) // [!code --]
+ structuralSharing: (oldData, newData) => customCheck(oldData, newData) ? oldData : replaceEqualDeep(oldData, newData) // [!code ++]
```

### 已弃用的自定义记录器已被删除

自定义记录器已在 4 中弃用，并在此版本中删除。日志记录仅在开发模式下有效，在开发模式下不需要传递自定义记录器。

### 支持的浏览器

我们更新了浏览器列表，以生成更现代、更高性能且更小的捆绑包。您可以阅读有关要求[here](../../installation#requirements)。

### 私有类字段和方法

TanStack Query 在类上始终具有私有字段和方法，但它们并不是真正私有的 - 它们只是 `TypeScript` 中的私有字段和方法。我们现在使用[ECMAScript Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)，这意味着这些字段现在是真正私有的，并且无法在运行时从外部访问。

### 将`cacheTime` 重命名为`gcTime`

几乎每个人都把`cacheTime`搞错了。这听起来像是“数据缓存的时间量”，但这是不正确的。

只要查询仍在使用中，`cacheTime` 就不会执行任何操作。它只会在查询不再使用时才会启动。超过该时间后，数据将被“垃圾回收”，以避免缓存增长。

`gc` 指的是“垃圾回收”时间。它更具技术性，但在计算机科学中也相当[well known abbreviation](<https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)>)。

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

为了使 `useErrorBoundary` 选项与框架更加无关，并避免与为Hook建立的 React 函数前缀“`use`”和“ErrorBoundary”组件名称混淆，它已被重命名为 `throwOnError` 以更准确地反映其功能。

### TypeScript：`Error` 现在是错误的默认类型，而不是 `unknown`

即使在 JavaScript 中，您可以 `throw` 任何内容（这使得 `unknown` 成为最正确的类型），但几乎总是会抛出 `Errors` （或 `Error` 的子类）。在大多数情况下，此更改使得在 TypeScript 中使用 `error` 字段变得更加容易。

如果你想抛出一些不是错误的东西，你现在必须为自己设置泛型：

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

有关全局设置不同类型错误的方法，请参阅[the TypeScript Guide](../../typescript.md#registering-a-global-error)。

### eslint `prefer-query-object-syntax` 规则已删除

由于现在唯一支持的语法是对象语法，因此不再需要此规则

### 删除了 `keepPreviousData` 以支持 `placeholderData` 身份函数

我们删除了`keepPreviousData`选项和`isPreviousData`标志，因为它们的作用与`placeholderData`和`isPlaceholderData`标志基本相同。

为了实现与 `keepPreviousData` 相同的功能，我们将之前的查询 `data` 作为参数添加到接受恒等函数的 `placeholderData` 中。因此，您只需向 `placeholderData` 提供身份函数或使用 Tanstack Query 中包含的 `keepPreviousData` 函数。

> 这里需要注意的是，`useQueries` 不会在 `placeholderData` 函数中接收 `previousData` 作为参数。这是由于数组中传递的查询的动态特性，这可能会导致占位符和 queryFn 的结果形状不同。

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

在 Tanstack Query 的上下文中，恒等函数是指始终返回其提供的参数（即数据）不变的函数。

```ts
useQuery({
  queryKey,
  queryFn,
  placeholderData: (previousData, previousQuery) => previousData, // identity function with the same behaviour as `keepPreviousData`
})
```

但是，此更改有一些警告，您必须注意：

- `placeholderData` 始终会将您置于 `success` 状态，而 `keepPreviousData` 则为您提供上一个查询的状态。如果我们成功获取数据然后出现后台重新获取错误，则该状态可能是`error`。然而，错误本身并未被共享，因此我们决定坚持 `placeholderData` 的行为。
- `keepPreviousData` 为您提供了先前数据的`dataUpdatedAt` 时间戳，而对于 `placeholderData`，`dataUpdatedAt` 将保留在 `0`。如果您想在屏幕上连续显示该时间戳，这可能会很烦人。不过你可以用`useEffect`来绕过它。

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

### 窗口焦点重新获取不再监听`focus`事件

`visibilitychange` 事件现在专用。这是可能的，因为我们仅支持支持 `visibilitychange` 事件的浏览器。这解决了一系列问题[as listed here](https://github.com/TanStack/query/pull/4805)。

### 网络状态不再依赖`navigator.onLine`属性

`navigator.onLine` 在基于 Chromium 的浏览器中效果不佳。假阴性周围有[a lot of issues](https://bugs.chromium.org/p/chromium/issues/list?q=navigator.online)，这导致查询被错误地标记为`offline`。

为了避免这个问题，我们现在总是从 `online: true` 开始，并且只监听 `online` 和 `offline` 事件来更新状态。

这应该会减少误报的可能性，但是，这可能意味着通过 Service Workers 加载的离线应用程序会误报，即使没有互联网连接也可以工作。

### 删除了自定义 `context` 属性，转而使用自定义 `queryClient` 实例

在 v4 中，我们引入了将自定义 `context` 传递给所有反应查询Hook的可能性。这允许在使用微前端时进行适当的隔离。

然而，`context` 是一个仅限反应的功能。 `context` 所做的只是让我们能够访问`queryClient`。我们可以通过允许直接传入自定义 `queryClient` 来实现相同的隔离。
这反过来又将使其他框架能够以与框架无关的方式具有相同的功能。

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

### 删除了`refetchPage`，改为`maxPages`

在 v4 中，我们引入了使用 `refetchPage` 函数定义要重新获取无限查询的页面的可能性。

但是，重新获取所有页面可能会导致 UI 不一致。此外，此选项可用于例如`queryClient.refetchQueries`，但它只对无限查询起作用，而不是“正常”查询。

v5 包含一个新的`maxPages` 选项，用于无限查询，以限制查询数据中存储和重新获取的页数。此新功能可处理最初为 `refetchPage` 页面功能确定的用例，而不会出现相关问题。

### 新`dehydrate` API

您可以传递给`dehydrate` 的选项已被简化。查询和变更总是会被脱水（根据默认函数实现）。要更改此行为，您可以实现等效函数`shouldDehydrateQuery` 或`shouldDehydrateMutation`，而不是使用已删除的布尔选项`dehydrateMutations` 和`dehydrateQueries`。要获得根本不水合查询/变更的旧行为，请传入`() => false`。

```tsx
- dehydrateMutations?: boolean // [!code --]
- dehydrateQueries?: boolean // [!code --]
```

### 无限查询现在需要 `initialPageParam`

之前，我们已将`undefined` 作为`pageParam` 传递给`queryFn`，并且您可以为`queryFn` 函数签名中的`pageParam` 参数分配默认值。这样做的缺点是将`undefined` 存储在`queryCache` 中，而`queryCache` 是不可序列化的。

相反，您现在必须将显式 `initialPageParam` 传递给无限查询选项。这将用作首页的`pageParam`：

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

以前，我们允许通过将`pageParam` 值直接传递给`fetchNextPage` 或`fetchPreviousPage` 来覆盖将从`getNextPageParam` 或`getPreviousPageParam` 返回的`pageParams`。此功能在重新获取时根本不起作用，并且没有被广泛了解或使用。这也意味着无限查询现在需要`getNextPageParam`。

### 从`getNextPageParam` 或`getPreviousPageParam` 返回`null` 现在表明没有更多页面可用

在 v4 中，您需要显式返回 `undefined` 以指示没有更多页面可用。我们已扩大此检查范围以包括`null`。

### 服务器上没有重试

在服务器上，`retry` 现在默认为 `0` 而不是 `3`。对于预取，我们始终默认为 `0` 重试，但由于启用了 `suspense` 的查询现在也可以直接在服务器上执行（自 React18 起），因此我们必须确保根本不在服务器上重试。

### `status: loading` 已更改为`status: pending`，`isLoading` 已更改为`isPending`，`isInitialLoading` 现已重命名为`isLoading`

`loading` 状态已重命名为 `pending`，类似地，派生的 `isLoading` 标志已重命名为 `isPending`。

对于变更，`status` 已从`loading` 更改为`pending`，`isLoading` 标志已更改为`isPending`。

最后，新的派生 `isLoading` 标志已添加到作为 `isPending && isFetching` 实现的查询中。这意味着 `isLoading` 和 `isInitialLoading` 具有相同的功能，但 `isInitialLoading` 现已弃用，并将在下一个主要版本中删除。

要了解此更改背后的原因，请查看[v5 roadmap discussion](https://github.com/TanStack/query/discussions/4252)。

### `hashQueryKey` 已重命名为 `hashKey`

因为它还对变更键进行哈希处理，并且可以在 `useIsMutating` 和 `useMutationState` 的 `predicate` 函数内部使用，从而传递变更。

[//]: # 'FrameworkSpecificBreakingChanges'

### 现在所需的最低 React 版本是 18.0

React Query v5 需要 React 18.0 或更高版本。这是因为我们使用了新的 `useSyncExternalStore` Hook，该 Hook 仅在 React 18.0 及更高版本中可用。此前我们一直使用 React 提供的 shim。

### `contextSharing` 属性已从 QueryClientProvider 中删除

您以前可以使用 `contextSharing` 属性在窗口中共享Query Client上下文的第一个（且至少一个）实例。这确保了如果 TanStack Query 在不同的包或微前端中使用，那么它们都将使用相同的上下文实例，无论模块范围如何。

在 v5 中删除了自定义上下文属性，请参阅 [Removed custom context prop in favor of custom queryClient instance](#removed-custom-context-prop-in-favor-of-custom-queryclient-instance) 部分。如果您希望在应用程序的多个包之间共享相同的Query Client，您可以直接传递共享的自定义`queryClient`实例。

### 不再使用 `unstable_batchedUpdates` 作为 React 和 React Native 中的批处理函数

由于函数`unstable_batchedUpdates`在React 18中是noop，因此在`react-query`中将不再自动设置为批处理函数。

如果您的框架支持自定义批处理功能，您可以通过调用 `notifyManager.setBatchNotifyFunction` 让 TanStack Query 了解它。

例如，`solid-query`中批处理功能的设置方式如下：

```ts
import { notifyManager } from '@tanstack/query-core'
import { batch } from 'solid-js'

notifyManager.setBatchNotifyFunction(batch)
```

### 水合 API 更改

为了更好地支持并发功能和转换，我们对水合 API 进行了一些更改。 `Hydrate` 组件已重命名为`HydrationBoundary` 并且`useHydrate` Hook已被删除。

`HydrationBoundary` 不再水合变更，仅查询。要水合变更，请使用低级别 `hydrate` API 或 `persistQueryClient` 插件。

最后，作为一个技术细节，查询水合的时间略有变化。新查询仍然在渲染阶段进行水合，以便 SSR 照常工作，但缓存中已存在的任何查询现在都在效果中进行水合（只要它们的数据比缓存中的数据更新）。如果您像常见的那样在应用程序启动时只进行一次水合，这不会影响您，但如果您使用服务器组件并在页面导航上传递新数据进行水合作用，您可能会注意到在页面立即重新渲染之前旧数据会闪烁。

最后一项更改在技术上是一项重大更改，这样做是为了在页面转换完全提交之前我们不会过早更新_现有_页面上的内容。您无需采取任何行动。

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

因此，对 `queryClient.setQueryDefaults` 的调用现在应该以_`queryClient.setQueryDefaults` 的特殊性进行排序。
也就是说，应该从**最通用的密钥**到**最不通用的密钥**进行注册。

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

请注意，在此特定示例中，`retry: true` 被添加到 `['todo', 'detail']` 注册中，以抵消它现在从更通用的注册继承`retry: false`。维持准确行为所需的具体更改将根据您的默认设置而有所不同。

[//]: # 'FrameworkSpecificBreakingChanges'

## 新功能🚀

v5还带来了新功能：

### 简化的乐观更新

我们有一种新的、简化的方法来利用 `useMutation` 返回的 `variables` 来执行乐观更新：

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

在这里，我们仅更改变更运行时 UI 的外观，而不是直接将数据写入缓存。如果我们只有一个地方需要显示乐观更新，那么这种方法效果最好。有关更多详细信息，请查看[optimistic updates documentation](../optimistic-updates.md)。

### 使用新的 maxPages 选项进行有限、无限查询

当需要无限滚动或分页时，无限查询非常有用。
但是，获取的页面越多，消耗的内存就越多，并且这也会减慢查询重新获取过程，因为所有页面都是按顺序重新获取的。

版本 5 具有用于无限查询的新 `maxPages` 选项，它允许开发人员限制存储在查询数据中并随后重新获取的页面数量。
您可以根据您想要提供的用户体验和重新获取性能来调整 `maxPages` 值。

请注意，无限列表必须是双向的，这需要同时定义 `getNextPageParam` 和 `getPreviousPageParam`。

### 无限查询可以预取多个页面

无限查询可以像常规查询一样预取。默认情况下，仅预取查询的第一页并将其存储在给定的 QueryKey 下。如果要预取多页，可以使用`pages`选项。请阅读[prefetching guide](../prefetching.md) 了解更多信息。

### `useQueries` 的新 `combine` 选项

有关更多详细信息，请参阅[useQueries docs](../../reference/useQueries.md#combine)。

### 实验`fine grained storage persister`

有关更多详细信息，请参阅[experimental_createPersister docs](../../plugins/createPersister.md)。

[//]: # 'FrameworkSpecificNewFeatures'

### 创建查询选项的类型安全方法

有关更多详细信息，请参阅[TypeScript docs](../../typescript.md#typing-query-options)。

### 新的 Suspense

到了v5，数据获取的 Suspense终于变得“稳定”了。我们添加了专用的 `useSuspenseQuery`、`useSuspenseInfiniteQuery` 和 `useSuspenseQueries` Hook。有了这些 Hook，`data`在类型级别上永远不会成为`undefined`：

```js
const { data: post } = useSuspenseQuery({
  // ^? const post: Post
  queryKey: ['post', postId],
  queryFn: () => fetchPost(postId),
})
```

查询Hook上的实验性 `suspense: boolean` 标志已被删除。

您可以在[suspense docs](../suspense.md) 中阅读有关它们的更多信息。

[//]: # 'FrameworkSpecificNewFeatures'
