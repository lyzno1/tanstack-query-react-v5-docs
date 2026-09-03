---
id: prefer-query-options
title: 优先使用 queryOptions
---

<!--
translation-source-path: eslint/prefer-query-options.md
translation-source-ref: main
translation-source-hash: f7438a59e80d52799effd7d795181e7f1c44b03ccbd99167c627235cfdfe4134
translation-status: translated
-->


将 `queryKey` 和 `queryFn` 分开定义时，如果意外地为同一个查询键使用了多个 `queryFn`，可能会引发意料之外的运行时问题。用 `queryOptions`（或 `infiniteQueryOptions`）将二者包装在一起，可以让查询键和查询函数就近定义，从而使查询更加安全，也更容易复用。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/prefer-query-options": "error" */

function Component({ id }) {
  const query = useQuery({
    queryKey: ['get', id],
    queryFn: () => Api.get(`/foo/${id}`),
  })
  // ...
}
```

```tsx
/* eslint "@tanstack/query/prefer-query-options": "error" */

function useFooQuery(id) {
  return useQuery({
    queryKey: ['get', id],
    queryFn: () => Api.get(`/foo/${id}`),
  })
}
```

此规则的**正确**代码示例：

```tsx
/* eslint "@tanstack/query/prefer-query-options": "error" */

function getFooOptions(id) {
  return queryOptions({
    queryKey: ['get', id],
    queryFn: () => Api.get(`/foo/${id}`),
  })
}

function Component({ id }) {
  const query = useQuery(getFooOptions(id))
  // ...
}
```

```tsx
/* eslint "@tanstack/query/prefer-query-options": "error" */

function getFooOptions(id) {
  return queryOptions({
    queryKey: ['get', id],
    queryFn: () => Api.get(`/foo/${id}`),
  })
}

function useFooQuery(id) {
  return useQuery({ ...getFooOptions(id), select: (data) => data.foo })
}
```

该规则还要求复用 `queryOptions` 结果中的 `queryKey`，而不是在 `QueryClient` 方法或过滤器中手动编写查询键。

此规则下**错误**的 `queryKey` 引用示例：

```tsx
/* eslint "@tanstack/query/prefer-query-options": "error" */

function todoOptions(id) {
  return queryOptions({
    queryKey: ['todo', id],
    queryFn: () => api.getTodo(id),
  })
}

function Component({ id }) {
  const queryClient = useQueryClient()
  return queryClient.getQueryData(['todo', id])
}
```

```tsx
/* eslint "@tanstack/query/prefer-query-options": "error" */

function todoOptions(id) {
  return queryOptions({
    queryKey: ['todo', id],
    queryFn: () => api.getTodo(id),
  })
}

function Component({ id }) {
  const queryClient = useQueryClient()
  return queryClient.invalidateQueries({ queryKey: ['todo', id] })
}
```

此规则下**正确**的 `queryKey` 引用示例：

```tsx
/* eslint "@tanstack/query/prefer-query-options": "error" */

function todoOptions(id) {
  return queryOptions({
    queryKey: ['todo', id],
    queryFn: () => api.getTodo(id),
  })
}

function Component({ id }) {
  const queryClient = useQueryClient()
  return queryClient.getQueryData(todoOptions(id).queryKey)
}
```

```tsx
/* eslint "@tanstack/query/prefer-query-options": "error" */

function todoOptions(id) {
  return queryOptions({
    queryKey: ['todo', id],
    queryFn: () => api.getTodo(id),
  })
}

function Component({ id }) {
  const queryClient = useQueryClient()
  return queryClient.invalidateQueries({ queryKey: todoOptions(id).queryKey })
}
```

## 何时不该使用

如果你不想在代码库中强制使用 `queryOptions`，则不需要此规则。

## 属性

- [x] ✅ Recommended (strict)
- [ ] 🔧 Fixable
