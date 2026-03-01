---
id: typescript
title: TypeScript
---

<!--
translation-source-path: framework/react/typescript.md
translation-source-ref: v5.90.3
translation-source-hash: a6ab2cd793efbc78b0da5e863d99763b058bd91cc4275ec4514321dad768cc57
translation-status: translated
-->


React Query 现在使用 **TypeScript** 编写，以确保库本身和你的项目都具备类型安全！

需要注意：

- 类型定义当前要求 TypeScript **v4.7** 或更高版本
- 该仓库中的类型变更被视为**非破坏性**变更，通常会以 **patch** 版本发布（否则每次类型增强都得发 major 版本）
- **强烈建议将 react-query 包版本锁定到具体 patch 版本，并在升级时预期任意版本间都可能包含类型修复或增强**
- React Query 与类型无关的公共 API 仍严格遵循 semver

## Type Inference

React Query 的类型通常能够很好地自动流转，你一般无需手动提供类型注解。

[//]: # 'TypeInference1'

```tsx
const { data } = useQuery({
  //    ^? const data: number | undefined
  queryKey: ['test'],
  queryFn: () => Promise.resolve(5),
})
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0icALwoM2XHgAUAbSqDkIAEa4qAXQA0cFQEo5APjgAFciGAYAdLVQQANgDd0KgKxmzXgB6ILgw8IA9AH5eIA)

[//]: # 'TypeInference1'
[//]: # 'TypeInference2'

```tsx
const { data } = useQuery({
  //      ^? const data: string | undefined
  queryKey: ['test'],
  queryFn: () => Promise.resolve(5),
  select: (data) => data.toString(),
})
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0icALwoM2XHgAUAbSox0IqgF0ANHBUBKOQD44ABXIhgGAHS1UEADYA3dCoCsxw0gwu6EwAXHASUuZhknT2MBAAyjBQwIIA5iaExrwA9Nlw+QUAegD8vEA)

[//]: # 'TypeInference2'

如果你的 `queryFn` 返回类型定义明确，这会表现得最好。注意，大多数数据获取库默认返回 `any`，因此请把它提取为一个类型正确的函数：

[//]: # 'TypeInference3'

```tsx
const fetchGroups = (): Promise<Group[]> =>
  axios.get('/groups').then((response) => response.data)

const { data } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const data: Group[] | undefined
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFCiSw4dAB7AIqUuUpURY1Nx68YeMOjgBxcsjBwAvIjjAAJgC44AO2QgARriK9eDCOdTwS6GAwAWmiNon6ABQAlGYAClLAGAA8vtoA2gC6AHx6qbLiAHQA5h6BVAD02Vpg8sGZMF7o5oG0qJAuarqpdQ0YmUZ0MHTBDjxOLvBInd1EeigY2Lh4gfFUxX6lVIkANKQe3nGlvTwFBXAHhwB6APxwA65wI3RmW0lwAD4o5kboJMDm6Ea8QA)

[//]: # 'TypeInference3'

## Type Narrowing

React Query 对查询结果使用了[可辨识联合类型](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions)，通过 `status` 字段及其派生布尔状态标记进行区分。这样你就可以通过判断 `success` 状态让 `data` 变为已定义：

[//]: # 'TypeNarrowing'

```tsx
const { data, isSuccess } = useQuery({
  queryKey: ['test'],
  queryFn: () => Promise.resolve(5),
})

if (isSuccess) {
  data
  //  ^? const data: number
}
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAORToCGAxjALQCOO+VAsAFC8MQAdqnhIAJnRh0ANHGCoAysgYN0qVETgBeFBmy48ACgDaVGGphUAurMMBKbQD44ABXIh56AHS1UEADYAbuiGAKx2dry8wCRwhvJKKmqoDgi8cBlwElK8APS5GQB6APy8hLxAA)

[//]: # 'TypeNarrowing'

## Typing the error field

`error` 默认类型是 `Error`，因为这符合大多数用户的预期。

[//]: # 'TypingError'

```tsx
const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const error: Error
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAOQACMAhgHaoMDGA1gPRTr2swBaAI458VALAAoUJFhx6AD2ARUpcpSqLlqCZKkw8YdHADi5ZGDgBeRHGAATAFxxGyEACNcRKVNYRm8CToMKwAFmYQFqo2ABQAlM4ACurAGAA8ERYA2gC6AHzWBVoqAHQA5sExVJxl5mA6cSUwoeiMMTyokMzGVgUdXRgl9vQMcT6SfgG2uORQRNYoGNi4eDFZVLWR9VQ5ADSkwWGZ9WOSnJxwl1cAegD8QA)

[//]: # 'TypingError'

如果你希望抛出自定义错误，或者抛出的根本不是 `Error`，可以显式指定 `error` 字段类型：

[//]: # 'TypingError2'

```tsx
const { error } = useQuery<Group[], string>(['groups'], fetchGroups)
//      ^? const error: string | null
```

[//]: # 'TypingError2'

但这样会带来一个缺点：`useQuery` 其余泛型的类型推断将不再生效。通常不建议抛出非 `Error` 的值；如果你是 `AxiosError` 这类子类，可用 _type narrowing_ 让 `error` 字段更具体：

[//]: # 'TypingError3'

```tsx
import axios from 'axios'

const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const error: Error | null

if (axios.isAxiosError(error)) {
  error
  // ^? const error: AxiosError
}
```

[typescript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCKz1QJ5wC+cAZlBCHAOQACMAhgHaoMDGA1gPRTr2swBaAI458VALAAoUJFhx6AD2ARUpcpSqLlqCZKkw8YdHADi5ZGDgBeRHGAATAFxxGyEACNcRKVNYRm8CToMKwAFmYQFqo2ABQAlM4ACurAGAA8ERYA2gC6AHzWBVoqAHQA5sExVJxl5mA6cSUwoeiMMTyokMzGVgUdXRgl9vQMcT6SfgG2uORQRNYoGNi4eDFIIisA0uh4zllUtZH1VDkANHAb+ABijM5BIeF1qoRjkpyccJ9fAHoA-OPAEhwGLFVAlVIAQSUKgAolBZjEZtA4nFEFJPkioOi4O84H8pIQgA)

[//]: # 'TypingError3'

### Registering a global Error

TanStack Query v5 允许你通过扩展 `Register` 接口设置全局 Error 类型，无需在每个调用点都写泛型。这样可以在保持类型推断的同时，让 `error` 字段变成你指定的类型。若你希望强制调用点做显式类型收窄，可把 `defaultError` 设为 `unknown`：

[//]: # 'RegisterErrorType'

```tsx
import '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    // Use unknown so call sites must narrow explicitly.
    defaultError: unknown
  }
}

const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups })
//      ^? const error: unknown | null
```

[//]: # 'RegisterErrorType'
[//]: # 'TypingMeta'

## Typing meta

### Registering global Meta

与注册[全局错误类型](#registering-a-global-error)类似，你也可以注册全局 `Meta` 类型。这样可以确保 [queries](../reference/useQuery.md) 和 [mutations](../reference/useMutation.md) 上可选的 `meta` 字段保持一致并具备类型安全。注意，注册类型必须扩展 `Record<string, unknown>`，这样 `meta` 才能保持对象类型。

```ts
import '@tanstack/react-query'

