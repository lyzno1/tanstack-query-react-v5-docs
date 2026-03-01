---
id: invalidations-from-mutations
title: 由变更触发的失效
---

<!--
translation-source-path: framework/react/guides/invalidations-from-mutations.md
translation-source-ref: v5.90.3
translation-source-hash: f49fac522e92585ddd0f6c142d543fbd4bc56b5d8c2d397c2703c8c01b90ea17
translation-status: translated
-->


让查询失效只是完成了一半，另一半是知道应该在**什么时候**让它失效。通常，当应用中的某个变更成功后，很可能会有相关查询需要失效，甚至可能要重新获取，以反映这次变更带来的新数据。

例如，假设我们有一个用于提交新 todo 的变更：

[//]: # 'Example'

```tsx
const mutation = useMutation({ mutationFn: postTodo })
```

[//]: # 'Example'

当 `postTodo` 变更成功时，我们通常希望所有 `todos` 查询失效，并可能重新获取以展示新增 todo。你可以通过 `useMutation` 的 `onSuccess` 选项和客户端的 `invalidateQueries` 函数来实现：

[//]: # 'Example2'

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// When this mutation succeeds, invalidate any queries with the `todos` or `reminders` query key
const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: async () => {
    // If you're invalidating a single query
    await queryClient.invalidateQueries({ queryKey: ['todos'] })

    // If you're invalidating multiple queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['todos'] }),
      queryClient.invalidateQueries({ queryKey: ['reminders'] }),
    ])
  },
})
```

[//]: # 'Example2'

在 `onSuccess` 中返回 Promise，可以确保在变更被完全标记为完成前数据已更新（即在 `onSuccess` 完成前，`isPending` 会保持 `true`）。

[//]: # 'Example2'

你可以使用 [`useMutation` hook](../mutations.md) 提供的任一回调来挂接失效逻辑。

[//]: # 'Materials'

## 延伸阅读

关于“在变更后自动让查询失效”的技巧，请查看社区资源中的 [Automatic Query Invalidation after Mutations](../../community/tkdodos-blog.md#25-automatic-query-invalidation-after-mutations)。

[//]: # 'Materials'
