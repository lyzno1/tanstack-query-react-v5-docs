---
id: react-native
title: React Native
---

<!--
translation-source-path: framework/react/react-native.md
translation-source-ref: v5.90.3
translation-source-hash: ba79835aa68a10cf2cf4a9c4540bd4825701a9cdd285a2c0a55d62149794b658
translation-status: translated
-->


React Query 开箱即用支持 React Native。

## DevTools 支持

React Native 的 DevTools 集成有多种可选方案：

1. **原生 macOS 应用**：用于在任意基于 JS 的应用中调试 React Query 的第三方应用：
   https://github.com/LovesWorking/rn-better-dev-tools

2. **Flipper 插件**：面向 Flipper 用户的第三方插件：
   https://github.com/bgaleotti/react-query-native-devtools

3. **Reactotron 插件**：面向 Reactotron 用户的第三方插件：
   https://github.com/hsndmr/reactotron-react-query

## 在线状态管理

React Query 在 Web 浏览器中已经支持断线重连后的自动重新获取。
若要在 React Native 中实现这一行为，需要像下面示例这样使用 React Query 的 `onlineManager`：

```tsx
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})
```

or

```tsx
import { onlineManager } from '@tanstack/react-query'
import * as Network from 'expo-network'

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected)
  })
  return eventSubscription.remove
})
```

## 在 App 聚焦时重新获取

React Native 不使用 `window` 事件监听，而是通过 [`AppState` module](https://reactnative.dev/docs/appstate#app-states) 提供焦点信息。你可以监听 `AppState` 的 `change` 事件，在应用状态变为 `active` 时触发更新：

```tsx
import { useEffect } from 'react'
import { AppState, Platform } from 'react-native'
import type { AppStateStatus } from 'react-native'
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

## 在 Screen 聚焦时刷新

在某些场景下，你可能希望 React Native Screen 再次聚焦时重新获取查询。
这个自定义 hook 会在 screen 再次聚焦时重新获取**所有处于激活状态且已过期的查询**。

```tsx
import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'

export function useRefreshOnFocus() {
  const queryClient = useQueryClient()
  const firstTimeRef = React.useRef(true)

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false
        return
      }

      // refetch all stale active queries
      queryClient.refetchQueries({
        queryKey: ['posts'],
        stale: true,
        type: 'active',
      })
    }, [queryClient]),
  )
}
```

在上述代码中，会跳过第一次聚焦（即 screen 初次挂载时），因为 `useFocusEffect` 除了在 screen 聚焦时，还会在挂载时调用一次回调。

## 在失焦 screen 上禁用查询

如果你不希望某些查询在 screen 失焦时继续保持“活跃”，可以在 `useQuery` 上使用 `subscribed` 属性。这个属性可控制查询是否保持订阅更新。结合 React Navigation 的 `useIsFocused`，你可以在 screen 不聚焦时无缝取消订阅：

示例用法：

```tsx
import React from 'react'
import { useIsFocused } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Text } from 'react-native'

function MyComponent() {
  const isFocused = useIsFocused()

  const { dataUpdatedAt } = useQuery({
    queryKey: ['key'],
    queryFn: () => fetch(...),
    subscribed: isFocused,
  })

  return <Text>DataUpdatedAt: {dataUpdatedAt}</Text>
}
```

当 `subscribed` 为 `false` 时，查询会取消订阅更新，不会触发重新渲染，也不会为该 screen 获取新数据。它再次变为 `true`（例如 screen 重新聚焦）后，查询会重新订阅并保持最新。
