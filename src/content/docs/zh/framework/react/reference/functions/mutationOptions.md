---
id: mutationOptions
title: mutationOptions
redirect_from:
  - framework/react/reference/mutationOptions
---

## 调用签名

```ts
function mutationOptions<TData, TError, TVariables, TOnMutateResult>(options: WithRequired<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">): WithRequired<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">;
```

定义于： [packages/react-query/src/mutationOptions.ts:33](https://github.com/TanStack/query/blob/main/packages/react-query/src/mutationOptions.ts#L33)

通常，所有能够传给 `useMutation` 的选项都可以传给 `mutationOptions`。此重载要求提供
`mutationKey`，以便之后（例如通过 `useMutationState`）查找该 mutation。

### 类型参数

#### TData

`TData` = `unknown`

#### TError

`TError` = `Error`

#### TVariables

`TVariables` = `void`

#### TOnMutateResult

`TOnMutateResult` = `unknown`

### 参数

#### options

[`WithRequired`](../type-aliases/WithRequired.md)\<[`UseMutationOptions`](../interfaces/UseMutationOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

要使用的 mutation 选项，与传给 `useMutation` 的选项完全相同，但 `mutationKey` 为必填项。

### 返回值

[`WithRequired`](../type-aliases/WithRequired.md)\<[`UseMutationOptions`](../interfaces/UseMutationOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

返回同一个选项对象，不做任何更改。

### 另请参阅

使用 [useMutation](useMutation.md) 执行这些选项所描述的 mutation。

### 示例

在其他位置通过 `mutationKey` 查找该 mutation，例如用于全局“正在保存……”指示器：
```tsx
import { mutationOptions, useMutationState } from '@tanstack/react-query'

const createPostOptions = mutationOptions({
  mutationKey: ['posts', 'create'],
  mutationFn: createPost,
})

function SavingIndicator() {
  const isCreatingPost = useMutationState({
    filters: { mutationKey: createPostOptions.mutationKey, status: 'pending' },
  }).length > 0

  return isCreatingPost ? <span>正在保存……</span> : null
}
```

## 调用签名

```ts
function mutationOptions<TData, TError, TVariables, TOnMutateResult>(options: Omit<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">): Omit<UseMutationOptions<TData, TError, TVariables, TOnMutateResult>, "mutationKey">;
```

定义于： [packages/react-query/src/mutationOptions.ts:73](https://github.com/TanStack/query/blob/main/packages/react-query/src/mutationOptions.ts#L73)

通常，所有能够传给 `useMutation` 的选项都可以传给 `mutationOptions`。此重载不要求提供
`mutationKey`——如果之后不需要通过 `mutationKey` 过滤器（例如配合 `useMutationState`）定位该 mutation，
请使用此重载；仍然可以通过 `status` 等其他过滤器观察它。

### 类型参数

#### TData

`TData` = `unknown`

#### TError

`TError` = `Error`

#### TVariables

`TVariables` = `void`

#### TOnMutateResult

`TOnMutateResult` = `unknown`

### 参数

#### options

`Omit`\<[`UseMutationOptions`](../interfaces/UseMutationOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

要使用的 mutation 选项，与传给 `useMutation` 的选项完全相同，但不包含 `mutationKey`。

### 返回值

`Omit`\<[`UseMutationOptions`](../interfaces/UseMutationOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>, `"mutationKey"`\>

返回同一个选项对象，不做任何更改。

### 另请参阅

使用 [useMutation](useMutation.md) 执行这些选项所描述的 mutation。

### 说明

有关通过 `useMutationState` 查找 mutation 的方式，请参阅另一个重载的示例。

### 示例

```tsx
import { mutationOptions, useMutation } from '@tanstack/react-query'

export const createPostOptions = mutationOptions({
  mutationFn: createPost,
})

function CreatePost() {
  const mutation = useMutation(createPostOptions)
  return <button onClick={() => mutation.mutate({ title: 'Hello' })}>创建</button>
}
```
