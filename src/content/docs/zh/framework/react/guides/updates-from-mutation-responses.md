---
id: updates-from-mutation-responses
title: 从变更响应更新数据
---

<!--
translation-source-path: framework/react/guides/updates-from-mutation-responses.md
translation-source-ref: v5.90.3
translation-source-hash: 1430feeac806246d3a839e3b3b16db1e573db888c877320796d2b41c9934d1d8
translation-status: translated
-->


在处理会**更新**服务端对象的变更时，新的对象通常会自动包含在变更响应里。相比重新获取该项的查询并额外浪费一次网络请求，我们可以直接利用变更函数返回的对象，通过 [Query Client 的 `setQueryData`](../../../../reference/QueryClient.md#queryclientsetquerydata) 立即更新现有查询数据：

[//]: # 'Example'

```tsx
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: editTodo,
  onSuccess: (data) => {
    queryClient.setQueryData(['todo', { id: 5 }], data)
  },
})

mutation.mutate({
  id: 5,
  name: 'Do the laundry',
})

// The query below will be updated with the response from the
// successful mutation
const { status, data, error } = useQuery({
  queryKey: ['todo', { id: 5 }],
  queryFn: fetchTodoById,
})
```

[//]: # 'Example'

你可能希望把 `onSuccess` 逻辑绑定到一个可复用的变更里，此时可以创建如下自定义 hook：

[//]: # 'Example2'

```tsx
const useMutateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editTodo,
    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['todo', { id: variables.id }], data)
    },
  })
}
```

[//]: # 'Example2'

## 不可变性

通过 `setQueryData` 更新数据时，必须采用_不可变_方式。**不要**试图通过原地修改从缓存中取出的数据来直接写缓存。它一开始可能看起来可行，但后续很容易引发隐蔽 bug。

[//]: # 'Example3'

```tsx
queryClient.setQueryData(['posts', { id }], (oldData) => {
  if (oldData) {
    // ❌ do not try this
    oldData.title = 'my new post title'
  }
  return oldData
})

queryClient.setQueryData(
  ['posts', { id }],
  // ✅ this is the way
  (oldData) =>
    oldData
      ? {
          ...oldData,
          title: 'my new post title',
        }
      : oldData,
)
```

[//]: # 'Example3'
