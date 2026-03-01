---
id: quick-start
title: Quick Start
---

<!--
translation-source-path: framework/react/quick-start.md
translation-source-ref: v5.90.3
translation-source-hash: 875da51e7536106f3148361ff7a6b41ca412298d432d8e4fb96e4589a24533fc
translation-status: translated
-->


这段代码非常简要地展示了 React Query 的 3 个核心概念：

- [Queries](../guides/queries.md)
- [Mutations](../guides/mutations.md)
- [Query Invalidation](../guides/query-invalidation.md)

[//]: # 'Example'

如果你想看一个完整可运行的示例，请查看我们的 [simple StackBlitz example](../examples/simple)

```tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <ul>
        {query.data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```

[//]: # 'Example'

这三个概念构成了 React Query 大部分核心功能。后续文档会对这些核心概念逐一展开并深入说明。
