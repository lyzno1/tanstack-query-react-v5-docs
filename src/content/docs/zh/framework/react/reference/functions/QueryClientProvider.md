---
id: QueryClientProvider
title: QueryClientProvider
redirect_from:
  - framework/react/reference/QueryClientProvider
---

```ts
function QueryClientProvider(__namedParameters): Element;
```

定义于： [react-query/src/QueryClientProvider.tsx:70](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryClientProvider.tsx#L70)

使用 `QueryClientProvider` 组件为应用连接并提供 `QueryClient`。该组件挂载或卸载时，还会分别调用
`client.mount()` 和 `client.unmount()`，让客户端订阅焦点与在线状态事件（当应用重新获得焦点或恢复联网时，
恢复所有暂停的变更，并按需重新获取数据）。

## 参数

### \_\_namedParameters

[`QueryClientProviderProps`](../type-aliases/QueryClientProviderProps.md)

## 返回值

`Element`

返回经过包装的 `children`，使其能够通过 `useQueryClient` 读取 `QueryClient`。

## 示例

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```
