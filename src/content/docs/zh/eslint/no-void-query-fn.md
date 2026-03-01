---
id: no-void-query-fn
title: Disallow returning void from query functions
---

<!--
translation-source-path: eslint/no-void-query-fn.md
translation-source-ref: v5.90.3
translation-source-hash: 4fecc9433aef965fee18a7576bffeef66441e55cc8437c2ea91abb4c1c901d7d
translation-status: translated
-->


查询函数必须返回一个会被 TanStack Query 缓存的值。不返回值的函数（void 函数）可能导致意外行为，也常常意味着实现中存在错误。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/no-void-query-fn": "error" */

useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    await api.todos.fetch() // Function doesn't return the fetched data
  },
})
```

此规则的**正确**代码示例：

```tsx
/* eslint "@tanstack/query/no-void-query-fn": "error" */
useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const todos = await api.todos.fetch()
    return todos
  },
})
```

## 属性

- [x] ✅ Recommended
- [ ] 🔧 Fixable
