---
id: does-this-replace-client-state
title: TanStack Query 会替代 Redux、MobX 或其他全局状态管理器吗？
---

<!--
translation-source-path: framework/react/guides/does-this-replace-client-state.md
translation-source-ref: v5.90.3
translation-source-hash: e839285d23777e13420d5d291b1cdf8f49642509c5ee569f8a88074ac6adb2b9
translation-status: translated
-->


先看几个重要点：

- TanStack Query 是一个**服务端状态（server-state）**库，负责管理服务端与客户端之间的异步操作。
- Redux、MobX、Zustand 等是**客户端状态（client-state）**库，_也可以用来存异步数据，但与 TanStack Query 这类工具相比效率较低_。

基于这些前提，简短答案是：TanStack Query **可以替代你在客户端状态里管理缓存数据所需的大量样板代码和连接逻辑，并将其压缩成几行代码。**

对于绝大多数应用来说，把所有异步代码迁移到 TanStack Query 后，真正还需要**全局可访问的客户端状态**通常会非常少。

> 当然仍有一些场景，应用会有海量同步、仅客户端的状态（例如可视化设计器或音乐制作应用）。这种情况下你可能仍然需要客户端状态管理器。此时要注意：**TanStack Query 不是本地/客户端状态管理的替代品**。不过你可以把 TanStack Query 与大多数客户端状态管理器无缝配合使用。

## 一个人为构造的示例

假设我们有一些“全局”状态由全局状态库管理：

```tsx
const globalState = {
  projects,
  teams,
  tasks,
  users,
  themeMode,
  sidebarStatus,
}
```

当前全局状态管理器缓存了 4 类服务端状态：`projects`、`teams`、`tasks`、`users`。如果把这些服务端状态迁移到 TanStack Query，剩余的全局状态会更像这样：

```tsx
const globalState = {
  themeMode,
  sidebarStatus,
}
```

这也意味着，配合少量 `useQuery` 与 `useMutation` 调用，你还能删除此前用于管理服务端状态的样板代码，例如：

- Connectors
- Action Creators
- Middlewares
- Reducers
- Loading/Error/Result 状态
- Contexts

移除这些之后，你可能会问：**“为了这么一点全局状态，还值得继续使用客户端状态管理器吗？”**

**这取决于你。**

但 TanStack Query 的定位很清晰：它把应用里的异步连接逻辑和样板代码移除掉，并用几行代码替代。

现在就动手试试吧。
