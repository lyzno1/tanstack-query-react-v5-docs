---
id: comparison
title: 对比 | React Query vs SWR vs Apollo vs RTK Query vs React Router
---

<!--
translation-source-path: framework/react/comparison.md
translation-source-ref: main
translation-source-hash: 5037af0f815d5e76565b865183eb77f28983c4792966a76ca044415e3a1cbce5
translation-status: translated
-->


> 这个对比表尽可能保持准确且中立。如果你使用其中任一库并认为信息可以改进，欢迎通过页面底部的 “Edit this page on Github” 链接提出修改建议（请附上说明或证据）。

特性/能力标识说明：

- ✅ 一等公民支持：内置、开箱即用，无需额外配置或代码
- 🟡 支持，但依赖非官方第三方或社区库/贡献
- 🔶 支持且有文档，但需要额外用户代码实现
- 🛑 官方未支持或未文档化

|                                                    | React Query                              | SWR [_(网站)_][swr]                      | Apollo Client [_(网站)_][apollo]           | RTK-Query [_(网站)_][rtk-query]      | React Router [_(网站)_][react-router]                                     |
| -------------------------------------------------- | ---------------------------------------- | ---------------------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- |
| GitHub 仓库 / Stars                               | [![][stars-react-query]][gh-react-query] | [![][stars-swr]][gh-swr]                 | [![][stars-apollo]][gh-apollo]             | [![][stars-rtk-query]][gh-rtk-query] | [![][stars-react-router]][gh-react-router]                                |
| 平台要求                                           | React                                    | React                                    | React, GraphQL                             | Redux                                | React                                                                     |
| 官方对比页面                                       |                                          | （无）                                   | （无）                                     | [对比页面][rtk-query-comparison]     | （无）                                                                    |
| 支持的查询语法                                     | Promise, REST, GraphQL                   | Promise, REST, GraphQL                   | GraphQL、任意数据源（响应式变量）           | Promise, REST, GraphQL               | Promise, REST, GraphQL                                                    |
| 支持的框架                                         | React                                    | React                                    | React 及其他框架                           | 任意框架                             | React                                                                     |
| 缓存策略                                           | 分层键 → 值                              | 唯一键 → 值                              | 规范化 Schema                              | 唯一键 → 值                          | 嵌套路由 → 值                                                            |
| 缓存键策略                                         | JSON                                     | JSON                                     | GraphQL 查询                               | JSON                                 | 路由路径                                                                  |
| 缓存变化检测                                       | 深度比较键（稳定序列化）                 | 深度比较键（稳定序列化）                 | 深度比较键（不稳定序列化）                 | 键的引用相等（===）                  | 路由变化                                                                  |
| 数据变化检测                                       | 深度比较 + 结构共享                      | 深度比较（通过 `stable-hash`）           | 深度比较（不稳定序列化）                   | 键的引用相等（===）                  | Loader 运行                                                               |
| 数据记忆化                                         | 完整结构共享                             | 标识相等（===）                          | 规范化标识                                 | 标识相等（===）                      | 标识相等（===）                                                           |
| Bundle 大小                                        | [![][bp-react-query]][bpl-react-query]   | [![][bp-swr]][bpl-swr]                   | [![][bp-apollo]][bpl-apollo]               | [![][bp-rtk-query]][bpl-rtk-query]   | [![][bp-react-router]][bpl-react-router] + [![][bp-history]][bpl-history] |
| API 定义位置                                       | 组件、外部配置                           | 组件                                     | GraphQL Schema                             | 外部配置                             | 路由树配置                                                                |
| 查询                                               | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 缓存持久化                                         | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑 仅限活跃路由 <sup>8</sup>                                              |
| 开发工具                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 轮询/定时刷新                                      | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 并行查询                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 依赖查询                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 分页查询                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 无限查询                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 双向无限查询                                       | ✅                                       | 🔶                                       | 🔶                                         | ✅                                   | 🛑                                                                        |
| 无限查询重新获取                                   | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | 🛑                                                                        |
| 滞后查询数据<sup>1</sup>                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 选择器                                             | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | 不适用                                                                    |
| 初始数据                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 滚动恢复                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 缓存操作                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 过期查询淘汰                                       | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 渲染批处理与优化<sup>2</sup>                       | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | ✅                                                                        |
| 自动垃圾回收                                       | ✅                                       | 🛑                                       | 🛑                                         | ✅                                   | 不适用                                                                    |
| 变更 Hook                                          | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 离线变更支持                                       | ✅                                       | 🛑                                       | 🟡                                         | 🛑                                   | 🛑                                                                        |
| 预取 API                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 查询取消                                           | ✅                                       | 🛑                                       | 🛑                                         | 🛑                                   | ✅                                                                        |
| 部分查询匹配<sup>3</sup>                           | ✅                                       | 🔶                                       | ✅                                         | ✅                                   | 不适用                                                                    |
| stale-while-revalidate                             | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| `staleTime` 配置                                   | ✅                                       | 🛑<sup>7</sup>                           | 🛑                                         | ✅                                   | 🛑                                                                        |
| 使用前查询/变更配置<sup>4</sup>                    | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 窗口聚焦时重新获取                                 | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | 🛑                                                                        |
| 网络状态恢复时重新获取                             | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 通用缓存反序列化/再水合                            | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 离线缓存                                           | ✅                                       | 🛑                                       | ✅                                         | 🔶                                   | 🛑                                                                        |
| React Suspense                                     | ✅                                       | ✅                                       | ✅                                         | 🛑                                   | ✅                                                                        |
| 抽象/无关框架核心                                  | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| 变更后自动重新获取<sup>5</sup>                     | 🔶                                       | 🔶                                       | ✅                                         | ✅                                   | ✅                                                                        |
| 规范化缓存<sup>6</sup>                             | 🛑                                       | 🛑                                       | ✅                                         | 🛑                                   | 🛑                                                                        |

