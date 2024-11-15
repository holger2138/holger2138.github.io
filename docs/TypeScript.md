##  any unknown never void 

::: info 理解
top types ===> (any | unknown) , bottom type ===> never 用于继承时可以看作一个空的联合类型

void  strictNullChecks (默认为 true)

为 true  时，是 undefined 超集

为 false 时，是 (null | undefined) 这个联合类型的超集

总体来说 void 可以看成比 null | undefined 范围还要再大一点的集合
:::


```typescript
type Case01 = [                            /* strictNullChecks : true(默认) */ /* strictNullChecks : false */
    any extends unknown ? true : false,                   // true                         
    unknown extends any ? true : false,                   // true                       
    never extends unknown ? true : false,                 // true                         
    any extends never ? true : false,                     // boolean ⚠️
    unknown extends never ? true : false,                 // false ⚠️
    '----',
    undefined extends void ? true : false,                // true                          
    null extends void ? true : false,                     // false                         // true

    null | undefined extends void ? true : false,         // false                         // true
    void extends null | undefined ? true : false,         // false                         

    undefined extends null ? true : false,                // false                         // true ⚠️
    null extends undefined ? true : false,                // false                         // true ⚠️
    '----',
    void | undefined,                                     // void | undefined              // void
    void | null,                                          // void | null                   // void
    void | null | undefined,                              // void | null | undefined       // void
    '----',
    void & string,                                        // never                         // never
    void & undefined,                                     // undefined                     // undefined
    void & null,                                          // never                         // never
    void & null & undefined                               // never                         // never
];

/**
 * 任意类型 <T> 与 any 交叉 联合 都是 any
 * 任意类型 <T> 与 unknown 交叉=>T(any除外) 联合 => unknown(any除外)
 *
 */

type Case02 = [
  any & string,
  any & unknown,
  any | 1,
  any | unknown,
  unknown & string,
  unknown | 1,
  keyof any,
  keyof unknown,
  IsUnknown<never>,
  any extends unknown ? 1 : 0
];

type IsAny<T> = 0 extends 1 & T ? true : false;
type IsUnknown<T> = 0 extends 1 | T ? (keyof T extends never ? true : false) : false;
```

![any unknown void undefined null never](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/any%2520unknown%2520void%2520undefined%2520null%2520never.png)

## extends 关键字的理解

::: warning
Distributive Conditional Types 满足以下两个条件，会触发分发

1 传入的必须是泛型参数

2 传入的泛型参数是裸类型参数（没有被数组包裹）
:::

```typescript
// ExtractKey1 2 和 3 的结果为什么不一样 🤔
type IObject = { a: string; b: number; c: boolean }

// 分发过程 ('a' extends 'a' | 'b' ? 'a' : never) | ('b' extends 'a' | 'b' ? 'b' : never) | ('c' extends 'a' | 'b' ? 'c' : never);
type _ExtractKeys1 = Extract<keyof IObject, 'a' | 'b'>; //  "a" | "b"  ===> 泛型传入参数
type _ExtractKeys2 = Extract<'a' | 'b' | 'c', 'a' | 'b'>; //  "a" | "b"  ===> 泛型传入参数
type _ExtractKeys3 = 'a' | 'b' | 'c' extends 'a' | 'b' ? 'a' | 'b' | 'c' : never; // 肉眼可见为 never ===> 不是泛型入参，不会分发

type Naked<T> = T extends boolean ? 'Y' : 'N'; // 裸类型参数会分发
type Wrapped<T> = [T] extends [boolean] ? 'Y' : 'N'; // 非裸类型参数不会分发
type ans1 = Naked<number | boolean>; // "N" | "Y"
type ans2 = Wrapped<number | boolean>; // 'N'
```

```typescript
type Person = { name: string; age?: number; gender?: undefined };

type TestNever<T> = T extends never ? true : false;
type Case1 = never extends never ? true : false; // true 

// never 可以看成一个空的联合类型，触发分发机制， ts 认为对没有成员的联合类型执行没有意义，所以不会执行，直接返回 never
type Case2 = Test<never>; // never

// Required<Person> ===> { name: string; age: number; gender: never };
const p1: Required<Person> = { name: 'HJ', age: 32, gender: null as never };

// 可以利用这一点来进行可以获取对象类型所有的 必需参数 || 可靠参数
type GetRequired<T> = { [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P] };
type GetOptional<T> = { [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P] };

```

## 一些细节问题

::: info 辅助类型 Equal

