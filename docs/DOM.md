### 选择器

[参考链接](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)



| 选择器                                                       | 示例               |
| ------------------------------------------------------------ | ------------------ |
| 基本选择器_[通配选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors) | * { }              |
| 基本选择器_[类型选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Type_selectors) | h1 {}              |
| 基本选择器_[类选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Class_selectors) | .container {}      |
| 基本选择器_[ID选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/ID_selectors) | #id {}             |
| 基本选择器_[标签属性选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors) | input[type=text]   |
| 伪选择器_[伪类选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes) | div:first-child {} |
| 伪选择器_[伪元素选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements) | div::after {}      |
| 组合器_[后代选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Descendant_combinator) | ul li {}           |
| 组合器_[子代选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Child_combinator) | ul > li {}         |
| 组合器_[相邻兄弟选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Adjacent_sibling_combinator) | div + p {}         |
| 组合器_[通用兄弟选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/General_sibling_combinator) | h1 ~ p {}          |
| 分组选择器_[选择器列表](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Selector_list) | div, p {}          |
| 交集选择器(叠加样式)                                         | div.container {}   |



#### nth-child 与 nth-of-type区别

`nth-child` 执行过程=> 会把所有的盒子都排列序号，之后看  :nth-child 前面跟的元素 如果匹配成功则在执行

`nth-of-type` 执行过程 => 先看 :(冒号)前面的跟的是哪种类型的元素，然后把属于这种类型的进行排列序号







* offset

> `offsetLeft` | `offsetTop` 无法获取能过 `translate` 移动的真实偏移
>
> 



* client
* scroll







### 网页布局



#### 浮动

> 理解 `BFC` ：其实就是创建一块独立的区域，把内部元素的布局与外部元素隔开，不管内部如何变动，都不会影响到外部元素。并且会阻止内部元素[外边距合并](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)。
>
> 1. 浮动元素脱离标准流
> 2. 浮动元素一行显示，除非一行显示不了，才进行换行
> 3. 添加了浮动后，浮动元素具有行内块特性(也就意味着如果不给宽度，元素的宽度由其内容的宽度决定)
>
> 浮动只会影响后续盒子排列，如果后面的盒子有浮动，不能压到前面浮动的盒子，如果不浮动，后面浮动的例子不能小于其高度



* 第二个盒子高度 < 第一个盒子高度

![image-20210710105835377](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20210710105835377.png)

* 第二个盒子高度 >= 第一个盒子时高度

![image-20210710110100340](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20210710110100340.png)

* 清除浮动

原因：由于父盒子不便给高度，子盒子浮动后，后面的盒子会跑上去。

