---
id: OnlineManager
title: OnlineManager
redirect_from:
  - reference/onlineManager
  - framework/react/reference/onlineManager
---


定义于： [packages/query-core/src/onlineManager.ts:15](https://github.com/TanStack/query/blob/main/packages/query-core/src/onlineManager.ts#L15)

`OnlineManager` 管理 TanStack Query 中的联网状态。可用于更改默认事件监听器，或手动设置联网状态。默认情况下，`onlineManager` 假定网络已连接，并监听 `window` 的 `online` 和 `offline` 事件来检测变化。

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

### isOnline()

```ts
isOnline(): boolean;
```

定义于： [packages/query-core/src/onlineManager.ts:109](https://github.com/TanStack/query/blob/main/packages/query-core/src/onlineManager.ts#L109)

`isOnline` 用于获取当前联网状态。

#### 返回值

`boolean`

***

### setEventListener()

```ts
setEventListener(setup: SetupFn): void;
```

定义于： [packages/query-core/src/onlineManager.ts:75](https://github.com/TanStack/query/blob/main/packages/query-core/src/onlineManager.ts#L75)

`setEventListener` 用于设置确定联网状态的自定义事件监听器。传入的 `setup` 函数会收到 `setOnline` 回调；联网状态变化时应以布尔值调用该回调。

#### 参数

##### setup

`SetupFn`

#### 返回值

`void`

#### 示例

```ts
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/query-core'

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})
```

***

### setOnline()

```ts
setOnline(online: boolean): void;
```

定义于： [packages/query-core/src/onlineManager.ts:95](https://github.com/TanStack/query/blob/main/packages/query-core/src/onlineManager.ts#L95)

`setOnline` 用于手动设置联网状态。

#### 参数

##### online

`boolean`

#### 返回值

`void`

#### 示例

```ts
import { onlineManager } from '@tanstack/query-core'

// Set to online
onlineManager.setOnline(true)

// Set to offline
onlineManager.setOnline(false)
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
