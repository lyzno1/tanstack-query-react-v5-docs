---
id: exhaustive-deps
title: Exhaustive dependencies for query keys
---

<!--
translation-source-path: eslint/exhaustive-deps.md
translation-source-ref: v5.90.3
translation-source-hash: 9ea85b5cf98ee83c1976ecb6b83071ad7d8012ef09e1fce6f2e5402371f30f9e
translation-status: translated
-->


查询键应被视为查询函数的依赖数组：凡是在 `queryFn` 内使用到的变量，都应该添加到查询键中。
这样可以确保查询独立缓存，并在变量变化时自动重新获取查询。

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
useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => api.getTodo(todoId),
})

const todoQueries = {
  detail: (id) => ({ queryKey: ['todo', id], queryFn: () => api.getTodo(id) }),
}
```

## 何时不该使用

如果你不关心查询键规则，就不需要使用此规则。

## 属性

- [x] ✅ Recommended
- [x] 🔧 Fixable