1. 额外标签法    clear:both    在浮动盒子的后面添加一个盒子

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
        .box1 {
            width: 500px;
            background-color: pink;
        }
        .son1 {
            width: 150px;
            height: 200px;
            background-color: skyblue;
            float: left;
        }
        .son2 {
            width: 150px;
            height: 200px;
            background-color: gray;
            float: left;
        }
        .box2 {
            width: 500px;
            height: 400px;
            background-color: purple;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>
    <div class="box1">
        <div class="son1"></div>
        <div class="son2"></div>
        <div class="clear"></div>
    </div>
    <div class="box2"></div>
</body>
</html>
```

2. overflow: hidden;——父级添加overflow: hidden方法
3. after伪元素清除浮动——父级盒子添加.clearfix:after

```css
.clearfix:after {
    content: ".";
    height: 0;
    display: block;
    visibility: hidden;
    clear: both;
}
.clearfix {
    *zoom: 1;
}
```

4. 双伪元素清除浮动

```css
.clearfix:after,.clearfix:before {
content:"";
display:table; /*触发bfc*/
}
.clearfix:after {
clear: both;
}
.clearfix {
*zoom: 1;
}
```



#### 定位

1. 静态定位 static
   
   默认值，正常文档流

2. 相对定位 relative
   
   原来的位置继续占有，每次移动以自己的左上角为基准点来移动

3. 绝对定位 absolute
   
   原来的位置不保留，以最近的带有定位的祖先元素（非static）为基准点来移动

4. 固定定位 fixed
   
   相对于浏览器视窗进行定位

5. 粘性定位 sticky
   
   是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之后为固定定位



#### FLEX布局

> `justify-content` 和 `align-content` 是控制flex项目（flex items）在 **主轴** 和 **”多条主轴“在交叉轴** 的对齐方式，所以当主轴为水平时，交叉轴必须有多行 `align-content` 才会有效。反之同理！作用于 flex容器（flex container）。[^1]
>
> `align-items` 和 `align-self` 是控制 **多个** 或 **单个** flex项目在交叉轴对齐方式，取值相同。由于其本身默认值为 stretch，所有只有当容器高度 大于项目总高度时，改变基才有效！交叉轴不管单行多行都有效，分别作用于 flex容器(`align-items`) flex项目（`flex items`）

```css
.container {
    height: 400px;
    display: flex;
    flex-flow: row wrap;
    /* justify-content: space-between; */
    align-content: space-between;
}
.item {
    flex: 0 1 30%;
    height: 100px;
    background-color: purple;
}

/* 按照一行三个 当最后一个是3n-1时(2、5、7) 则给外边距 */
.item:last-child:nth-child(3n-1) {
    margin-right: calc(30% + 10% / 2);
}

/* 去掉父容器的 justify-content */
.item:not(:nth-child(3n)) {
    margin-right: calc(10% / 2);
}
```



#### GRID布局

##### 作用于 `grid` 容器

* `grid-template-columns` 与 `grid-template-rows`

```html
<div class="container">
    <div class="item">你好啊</div>
</div>
```



```css
.container {
    width: 1200px;
    margin: auto;
    display: grid;

    /* <line-name> [row1] <track-size> 25% */
    grid-template-columns: [col1-start] 80px [col1-end col2-start] auto [col2-end col3-start] 100px [col3-end];
    grid-template-rows: [row1] 25% [row2] 100px [row3] 50px [row4] 60px [row5];

    /* 简写 */
    grid-template-columns: 80px auto 100px;
    grid-template-rows: 25% 100px 50px 60px;

    /* repeat */
    grid-template-columns: repeat(4, 300px);
    grid-template-rows: repeat(4, [row-start] 100px [row-end]);

    /* 1fr = 1200 / 4 = 300 */
    grid-template-columns: 1fr 1fr 2fr;
    grid-template-rows: repeat(4, 100px);

    /* 1fr = (1200 - 300) / 3 = 300 */
    grid-template-columns: 300px 1fr 2fr;
    grid-template-rows: repeat(4, 100px);

    /* 如果为auto 即内容宽度 假设内容宽度为48 则 1fr = (1200-48)/3=384 */
    grid-template-columns: auto 1fr 2fr;
    grid-template-rows: repeat(4, 100px);

    /* 0.25fr = (1200-48)*0.25 = 288  auto = 1200 - (288 *3) = 336px */
    grid-template-columns: auto 0.25fr 0.25fr 0.25fr;
    grid-template-rows: repeat(4, 100px);
}
```



* `grid-template-areas`



```html
<style>
    .container {
        margin: 0 auto;
        width: 1200px;
        height: 600px;
        display: grid;

        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: repeat(4, 1fr);
        /* grid-template-areas 会自动添加 <linename> */
        grid-template-areas:
            '葡萄 葡萄 葡萄'
            '龙虾 养鱼 养鱼'
            '龙虾 养鱼 养鱼'
            '西瓜 西瓜 西瓜';
    }

    .putao {
        grid-area: 葡萄;
    }
    .longxia {
        grid-area: 龙虾;
    }
    .yangyu {
        grid-area: 养鱼;
    }
    .xigua {
        grid-area: 西瓜;
    }
</style>

<div class="container">
    <div class="putao">葡萄种植区</div>
    <div class="longxia">龙虾养殖区</div>
    <div class="yangyu">鱼类养殖区</div>
    <div class="xigua">西瓜种植区</div>
</div>
```



* `grid-template`

> `grid-template`是`grid-template-rows`，`grid-template-columns`和`grid-template-areas`属性的缩写

```css
/* html 同上 */
.container {
    margin: 0 auto;
    width: 1200px;
    height: 600px;
    display: grid;

    /* 4行3列 <grid-template-rows> / <grid-template-columns> */
    grid-template:
        '葡萄 葡萄 葡萄' 1fr
        '龙虾 养鱼 养鱼' 1fr
        '龙虾 养鱼 养鱼' 1fr
        '西瓜 西瓜 西瓜' 1fr
        /1fr 1fr 1fr;
}

.putao {
    grid-area: 葡萄;
}
.longxia {
    grid-area: 龙虾;
}
.yangyu {
    grid-area: 养鱼;
}
.xigua {
    grid-area: 西瓜;
}

```



* `grid-column-gap` 与 `grid-row-gap`

```html
<style>
    .container {
        margin: 0 auto;
        width: 1200px;
        height: 600px;
        display: grid;

        /* <grid-template-rows> / <grid-template-columns> */
        grid-template: 1fr 2fr/ 2fr 1fr;

        /* 过时的写法 */
        /* grid-row-gap: 16px;
        grid-column-gap: 8px; */

        /* 推荐的写法 */
        /* row-gap: 16px;
        column-gap: 8px; */

        /* 过时的简写 <grid-row-gap> / <grid-column-gap> */
        /* grid-gap: 16px 8px; */

        /* 推荐的写法 */
        gap: 16px 8px;
    }
</style>

<div class="container"></div>
```



* 对齐方式



```html
<style>
    .container {
        margin: 0 auto;
        width: 400px;
        height: 400px;
        display: grid;
        grid-template: 100px 100px 100px / 100px 100px 100px;
        /* gap: 10px; */

        /* align-items justify-items  默认值 stretch  相对于单元格（Grid cell）的位置 */
        /* align-items: center; */
        /* justify-items: center; */

        /* 简写 <align-items> <justify-items> */
        place-items: stretch;

        /* align-content justify-content 默认值 stretch 相对于 水平(inline/row axis) 垂直(block/column axis) 的对齐方式 */
        /* align-content: space-between;
        justify-content: space-between; */

        /* place-content: space-between; */
    }

    .container > div {
        background-color: teal;
    }

</style>


<div class="container">
    <div class="item1">item1</div>
    <div class="item2">item2</div>
    <div class="item3">item3</div>
    <div class="item4">item4</div>
    <div class="item5">item5</div>
    <div class="item6">item6</div>
    <div class="item7">item7</div>
    <div class="item8">item8</div>
    <div class="item9">item9</div>
</div>
```







##### 作用于 `gird` 子项



#### line-height 与 vertical-align的理解

* line boxes 的高度=`font-size` *` line-height`
* `line-height`当父元素为百分比和em单位时，子元素会继承行高，子元素的行高（行高= 父元素的`font-size`*父元素的`line-height`）
* 数字值则会根据子元素的`font-size`* `line-height`进行重新计算
* 行内块元素看不出行高，但是可以通过其父元素，确定其行高，也就是说行内元素设置行高作用于父元素

<!-- .parent 内容的line-height 为 16px*1.5 =24px -->

<!-- line-height: 1.5 (即40*1.5=60px) .son的高度为 60*3+2px(border)= 182px-->

<!-- line-height: 1.5em (即16*1.5=24px) .son的高度为 24*3 +2px =74px -->

<!-- line-height: 150% (即16*1.5=24px) .son的高度为 24*3+2px = 74px -->

```html
<style>
    .parent {
      background-color: #f0f0f0;
      line-height: 1.5;
    }

    .son {
      border: 1px solid blue;
      font-size: 40px;
    }
  </style>
</head>

<body>
  <div class="parent">
    我是父级元素，我的font-size为16px，line-height为150%
    <div class="son">
      我是子级元素，我的font-size为40px，继承line-height为150%
      我是子级元素，我的font-size为40px，继承line-height为150%
      我是子级元素，我的font-size为40px，继承line-height为150%
      我是子级元素，我的font-size为40px，继承line-height为150%
    </div>
  </div>
</body>
```



### 常规属性

#### font

rem 相对于根元素（即 `html` 元素 默认为 16px ）、 em 相对于父元素



#### `vertical-align` 与 `line-height`





> <code>[x-height](https://zh.wikipedia.org/zh-cn/X%E5%AD%97%E9%AB%98)</code> 是指字母的基本高度，精确的说就是基线（`basheline`）和主线（`mean line` 又称中线 `median`）之间的距离
>
> `ascender` 是指超过主线笔画的部分，也就是比 `x-height` 还要高的部分
>
> `descender` 是指字母向下延伸超过基线的笔画部分，也称为**下延部**
>
> `cap height` 是指位于基线以上的大写字母的高度
>
> `vertical-align: middle` 指的是基线往上1/2 `"x-height"`高度。我们可以近似脑补成字母`x`交叉点那个位置。 跟 `median` 不是一个意思。





<img src="https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/x-height.svg" alt="x-height" style="zoom:400%;" />





#### shadow

`box-shadow: h-shadow v-shadow blur spread color inset(默认outset不用写)`

`text-shadow: h-shadow v-shadow blur color;`

水平阴影位置 垂直阴影位置 模糊程度(距离) 阴影尺寸 阴影颜色 外阴影(默认)

#### background

`background: #008080 url() background-position/background-size background-origin background-clip background-repeat`

* `background-attachment`
  
  默认值： `scroll`  背景相对元素本身是固定的（即使元素是滚动的）
  
  `local`相对于元素的内容（文字）固定（overflow: auto)
  
  `fixed` 相对于视口(可视区域)固定，background-position也是相对于可视区域了（所以center 可能看不见）

