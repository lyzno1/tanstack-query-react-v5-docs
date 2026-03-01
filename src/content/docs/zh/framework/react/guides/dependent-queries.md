---
id: dependent-queries
title: 依赖查询
---

<!--
translation-source-path: framework/react/guides/dependent-queries.md
translation-source-ref: v5.90.3
translation-source-hash: 20c9113ab3f25481fb5298c6c36da2efd92525d0cbcf5d484073c70751864168
translation-status: translated
-->


## useQuery 依赖查询

依赖查询（或串行查询）依赖前一个查询先完成后才能执行。要实现这一点，只需使用 `enabled` 选项告诉查询何时可以运行：

[//]: # 'Example'

```tsx
// Get the user
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
})

const userId = user?.id

// Then get the user's projects
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // The query will not execute until the userId exists
  enabled: !!userId,
})
```

[//]: # 'Example'

`projects` 查询初始状态将是：

```tsx
status: 'pending'
isPending: true
fetchStatus: 'idle'
```

一旦 `user` 可用，`projects` 查询会被 `enabled`，随后状态会变为：

```tsx
status: 'pending'
isPending: true
fetchStatus: 'fetching'
```

当我们拿到 projects 后，状态会变为：

```tsx
status: 'success'
isPending: false
fetchStatus: 'idle'
```

## useQueries 依赖查询

动态并行查询 `useQueries` 也可以依赖前一个查询，方式如下：

[//]: # 'Example2'

```tsx
// Get the users ids
const { data: userIds } = useQuery({
  queryKey: ['users'],
  queryFn: getUsersData,
  select: (users) => users.map((user) => user.id),
})

// Then get the users messages
const usersMessages = useQueries({
  queries: userIds
    ? userIds.map((id) => {
        return {
          queryKey: ['messages', id],
          queryFn: () => getMessagesByUsers(id),
        }
      })
    : [], // if userIds is undefined, an empty array will be returned
})
```

[//]: # 'Example2'

**注意**：`useQueries` 返回的是**查询结果数组**。

## 关于性能的说明

依赖查询本质上会形成一种[请求瀑布](../request-waterfalls.md)，这会损害性能。假设两个查询耗时相同，串行执行而不是并行执行总是会花费两倍时间，在高延迟客户端上尤其明显。理想情况下，最好重构后端 API，使两个查询可以并行获取，不过这在实际中并不总是可行。

在上面的示例里，与其先获取 `getUserByEmail` 才能调用 `getProjectsByUser`，不如新增一个 `getProjectsByUserEmail` 查询来打平这个瀑布。
