

## npm 相关理解

- npm init

![image-20221125151027144](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20221125151027144.png)

```sh
npm init ===> npm create
npx ===> npm exec

npm init vue ===> npm create vue ===> npm exec create-vue ===> npm x create-vue ===> npx create-vue
npm init vite ===> npm create vite ===> npm exec create-vite

@scope 就是可能这个包为 例如 npm init @config/vue 会去找 create-vue 下 config 的最后一个版本 @config/create-vue@latest

npm init <@scope> (same as `npx <@scope>/create`) ===> npm init vue || npx vue/create
npm init [<@scope>/]<name> (same as `npx [<@scope>/]create-<name>`) ===> npm init vue/vue || npx vue/create-vue
```

- npx

```sh
npx tsc --version // 首先当前项目 node_modules  => 全局 => 网络 => 网络如果找不到 可以通过 -p 指定包来执行
npx -p typescript tsc --version
```

- workspaces

```sh
npm init -y -w packages/b --workspace=packages/b  # workspaces: ['packages/a', 'packages/b']
# npm init -y -w=./packages/a -w=./packages/b
npm init -y -w a -w b  # workspaces: { packages: ['a', 'b'] } 同上一样，只不过项目在当前根项目 a b c 而非上面的packages/a
npm init vite ./ -w packages/a # 以 packages/a作为项目，并初始化

npm init -y monorepo-demo
npm init -y -w ./packages/backend
npm i express -S # 在根中 安装express
npm i lodash -w a # 在子项目a 中安装lodash
npm i whistle -w b # 在子项目b 中安装whistle
npm run test -w a # 在当前工作区 运行子项目a中的命令 等同于 cd packages/a && npm run test


npm run test --workspace=a --workspace=b #在当前工作区同时运行子项目a b 中的命令 npm run start -w=a -w=b
npm run test --workspaces #  简写当前工作区同时运行子项目a b  npm run test -ws 当某个子项目没有 test 会对当前子项目报错提示 可通过npm run start -ws --if-present 进行跳过
```

- 常用全局命令

```sh
npm outdated -g # 检查全局包是否有更新
npm list -g --depth 0 # 查看全局安装包`
npm update package -g # 更新全局包
```

- 常用技巧

```sh
npm config --global --list # 获取全局配置
git config --global --unset http.proxy # 配置全局代理 --local 也行，注意影响他人
git config --global --unset http.sslverify # 禁止 ssl 校验
```

## 正则相关

<img src="https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20200826105347640.png"/>

### 字符串实例方法

- String.prototype.replace

```js
// $$ => 美元符号 $ => 匹配子串前面的文本` $' => 匹配子串后面的文本 $& => 匹配子串 $n => 捕获组 $<name> => 命名捕获组
const a = 'abc'.replace('b', "[$'-$&-$`]");
// a[c-b-a]c
console.log(a);

var prices = { p1: '$1.99', p2: '$9.99', p3: '$5.00' };
var template = '<span id="p1"></span>' + '<span id="p2"></span>' + '<span id="p3"></span>';
const reg1 = /(<span\sid=")(?<id>.*?)(">)(<\/span>)/g;
// match 匹配的子串 pn => 匹配捕获组 offst => index string => 原字符串 namedCaptrueGroup => 命名捕获组
const d = template.replace(reg1, function (match, p1, p2, p3, p4, offset, string, namedCaptureGroup) {
  // console.log(arguments);
  return p1 + p2 + p3 + prices[namedCaptureGroup.id] + p4;
});
// <span id="p1">$1.99</span><span id="p2">$9.99</span><span id="p3">$5.00</span>
console.log(d);
```

- String.prototype.split

```js
const a = 'a,  b, c, d'.split(/,\s*/);
// ["a", "b", "c", "d"]
console.log(a);

const b = 'a,  b, c, d'.split(/,\s*/, 2);
// ["a", "b"]
console.log(b);

