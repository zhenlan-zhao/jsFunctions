async function async1() {
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log("hello world")
  return 'async2';
  // return Promise.resolve('async2');
}

async1();

new Promise(function(resolve) {
  resolve();
}).then(function() {
  console.log('Promise then');
});
// hello world
// async1 end //微任务
// Promise then




for(var i=0;i<5;i++){
  setTimeout(function(){
    console.log(new Date(),i)
  })
}
console.log(new Date, i);
// 5 -> 5,5,5,5,5，即第 1 个 5 直接输出，1 秒之后，输出 5 个 5；

// 5 -> 0,1,2,3,4
for(var i=0;i<5;i++){
  (function(j){
    setTimeout(function(){
      console.log(new Date(),j)
    })(i);
  })
}
console.log(new Date, i);

// 5 -> 0,1,2,3,4
var output1=function(i){
  setTimeout(function(){
    console.log(new Date(),i)
  },1000)
}
for(var i=0;i<5;i++){
  output1(i)//利用 JS 中基本类型（Primitive Type）的参数传递是按值传递（Pass by Value）的特征,这里传过去的 i 值被复制了
}
console.log(new Date, i);

// 5-> 0,1,2,3,4
for(let i=0;i<5;i++){
  setTimeout(function(){
    console.log(new Date(),i)
  },1000)
}
console.log(new Date, i);

// 0 -> 1 -> 2 -> 3 -> 4 -> 5
for(var i=0;i<6;i++){
  (function(j){
    setTimeout(function(){
      console.log(new Date(),j)
    },1000*j);
  })(i) 
}
// 0 -> 1 -> 2 -> 3 -> 4 -> 5 with Promise
const tasks=[];
const output2=(i)=>new Promise((resolve)=>{
  setTimeout(()=>{
    console.log(new Date(),i)
    resolve();
  },1000*i)
})
for(var i=0;i<5;i++){
  tasks.push(output2(i))
}
Promise.all(tasks).then(()=>{
  setTimeout(()=>{
    console.log(new Date(),i)
  },1000)
})
// 0 -> 1 -> 2 -> 3 -> 4 -> 5 with Async
const sleep=(timeOutMS)=>new Promise((resolve)=>{
  setTimeout(resolve,timeOutMS)
})
(async ()=>{
  for(let i=0;i<5;i++){
    await sleep(1000)
    console.log(new Date(),i)
  }
  await sleep(1000)
  console.log(new Date(),i)
})()
