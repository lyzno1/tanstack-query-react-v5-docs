---
id: FocusManager
title: FocusManager
---

<!--
translation-source-path: reference/focusManager.md
translation-source-ref: v5.90.3
translation-source-hash: d8b81b4d3f53a12a95713ec70a315fb7f261c7b42906e6bab9c5ed5198f8af90
translation-status: translated
-->


`FocusManager` 用于管理 TanStack Query 中的焦点状态。

它可用于更改默认事件监听器，或手动修改焦点状态。

可用方法如下：

- [`setEventListener`](#focusmanagerseteventlistener)
- [`subscribe`](#focusmanagersubscribe)
- [`setFocused`](#focusmanagersetfocused)
- [`isFocused`](#focusmanagerisfocused)

## `focusManager.setEventListener`

`setEventListener` 可用于设置自定义事件监听器：

```tsx
import { focusManager } from '@tanstack/react-query'

focusManager.setEventListener((handleFocus) => {
  // Listen to visibilitychange
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('visibilitychange', handleFocus, false)
  }

  return () => {
    // Be sure to unsubscribe if a new handler is set
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

// Set focused
focusManager.setFocused(true)

// Set unfocused
focusManager.setFocused(false)

// Fallback to the default focus check
focusManager.setFocused(undefined)
```

**选项**

- `focused: boolean | undefined`

## `focusManager.isFocused`

`isFocused` 可用于获取当前焦点状态。

```tsx
const isFocused = focusManager.isFocused()
```
