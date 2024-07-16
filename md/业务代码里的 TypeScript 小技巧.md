业务代码里的 TypeScript 小技巧
7月10日发表139次浏览
这篇文章将会极致贯彻实用主义，介绍一些可以直接上手用的 TypeScript 技巧，没有体操，新手友好，不需要了解背后的原理与规则（但也提供了简单介绍），只要对着特定场景套公式就好了，就让我们把事情变得再简单一些吧 :-)

使用 never 类型检查 switch case 语句
在处理可能以多种形式成立的条件时，我们通常会使用 switch case 语句，一个结合 TypeScript 的常见例子是处理枚举的各个成员值：
```ts
declare enum Color {
  Red,
  Yellow,
  Blue,
}

declare let color: Color;

switch (color) {
  case Color.Red:
    // do something
    break;

  case Color.Yellow:
    // do something
    break;

  case Color.Blue:
    // do something
    break;

  default:
    break;
}
```
目前为止没什么问题，但如果你哪天加了一个枚举成员，但是忘记了对应增加一个处理分支，比如 Color.Pink 没有被处理，那使用粉色的在逃公主们很可能就直接卸载你的应用了。

这种情况下，我们可以使用 TypeScript 的 never 类型，来确保枚举或联合类型的所有分支都被处理，比如上面的例子：
```ts
declare enum Color {
  Red,
  Yellow,
  Blue,
  Pink,
}

declare let color: Color;

switch (color) {
  case Color.Red:
    // do something
    break;

  case Color.Yellow:
    // do something
    break;

  case Color.Blue:
    // do something
    break;

  default:
    // 不能将类型“Color”分配给类型“never”。
    let exhaustiveCheck: never = color;

    break;
}
```
相比起在 default 分支中 throw new Error('Unhandled color') ，使用 never 类型进行检查，能够在开发阶段（最晚也就是构建阶段）就提前警示可能的错误。

公式：
```ts
let exhaustiveCheck: never = color;
```
实现原理：

在 switch case 或 if else 语句中，随着变量的类型成员不断被对应的分支认领，其类型会在后续的代码控制流中被移除，当所有类型成员都被移除时，TypeScript 会用 never 类型描述其类型，而 never 类型的变量无法被赋给除了 never 类型以外的值。

因此，在这个例子中，如果有遗漏的类型分支，那么 color 的类型就不会被描述为 never，就会导致类型不兼容的错误。

使用互斥类型替代联合类型
我们经常使用联合类型描述一组相近的实体类型，比如我们希望一个变量要么符合游客 Visitor 类型，要么符合注册用户 Registered 类型，不允许同时符合（即同时拥有 referer 与 email 这两个属性）。一般我们会想到使用联合类型 User：
```ts
interface Visitor {
  referer: string;
}

interface Registered {
  email: string;
}

type User = Visitor | Registered;
```
但这其实是个误区，因为联合类型不会约束「不能同时符合」这一点：
```ts
const user: User = {
  referer: 'www.google.com',
  email: 'linbudu@qq.com',
};
```
这可能会导致后续的代码处理出现问题，比如可能有判断 user.email 存在就认为它是已注册用户的逻辑。

为了表示「不能同时拥有」，我们可以使用互斥类型 XOR：
```ts
type XORUser = XOR<Visitor, Registered>;

// 属性“email”的类型不兼容。
const user1: XORUser = {
  referer: 'www.google.com',
};

user1.email; // undefined
user1.email = 'linbudu@qq.com'; // X

// 属性“email”的类型不兼容。
const user2: XORUser = {
  referer: 'www.google.com',
  email: 'linbudu@qq.com',
};
```
XOR 的两个类型参数表示这两个类型互斥，因此你也可以实现「要么同时存在，要么同时不存在」的属性绑定，只需要为其中一个参数指定 {} 类型即可。
```ts
interface Registered {
  email: string;
  registerTime: number;
  level: number;
}

type XORStruct = XOR<{}, Registered>;

const val1: XORStruct = {}; // √

// X
const val2: XORStruct = {
  email: 'linbudu@qq.com',
};

// √
const val3: XORStruct = {
  email: 'linbudu@qq.com',
  registerTime: Date.now(),
  level: 9999,
};
```
公式：
```ts
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);
```
使用：
```ts
type XORType = XOR<Type1, Type2>;

// 实现三个类型彼此互斥
type XORType2 = XOR<XORType, Type3>;
```
实现原理：

