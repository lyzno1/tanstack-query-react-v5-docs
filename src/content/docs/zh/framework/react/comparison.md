---
id: comparison
title: Comparison | React Query vs SWR vs Apollo vs RTK Query vs React Router
---

<!--
translation-source-path: framework/react/comparison.md
translation-source-ref: v5.90.3
translation-source-hash: bd907b17d86496d056097216d222f062343973506a3a4caf9c0cd2a8aa7659c1
translation-status: translated
-->


> 这个对比表尽可能保持准确且中立。如果你使用其中任一库并认为信息可以改进，欢迎通过页面底部的 “Edit this page on Github” 链接提出修改建议（请附上说明或证据）。

特性/能力标识说明：

- ✅ 一等公民支持：内置、开箱即用，无需额外配置或代码
- 🟡 支持，但依赖非官方第三方或社区库/贡献
- 🔶 支持且有文档，但需要额外用户代码实现
- 🛑 官方未支持或未文档化

|                                                    | React Query                              | SWR [_(Website)_][swr]                   | Apollo Client [_(Website)_][apollo]        | RTK-Query [_(Website)_][rtk-query]   | React Router [_(Website)_][react-router]                                  |
| -------------------------------------------------- | ---------------------------------------- | ---------------------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- |
| Github 仓库 / Stars                                | [![][stars-react-query]][gh-react-query] | [![][stars-swr]][gh-swr]                 | [![][stars-apollo]][gh-apollo]             | [![][stars-rtk-query]][gh-rtk-query] | [![][stars-react-router]][gh-react-router]                                |
| 平台要求                                           | React                                    | React                                    | React, GraphQL                             | Redux                                | React                                                                     |
| 官方对比页面                                       |                                          | (none)                                   | (none)                                     | [Comparison][rtk-query-comparison]   | (none)                                                                    |
| 支持的查询语法                                     | Promise, REST, GraphQL                   | Promise, REST, GraphQL                   | GraphQL, Any (Reactive Variables)          | Promise, REST, GraphQL               | Promise, REST, GraphQL                                                    |
| 支持的框架                                         | React                                    | React                                    | React + Others                             | Any                                  | React                                                                     |
| 缓存策略                                           | Hierarchical Key -> Value                | Unique Key -> Value                      | Normalized Schema                          | Unique Key -> Value                  | Nested Route -> value                                                     |
| 缓存键策略                                         | JSON                                     | JSON                                     | GraphQL Query                              | JSON                                 | Route Path                                                                |
| 缓存变化检测                                       | Deep Compare Keys (Stable Serialization) | Deep Compare Keys (Stable Serialization) | Deep Compare Keys (Unstable Serialization) | Key Referential Equality (===)       | Route Change                                                              |
| 数据变化检测                                       | Deep Comparison + Structural Sharing     | Deep Compare (via `stable-hash`)         | Deep Compare (Unstable Serialization)      | Key Referential Equality (===)       | Loader Run                                                                |
| 数据记忆化                                         | Full Structural Sharing                  | Identity (===)                           | Normalized Identity                        | Identity (===)                       | Identity (===)                                                            |
| Bundle 大小                                        | [![][bp-react-query]][bpl-react-query]   | [![][bp-swr]][bpl-swr]                   | [![][bp-apollo]][bpl-apollo]               | [![][bp-rtk-query]][bpl-rtk-query]   | [![][bp-react-router]][bpl-react-router] + [![][bp-history]][bpl-history] |
| API 定义位置                                       | Component, External Config               | Component                                | GraphQL Schema                             | External Config                      | Route Tree Configuration                                                  |
| Queries                                            | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 缓存持久化                                         | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑 仅活跃路由 <sup>8</sup>                                                |
| Devtools                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 轮询/定时刷新                                      | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 并行查询                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 依赖查询                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 分页查询                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 无限查询                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 双向无限查询                                       | ✅                                       | 🔶                                       | 🔶                                         | ✅                                   | 🛑                                                                        |
| 无限查询重新获取                                   | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | 🛑                                                                        |
| 滞后查询数据<sup>1</sup>                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Selectors                                          | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | N/A                                                                       |
| 初始数据                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 滚动恢复                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 缓存操作                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 过期查询淘汰                                       | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 渲染批处理与优化<sup>2</sup>                       | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | ✅                                                                        |
| 自动垃圾回收                                       | ✅                                       | 🛑                                       | 🛑                                         | ✅                                   | N/A                                                                       |
| Mutation Hooks                                     | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 离线 mutation 支持                                 | ✅                                       | 🛑                                       | 🟡                                         | 🛑                                   | 🛑                                                                        |
| Prefetch APIs                                      | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 查询取消                                           | ✅                                       | 🛑                                       | 🛑                                         | 🛑                                   | ✅                                                                        |
| 部分查询匹配<sup>3</sup>                           | ✅                                       | 🔶                                       | ✅                                         | ✅                                   | N/A                                                                       |
| stale-while-revalidate                             | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| staleTime 配置                                     | ✅                                       | 🛑<sup>7</sup>                           | 🛑                                         | ✅                                   | 🛑                                                                        |
| 使用前查询/变更配置<sup>4</sup>                    | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 窗口聚焦时重新获取                                 | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | 🛑                                                                        |
| 网络状态恢复时重新获取                             | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 通用缓存反序列化/再水合                            | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 离线缓存                                           | ✅                                       | 🛑                                       | ✅                                         | 🔶                                   | 🛑                                                                        |
| React Suspense                                     | ✅                                       | ✅                                       | ✅                                         | 🛑                                   | ✅                                                                        |
| 抽象/无关框架核心                                  | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| mutation 后自动重新获取<sup>5</sup>               | 🔶                                       | 🔶                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 规范化缓存<sup>6</sup>                             | 🛑                                       | 🛑                                       | ✅                                         | 🛑                                   | 🛑                                                                        |

