---
id: render-optimizations
title: 渲染优化
---

<!--
translation-source-path: framework/react/guides/render-optimizations.md
translation-source-ref: v5.90.3
translation-source-hash: a7752c4c95d36ab4b180446b1b9592327287c8b1ad2a854b00254e5b5023f701
translation-status: translated
-->


React Query 会自动应用一些优化，确保组件只在真正需要时才重新渲染。主要通过以下机制实现：

## 结构共享

React Query 使用一种称为“结构共享（structural sharing）”的技术，尽可能在重新渲染之间保留引用不变。网络获取到的数据通常在 JSON 解析后会得到全新引用，但如果数据**没有**变化，React Query 会保留原引用；如果只变更了部分字段，它会保留未变化的部分，只替换变化的部分。

> 注意：该优化仅在 `queryFn` 返回 JSON 兼容数据时生效。你可以在全局或单个查询上设置 `structuralSharing: false` 来关闭它，也可以传入函数实现自定义结构共享。

### 引用标识

`useQuery`、`useInfiniteQuery`、`useMutation` 返回的顶层对象，以及 `useQueries` 返回的数组，**不是引用稳定的**。它们在每次渲染时都会是新引用。但这些 hooks 返回的 `data` 属性会尽可能保持稳定。

## 跟踪属性

只有当 `useQuery` 返回的某个属性被实际“使用”时，React Query 才会触发重新渲染。这是通过 [Proxy 对象](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 实现的。这样可以避免很多不必要的重渲染，例如 `isFetching` 或 `isStale` 可能经常变化，但组件并未使用它们。

你可以在全局或单个查询上手动设置 `notifyOnChangeProps` 来定制该行为。如果想关闭这个特性，可设置 `notifyOnChangeProps: 'all'`。

> 注意：访问属性（无论是解构还是直接读取）都会触发 proxy 的 get trap。如果使用对象 rest 解构，会禁用这项优化。我们提供了 [lint 规则](../../../../eslint/no-rest-destructuring.md) 来避免这个陷阱。

## `select`

你可以使用 `select` 选项选择组件真正需要订阅的数据子集。这对于高性能数据转换，或避免不必要重渲染都很有用。

```js
export const useTodos = (select) => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    select,
  })
}

export const useTodoCount = () => {
  return useTodos((data) => data.length)
}
```

使用 `useTodoCount` 自定义 hook 的组件，只有在 todos 的长度变化时才会重新渲染。比如某个 todo 的名称变化时，它**不会**重新渲染。

> 注意：`select` 作用于成功缓存的数据，并不适合在这里抛出错误。错误的真实来源应是 `queryFn`。如果 `select` 返回了错误，结果会是 `data` 为 `undefined` 且 `isSuccess` 为 `true`。如果你希望数据不正确时让查询失败，建议在 `queryFn` 中处理；若错误场景与缓存无关，建议在查询 hook 外处理。

### 记忆化

`select` 函数仅在以下情况重新执行：

- `select` 函数本身的引用发生变化
- `data` 发生变化

这意味着像上面那样内联定义 `select`，会在每次渲染时执行。为避免这一点，你可以用 `useCallback` 包裹 `select`，或者在没有依赖时提取为稳定函数引用：

```js
// wrapped in useCallback
export const useTodoCount = () => {
  return useTodos(useCallback((data) => data.length, []))
}
```

```js
// extracted to a stable function reference
const selectTodoCount = (data) => data.length

export const useTodoCount = () => {
  return useTodos(selectTodoCount)
}
```

## 延伸阅读

要深入理解这些主题，可阅读社区资源中的 [React Query Render Optimizations](../../community/tkdodos-blog.md#3-react-query-render-optimizations)。如果想进一步优化 `select`，可阅读 [React Query Selectors, Supercharged](../../community/tkdodos-blog.md#30-react-query-selectors-supercharged)。
