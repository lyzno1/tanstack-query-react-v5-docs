---
id: InfiniteQueryObserverResult
title: InfiniteQueryObserverResult
---


```ts
type InfiniteQueryObserverResult<TData, TError> = 
  | DefinedInfiniteQueryObserverResult<TData, TError>
  | InfiniteQueryObserverLoadingErrorResult<TData, TError>
  | InfiniteQueryObserverLoadingResult<TData, TError>
  | InfiniteQueryObserverPendingResult<TData, TError>
| InfiniteQueryObserverPlaceholderResult<TData, TError>;
```

定义于： [packages/query-core/src/types.ts:1217](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1217)

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)
