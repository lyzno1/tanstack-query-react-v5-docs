---
id: parallel-queries
title: 并行查询
---

“并行查询”是指同时执行多个查询，以尽可能提高数据获取的并发度。

## 手动并行查询

当并行查询的数量固定时，**无需额外处理**。只需并列调用任意数量的 TanStack Query
`useQuery` 和 `useInfiniteQuery` Hook 即可。

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

> 在 Suspense 模式下，这种并行写法无法生效，因为第一个查询会在内部抛出 Promise，使组件在其余查询运行前就进入挂起状态。此时应使用 `useSuspenseQueries` Hook（推荐），或把每个 `useSuspenseQuery` 放入独立组件，自行组织并行执行。

[//]: # 'Info'

## 使用 `useQueries` 进行动态并行查询

[//]: # 'DynamicParallelIntro'

如果需要执行的查询数量会随每次渲染而变化，就不能手动调用多个 Hook，否则会违反 Hook 规则。TanStack Query 提供了 `useQueries` Hook，可用于动态并行执行任意数量的查询。

[//]: # 'DynamicParallelIntro'

[//]: # 'DynamicParallelDescription'

`useQueries` 接受一个**选项对象**，其中 `queries` 的值是**查询对象数组**；它会返回一个**查询结果数组**：

[//]: # 'DynamicParallelDescription'
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

[//]: # 'TypeScriptSelect'

> 使用 TypeScript 时，如果直接在传给 `useQueries` 的查询对象中内联编写 `select`，它无法根据同一对象的 `queryFn` 推断 `data` 参数的类型，因而会回退为 `unknown`。请显式标注 `select` 参数的类型，或使用 [`queryOptions`](../reference/functions/queryOptions.md) 辅助函数定义查询，以保留类型推断。详情请参阅[这一已知限制](https://github.com/TanStack/query/issues/6556)。

[//]: # 'TypeScriptSelect'
