---
id: mutation-property-order
title: 确保 useMutation() 中影响类型推断的属性顺序正确
---

对于以下函数，由于类型推断的原因，传入对象的属性顺序很重要：

- `useMutation()`

正确的属性顺序如下：

- `onMutate`
- `onError`
- `onSettled`

其他所有属性都不依赖类型推断，因此对顺序不敏感。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/mutation-property-order": "warn" */
import { useMutation } from '@tanstack/react-query'

const mutation = useMutation({
  mutationFn: () => Promise.resolve('success'),
  onSettled: () => {
    results.push('onSettled-promise')
    return Promise.resolve('also-ignored') // Promise<string> (should be ignored)
  },
  onMutate: async () => {
    results.push('onMutate-async')
    await sleep(1)
    return { backup: 'async-data' }
  },
  onError: async () => {
    results.push('onError-async-start')
    await sleep(1)
    results.push('onError-async-end')
  },
})
```

此规则的**正确**代码示例：

```tsx
/* eslint "@tanstack/query/mutation-property-order": "warn" */
import { useMutation } from '@tanstack/react-query'

const mutation = useMutation({
  mutationFn: () => Promise.resolve('success'),
  onMutate: async () => {
    results.push('onMutate-async')
    await sleep(1)
    return { backup: 'async-data' }
  },
  onError: async () => {
    results.push('onError-async-start')
    await sleep(1)
    results.push('onError-async-end')
  },
  onSettled: () => {
    results.push('onSettled-promise')
    return Promise.resolve('also-ignored') // Promise<string> (should be ignored)
  },
})
```

## 属性

- [x] ✅ 推荐
- [x] 🔧 可自动修复
