---
id: eslint-plugin-query
title: ESLint Query 插件
---

<!--
translation-source-path: eslint/eslint-plugin-query.md
translation-source-ref: main
translation-source-hash: 9dc5644c65099aee09714ca447f3398c5d07af3c60116b5384259607a831d4bb
translation-status: translated
-->


TanStack Query 自带 ESLint 插件。该插件用于落实最佳实践，并帮助你避免常见错误。

## 安装

该插件是一个需要单独安装的包：

```bash
npm i -D @tanstack/eslint-plugin-query
```

或者

```bash
pnpm add -D @tanstack/eslint-plugin-query
```

或者

```bash
yarn add -D @tanstack/eslint-plugin-query
```

或者

```bash
bun add -D @tanstack/eslint-plugin-query
```

## Flat Config（`eslint.config.js`）

### 推荐配置

若要启用此插件的所有推荐规则，请添加以下配置：

```js
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  ...pluginQuery.configs['flat/recommended'],
  // 其他配置……
]
```

### 推荐的严格配置

`flat/recommended-strict` 配置在 `flat/recommended` 的基础上增加了一些倾向性更强的规则，以便更严格地落实最佳实践。

```js
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  ...pluginQuery.configs['flat/recommended-strict'],
  // 其他配置……
]
```

### 自定义配置

你也可以按需加载插件，只配置想使用的规则：

```js
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  {
    plugins: {
      '@tanstack/query': pluginQuery,
    },
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
    },
  },
  // 其他配置……
]
```

## 传统配置（`.eslintrc`）

### 推荐配置

若要启用此插件的所有推荐规则，请在 `extends` 中添加 `plugin:@tanstack/query/recommended`：

```json
{
  "extends": ["plugin:@tanstack/query/recommended"]
}
```

### 推荐的严格配置

`recommendedStrict` 配置在 `recommended` 的基础上增加了一些倾向性更强的规则：

```json
{
  "extends": ["plugin:@tanstack/query/recommendedStrict"]
}
```

### 自定义配置

或者，在 `plugins` 部分添加 `@tanstack/query`，并配置你想使用的规则：

```json
{
  "plugins": ["@tanstack/query"],
  "rules": {
    "@tanstack/query/exhaustive-deps": "error"
  }
}
```

## 规则

- [@tanstack/query/exhaustive-deps](./exhaustive-deps.md)
- [@tanstack/query/no-rest-destructuring](./no-rest-destructuring.md)
- [@tanstack/query/stable-query-client](./stable-query-client.md)
- [@tanstack/query/no-unstable-deps](./no-unstable-deps.md)
- [@tanstack/query/infinite-query-property-order](./infinite-query-property-order.md)
- [@tanstack/query/no-void-query-fn](./no-void-query-fn.md)
- [@tanstack/query/mutation-property-order](./mutation-property-order.md)
- [@tanstack/query/prefer-query-options](./prefer-query-options.md)
