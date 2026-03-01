---
id: query-keys
title: 查询键
---

<!--
translation-source-path: framework/react/guides/query-keys.md
translation-source-ref: v5.90.3
translation-source-hash: e02b6d0101431f3a4221fefa0a4bbc331f7d940c4779cf0c8b15492395fe5a72
translation-status: translated
-->


TanStack Query 的核心机制是基于查询键来管理查询缓存。查询键在顶层必须是一个数组，它可以很简单（例如只含一个字符串），也可以很复杂（例如包含多个字符串和嵌套对象）。只要查询键能被 `JSON.stringify` 序列化，并且**对查询数据唯一**，你就可以使用它。

## 简单查询键

最简单的键形式是只包含常量值的数组。这个格式适用于：

- 通用列表/索引资源
- 非层级资源

[//]: # 'Example'

```tsx
// A list of todos
useQuery({ queryKey: ['todos'], ... })

// Something else, whatever!
useQuery({ queryKey: ['something', 'special'], ... })
```

[//]: # 'Example'

## 带变量的数组键

当一个查询需要更多信息来唯一描述其数据时，可以使用“字符串 + 任意数量可序列化对象”的数组。这个格式适用于：

- 层级或嵌套资源
  - 常见做法是传入 ID、索引或其他基础类型来唯一标识项
- 带额外参数的查询
  - 常见做法是传入一个包含额外选项的对象

[//]: # 'Example2'

```tsx
// An individual todo
useQuery({ queryKey: ['todo', 5], ... })

// An individual todo in a "preview" format
useQuery({ queryKey: ['todo', 5, { preview: true }], ...})

// A list of todos that are "done"
useQuery({ queryKey: ['todos', { type: 'done' }], ... })
```

[//]: # 'Example2'

## 查询键会被确定性哈希

这意味着无论对象内键的顺序如何，下面这些查询都被视为等价：

[//]: # 'Example3'

```tsx
useQuery({ queryKey: ['todos', { status, page }], ... })
useQuery({ queryKey: ['todos', { page, status }], ...})
useQuery({ queryKey: ['todos', { page, status, other: undefined }], ... })
```

[//]: # 'Example3'

但下面这些查询键并不相等，因为数组项顺序会影响结果。

[//]: # 'Example4'

```tsx
useQuery({ queryKey: ['todos', status, page], ... })
useQuery({ queryKey: ['todos', page, status], ...})
useQuery({ queryKey: ['todos', undefined, page, status], ...})
```

[//]: # 'Example4'

## 如果查询函数依赖变量，请把它放进查询键

查询键用于唯一描述它要获取的数据，因此应包含查询函数中会**变化**的变量。例如：

[//]: # 'Example5'

```tsx
function Todos({ todoId }) {
  const result = useQuery({
    queryKey: ['todos', todoId],
    queryFn: () => fetchTodoById(todoId),
  })
}
```

[//]: # 'Example5'

请注意，查询键也会充当查询函数的依赖项。把依赖变量加入查询键，可以确保查询被独立缓存，并且变量变化时会自动重新获取查询（取决于你的 `staleTime` 配置）。更多信息和示例请参见 [exhaustive-deps](../../../../eslint/exhaustive-deps.md)。

[//]: # 'Materials'

## 延伸阅读

关于在大型应用中组织查询键的建议，可阅读社区资源中的 [Effective React Query Keys](../../community/tkdodos-blog.md#8-effective-react-query-keys)，以及 [Query Key Factory Package](../../community/community-projects.md#query-key-factory)。

[//]: # 'Materials'
