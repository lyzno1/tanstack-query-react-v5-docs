---
id: MutationObserver
title: MutationObserver
---


定义于： [packages/query-core/src/mutationObserver.ts:38](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationObserver.ts#L38)

观察单个 mutation 并由其派生 `MutationObserverResult`。`useMutation` 等框架 Hook 每次调用会创建一个 `MutationObserver`，在重新渲染期间保持其稳定，选项变化时调用 `setOptions`，订阅更新以重新渲染，并读取 `getCurrentResult()` 作为返回值。调用 `mutate()` 会在 `MutationCache` 中创建新的底层 `Mutation` 并执行。

## 示例

```ts
const observer = new MutationObserver(queryClient, {
  mutationFn: (variables: { title: string }) => addPost(variables),
})
```

## 继承

- `Subscribable`\<`MutationObserverListener`\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>\>

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TVariables

`TVariables` = `void`

### TOnMutateResult

`TOnMutateResult` = `unknown`

## 构造函数

### 构造函数

```ts
new MutationObserver<TData, TError, TVariables, TOnMutateResult>(client: QueryClient, options: MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>): MutationObserver<TData, TError, TVariables, TOnMutateResult>;
```

定义于： [packages/query-core/src/mutationObserver.ts:58](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationObserver.ts#L58)

#### 参数

##### client

[`QueryClient`](QueryClient.md)

##### options

[`MutationObserverOptions`](../interfaces/MutationObserverOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

#### 返回值

`MutationObserver`\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

#### 重写

```ts
Subscribable<
  MutationObserverListener<TData, TError, TVariables, TOnMutateResult>
>.constructor
```

## 属性

### options

```ts
options: MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>;
```

定义于： [packages/query-core/src/mutationObserver.ts:46](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationObserver.ts#L46)

## 方法

### getCurrentResult()

```ts
getCurrentResult(): MutationObserverResult<TData, TError, TVariables, TOnMutateResult>;
```

定义于： [packages/query-core/src/mutationObserver.ts:155](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationObserver.ts#L155)

返回观察者的当前结果，由被观察的 mutation 状态派生。如果尚未创建 mutation（例如首次调用 `mutate()` 前或调用 `reset()` 后），则返回默认的 `idle` 状态。

#### 返回值

[`MutationObserverResult`](../type-aliases/MutationObserverResult.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

***

### hasListeners()

```ts
hasListeners(): boolean;
```

定义于： [packages/query-core/src/subscribable.ts:41](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L41)

至少注册了一个监听器时返回 `true`；所有监听器都取消订阅后返回 `false`。

#### 返回值

`boolean`

#### 继承自

```ts
Subscribable.hasListeners
```

***

### mutate()

```ts
mutate(variables: TVariables, options?: MutateOptions<TData, TError, TVariables, TOnMutateResult>): Promise<TData>;
```

定义于： [packages/query-core/src/mutationObserver.ts:207](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationObserver.ts#L207)

根据观察者当前选项，在 `MutationCache` 中创建新的 `Mutation`，将观察者从之前的 mutation 移除，订阅新 mutation，并用给定变量执行。

每次调用时可选的 `options`（`onSuccess` / `onError` / `onSettled`）会在 mutation 结束后触发，此外观察者自身选项中定义的回调也会执行。

#### 参数

##### variables

`TVariables`

##### options?

[`MutateOptions`](../interfaces/MutateOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

#### 返回值

`Promise`\<`TData`\>

#### 示例

```ts
await observer.mutate(
  { title: 'New post' },
  { onSuccess: (data) => console.log(data) },
)
```

***

### reset()

```ts
reset(): void;
```

定义于： [packages/query-core/src/mutationObserver.ts:180](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationObserver.ts#L180)

将观察者从当前 mutation（如果有）移除，并将观察结果重置为默认的 `idle` 状态。

这不会取消正在执行的 mutation：mutation 仍会运行到结束，自己的回调仍会触发；但此观察者不再反映其状态，后续调用 `mutate()` 会创建全新的 mutation。

#### 返回值

`void`

#### 示例

```ts
observer.reset()
```

#### 另请参阅

[MutationObserver#mutate](#mutate)

***

### setOptions()

```ts
setOptions(options: MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>): void;
```

定义于： [packages/query-core/src/mutationObserver.ts:96](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationObserver.ts#L96)

更新观察者的选项。

如果新旧 `mutationKey` 均已定义且值不同，会重置观察者并从原 mutation 移除；否则，若当前观察的 mutation 仍处于 `pending`，也会原地更新该 mutation 的选项。

#### 参数

##### options

[`MutationObserverOptions`](../interfaces/MutationObserverOptions.md)\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

#### 返回值

`void`

#### 示例

```ts
observer.setOptions({
  mutationFn: (variables: { title: string }) => addPost(variables),
  onSuccess: (data) => console.log(data),
})
```

***

### subscribe()

```ts
subscribe(listener: MutationObserverListener): () => void;
```

定义于： [packages/query-core/src/subscribable.ts:27](https://github.com/TanStack/query/blob/main/packages/query-core/src/subscribable.ts#L27)

注册一个监听器，在此对象每次发出更新通知时调用。返回值是移除该监听器的函数；调用它即可停止监听。基类不会自行移除监听器，但某些子类会在 `destroy()` 中清除全部监听器。

#### 参数

##### listener

`MutationObserverListener`

每次更新时调用，参数由子类传给订阅者。

#### 返回值

```ts
(): void;
```

##### 返回值

`void`

#### 示例

```ts
const unsubscribe = subscribable.subscribe(() => {
  // react to the update
})

unsubscribe()
```

#### 继承自

```ts
Subscribable.subscribe
```