const c = 'aaa*a*'.split(/a*/);
// ["", "*", "*"]  此外默认是贪婪匹配， a* 会默认尽可能多的匹配 a
console.log(c);

const d = 'aaa**a*'.split(/a*/);
// ["", "*", "*", "*"]
console.log(d);

const e = 'aaa*a*'.split(/(a*)/);
// ["", "aaa", "*", "a", "*"]
console.log(e);
```

### 断言

```js
// 此字符串匹配的是 => 我是你我是你
const reg1 = /(我是你)(?=我是)\1/;

// 此字符串匹配的是 => 我是你我是我是你
const reg2 = /(我是你)(?=我是\1)/;
```

- 正则处理数字

```typescript
function formatCurrency(num) {
  num = typeof num === 'number' ? num : parseFloat(num);
  const [l, r] = num.toFixed(2).split('.');

  // const reg = /\B(?=(\d{3})+$)/g;
  // const reg = /\B(?=(\d{3})+(?!\d))/g;
  // const reg = /\d(?=(\d{3})+$)/g; // 需要替换为 $&,
  // return l.replace(reg, ',') + '.' + r;

  // let endIndex = l.length % 3;
  // const arr = [];
  // arr.push(l.substring(0, endIndex));
  // while (endIndex < l.length) {
  //   arr.push(l.substring(endIndex, (endIndex += 3)));
  // }
  // return arr.join(',') + '.' + r;

  const [left, right] = num.toString().split('.');
  const arr = left.split('');
  for (let i = arr.length - 3; i > 0; i -= 3) arr.splice(i, 0, ',');
  return arr.join('') + (right ? `.${right}` : '');

  const reverseLArr = l.split('').reverse();
  let t = '';
  for (let i = 0; i < reverseLArr.length; i++) {
    t += reverseLArr[i] + ((i + 1) % 3 === 0 && i + 1 !== reverseLArr.length ? ',' : '');
  }
  return t.split('').reverse().join('') + '.' + r;
}
```

```js
// Lookahead assertion => reg(?=exp) => 即reg后面的内容是exp的
let str1 = '后盾人不断分享视频教程，学习后盾人教程提升编程能力。';
let reg1 = /后盾人(?=教程)/;
str1 = str1.replace(reg1, v => 'HJ');
console.log(str1); // 后盾人不断分享视频教程，学习HJ教程提升编程能力。

// Lookbehind assertion => (?<=exp)reg => 即reg前面内容是exp的
let str2 = '后盾人不断分享视频教程，学习后盾人教程提升编程能力。';
let reg2 = /(?<=学习)后盾人/;
str2 = str2.replace(reg2, v => 'HJ');
console.log(str2); // 后盾人不断分享视频教程，学习HJ教程提升编程能力。

// Negative lookahead assertion => reg(?!exp) => 即reg后面内容不是exp的
let str3 = '后盾人不断分享视频教程，学习后盾人教程提升编程能力。';
let reg3 = /后盾人(?!不断)/g;
str3 = str3.replace(reg3, v => v + '系列书箱');
console.log(str3); // 后盾人不断分享视频教程，学习后盾人系列书箱教程提升编程能力。

// Negative lookbehind assertion => (?<!exp)reg => 即reg前面内容不是exp的
let str4 = '后盾人不断分享视频教程，学习后盾人教程提升编程能力。';
let reg4 = /(?<!视频)教程/;
str4 = str4.replace(reg4, v => 'HJ');
console.log(str4); // 后盾人不断分享视频教程，学习后盾人HJ提升编程能力。

