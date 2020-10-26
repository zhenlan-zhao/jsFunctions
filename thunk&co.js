// JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。
// 在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，
// 将其替换成一个只接受回调函数作为参数的单参数函数。
fs={
  readFile(name,cb){
    console.log(111)
  }
}
fs.readFile(fileName,callback)
var simpleThunk=function(fileName){
  return function(callback){
    return fs.readFile(fileName,callback)
  }
}
var rfThunk=simpleThunk(fileName)
rfThunk(callback)
// 任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式。
// ES5
var Thunk=function(fn){
  return function(){
    var args=Array.prototype.slice.call(arguments);
    return function(callback){
      args.push(callback)
      return fn.apply(this,args)
    }
  }
}
// ES6
const Es6Thunk=function(fn){
  return function(...args){
    return function(callback){
      return fn.call(this,...args,callback);
    }
  }
}
// example1
var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
// example2
function f(a,cb){
  cb(a);
}
const ft=Thunk(f);
f(1)(console.log)

function Thunkify(fn){
  return function(){
    var args=new Array(arguments.length);
    var ctx=this;
    for(var i=0;i<args.length;++i){
      args[i]=arguments[i]
    }
    // var args=[...arguments]
    // var args=Array.from(arguments);
    // var args=[].slice.apply(null,arguments);

    // 它的源码主要多了一个检查机制，变量called确保回调函数只运行一次。
    return function(done){
      var called;
      args.push(function(){
        if(called) return;
        called=true;
        done.apply(null,arguments)
      })
      try {
        fn.apply(ctx,args)
      } catch (error) {
        done(err)
      }
    }
  }
}

//example 3
function f(a,b,callback){
  var sum=a+b;
  callback(sum);
}
var ft=Thunkify(f)
var print=console.log.bind(console);
ft(1,2)(print)//3 由于thunkify只允许回调函数执行一次，所以只输出一行结果。

// Thunk 函数真正的威力，在于可以自动执行 Generator 函数
function run(fn){
  var gen=fn();
  function next(err,data){
    var result=gen.next(data);
    if(result.done){
      return
    }
  }
  next();
}
// 前提是每一个异步操作，都要是 Thunk 函数，
// 也就是说，跟在yield命令后面的必须是 Thunk 函数。
function* g(){
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
}
run(g)
// 内部的next函数就是 Thunk 的回调函数。next函数先将指针移到 Generator 函数的下一步（gen.next方法），
// 然后判断 Generator 函数是否结束（result.done属性），如果没结束，就将next函数再传入 Thunk 函数（result.value属性），否则就直接退出。

// ，Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。
// 两种方法可以做到这一点。
// （1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
// （2）Promise 对象。将异步操作包装成 Promise 对象，用then方法交回执行权。
// 使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。

var promiseReadFile=function(fileName){
  return new Promise(function(resolve,reject){
    fs.readFile(fileName,function(error,data){
      if(error) return reject(error);
      resolve(data);
    });
  });
}

var promiseGen=function* (){
  var f1=yield promiseReadFile('...')
  var f2 = yield promiseReadFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
}
var promiseG=promiseGen();

promiseG.next().value.then(function(data){
  promiseG.next(data).value.then(function(data){
    promiseG.next(data);
  })
})
// 手动执行其实就是用then方法，层层添加回调函数。理解了这一点，就可以写出一个自动执行器。
function promiseRun(gen){
  var g=gen;
  function next(data){
    var result=g.next(data);
    if(result.done) return result.value;
    result.value.then(function(data){
      next(data);
    })
  }
  next();
}
// 首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象。
function co(gen){
  var ctx=this;
  // co 先检查参数gen是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象；
  // 如果不是就返回，并将 Promise 对象的状态改为resolved。
  return new Promise(function(resolve,reject){
    if (typeof gen==="function") gen=gen.call(ctx);
    if(!gen || typeof gen.next!=="function") return resolve(gen);
    // 接着，co 将 Generator 函数的内部指针对象的next方法，
    // 包装成onFulfilled函数。这主要是为了能够捕捉抛出的错误。
    onFulfilled();
    function onFulfilled(res){
      var ret;
      try {
        ret=gen.next(res)
      } catch (error) {
        return reject(error)
      }
      next(ret)
    }
    function onRejected(err){
      return reject(err)
    }
    function next(ret){
      // 查当前是否为 Generator 函数的最后一步，如果是就返回。
      if(ret.done) return resolve(ret.value);
      // 确保每一步的返回值，是 Promise 对象。
      var value=Promise.resolve.call(ctx,ret.value);
      if(value && isPromise(value)){
        // 使用then方法，为返回值加上回调函数，然后通过onFulfilled函数再次调用next函数。
          return value.then(onFulfilled,onRejected);
      }
      return onRejected(
        new TypeError(
          'You may only yield a function, promise, generator, array, or object, '
          + 'but the following object was passed: "'
          + String(ret.value)
          + '"'
        )
      )
    }
  })
}