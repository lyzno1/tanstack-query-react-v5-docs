---
id: mutations
title: 变更
---

与查询不同，变更通常用于创建/更新/删除数据或执行服务器副作用。为此，TanStack Query 导出 `useMutation` Hook。

以下是向服务器添加新待办事项的变更示例：

[//]: # 'Example'

```tsx
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
  })

  return (
    <div>
      {mutation.isPending ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Do Laundry' })
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  )
}
```

[//]: # 'Example'

变更在任何给定时刻只能处于以下状态之一：

- `isIdle` 或 `status === 'idle'` - 变更当前空闲或处于初始/重置状态
- `isPending` 或 `status === 'pending'` - 变更当前正在运行
- `isError` 或 `status === 'error'` - 变更遇到错误
- `isSuccess` 或 `status === 'success'` - 变更成功并且变更数据可用

除了这些主要状态之外，还可以根据变更的状态获得更多信息：

- `error` - 如果变更处于 `error` 状态，则可通过 `error` 属性获取错误。
- `data` - 如果变更处于 `success` 状态，则可通过 `data` 属性获取数据。

在上面的示例中，你还可以看到：调用 `mutate` 函数时，可通过**单个变量或对象**向变更函数传入变量。

仅仅能传入变量还不足以让变更显得特别；但当它与 `onSuccess` 选项、[Query Client 的 `invalidateQueries` 方法](../../../reference/QueryClient.md#queryclientinvalidatequeries)以及 [Query Client 的 `setQueryData` 方法](../../../reference/QueryClient.md#queryclientsetquerydata)结合使用时，就会成为非常强大的工具。

[//]: # 'Info1'

> 重要：`mutate` 是异步函数，因此在 **React 16 及更早版本**中，不能直接将它用作事件回调。如果需要在 `onSubmit` 中访问事件，必须再用一层函数包裹 `mutate`。这是由 [React 事件池](https://reactjs.org/docs/legacy-event-pooling.html)导致的。

[//]: # 'Info1'
[//]: # 'Example2'

```tsx
// This will not work in React 16 and earlier
const CreateTodo = () => {
  const mutation = useMutation({
    mutationFn: (event) => {
      event.preventDefault()
      return fetch('/api', new FormData(event.target))
    },
  })

  return <form onSubmit={mutation.mutate}>...</form>
}

// This will work
const CreateTodo = () => {
  const mutation = useMutation({
    mutationFn: (formData) => {
      return fetch('/api', formData)
    },
  })
  const onSubmit = (event) => {
    event.preventDefault()
    mutation.mutate(new FormData(event.target))
  }

  return <form onSubmit={onSubmit}>...</form>
}
```

[//]: # 'Example2'

## 重置变更状态

有时你需要清除变更请求的 `error` 或 `data`。此时可以使用 `reset` 函数：

[//]: # 'Example3'

```tsx
const CreateTodo = () => {
  const [title, setTitle] = useState('')
  const mutation = useMutation({ mutationFn: createTodo })

  const onCreateTodo = (e) => {
    e.preventDefault()
    mutation.mutate({ title })
  }

  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  )
}
```

[//]: # 'Example3'

## 变更副作用

`useMutation` 提供了一些辅助选项，使你可以在变更生命周期的任何阶段方便地执行副作用。无论是[在变更后使查询失效并重新获取](./invalidations-from-mutations.md)，还是进行[乐观更新](./optimistic-updates.md)，这些选项都很有用。

[//]: # 'Example4'

```tsx
useMutation({
  mutationFn: addTodo,
  onMutate: (variables, context) => {
    // A mutation is about to happen!

    // Optionally return a result containing data to use when for example rolling back
    return { id: 1 }
  },
  onError: (error, variables, onMutateResult, context) => {
    // An error happened!
    console.log(`rolling back optimistic update with id ${onMutateResult.id}`)
  },
  onSuccess: (data, variables, onMutateResult, context) => {
    // Boom baby!
  },
  onSettled: (data, error, variables, onMutateResult, context) => {
    // Error or success... doesn't matter!
  },
})
```

[//]: # 'Example4'

当任一回调函数返回 Promise 时，会先等待该 Promise 完成，再调用下一个回调：

[//]: # 'Example5'

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: async () => {
    console.log("I'm first!")
  },
  onSettled: async () => {
    console.log("I'm second!")
  },
})
```

[//]: # 'Example5'

调用 `mutate` 时，你可能希望在 `useMutation` 定义的回调之外，再**触发额外回调**。这很适合用于执行特定于组件的副作用。你可以在变更变量之后，向 `mutate` 传入相同的回调选项：`onSuccess`、`onError` 和 `onSettled`。请注意，如果组件在变更完成前已经卸载，这些额外回调将不会执行。

[//]: # 'Example6'

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: (data, variables, onMutateResult, context) => {
    // I will fire first
  },
  onError: (error, variables, onMutateResult, context) => {
    // I will fire first
  },
  onSettled: (data, error, variables, onMutateResult, context) => {
    // I will fire first
  },
})

mutate(todo, {
  onSuccess: (data, variables, onMutateResult, context) => {
    // I will fire second!
  },
  onError: (error, variables, onMutateResult, context) => {
    // I will fire second!
  },
  onSettled: (data, error, variables, onMutateResult, context) => {
    // I will fire second!
  },
})
```

[//]: # 'Example6'

### 连续变更

对于连续变更，`onSuccess`、`onError` 和 `onSettled` 回调的行为略有不同。将这些回调传给 `mutate` 时，它们只会触发_一次_，且前提是组件仍处于挂载状态。这是因为每次调用 `mutate` 时，变更观察者都会先移除再重新订阅。相比之下，定义在 `useMutation` 上的处理函数会针对每次 `mutate` 调用执行。

> 请注意，传递给 `useMutation` 的 `mutationFn` 很可能是异步的。在这种情况下，完成变更的顺序可能与 `mutate` 函数调用的顺序不同。

[//]: # 'Example7'

```tsx
useMutation({
  mutationFn: addTodo,
  onSuccess: (data, variables, onMutateResult, context) => {
    // Will be called 3 times
  },
})

const todos = ['Todo 1', 'Todo 2', 'Todo 3']
todos.forEach((todo) => {
  mutate(todo, {
    onSuccess: (data, variables, onMutateResult, context) => {
      // Will execute only once, for the last mutation (Todo 3),
      // regardless which mutation resolves first
    },
  })
})
```

[//]: # 'Example7'

## Promise

使用 `mutateAsync` 而不是 `mutate` 来获取 Promise。该 Promise 会在成功时返回结果，在失败时抛出错误。例如，这可用于组合副作用。

[//]: # 'Example8'

```tsx
const mutation = useMutation({ mutationFn: addTodo })

try {
  const todo = await mutation.mutateAsync(todo)
  console.log(todo)
} catch (error) {
  console.error(error)
} finally {
  console.log('done')
}
```

[//]: # 'Example8'

## 重试

默认情况下，TanStack Query 不会在出错时重试变更，但可以使用 `retry` 选项：

[//]: # 'Example9'

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  retry: 3,
})
```

[//]: # 'Example9'

如果由于设备离线而导致变更失败，则当设备重新连接时，将以相同的顺序重试变更。

## 持久化变更

如果需要，可以将变更持久保存到存储中，并在以后恢复。这可以通过水合函数来完成：

[//]: # 'Example10'

```tsx
const queryClient = new QueryClient()

// Define the "addTodo" mutation
queryClient.setMutationDefaults(['addTodo'], {
  mutationFn: addTodo,
  onMutate: async (variables, context) => {
    // Cancel current queries for the todos list
    await context.client.cancelQueries({ queryKey: ['todos'] })

    // Create optimistic todo
    const optimisticTodo = { id: uuid(), title: variables.title }

    // Add optimistic todo to todos list
    context.client.setQueryData(['todos'], (old) => [...old, optimisticTodo])

    // Return a result with the optimistic todo
    return { optimisticTodo }
  },
  onSuccess: (result, variables, onMutateResult, context) => {
    // Replace optimistic todo in the todos list with the result
    context.client.setQueryData(['todos'], (old) =>
      old.map((todo) =>
        todo.id === onMutateResult.optimisticTodo.id ? result : todo,
      ),
    )
  },
  onError: (error, variables, onMutateResult, context) => {
    // Remove optimistic todo from the todos list
    context.client.setQueryData(['todos'], (old) =>
      old.filter((todo) => todo.id !== onMutateResult.optimisticTodo.id),
    )
  },
  retry: 3,
})

// Start mutation in some component:
const mutation = useMutation({ mutationKey: ['addTodo'] })
mutation.mutate({ title: 'title' })

// If the mutation has been paused because the device is for example offline,
// Then the paused mutation can be dehydrated when the application quits:
const state = dehydrate(queryClient)

// The mutation can then be hydrated again when the application is started:
hydrate(queryClient, state)

// Resume the paused mutations:
queryClient.resumePausedMutations()
```

[//]: # 'Example10'
[//]: # 'PersistOfflineIntro'

### 持久化离线变更

如果你使用 [`persistQueryClient` 插件](../plugins/persistQueryClient.md)持久化离线变更，除非提供默认变更函数，否则页面重新加载后将无法恢复这些变更。

[//]: # 'PersistOfflineIntro'

这是一项技术限制。持久化到外部存储时，只能保存变更的状态，因为函数无法序列化。水合后，原本触发变更的组件可能并未挂载，因此调用 `resumePausedMutations` 可能会抛出 `No mutationFn found` 错误。

[//]: # 'Example11'

```tsx
const persister = createSyncStoragePersister({
  storage: window.localStorage,
})
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

// we need a default mutation function so that paused mutations can resume after a page reload
queryClient.setMutationDefaults(['todos'], {
  mutationFn: ({ id, data }) => {
    return api.updateTodo(id, data)
  },
})

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations()
      }}
    >
      <RestOfTheApp />
    </PersistQueryClientProvider>
  )
}
```

[//]: # 'Example11'
[//]: # 'OfflineExampleLink'

我们还提供了一个完整的[离线示例](../examples/offline)，其中同时涵盖查询和变更。

[//]: # 'OfflineExampleLink'

## 变更范围

默认情况下，所有变更都会并行执行，即使你对同一变更多次调用 `.mutate()` 也是如此。你可以为变更指定带 `id` 的 `scope` 来避免这种情况。所有 `scope.id` 相同的变更都会串行执行。触发时，如果同一 `scope` 中已有变更正在进行，后续变更将从 `isPaused: true` 状态开始，并被放入队列；轮到它们时会自动恢复执行。

[//]: # 'ExampleScopes'

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  scope: {
    id: 'todo',
  },
})
```

[//]: # 'ExampleScopes'
[//]: # 'Materials'

## 进一步阅读

如需了解更多有关变更的内容，请阅读 TkDodo 的文章 [Mastering Mutations in React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query)。

[//]: # 'Materials'