* `background-position`
  
  百分比值: （盒子宽度 - 图片宽度）  * 百度比 = 偏移像素
  
  水平位置：（800 -500）* 50% = 150px 此时图片居中显示

* `background-size`
  
  百分比是相对于盒子的大小，根据`background-origin`的宽高进行计算，默认是padding+content区域百分比
  
  如果只有一个值的话，另一边自适应（保持长宽比）

* `background-origin`**规定背景图片的绘制区域(即图片右上角的起始位置)**
  
      默认值： `padding-box`
  
  简写属性时 如果只有一个属性 则表示 background-origin 和background-clip 都为这个属性值，如果是两个值，第一个为origin ,第二个为clip

* `background-clip`**设置元素的背景（背景颜色，背景图片）,只是粗暴的剪切**
  
      默认值：`border-box`
  
  `-webkit-background-clip: text;`背景变为前景色

* background-origin` 与 `background-clip` 的区别（测试时border取虚线，效果明显）
  
      值： `border-box padding-box content-box`
      
      `background-clip` 还有一个特殊值  `text` 即把背景色（图片）剪裁为文字颜色

#### transition

* `transition: transition-property transition-duration transition-delay transition-timing-function`
  
  如果只有一个时间值，默认是`duration`
  
  `timing-function` linear(匀速) ease（先加速后减速） ease-in



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        div {
            width: 200px;
            height: 200px;
            background-color: red;
            margin: 20px auto;
            /* 指定过渡或动态模拟的CSS属性 */
            transition-property: all;
            /* 过渡时间 */
            transition-duration: .5s;
            /* 过渡函数 */
            transition-timing-function: ease;
            /* 延迟执行时间 */
            transition-delay: .2s;
            /* 相当于 transition: all .5s ease .2s*/
        }
        div:hover {
            background-color: orange;
            margin-top: 100px;
        }
    </style>
</head>
<body>
<div></div>
</body>
</html>
```

