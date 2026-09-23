---
id: CancelledError
title: CancelledError
---


定义于： [packages/query-core/src/retryer.ts:81](https://github.com/TanStack/query/blob/main/packages/query-core/src/retryer.ts#L81)

获取被取消时（例如调用 `query.cancel()`），`Retryer` 抛出的错误，也会通过 `query.promise` / `mutation` 体现。`revert` 为 `true` 时，调用方会恢复到获取开始前的查询状态，而不展示此错误；`silent` 为 `true` 时，调用方会抑制此错误，改为以触发取消的获取 Promise 继续处理。

## 示例

```ts
query.cancel()

try {
  await query.promise
} catch (error) {
  if (error instanceof CancelledError) {
    // the fetch was cancelled, e.g. via `query.cancel()`
  }
}
```

## 继承

- `Error`

## 构造函数

### 构造函数

```ts
new CancelledError(options?: CancelOptions): CancelledError;
```

定义于： [packages/query-core/src/retryer.ts:84](https://github.com/TanStack/query/blob/main/packages/query-core/src/retryer.ts#L84)

#### 参数

##### options?

[`CancelOptions`](../interfaces/CancelOptions.md)

#### 返回值

`CancelledError`

#### 重写

```ts
Error.constructor
```

## 属性

### cause?

```ts
optional cause: unknown;
```

定义于： node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### 继承自

```ts
Error.cause
```

***

### message

```ts
message: string;
```

定义于： node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

#### 继承自

```ts
Error.message
```

***

### name

```ts
name: string;
```

定义于： node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1074

#### 继承自

```ts
Error.name
```

***

### revert?

```ts
optional revert: boolean;
```

定义于： [packages/query-core/src/retryer.ts:82](https://github.com/TanStack/query/blob/main/packages/query-core/src/retryer.ts#L82)

***

### silent?

```ts
optional silent: boolean;
```

定义于： [packages/query-core/src/retryer.ts:83](https://github.com/TanStack/query/blob/main/packages/query-core/src/retryer.ts#L83)

***

### stack?

```ts
optional stack: string;
```

定义于： node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### 继承自

```ts
Error.stack
```

***

### stackTraceLimit

```ts
static stackTraceLimit: number;
```

定义于： node\_modules/.pnpm/@types+node@22.19.15/node\_modules/@types/node/globals.d.ts:68

`Error.stackTraceLimit` 指定堆栈跟踪收集的堆栈帧数量，无论堆栈由 `new Error().stack` 还是 `Error.captureStackTrace(obj)` 生成。

默认值为 `10`，也可以设为任意有效的 JavaScript 数值。修改后只影响**此后**捕获的堆栈跟踪。

如果设为非数字或负数，堆栈跟踪不会捕获任何帧。

#### 继承自

```ts
Error.stackTraceLimit
```

## 方法

### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

定义于： node\_modules/.pnpm/@types+node@22.19.15/node\_modules/@types/node/globals.d.ts:52

在 `targetObject` 上创建 `.stack` 属性；访问该属性时，会返回表示调用 `Error.captureStackTrace()` 的代码位置的字符串。

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

堆栈跟踪的第一行会以 `${myObject.name}: ${myObject.message}` 开头。

可选的 `constructorOpt` 参数接收一个函数。提供后，生成的堆栈跟踪会省略 `constructorOpt` 及其上方的所有帧。

`constructorOpt` 可用于向用户隐藏错误生成过程的实现细节。例如：

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### 参数

##### targetObject

`object`

##### constructorOpt?

`Function`

#### 返回值

`void`

#### 继承自

```ts
Error.captureStackTrace
```

***

### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

定义于： node\_modules/.pnpm/@types+node@22.19.15/node\_modules/@types/node/globals.d.ts:56

#### 参数

##### err

`Error`

##### stackTraces

`CallSite`[]

#### 返回值

`any`

#### 另请参阅

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### 继承自

```ts
Error.prepareStackTrace
```
