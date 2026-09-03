---
id: scroll-restoration
title: 滚动位置恢复
---

<!--
translation-source-path: framework/react/guides/scroll-restoration.md
translation-source-ref: main
translation-source-hash: 5e1e4f165c07e838587a142021fe82f996d6afbd42350e7e55adf99011f9303d
translation-status: translated
-->

传统上，在浏览器中返回到之前访问过的页面时，页面会恢复到你离开前的滚动位置。这称为**滚动位置恢复（scroll restoration）**。随着 Web 应用逐渐转向客户端数据获取，这个体验曾经有过退化；但在 TanStack Query 中，这不再是问题。

TanStack Query 本身并不实现滚动位置恢复，但它消除了 SPA 中导致恢复失效的一个主要原因：重新获取数据引发的 UI 重置。通过将之前获取的数据保留在缓存中（并可选用 `placeholderData`），返回某个页面时便能立即以稳定布局完成渲染。之后由路由器处理滚动恢复时就会更加可靠，例如 React Router 的 `ScrollRestoration`、TanStack Router 的滚动恢复功能，或基于 history 的简单自定义方案。

TanStack Query 默认就能让所有查询（包括分页查询和无限查询）的“滚动位置恢复”开箱即用。原因是查询结果会被缓存，并且在查询渲染时可同步读取。只要查询缓存时间足够长（默认 5 分钟）且尚未被垃圾回收，滚动位置恢复就会始终生效。
