function myNew(){
  let target={};
  let [myConstuctor,...args]=[...arguments];
  Object.setPrototypeOf(target,myConstuctor.prototype);
  let result=myConstuctor.apply(target,args);
  if(result && (typeof result)=="object"|| (typeof result)=="function"){
    return result
  }
  return target;
}

function MyCall(context){
  var context=context||window;
  context.fn=this;
  var args=[];
  for(var i=1,len=arguments.length;i<len;i++){
    args.push('arguments['+i+"]")
  }
  var result=eval("context.fn("+args+")");
  delete context.fn;
  return result
}

function myApply(context,arr){
  var context=Object(context)||window;
  context.fn=this;
  var result
  if(!arr){
    result=context.fn();
  }else{
    var args=[];
    for(var i=0,len=arr.length;i<len;i++){
      arr.push("arr["+i+"]");
    }
    result=eval("contex.fn("+args+")");
  }
  delete context.fn;
  return result;
}

function myBind(contex){
  if(typeof this!=="function"){
    throw new Error(".....")
  }
  var self=this;
  var args=Array.prototype.slice.call(arguments,1)
  var fNOP=function(){}
  fNOP.prototype=this.prototype;
  var fBound=function(){
    var bindArgs=Array.prototype.slice.call(arguments);
    return self.apply(this instanceof fNOP?this:contex,args.concat(bindArgs));
  }
  // 修改返回函数的prototype为绑定函数的prototype，是咧就可以继承绑定函数中原型中的值
  fBound.prototype=new fNOP();
  // 当作为构造函数调用(new), bind提供的this值会被忽略，但是参数会被提供给构造函数。
  // fBound.prototype=Object.create(this.prototype)
  return fBound
}


// 二维数组降维
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(function(accumulator,currentValue){
  return accumulator.concat(currentValue)
},[])
// 递归降维方法
var arr = [1,[2,[[3,4],5],6]];
var newArr = [];
function reduceDimension(arr){
  for (var i=0;i<arr.length;i++){
    if (Array.isArray(arr[i])){
      reduceDimension(arr[i])
    }else{
      newArr.push(arr[i])
    }
  }
}
reduceDimension(arr)


function myCreate(proto,propertyObject = undefined) { //Object.create()方法规范化了原型式继承。这个方法接收两个参数：
  // 一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象(注意是对象)
  function F() {};
  F.prototype = proto;
  const obj = new F();
  if (propertyObject) {
    Object.defineProperties(obj, propertyObject)
  }
  // if (proto == null) {
  //   obj.__proto__ = null;
  // }
  return obj;
}
// 寄生式继承
function createAnother(original){
  var clone = Object.create(original); //通过调用函数创建一个新对象
  clone.sayHi = function(){ //以某种方式来增强这个对象
    alert("hi");
  };
  return clone; //返回这个对象
  }

  //寄生组合式继承 这样，我们就可以用调用inheritPrototype()函数的语句，去替换前面例子中为子类型原型赋值的语句了
  function inheritPrototype(subType, superType){
    var prototype = Object.create(superType.prototype); //创建对象
    prototype.constructor = subType; //增强对象
    subType.prototype = prototype; //指定对象
  }
//这个例子的高效率体现在它只调用了一次SuperType 构造函数，并且因此避免了在SubType.prototype 上面创建不必要的、多余的属性
//因此，还能够正常使用instanceof 和isPrototypeOf()
