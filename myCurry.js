function add(a,b){
  return a+b
}
add(1,2)
var addCurry=curry(add);
addCurry(1)(2);


var sub_curry=function(fn){
  var args=[].slice.call(arguments,1);
  return function(){
    var newArgs=args.concat([].slice.call(arguments));
    return fn.apply(this,newArgs);
  };
};
function curry(fn,length){
  length=length||fn.length;
  var mySlice=Array.prototype.slice;
  return function(){
    if(arguments.length<length){
      var combined=[fn].concat(mySlice.call(arguments));
      // curry1的作用是用函数包裹原函数，然后给原函数传入之前的参数
      return curry(sub_curry.apply(this,combined),length-arguments.length)
    }else{
      return fn.apply(this,arguments)
    }
  }
}
var fn0 = function(a, b, c, d) {
  return [a, b, c, d];
}

var fn1 = curry(fn0);

fn1("a", "b")("c")("d")
// fn1("a", "b")
// 相当于
// curry(fn0)("a", "b")
// 相当于
// curry(sub_curry(fn0, "a", "b"))
// 相当于
// 注意 ... 只是一个示意，表示该函数执行时传入的参数会作为 fn0 后面的参数传入
// curry(function(...){
//   return fn0("a", "b", ...)
// })

// 当执行 fn1("a", "b")("c") 时，函数返回：

// curry(sub_curry(function(...){
//   return fn0("a", "b", ...)
// }), "c")
// // 相当于
// curry(function(...){
//   return (function(...) {return fn0("a", "b", ...)})("c")
// })
// // 相当于
// curry(function(...){
//    return fn0("a", "b", "c", ...)
// })
// 当执行 fn1("a", "b")("c")("d") 时，此时 arguments.length < length 为 false ，执行 fn(arguments)，相当于：

// (function(...){
//   return fn0("a", "b", "c", ...)
// })("d")
// // 相当于
// fn0("a", "b", "c", "d")

function curry2(fn,args){
  var length=fn.length;
  args=args||[];
  return function(){
    var _args=args.slice(0),arg,i;
    for(i=0;i<arguments.length;i++){
      arg=arguments[i];
      _args.push(arg);
    }
    if(_args.length<length){
      return curry2.call(this,fn,_args)
    }else{
      return fn.apply(this,_args);
    }

  }
}

function curry (fn,...args) {
  let length = fn.length;
  args = args || [];
  return function () {
    let _args = [...args,...arguments];
    if (_args.length < length) {
      return curry.call(this,fn,_args);
    } else {
      return fn.call(this,_args);
    }
  }
}


Array.prototype.myBind=function(contex){
  if(typeof this !=="function"){
    return new TypeError(">...")
  }
  var self=this;
  var args=Array.prototype.slice.call(arguments,1);
  var fNOP=function(){}
  fNOP.prototype=this.prototype;
  fBOUND.prototype=new fNOP()
  // fBOUND.prototype=Object.create(fNOP.prototype)
  var fBOUND=function(){
    var bindArgs=Array.prototype.slice.call(arguments);
    return self.apply(this instanceof fNOP?this:contex,args.concat(bindArgs));
  }
  return fBOUND;
}


