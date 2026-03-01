---
id: parallel-queries
title: 并行查询
---

<!--
translation-source-path: framework/react/guides/parallel-queries.md
translation-source-ref: v5.90.3
translation-source-hash: e3380ec66bb9af46f0ad66fdd8abb4a956d71a4ba45f9010287ac17505933074
translation-status: translated
-->


“并行”查询是并行执行的查询，或者同时执行的查询，以最大化获取并发性。

## 手动并行查询

当并行查询的数量不变时，**不需要额外的努力**来使用并行查询。只需并排使用任意数量的 TanStack Query 的 `useQuery` 和 `useInfiniteQuery` Hook 即可！

[//]: # 'Example'

```tsx
function App () {
  // The following queries will execute in parallel
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  ...
}
```

[//]: # 'Example'
[//]: # 'Info'

> 当在 Suspense 模式下使用 React Query 时，这种并行模式不起作用，因为第一个查询会在内部抛出一个 Promise，并会在其他查询运行之前挂起组件。为了解决这个问题，您要么需要使用 `useSuspenseQueries` Hook（推荐），要么为每个 `useSuspenseQuery` 实例使用单独的组件来自行编排并行执行。

[//]: # 'Info'

## 使用 `useQueries` 进行动态并行查询

[//]: # 'DynamicParallelIntro'

如果您需要执行的查询数量在不同渲染之间发生变化，则不能使用手动查询，因为这会违反Hook规则。相反，TanStack Query 提供了一个 `useQueries` Hook，您可以使用它来动态地并行执行任意数量的查询。

[//]: # 'DynamicParallelIntro'

`useQueries` 接受一个带有 **查询键** 的 **选项对象**，其值是 **查询对象数组**。它返回一个**查询结果数组**：

[//]: # 'Example2'

```tsx
function App({ users }) {
  const userQueries = useQueries({
    queries: users.map((user) => {
      return {
        queryKey: ['user', user.id],
        queryFn: () => fetchUserById(user.id),
      }
    }),
  })
}
```

[//]: # 'Example2'
