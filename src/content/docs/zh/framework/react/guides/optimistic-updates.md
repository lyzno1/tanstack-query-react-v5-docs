---
id: optimistic-updates
title: 乐观的更新
---

<!--
translation-source-path: framework/react/guides/optimistic-updates.md
translation-source-ref: v5.90.3
translation-source-hash: 15bc398ce50a602b8447683d30933dba4f3d9c391ba13ccc4117eb006b102b71
translation-status: translated
-->


React Query 提供了两种在变更完成之前乐观更新 UI 的方法。您可以使用 `onMutate` 选项直接更新缓存，也可以利用返回的 `variables` 从 `useMutation` 结果更新您的 UI。

## 通过用户界面

这是更简单的变体，因为它不直接与缓存交互。

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

然后您将可以访问`addTodoMutation.variables`，其中包含添加的待办事项。在呈现查询的 UI 列表中，您可以在变更 `isPending` 时将另一个项目附加到列表中：

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

只要变更处于待处理状态，我们就会使用不同的 `opacity` 渲染临时项目。完成后，该项目将自动不再渲染。鉴于重新获取成功，我们应该将该项目视为列表中的“正常项目”。

如果变更错误，该物品也会消失。但如果我们愿意，我们可以通过检查变更的 `isError` 状态来继续显示它。 `variables` 在变更错误时不会被清除，因此我们仍然可以访问它们，甚至可能显示重试按钮：

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

如果变更和查询位于同一组件中，则此方法非常有效。但是，您还可以通过专用的 `useMutationState` Hook访问其他组件中的所有变更。它最好与`mutationKey`结合使用：

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

`variables` 将是 `Array`，因为可能有多个变更同时运行。如果我们需要项目的唯一密钥，我们也可以选择`mutation.state.submittedAt`。这甚至可以让显示并发乐观更新变得轻而易举。

## 通过缓存

当您在执行变更之前乐观地更新状态时，变更有可能会失败。在大多数失败情况下，您只需触发乐观查询的重新获取即可将它们恢复到真实的服务器状态。但在某些情况下，重新获取可能无法正常工作，并且变更错误可能代表某种类型的服务器问题，无法重新获取。在这种情况下，您可以选择回滚更新。

为此，`useMutation` 的`onMutate` 处理程序选项允许您返回一个值，该值稍后将作为最后一个参数传递给`onError` 和`onSettled` 处理程序。在大多数情况下，传递回滚函数是最有用的。

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

如果您愿意，还可以使用 `onSettled` 函数代替单独的 `onError` 和 `onSuccess` 处理程序：

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

如果您只有一个地方应该显示乐观结果，那么使用 `variables` 并直接更新 UI 是一种需要更少代码并且通常更容易推理的方法。例如，您根本不需要处理回滚。

但是，如果屏幕上有多个位置需要了解更新，则直接操作缓存将自动为您处理此问题。

[//]: # 'Materials'

## 进一步阅读

请查看社区资源以获取有关 [Concurrent Optimistic Updates](../../community/tkdodos-blog.md#29-concurrent-optimistic-updates-in-react-query) 的指南。

[//]: # 'Materials'