### 注释

> **<sup>1</sup> 滞后查询数据** - React Query 提供了在下一次查询加载期间继续显示现有查询数据的能力（类似 Suspense 即将原生提供的 UX）。这对分页 UI 或无限加载 UI 非常关键，因为你不希望每次发起新查询都出现“硬加载”状态。其他库通常不具备这一能力，在新查询加载时会直接进入硬加载（除非该查询已被预取）。

> **<sup>2</sup> 渲染优化** - React Query 的渲染性能非常优秀。默认情况下，它会自动追踪被访问的字段，仅在这些字段变化时才重渲染。若你希望退出该优化，可将 `notifyOnChangeProps` 设为 `'all'`，这样查询每次更新（如有新数据或进入 fetching）都会重渲染组件。React Query 还会对更新做批处理，确保多个组件使用同一查询时应用只重渲染一次。如果你只关心 `data` 或 `error`，可将 `notifyOnChangeProps` 设为 `['data', 'error']` 进一步减少渲染次数。

> **<sup>3</sup> 部分查询匹配** - 由于 React Query 使用确定性的查询键序列化，你可以在不知道每个具体查询键的前提下操作某一组查询。例如，无论变量如何变化，都可以重新获取所有以 `todos` 开头的查询；也可以精确匹配带或不带变量/嵌套属性的查询，甚至通过过滤函数只匹配满足特定条件的查询。

> **<sup>4</sup> 使用前查询配置** - 这是一个“花哨”的说法，指的是在查询和变更真正使用前就预先配置其行为。例如，可先设置完整默认配置，使用时只需 `useQuery({ queryKey })`，而不必每次都传 fetcher 和/或 options。SWR 仅提供该特性的部分能力：可全局预设默认 fetcher，但不能按查询粒度配置，更无法用于变更。

> **<sup>5</sup> 变更后自动重新获取** - 若要在变更发生后实现真正自动重新获取，通常需要 schema（例如 GraphQL 的 schema）以及一套启发式规则，用于帮助库识别 schema 中的实体与实体类型。

> **<sup>6</sup> 规范化缓存** - React Query、SWR 与 RTK-Query 目前均不支持自动规范化缓存。规范化缓存通常指将实体以扁平结构存储，以避免上层数据重复。

> **<sup>7</sup> SWR 的不可变模式** - SWR 提供了 “immutable” 模式，确实可让查询在缓存生命周期内仅获取一次，但它仍没有 staleTime 或条件自动重新验证的概念。

> **<sup>8</sup> React Router 缓存持久化** - React Router 不会缓存当前匹配路由之外的数据。一旦离开路由，该路由数据就会丢失。

[bpl-react-query]: https://bundlephobia.com/result?p=@tanstack/react-query
[bp-react-query]: https://badgen.net/bundlephobia/minzip/@tanstack/react-query?label=💾
[gh-react-query]: https://github.com/TanStack/query
[stars-react-query]: https://img.shields.io/github/stars/TanStack/query?label=%F0%9F%8C%9F
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
