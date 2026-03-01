---
id: tkdodos-blog
title: TkDodo's Blog
---

<!--
translation-source-path: framework/react/community/tkdodos-blog.md
translation-source-ref: v5.90.3
translation-source-hash: 0254e821df8bcb8357a84057c8796128c7ed1b1e17f660ac145d7212fc13bea8
translation-status: translated
-->


TanStack Query 维护者 [TkDodo](https://bsky.app/profile/tkdodo.eu) 写了一系列关于该库使用与实践的博客文章。部分文章介绍通用最佳实践，但大多数文章带有明确的 _opinionated_ 视角。

## [#1: Practical React Query](https://tkdodo.eu/blog/practical-react-query)

> 这是一篇进阶版 React Query 入门文章，提供了许多超出官方文档范围的实用技巧。内容包括默认配置解析（`staleTime` 与 `gcTime`）、如何区分服务端状态与客户端状态、处理依赖与封装自定义 hooks，以及为什么 `enabled` 选项非常强大。[Read more...](https://tkdodo.eu/blog/practical-react-query)

## [#2: React Query Data Transformations](https://tkdodo.eu/blog/react-query-data-transformations)

> 学习如何在 React Query 中完成常见且重要的数据转换任务。本文从 `queryFn` 内转换到使用 `select` 选项，系统比较了不同方案的优缺点。[Read more...](https://tkdodo.eu/blog/react-query-data-transformations)

## [#3: React Query Render Optimizations](https://tkdodo.eu/blog/react-query-render-optimizations)

> 当你发现使用 React Query 后组件重渲染过于频繁时，可以做什么？库本身已经做了很多优化，但你仍可使用一些可选特性（如 `tracked queries`）来避免 `isFetching` 触发的状态切换。文中也解释了 `structural sharing` 的含义。[Read more...](https://tkdodo.eu/blog/react-query-render-optimizations)

## [#4: Status Checks in React Query](https://tkdodo.eu/blog/status-checks-in-react-query)

> 我们通常会先判断 `isPending`，再判断 `isError`，但有时更应该先检查 `data` 是否可用。本文展示了错误的状态检查顺序如何损害用户体验。[Read more...](https://tkdodo.eu/blog/status-checks-in-react-query)

## [#5: Testing React Query](https://tkdodo.eu/blog/testing-react-query)

> 官方文档已经很好地覆盖了 React Query 测试入门。本文补充了更多实用建议（例如关闭 `retries`、静默 `console`），适用于测试自定义 hooks 或组件。文中还提供了一个使用 `mock-service-worker` 的[示例仓库](https://github.com/TkDodo/testing-react-query)，覆盖成功与错误状态测试。[Read more...](https://tkdodo.eu/blog/testing-react-query)

## [#6: React Query and TypeScript](https://tkdodo.eu/blog/react-query-and-type-script)

> React Query 由 TypeScript 编写，因此有很强的类型支持。本文讲解了各类泛型、如何利用类型推断避免手写 `useQuery` 等类型、如何处理 `unknown` 错误、类型收窄等内容。[Read more...](https://tkdodo.eu/blog/react-query-and-type-script)

## [#7: Using WebSockets with React Query](https://tkdodo.eu/blog/using-web-sockets-with-react-query)

> 一份分步指南，讲解如何在 React Query 中实现实时通知，可采用基于事件的订阅，也可直接向客户端推送完整数据。适用范围从浏览器原生 WebSocket API 到 Firebase，甚至 GraphQL subscriptions。[Read more...](https://tkdodo.eu/blog/using-web-sockets-with-react-query)

## [#8: Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)

> 大多数示例只用简单字符串或数组作为查询键。但当应用规模超出 todo 列表示例后，如何高效组织查询键？本文展示了同位组织（co-location）与 Query Key Factories 如何简化维护。[Read more...](https://tkdodo.eu/blog/effective-react-query-keys)

## [#8a: Leveraging the Query Function Context](https://tkdodo.eu/blog/leveraging-the-query-function-context)

> 这篇是上一篇的补充，讨论如何利用 Query Function Context 和对象式查询键，让应用规模扩大时依然保持高安全性。[Read more...](https://tkdodo.eu/blog/leveraging-the-query-function-context)

## [#9: Placeholder and Initial Data in React Query](https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query)

> Placeholder Data 与 Initial Data 看似相近但本质不同，它们都能在同步阶段展示数据而不是 loading spinner，从而改善 UX。本文比较二者差异，并说明各自适用场景。[Read more...](https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query)

## [#10: React Query as a State Manager](https://tkdodo.eu/blog/react-query-as-a-state-manager)

> React Query 不负责替你获取数据，它是一个专注服务端状态的数据同步工具。本文完整讲解如何把 React Query 作为异步状态的单一事实来源，并解释为什么很多时候只需合理设置 `staleTime` 即可。[Read more...](https://tkdodo.eu/blog/react-query-as-a-state-manager)

## [#11: React Query Error Handling](https://tkdodo.eu/blog/react-query-error-handling)

> 错误处理是异步数据（尤其是数据获取）中不可分割的一部分。不是所有请求都会成功，也不是所有 Promise 都会 fulfilled。本文介绍了 React Query 的多种错误处理方式，如 `error` 属性、Error Boundaries 与 onError 回调，帮助你应对“Something went wrong”的场景。[Read more...](https://tkdodo.eu/blog/react-query-error-handling)

## [#12: Mastering Mutations in React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query)

> Mutations 是处理服务端数据的另一半核心能力，用于更新数据。本文介绍 mutation 的概念及其与 query 的区别，并讲解 `mutate` 与 `mutateAsync` 的差异，以及如何把 query 与 mutation 串联起来。[Read more...](https://tkdodo.eu/blog/mastering-mutations-in-react-query)

## [#13: Offline React Query](https://tkdodo.eu/blog/offline-react-query)

> 生成 Promise 的方式很多，而 React Query 只需要 Promise 即可工作；但最常见场景仍是数据获取，这通常依赖网络连接。在移动设备等网络不稳定环境下，你会希望应用离线可用。本文介绍 React Query 提供的多种离线策略。[Read more...](https://tkdodo.eu/blog/offline-react-query)

## [#14: React Query and Forms](https://tkdodo.eu/blog/react-query-and-forms)

> 表单常常模糊服务端状态与客户端状态的边界。大多数应用不仅要展示状态，还要允许用户交互。本文给出两种不同思路，并分享 React Query 与表单配合时的技巧。[Read more...](https://tkdodo.eu/blog/react-query-and-forms)

## [#15: React Query FAQs](https://tkdodo.eu/blog/react-query-fa-qs)

> 本文尝试回答 React Query 最常见的问题。[Read more...](https://tkdodo.eu/blog/react-query-fa-qs)

## [#16: React Query meets React Router](https://tkdodo.eu/blog/react-query-meets-react-router)

> Remix 与 React Router 正在改变我们对“何时获取数据”的思考方式。本文解释了为什么 React Query 与支持数据加载的路由器是天作之合。[Read more...](https://tkdodo.eu/blog/react-query-meets-react-router)

## [#17: Seeding the Query Cache](https://tkdodo.eu/blog/seeding-the-query-cache)

> 本文展示了多种在开始渲染之前向 Query Cache 注入数据的方法，以减少应用中的 loading spinner。可选方案包括在服务端或路由中 prefetch，以及通过 `setQueryData` 预置缓存。[Read more...](https://tkdodo.eu/blog/seeding-the-query-cache)

## [#18: Inside React Query](https://tkdodo.eu/blog/inside-react-query)

> 如果你想了解 React Query 的底层机制，这篇文章适合你。它从与框架无关的 Query Core 讲起，并解释它如何与各框架适配层通信，文中还包含可视化图示。[Read more...](https://tkdodo.eu/blog/inside-react-query)

## [#19: Type-safe React Query](https://tkdodo.eu/blog/type-safe-react-query)

> “有类型”和“类型安全”之间差异很大。本文试图厘清这些差异，并展示在 React Query 与 TypeScript 组合下如何获得尽可能高的类型安全。[Read more...](https://tkdodo.eu/blog/type-safe-react-query)

## [#20: You Might Not Need React Query](https://tkdodo.eu/blog/you-might-not-need-react-query)

> 如果你的应用不依赖客户端数据获取，尤其在 Next.js 或 Remix 这类内置服务端组件的框架里，React Query 可能并非必需。尽管如此，在混合场景（如无限滚动、离线支持）中，它的智能缓存与重新验证仍非常有价值。[Read more...](https://tkdodo.eu/blog/you-might-not-need-react-query)

## [#21: Thinking in React Query](https://tkdodo.eu/blog/thinking-in-react-query)

> React Query 不是数据获取库，而是异步状态管理器。它把参数视为依赖，通过 `staleTime` 优化重新获取行为，并鼓励让 `queryKey` 驱动缓存与更新的声明式模式。思维方式的小变化，会显著提升你的使用效果。[Read more...](https://tkdodo.eu/blog/thinking-in-react-query)

## [#22: React Query and React Context](https://tkdodo.eu/blog/react-query-and-react-context)

> React Query 允许组件独立管理自己的数据，让组件更自治、更有韧性；但当树深处需要共享数据（如上层获取的用户信息）时，React Context 可以把这种隐式依赖变得显式且更安全。[Read more...](https://tkdodo.eu/blog/react-query-and-react-context)

## [#23: Why You Want React Query](https://tkdodo.eu/blog/why-you-want-react-query)

> 在 `useEffect` 中直接用 `fetch` 看起来简单，但很快会陷入竞态条件、缺失加载状态、数据陈旧、Strict Mode 怪异行为等问题，导致异步状态管理远比表面复杂。 [Read more...](https://tkdodo.eu/blog/why-you-want-react-query)

## [#24: The Query Options API](https://tkdodo.eu/blog/the-query-options-api)

> React Query v5 引入统一的“Query Options” API。`useQuery`、`invalidateQueries` 与命令式调用都接受同一个对象参数，简化接口、提升复用性，并同时改进类型安全。[Read more...](https://tkdodo.eu/blog/the-query-options-api)

## [#25: Automatic Query Invalidation after Mutations](https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations)

> React Query 不会自动把 mutation 与 query 关联起来，但你可以在集中式 `MutationCache` 中利用“全局缓存回调”定义共享行为，比如每次 mutation 后统一失效相关查询。[Read more...](https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations)

## [#26: How Infinite Queries work](https://tkdodo.eu/blog/how-infinite-queries-work)

> 本文深入讲解 Infinite Queries 的设计与底层运行方式。有趣的是，并不存在独立的 InfiniteQuery 表示，而是给普通 Query 挂载了不同的“行为”。[Read more...](https://tkdodo.eu/blog/how-infinite-queries-work)

## [#27: React Query API Design - Lessons Learned](https://tkdodo.eu/blog/react-query-api-design-lessons-learned)

> 在这场分享中，Dominik 回顾了 React Query 为了获得优秀开发者体验所做的一些 API 设计决策。你会听到成功经验，也会看到取舍与失误，以及我们都能从中学到什么。[Read more...](https://tkdodo.eu/blog/react-query-api-design-lessons-learned)

## [#28: React Query - The Bad Parts](https://tkdodo.eu/blog/react-query-the-bad-parts)

> 在这场分享中，Dominik 探讨了 React Query 不那么理想的方面，以及它可能不适合的场景。没有任何库是完美的，每个选择都伴随权衡。看完后，你会更清楚 React Query 的边界，以及它为何依然是有吸引力的选择。[Read more...](https://tkdodo.eu/blog/react-query-the-bad-parts)

## [#29: Concurrent Optimistic Updates in React Query](https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query)

> 在 React Query 中，多个 mutation 并发执行时，乐观更新可能引发竞态条件，造成 UI 状态不一致。取消进行中的查询有帮助，但重叠失效仍可能覆盖更新更晚的数据。[Read more...](https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query)

## [#30: React Query Selectors, Supercharged](https://tkdodo.eu/blog/react-query-selectors-supercharged)

> React Query 的 `select` 选项让组件只订阅查询数据中自己关心的部分，因此某个字段更新不会导致无关 UI 不必要地重渲染。这种细粒度方式在缓存完整响应的同时，也优化了组件更新性能。[Read more...](https://tkdodo.eu/blog/react-query-selectors-supercharged)