// 非捕获取 (?:\d)
```

## 构造函数与类的理解

- 构造函数

实例对象 `(stu)` 的 `__proto__` 指向 构造函数 `(Student)` 的 `prototype`，`prototype` 是一个对象 ，有 `{ constructor, [[prototype]]}` 两个属性，我们要想实现原型方法共享，只需要把 `[[prototype]]` 指向 `Person.prototype` 。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

function Student(name, age, score) {
  Person.call(this, name, age);
  this.score = score;
}
// 1
// Student.prototype = Object.create(Person.prototype);
// Student.prototype.constructor = Student // 让 constructor 保持不变

// 2 推荐这种写法（ES6 类中 constructor 是不可枚举的）
Student.prototype = Object.create(Person.prototype, {
  constructor: { value: Student }
});
// 3  等同于 Student.prototype.__proto__ = Person.prototype
// Object.setPrototypeOf(Student.prototype, Person.prototype);

// ES6 中静态属性和方法也会继承 ===>  Student.__proto__ = Person
Object.setPrototypeOf(Student, Person);
```

- class 类

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Student extends Person {
  constructor(name, age, score) {
    super(name, age);
    this.score = score;
  }
}

const stu = new Student('HJ', 30, 88);
console.log(stu.__proto__ === Student.prototype); // true
console.log(Student.prototype.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true

console.log(Student.__proto__ === Person); // true
console.log(Person.__proto__ === Function.prototype); // true
console.log(Function.prototype === Function.__proto__); // true
console.log(Function.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true

/**
 * 结论一： 所有的实例对象的隐式原型（stu.__proto__）都指向构造该对象的 构造函数的原型（Student.prototype）
 * 结论二： 构造函数的隐式原型（Person.__proto__） 都指向 Function.prototype =>   构造函数 = new Function()
 *          Fumber String Boolean Array Object Function Symbol Map Set EventTarget 的 __proto__ 都指向 Function.prototype
 *          prototype.__proto 都指向 Object.prototype, Object.prototype.__proto__ = null   （万物皆对象）
 * 结论三： Function 的隐式原型 与 显式原型 是相同的   => Function.__proto__ === Function.prototype (鸡生蛋还是蛋生鸡？)
 */
```

- DOM 继承相关

```js
console.log(HTMLDivElement.prototype.__proto__ === HTMLElement.prototype); // HTMLElement.prototype.innerText
console.log(HTMLElement.prototype.__proto__ === Element.prototype); // Element.prototype.innerHTML
console.log(Element.prototype.__proto__ === Node.prototype); // Node.prototype.textContent 元素属于节点
console.log(Node.prototype.__proto__ === EventTarget.prototype);
console.log(EventTarget.prototype.__proto__ === Object.prototype);

console.log(HTMLDivElement.__proto__ === HTMLElement);
console.log(HTMLElement.__proto__ === Element);
console.log(Element.__proto__ === Node);
console.log(Node.__proto__ === EventTarget);
console.log(EventTarget.__proto__ === Function.prototype);
console.log(Function.prototype.__proto__ === Object.prototype);
```

- 构造函数与类的总结

```js
class Person {
  // 私有属性 必须在内的内部先声明  实例对象不能读取 不能解构
  #age;
  constructor(name, age) {
    this.name = name;
    this.#age = age;
    // this.#gender = 'male';  // 报错
  }

  // get 函数会在实例自身 与 原型(Person.prototype)上都存在
  get getInfo1() {
    return this.#age;
  }
  // 只存在于 Person.prototype
  getInfo2() {
    return this.#age;
  }
}
```

```js
// Function 与 Object 的关系
console.log(Object.getPrototypeOf(Function) === Function.prototype); // Function 的 隐式原型 和 显式原型是一样的
console.log(Object.getPrototypeOf(Function.prototype) === Object.prototype); //Function.prototype 是 Object 的实例
console.log(Object.getPrototypeOf(Object) === Function.prototype); // Object 是 Function 的实例
```

- 关于 typescript class 编绎 ES5 解析

![image-20201011214324302](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20201011214324302.png)

```js
let obj1 = { name: 'zhangsan', gender: '男', age: 24 };
let objProxy = new Proxy(obj1, {
  get: function (target, key, receiver) {
    console.log(target); // obj1
    console.log(key); // obj1 key
    console.log(receiver); // objProxy
    // Reflect.has(target,key) 相当于 key in target
    if (Reflect.has(target, key)) {
      return target[key];
    }
    throw new ReferenceError(`该对象上不存在${key}属性`);
  },
  set: function (target, key, value, receiver) {
    if (typeof value === 'string') {
      value = value.trim();
    }
    target[key] = value;
  }
});
console.log(objProxy.name);
console.log(objProxy.sex); // 报错objProxy.sex = ' 男 '
console.log(objProxy.sex);
console.log(obj1);
console.log(objProxy);

function Person(name, age) {
  this.name = name;
  this.age = age;
}
function create(constructor, params) {
  // 1.创建一个空对象，作为将要返回的对象实例
  var obj = {};
  let args = [].slice.call(arguments);
  args.splice(0, 1);
  // 2. 将空对象的原型指向构造函数的原型对象
  Object.setPrototypeOf(obj, constructor.prototype);
  // 3.将空对象赋值给构造函数内部的this关键字，并开始执行构造函数的内部代码
  constructor.apply(obj, args);
  return obj;
}
let obj = create(Person, 'hou', 28);
console.log(obj);
console.log(Object.getPrototypeOf(obj) === Person.prototype);
```

## Object 静态方法及属性深入理解

- 访问器

```js
const obj = {
  log: ['a', 'b', 'c'],
  get Last() {
    if (this.log.length === 0) {
      return undefined;
    }
    return this.log[this.log.length - 1];
  }
};
console.dir(obj);
console.log(obj.Last); // c
```

```js
const language = {
  set current(name) {
    this.log.push(name);
  },
  log: []
};
language.current = 'CN';
language.current = 'EN';
console.log(language); // { log: [ 'CN', 'EN' ] }
console.log(language.current); // undefined

var o = { a: 0 };
Object.defineProperty(o, 'b', {
  set: function (x) {
    this.a = x / 2;
  }
});
console.dir(o);
o.b = 20;
console.log(o.a); // 10
```

`Object.assign(target,...source)`

```js
let obj1 = { a: 1, b: 2 };
let obj2 = Object.assign({}, obj1);
obj1.a = 2;
console.dir(obj1); // { a: 2, b: 2 }
console.dir(obj2); // { a: 1, b: 2 } // 返回目标对象的属性值不会改变

const o1 = { a: 1 };
const o2 = { b: 2 };
const o3 = { c: 3 };
const obj = Object.assign(o1, o2, o3);
console.log(obj); // {a: 1, b: 2, c: 3}
console.log(o1); // {a: 1, b: 2, c: 3}  目标对象也会改变
console.log(o2); // {b: 2}
console.log(o3); // {c: 3}

const o1 = { a: 1, b: 1, c: 1 };
const o2 = { b: 2, c: 2 };
const o3 = { c: 3 };

const obj = Object.assign({}, o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }  属性被后续参数中具有相同属性的其他对象覆盖。

// 继承属性 和不可枚举属性 是不能拷贝的
const obj = Object.create(
  { foo: 1 },
  {
    //  foo 是继承属性 (obj.__proto__.foo)
    bar: { value: 1 },
    baz: { value: 3, enumerable: true } // 不可枚举
  }
);
console.log(obj); // {baz: 3, bar: 1}  foo 是继承属性，不会打印出来
const copy = Object.assign({}, obj);
console.log(copy); // {baz: 3}
```

`Object.create(proto,properties)`

```js
var o = {};
const j = Object.create(o, {
  firstname: { value: 'hou', enumerable: true }
  // configurable enumerable writable 默认为false
});
console.log(j.__proto__ == o); //说明 j(实例对象) 的原型对象(j的构造函数的prototype)是 o
console.log(o);
console.log(j);
特殊情况;
const obj = Object.create(
  {},
  {
    firstname: { value: 'hou', enumerable: true }
  }
);
此时;
console.log(j.__proto__ == {}); // false
console.log(j.__proto__.__proto__ == {}.__proto__); // true 因为 {} 是 new Object()是实例对象,每一个实例对象是不相等的， 但是它们的原型对象是相同的
new Object() == new Object(); // false 构造函数的实例对象是不相等的
new Object().__proto__ == new Object().__proto__; // true
// ps: 如果想让它们相等  可以提前以字面量的方式赋值  var a = {}
```

`Object.defineProperty(obj,prop,descriptor)`

> value 与 writable 不能和 get 和 set 同时出现，即设置了 value 或 writable,不能出现 get 或 set，反之亦然。

```js
let info = { name: 'hou', age: 28 };
Object.defineProperty(info, 'sex', {
  value: '男',
  configurable: false, // 可删除
  enumerable: false, // 可枚举 为false 属性在chrome中看起来是浅色的
  writable: false // 可重新赋值
});
console.log(info); // {name: "houjian", age: 28, sex: "男"}

function Archiver() {
  var temperature = null;
  var archiver = [];
  var b = Object.defineProperty(this, 'temperature', {
    get: function () {
      console.log('get!');
      return temperature;
    },
    set: function (value) {
      temperature = value;
      archiver.push({ val: temperature });
    }
  });
  this.getArchiver = function () {
    return archiver;
  };
}
// 数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由 getter 函数和 setter 函数所描述的属性。一个描述符只能是这两者其中之一；不能同时是两者。
var arc = new Archiver();
console.dir(arc);
console.log(arc.temperature); // null
arc.temperature = 11;
arc.temperature = 13;
console.log(arc.temperature); // 13

console.log(arc.getArchiver()); // [ { val: 11 }, { val: 13 } ]
```

`Object.entries(obj)`返回自身可枚举的键值对数组

```js
const arr1 = ['a', 'b', 'c'];
const obj = { a: 1, b: 2, c: 3 };

console.log(Object.entries(obj)); // [['a', 5], ['b', 7], ['c', 9]];
console.log(Object.entries(arr1)); // [['0', 'a'], ['1', 'b'], ['2', 'c']];

console.log(Object.entries(obj).entries()); // Array Iterator
console.log(Object.entries(arr1).entries()); // Array Iterator

for (const [key, value] of Object.entries(obj)) {
  // 可迭代键值对二维数组
  console.log(key, value);
}

for (const [key, value] of arr1.entries()) {
  // Array Iterator 对象
  console.log(key, value);
}

console.log(new Map(Object.entries(obj))); // map 对象
console.log(new Map(Object.entries(arr1))); // map 对象

console.log(Object.fromEntries(new Map(Object.entries(obj)))); // { a: 5, b: 7, c: 9 }
console.log(Object.fromEntries(new Map(Object.entries(arr1)))); // { 0: 'a', 1: 'b', 2: 'c' }
```

`Object.freeze(obj)`冻结

`Object.isFrozen(obj)`判断是否被冻结

```js
var obj = {
  prop: function () {},
  foo: 'bar',
  name: {}
};
obj.foo = 'baz';
obj.lump = '123';
Object.freeze(obj);

console.log(obj);
obj.foo = 'bay'; // 未更改属性值
console.log(Object.isFrozen(obj)); // true
obj.name.a = 213; //修改了  未被深冻结

function deepFreeze(obj) {
  let propNames = Object.getOwnPropertyNames(obj);
  propNames.forEach(name => {
    var prop = obj[name];
    if (typeof prop == 'object' && prop != null) {
      deepFreeze(prop);
    }
  });
  return Object.freeze(obj);
}
deepFreeze(obj);
obj.name.a = 123; // 未修改  还是213
console.log(obj);
console.log(Object.isFrozen(obj)); // true
```

### DOM

```js
ul.childNodes; // 所有子节点
ul.children; // 所有子元素
ul.firstChild; // 第一个子节点
ul.firstElementChild; // 第一个子元素
ul.lastChild; // 最后一个子节点
ul.lastElementChild; // 最后一个子元素
li.previousSibling; // 前一个子节点
li.previousElementSibling; // 前一个子元素
li.nextSibling; // 后一个子节点
li.nextElementSibling; // 后一个子元素
```

### jsonp

```js
function jsonp(options) {
  const script = document.createElement('script');
  const fnName = 'myJsonp' + Math.random().toString().replace('.', '');
  let params = '';
  for (const attr in options.data) {
    params += '&' + attr + '=' + options.data[attr];
  }
  window[fnName] = options.success;
  script.src = options.url + '?callback=' + fnName + params;
  document.body.appendChild(script);
  script.onload = function () {
    document.body.removeChild(script);
  };
}
```



## 原型的深入理解

```js
// 局部变量变全局
(function (win) {
  var num = 10;
  win.num = num;
  console.log('哈哈');
})(window);
console.log(num);

// 给 window 添加方法
(function (win) {
  function Random() {}
  Random.prototype.getRandom = function () {
    return Math.floor(Math.random() * 5);
  };
  // 构造函数传给 window 此时Random 成为内置方法，相当于 Array
  win.Random = Random;
})(window);
var num = new Random();
console.log(num.getRandom());
console.log(window);

(function (win) {
  function Random() {}
  Random.prototype.getRandom = function () {
    return Math.floor(Math.random() * 5);
  };
  // 实例对象传给 window
  win.Random = new Random();
})(window);
var num = Random;
console.log(num.getRandom());
console.log(window);
```

- 随机小方块

```js
// 产生随机数
(function (win) {
  function Random() {}
  Random.prototype.getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };
  win.Random = new Random();
})(window);

// 创建小方块
(function () {
  var map = document.querySelector('.map');
  function Food(width, height, color) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.element = document.createElement('div');
  }
  Food.prototype.init = function (map) {
    var div = this.element;
    div.style.position = 'absolute';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px';
    div.style.backgroundColor = this.color;
    map.appendChild(div);
    this.render(map);
  };
  Food.prototype.render = function (map) {
    var x = Random.getRandom(0, map.offsetWidth / this.width) * this.width;
    var y = Random.getRandom(0, map.offsetHeight / this.height) * this.height;
    this.x = x;
    this.y = y;
    var div = this.element;
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
  };
  var Food = new Food(20, 20, 'red');
  Food.init(map);
  console.log(Food.x + '----' + Food.y);
})();
```

## 递归

```js
// 普通求和
var num = 0;
function sum(n) {
  for (var i = 1; i <= n; i++) {
    num += i;
  }
  return num;
}

