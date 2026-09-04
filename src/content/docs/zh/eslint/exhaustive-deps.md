---
id: exhaustive-deps
title: 完整声明查询键依赖项
---

<!--
translation-source-path: eslint/exhaustive-deps.md
translation-source-ref: main
translation-source-hash: fedcddd26fc3810150dc72c5475c600b5247b1d7f5f89fd483d7056b336242f8
translation-status: translated
-->


查询键应包含能够标识 `queryFn` 返回数据的可序列化值。
这样可以确保各个查询分别缓存，并在这些值发生变化时自动重新获取查询。

函数调用的目标不是查询键的依赖项。例如，`fetchTodoById(todoId)` 需要将 `todoId` 放入查询键，但不需要放入 `fetchTodoById`。嵌套回调中引用的值仍然是依赖项，因此 `promise.then(() => todoId)` 同样需要将 `todoId` 放入查询键。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/exhaustive-deps": "error" */

useQuery({
  queryKey: ['todo'],
  queryFn: () => api.getTodo(todoId),
})

const todoQueries = {
  detail: (id) => ({ queryKey: ['todo'], queryFn: () => api.getTodo(id) }),
}
```

此规则的**正确**代码示例：

```tsx
const Component = ({ todoId }) => {
  const todos = useTodos()
  useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => todos.getTodo(todoId),
  })
}
```

```tsx
const todos = createTodos()
const todoQueries = {
  detail: (id) => ({
    queryKey: ['todo', id],
    queryFn: () => todos.getTodo(id),
  }),
}
```

```tsx
// 配置 { allowlist: { types: ["Config"] }} 时
class Config { ... }
const Component = ({ todoId, config }: { todoId: string, config: Config }) => {
  useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => fetchTodo(todoId, config.baseUrl),
  })
}
```

### 选项

- `allowlist.variables`：检查依赖项时应忽略的变量名数组
- `allowlist.types`：检查依赖项时应忽略的 TypeScript 类型名称数组

```json
{
  "@tanstack/query/exhaustive-deps": [
    "error",
    {
      "allowlist": {
        "variables": ["api", "config"],
        "types": ["ApiClient", "Config"]
      }
    }
  ]
}
```

## 何时不该使用

如果你不关心查询键规则，就不需要使用此规则。

## 属性

- [x] ✅ Recommended
- [x] 🔧 Fixable
