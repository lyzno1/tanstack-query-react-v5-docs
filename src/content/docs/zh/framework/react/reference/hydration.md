---
id: hydration
title: hydration
---

<!--
translation-source-path: framework/react/reference/hydration.md
translation-source-ref: v5.90.3
translation-source-hash: 9b00b510243dce7c5a5cd17ec503be3918a46708f2cd1a514ea596d72ddc8d52
translation-status: translated
-->


## `dehydrate`

`dehydrate` 会创建 `cache` 的冻结表示，之后可通过 `HydrationBoundary` 或 `hydrate` 进行水合。这对于把服务端预取的查询传递到客户端，或者将查询持久化到 localStorage 等持久化位置很有用。默认情况下，它只包含当前成功的查询。

```tsx
import { dehydrate } from '@tanstack/react-query'

const dehydratedState = dehydrate(queryClient, {
  shouldDehydrateQuery,
  shouldDehydrateMutation,
})
```

**选项**

- `client: QueryClient`
  - **必填**
  - 需要被脱水的 `queryClient`
- `options: DehydrateOptions`
  - 可选
  - `shouldDehydrateMutation: (mutation: Mutation) => boolean`
    - 可选
    - 是否对 mutations 进行脱水。
    - 该函数会对缓存中的每个 mutation 调用
      - 返回 `true` 表示在脱水结果中包含该 mutation，否则返回 `false`
    - 默认只包含已暂停的 mutations
    - 如果你想在保留默认行为的同时扩展该函数，可导入并执行 `defaultShouldDehydrateMutation`，并将其纳入返回逻辑
  - `shouldDehydrateQuery: (query: Query) => boolean`
    - 可选
    - 是否对 queries 进行脱水。
    - 该函数会对缓存中的每个 query 调用
      - 返回 `true` 表示在脱水结果中包含该 query，否则返回 `false`
    - 默认只包含成功的 queries
    - 如果你想在保留默认行为的同时扩展该函数，可导入并执行 `defaultShouldDehydrateQuery`，并将其纳入返回逻辑
  - `serializeData?: (data: any) => any` 在脱水期间对数据进行转换（序列化）的函数。
  - `shouldRedactErrors?: (error: unknown) => boolean`
    - 可选
    - 是否在脱水期间对来自服务端的错误进行脱敏。
    - 该函数会对缓存中的每个错误调用
      - 返回 `true` 表示对该错误脱敏，否则返回 `false`
    - 默认对所有错误进行脱敏

**返回值**

- `dehydratedState: DehydratedState`
  - 包含后续水合 `queryClient` 所需的全部信息
  - 你**不应**依赖该返回值的精确格式，它不属于公共 API，可能随时变更
  - 该结果不是序列化后的形式，如有需要请自行序列化

### 限制

某些存储系统（例如浏览器 [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)）要求值可被 JSON 序列化。如果你需要脱水那些无法自动序列化为 JSON 的值（如 `Error` 或 `undefined`），你需要自行处理序列化。由于默认只包含成功查询，若你还希望包含 `Errors`，需要提供 `shouldDehydrateQuery`，例如：

```tsx
// server
const state = dehydrate(client, { shouldDehydrateQuery: () => true }) // to also include Errors
const serializedState = mySerialize(state) // transform Error instances to objects

// client
const state = myDeserialize(serializedState) // transform objects back to Error instances
hydrate(client, state)
```

## `hydrate`

`hydrate` 会将先前脱水得到的状态加入 `cache`。

```tsx
import { hydrate } from '@tanstack/react-query'

hydrate(queryClient, dehydratedState, options)
```

**选项**

- `client: QueryClient`
  - **必填**
  - 要把状态水合到其中的 `queryClient`
- `dehydratedState: DehydratedState`
  - **必填**
  - 要水合到 client 中的状态
- `options: HydrateOptions`
  - 可选
  - `defaultOptions: DefaultOptions`
    - 可选
    - `mutations: MutationOptions` 用于水合后 mutations 的默认变更选项。
    - `queries: QueryOptions` 用于水合后 queries 的默认查询选项。
    - `deserializeData?: (data: any) => any` 在数据放入缓存前进行转换（反序列化）的函数。
  - `queryClient?: QueryClient`
    - 用于指定自定义 QueryClient。否则会使用最近上下文中的 QueryClient。

### 限制

如果你尝试水合的 queries 已存在于 queryCache 中，只有当新数据比缓存中的数据更新时，`hydrate` 才会覆盖；否则将**不会**应用。

[//]: # 'HydrationBoundary'

## `HydrationBoundary`

`HydrationBoundary` 会把之前脱水的状态加入 `useQueryClient()` 返回的 `queryClient`。如果 client 已包含数据，新查询会基于更新时间戳进行智能合并。

```tsx
import { HydrationBoundary } from '@tanstack/react-query'

function App() {
  return <HydrationBoundary state={dehydratedState}>...</HydrationBoundary>
}
```

> 注意：只有 `queries` 可以通过 `HydrationBoundary` 进行脱水/水合。

**选项**

- `state: DehydratedState`
  - 要水合的状态
- `options: HydrateOptions`
  - 可选
  - `defaultOptions: QueryOptions`
    - 用于水合后 queries 的默认查询选项。
  - `queryClient?: QueryClient`
    - 用于指定自定义 QueryClient。否则会使用最近上下文中的 QueryClient。

[//]: # 'HydrationBoundary'
