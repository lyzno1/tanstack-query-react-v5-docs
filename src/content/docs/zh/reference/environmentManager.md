---
id: EnvironmentManager
title: environmentManager
---

<!--
translation-source-path: reference/environmentManager.md
translation-source-ref: main
translation-source-hash: 5d74d5b05f4bb1e12bf6c7e2fe5ea2c5feebc912776ee041dffc89551b4e65b8
translation-status: translated
-->


`environmentManager` 管理 TanStack Query 如何检测当前运行时是否应被视为服务端环境。

默认情况下，它使用与 query-core 导出的 `isServer` 工具函数相同的服务端检测方式。

对于并非传统浏览器或服务端环境的运行时（例如扩展程序的 worker），可以使用该管理器在全局覆盖服务端检测逻辑。

可用方法如下：

- [`isServer`](#environmentmanager-isserver)
- [`setIsServer`](#environmentmanager-setisserver)

## `environmentManager.isServer`

返回当前运行时是否被视为服务端环境。

```tsx
import { environmentManager } from '@tanstack/react-query'

const server = environmentManager.isServer()
```

## `environmentManager.setIsServer`

在全局覆盖服务端检查逻辑。

```tsx
import { environmentManager } from '@tanstack/react-query'

// 覆盖默认检测
environmentManager.setIsServer(() => {
  return typeof window === 'undefined' && !('chrome' in globalThis)
})
```

**选项**

- `isServerValue: () => boolean`

若要恢复默认行为，请将该函数重新设为 query-core 的 `isServer` 工具函数：

```tsx
import { environmentManager, isServer } from '@tanstack/react-query'

environmentManager.setIsServer(() => isServer)
```
