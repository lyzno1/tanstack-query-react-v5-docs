---
id: mutations
title: 变更
---

<!--
translation-source-path: framework/react/guides/mutations.md
translation-source-ref: v5.90.3
translation-source-hash: bf19671447366fa67967ceeb74de580c4d7e3c3217280c65984a956b939702eb
translation-status: translated
-->


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

- `isIdle` 或 `status === 'idle'` - 变更当前空闲或处于刷新/重置状态
- `isPending` 或 `status === 'pending'` - 变更当前正在运行
- `isError` 或 `status === 'error'` - 变更遇到错误
- `isSuccess` 或 `status === 'success'` - 变更成功并且变更数据可用

除了这些主要状态之外，还可以根据变更的状态获得更多信息：

- `error` - 如果变更处于 `error` 状态，则可通过 `error` 属性获取错误。
- `data` - 如果变更处于 `success` 状态，则可通过 `data` 属性获取数据。

在上面的示例中，您还看到可以通过使用**单个变量或对象**调用`mutate`函数来将变量传递给变更函数。

即使只有变量，变更也不是那么特别，但是当与 `onSuccess` 选项、[Query Client 的 `invalidateQueries` 方法](../../../../reference/QueryClient.md#queryclientinvalidatequeries) 和 [Query Client 的 `setQueryData` 方法](../../../../reference/QueryClient.md#queryclientsetquerydata) 一起使用时，变更就成为一个非常强大的工具。

[//]: # 'Info1'

> 重要提示：`mutate` 函数是一个异步函数，这意味着您不能在 **React 16 及更早版本** 的事件回调中直接使用它。如果您需要访问`onSubmit`中的事件，则需要将`mutate`包装在另一个函数中。这是由于[React event pooling](https://reactjs.org/docs/legacy-event-pooling.html)。

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

有时您需要清除变更请求的`error` 或`data`。为此，您可以使用 `reset` 函数来处理此问题：

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

`useMutation` 附带了一些辅助选项，可以在变更生命周期的任何阶段快速轻松地产生副作用。这些对于 [invalidating and refetching queries after mutations](../invalidations-from-mutations.md) 甚至 [optimistic updates](../optimistic-updates.md) 都很有用

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

当在任何回调函数中返回一个Promise时，在调用下一个回调之前将首先等待它：

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

您可能会发现，在调用 `mutate` 时，除了 `useMutation` 上定义的回调之外，您还想**触发额外的回调**。这可用于触发特定于组件的副作用。为此，您可以在变更变量之后向 `mutate` 函数提供任何相同的回调选项。支持的选项包括：`onSuccess`、`onError` 和`onSettled`。请记住，如果您的组件在变更完成之前卸载，这些额外的回调将不会运行。

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

当涉及到连续变更时，`onSuccess`、`onError` 和 `onSettled` 回调的处理略有不同。当传递给 `mutate` 函数时，它们只会被触发_一次_并且仅当组件仍然安装时。这是因为每次调用 `mutate` 函数时，变更观察器都会被删除并重新订阅。相反，`useMutation` 处理程序为每个 `mutate` 调用执行。

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

使用 `mutateAsync` 而不是 `mutate` 来获取 Promise，该 Promise 会在成功时 resolve 或抛出错误。例如，这可用于组合副作用。

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

## 持续变更

如果需要，可以将变更持久保存到存储中，并在以后恢复。这可以通过水化函数来完成：

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

### 持续离线变更

如果您使用 [persistQueryClient plugin](../../plugins/persistQueryClient.md) 保留离线变更，则重新加载页面时无法恢复变更，除非您提供默认变更函数。

这是技术限制。当持久化到外部存储时，仅持久化变更状态，因为函数无法序列化。水合后，触发变更的组件可能不会被安装，因此调用`resumePausedMutations`可能会产生错误：`No mutationFn found`。

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

我们还有一个广泛的[offline example](../../examples/offline)，涵盖查询和变更。

## 变更范围

默认情况下，所有变更都是并行运行的 - 即使您多次调用同一变更的`.mutate()`。可以为变更赋予 `scope` 和 `id` 以避免这种情况。具有相同 `scope.id` 的所有变更都将串行运行，这意味着当它们被触发时，如果该范围内已经有正在进行的变更，它们将以 `isPaused: true` 状态开始。他们将被放入队列中，一旦到达队列时间就会自动恢复。

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

有关变更的更多信息，请查看[#12: Mastering Mutations in React Query](../../community/tkdodos-blog.md#12-mastering-mutations-in-react-query)
社区资源。

[//]: # 'Materials'