transition-timing-function: 

ease-默认值，速度由快到慢

linear-匀速

ease-in：加速

ease-out：减速

ease-in-out：先加速再减速



##### 

#### transform

 transform: rotate(45deg);顺时针旋转

transform:skew(45deg, 10deg); 

skew(水平方向（右-正），垂直方向（下为正）)

transform: scale(1.5，1.2); 水平，垂直都绽放

如果只写一个参数，就是等比缩放

transform:translate(x,y);

transform：translateX(50%):走自己宽度的一半



#### 三角形=>三角提示框

```html
<style>
    #triangle::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 16px solid transparent;
        border-right: 16px solid transparent;
        border-bottom: 16px solid #41aaa8;
        box-sizing: border-box;
        top: -16px;
        left: 40px;
    }
    #triangle {
        width: 200px;
        height: 50px;
        position: relative;
        border-radius: 20px;
        border: 2px solid #41aaa8;
        margin-top: 50px;
        box-sizing: border-box;
        left: 100px;
        top: 100px;
    }
    #triangle::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 16px solid transparent;
        border-right: 16px solid transparent;
        border-bottom: 16px solid #fff;
        top: -14px;
        left: 40px;
    }
</style>
<div id="triangle"></div>
```





### DOM节点



```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
<script>
  const ul = document.getElementsByTagName('ul')[0];
  console.log(ul.children);
  console.log(ul.firstElementChild);
  console.log(ul.lastElementChild);
  console.log(ul.children[2].previousElementSibling) // li2
  console.log(ul.children[2].nextElementSibling) // li4
  console.log('-----------')
  console.log(ul.childNodes)
  console.log(ul.firstChild);
  console.log(ul.lastChild);
  console.log(ul.childNodes[2].previousSibling === ul.childNodes[2].previousElementSibling)
</script>
```

