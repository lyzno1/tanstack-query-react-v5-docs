---
id: useQueries
title: useQueries
redirect_from:
  - framework/react/reference/useQueries
---

```ts
function useQueries<T, TCombinedResult>(__namedParameters, queryClient?): TCombinedResult;
```

定义于： [react-query/src/useQueries.ts:355](https://github.com/TanStack/query/blob/main/packages/react-query/src/useQueries.ts#L355)

`useQueries` Hook 可用于获取数量不固定的查询。

`queries` 键接受一个查询选项对象数组，其中的选项大多与 `useQuery` 相同——每个查询都不接受顶层
`subscribed` 选项（另一处差异请参阅下文的 `placeholderData`）。自定义 `QueryClient` 只需提供一次，
将其作为 `useQueries` 自身顶层的第二个参数传入，而不是分别传给每个查询。

如果查询对象数组中多次出现相同的查询键，可能导致查询之间共享部分数据。为避免这种情况，
可以考虑先对查询去重，再将结果映射回所需结构。

`combine` 选项可将多个查询的结果合并为单个值。结果会进行结构共享，以尽可能保持引用稳定。

## 类型参数

### T

`T` *extends* `any`[]

### TCombinedResult

`TCombinedResult` = `T` *extends* \[\] ? \[\] : `T` *extends* \[`Head`\] ? \[`GetUseQueryResult`\<`Head`\>\] : `T` *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseQueryResult`\<`Head`\>, `GetUseQueryResult`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseQueryResult`\<`Head`\>, `GetUseQueryResult`\<`Head`\>, `GetUseQueryResult`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...(...)[]`\] *extends* \[\] ? \[\] : ... *extends* ... ? ... : ... : \[`...{ [K in (...)]: (...) }[]`\] : \[...\{ \[K in string \| number \| symbol\]: GetUseQueryResult\<Tails\[K\<(...)\>\]\> \}\[\]\] : \{ \[K in string \| number \| symbol\]: GetUseQueryResult\<T\[K\<K\>\]\> \}

## 参数

### \_\_namedParameters

#### combine?

(`result`) => `TCombinedResult`

使用此函数将多个查询的结果合并为单个值。结果会进行结构共享，以尽可能保持引用稳定。

#### queries

  \| readonly \[`T` *extends* \[\] ? \[\] : `T` *extends* \[`Head`\] ? \[`GetUseQueryOptionsForUseQueries`\<`Head`\>\] : `T` *extends* \[`Head`, `...Tails[]`\] ? \[`...Tails[]`\] *extends* \[\] ? \[\] : \[`...Tails[]`\] *extends* \[`Head`\] ? \[`GetUseQueryOptionsForUseQueries`\<`Head`\>, `GetUseQueryOptionsForUseQueries`\<`Head`\>\] : \[`...Tails[]`\] *extends* \[`Head`, `...Tails[]`\] ? \[`...(...)[]`\] *extends* \[\] ? \[\] : ... *extends* ... ? ... : ... : readonly ...[] *extends* \[`...(...)[]`\] ? \[`...(...)[]`\] : ... *extends* ... ? ... : ... : readonly `unknown`[] *extends* `T` ? `T` : `T` *extends* `UseQueryOptionsForUseQueries`\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>[] ? `UseQueryOptionsForUseQueries`\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>[] : `UseQueryOptionsForUseQueries`\<`unknown`, `Error`, `unknown`, readonly ...[]\>[]\]
  \| readonly \[\{ \[K in string \| number \| symbol\]: GetUseQueryOptionsForUseQueries\<T\[K\<K\>\]\> \}\]

一个查询选项对象数组，其中的选项大多与 `useQuery` 相同。区别在于：每个查询都不接受 `queryClient`
和 `subscribed`（`subscribed` 在这里是顶层选项）；`placeholderData` 接受一个
QueriesPlaceholderDataFunction，调用该函数时，`previousData` 和 `previousQuery` 始终为 `undefined`，
这与 `useQuery` 的占位数据函数不同。

#### subscribed?

`boolean`

将其设为 `false`，可让此 Observer 取消订阅查询缓存的更新。

**默认值**

```ts
true
```

### queryClient?

`QueryClient`

使用此参数可提供自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

`TCombinedResult`

合并后的结果。未提供 `combine` 时，它是包含所有查询结果的数组，顺序与输入一致；
提供 `combine` 时，则是 `combine` 的返回值。

## 说明

仅当 `combine` 函数的引用发生变化，或任一查询结果发生变化时，它才会重新运行。因此，像下方示例那样
内联的 `combine` 函数会在每次渲染时运行。为避免这种情况，可以用 `useCallback` 包装它；如果它没有任何依赖，
也可以将其提取为稳定的函数引用。

与 `useQuery` 不同，`useQueries` 无法根据同级的 `queryFn` 推断出_内联_ `select` 的 `data` 参数类型。
这是因为 `useQueries` 会一次性推断整个 `queries` 数组的类型，所以内联查询对象中的 `select` 参数无法
从同一对象的 `queryFn` 获得上下文类型，最终会回退为 `unknown`——这是一个
[已知的 TypeScript 限制](https://github.com/TanStack/query/issues/6556)。可以显式标注 `select` 参数，
或使用 [queryOptions](queryOptions.md) 定义查询，让单个对象在传给 `useQueries` _之前_先完成类型解析，
从而绕过此限制，具体请参阅下方示例。同样的限制也适用于 [useSuspenseQueries](useSuspenseQueries.md)。

这里同样支持 `placeholderData`。但与 `useQuery` 不同，它不会接收到先前渲染的查询信息，
因为每次渲染时的查询数量可能不同。

## 示例

```tsx
import { useQueries } from '@tanstack/react-query'

function Posts({ ids }: { ids: Array<number> }) {
  const postQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
      staleTime: Infinity,
    })),
  })

  return (
    <ul>
      {postQueries.map((query, index) => {
        if (query.isPending) return <li key={ids[index]}>正在加载……</li>
        if (query.isError) return <li key={ids[index]}>错误：{query.error.message}</li>
        return <li key={ids[index]}>{query.data.title}</li>
      })}
    </ul>
  )
}
```

将结果合并为单个值：
```tsx
import { useQueries } from '@tanstack/react-query'

