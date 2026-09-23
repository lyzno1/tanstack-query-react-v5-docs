---
id: environmentManager
title: environmentManager
redirect_from:
  - reference/environmentManager
---


```ts
const environmentManager: object;
```

定义于： [packages/query-core/src/environmentManager.ts:29](https://github.com/TanStack/query/blob/main/packages/query-core/src/environmentManager.ts#L29)

管理 TanStack Query 如何判断当前运行环境是否应视为服务端。服务端环境不会调度重新获取定时器，而且默认 `retry` 次数与 `gcTime` 不同。默认检测会将缺少 `window`（或存在全局 `Deno`）的环境视为服务端。若默认检测不适用于你的运行环境，可覆盖它。例如，Service Worker 中 `window` 为 `undefined`，但该环境可能应按客户端处理。

## 类型声明

### isServer()

```ts
isServer: () => boolean;
```

返回当前运行环境是否应视为服务端。

#### 返回值

`boolean`

### setIsServer()

```ts
setIsServer(isServerValue: IsServerValue): void;
```

全局覆盖服务端环境检测。

#### 参数

##### isServerValue

`IsServerValue`

#### 返回值

`void`

## 示例

```ts
import { environmentManager } from '@tanstack/query-core'

environmentManager.setIsServer(() => false)
```
