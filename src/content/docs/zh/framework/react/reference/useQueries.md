---
id: useQueries
title: useQueries
---

<!--
translation-source-path: framework/react/reference/useQueries.md
translation-source-ref: v5.90.3
translation-source-hash: a23aaec418ef584b397e130a6bb38a93bf5eecfae7839f7612bff8677c809da2
translation-status: translated
-->


`useQueries` Hook 可用于获取数量可变的多个查询：

```tsx
const ids = [1, 2, 3]
const results = useQueries({
  queries: ids.map((id) => ({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    staleTime: Infinity,
  })),
})
```

**选项**

`useQueries` Hook 接收一个选项对象，其中 **queries** 键的值是一个数组。数组中的每个查询选项对象与 [`useQuery` Hook](../useQuery.md) 相同（不包括 `queryClient` 选项，因为 `QueryClient` 可在顶层传入）。

- `queryClient?: QueryClient`
  - 使用此项可提供自定义 QueryClient。否则会使用最近上下文中的实例。
- `combine?: (result: UseQueriesResults) => TCombinedResult`
  - 使用此项可把多个查询结果合并为单个值。

> 在查询对象数组中多次使用相同查询键，可能导致查询之间共享部分数据。为避免这种情况，建议先对查询去重，再将结果映射回你需要的结构。

**placeholderData**

`useQueries` 也支持 `placeholderData` 选项，但它不会像 `useQuery` 一样接收先前已渲染查询传来的信息，因为 `useQueries` 的输入在每次渲染时可能是不同数量的查询。

**返回值**

`useQueries` Hook 返回一个包含全部查询结果的数组，返回顺序与输入顺序一致。

## Combine

如果你想把结果中的 `data`（或其他查询信息）合并为单个值，可以使用 `combine` 选项。合并结果会进行结构共享，以尽可能保持引用稳定。

```tsx
const ids = [1, 2, 3]
const combinedQueries = useQueries({
  queries: ids.map((id) => ({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  })),
  combine: (results) => {
    return {
      data: results.map((result) => result.data),
      pending: results.some((result) => result.isPending),
    }
  },
})
```

在上面的示例中，`combinedQueries` 会是一个包含 `data` 与 `pending` 属性的对象。注意，查询结果的其他属性都会丢失。

### Memoization

`combine` 函数仅会在以下情况重新执行：

- `combine` 函数自身的引用发生变化
- 任一查询结果发生变化

这意味着像上面那样内联定义的 `combine` 函数会在每次渲染时运行。要避免这一点，你可以用 `useCallback` 包裹 `combine` 函数，或在无依赖时将其提取为稳定的函数引用。
