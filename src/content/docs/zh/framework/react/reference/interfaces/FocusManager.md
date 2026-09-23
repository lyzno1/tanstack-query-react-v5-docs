---
id: FocusManager
title: FocusManager
redirect_from:
  - reference/focusManager
  - framework/react/reference/focusManager
---


定义于： [packages/query-core/src/focusManager.ts:14](https://github.com/TanStack/query/blob/main/packages/query-core/src/focusManager.ts#L14)

`FocusManager` 管理 TanStack Query 中的焦点状态。可用于更改默认事件监听器，或手动设置焦点状态。

## 继承

- `Subscribable`\<`Listener`\>

## 方法

### hasListeners()

```ts
hasListeners(): boolean;
```

定义于： [packages/query-core/src/subscribable.ts:41](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L41)

至少注册了一个监听器时返回 `true`；所有监听器都取消订阅后返回 `false`。

#### 返回值

`boolean`

#### 继承自

```ts
Subscribable.hasListeners
```

***

### isFocused()

```ts
isFocused(): boolean;
```

定义于： [packages/query-core/src/focusManager.ts:128](https://github.com/TanStack/query/blob/main/packages/query-core/src/focusManager.ts#L128)

`isFocused` 用于获取当前焦点状态。

#### 返回值

`boolean`

***

### onFocus()

```ts
onFocus(): void;
```

定义于： [packages/query-core/src/focusManager.ts:118](https://github.com/TanStack/query/blob/main/packages/query-core/src/focusManager.ts#L118)

`onFocus` 将当前焦点状态通知所有已订阅的监听器。

#### 返回值

`void`

***

### setEventListener()

```ts
setEventListener(setup: SetupFn): void;
```

定义于： [packages/query-core/src/focusManager.ts:77](https://github.com/TanStack/query/blob/main/packages/query-core/src/focusManager.ts#L77)

`setEventListener` 用于设置确定焦点状态的自定义事件监听器。传入的 `setup` 函数会收到 `setFocused` 回调：传入布尔值可手动设置焦点状态；不传参数则重新检查当前焦点状态并通知订阅者。

#### 参数

##### setup

`SetupFn`

#### 返回值

`void`

#### 示例

```ts
import { focusManager } from '@tanstack/query-core'

focusManager.setEventListener((handleFocus) => {
  const listener = () => handleFocus()
  // Listen to visibilitychange
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('visibilitychange', listener, false)
  }

  return () => {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener('visibilitychange', listener)
  }
})
```

***

### setFocused()

```ts
setFocused(focused?: boolean): void;
```

定义于： [packages/query-core/src/focusManager.ts:107](https://github.com/TanStack/query/blob/main/packages/query-core/src/focusManager.ts#L107)

`setFocused` 用于手动设置焦点状态。传入 `undefined` 可恢复默认焦点检查。

#### 参数

##### focused?

`boolean`

#### 返回值

`void`

#### 示例

```ts
import { focusManager } from '@tanstack/query-core'

// Set focused
focusManager.setFocused(true)

// Set unfocused
focusManager.setFocused(false)

// Fallback to the default focus check
focusManager.setFocused(undefined)
```

***

### subscribe()

```ts
subscribe(listener: Listener): () => void;
```

定义于： [packages/query-core/src/subscribable.ts:27](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L27)

注册一个监听器，在此对象每次发出更新通知时调用。返回值是移除该监听器的函数；调用它即可停止监听。基类不会自行移除监听器，但某些子类会在 `destroy()` 中清除全部监听器。

#### 参数

##### listener

`Listener`

每次更新时调用，参数由子类传给订阅者。

#### 返回值

```ts
(): void;
```

##### 返回值

`void`

#### 示例

```ts
const unsubscribe = subscribable.subscribe(() => {
  // react to the update
})

unsubscribe()
```

#### 继承自

```ts
Subscribable.subscribe
```
