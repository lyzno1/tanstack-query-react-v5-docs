---
id: window-focus-refetching
title: 窗口聚焦时重新获取
---

<!--
translation-source-path: framework/react/guides/window-focus-refetching.md
translation-source-ref: v5.90.3
translation-source-hash: cfdb00a9a9515efe21c03d3bafc377b21d6bc88c8ff21a2c62d53005f4f9723e
translation-status: translated
-->


如果用户离开你的应用后又返回，且查询数据已过期，**TanStack Query 会自动在后台为你获取最新数据**。你可以通过 `refetchOnWindowFocus` 选项在全局或单个查询上禁用该行为：

#### 全局禁用

[//]: # 'Example'

```tsx
//
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

[//]: # 'Example'

#### 单查询禁用

[//]: # 'Example2'

```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchOnWindowFocus: false,
})
```

[//]: # 'Example2'

## 自定义窗口聚焦事件

在少数场景下，你可能希望自行管理触发 TanStack Query 重新校验的窗口聚焦事件。为此，TanStack Query 提供了 `focusManager.setEventListener`，它会把窗口聚焦时应触发的回调传给你，并允许你自行注册事件。调用 `focusManager.setEventListener` 时，之前设置的处理器会被移除（大多数情况下是默认处理器），并改为使用你的新处理器。下面是默认处理器示例：

[//]: # 'Example3'

```tsx
focusManager.setEventListener((handleFocus) => {
  // Listen to visibilitychange
  if (typeof window !== 'undefined' && window.addEventListener) {
    const visibilitychangeHandler = () => {
      handleFocus(document.visibilityState === 'visible')
    }
    window.addEventListener('visibilitychange', visibilitychangeHandler, false)
    return () => {
      // Be sure to unsubscribe if a new handler is set
      window.removeEventListener('visibilitychange', visibilitychangeHandler)
    }
  }
})
```

[//]: # 'Example3'
[//]: # 'ReactNative'

## 在 React Native 中管理焦点

React Native 没有 `window` 事件监听，而是通过 [`AppState` 模块](https://reactnative.dev/docs/appstate#app-states) 提供焦点信息。你可以监听 `AppState` 的 `change` 事件，并在应用状态变为 `active` 时触发更新：

```tsx
import { AppState } from 'react-native'
import { focusManager } from '@tanstack/react-query'

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

useEffect(() => {
  const subscription = AppState.addEventListener('change', onAppStateChange)

  return () => subscription.remove()
}, [])
```

[//]: # 'ReactNative'

## 管理焦点状态

[//]: # 'Example4'

```tsx
import { focusManager } from '@tanstack/react-query'

// Override the default focus state
focusManager.setFocused(true)

// Fallback to the default focus check
focusManager.setFocused(undefined)
```

[//]: # 'Example4'
