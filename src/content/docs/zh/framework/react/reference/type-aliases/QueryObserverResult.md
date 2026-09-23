---
id: QueryObserverResult
title: QueryObserverResult
---


```ts
type QueryObserverResult<TData, TError> = 
  | DefinedQueryObserverResult<TData, TError>
  | QueryObserverLoadingErrorResult<TData, TError>
  | QueryObserverLoadingResult<TData, TError>
  | QueryObserverPendingResult<TData, TError>
| QueryObserverPlaceholderResult<TData, TError>;
```

定义于： [packages/query-core/src/types.ts:1056](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1056)

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)
