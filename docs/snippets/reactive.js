const bucket = new WeakMap();

function cleanUp(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

function track(target, key) {
  if (activeEffect) {
    let depsMap = bucket.get(target);
    if (!depsMap) bucket.set(target, (depsMap = new Map()));
    let deps = depsMap.get(key);
    if (!deps) depsMap.set(key, (deps = new Set()));
    deps.add(activeEffect);
    activeEffect.deps.push(deps);
    // console.log('track=====> ', key);
  }
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (depsMap) {
    const effects = depsMap.get(key);
    const effectsToRun = new Set();
    effects?.forEach(effect => {
      if (activeEffect !== effect) effectsToRun.add(effect);
    });
    effectsToRun.forEach(effect => {
      // console.log('trigger=====> ', key);
      if (effect.options?.scheduler) {
        effect.options.scheduler(effect);
      } else {
        effect();
      }
    });
  }
}

function reactive(target) {
  return new Proxy(target, {
    get(target, p, receiver) {
      track(target, p);
      return Reflect.get(target, p, receiver);
    },
    set(target, p, newValue, receiver) {
      const res = Reflect.set(target, p, newValue, receiver);
      trigger(target, p);
      return res;
    }
  });
}

let activeEffect;
const effectStack = [];
function effect(fn, options) {
  const effectFn = () => {
    cleanUp(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const result = fn();
    effectStack.pop();
    activeEffect = effectStack.at(-1);
    return result;
  };
  effectFn.deps = [];
  effectFn.options = options;
  if (effectFn.options?.lazy) {
    return effectFn;
  }
  effectFn();
}

const obj = reactive({ ok: true, text: 'hello world', foo: 1, bar: 2, delay: 1000 });
// effect(() => {
//   document.body.innerText = obj.ok ? obj.text : 'not';
//   obj.foo++;
//   obj.noExist = 'noExist';
// });
// obj.ok = false;

// let temp1, temp2;
// effect(() => {
//   console.log('======== effectFn1 run ========');
//   effect(() => {
//     console.log('======== effectFn2 run ========');
//     temp2 = obj.text;
//   });
//   temp1 = obj.ok;
// });

// obj.text = 'hello vue';

function computed(getter) {
  let value,
    dirty = true;
  const effectFn = effect(getter, {
    lazy: true,
    scheduler(fn) {
      dirty = true;
      trigger(obj, value);
    }
  });
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, value);
      return value;
    }
  };
  return obj;
}

// const sumRes = computed(() => obj.foo + obj.bar);
// console.log(sumRes.value);
// console.log(sumRes.value);

// effect(() => {
//   console.log('sumRes.value=====> ', sumRes.value);
// });
// obj.foo = 3;

function travese(value, seen = new Set()) {
  if (typeof value !== 'object' || typeof value === null || seen.has(value)) return;
  seen.add(value);
  for (const k in value) {
    travese(value[k], seen);
  }
  return value;
}

function watch(source, cb, options) {
  let getter;
  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => travese(source);
  }

  let newValue, oldValue, cleanUp;

  function onInvalidate(fn) {
    cleanUp = fn;
  }

  function job() {
    cleanUp?.();
    newValue = effectFn();
    cb(newValue, oldValue, onInvalidate);
    oldValue = newValue;
  }

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (options?.flush === 'post') {
        Promise.resolve().then(job);
      } else {
        job();
      }
    }
  });

  if (options?.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}

watch(
  obj,
  async (newValue, oldValue, onInvalidate) => {
    console.log(newValue.delay, oldValue.delay);
    let expired = false;
    onInvalidate(() => {
      expired = true;
    });
    const res = await fetch(`https://www.test.com/test?delay=${newValue.delay}`).then(res =>
      res.json()
    );

    if (!expired) {
      console.log(res);
    }
  },
  {
    // immediate: true
    // flush: 'post'
  }
);

obj.delay += 2000;
obj.delay += 2000;
// obj.foo++;

console.log('end');
