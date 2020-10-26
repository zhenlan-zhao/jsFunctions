//防抖函数：一个需要频繁触发的函数，在规定时间内，只让最后一次生效，前面的不生效。

//防抖 非立即执行
function debounce (func,delay) {
  var timer = null;
  var first = true;
  return function () {
    let context = this, args = arguments;
    timer && clearTimeout(timer);
    first && func.apply(context,args);
    first = false;
    timer = setTimeout(() => {
      !first && func.apply(context,args);
    }, delay);
  }
}

//“立即执行防抖” 指事件触发后，回调函数会立即执行，之后要想触发执行回调函数，需等待 n 秒延迟
function debounce2 (func,delay) {
  var timer = null;
  return function() {
    let context = this, args = arguments;
    let callNow = !timer;
    timer = setTimeout(function () {
      timer = null;
    },delay);
    callNow && func.apply(context,args);
  }
}



//节流方案1 不能实现立即执行
function throttle(fn,wait){
  let canRun=true; //flag要放在闭包函数前面
  return function(){
    if(!canRun){
      return;
    }
    fn.apply(this,arguments); //第一次进来不用等待 而且很久没有执行再进来也不用等待
    canRun=false;
    setTimeout(()=>{
      canRun=true
    },wait)
  }
}
window.onload=function(){
  var myThrottle=this.document.getElementById(this.throttle);
  myThrottle.addEventListener("click",this.throttle(sayThrottle));

}
function sayThrottle(){
  console.log("节流成功！");
}


//方案2
//其实函数节流的出发点，就是让一个函数不要执行得太频繁，减少一些过快的调用来节流。
//而真正的节流应该是在可接受的范围内尽量延长这个调用时间，也就是我们自己控制这个执行频率，让函数减少调用以达到减少计算、提升性能的目的。
function throttle3 (fn,delay,mustRun) {
  //可以设置第三个参数，即必然触发执行的时间间隔。
  let timer = null;
  let t_start = +Date.now();
  return function() {
    let context = this, args = arguments, t_cur = + Date.now();
    clearTimeout(timer);
    if (t_cur - t_start >= mustRun) {
      fn.apply(context,args);
      t_start = t_cur;
    }
    else {
      timer = setTimeout(function() {
        fn.apply(context,args);
      },delay)
    }
  }
  //当到了指定的 mustRunDelay 必须执行处理函数的时候，是不执行新建定时器的，即是说在立即执行之后，
  // 有那么一小段时间空隙，定时器是被 clear 的，只有在下一次进入函数的时候才会重新设置。而 chrome 呢，就趁这段时间间隙回收垃圾
}

//节流 - 时间戳 + 定时器
// 合并优化的原理：“时间戳”方式让函数在时间段开始时执行（第一次触发立即执行），“定时器”方式让函数在最后一次事件触发后（如4.2s）也能触发。
function throttle4 ( fn, delay) {
  let lastTime, timeout;
  return function() {
    let context = this, args = arguments;
    let nowTime = + new Date();
    if (lastTime && nowTime - lastTime < delay) {
      timeout && clearTimeout(timeout);
      timeout = setTimeout(() => {
        lastTime = nowTime;
        fn.apply(context, args);
      }, delay); //可以让最后一次触发后也能触发
    } else {
      lastTime = nowTime;
      fn.apply(context,args); //要是间隔超过delay或者第一次 直接触发运行
    }
  }
}



