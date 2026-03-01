---
id: installation
title: Installation
---

<!--
translation-source-path: framework/react/installation.md
translation-source-ref: v5.90.3
translation-source-hash: 8bb3ab5c4ea0955dfe783bdf8b495ad9eb06337d99560a1ed25d3e86c6383d6a
translation-status: translated
-->


你可以通过 [NPM](https://npmjs.com/) 安装 React Query，
也可以通过 [ESM.sh](https://esm.sh/) 的传统 `<script>` 方式使用。

### NPM

```bash
npm i @tanstack/react-query
```

or

```bash
pnpm add @tanstack/react-query
```

or

```bash
yarn add @tanstack/react-query
```

or

```bash
bun add @tanstack/react-query
```

React Query 兼容 React v18+，并可用于 ReactDOM 和 React Native。

> 想在下载前先试试？可以先运行 [simple](../examples/simple) 或 [basic](../examples/basic) 示例！

### CDN

如果你没有使用模块打包器或包管理器，也可以通过支持 ESM 的 CDN（如 [ESM.sh](https://esm.sh/)）使用该库。只需在 HTML 文件底部添加 `<script type="module">` 标签：

```html
<script type="module">
  import React from 'https://esm.sh/react@18.2.0'
  import ReactDOM from 'https://esm.sh/react-dom@18.2.0'
  import { QueryClient } from 'https://esm.sh/@tanstack/react-query'
</script>
```

> 你可以在[这里](https://react.dev/reference/react/createElement#creating-an-element-without-jsx)查看不使用 JSX 的 React 用法说明。

### 要求

React Query 针对现代浏览器进行了优化。兼容以下浏览器配置：

```
Chrome >= 91
Firefox >= 90
Edge >= 91
Safari >= 15
iOS >= 15
Opera >= 77
```

> 视你的运行环境而定，你可能需要添加 polyfill。若要支持更老的浏览器，需要你自行从 `node_modules` 转译该库。

### 建议

也建议同时使用我们的 [ESLint Plugin Query](../../../eslint/eslint-plugin-query.md)，帮助你在编码时发现 bug 与不一致问题。可通过以下命令安装：

```bash
npm i -D @tanstack/eslint-plugin-query
```

or

```bash
pnpm add -D @tanstack/eslint-plugin-query
```

or

```bash
yarn add -D @tanstack/eslint-plugin-query
```

or

```bash
bun add -D @tanstack/eslint-plugin-query
```
