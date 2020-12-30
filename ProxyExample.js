//使用get拦截，实现数组读取负数的索引

//判读是否是数字
//isNaN()的缺点就在于 null、空格以及''会被按照0来处理;
// 对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false
function isRealNum(val) {
  if (val == '' || val == null) return false;
  if (!isNaN(val) && typeof val == 'number') {
    return true;
  } else {
    return false;
  }
}

function createArray(...elements) {
  const handler = {
    get(target, key, value, receiver) {
      let index = Number(key);
      if (index < 0) {
        key = String(target.length + index);
      }
      return Reflect.get(target, key, value, receiver);

    }
  };
  let target = [...elements];
  return new Proxy(target, handler);
}
let arr = createArray('a', 'b', 'c');
console.log(arr[-1]) //'c'

//proxy 链式操作

var pipe = function (value) {
  var funcStack = [];
  var oproxy = new Proxy({}, {
    get(pipeObject, fName) {
      if (fName == 'get') {
        return funcStack.reduce((val, fn) => {
          return fn(val);
        }, value);
      }
      funcStack.push(window[fName]);
      return oproxy;
    }
  });
  return oproxy;
}

var double = n => n * 2;
var pow = n => n * n;
var reverseInt = n => n.toString().split('').reverse().join('') | 0;

pipe(3).double.pow.reverseInt.get;

//我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合get和set方法，就可以做到防止这些内部属性被外部读写。
const handler = {
  get(target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set(target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant(key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property


//设置myObj.foo属性的值时，myObj并没有foo属性，因此引擎会到myObj的原型链去找foo属性。
// myObj的原型对象proxy是一个 Proxy 实例，设置它的foo属性会触发set方法。这时，第四个参数receiver就指向原始赋值行为所在的对象myObj。
const handler = {
  set: function (obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
proxy.foo === proxy // true

const handler = {
  set: function (obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
const myObj = {};
Object.setPrototypeOf(myObj, proxy);

myObj.foo = 'bar';
myObj.foo === myObj // true 



// 拦截第一个字符为下划线的属性名。
let target = {
  _bar: 'foo',
  _prop: 'bar',
  prop: 'baz'
};
let handler = {
  ownKeys(target) {
    return Reflect.ownKeys(target).filter(val => val[0] !== '_');
  }
}
let proxy = new Proxy(target, handler);
for (let key of Object.keys(proxy)) {
  console.log(target[key]);
}
// "baz"

//有些原生对象的内部属性，只有通过正确的this才能拿到，所以 Proxy 也无法代理这些原生对象的属性。
var target = new Date();
var handler = {};
var proxy = new Proxy(target, handler);
proxy.getDate();
// TypeError: this is not a Date object.

// getDate()方法只能在Date对象实例上面拿到，如果this不是Date对象实例就会报错。这时，this绑定原始对象，就可以解决这个问题。
var newTarget = new Date('2015-01-01');
var newHandler = {
  get(target, prop) {
    if (prop == 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
}
var newProxy = new Proxy(newTarget, newHandler);
proxy.getDate() // 1

//另外，Proxy 拦截函数内部的this，指向的是handler对象。


//class的方法内部如果含有this，它默认指向类的实例。
//但是this的指向在函数运行时确定
class Logger {
  constructor() { }
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
//printName方法中的this，默认指向Logger类的实例。但是，如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是undefined）
printName(); // TypeError: Cannot read property 'print' of undefined 

//Solution1: 在构造函数中bind绑定this

class bindLogger {
  constructor() {
    this.printName = this.printName.bind(this);
  }
  // ...
}

//Solution2: 使用proxy

function selfish(target) {
  const cache = new WeakMap();
  const handler = {
    get(target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());