interface MyMeta extends Record<string, unknown> {
  // Your meta type definition.
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: MyMeta
    mutationMeta: MyMeta
  }
}
```

[//]: # 'TypingMeta'
[//]: # 'TypingQueryAndMutationKeys'

## Typing query and mutation keys

### Registering the query and mutation key types

同样地，类似注册[全局错误类型](#registering-a-global-error)，你也可以注册全局 `QueryKey` 与 `MutationKey` 类型。这能为你的键提供更贴合应用层级的结构，并在整个库表面保持类型一致。注意，注册类型必须扩展 `Array`，以确保键仍然是数组。

```ts
import '@tanstack/react-query'

type QueryKey = ['dashboard' | 'marketing', ...ReadonlyArray<unknown>]

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: QueryKey
    mutationKey: QueryKey
  }
}
```

[//]: # 'TypingQueryAndMutationKeys'
[//]: # 'TypingQueryOptions'

## Typing Query Options

如果你在 `useQuery` 中内联 query options，会得到自动类型推断。但有时你可能想把 query options 提取到独立函数里，在 `useQuery` 与 `prefetchQuery` 等场景间复用。这样会丢失推断。要恢复推断，可使用 `queryOptions` 辅助函数：

```ts
import { queryOptions } from '@tanstack/react-query'

function groupOptions() {
  return queryOptions({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  })
}

useQuery(groupOptions())
queryClient.prefetchQuery(groupOptions())
```

另外，`queryOptions` 返回的 `queryKey` 会携带其关联 `queryFn` 的类型信息。我们可以利用这一点，让 `queryClient.getQueryData` 之类的方法也感知这些类型：

```ts
function groupOptions() {
  return queryOptions({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  })
}

const data = queryClient.getQueryData(groupOptions().queryKey)
//     ^? const data: Group[] | undefined
```

如果不使用 `queryOptions`，`data` 的类型会是 `unknown`，除非我们显式传泛型：

```ts
const data = queryClient.getQueryData<Group[]>(['groups'])
```

## Typing Mutation Options

与 `queryOptions` 类似，你可以使用 `mutationOptions` 将 mutation options 提取到独立函数中：

```ts
function groupMutationOptions() {
  return mutationOptions({
    mutationKey: ['addGroup'],
    mutationFn: addGroup,
  })
}

useMutation({
  ...groupMutationOptions(),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
})
useIsMutating(groupMutationOptions())
queryClient.isMutating(groupMutationOptions())
```

[//]: # 'TypingQueryOptions'

## Typesafe disabling of queries using `skipToken`

如果你在使用 TypeScript，可以通过 `skipToken` 禁用查询。这在你希望基于条件禁用查询、同时仍保持查询类型安全时非常有用。
可在 [Disabling Queries](../guides/disabling-queries.md) 指南中了解更多。

[//]: # 'Materials'

## 延伸阅读

如果你想了解更多关于类型推断的技巧，可以阅读社区资源中的 [React Query and TypeScript](../community/tkdodos-blog.md#6-react-query-and-typescript)。若你希望获得尽可能强的类型安全，可阅读 [Type-safe React Query](../community/tkdodos-blog.md#19-type-safe-react-query)。而 [The Query Options API](../community/tkdodos-blog.md#24-the-query-options-api) 讲解了 `queryOptions` 辅助函数中的类型推断机制。

[//]: # 'Materials'
