//定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使它们能够自动更新自己

//当一个对象的改变需要同时改变其它对象，并且它不知道具体有多少对象需要改变的时候，就应该考虑使用观察者模式

//观察者模式：观察者（Observer）直接订阅（Subscribe）主题（Subject），而当主题被激活的时候，会触发（Fire Event）观察者里的事件。

//发布订阅模式：订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel），
// 当发布者（Publisher）发布该事件（Publish Event）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。

//在观察者模式中，观察者是知道 Subject 的，Subject 一直保持对观察者进行记录。然而，在发布订阅模式中，发布者和订阅者不知道对方的存在。它们只有通过消息代理进行通信。
//在发布订阅模式中，组件是松散耦合的，正好和观察者模式相反。
//观察者模式大多数时候是同步的，比如当事件触发，Subject 就会去调用观察者的方法。
//而发布-订阅模式大多数时候是异步的（使用消息队列）。

class Subject {
  constructor () {
    this.state = 0;
    this.observers = [];
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
    this.notifyAllObservers();
  }
  notifyAllObservers () {
    this.observers.forEach (obesever => {
      obesever.update();
    })
  }
  attatch(observer) {
    this.observers.push(observer);
  }
}

class Obeserver {
  constructor(name,subject) {
    this.name = name;
    this.subject = subject;
    this.subject.attatch(this);
  }
  update() {
    console.log(`${this.name} update, state:${this.subject.getState()}`);
  }
}

//测试
let s = new Subject();
let o1 = new Obeserver('o1',s);
let o2 = new Obeserver('o2',s);

s.setState(12);

//基于proxy的观察者模式

const queueObserver = new Set();

const observe = fn => queueObserver.add(fn);
const obeservable = obj => new Proxy(obj, {set});

function set (target, key, value, receiver) {
  let result = Reflect.set(target,key,value,receiver);
  queueObserver.forEach(observer => observer());
  return result;
}

const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四'; //// 李四, 20








//vue双向绑定中的观察者模式

//Observer 数据监听器，能够对数据对象的所有属性进行监听，如有变动可拿到最新的值并通知订阅者，
// 内部采用的Obiect.defineProperty的getter和setter来实现。
function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  constructor: Obeserver,
  walk: function (data) {
    var vm = this;
    Object.keys(data).forEach(function(key) {
      me.convert(key,data[key])
    })
  },
  convert(key,val) {
    this.defineReactive (this.data,key,val) 
  },
  defineReactive (data,key,val) {
    var dep = new Dep();
    var childObj = obeseve(val);
    Obeserver.defineProperty(data,key,{
      enumerable:true,
      configurable: false,
      get () {
        // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set(newVal) {
        if (newVal == val) return;
        val = newVal;
        childObj = obeseve(newVal);
        dep.notify();
      }
    })
  }
}

function obeseve(value,vm) {
  if (!value || typeof value !== 'object') {
    return;
  }
  return new Obeserver(value);
}

//这样我们已经可以监听每个数据的变化了，那么监听到变化之后就是怎么通知订阅者了，所以接下来我们需要实现一个消息订阅器，
// 很简单，维护一个数组，用来收集订阅者，数据变动触发notify，再调用订阅者的update方法

//Dep消息订阅器，内部维护了一个数组，用来收集订阅者（watcher）,数据变动触发notify函数，再调用订阅者的update方法。
var uid = 0;
function Dep () {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {
  constructor:Dep,
  addSub: function (sub) {
    this.subs.push(sub);
  },
  depend() {
    Dep.target.addDep(this);
  },
  removeSub (sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index,1);
    }
  },
  notify () {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
}

Dep.target = null;


//Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是:
// 1、在自身实例化时往属性订阅器(dep)里面添加自己
// 2、自身必须有一个update()方法
// 3、待属性变动dep.notify()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

//Watcher订阅者，作为连接Observer和Complie的桥梁,能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数。

function Watcher (vm,expOrFn,cb) {
  this.cb = cb;
  this.vm = vm;
  this.expOrFn = expOrFn;
  this.depIds = {};
  
  if (typeof expOrFn == 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = this.parseGetter(expOrFn.trim());
  }
  this.value = this.get();
  //实例化Watcher的时候，调用get()方法，通过Dep.target = watcherInstance标记订阅者是当前watcher实例，强行触发属性定义的getter方法，
  // getter方法执行的时候，就会在属性的订阅器dep添加当前watcher实例，从而在属性值有变化的时候，watcherInstance就能收到更新通知。
}

Watcher.prototype = {
  constructor: Watcher,
  update () {
    this.run();
  },
  run() {
    var value = this.get();
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm,value,oldVal);
    }
  },
  // 1. 每次调用run()的时候会触发相应属性的getter
  // getter里面会触发dep.depend()，继而触发这里的addDep
  // 2. 假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性，仅仅是改变了其值而已
  // 则不需要将当前watcher添加到该属性的dep里
  // 3. 假如相应属性是新的属性，则将当前watcher添加到新属性的dep里
  // 如通过 vm.child = {name: 'a'} 改变了 child.name 的值，child.name 就是个新属性
  // 则需要将当前watcher(child.name)加入到新的 child.name 的dep里
  // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的dep中
  // 通过 child.name = xxx 赋值的时候，对应的 watcher 就收不到通知，等于失效了
  // 4. 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
  // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
  // 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
  // 触发了addDep(), 在整个forEach过程，当前wacher都会加入到每个父级过程属性的dep
  // 例如：当前watcher的是'child.child.name', 那么child, child.child, child.child.name这三个属性的dep都会加入当前watcher
  addDep (dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  },
  get() {
    Dep.target = this;
    var value = this.getter.call(this.vm,this.vm);
    Dep.target = null;
    return value;
  },
  parseGetter: function(exp) {
    if (/[^\w.$]/.test(exp)) return; 

    var exps = exp.split('.');

    return function(obj) {
        for (var i = 0, len = exps.length; i < len; i++) {
            if (!obj) return;
            obj = obj[exps[i]];
        }
        return obj;
    }
  }
}

//监听数据、绑定更新函数的处理是在compileUtil.bind()这个方法中，通过new Watcher()添加回调来接收数据变化的通知

//complie指令解析器，它的作用对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，
// 以及绑定Observer和Complie的桥梁,能够订阅并收到每个属性变动的通知，执行指令绑定的相应的回调函数
if (me.isDirective(attrName)) {
  var exp = attr.value; //exp 这个地方会触发属性的get
  var dir = attrName.substring(2);
  // 事件指令
  if (me.isEventDirective(dir)) {
      compileUtil.eventHandler(node, me.$vm, exp, dir);
      // 普通指令
  } else {
      compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
  }
}

bind = function (node, vm, exp, dir) {
  var updaterFn = updater[dir + 'Updater'];

  updaterFn && updaterFn(node, this._getVMVal(vm, exp));

  new Watcher(vm, exp, function(value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
  });
}

// 4. 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
// 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
// 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
_getVMVal = function(vm, exp) {
  var val = vm;
  exp = exp.split('.');
  exp.forEach(function(k) {
      val = val[k];
  });
  return val;
},

_setVMVal = function(vm, exp, value) {
  var val = vm;
  exp = exp.split('.');
  exp.forEach(function(k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
          val = val[k];
      } else {
          val[k] = value;
      }
  });
}