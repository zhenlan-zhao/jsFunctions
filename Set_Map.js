// (function(global){
//   function Set(data){
//     this._values=[];
//     this.size=0;
//     data && data.forEach(function(item){
//       this.add(item);
//     },this);
//   }
//   Set.prototype["add"]=function(value){
//     if(this._values.indexOf(value)==-1){
//       this._values.push(value);
//       ++this.size;
//     }
//     return this
//   }
//   Set.prototype["has"]=function(value){
//     return (this._values.indexOf(value)!==-1);
//   }
//   Set.prototype["delete"]=function(value){
//     var idx=this._values.indexOf(value);
//     if(idx===-1) return false;
//     this._values.splice(idx,1);
//     --this.size;
//     return true;
//   }
//   Set.prototype["clear"]=function(value){
//     this._values=[];
//     this.size=0;
//   }
//   Set.prototype["forEach"]=function(callbackFn,thisArg){
//     thisArg=thisArg||global;
//     for(var i=0;i<this._values.length;i++){
//       callbackFn.call(thisArg,this._values[i],this._values[i],this);
//     }
//   }
//   Set.length=0;
//   global.Set=Set;
// })(this)
// let set = new Set([1, 2, 3, 4, 4]);
// console.log(set.size); // 4

// set.delete(1);
// console.log(set.has(1)); // false

// set.clear();
// console.log(set.size); // 0

// set = new Set([1, 2, 3, 4, 4]);
// set.forEach((value, key, set) => {
// 	console.log(value, key, set.size)
// });
// 1 1 4
// 2 2 4
// 3 3 4
// 4 4 4

// 在第一版中，我们使用 indexOf 来判断添加的元素是否重复，
// 本质上，还是使用 === 来进行比较，对于 NaN 而言，因为：
// console.log([NaN].indexOf(NaN)); // -1

// 所以我们需要对 NaN 这个值进行单独的处理。

// 处理的方式是当判断添加的值是 NaN 时，将其替换为一个独一无二的值，
// 比如说一个很难重复的字符串类似于 @@NaNValue，当然了，说到独一无二的值，我们也可以直接使用 Symbol，代码如下：

// 在模拟实现 Set 时，最麻烦的莫过于迭代器的实现和处理，比如初始化以及执行 keys()、values()、entries() 方法时都会返回迭代器：

(function(global){
  var NanSymbol=Symbol("NaN")
  var encodeVal=function(value){
    return value!==value?NanSymbol:value;
  }
  var decodeVal=function(value){
    return(value===NanSymbol)?NaN:value;
  }
  var makeIterator=function(array,iterator){
    var nextIndex=0;
    var obj={
      next:function(){
        return nextIndex<array.length?{value:iterator(array[nextIndex++]),done:false}:
              {value:void 0, done:true}
      }
    }
    obj[Symbol.iterator]=function(){
      return obj
    }
    return obj
  }
  function forOf(obj,cb){
    let iterable,result;
    if(typeof obj[Symbol.iterator]!=="function"){
      throw new TypeError(obj + " is not iterable");
    }
    if(typeof cb!=="function"){
      throw new TypeError("cb must be callble");
    }
    iterable=obj[Symbol.iterator]();
    result=iterable.next();
    while(!result.done){
      cb(result.value);
      result=iterable.next();
    }
  }
  function Set(data){
    this._values=[];
    this.size=0;
    forOf(data,(item)=>{
      this.add(item)
    })
  }
  Set.prototype["add"]=function(value){
    value=encodeVal(value);
    if(this._values.indexOf(value)===-1){
      this._values.push(value);
      ++this.size;
    }
    return this;//链式调用
  }
  Set.prototype["has"]=function(value){
    return(this._values.indexOf(encodeVal(value))!==-1);
  }
  Set.prototype["delete"]=function(value){
    var idx=this._values.indexOf(encodeVal(value));
    if(idx==-1) return false;
    this._values.splice(idx,1);
    --this.size;
    return true;
  }
  Set.prototype["forEach"]=function(callbackFn,thisArg){
    thisArg=thisArg||this;
    for(var i=0;i<this._values.length;i++){
      callbackFn.call(thisArg,this._values[i],this._values[i],this)
    }
  }
  Set.prototype["values"]=Set.prototype["keys"]=function(){
    return makeIterator(this._values,function(value){
      return decodeVal(value)
    })
  }
  Set.prototype["entries"]=function(){
    return makeIterator(this._values,function(value){
      return [decodeVal(value),decodeVal(value)]
    })
  }
  Set.prototype[Symbol.iterator]=function(){
    return this.values();
  }
  Set.prototype['forEach'] = function(callbackFn, thisArg) {
    thisArg = thisArg || global;
    var iterator = this.entries();

    forOf(iterator, (item) => {
        callbackFn.call(thisArg, item[1], item[0], this);
    })
}
  Set.length = 0;

  global.Set = Set;
})