function Posts({ ids }: { ids: Array<number> }) {
  const { data, isPending, isError } = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
    })),
    combine: (postQueries) => {
      return {
        data: postQueries.map((query) => query.data),
        isPending: postQueries.some((query) => query.isPending),
        isError: postQueries.some((query) => query.isError),
      }
    },
  })

  if (isPending) return '正在加载……'
  if (isError) return '加载文章时出错'

  return (
    <ul>
      {data.map((post) => (
        <li key={post?.id}>{post?.title}</li>
      ))}
    </ul>
  )
}
```

通过 [queryOptions](queryOptions.md) 为 `select` 提供类型。请注意，展开 `queryOptions` 的结果后再内联覆盖
`select`，类型仍会回退为 `unknown`；需要再次用 `queryOptions` 包裹展开结果，让覆盖项在传给
`useQueries` 之前完成类型解析：
```tsx
import { queryOptions, useQueries } from '@tanstack/react-query'

const postOptions = (id: number) =>
  queryOptions({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  })

function PostTitle({ id }: { id: number }) {
  const [{ data: broken }] = useQueries({
    queries: [
      {
        ...postOptions(id),
        // ❌ 此处的 `data` 是 `unknown`
        select: (data) => data.title,
      },
    ],
  })

  const [{ data: fixed }] = useQueries({
    queries: [
      queryOptions({
        ...postOptions(id),
        // ✅ `data` 是 `Post`
        select: (data) => data.title,
      }),
    ],
  })

  return <h1>{fixed}</h1>
}
```