通过 Exclude ，即差集类型，声明两个类型相对的互斥结构。
通过 never 类型来禁止一个属性存在。
保留联合类型的提示
在开发组件时，一个常见的场景是某个属性既可以有一组预设的值，又可以是任意的同类型值，如：
```ts
type Size = 'mini' | 'middle' | 'large';

let size1: Size = 'mini';
// 不能将类型“"200px"”分配给类型“Size”。
let size2: Size = '200px';
```
这种时候怎么描述类型就有点矛盾了，我又想提供字面量联合类型的提示，又想支持任意的字符串类型，应该怎么做？如果直接 Size | string，那么 Size 中的联合类型会被合并进 string，导致最后类型描述为 string 类型。

这里有个小 trick，可以这么做：
```ts
type PresetSize = 'mini' | 'middle' | 'large';

type Size = PresetSize | (string & {});

let size1: Size = 'mini';
let size2: Size = '200px';
```
公式：

请直接复制这个工具类型：
```ts
type SmartLiteral<T extends keyof any> = T | (string & {});
使用：

type SmartLiteral<T extends keyof any> = T | (string & {});

type PresetSize = 'mini' | 'middle' | 'large';
type Size = SmartLiteral<PresetSize>;

let size1: Size = 'mini';
let size2: Size = '200px';
```
实现原理：

首先，string & {} 这个类型等价于 string 类型，可参考 TypeScript 4.8 版本中 - 交叉类型与联合类型的类型收窄增强 中的介绍，而与空对象进行交叉类型，又确保了它在联合类型中不会被视为其它字面量类型的父类型，从而避免了类型合并。

satisfies 关键字
satisfies 关键字引入于 TypeScript 4.9 版本，用于实现「使用类型约束值，但仍然使用值本身推导的类型」的效果。
```ts
type Colors = 'red' | 'green' | 'blue';
type RGB = [number, number, number];

type Palette = Record<Colors, string | RGB>;

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Palette;

// string
palette.green.startsWith('#'); // √
// [number, number, number]
palette.red.find(() => true); // √
// [number, number, number];
palette.blue.entries(); // √
```
在这个例子中，我们要求变量 palette 的类型满足 Palette 结构，同时没有像类型断言或类型标注的效果一样（标注为 Palette 类型，或断言到 Palette 类型），将变量类型修改为了 Palette 类型，而是继续保留了其原始推导出的字面量类型结构。

关于 satisfies 、类型标注、类型断言与隐式类型推导的差异，请阅读：TypeScript 4.9 beta: satisfies 操作符。

模板字符串类型的排列组合
当你希望获得一组规律固定，可由排列组合得到的联合类型时，可以使用模板字符串类型的插槽组合特性：
```ts
type Software = 'WeChat' | 'AliPay' | 'LOLM';
type Platform = 'Android' | 'iOS' | 'HarmonyOS';
type VersionTag = 'debug' | 'stable' | 'nightly';

type Products = `${Software}-${Platform}-${VersionTag}`
```

使用重映射快速修改接口
如果你希望在一个已有的接口基础上，通过对其属性名的修改获得一个新的接口，举例来说，当你有一个属性为 name | age | job 的接口类型，你希望能基于其派生出一个属性为 updatedName | updatedAge | updatedJob 的接口类型，这样一来在原接口属性发生变化时，你无需进行手动处理。

