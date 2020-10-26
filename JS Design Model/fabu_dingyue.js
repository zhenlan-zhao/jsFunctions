//发布订阅者模式

//发布-订阅模式，看似陌生，其实不然。工作中经常会用到，例如 Node.js EventEmitter 中的 on 和 emit 方法；
// Vue 中的 $on 和 $emit 方法。他们都使用了发布-订阅模式，让开发变得更加高效方便。

//发布-订阅模式其实是一种对象间一对多的依赖关系，当一个对象的状态发送改变时，所有依赖于它的对象都将得到状态改变的通知。

//订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel），当发布者（Publisher）发布该事件（Publish Event）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。

let eventEmitter = {}; //创建一个对象

eventEmitter.list = {}; // 缓存列表，存放 event 及 fn

// 订阅
eventEmitter.on = function (event,fn) {
  let _this = this;
  // 如果对象中没有对应的 event 值，也就是说明没有订阅过，就给 event 创建个缓存列表
  // 如有对象中有相应的 event 值，把 fn 添加到对应 event 的缓存列表里
  (_this.list[event] || (_this.list[event] = [])).push(fn);
  return _this;
}

//发布
eventEmitter.emit = function () {
  let _this = this;
  // // 第一个参数是对应的 event 值，直接用数组的 shift 方法取出
  let event = [].shift.call(arguments)
  let fns = [..._this.list[event]];

  if (!fns || fns.length == 0) {
    return false;
  }
  fns.forEach(fn => {
    fn.apply(_this,arguments);
  })
}

function user1 (content) {
  console.log('用户1订阅了:', content);
};

function user2 (content) {
  console.log('用户2订阅了:', content);
};

//订阅
eventEmitter.on('article', user1);
eventEmitter.on('article', user2);

//发布
eventEmitter.emit('article', 'Javascript 发布-订阅模式');

/*
    用户1订阅了: Javascript 发布-订阅模式
    用户2订阅了: Javascript 发布-订阅模式
*/


//第二版 包含 once 和 off方法

let eventEmitter = {
  list: {},
  on (event,fn) {
    let _this = this;
    (_this.list[event] || (_this.list[event] = [])).push(fn);
    return _this;
  },
  //取消订阅
  off (event,fn) {
    let _this = this;
    let fns = _this.list[event];
    if (!fns) return false;
    if (!fn) {
      // 如果没有传 fn 的话，就会将 event 值对应缓存列表中的 fn 都清空
      fns && (fns.length =0);
    }else {
      let cb;
      for (let i = 0, cbLen = fns.length;i<cbLen;i++) {
        // 若有 fn，遍历缓存列表，看看传入的 fn 与哪个函数相同，如果相同就直接从缓存列表中删掉即可
        cb = fns[i];
        if (cb == fn || cb.fn == fn) { //cb.fn == fn 对应一次性绑定
          fns.splice(i,1);
          break;
        }
      }
    }
    return _this;
  },

  //一次性监听
  once (event,fn) {
    let _this = this;
    // 先绑定，调用后删除
    function onceOn() {
      _this.off(event,onceOn);
      fn.apply(_this,arguments);
    }
    onceOn.fn = fn;
    _this.on(event,onceOn);
    return _this;
  },

  //发布
  emit () {
    let _this = this;
    let event = [].shift.call(arguments),
        fns = [..._this.list[event]];
    if (!fns || fns.length == 0) return false;
    fns.forEach( fn => {
      fn.apply(_this,arguments) //arguments已经被shift过一次了
    })
    return _this;
  }
}



function EventEmitter () {
  this.list = {};
  this.on =  (event, fn) => {
    (this.list[event] || (this.list[event] = [])).push(fn);
    return this;
  };
  this.off =  (event,fn) => {
    let fns = this.list[event];
    if (!fns) return false;
    if (!fn) {
      fns && (fns.length = 0); //这里更改会影响this.list[event]
    } else {
      let cb;
      for (let i = 0; i<fns.length;i++) {
        cb = fns[i];
        if (cb == fn || cb.fn == fn) {
          fns.splice(i,1);
          break;
        }
      }
    }
    return this;
  };
  this.once =  (event, fn) => {
    function onceOn () {
      this.off(event,onceOn);
      fn.apply(this,arguments);
    }
    onceOn.fn = fn;
    this.on (event,onceOn);
    return this;
  };
  this.emit =  () => {
    let event = [].shift.call(arguments),
        fns = [...this.list[event]];
    if (!fns || fns.length == 0) return false;
    fns.forEach (fn => {
      fn.apply(this,arguments)
    })
    return this;
  }
}