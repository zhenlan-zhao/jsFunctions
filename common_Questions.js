//数组去重

//reduce + includes
function unique(arr) {
  return arr.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
}

//利用filter
function unique(arr) {
  return arr.filter(function (item, index, arr) {
    return arr.indexOf(item, 0) === index;
  });
}

//利用sort
function unique(arr) {
  if (!Array.isArray(arr)) return;
  arr = arr.sort();
  var array = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      array.push(arr[i]);
    }
  }
  return array;
}

//splice去重
function unique(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        arr.splice(j, 1);
        j--; //注意这里要j--
      }
    }
  }
  return arr;
}

//Set
function unique(arr) {
  return Array.from(new Set(arr));
}

let line1 = parseInt(readline());
let lin2 = readline().split(' ');
line2 = line2.map((val) => parseInt(val));
let M = parseInt(readline());
line2.sort((a, b) => a - b);
var time = 0;
for (let i = 0; i < line2.length; i += 2) {
  time += line2[i];
}
let res = (time <= M) ? 1 : 0;
print(res);
(1 / 2).toFixed(2)

//Boolean() Number() String() Array() Date() Function() RegExp() Error() Object()
//原生构造函数的继承

//原生构造函数会忽略apply方法传入的this，也就是说，原生构造函数的this无法绑定，导致拿不到内部属性。
//ES5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。
//bad case

function MyArray() {
  Array.apply(this, arguments); //先新建子类的实例对象
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    enumerable: true,
    configurable: true
  }
});

//Array构造函数有一个内部属性[[DefineOwnProperty]]，用来定义新属性时，更新length属性
//这个内部属性无法在子类获取，导致子类的length属性行为不正常。
var colors = new MyArray();
colors[0] = "red";
colors.length  // 0

colors.length = 0;
colors[0]  // "red"



//good case

//ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this
class NewArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new NewArray();
arr[0] = 10;
arr.length // 1

arr.length = 0;
arr[0] // undefined

//带版本功能的数组

class VersionedArray extends Array {
  constructor(...args) {
    super(...args);
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice())
  }
  revert() {
    this.history.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}
let versionedArr = new VersionedArray();
versionedArr.push(1);
versionedArr.push(2);
versionedArr // [1, 2]
versionedArr.history // [[]]

versionedArr.commit();
versionedArr.history // [[], [1, 2]]

versionedArr.push(3);
versionedArr // [1, 2, 3]
versionedArr.history // [[], [1, 2]]

versionedArr.revert();
versionedArr // [1, 2]