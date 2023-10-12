## slot 插槽

#### [具名插槽](https://v2.cn.vuejs.org/v2/guide/components-slots.html#%E5%85%B7%E5%90%8D%E6%8F%92%E6%A7%BD)

![image-20221106164526868](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20221106164526868.png)

#### [作用域插槽](https://v2.cn.vuejs.org/v2/guide/components-slots.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%8F%92%E6%A7%BD)

![image-20221106170550110](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20221106170550110.png)

## vuex 总结

- 案例结构

模块 B 使用了 namespaced

```js
// store.js
export default new Vuex.Store({
  getters: {
    stateLength: (state) => state.state.length,
  },
  state: {
    titleRoot: "我是rootState的值",
    state: ["等待审核", "审核通过", "审核拒绝"],
  },
  modules: { moduleA, moduleB },
});
// moduleA.js
export default {
  getters: {
    doubleCounterA: (state) => state.counterA * 2,
  },
  state: {
    titleA: "我是moduleA中的title的值",
    counterA: 10,
  },
  mutations: {
    increment(state, payload) {
      console.log("moduleA", state.counterA, payload);
      const { amount } = payload;
      state.counterA += amount;
    },
  },
  actions: {
    incrementAsync({ commit }) {
      commit("increment", 5);
    },
  },
};

// moduleB.js
export default {
  namespaced: true,
  getters: {
    doubleCounterB: (state) => state.counterB * 2,
  },
  state: {
    titleB: "我是moduleB中的title的值",
    counterB: 100,
  },
  mutations: {
    increment(state, payload) {
      console.log("moduleB", state.counterB, payload);
      const { amount } = payload;
      state.counterB += amount;
    },
  },
  actions: {
    incrementAsync({ commit }) {
      commit("increment", 5);
    },
  },
};

// 数组形式 =》 启用namespaced只能使用第二种方式 未启用 namespaced 的只能使用对象形式
// ...mapState(["titleRoot"]),
// ...mapState("moduleB", ["titleB"]),
// ...mapState({ titleA: (state) => state.moduleA.titleA }),

// 对象形式
...mapState({
    titleRoot: "titleRoot", // 不能简写，仔细思考
    titleA: (state) => state.moduleA.titleA,
    titleB: (state) => state.moduleB.titleB,
}),
// 数组形式=》 未启用namespaced 可以全局 启用namespaced 需要标注模块名
// ...mapGetters(["stateLength", "doubleCounterA"]),
// ...mapGetters("moduleB", ["doubleCounterB"]),
// 对象形式
...mapGetters({
    stateLength: "stateLength",
    doubleCounterA: "doubleCounterA",
    doubleCounterB: "moduleB/doubleCounterB",
}),
// 方法
...mapMutations({
  changeCounterA: { type: "increment", amount: 1 },
  // changeCounterB: { type: "moduleB/increment", amount: 1 },
}),

...mapMutations(["increment", "moduleB/increment"]),
// changeCounterA() {
//   // this.$store.commit({ type: "increment", amount: 1 });
//   this.$store.commit("increment", { amount: 1 });
// },
changeCounterB() {
  // this.$store.commit({ type: "moduleB/increment", amount: 1 });
  // this.$store.commit("moduleB/increment", { amount: 1 });
  this["moduleB/increment"]({ amount: 10 });
},
```

![image-20211210161536814](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20211210161536814.png)![image-20211210161717985](https://holger-picgo.oss-cn-beijing.aliyuncs.com/img/image-20211210161717985.png)

state 是所有模块与根模块的数据集合，getters、mutations、actions 如果启用了 namespaced，则需要加模块名前缀

## redux 与 vuex 对比

## 构建工具 Vite

**依赖预构建**

- 开发环境下，vite 会找到相关依赖，通过调用 esbuild（对 js 语法进行处理的库） 将其它规范的代码转换为 esmodule 规范，放入当前目录下的 node_modules\.vite\deps

1. 解决不同的第三包会有不同的导出格式 。
2. 解决对路径的处理可以直接使用统一路径 `node_modules/.vite/deps/` 方便路径重写。
3. 解决网络多包传输的性能问题（也是原生 esmodule 规范不敢支持 node_modules 的原因）。

```js
// 不会生成 node_modules/.vite/deps/lodash-es.js 文件
export default {
  optimizeDeps: {
    exclude: ['lodash-es']
  }
};
```

- 生产环境下，会使用 `@rollup/plugin-commonjs` 构建

```js

```

## React hooks

- useState

- useEffect

- useMemo

  ```jsx
  // 未使用 useMemo
  function Example1() {
    const [count, setCount] = useState(1);
    const [value, setValue] = useState('hello');

    const getNum = () => {
      console.log('getNum reRender 浪费性能');
      return Array.from({ length: count * 100 }, (item, index) => index).reduce(
        (initialValue, item) => initialValue + item,
        0
      );
    };
    return (
      <div>
        <h3>总和为：{getNum()}</h3>
        <button onClick={() => setCount(value => value + 1)}>count+1</button>
        <h3>{value}</h3>
        <input type="text" value={value} onInput={e => setValue(e.target.value)} />
      </div>
    );
  }
  // 使用 useMemo => 依赖改变才重新运行 并且返回的是值，并不需要调用
  function Example2() {
    const [count, setCount] = useState(1);
    const [value, setValue] = useState('hello');

    const getNum = useMemo(() => {
      console.log('只需要渲染一次');
      return Array.from({ length: count * 1000 }, (item, index) => index).reduce(
        (initialValue, index) => initialValue + index,
        0
      );
    }, [count]);
    return (
      <div>
        <h3>总和为：{getNum}</h3>
        <button onClick={() => setCount(value => value + 1)}>count+1</button>
        <h3>{value}</h3>
        <input type="text" value={value} onInput={e => setValue(e.target.value)} />
      </div>
    );
  }
  ```

- useContext

  ```jsx
  
  ```

## reactive

<<< @/snippets/reactive.js

### 入口文件查看 Vue 源码

1. 查看`package.json`文件

```
"dev": "rollup -w -c scripts/config.js --environment TARGET:full-dev"
```

2. 查看 `scripts/config.js` `full-dev` 通过代码分析出入口文件路径为 `src/platforms/web/entry-runtime-with-compiler.ts`

```js
const aliases = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  server: resolve('packages/server-renderer/src'),
  sfc: resolve('packages/compiler-sfc/src')
}

const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

const full-dev = {
    entry: resolve('web/entry-runtime-with-compiler.ts'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
},
```

`initGlobalAPI`给 `Vue` 添加静态方法

```js
export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn('Do not replace the Vue.config object, set individual fields instead.');
    };
  }
  // Vue.config
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  config._assetTypes.forEach(type => {
    // Vue.options 添加 components directives filters 属性
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;
  // Vue.options.components.KeepAlive
  extend(Vue.options.components, builtInComponents);
  // Vue => 静态方法 use Mixin Extend
  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
  // Vue => 静态方法 component directive filter
  initAssetRegisters(Vue);
}
```

```js
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}
// 实例方法 __init
initMixin(Vue);
// 实例方法 $data $props $set $delete $watch
stateMixin(Vue);
// 实例方法 $on $once $off $emit
eventsMixin(Vue);
// 实例方法  _update（没写错）
lifecycleMixin(Vue);
// 实例方法 $nextTick _render _o _n _s _l _t _q _i _m _f _k _b _v _e _u
renderMixin(Vue);

export default Vue;
```
