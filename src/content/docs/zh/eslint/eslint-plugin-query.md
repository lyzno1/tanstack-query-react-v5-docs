---
id: eslint-plugin-query
title: ESLint Plugin Query
---

<!--
translation-source-path: eslint/eslint-plugin-query.md
translation-source-ref: v5.90.3
translation-source-hash: 77b8f7f8fe843c2cc26d4f29284272e832c54b480cfbbd3051f2aaa7262f7dc0
translation-status: translated
-->


TanStack Query 自带了专用的 ESLint 插件。这个插件用于强制执行最佳实践，并帮助你避免常见错误。

## 安装

该插件是一个需要单独安装的包：

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

## Flat Config（`eslint.config.js`）

### 推荐配置

若要启用此插件的所有推荐规则，请添加以下配置：

```js
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  ...pluginQuery.configs['flat/recommended'],
  // Any other config...
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
  // Any other config...
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

- [@tanstack/query/exhaustive-deps](../exhaustive-deps.md)
- [@tanstack/query/no-rest-destructuring](../no-rest-destructuring.md)
- [@tanstack/query/stable-query-client](../stable-query-client.md)
- [@tanstack/query/no-unstable-deps](../no-unstable-deps.md)
- [@tanstack/query/infinite-query-property-order](../infinite-query-property-order.md)
- [@tanstack/query/no-void-query-fn](../no-void-query-fn.md)