// 递归求和
function sumRecursion(n) {
  if (n == 1) {
    return 1;
  }
  return sumRecursion(n - 1) + n;
}

//  递归 斐波那契数列
function fib(n) {
  if (n <= 2) {
    return 1;
  }
  return fib(n - 1) + fib(n - 2);
}
```

## module 相关

- ESM

```js
// a.js
function sum(num1, num2) {
  return num1 + num2;
}
const name = '小明';
const age = 28;
export { name, age, sum as default };
// b.js 非项目中不能省略 .js 后缀,以下两种写法都可以
import * as index from './b.js';
import sum, { name, age } from './index.js';
console.log(index);
// index.html script 标签中加上 module
<script src="./b.js" type="module"></script>;
```

- commonjs

- AMD(asynchronous module definition)

`requirejs`



## Iterator

自定义 Iterator

```js
let arr = [1, 2, 3];
function makeIterator(arr) {
  let nextIndex = 0;
  return {
    next() {
      return nextIndex < arr.length ? { value: arr[nextIndex++], done: false } : { value: undefined, done: true };
    }
  };
}
let it = makeIterator(arr);
console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: 3, done: false}
console.log(it.next()); // {value: undefined, done: true}
```

在构造函数的原型上部署 Symbol.iterator 方法,调用该方法会返回遍历器对象 iterator,调用该对象的 next 方法,在返回一个值的同时,自动将内部指针移到下一个实例,类似与数组的 iterator 实现

```js
function Obj(value) {
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function () {
  let iterator = { next: next };
  let current = this;
  function next() {
    if (current) {
      // 这里的 this 是迭代器 it
      let value = current.value;
      current = current.next;
      return { done: false, value: value };
    } else {
      return { done: true, value: undefined };
    }
  }
  return iterator;
};
let one = new Obj(1);
let two = new Obj(2);
let three = new Obj(3);
one.next = two;
two.next = three;
let it = one[Symbol.iterator]();
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
for (const oneElement of one) {
  console.log(oneElement);
}
```

对象添加 iterator 接口

```js
let obj = {
  data: ['hello', 'world'],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return { value: self.data[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};
let it = obj[Symbol.iterator]();
```

用 while 来遍历

```js
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: [][Symbol.iterator]
};
let it = iterable[Symbol.iterator]();
let result = it.next();
// 死循环 输出a
// while (!result.done) {
//     console.log(result.value)
// }
while (!result.done) {
  let x = result.value;
  console.log(x); // 依次输出abc
  result = it.next();
}

let str = new String('hi');
console.log([...str]);

str[Symbol.iterator] = function () {
  return {
    _first: true,
    next() {
      // this 是 {_first: true, next: ƒ}
      if (this._first) {
        this._first = false;
        return { value: 'Bye', done: false };
      } else {
        return { value: undefined, done: true };
      }
    }
  };
};
console.log([...str]); // ['Bye']
console.log(str); // hi
```

## Generator

```js
// yield* 表达式用来在一个Generator 表达式中执行另一个Generator表达式
let arr1 = [1, [[2, 3], 4], 5, 6];
let flat = function* (a) {
  for (let i = 0; i < a.length; i++) {
    if (typeof a[i] !== 'number') {
      yield* flat(a[i]);
    } else {
      yield a[i];
    }
  }
};

for (let v of flat(arr1)) {
  console.log(v);
}
```

```js
let myIterator = {};
myIterator[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
console.log([...myIterator]);
let g1 = myIterator[Symbol.iterator]();
// 迭代器调用迭代器函数 等于 迭代器本身
console.log(g1[Symbol.iterator]() == g1);

function* gen() {}
let g = gen();
console.log(g[Symbol.iterator]() === g);

// 下面两个输出一样
let arr = [1, 2, 3, 4, 5, 6];
for (const number of arr[Symbol.iterator]()) {
  console.log(number);
}
for (const number of arr) {
  console.log(number);
}
```

```js
// next(arg)是传给yield表达式的，而不是被赋值给变量的
// 括号很重要 如果不加结果不一样
function* f(i) {
  let a = (yield i) + 30;
  return a + i;
}
let it = f(6);
console.log(it.next()); // {value: 6,done: false} i = 6
console.log(it.next(20)); // {value: 56,done: true} a = 50
// (yield i) = 20 ,a = 50

function* f(i) {
  let a = yield i + 30;
  return a + i;
}

let it = f(6);
console.log(it.next()); // {value: 36,done: false} i = 6
console.log(it.next(20)); // {value: 26,done: true} a = 20
//  (yield i +30) =20 , a= 20

/*
 * yield 表达式总是无返回值 也就是 (yield i)=undefined,  所以reset 是undefined
 * 每当运行到yield表达式时 reset的值 总是undefined
 * 当next 方法带一个参数true时，变量reset就被重置为这个参数
 * next 方法的参数表示上一个（yield）表达式的返回值，所以第一次使用next方法参数是无效的
 * */
function* f1() {
  for (let i = 0; true; i++) {
    let reset = yield i;
    if (reset) {
      i = -1;
    }
  }
}
var g = f1();
console.log(g.next()); //{value: 0, done: false}
console.log(g.next()); //{value: 1, done: false}
console.log(g.next(true)); //{value: 0, done: false}
console.log(g.next()); //{value: 1, done: false}
console.log(g.next()); //{value: 2, done: false}

function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}
// yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

var a = foo(5);
console.log(a.next()); // {value: 6, done: false}
console.log(a.next()); // {value: NaN, done: false}
console.log(a.next()); // {value: NaN, done: true}

var b = foo(5);
console.log(b.next()); // {value: 6, done: false}  x=5
console.log(b.next(12)); // { value: 8, done: false}  y=24 (yield (x+1))=12
console.log(b.next(13)); // { value: 42, done: true} z=13 (yield (y /3)) =13
```

```js
// 很难理解的一个generator函数
function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    // 先调用一下next
    generatorObject.next();
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'Done';
});