### Notes

> **<sup>1</sup> Lagged Query Data** - React Query 提供了在下一次查询加载期间继续显示现有查询数据的能力（类似 Suspense 即将原生提供的 UX）。这对分页 UI 或无限加载 UI 非常关键，因为你不希望每次发起新查询都出现“硬加载”状态。其他库通常不具备这一能力，在新查询加载时会直接进入硬加载（除非该查询已被预取）。

> **<sup>2</sup> Render Optimization** - React Query 的渲染性能非常优秀。默认情况下，它会自动追踪被访问的字段，仅在这些字段变化时才重渲染。若你希望退出该优化，可将 `notifyOnChangeProps` 设为 `'all'`，这样查询每次更新（如有新数据或进入 fetching）都会重渲染组件。React Query 还会对更新做批处理，确保多个组件使用同一查询时应用只重渲染一次。如果你只关心 `data` 或 `error`，可将 `notifyOnChangeProps` 设为 `['data', 'error']` 进一步减少渲染次数。

> **<sup>3</sup> Partial query matching** - 由于 React Query 使用确定性的查询键序列化，你可以在不知道每个具体查询键的前提下操作某一组查询。例如，无论变量如何变化，都可以重新获取所有以 `todos` 开头的查询；也可以精确匹配带或不带变量/嵌套属性的查询，甚至通过过滤函数只匹配满足特定条件的查询。

> **<sup>4</sup> Pre-usage Query Configuration** - 这是一个“花哨”的说法，指的是在查询和变更真正使用前就预先配置其行为。例如，可先设置完整默认配置，使用时只需 `useQuery({ queryKey })`，而不必每次都传 fetcher 和/或 options。SWR 仅提供该特性的部分能力：可全局预设默认 fetcher，但不能按查询粒度配置，更无法用于 mutations。

> **<sup>5</sup> Automatic Refetch after Mutation** - 若要在 mutation 发生后实现真正自动重新获取，通常需要 schema（例如 GraphQL 的 schema）以及一套启发式规则，用于帮助库识别 schema 中的实体与实体类型。

> **<sup>6</sup> Normalized Caching** - React Query、SWR 与 RTK-Query 目前均不支持自动规范化缓存。规范化缓存通常指将实体以扁平结构存储，以避免上层数据重复。

> **<sup>7</sup> SWR's Immutable Mode** - SWR 提供了 “immutable” 模式，确实可让查询在缓存生命周期内仅获取一次，但它仍没有 staleTime 或条件自动重新验证的概念。

> **<sup>8</sup> React Router cache persistence** - React Router 不会缓存当前匹配路由之外的数据。一旦离开路由，该路由数据就会丢失。

[bpl-react-query]: https://bundlephobia.com/result?p=react-query
[bp-react-query]: https://badgen.net/bundlephobia/minzip/react-query?label=💾
[gh-react-query]: https://github.com/tannerlinsley/react-query
[stars-react-query]: https://img.shields.io/github/stars/tannerlinsley/react-query?label=%F0%9F%8C%9F
[swr]: https://github.com/vercel/swr
[bp-swr]: https://badgen.net/bundlephobia/minzip/swr?label=💾
[gh-swr]: https://github.com/vercel/swr
[stars-swr]: https://img.shields.io/github/stars/vercel/swr?label=%F0%9F%8C%9F
[bpl-swr]: https://bundlephobia.com/result?p=swr
[apollo]: https://github.com/apollographql/apollo-client
[bp-apollo]: https://badgen.net/bundlephobia/minzip/@apollo/client?label=💾
[gh-apollo]: https://github.com/apollographql/apollo-client
[stars-apollo]: https://img.shields.io/github/stars/apollographql/apollo-client?label=%F0%9F%8C%9F
[bpl-apollo]: https://bundlephobia.com/result?p=@apollo/client
[rtk-query]: https://redux-toolkit.js.org/rtk-query/overview
[rtk-query-comparison]: https://redux-toolkit.js.org/rtk-query/comparison
[rtk-query-bundle-size]: https://redux-toolkit.js.org/rtk-query/comparison#bundle-size
[bp-rtk]: https://badgen.net/bundlephobia/minzip/@reduxjs/toolkit?label=💾
[bp-rtk-query]: https://badgen.net/bundlephobia/minzip/@reduxjs/toolkit?label=💾
[gh-rtk-query]: https://github.com/reduxjs/redux-toolkit
[stars-rtk-query]: https://img.shields.io/github/stars/reduxjs/redux-toolkit?label=🌟
[bpl-rtk]: https://bundlephobia.com/result?p=@reduxjs/toolkit
[bpl-rtk-query]: https://bundlephobia.com/package/@reduxjs/toolkit
[react-router]: https://github.com/remix-run/react-router
[bp-react-router]: https://badgen.net/bundlephobia/minzip/react-router-dom?label=💾
[gh-react-router]: https://github.com/remix-run/react-router
[stars-react-router]: https://img.shields.io/github/stars/remix-run/react-router?label=%F0%9F%8C%9F
[bpl-react-router]: https://bundlephobia.com/result?p=react-router-dom
[bp-history]: https://badgen.net/bundlephobia/minzip/history?label=💾
[bpl-history]: https://bundlephobia.com/result?p=history
