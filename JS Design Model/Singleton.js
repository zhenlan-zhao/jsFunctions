// 单例模式：限制类实例化次数只能一次，一个类只有一个实例，并提供一个访问它的全局访问点。
//“单例模式的特点，意图解决：维护一个全局实例对象。”

// 引用第三方库（多次引用只会使用一个库引用，如 jQuery）
// 弹窗（登录框，信息提升框）
// 购物车 (一个用户只有一个购物车)
// 全局态管理 store (Vuex / Redux)

// 引入代码库 libs(库别名）
if (window.libs != null) {
  return window.libs;    // 直接返回
} else {
  window.libs = '...';   // 初始化
}


// 简单实现
//不够“透明”，无法使用 new 来进行类实例化，需约束该类实例化的调用方式： Singleton.getInstance(...);
//管理单例的操作，与对象创建的操作，功能代码耦合在一起，不符合 “单一职责原则”
let Singleton1 = function (name) {
  this.name = name;
  this.instance = null;
}

Singleton1.prototype.getName = function() {
  console.log(this.name);
}

Singleton1.prototype.getInstance = function(name) {
  if (this.instance) {
    return this.instance;
  }
  this.instance = new Singleton1(name);
  return this.instance;
}
//定义一个 getInstance() 方法来管控单例，并创建返回类实例对象，而不是通过传统的 new 操作符来创建类实例对象。
let Winner = Singleton1.getInstance('Winner');
let Looser = Singleton1.getInstance('Looser');

console.log(Winner === Looser); // true
console.log(Winner.getName());  // 'Winner'
console.log(Looser.getName());  // 'Winner'

//透明版单例模式
let CreateSingleton = (function() {
  let instance;
  return function(name) {
    if (instance) {
      return instance; 
    }
    this.name = name;
    return instance = this; //this指向返回的实例
  }
})();

CreateSingleton.prototype.getName = function() {
  console.log(this.name);
}

let Winner2 = new CreateSingleton('Winner');
let Looser2 = new CreateSingleton('Looser');

console.log(Winner2 === Looser2); // true
console.log(Winner2.getName());  // 'Winner'
console.log(Looser2.getName());  // 'Winner'

//“代理版“ 单例模式：
let ProxyCreateSingleton = (function() {
  let instance;
  return function(name) {
     // 代理函数仅作管控单例
    if (instance) {
      return instance;
    }
    return instance = new Singleton(name);
  }
})();

function Singleton(name) {
  this.name = name;
}

Singleton.prototype.getName = function() {
  console.log(this.name);
}


let ProxyCreateSingleton = (function(){
  let instance;
  return function(name) {
     
      if (instance) {
          return instance;
      }
      return instance = new Singleton(name);
  }
})();

let Winner3 = new PeozyCreateSingleton('Winner');
let Looser3 = new PeozyCreateSingleton('Looser');

console.log(Winner3 === Looser3); // true
console.log(Winner3.getName());  // 'Winner'
console.log(Looser3.getName());  // 'Winner'

//惰性单例模式: 需要时才创建类实例对象
// 需求：页面弹窗提示，多次调用，都只有一个弹窗对象，只是展示信息内容不同。
let getSingleton = function(fn) {
  let result;
  return function() {
    return result || (result = fn.apply(this, arguments));// 确定this上下文并传递参数
  }
}
let createAlertMessage = function (html) {
  let div = document.createElement('div');
  div.innerHTML = html;
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
}

let SingletonMessage = getSingleton(createAlertMessage);
document.body.addEventListener('click', function() {
  // 多次点击只会产生一个弹窗
  let alertMessage = SingletonMessage('您的知识需要付费充值！');
  alertMessage.style.display = 'block';
})
//代码中演示是一个通用的 “惰性单例” 的创建方式，如果还需要 createLoginLayer 登录框, createFrame Frame框, 都可以调用 getSingleton(...) 生成对应实例对象的方法。
