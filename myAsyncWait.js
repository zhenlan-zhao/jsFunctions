const getData=()=> new Promise(resolve=>{
  setTimeout(()=>resolve("data"),1000);
})
async function test(){
  const data=await getData();
  console.log('data:',data);
  const data2=await getData();
  console.log('data2:',data2);
  return "success"
}

test().then((data)=>{
  setTimeout(()=>{
    console.log(data)
  },2000)
})

var testWrap=ayncToGenerator(
  function* testG(){
  const data=yield getData();
  console.log("data:",data);
  const data2=yield getData();
  console.log("data2",data2);
  return "success!!";
})
// asyncToGenerator接受一个generator函数，返回一个promise，

// 关键就在于，里面用yield来划分的异步流程，应该如何自动执行。

function ayncToGenerator(generatorFunc){
  return function(){
    const gen=generatorFunc.apply(this,arguments);
    return new Promise((resolve,reject)=>{
      // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
      // key有next和throw两种取值，分别对应了gen的next和throw方法
      // arg参数则是用来把promise resolve出来的值交给下一个yield
      function step(key,arg){
        let generatorResult;
        try {
          generatorResult=gen[key](arg)
        } catch (error) {
          return reject(error);
        }
        const {value,done}=generatorResult;
        if(done){
          return resolve(value)
        }else{
          return Promise.resolve(value).then(
            function onResolve(val){
              step("next",val)
            },
            function onReject(err){
              step("throw",err)
            }
          )
        }
      }
      step("next")
    })
  }
}


function spawn(genF){
  return new Promise(function(resolve,reject){
    const gen=genF();
    function step(nextF){
      let next;
      try {
        next=nextF()
      } catch (error) {
        reject(error)
      }
      if(next.done){
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v){
        step(function(){return gen.next(v);})
      },function(e){
        step(function(){return gen.throw(e);})
      });
    }
    step(function(){
      return gen.next(undefined);
    })
  })
}
async function fn(args){}

function fn(args){
  return spawn(function*(){

  });
}

function fn(args) {
  return spawn(function* (){

  })
}

function spawn(genF) {
  return new Promise(function(resolve,reject) {
    const gen = genF();
    function step (nextF) {
      let next;
      try {
        next = nextF()
      } catch (error) {
        reject(error)
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v){
        step(function(){return gen.next(v)})
      },function(e){
        step(function(){return gen.throw(e)})
      });
    }
    step (function() {
      return gen.next(undefined);
    })
  })
}