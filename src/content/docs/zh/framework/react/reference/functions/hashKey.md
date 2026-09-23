---
id: hashKey
title: hashKey
---


```ts
function hashKey(queryKey: readonly unknown[]): string;
```

定义于： [packages/query-core/src/utils.ts:284](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L284)

查询键和 mutation 键的默认哈希函数。
将值计算为稳定的哈希值。

## 参数

### queryKey

readonly `unknown`[]

## 返回值

`string`

## 示例

```ts
// Object keys are sorted, so key order doesn't affect the hash:
hashKey(['todos', { page: 1, filter: 'done' }]) // === '["todos",{"filter":"done","page":1}]'
```
