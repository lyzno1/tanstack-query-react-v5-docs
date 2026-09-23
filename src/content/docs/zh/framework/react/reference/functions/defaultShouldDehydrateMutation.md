---
id: defaultShouldDehydrateMutation
title: defaultShouldDehydrateMutation
---


```ts
function defaultShouldDehydrateMutation(mutation: Mutation): boolean;
```

定义于： [packages/query-core/src/hydration.ts:178](https://github.com/TanStack/query/blob/main/packages/query-core/src/hydration.ts#L178)

`dehydrate` 使用的默认 `shouldDehydrateMutation` 谓词。只对当前处于暂停状态的 mutation 执行 dehydrate（例如离线时因 `networkMode` 暂停）。

## 参数

### mutation

[`Mutation`](../classes/Mutation.md)

## 返回值

`boolean`
