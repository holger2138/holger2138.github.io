const STATE = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
};

const styles = ['font: 20px "Fira Code"', 'color: #9A1663'];
let id = 0;
class MyPromise {
  id = id++;
  state = STATE.PENDING;
  value = null;
  reason = null;
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  resolve = value => {
    if (this.state === STATE.PENDING) {
      this.state = STATE.FULFILLED;
      this.value = value;
      // console.log('resolve=====> ', value);
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };

  reject = reason => {
    if (this.state === STATE.PENDING) {
      this.state = STATE.REJECTED;
      this.reason = reason;
      // console.log('reject=====> ', reason);
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason;
          };

    // const thenLog = `${this.state}${this.value || this.reason || ''}`;
    // console.log(`%cthen=====>\t${thenLog} `, styles.join(';'));
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const rejectedMicrostask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.state === STATE.FULFILLED) {
        fulfilledMicrotask();
      } else if (this.state === STATE.REJECTED) {
        rejectedMicrostask();
      } else if (this.state === STATE.PENDING) {
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrostask);
      }
    });
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => {
      // 可能是 thenable 对象
      resolvePromise(null, value, resolve, this.reject)
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // console.log('resolvePromise=====> ', promise, x);
  if (promise === x) {
    // then方法需要异步，需要避免返回自己，循环引用
    // const { name, message } = new TypeError('Chaining cycle detected for promise #<MyPromise>');
    // return reject(`${name}: ${message}`);
    return reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'));
  }

  if (['object', 'function'].includes(typeof x) && x !== null) {
    let then, called;
    try {
      // thenable get劫持
      then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            // 避免 thenable 多次调用
            if (called) return;
            called = true;
            console.log('onFulfilled=====> ', called, x);
            // y 可能还是 promise ，需要递归调用，解析出最终值
            resolvePromise(promise, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            console.log('onRejected=====> ', called, x);
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      /** 为什么要判断 called ?
       * 假设自定义 thenable 传递三个函数 y(resolvePromse) r(rejectPromise) z(anotherFn)
       * 如果调用 z 后,再调用 y || r 会被下一个 then 捕获, y || r 不会执行,自然没有问题
       * 如果调用 y || r 后调用了 z, y || r 执行后会被下一个then捕获,z也会执行报错也会 catch 被捕获,开始执行 reject
       * 当然上述只是优化逻辑,不限定对于结果没有任何影响(只为跑通测试) 因为 resolve || reject 以作出判断
       */
      // called 不用赋值,捕获错误后,后续代码不会再执行
      console.log('catch=====> ', called, error);
      if (called) return;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

// 测试相关 promises-aplus-tests
MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

module.exports = MyPromise;
