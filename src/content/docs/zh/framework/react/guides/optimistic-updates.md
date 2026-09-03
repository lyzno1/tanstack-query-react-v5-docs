---
id: optimistic-updates
title: 乐观更新
---

<!--
translation-source-path: framework/react/guides/optimistic-updates.md
translation-source-ref: main
translation-source-hash: 0c32fabbe875f00ac62e7e1f70156e95e27eca0a8446b09005ca5faf6ec1ecc7
translation-status: translated
-->


React Query 提供了两种在变更完成之前乐观更新 UI 的方法。你可以使用 `onMutate` 选项直接更新缓存，也可以利用返回的 `variables` 从 `useMutation` 结果更新你的 UI。

## 通过用户界面

这种方式更简单，因为它不直接操作缓存。

[//]: # 'ExampleUI1'

```tsx
const addTodoMutation = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  // make sure to _return_ the Promise from the query invalidation
  // so that the mutation stays in `pending` state until the refetch is finished
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})

const { isPending, submittedAt, variables, mutate, isError } = addTodoMutation
```

[//]: # 'ExampleUI1'

随后可以通过 `addTodoMutation.variables` 取得正在添加的待办事项。在渲染查询结果的 UI 列表中，当变更处于 `isPending` 状态时，可以把这一项追加到列表：

[//]: # 'ExampleUI2'

```tsx
<ul>
  {todoQuery.items.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
  {isPending && <li style={{ opacity: 0.5 }}>{variables}</li>}
</ul>
```

[//]: # 'ExampleUI2'

只要变更仍处于 pending 状态，就会以不同的 `opacity` 渲染这条临时待办事项。变更完成后，
临时项会自动停止渲染；如果重新获取成功，同一项会以正常样式出现在列表中。

如果变更失败，该待办事项同样会消失。不过，可以通过检查变更的 `isError` 状态让它继续显示。
变更失败时不会清除 `variables`，因此仍可读取它，甚至可以显示一个重试按钮：

[//]: # 'ExampleUI3'

```tsx
{
  isError && (
    <li style={{ color: 'red' }}>
      {variables}
      <button onClick={() => mutate(variables)}>Retry</button>
    </li>
  )
}
```

[//]: # 'ExampleUI3'

### 如果变更和查询不在同一组件中

如果变更和查询位于同一组件中，这种方式非常合适。除此之外，还可以通过专用的
`useMutationState` Hook 访问其他组件中的变更状态。它最适合与 `mutationKey` 配合使用：

[//]: # 'ExampleUI4'

```tsx
// somewhere in your app
const { mutate } = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  mutationKey: ['addTodo'],
})

// access variables somewhere else
const variables = useMutationState<string>({
  filters: { mutationKey: ['addTodo'], status: 'pending' },
  select: (mutation) => mutation.state.variables,
})
```

[//]: # 'ExampleUI4'

`variables` 会是一个数组，因为可能有多个变更同时运行。如果需要为这些项目提供唯一键，
还可以选择 `mutation.state.submittedAt`。这样，展示并发乐观更新也会非常简单。

## 通过缓存

在执行变更前进行乐观更新时，变更可能会失败。大多数情况下，只需重新获取相关查询，
就能将乐观数据恢复为服务端的真实状态。但有时重新获取本身无法正常完成，例如变更错误来自某种服务端故障。
这时可以改为回滚更新。

为此，`useMutation` 的 `onMutate` 处理程序可以返回一个值，稍后该值会传给 `onError` 和
`onSettled` 处理程序。多数情况下，返回一个回滚函数最为实用。

### 添加新待办事项时更新待办事项列表

[//]: # 'Example'

```tsx
const queryClient = useQueryClient()

useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo, context) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await context.client.cancelQueries({ queryKey: ['todos'] })

    // Snapshot the previous value
    const previousTodos = context.client.getQueryData(['todos'])

    // Optimistically update to the new value
    context.client.setQueryData(['todos'], (old) => [...old, newTodo])

    // Return a result with the snapshotted value
    return { previousTodos }
  },
  // If the mutation fails,
  // use the result returned from onMutate to roll back
  onError: (err, newTodo, onMutateResult, context) => {
    context.client.setQueryData(['todos'], onMutateResult.previousTodos)
  },
  // Always refetch after error or success:
  onSettled: (data, error, variables, onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ['todos'] }),
})
```

[//]: # 'Example'

### 更新单个待办事项

[//]: # 'Example2'

```tsx
useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo, context) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await context.client.cancelQueries({ queryKey: ['todos', newTodo.id] })

    // Snapshot the previous value
    const previousTodo = context.client.getQueryData(['todos', newTodo.id])

    // Optimistically update to the new value
    context.client.setQueryData(['todos', newTodo.id], newTodo)

    // Return a result with the previous and new todo
    return { previousTodo, newTodo }
  },
  // If the mutation fails, use the result we returned above
  onError: (err, newTodo, onMutateResult, context) => {
    context.client.setQueryData(
      ['todos', onMutateResult.newTodo.id],
      onMutateResult.previousTodo,
    )
  },
  // Always refetch after error or success:
  onSettled: (newTodo, error, variables, onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ['todos', newTodo.id] }),
})
```

[//]: # 'Example2'

如果你愿意，还可以使用 `onSettled` 函数代替单独的 `onError` 和 `onSuccess` 处理程序：

[//]: # 'Example3'

```tsx
useMutation({
  mutationFn: updateTodo,
  // ...
  onSettled: async (newTodo, error, variables, onMutateResult, context) => {
    if (error) {
      // do something
    }
  },
})
```

[//]: # 'Example3'

## 什么时候用什么

如果乐观结果只需显示在一个位置，使用 `variables` 直接更新 UI 通常代码更少、也更容易理解。例如，你完全不必处理回滚。

但如果屏幕上的多个位置都需要感知这次更新，直接操作缓存就能自动同步这些位置。

[//]: # 'Materials'

## 进一步阅读

请参阅 TkDodo 的 [Concurrent Optimistic Updates](https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query) 指南。

[//]: # 'Materials'