对于这种场景，你可以使用模板字符串类型的重映射（re-mapping）特性：
```ts
interface User {
  name: string;
  age: number;
  job: string;
}

// {
//   updatedName: string;
//   updatedAge: number;
//   updatedJob: string;
// }
type UpdatedUser = {
  [K in keyof User as `updated${Capitalize<K>}`]: User[K];
};
```
公式：
```ts
type DerivedStruct<Struct extends object> = {
  [K in keyof Struct as `updated${Capitalize<K & string>}`]: Struct[K];
};

type UpdatedUser2 = DerivedStruct<User>;
```
实现原理：

重映射，索引类型签名中 as 开始的部分，能够在索引类型映射时将其修改为一个新的字符串类型值。
Capitalize 工具类型，随模板字符串类型一同引入的内置工具类型，功能是将此字符串类型的首字母大写。
K & string，通过交叉类型的结果同时满足其类型成员的定义，确保类型符合 Capitalize 的泛型类型约束。
In Deep:

如果接口中只有一部分属性需要进行处理，应该怎么办？当然可以实现一个 DerivedStructFromProperties ，然后再开放一个参数来确定需要处理的属性，但这样又变成需要手动处理了。更好的方式是拆分你的接口：
```ts
interface UserDetail {}
interface UserRelation {}
interface UserLevel {}

interface User extends UserDetail, UserRelation, UserLevel {}

interface UpdatedUser
  extends DerivedStruct<UserDetail>,
    UserRelation,
    UserLevel {}
```
其中 UserDetail 即为需要处理的属性集合。

提取类型
某些时候我们可能会遇到这么个情况，某个三方的 npm 包，导出了类型 A，其中引用了类型 B（但没有导出），而现在我们需要的就是类型 B。

这种时候我们自己使用 infer 关键字来从类型 A 提取类型 B，常见的有这么几种：

提取数组类型的元素类型
```ts
type ArrayElementType<T extends any[]> = T extends (infer U)[] ? U : never;

type UserList = Array<{
  id: number;
  name: string;
  age: number;
}>;

// {
//   id: number;
//   name: string;
//   age: number;
// }
type User = ArrayElementType<UserList>;
```
提取 Promise 的值类型
```ts
type QueryUserResponse = Promise<{
  id: string;
  name: string;
  email: string;
}>;

// {
//   id: string;
//   name: string;
//   email: string;
// }
type User = Awaited<QueryUserResponse>;
```
Awaited 是 TypeScript 内置的工具类型，可以用于提取一个 Promise resolve 的值类型。

提取入参类型与返回值类型
```ts
interface User {}

interface UpdatedUser extends User {}

// 仅导出了函数
export function updateUser(input: User): UpdatedUser {}

// User
type InputUser = Parameters<typeof updateUser>[0];

// UpdatedUser
type OutputUser = ReturnType<typeof updateUser>;
```
Parameters、ReturnType 都是内置的工具类型，分别用于提取函数的参数类型与返回类型值。

携带泛型的 React 组件
在 List / Waterfall 这一类组件中，常见的设计是由 dataSource 属性接受数据源，再由 renderItem 属性负责遍历 dataSource 生成内部子元素，这也就意味着应该让 dataSource 的类型能够传递到 renderItem 中，如：
```ts
import React from 'react';

function foo() {
  return (
    <Scroller
      dataSource={[5, 9, 9]}
      // item 为 number 类型
      renderItem={(item) => {
        return <div>{item.toFixed()}</div>;
      }}
    />
  );
}
```
要实现以上的效果，你可以使用携带泛型的接口结构，声明组件类型：
```ts
import React from 'react';

interface ScrollerProps<TData = any> {
  dataSource: TData[];
  renderItem?: (item: TData) => React.ReactElement;
}

export interface GenericTypingWrapper {
  <TInputData = any>(props: ScrollerProps<TInputData>): React.ReactElement;
}

const List: GenericTypingWrapper = ({ dataSource }) => {
  return <></>;
};
```
如果你希望在组件编写时使用 React.FC，那么可以在导出组件时使用类型断言修正类型：
```ts
const Scroller: React.FC<ScrollerProps> = ({ dataSource }) => {
  return <></>;
};

export default Scroller as GenericTypingWrapper;
```