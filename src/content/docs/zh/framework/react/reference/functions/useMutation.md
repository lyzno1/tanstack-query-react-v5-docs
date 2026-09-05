---
id: useMutation
title: useMutation
redirect_from:
  - framework/react/reference/useMutation
---

```ts
function useMutation<TData, TError, TVariables, TOnMutateResult>(options, queryClient?): UseMutationResult<TData, TError, TVariables, TOnMutateResult>;
```

定义于： [react-query/src/useMutation.ts:191](https://github.com/TanStack/query/blob/main/packages/react-query/src/useMutation.ts#L191)

与查询不同，变更通常用于创建、更新或删除数据，或执行服务端副作用。`useMutation` 就是用于此目的的 Hook。

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = `Error`

### TVariables

`TVariables` = `void`

### TOnMutateResult

`TOnMutateResult` = `unknown`

## 参数

### options

[`UseMutationOptions`](../interfaces/UseMutationOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

要使用的 [UseMutationOptions](../interfaces/UseMutationOptions.md)，即所有可以传给 `useMutation` 的选项。

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

[`UseMutationResult`](../type-aliases/UseMutationResult.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

`mutate` 和 `mutateAsync` 还接受第二个参数，用于为每次调用传入 `onSuccess`、`onError`、`onSettled`
回调。这样可以在调用处触发副作用（例如导航），而不必将它们耦合到共享的变更定义中。Hook 级回调
（通过 `options` 传入）会对每次变更触发；每次调用各自的回调只会对最近一次调用触发，并且仅在组件仍然挂载时触发——
如果组件在变更结束前卸载，订阅会被移除，这些回调也不会触发。

## 另请参阅

使用 [mutationOptions](mutationOptions.md) 在多个 `useMutation` 调用处共享这些选项，或在其他位置
通过 `mutationKey` 查找该变更（例如使用 `useMutationState`）。

## 示例

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodo() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return (
    <button
      onClick={() =>
        addMutation.mutate('Item', {
          onError: (error) => console.error('添加项目失败：', error),
        })
      }
    >
      添加
    </button>
  )
}
```

渲染变更自身的状态，而不只是触发变更：
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodo() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return (
    <div>
      {addMutation.isPending ? (
        '正在添加待办事项……'
      ) : (
        <>
          {addMutation.isError ? (
            <div>发生错误：{addMutation.error.message}</div>
          ) : null}
          <button onClick={() => addMutation.mutate('Item')}>添加</button>
        </>
      )}
    </div>
  )
}
```

通过 `onMutate` 进行乐观更新，并在 `onError` 时回滚：
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodo() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Array<string>>(['todos'])

      queryClient.setQueryData<Array<string>>(['todos'], (old) => [
        ...(old ?? []),
        newTodo,
      ])

      // 如果变更失败，此值会作为 `onMutateResult` 传给 `onError`。
      return { previousTodos }
    },
    onError: (_err, _newTodo, onMutateResult) => {
      queryClient.setQueryData(['todos'], onMutateResult?.previousTodos)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <button onClick={() => addMutation.mutate('Item')}>添加</button>
  )
}
```

每次调用 `mutate` 时传入的回调只会对最后一次调用触发；而 `mutateAsync` 会为每次调用返回一个
Promise，因此可以等待所有调用完成：
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodos() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  async function handleAddAll(todos: Array<string>) {
    try {
      await Promise.all(todos.map((todo) => addMutation.mutateAsync(todo)))
    } catch (error) {
      console.error('添加待办事项失败：', error)
    }
  }

  return (
    <button onClick={() => handleAddAll(['Todo 1', 'Todo 2', 'Todo 3'])}>
      全部添加
    </button>
  )
}
```

如果上述某些变更可能各自独立失败，并且希望知道具体哪些变更失败，而不是在第一个 Promise 被拒绝时
就丢失这些信息，请将 `Promise.all` 替换为 `Promise.allSettled`：
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodos() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  async function handleAddAll(todos: Array<string>) {
    const addResults = await Promise.allSettled(
      todos.map((todo) => addMutation.mutateAsync(todo)),
    )

    addResults.forEach((addResult, index) => {
      if (addResult.status === 'rejected') {
        console.error(`添加“${todos[index]}”失败：`, addResult.reason)
      }
    })
  }

  return (
    <button onClick={() => handleAddAll(['Todo 1', 'Todo 2', 'Todo 3'])}>
      全部添加
    </button>
  )
}
```
