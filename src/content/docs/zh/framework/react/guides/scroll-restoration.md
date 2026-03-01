---
id: scroll-restoration
title: 滚动位置恢复
---

<!--
translation-source-path: framework/react/guides/scroll-restoration.md
translation-source-ref: v5.90.3
translation-source-hash: 4ea81187d0fc54ed3a6bab73c525b171847f7ef20817648f8cef92a058bf10f2
translation-status: translated
-->


传统上，在浏览器中返回到之前访问过的页面时，页面会恢复到你离开前的滚动位置。这称为**滚动位置恢复（scroll restoration）**。随着 Web 应用逐渐转向客户端数据获取，这个体验曾经有过退化；但在 TanStack Query 中，这不再是问题。

TanStack Query 默认就能让所有查询（包括分页查询和无限查询）的“滚动位置恢复”开箱即用。原因是查询结果会被缓存，并且在查询渲染时可同步读取。只要查询缓存时间足够长（默认 5 分钟）且尚未被垃圾回收，滚动位置恢复就会始终生效。