console.log(wrapped); // function(...args){....}
console.log(wrapped()); // generatorObject
// 这里是第二次调用
wrapped().next('hello');
```

## Proxy

<p>Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。</p>

```js
let obj1 = {
  name: 'zhangsan',
  gender: '男',
  age: 24
};
let objProxy = new Proxy(obj1, {
  get: function (target, key, receiver) {
    // console.log(target) // obj1
    console.log(key); // obj1 key
    console.log(receiver); // objProxy
    // Reflect.has(target,key) 相当于 key in target
    if (Reflect.has(target, key)) {
      return target[key];
    }
    throw new ReferenceError(`该对象上不存在${key}属性`);
  },
  set: function (target, key, value, receiver) {
    if (typeof value === 'string') {
      value = value.trim();
    }
    target[key] = value;
  }
});
console.log(objProxy.name);
// console.log(objProxy.sex) // 报错
objProxy.sex = ' 男 ';
console.log(objProxy.sex);
console.log(obj1);
console.log(objProxy);
```



## Promise

[Promises/A+](https://promisesaplus.com/)

::: details 手写 Promise
<<< @/snippets/promise.js
:::

- 场景考虑

```js
const promise = new MyPromise((resolve, reject) => {
  resolve('success1');
  // reject('error1');
  // throw new Error('error1');
  // setTimeout(resolve, 0, 'success1');
});

