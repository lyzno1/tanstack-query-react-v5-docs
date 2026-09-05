---
id: FocusManager
title: FocusManager
redirect_from:
  - framework/react/reference/focusManager
---

`FocusManager` 用于管理 TanStack Query 中的焦点状态。

它可用于更改默认事件监听器，或手动修改焦点状态。

可用方法如下：

- [`setEventListener`](#focusmanager-seteventlistener)
- [`subscribe`](#focusmanager-subscribe)
- [`setFocused`](#focusmanager-setfocused)
- [`isFocused`](#focusmanager-isfocused)

## `focusManager.setEventListener`

`setEventListener` 可用于设置自定义事件监听器：

```tsx
import { focusManager } from '@tanstack/react-query'

focusManager.setEventListener((handleFocus) => {
  // 监听 visibilitychange
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('visibilitychange', handleFocus, false)
  }

  return () => {
    // 设置新处理函数时，务必取消原有订阅
    window.removeEventListener('visibilitychange', handleFocus)
  }
})
```

## `focusManager.subscribe`

`subscribe` 可用于订阅可见性状态变化。它会返回一个取消订阅函数：

```tsx
import { focusManager } from '@tanstack/react-query'

const unsubscribe = focusManager.subscribe((isVisible) => {
  console.log('isVisible', isVisible)
})
```

## `focusManager.setFocused`

`setFocused` 可用于手动设置焦点状态。将其设为 `undefined` 会回退到默认焦点检查。

```tsx
import { focusManager } from '@tanstack/react-query'

// 设为已聚焦
focusManager.setFocused(true)

// 设为未聚焦
focusManager.setFocused(false)

// 回退到默认焦点检查
focusManager.setFocused(undefined)
```

**选项**

- `focused: boolean | undefined`

## `focusManager.isFocused`

`isFocused` 可用于获取当前焦点状态。

```tsx
const isFocused = focusManager.isFocused()
```
