---
id: no-rest-destructuring
title: Disallow object rest destructuring on query results
---

<!--
translation-source-path: eslint/no-rest-destructuring.md
translation-source-ref: v5.90.3
translation-source-hash: c75c9a3a0e0a88e88a5f17c59c9bedb1f716be4215e5103300fdd730f2a91f14
translation-status: translated
-->


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

// normal object destructuring is fine
const { data: todos } = todosQuery
```

## 何时不该使用

如果你手动设置了 `notifyOnChangeProps` 选项，可以关闭此规则。
由于你未使用 tracked queries，需要自行指定哪些属性会触发重新渲染。

## 属性

- [x] ✅ Recommended
- [ ] 🔧 Fixable
