## 组建暴露方法 useImperativeHandle
此方法可以实现在组建的实例上绑定一些方法，可以让我们组建在被ref获取的时候直接调用上面绑定的方法，类似于vue 的defineExporce 但是可能定义端会更复杂，采用了 forwardRef 装饰器的形式，对我们原来返回函数进行扩展暴露方法功能。
[https://react.dev/reference/react/useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)
Use.js
```
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```
MyInput.js
```
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

```
## useMemo
类似于vue的computed 属性,其会对返回值进行缓存，不同的是其依赖不会自动收集，需要我们自己在第二个参数内加入需要依赖的state，如果为空则组建每一次更新都会调用, 如果为空数组则 `[]`只会初始化的时候调用一次。
```
const  [value, setValue] = useState(0)
const count = useMemo(() => {
	return value + 10
}, [value])
```
## state的理解
setState: 调用最新值问题：react18之前在生命周期函数和合成事件中表现为异步，在原生事件中和setTimeout中表现为同步。 在react18优化批处理之后，在任何地方调用setState都会批处理，因此都表现为异步。

## ref的使用
ref不但可以当作用于获取dom节点，还可以用于定义持久化的变量，但是其**不会触发响应式的更新,** 如下定时器不会被重复创建，而是只会在第一次创建一次。
```markdown
export function MyDom (){
	const myTime = useRef(setTimeout(() => console.log('test'), 2000)
 	return <div>123</div>
}
```
### ref的类型
**div: **
如果获取dom节点，useRef 默认值必须是null，不然类型就报错。
```javascript
const formRef = useRef<HTMLDivElement | null>(null);

<div className="page-fund-form" ref={formRef}>
</div>
```
**变量: **
```javascript
const timeoutRefId = useRef<number | null>(null);
const timeoutRefId = setTimeout(() => {
  // ...
});
```
组建：
类组建直接可以当作useRef的范型。
funtion组建必须组建内手动定义ref类型并暴露。
```javascript
// class 组建
import PageBoundary from '@/components/page-boundary';
...
const pageOutletRef = useRef<PageBoundary>(null);
return ( <PageBoundary ref={pageOutletRef}></PageBoundary>)

// function 组建
export interface PageBoundaryRef {
  handleData: () => void
}

import PageBoundary, { PageBoundaryRef } from '@/components/page-boundary';
...
const pageOutletRef = useRef<PageBoundaryRef>(null);
return ( <PageBoundary ref={pageOutletRef}></PageBoundary>)
```
```jsx
import { Drawer } from '@alifd/next';
import { forwardRef, LegacyRef, useEffect, useRef, useState } from 'react';

forwardRef(function DrawerPro(props: DrawerProProps, ref: LegacyRef<Drawer>) {
  ...
}
```
## 组建继承
使用 ...props 和 forwardRef 完全继承一个组建的props属性和ref绑定方法
```tsx
import React, { forwardRef } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const MySelect = forwardRef((props, ref) => {
  const { /* 需要继承的 props，例如 value, onChange, disabled 等 */ ...restProps } = props;

  return (
    <Select ref={ref} {...restProps}>
      {/* 渲染选项 */}
      <Option value="option1">Option 1</Option>
      <Option value="option2">Option 2</Option>
      <Option value="option3">Option 3</Option>
    </Select>
  );
});

export default MySelect;

```
## 惰性初始化
这样初始只会计算一次，并不会每次都重新进行计算。
```javascript
const initCount = () => {
    console.log('initCount');
    return 2*2*2;
}
const [count, setCount] = useState(()=>{
    return initCount();
});
```
## 多次更新state
```javascript
setCount((count)=> count+1)
setCount((count)=> count+1)
setCount((count)=> count+1)

<div>{ count }</div>   // 渲染 3 只执行一次
```
## TS类型

1. input 事件 e.target.value 
```typescript
onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
onMouseEnter: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
onFocus: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
onInput: (e: React.MouseEvent<HTMLInputElement, Element>) => void;
```

2. 获取子组建ref
```typescript
import { DatePicker2 } from '@alifd/next'
ref: React.LegacyRef<DatePicker2>
```



## 问题汇总：

1. && 问题

在使用&&时切记左侧必须时boolean类型，不可以是number类型，这样容易出现显示 0的问题
