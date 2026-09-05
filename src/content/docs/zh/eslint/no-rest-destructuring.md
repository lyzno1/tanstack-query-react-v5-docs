---
id: no-rest-destructuring
title: 禁止对查询结果使用对象剩余解构
---

在查询结果上使用对象剩余解构会自动订阅查询结果的每一个字段，这可能导致不必要的重新渲染。
此规则可确保你只订阅真正需要的字段。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/no-rest-destructuring": "warn" */

const useTodos = () => {
  const { data: todos, ...rest } = useQuery({
    queryKey: ['todos'],
    queryFn: () => api.getTodos(),
  })
  return { todos, ...rest }
}
```

此规则的**正确**代码示例：

```tsx
const todosQuery = useQuery({
  queryKey: ['todos'],
  queryFn: () => api.getTodos(),
})

// 普通的对象解构没有问题
const { data: todos } = todosQuery
```

启用[类型感知 lint](https://typescript-eslint.io/getting-started/typed-linting/) 后，该规则还会标记对返回 TanStack Query 结果的自定义 Hook 使用剩余解构的情况。

## 何时不该使用

如果你手动设置了 `notifyOnChangeProps` 选项，可以关闭此规则。
由于你没有使用属性追踪查询，因此需要自行指定哪些属性应触发重新渲染。

## 属性

- [x] ✅ 推荐
- [ ] 🔧 可自动修复
