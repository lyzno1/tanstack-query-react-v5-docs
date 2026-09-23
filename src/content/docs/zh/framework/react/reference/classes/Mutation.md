---
id: Mutation
title: Mutation
---


定义于： [packages/query-core/src/mutation.ts:135](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L135)

表示一次 mutation 尝试。`Mutation` 保存其选项、状态（数据、错误和执行状态）以及当前订阅它的 `MutationObserver`。

实例由 `MutationCache` 在内部创建和管理。应用代码通常通过 `QueryClient` 或 `useMutation` 等框架 Hook 间接操作 mutation。若要检查缓存状态，也可通过 `mutationCache.find()` / `getAll()` 直接获取 `Mutation` 实例。

## 示例

```ts
const mutationCache = queryClient.getMutationCache()

const mutation = mutationCache.find({ mutationKey: ['addPost'] })
```

## 继承

- `Removable`

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TVariables

`TVariables` = `unknown`

### TOnMutateResult

`TOnMutateResult` = `unknown`

## 构造函数

### 构造函数

```ts
new Mutation<TData, TError, TVariables, TOnMutateResult>(config: MutationConfig<TData, TError, TVariables, TOnMutateResult>): Mutation<TData, TError, TVariables, TOnMutateResult>;
```

定义于： [packages/query-core/src/mutation.ts:152](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L152)

#### 参数

##### config

`MutationConfig`\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

#### 返回值

`Mutation`\<`TData`, `TError`, `TVariables`, `TOnMutateResult`\>

#### 重写

```ts
Removable.constructor
```

## 属性

### gcTime

```ts
gcTime: number;
```

定义于： [packages/query-core/src/removable.ts:11](https://github.com/TanStack/query/blob/main/packages/query-core/src/removable.ts#L11)

#### 继承自

```ts
Removable.gcTime
```

***

### mutationId

```ts
readonly mutationId: number;
```

定义于： [packages/query-core/src/mutation.ts:143](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L143)

***

### options

```ts
options: MutationOptions<TData, TError, TVariables, TOnMutateResult>;
```

定义于： [packages/query-core/src/mutation.ts:142](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L142)

***

### state

```ts
state: MutationState<TData, TError, TVariables, TOnMutateResult>;
```

定义于： [packages/query-core/src/mutation.ts:141](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L141)

## 访问器

### meta

#### Getter 签名

```ts
get meta(): Record<string, unknown> | undefined;
```

定义于： [packages/query-core/src/mutation.ts:179](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L179)

mutation 选项中提供的 `meta` 对象（如果有）。

##### 返回值

`Record`\<`string`, `unknown`\> \| `undefined`

## 方法

### continue()

```ts
continue(): Promise<unknown>;
```

定义于： [packages/query-core/src/mutation.ts:243](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L243)

恢复当前暂停或从仍处于 `pending` 的 dehydrate 状态中还原的 mutation。

- 如果此 mutation 有活跃的重试器（例如因网络模式或 scope 队列而在执行途中暂停），则恢复该重试器。
- 否则，如果 mutation 仍处于 `pending`（例如执行期间被 dehydrate，但此实例没有重试器），则用上次记录的变量再次调用 `execute`。
- 否则，mutation 已结束，此调用会立即完成，不会再次执行。

#### 返回值

`Promise`\<`unknown`\>

#### 示例

```ts
// typically driven by reconnect handling, e.g. queryClient.resumePausedMutations()
const mutation = mutationCache.find({ mutationKey: ['addPost'] })
await mutation?.continue()
```

#### 另请参阅

[Mutation#execute](#execute)

***

### destroy()

```ts
destroy(): void;
```

定义于： [packages/query-core/src/removable.ts:19](https://github.com/TanStack/query/blob/main/packages/query-core/src/removable.ts#L19)

清除等待中的垃圾回收定时器，使此条目不再被计划移除。子类也可以重写此方法以释放持有的资源；例如 `Query` 还会取消正在进行的获取。

#### 返回值

`void`

#### 继承自

```ts
Removable.destroy
```

***

### execute()

```ts
execute(variables: TVariables): Promise<TData>;
```

定义于： [packages/query-core/src/mutation.ts:284](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutation.ts#L284)

通过重试器以给定变量运行 mutation 函数，并推进其状态和生命周期回调，直到 mutation 结束。

如果调用 `execute` 时 mutation 已经处于 `pending`（即从 dehydrate 状态恢复时仍在执行），则跳过 `onMutate`，派发 `continue` action 以解除暂停。否则先派发 `pending` action，再依次等待 mutation 缓存的 `onMutate` 和 mutation 自身的 `onMutate` 选项，并保存得到的上下文。

随后运行 mutation 函数，其行为受 `retry`、`retryDelay`、`networkMode` 和 mutation 缓存基于 scope 的串行机制控制。成功时，先执行缓存级 `onSuccess` / `onSettled`，再执行 mutation 自身的对应选项，然后派发 `success` action 并返回数据。失败时，`onError` / `onSettled` 也按先缓存级、后 mutation 选项的顺序执行；这四个回调分别捕获错误，避免回调抛出的错误掩盖原始错误。最后派发 `error` action 并重新抛出原始错误。

#### 参数

##### variables

`TVariables`

#### 返回值

`Promise`\<`TData`\>

#### 示例

```ts
// Called internally by `MutationObserver.mutate` and `Mutation.continue` —
// applications normally trigger mutations through those, not this method.
const data = await mutation.execute(variables)
```

#### 另请参阅

[Mutation#continue](#continue)