[参考链接1](https://github.com/type-challenges/type-challenges/discussions/9100)

[参考链接2](https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796?answertab=trending#tab-top)
:::

```typescript
  /**
   * 
   * For literal types L1 and L2, L1 is equal to L2 if and only if L1 extends L2.
   * 对于字面量类型   仅当  L1 extends L2 时，L2 = L1
   * Two non-argument function types are equal if and only if their return types are equal.
   * 两个无参函数类型相等 仅当它们返回值是相等的
   * For non-argument function types F1 and F2 returning literal types L1 and L2, respectively, F1 is equal to F2 if and only if L1 extends L2.
   * 对于返回值分别为字面量类型 L1 和 L2 的无参数函数类型 F1 和 F2 , 仅当 L1 extends L2 时 F2 = F1
   * 
   * Equal<{ a: string; b: number },{ a: string } & { b: number }> 并不相等，需要merge
   *
   */

  type Assignable<X, Y> = X extends Y ? true : false;
  type T11 = Assignable<1, number>; // expercted false
  type F1 = () => 1;
  type F2 = () => number;

  type MutuallyAssignable<X, Y> = X extends Y ? (Y extends X ? true : false) : false;
  type T12 = MutuallyAssignable<1, number>;
  type T13 = MutuallyAssignable<{ a: string; b?: number }, { a: string; c?: number }>;

  type Equal<X, Y> = (<V>() => V extends X ? 1 : 0) extends <V>() => V extends Y ? 1 : 0
    ? true
    : false;

  type Case03 = [
    F1 extends F2 ? true : false,
    Equal<{ name: string; age: number }, { name: string; age: number }>,
    Equal<{ name: string; age: number }, { name?: string; age: number }>
  ];

  type X1 = { a: string; b?: boolean };
  type X2 = { a: string; c?: number };
  type X1X2 = MutuallyAssignable<X1, X2>; // literal type true

  function x1x2(x1: X1, x2: X2) {
    // Mutual assignability:
    x1 = x2; // ok
    x2 = x1; // ok

    // @ts-expect-error Type inequality:
    x1.b = x2.b; // error: Property 'b' does not exist on type 'X2'.
    // @ts-expect-error Type inequality:
    x2.c = x1.c; // error: Property 'c' does not exist on type 'X1'.
  }

  type X1E1 = { a: string; c: string };

  function x1x2e1(x1: X1, x2: X2, e1: X1E1) {
    x1 = e1; // ok
    // @ts-expect-error
    x2 = e1; // error: Type 'E1' is not assignable to type 'X2'.
    //          Types of property 'c' are incompatible.
    //            Type 'string' is not assignable to type 'number'.
  }
```

```typescript
/**
 * 元组问题
 */

type JSTypeMap = {
  number: number;
  string: string;
  boolean: boolean;
};
type JSTypeName = keyof JSTypeMap;

declare function addImpl<T extends JSTypeName[]>(
  ...args: [...T, (...args: ArgsType<T>) => void]
): void;
addImpl('string', 'number', 'boolean', (a, b, c) => {});

// 如果想推断为元组则必须以泛型形式传入
type ArgsType<T extends JSTypeName[]> = { [P in keyof T]: JSTypeMap[T[P]] };
type c = ArgsType<T01>;

// 强制为元组
type T01 = ['string', 'number', 'boolean'];

type T02 = {
  [P in keyof T01 as P extends '0' | '1' | '2' ? P : never]: JSTypeMap[T01[P] & keyof JSTypeMap];
} & { length: T01['length'] };
```

## 协变与逆变


::: info 逆变与协变

  在联合类型中属性多的是父类 

  interface | type 中属性少的是父类 

  函数中(返回值相同 | void)时参数多的是父类 ===> 逆变

  总之父类型更宽泛，子类型更具体

  子类型赋值给父类型 ===> 协变

  父类型赋值给子类型 ===> 逆变
:::

```typescript
type T01 = string | number | boolean; // 父类
type T02 = string | number; // 子类
type T03 = T02 extends T01 ? true : false;
let parent1: T01 = false;
let child1: T02 = 'foo';
parent1 = child1; // ✅
// child1 = parent1; //❎

interface A {
  a: number;
}
interface B extends A {
  b: number;
}

let a: A = { a: 1 };
let b: B = { a: 1, b: 2 };
a = b; // ✅
// @ts-expect-error
b = a; //❎

// 函数返回值是协变的 也就是说子类可以赋值给父类（父类型 = 子类型）
type Fn1Type = () => A;
type Fn2Type = () => B;
let fn1: Fn1Type = () => a;
let fn2: Fn2Type = () => b;
fn1 = fn2; // ✅
// @ts-expect-error
fn2 = fn1; //❎

// 函数参数位是逆变的 也就是说父类可以赋值给子类（子类型 = 父类型）
type Fn3Type = (arg: A) => void;
type Fn4Type = (arg: B) => void;
let fn3: Fn3Type = arg => {};
let fn4: Fn4Type = arg => {};
fn4 = fn3; // ✅
// @ts-expect-error
fn3 = fn4; //❎

type Case = [
  B extends A ? true : false,
  Fn2Type extends Fn1Type ? true : false,
  Fn3Type extends Fn4Type ? true : false,
  { name: string } extends { name?: string } ? true : false,
  (() => 'foo') extends () => string ? true : false,
  ((arg: {}) => void) extends (arg: { foo: 'foo' }) => void ? true : false
];

type T08 = { name: string };
type T09 = { age: number; readonly gender?: string };

// 参数返回交叉类型
type UnionToIntersection1<T1, T2> = ((arg: T1) => void) | ((arg: T2) => void) extends (
  arg: infer P
) => void
  ? P
  : never;
type UnionToIntersection2<U> = (U extends any ? (arg: U) => void : never) extends (
  arg: infer P
) => void
  ? P
  : never;

// 参数（函数）返回函数交叉类型 返回最后一项  00730-hard-union-to-tuple.ts
type fn05<U> = UnionToIntersection2<U extends unknown ? (x: U) => void : never> extends (
  x: infer X
) => void
  ? X
  : never;

let lastParams: fn05<1 | 2> = 2;

let info1: UnionToIntersection1<T08, T09> = { name: 'tom', age: 3, gender: 'male' };
let info2: UnionToIntersection2<T08 | T09> = { name: 'tom', age: 3, gender: 'male' };

// 返回值返回联合类型
type TT<T1, T2> = (() => T1) | (() => T2) extends () => infer R ? R : never;
let info3: TT<T08, T09> = { name: 'tom' };
let info4: TT<T08, T09> = { age: 3, gender: 'male' };
type C<U> = U extends any ? ((() => U) extends () => infer R ? R : never) : never;
type C1<U> = (U extends any ? () => U : never) extends () => infer R ? R : never;

let info5: C1<{ a: 1 } | { b: 2 }> = { a: 1, b: 2 };

// 判断联合类型
type IsUnion<T, U = T> = (T extends any ? (U extends T ? true : unknown) : never) extends true
  ? false
  : true;
type T9 = [IsUnion<T08 | T09>, IsUnion<never>, IsUnion<never | string>];
```


## 深入理解typescript

* [typeof 操作符的使用](https://www.typescriptlang.org/play?#code/PTAEBcE8AcFMHsBmoBQBjeA7AzuUBLTReUAXlAG8VQbRMBDAW1gC5QByACQHkBVdgDTVa9AOatQAJgAcQ2qHoATRQCdY2bGyrz50FfABuhNBPaBmm0DqyoOE7QafFDbtAh-KBmNPY3QAXzm1xmRVgVNgBXANhEQlhFFC8UKDhQAEkiEnIEhGRCYhQURDC0cHwsCHgAQRUVekgACgAPNkwQxgAjIIBKNgqqyAAeJtaggD5KTzVwEJVMUABtOoBdWPiYWFAAMQKyCBWkUu7qgG5clBA7LFxQQFrTQAAolAAbWDw6rYAiAAtYO7v4F4VsM5w4COGVAAA0thldnUjvdHqBIFsZgBGAAMAikKPmfwBuGBK1AAE0ITtkJA8YkACL0cD0YlwXaQGYDNoqRYYQGgb5oanFTBIxGeCic+Dcu5OABebwAtGhMIJOfRMKIQmJTIBaOUA4absby+GhCrn0MUcWBy9F3RXK1VOQCPQVqdSgsfR-uzcctEga7nTMsLuUUsEimc0WfMZuxzUqVeJ2Itcg88OKtkLwLA6uAnB8vvBtV5sS6gW7VgAtL27cVHPOgcXitjF8hJlNpjgZ77Z3KnOMKLY1ACy1LeADoqgF4Iwau1QL1QCj+wBWUAAfinoDYSPHTpx+Y7LS2vfAA6HihHY4nU9nC6X64rK9z53zsLw9EqiKR6Mk6IAzOiACyLDvENKUHQTCmP+8rssmmDgJoCiVDml63kcpz-v2DDMFs7DKB4yHgSaUH9tAITYG8NQzu0bZgJCyCAHByoAANawJAuyALMmgA68oAZN7oLeZzfCo-x1mM0ROGoijWPILR3CEpjiZJHhxAWoAAMLwDxfF0QxuyUdx8C8SgQA)

* [手写泛型工具类](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgArQM4HsTIN4BQyyIcAthAFzIZhSgDmA3EcnA1SQK5kBG0LYhxAATaAH5qteiGasoEOCJwAbAJ7IADlCwA3YEkk06jFgF8CBMGs0oASouUh1ARgA8AFQB8yALz55R1UNAG1UZFBkAGsINSwYZA8AXWoPMKSCCwQcWjZqByVg93QobBAffzwSck4AcgAJAClagBo2DmoXAA427T0DOsBmm0B1ZVrkCwB6CbYAOj79JD9kWsA1O0B0ZTGp5AB3HVkCLbgZ0gol2rI4FQhN6d2cBisbFABZLjA4XivPCoDiAFoFIVnKFwpEYnEEslUulMgRsiBcrxqK93p8IG4SmUflUTnUmq12pxur0dAshqNxgReHNSQMzutao9bMgHABHLjABQidzeJaEYhhCK4cHxRJJP5GNKoDJZHJgZAIfIQdmciAiDGYHDY6oUagNZptdhEnrIYRiKB6i5XAnzAZ6kZjCxMlCoOBQMDAS487GsQVg2Ki5KSmGyhHykTUV3uz0qDWlLV8nV45qU53IACiAA8ECouGIeW0AKo-DzICCZyCiDDIQvIcQkCC6aDIVJwuVl6hZnN59EihKYnBtWq4sYAH2WZugtR+tSNjLTWboiDABZrJbLFYgVZrdcSLZrbbDyBgnYrUGXbj7aE1ICHI+Q49nHGnZxHlmszNQBiiq4A0hvKxEasr15SpfVBXBfxSRIQ0PXIGEjb9ihvO8ajHZY521XE9XxQ0OmQbpUw-FAAHkyGAFdPDaf9y0A4CAwSOAQDUH0BQgjNs1zMRLwYxJqK8aCpRlSx4VyAALagyIo5D41vZZbSQdCn2uB9lgwcsX0qJMcINU0t3NS1LhUp00wcbIoG5NwaM3bcryYtQ2lA35kD9SDBNhUT5WAJVzMs2oczgDAMBcJSAqCgAmAkBxAEIklYhUVEC4LqBCHEah0gkjU6LpxiSFpWDCjBwpStLdWWABhDxMvwlwAE5cthOD5SUCNkAACkzKQTFkVSQB4fgoDaNQupkBhev66AAEo-B8aRGHGvhm38Dqhum3wfH5CIEja4jRUzPxfH8YcJqgMYADIzuQXaEg0Q6jr6xbTumhQwC4KBcH2gBqZA1ECV73uQL7ljGb7fqdYiWQgf6QA8J5vSWUtaP06s2pmNG3QYDBqHstafFAGBm3Cetwmx5iWDTAArJYHGh2HbHca62BEEQvCa6JqCpo6ABYAFYADZ5whgBJMMmKQOmIHh-xEZsoCG22dq0ZmDGsbYZjcaFAmoDQXcSbV37CuvWSXGczyoC4BAwCwKA2s0LhPgMbTjFG3p7ZUR2su4R7pqqCwnU85AVGoEXaDFiAJbcRnopcH4QAgBXo7a-UCW6Sb3yeNA3RqSBSh5ADkcV9GoAQ-WNfs9cke3VGi8x6h8cJsvmN1-d7LTMglijbPMAZp5RRarwgA)

* [keyof 操作符](https://www.typescriptlang.org/play?#code/PTAEGsFME8HsDNSADvQ03ICgCWA7ALpATvAIYDGkoACgQM6xagDeaoLoWRAtpAFyjU75sAcwDczVkSE82AVw4AjAmNagANrBJEcGOr36CsQtAF80OaAAdyAaQCMoALwQYCSjTojQIUAHJ2XH1AAH19JSECQn3VNbTofM0sbACZHZzhEKnxaLABtAF0vMCw5RXwWSNVIQxwACwjfCxlqOuDfEjoYwISrUGsAZlSodMZQHIAPPQFhPN5M7NBjQr4pw1bihQI0NBJVImpqNyy6eyYVf2l9YVSfAAkAeQBVeJUw3nXS1NskvpMtypw+OdeENXHNjp5vH5OOFWj4wvFqOdrvC-pAAdYACzAlyIeSwWCVIhYCFgf69Wy8ABEADciKoZJA7vBKWgydYAKzY4bvJRLNlJKk4WAAZRWQkprUpQoAYhgxpAACYSkJS2AAUTGFjoVW0dOVoAAdEbWWjegA2LmuajQBQEsTtLD8CBm67Cm141QGjB4fBEeSVeLdcgUexOMFYWw5KEBPJBygpMPuCNR871OFSHyx8w9CgDJyXQxRkg1Ij4ACCOEzcYoGNSBaE+SjjWaVezwfZdbFjZ5+FjWx2ewOAGFdvsAOremoAOTkBAwJAo+FgVnw5kY4hYOVsM2WBiEqUpwsgHFU2Cg+EpYlMJoBA-Hk5nXEEJFSWEgAHdQCPBxPao+5wuS4ruYAAUACU9p0LQlQGuoQggQABgAJAwd7UL+06zs+W55MYCEQVsVRyF+Mj4PgVQkNA64qEOU4AJqpGaAA0G6gGqDwAEqpAAHCxKgPMKAAinwAAy-NsUEAkOpHkVglFTtCqSnKwOTSWRFHQAatF0TulKAF1ygCINoAgHqUnxKlqbJlEGuxHG6YA5NaAMKKpmsapMkaQaAmCbpgBx-k5JhiBJjoEpAsGwPBFkaUxJHqXJ0AKVwYFbPAMhybE9BSDgEWxfFkAADwACpRdYoCQGMeBYAqBwgog+UAHwgUMvDWFFHBEBYvD5WBHU5NYBTKSw5E4KR9CtRYORDHkV79lBwWhfBCFIk4KEZVl8nQiBq2adpUWbTlYF4QRQA)

* [infer 关键字的理解](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgArQM4HsTIN4BQyyIcAthAFzIZhSgDmA3EcnA1SQK5kBG0LYhxAATaAH5qteiGYEAvgQJgAngAcUAJQhwROADYqAjAB4AKgD5kAXnysoOvSEPIA2qmShkAawgqsMMhmALrUZu7BLPIsCDi0bNTaugbGJuhQ2CBWtoTEpBTUAOQAEgDyAKqFADSs7JwATAAcCizK6iiocFBgwHD6ppY2dsTunri+-oEhkkERUTFxYMi81J3dvf1pmDjZwyTknCUVhS1KqhrI2gCOXMAOIgO7uW4eXhMBQcEAtDPhqJGnWIgeIIRIQG53CAPLYZHZDZ75Q5lSo1Yh1ahNVHIYRiKBFMh9CAnaJndrIACSIBgWCGhQADHSjIVkAAfZD0un1ZlsjkAZkKLHOWggsSg0IA0sgIAAPSCiDA+PwfOAgFRVIJPVijLzi0JBeYEIHxERg0XQynU9XpTKa4gcpnUPD7Ars4oAKWqbA4GMayHkWI5XMdzsOAGEzJ70cgmn6Awz+cHEUVigBNSPe6O+xQktoXVDABDeAbqyUyuUiBXvKa2l5jZC6sJzU6GxZS1YFoswzLqwqI7nsnHQQo1pOuj1Ywd49kE-RE5ugSCwRAoACCIGAM72o+kjCipIuAFFpQh9FwxMXkOVdmYpbKIPLL8hxCQIAA3aDIMKCslmOlDI8nmeECmFWaDbCA6qgWuG59BYrQAPTwcggAkcoAVHKAN4+gDR6oAjoqADAqgCnRoAkOaACFuuYoEedCIGAF5XkMN5lveFaPs+N7UCAb4CGRQRGP+spQFRIFKoE0EzpBQlgbCWQIUhgCwcoA9GZoVheFEaRQrIKUZDANR5glre5aVuJKoqLs+aFjpyAAaeYgmKBZglhYcFcWY9RDBpWmmNaOBiZMyAibBrRqSAOAAHJcPo+hwLws6PHRemMQqIBhforLIFwogQDAoBQk+L7vlAn76koRpLFgvAAFbwqwo5HCitQZmlYiZexIgTox0BsUlzZqWYvJDEFICheFkXRSYO6yCliV8B+bIYCofBYMlbINRlWUiBNSWOd1AAsfUhUlw3ATZ4lCh8pVlZtP4AKxDCdgRna4-WDRFUWHaBnlZACBALtA8BIMgABiwAYAAFnsmUg1IdC7goX3gD9y7IAA6nAi57AA7ij7U0FDsh7t9S5-QAQnca3PLwJOQzIciKPjv0oAAyt4Kh7BgTOU9DihcaGOAiFpwA4OY15xQ+gMgzlyOo9QjMqK0xVsHAcDUNzoh8wLovA08yAY4uRQiCIMDMiScu8CbSs86rIAmMTYqa6zKhFHbhvScggCf2oAcXLC0xxGAGAugDHkTYgDQDMggCySoARulyYAcCqh8RgAK2oAY2lcQAIsAMAwOZtG2PRd4PuUOXsXlBVmEwyCIcggBrymHgAAcqhMm4cRyCAM7KQTIMRtdcZl+iLunQsMTnOWsblAgl0hZeAB9uddcSuQzJ6nJiFAg-aFCInqFHAi+8IvC8XRchNDB3Xfz4vy89mvKWFBvZ8L2fy+OQQpfaGAXBQCAZjtMRgCPtoApop+057RmFwahZxDFcGNBg6pJr8CgACbq7QVxQH4szWwcCEGjRxgwdaU0oBwWHsgQAkt64Q9gAClARgyBABKVwwQuKEz-JnP+ACgG9yYq-DQyC4DM2fHQLgKBqDwH0BgCAxdS5cIgPuFA-0IpgDlILWKTCFRsJUCYUAMAPy0WfLnNiHEoBCKQmYAAbMgQAejoewUUoqkqirCxwTt1AxtgQFoPATwSB0CfwAHYhgSJRtI-Rt9S5mAgLQFygBR-UAN4ZgB-eUABSu6FAB52oABudAAw-8gGSgBfgMicgGAaUEA9BwMgQAIeaAAIEwAv4qAAdTQAEP+ACCzQAb6YyUAFSagBQO0AFqWgBIf8NBFDACp-G0B4s8YqUAuBZKwFAQhaguBRQLMgaUHVMHqhGWMhAyB7bcGmcgWZ+hxkAC8ZgQOgGQ-A2YnK+lsLdIIATqILGBEsTpYB6hhEOcgE8cB2l7F6f0sAgzhmjLWfMyZSzIEzM+eMxZ2yoC7LwNmZ2gBzI0ADIRgAvDMAPF6zc5KADIVQAh3aAGbYwAm-GoUACvxgA9tUADwKclLgtxKcQQhAA6SlXQGAYGoEZXZ1grDKI-JoLiD8n4v3aDFTOnsFQUqpVAGldLVQMqZeY-KmgcqSuFTLFsFz0mZJ4rYQhPzgXqiBU4nZNgrCEKdNKdVfoyHfguGYAAnEMdlz8WGHWORkkACAjCOTlmdG5QRzU5AmdQIw6qMR+gCmSS1nKND1BkTyuRyB+XkupbStgIrtVjBURKnKTpFbYypsXFYabGB+gKkZc58Qzq8jBI-K17QQ22sVZrVNq9PSZvPk7JQ8EABULaiBNuQIADO1ACdppcCAJag0oB9r7NtyAsKAGolQAsCq4MAO-KYdiKAAsIwAffGAHh9QOzdAASioAQMj0VzqXaumS6LiKAF3owApUaAExU5AgAxeTkjJQAjvqAFmVPF+LiKAGNrQAdh6ADg5JFvb+3Wt5CO8dE7AAfnlHBdK6103nRTO3dK6I7IEALGKgBod2RVB6doG93IDxaPQAKXpYR-Ry61W0R2ABfowAcGZ4NnRHMDy7ABBmoAHPNkCV0AOwW8S52AHvlQAp3KAEB3QApq4yUAJmK+HS0aEum2+CbK+0EfaLycwvKI3UqmeQ+NRke7ZyYpG6NMrRUJpZVK3Nqp81LF0GtZVqrNVQB9b86aWbZDaeeCnCNxzEHWFsL2czzIABkHnkDHOlDYFz7JgWFF2Q4ftEzkAAGoFmCGQKFjlOjiCACY0wARtZBHpisiKKgGBQCwA1ZA57qDBSwEZ8K9ysBiBWSjYGCo4vPzYMgV8fRuHktOKXc9o7MKABwCFVinoCWeBSlUB2mBtLXSk1KEgBcAgPWiwAZX6AH1zbrCmrMguU6qCbXMLWSeExAGTxzjO3zUoGwjsnw09eW-18zg20HaZU7ItTfLKVRsFTG0BlDtPMqTc+aVsbZVqUTpt397QtomD23rA7AatsDsuqG5up3HuaZ++98VxKvv6d+2SA8AOpMiZB+0ZUYOWBAA)

* [字符串模板 TS4.1 新增](https://www.typescriptlang.org/play?strictNullChecks=false#code/PTAEipzQAfUdiMGcBcBOBLAxvAcgVwDY4MIAWApqgNayiBvpqAHa46gA+oWtAJsQGbK3HuhA9GaABI0CQ5oG8fQNHqgELdACtpSANIBgVKoH05QaABuAe2QC5UgFAhQgU7lA0HKALRUBccqCRZih+AE8ADsVAAVAIygAvHQMoMQAHvDEHJQIKLQA5qAA-HaIDqAAXKBcAIY4sMQA3E5uHp4ATP6sHNy8-MFhEexRSLzxSfYeGdm5BUXuXgDMFfR4deGRWroCbSkdmTl5hS59ngAsFWycPHwCoWONE3qJyamd8z1LJQCsFdEtzIEAtgBGxIj3T9raOMRZtKMNlDYZFo2gA7n9pic5t1FsUvAA2G7NOL3ejPV7vT7fX7-ca-ZxHdrpaELQy9EoAdiRMViAG0ALqFVDaWgIUBZDKeKkBWkAcm8vIUoF5pV5jPJXgAHBUABS3FEsNEvRAASgZTJZbKenOlPP5ovFzNZ8FAqB1FVp3iF-LFhQlngAnNSWgzcftXZDZl0FqATN7HBcvN4AAzOuKu3YA0C0oEg8H0wkzYn+-K+sD++3eXw8+WxBOR8Yx2jAsG0BOe5NnVMmdpk3jhRDZVAeAAKr1gLNAAG9DKA6FkHsQMrnCn2srEh49laPQN4Ehkla9CgBfQz115NjwAZXgWE4tBNPb7sGZiEni8QK8z5QCbcQHb+ADJQDu9xF4BrjaB2JzvDfu-2g4ZLyAASABSgrshOGSlJKQontoZ4ZJK0rLnaJiAHBygClxoAx8qACVygCTylIoCANDugA88oAsHJKJmgwBLmoDPmQxDONoXCgHeD6FCYHgUYAvwGAJLegBxclagBXyrxGi0AOHgsOOjhGmyk4+LRwqSYOvJ2oGABqrzwMgOQVLy8DaK4vL3LyDx6Ow3ymSwvIfPARkPOpEogYhABeWS6Z2AS8t8XDwDZwrNgeryBbyKCxIQAWwn0AAiyBnugyDeaAAAGAAkXbaYguk5MuAC0mWuYgHlebQy6pRpcIAOLEA57YADyeAAfBUR7RgA0qAvCgExLFsZ47KUKlE7wJl+BZK4yDwDkyBucQDX0c+HXNRV9IZDKKr+K1ni0h14poWS8kmlwGS1fV94NRxLKtQEXagKNGBSRtW1+K1oEQUKo0AILQaAm3bbOoCHRKACynmoIQLZZAlsANVubpNDSt0vojaW0plvBcBi33LgomO0NjbwAELLvSqVHLS31CsTCYLsQmhLsYYACIARL6AKj61jeNIgCeGaAoiAF5egA8FkdmomrEGTg-AkPQ7DDW8rSWQKE8oD0ryKN8lkkF2cKhpi6AhCSxDUMw5dCtcJ8ytZIgasa7yFvaNrTzW7aZImGBui0L4ACqoDSIAFcaALWmgAw-4AkMaAMoJgBgLoApuaAE3RgiAIU2oiAHepgAZGdIEoe7w3hNWjcrIvEipYOibwsB8Xw-H8ZfILE9ZqvSQqxWjuYo4NBbuvSvZHLyvJd5yaNFiW8Zd0ku3Bp3fb9+3lCD3GtBCgAdEvWMYt7E9HBlXZj-Sy6ZbFu9dlnXsNd7jeralffCislzws57ue+UgDb8YAAHKAKbWgBRRqAvuAAppgBZ2pnD9c7T3+vRIuJdMQVxxNXWuB566N2bgXVuA915JB7pfNu9RCyxlLCgrwtJx7oIHtg8Ei9l6E1Xrg32wD840lRMXZUEDsRV1AE8GudcGRdz7EkTe28D770ykfHOp9QCxXPpw4kvJr630vj3KqyxvBrACIIhqDJrQL3Vp+NkyBfyKOFM5TM1wlGexznyAUQpShCn6NaFYkF2gN2FAoDRhhjqgAAFa-kMcKK0FirErAUO0ZyQA)
  * [字符串模板拓展vuex实现更智能的提示](https://www.typescriptlang.org/play?ts=4.1.0-pr-40336-8#code/CYUwxgNghgTiAEAzArgOzAFwJYHtXzDigxAGUMc4AeAWQBp4BBAPgAocAHbPAZwC54ANWQgAHgHkuuVD1oMWASgHlKIOU2YBuAFDaMATw4JhYydxnqW8ALzwA3vAC2OYMggh+8GpvhRM0z0Z4AF8dPUMERn9eS2YbeABrEH0cRC94MRJUYB54HgwYLFQAc3gAfngAAwASOySUtJpggHpa-MKS+AAyROTUpmDK+AF6-u9dAyN4FWp6DXiHYCweDmIwAAtWP3MBKPNZOcUBADccLGAQsLBeDDyKOHjCEGIye5BWO214Jxc3DwFPt9vsgeCAYABJVCIHACADkILBkOhsLoXyBYFgGDhGJgGFhaOCqO+2wCALR3zgzmO7wU9kJ5N8wGArFpdmCBO0wQUYXyqgAdEsVmtNvDQRCoThmlAmbCFNogA)
  * [实现lodash get 函数](https://www.typescriptlang.org/play?#code/PTAEgubR4Q0CSdBpzVQBcDOoAsA6AjKQU8qFO5QKDkAoAYwHsA7ZRUGgJ1AF5QByACwFMAbb80AOrl63ACasA3MWKIAngAdOoALIBDRKXYBhdqvqrSiTvQA8AFQB8zUGdCcAHkcqjUAAwAkAbwCWlAGbGoABKAL5evgGMANIhrqAA-MGgAFygfqrcyJxSFNS0qqlqGtq6+obGJnKK5H50iPRWLByS0lVKRZo6egZG9FjmjTZ2jpzObuH+gaGgE5GgMXGJQSlpGVk5VDSgAEaF6p2lPcb9bTV1DdYcPHwtZJu0DABMl4AG8oC+moBSqi1tKvsl3eV6I8BtZbA4nC5QB4fJNGKFZoEFgkkql0plstJcltSHtil0yr1gadak9BqwXrcsbRyNsAFbWTzEBAFUCMhAIXaspnshA40BYR4AZgANNyeaJUmyeezOJKxdKEH5Uqw0ABWABsrHlPJC2tAup13N1ISkxBAoEAGPKANGVALJKoEAm-GAKjk4IBod0AAu6AAO9AKrKgBh-wBi8oAseUAC8aALk9AN4+gGj1ZaAA9NAKs2gApXQBxcoAiX0AqPqgQBccoAwuUAdh6AXflALBygC-FQCYqaAfYBEI0AN3KAAHTAIGRgFjFQDb8YAZCMAAHKAQmtACRKgFrTGQKJRBTjIACu3EQ-TMwtAAAVhhDUAxfABzQZz8GjSEAa04sjOZm5iTMAG0ZwBdbmpdcjMZQhFwkIYe+gAAysUPwWHY8QwJPQTP04vhYl5QloqiUJQ5C0PQnCqKIoDyPQ5CKPQcgzJ4M4hKAZwjs4nB+L4nDwa4UjmtagBwKv2iifqO46-tO14LucK5rvOm6oDue61AeCBHqeF4IFebG3tCERTI+z5vq4H7LBut6cfu8pLF+dHmMe-6AcBPKpK4YEQVBoAwXBCFIShaFeNMOF4QRlBETg0mCaB4GQdBsHwYhyHGOZGFYVZoj4YRojPCR0h+LhhjeFQoDLpwiAAEKyEOogjqQnDmAxwmQkulCrgAFDStKpFOCHqOwV4AJSpEOtETuls5WFKVKgHojAsPIpUYMg8jcN4iC5awGCsOVUgIDBiAjvQlDNfQ9AYDByWpbluUAG4ZCOsrNZQsjTqQE0wZQiAAJJGAAtqk2XLuVzANfKY0TVNq3cOtx67TNoxHadZ4jfq04FcNxC6uagBICYASvqAL+KgAOpoAFOqgBQ-mgIAtHKgAWAaAKVGJY+t1qiyMuSG4fBgCYSgGxBhZQEVRTF8WJZwr3IJFlB1Yx7HMTlFj5XSRXTu1iBlbOlU0d+9H1VyvL3NNrUlTznXdb1-WDf9irhYg9NIMOfUFak4HbeL531Cux5nldUoIAV1gFceLXHgADGeX23bF93i51PWLVg5UYNwozLjzyJGDQ7O0tOLXO94rvlVdqQFd9BqGQ7k2q-7BVBzN-26nceSGdYlMJUOtP05UA5nEnbCqBg2ysGzxesKX5f-Vi5Cex75DLrl9D-UAA)



## Utility Types

```typescript
interface Person {
  name: string;
  age: number;
  gender?: 'male' | 'female';
  province?: string;
}

type Readonly1<T> = { readonly [P in keyof T]: T[P] };
const u1: Readonly1<Person> = { name: 'HJ', age: 30 };

type Mutable1<T> = { -readonly [P in keyof T]: T[P] };
const u2: Mutable1<Person> = { name: 'HJ', age: 30 };

type Partial1<T> = { [P in keyof T]?: T[P] };
const u3: Partial1<Person> = { name: 'HJ' };

type Required1<T> = { [P in keyof T]-?: T[P] };
const u4: Required1<Person> = { name: 'HJ', age: 30, gender: 'male', province: '河南' };

type Exclude1<T, U> = T extends U ? never : T;
const k1: Exclude1<keyof Person, 'name'> = 'age';
const k2: Exclude1<keyof Person, 'name' | 'age'> = 'province';

type Extract1<T, U> = T extends U ? T : never;
const k3: Extract<keyof Person, 'name'> = 'name';

/**
 * extends in 等关键字只能用于联合类型(union type)
 * 为什么 Omit1 与 Omit2 表现不一致
 * Exclude<T, U> 返回联合类型，它的值可以是联合类型其中的任意一个，通过 in 关键字循环则是每一项必须有
 * 如果通过 Pick 则只会取一个范围， 并且保留接口的属性（接口的可选只读属性不会改变）
 */

type Pick1<T, K extends keyof T> = { [P in K]: T[P] };
const u5: Pick1<Person, 'age' | 'gender'> = { age: 30 };

type Omit1<T, K extends keyof any> = Pick1<T, Exclude1<keyof T, K>>;
const u6: Omit1<Person, 'name'> = { age: 30 };

type Omit2<T, K extends keyof any> = { [P in Exclude1<keyof T, K>]: T[P] };
const u7: Omit2<Person, 'name'> = { age: 30, gender: 'male', province: '河南' };

type Record1<K extends keyof any, T> = { [P in K]: T };
const info: Record<'class1' | 'class2', Person[]> = {
  class1: [{ name: 'HJ', age: 30 }],
  class2: [{ name: 'CT', age: 20 }]
};

```

## 类

#### 类的语法

```typescript
class Person {
  name: string;
  constructor(n: string) {
    this.name = n;
  }
  run(): void {
    console.log(`${this.name} is running!`);
  }
}
```

#### 类的继承

```typescript
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  run() {
    return `${this.name} is running!`;
  }
}

// var p = new Person('hou')
// console.log(p.run())
class Student extends Person {
  constructor(name: string) {
    super(name);
  }
  study(): void {
    console.log(`${this.name} is studying`);
  }
}

var stu = new Student('小王');

console.dir(stu);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(stu)) == Person.prototype);
```

#### 类的修饰符

```typescript
/*
  public: 公有 在类的内部 子类 类的外部都可以访问
  protected: 保护类型， 只能在类和子类的内部访问
  private: 私有 在类的内部可以访问， 子类 类外部没法访问
  readonly: 不能修改
*/
class Person {
  // 默认公有属性
  public name: string;
  protected sex: string;
  private tel: number;
  constructor(name: string, sex: string, tel: number) {
    this.name = name;
    this.sex = sex;
    this.tel = tel;
  }
  run() {
    console.log(`${this.name} is running!`);
  }
  sayHi() {
    console.log(`this is my phoneNumber ${this.tel}`);
  }
}

class Student extends Person {
  readonly score: number;
  constructor(name: string, sex: string, tel: number, score: number) {
    super(name, sex, tel);
    this.score = score;
  }
  study() {
    console.log(`${this.name} study is very hard, so his score ${this.score}`);
  }
}

var stu = new Student('小明', '男', 18672761579, 95);
console.dir(stu);
console.log(stu.name); // public 类和子类的内部外部都可以访问
// console.log(stu.sex)   // protected 类与子类的内部访问
// console.log(stu.tel)   // private 只能在当前类中访问
console.log(stu.score); // readonly 不能修改
// stu.score = 100

stu.sayHi();
stu.study();
```

#### 类的静态属性和方法

```typescript
class Person {
  // 实例属性
  public name: String;
  constructor(name: string) {
    this.name = name;
  }
  // 实例方法
  eat() {
    console.log(`${this.name} is eating`);
  }
  // 静态属性
  static sex = '男';
  // 静态方法 中无法调用实例属性 or 方法
  static work() {
    console.log('People need work');
  }
}

var p = new Person('小明');
// console.log(p.sex)  // 静态属性是在构造函数上
// p.work() // 静态方法是在构造函数上
console.log(Person.sex);
Person.work();
```

#### 单例模式

```typescript
// 单例模式
class Person {
  private constructor(public name: string) {}
  private static instance: Person;
  static getInstance(name: string) {
    // 这里的this指向 Person
    if (!this.instance) {
      this.instance = new Person(name);
    }
    return this.instance;
  }
}
let p1 = Person.getInstance('HJ');
let p2 = Person.getInstance('侯健');
console.log(p1 === p2); // true
```

#### 抽象类

```typescript
// 抽象类 abstract 必须在子类中实现
abstract class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  abstract eat(): any;
}

// var a = new Animal() 报错
class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  eat() {
    console.log(`${this.name}正在吃肉`);
  }
}
var dog = new Dog('小黄');
dog.eat();
```

## 函数接口（interface）

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

```typescript
interface Fn {
  (a: number, b: number): number;
}
var reduce: Fn = function (a: number, b: number): number {
  return a - b;
};
console.log(reduce(10, 5));
```

```typescript
interface Db {
  host: string;
  dbname: string;
  user: string;
  pwd: string;
  connect(): boolean;
}

class MySQL implements Db {
  host: string;
  dbname: string;
  user: string;
  pwd: string;
  constructor(props: { host: string; dbname: string; user: string; pwd: string }) {
    this.host = props.host;
    this.dbname = props.dbname;
    this.user = props.user;
    this.pwd = props.pwd;
  }
  connect(): boolean {
    if (
      this.host == 'localhost' &&
      this.dbname == 'shop' &&
      this.user == 'root' &&
      this.pwd == 'root'
    ) {
      return true;
    }
    return false;
  }
}
const m1 = new MySQL({ host: 'localhost', dbname: 'shop', user: 'root', pwd: 'root' });
console.log(m1.connect());
```

## 泛型

泛型是指在定义函数，类，接口的时候不指定具体的类型，在调用的时候，在指定具体的类型的一种特征；

使用泛型可以使函数，类，接口的功能更加的灵活，从而提高代码的复用率

```typescript
function demo<T>(arg: T): T {
  return arg;
}

console.log(demo<number>(112));
demo<string>('Hello');
demo<boolean>(true);

function demo1<T>(arg: T[]): T[] {
  return arg;
}

demo1<number>([1, 2, 3, 4]);
demo1(['hou', 'guo']);

// 泛型接口
interface Arr<T> {
  (arr: T[], falg: boolean): T[];
}

var sortNumArr: Arr<number> = function (arr: number[], flag: boolean): number[] {
  if (flag) {
    return arr.sort((a, b) => a - b);
  } else {
    return arr.sort((a, b) => b - a);
  }
};

console.log(sortNumArr([1, 4, 3, 100, 20], false));
```

## 类型别名 type 的使用

```typescript
类型别名用来给一个类型起个新名字。
type Name = string
let test:Name = "123"

type name = 'abc'
let test1: name = 'dvc' // 报错 必须为 abc
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```

#### keyof  in 的使用及**重点理解**

> keyof 返回的`联合类型`  in返回的是`联合类型其中的一个`

```typescript
interface Person {
    name: string;
    age: number;
    gender: string;
}
// 联合属性名
type key1 = keyof Person; // type K1 = "name" | "age" | "gender"

class Teacher {
    constructor(private info: Person) {}
    getInfo<T extends keyof Person>(key: T): Person[T] {
        return this.info[key];
    }
}
const teacher: Teacher = new Teacher({ name: 'HOU', age: 28, gender: '男' });
const gender = teacher.getInfo('gender');

function pluck<T, K extends keyof T>(o: T, names: K[]): Array<T[K]> {
    return names.map((n) => o[n]);
}
const person: Person = { name: 'HOU', gender: '男', age: 28 };


```









## 装饰器（Decorators）

装饰器是一种特殊的函数，可以用来修饰类，属性，方法。可以在不修改类，属性，方法的前提下扩展类，属性，方法的功能

#### 普通装饰器（无参）

```typescript
@Component
class Person {}
function Component(target: any) {
  // 输出 Home构造函数
  console.log(target);
  // 扩展类的属性和方法
  target.prototype.name = 'Holger';
  target.prototype.init = function () {
    console.log('init 方法执行了');
  };
  // 扩展静态方法
  target.sex = '男';
}
const p = new Person();
console.dir(p);
console.log(p.name);
p.init();
console.log(Person.sex);
```

#### 装饰器工厂（有参）

```typescript
function Module(params: any) {
  console.log(params); // {name: "router"}
  return function (target: any) {
    console.log(target); // Common 类
    target.prototype.init = function () {
      console.log('init 方法被触发了');
    };
    target.prototype.name = params.name;
  };
}
@Module({ name: 'router' })
class Common {}

const c1 = new Common();
c1.init();
console.log(c1.name);
```

```typescript
function Input(params: string) {
  console.log(params);
  return function (target: any) {
    console.log(target); // Http.prototype
    target.baseUrl = params;
  };
}
class Http {
  @Input('http://localhost:3000/')
  public baseUrl: string;
  constructor() {}
}
const http = new Http();
console.log(http.baseUrl);
```



```typescript
function Log(params: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(target); // Page.prototype
    console.log(propertyKey); // render
    // Object.getOwnPropertyDescriptor(Page.prototype,'render')
    // 返回指定对象上一个自有属性对应的属性描述符(不能从原型链上进行查找的属性)
    console.log(Object.getOwnPropertyDescriptor(target, propertyKey));
    // 不相等 不知道为什么
    console.log(Object.getOwnPropertyDescriptor(target, propertyKey) === descriptor);
    console.log(descriptor); // 指向render 方法的描述
    console.log(`${propertyKey}方法的${params}` + new Date().toLocaleString());
  };
}
class Page {
  @Log('执行时间：')
  render() {
    console.log('render 方法被执行了');
  }
}
```

![关于装饰器的执行顺序](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/Snipaste_2023-05-10_15-08-55.png)

