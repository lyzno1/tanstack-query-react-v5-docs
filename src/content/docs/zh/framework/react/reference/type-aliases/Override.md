---
id: Override
title: Override
---


```ts
type Override<TTargetA, TTargetB> = { [AKey in keyof TTargetA]: AKey extends keyof TTargetB ? TTargetB[AKey] : TTargetA[AKey] };
```

定义于： [packages/query-core/src/types.ts:31](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L31)

## 类型参数

### TTargetA

`TTargetA`

### TTargetB

`TTargetB`
