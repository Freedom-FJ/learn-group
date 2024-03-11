## api
### useState
react 会对 `useState`的执行分为`mount`和`update`阶段，而内部用来区分这两个阶段的标识是在每一次执行渲染的方法`renderWithHooks`入参`current`是否绑定了FIber节点。
```javascript
export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes,
): any {
	// 这里省略了很多代码....
    ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;
        
  let children = Component(props, secondArg);
  // 这里省略了很多代码.....
  return children;
}

```
useState()其实是简化版的useReducer()
说这句的意思就是，相比于useReducer，useState这个hook只是在API参数上不一样而已。在内部实现里面，useState也是走的是useReducer那一套机制。具体来说，useState也有自己的reducer，在源码中，它叫basicStateReducer。请看，mount阶段的useState的实现：
```javascript
// react/packages/react-reconciler/src/ReactFiberHooks.new.js

function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // ......
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });
  // .....
}
```
`lastRenderedReducer` 就是一个更新state的方法，但是初始化的时候其是固定的 `basicStateReducer`，用来根据`useState`入参创建对应的state变量。

## 作用域陷阱
个人文章
[https://juejin.cn/post/7331261643342102528](https://juejin.cn/post/7331261643342102528)
