---
id: replaceEqualDeep
title: replaceEqualDeep
---


```ts
function replaceEqualDeep<T>(
   a: unknown, 
   b: T, 
   depth?: number): T;
```

定义于： [packages/query-core/src/utils.ts:340](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L340)

如果 `b` 与 `a` 深度相等，此函数返回 `a`。否则会把 `b` 中与 `a` 深度相等的子项替换为 `a` 中对应的子项。例如，这可用于 JSON 值之间的结构共享。

## 类型参数

### T

`T`

## 参数

### a

`unknown`

### b

`T`

### depth?

`number`

## 返回值

`T`