const promise2 = promise.then(
  value => {
    console.log('then1 value=====> ', value);
    // return value + 2;
    // return promise2;
    // return null;
    // return new MyPromise(resolve => resolve(value + 2));
    // return { name: 'HJ' };
    // return new MyPromise((resolve, reject) => {
    //   resolve(
    //     new MyPromise((resolve, reject) => {
    //       resolve(value + '2');
    //     })
    //   );
    // });

    return new MyPromise((resolve, reject) => {
      resolve({
        name: 'HJ',
        get then() {
          // throw  'error'
          return (resolvePromise, rejectPromise, anotherFn) => {
            // throw 'error';
            // resolvePromise(value + 2);
            // resolvePromise(value + 3);
            // rejectPromise('error1');
            // anotherFn(123456);
            // setTimeout(() => {
            //   throw 'dsdfasd'; // 这里 throw 不会被promise 捕获
            //   resolvePromise(value + 2);
            // }, 5000);

            // 以下调用 rejectPromise ，返回 promise 实例 ===> 调用 reject 不会进行递归调用
            resolvePromise(
              new MyPromise((resolve, reject) => {
                // throw 'dsafdsfasd';
                setTimeout(reject, 1000, 456);
              })
            );
          };
        }
      });
    });
  },
  reason => {
    console.log('then1 reason=====> ', reason);
  }
);

// promise2.then(
//   value => {
//     console.log('then2 value=====> ', value);
//   },
//   reason => {
//     console.log('then2 reason=====> ', reason);
//   }
// );

promise2.catch(reason => {
  console.log(reason);
});
```
