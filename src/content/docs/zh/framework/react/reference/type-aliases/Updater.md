---
id: Updater
title: Updater
---


```ts
type Updater<TInput, TOutput> = TOutput | (input: TInput) => TOutput;
```

定义于： [packages/query-core/src/utils.ts:105](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L105)

可以是 `TOutput` 类型的普通值，也可以是接收 `TInput` 并返回 `TOutput` 的函数。例如，`setQueryData` 一类的更新器既可直接接收新数据，也可接收根据旧数据计算新数据的函数。参见 `functionalUpdate`。

## 类型参数

### TInput

`TInput`

### TOutput

`TOutput`

## 示例

```ts
queryClient.setQueryData(['posts'], newPosts)

// Or, using an updater function that receives the current data:
queryClient.setQueryData(['posts'], (oldPosts) =>
  oldPosts ? [...oldPosts, newPost] : oldPosts,
)
```
