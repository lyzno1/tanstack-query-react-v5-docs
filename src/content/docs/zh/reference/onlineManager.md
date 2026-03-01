---
id: OnlineManager
title: OnlineManager
---

<!--
translation-source-path: reference/onlineManager.md
translation-source-ref: v5.90.3
translation-source-hash: b15d65c26fc20a4f28d5a0dfc135c23137bd4ad8ecf885d88426d26ddfd82d0b
translation-status: translated
-->


`OnlineManager` 用于管理 TanStack Query 中的在线状态。它可用于更改默认事件监听器，或手动修改在线状态。

> 默认情况下，`onlineManager` 会假设网络连接可用，并监听 `window` 对象上的 `online` 与 `offline` 事件来检测变化。

> 在早期版本中，我们使用 `navigator.onLine` 来判断网络状态。但它在 Chromium 内核浏览器中表现不佳，存在[大量问题](https://bugs.chromium.org/p/chromium/issues/list?q=navigator.online)导致误报离线，从而让查询被错误标记为 `offline`。

> 为规避这个问题，我们现在总是以 `online: true` 启动，并仅通过 `online` 与 `offline` 事件来更新状态。

> 这会降低误报离线的概率；但对于通过 service worker 加载、即使没有互联网连接也能运行的离线应用，可能会出现误报在线。

可用方法如下：

- [`setEventListener`](#onlinemanagerseteventlistener)
- [`subscribe`](#onlinemanagersubscribe)
- [`setOnline`](#onlinemanagersetonline)
- [`isOnline`](#onlinemanagerisonline)

## `onlineManager.setEventListener`

`setEventListener` 可用于设置自定义事件监听器：

```tsx
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})
```

## `onlineManager.subscribe`

`subscribe` 可用于订阅在线状态变化。它会返回一个取消订阅函数：

```tsx
import { onlineManager } from '@tanstack/react-query'

const unsubscribe = onlineManager.subscribe((isOnline) => {
  console.log('isOnline', isOnline)
})
```

## `onlineManager.setOnline`

`setOnline` 可用于手动设置在线状态。

```tsx
import { onlineManager } from '@tanstack/react-query'

// Set to online
onlineManager.setOnline(true)

// Set to offline
onlineManager.setOnline(false)
```

**选项**

- `online: boolean`

## `onlineManager.isOnline`

`isOnline` 可用于获取当前在线状态。

```tsx
const isOnline = onlineManager.isOnline()
```
