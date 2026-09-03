---
id: react-native
title: React Native
---

<!--
translation-source-path: framework/react/react-native.md
translation-source-ref: main
translation-source-hash: 93e057636a108ad6e70092b8210d2bea4e30dc220bdfdb952acc81a36315ced5
translation-status: translated
-->


React Query 开箱即用支持 React Native。

## DevTools 支持

React Native 的 DevTools 集成有多种可选方案：

1. **Rozenite 插件**：面向 [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) 用户的第三方插件：https://www.rozenite.dev/docs/official-plugins/tanstack-query

2. **原生 macOS 应用**：用于在任意基于 JS 的应用中调试 React Query 的第三方应用：
   https://github.com/LovesWorking/rn-better-dev-tools

3. **Flipper 插件**：面向 Flipper 用户的第三方插件：
   https://github.com/bgaleotti/react-query-native-devtools

4. **Reactotron 插件**：面向 Reactotron 用户的第三方插件：
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

或者

```tsx
import { onlineManager } from '@tanstack/react-query'
import * as Network from 'expo-network'

onlineManager.setEventListener((setOnline) => {
  let initialised = false

  const eventSubscription = Network.addNetworkStateListener((state) => {
    initialised = true
    setOnline(!!state.isConnected)
  })

  Network.getNetworkStateAsync()
    .then((state) => {
      if (!initialised) {
        setOnline(!!state.isConnected)
      }
    })
    .catch(() => {
      // getNetworkStateAsync can reject on some platforms/SDK versions
    })

  return eventSubscription.remove
})
```

## 应用获得焦点时重新获取

React Native 不使用 `window` 事件监听，而是通过 [`AppState` 模块](https://reactnative.dev/docs/appstate#app-states)
提供焦点信息。你可以监听 `AppState` 的 `change` 事件，在应用状态变为 `active` 时触发更新：

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

## 屏幕获得焦点时刷新

在某些场景下，你可能希望 React Native 屏幕再次获得焦点时重新获取查询。
这个自定义 Hook 会在屏幕再次获得焦点时，重新获取**所有处于活跃状态且已过期的查询**。

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

上述代码会跳过第一次获得焦点（即屏幕初次挂载时），因为 `useFocusEffect` 除了在屏幕获得焦点时，
还会在挂载时调用一次回调。

## 在失去焦点的屏幕上禁用查询

如果你不希望某些查询在屏幕失去焦点后继续保持“活跃”，可以使用 `useQuery` 的 `subscribed` 属性。
它控制查询是否继续订阅更新。结合 React Navigation 的 `useIsFocused`，可以在屏幕未获得焦点时取消订阅：

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

当 `subscribed` 为 `false` 时，查询会取消订阅更新，不会触发重新渲染，也不会为该屏幕获取新数据。
它再次变为 `true`（例如屏幕重新获得焦点）后，查询会重新订阅并保持最新。
