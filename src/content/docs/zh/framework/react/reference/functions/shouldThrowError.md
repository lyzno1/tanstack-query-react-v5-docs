---
id: shouldThrowError
title: shouldThrowError
---


```ts
function shouldThrowError<T>(throwOnError: boolean | T | undefined, params: Parameters<T>): boolean;
```

定义于： [packages/query-core/src/utils.ts:582](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L582)

将 `throwOnError` 选项解析为布尔值。如果它是函数，就用 `params` 调用并返回函数结果；参数可以包含错误，以及由调用方决定的查询或 mutation 等上下文，因此可针对每个错误决定是否抛出。否则，将 `throwOnError` 自身转换为布尔值（`undefined` 为 `false`）。

## 类型参数

### T

`T` *extends* (...`args`: `any`[]) => `boolean`

## 参数

### throwOnError

`boolean` | `T` | `undefined`

### params

`Parameters`\<`T`\>

## 返回值

`boolean`

## 示例

```ts
const throwOnError =
  query.state.error && typeof options.throwOnError === 'function'
    ? shouldThrowError(options.throwOnError, [query.state.error, query])
    : options.throwOnError
```