### 事件流

`addEventListener`

```js
target.addEventListener(type, listener, options); 
{ capture: false, once: false, passive: false } // 默认值 
capture 事件传播方式 与只传一个参数一样
once 只能被点击一次
passive 为true时，表示阻止e.preventDefault
// 1 捕获阶段 2 目标阶段 3 冒泡阶段 e.eventPhase => number 
```

```js
// 执行顺序 =》  捕获 --- 目标 ---冒泡 
span.addEventListener('click', e => {
    console.log('我是重孙子')
}, true)
span.addEventListener('click', e => {
    console.log('我是重孙子 冒泡')
}, false)
grandson.addEventListener('click', e => {
    console.log('我是孙子')
}, true)
son.addEventListener('click', e => {
    console.log('我是儿子')
}, true)
parent.addEventListener('click', e => {
    console.log('我是父亲')
}, true)
document.addEventListener('click', e => {
    console.log('我是documnet')
}, false)
//  当点击 span 时 按照顺序 为true的先执行 输出结果为 父亲 儿子 孙子 重孙子 重孙子冒泡 document
```

### 作用域

1. 变量的提升

```js
console.log(a); // undefined
var a = 10;
```

```js
for (var i = 0; i <= 3; i++) {
    setTimeout(() => {
        console.log(i);
    }, 1000);
}
for (var i = 0; i <= 3; i++) {
    (function (a) {
        console.log(a)
    })(i);
}

for (let i = 0; i <= 3; i++) {
    setTimeout(function () {
        console.log(i);
    }, 1000);
}
```

### 闭包

```js
// 使用闭包获取区间
var arr = [1, 2, 3, 4, 5, 6, 7, 8];
let hd = arr.filter(v => v > 3 && v < 7);
console.log(hd);
let hd1 = arr.filter(v => v > 4 && v < 8);
console.log(hd1);
function between(a, b) {
    return function (v) {
        return v > a && v < b;
    };
}
console.log(arr.filter(between(2, 7)));

let btns = document.querySelectorAll('button');
btns.forEach(item => {
    let bind = false;
    item.addEventListener('click', () => {
        let left = 1;
        if (!bind) {
            // setInterval 返加非零数值
            bind = setInterval(() => {
                item.style.left = left++ + 'px';
            }, 10);
        }
    });
});
```



`break`  跳出当前循环 `continue ` 跳过当前循环，开始下一轮









[^1]:  grid布局中 `place-content` 是 `align-content` 与 `justify-content`的复合写法。 `place-items` 是 `align-items` `justify-items` 的复合写法。flex布局中都可以使用
[^2]: dddd
