var EventUtil={
  addHandler:function(element,type,handler){
    if(element.addEventListener){
      element.addEventListener(type,handler,false)
      // false表示冒泡阶段
    }else if(element.attachEvent){
      element.attachEvent("on"+type,handler)
    }else{
      element["on"+type]=handler
    }
  },
  // DOM0级方法被认为是元素的方法，事件处理程序在元素的作用域中运行，this引用当前元素
  // DOM2级添加的匿名方法无法被移除，DOM2级元素也是在其依附的元素作用域中运行，因此this指向当前元素
  // IE只支持事件冒泡，并且事件处理程序会在全局作用域中运行，因此this==window;
  removeHandler:function(element,type,handler){
    if(element.removeHandler){
      element.removeEventListener(type,handler,false)
    }else if(element.detachEvent){
      element.detachEvent("on"+type,handler)
    }else{
      element["on"+type]=null;
    }
  },
  getEvent:function(event){
    return event?event:window.event;
  },
  getTarget:function(event){
    return event.target||event.srcElement;
  },
  preventDefault:function(event){
    if(event.preventDefault){
      event.preventDefault();
    }else{
      event.returnValue=false;
    }
  },
  stopPropagation:function(event){
    if(event.stopPropagation){
      event.stopPropagation();
    }else{
      event.cancelBubble=true;
    }
  },
}
function delegate(element,eventType,selector,fn){
  element.addEventListener(eventType,e=>{
    let el=e.target;
    while(!el.matches(selector)){
      if(element==el){
        el=null;
        break
      }
      el=el.parentNode;
    }
    el&&fn.call(el,e,el)
  })
  return element
}

var getInstance=function(fn){
  var result;
  return function(){
    return result||(result=fn.call(this,arguments));
  }
}


// Router是一个容器，管理了一组route
// 并且在hashchange或者window load的时候根据url响应进行处理
function Router(){
  this.routes={};
  this.currentUrl="";
}
// route是一条路由，是将一个URL路径和一个处理函数相关联
Router.prototype.route=function(path,callback){
  this.routes[path]=callback||function(){};
}
Router.prototype.refresh=function(){
  this.currentUrl=location.hash.slice(1)||'/'
  this.routes[this.currentUrl]()
}
Router.prototype.init=function(){
  window.addEventListener("load",this.refresh.bind(this),false);
  window.addEventListener("hashchange",this.refresh.bind(this),false);
}
window.Router=new Router();
window.Router.init();
Router.route("/",function(){
  // 设置相应内容
})
Router.route("/blue",function(){
  // 设置相应内容
})

// <p id="menu">
//   <a href="/profile" title="profile">profile</a>
//   <a href="/account" title="account">account</a>
// </p>
// <div class="main" id="main"></div>
;(function(){
  var menubox=document.getElementById("menu");
  var mainbox=document.getElementById("main");
  menubox.addEventListener("click",function(e){
    e.preventDefault();
    var elm=e.target;
    var url=elm.href;
    var tlt=elm.title;
    history.pushState({path:url,title:tlt},null,url);
    // pushState参数:state(标准的js对象),title,url(会替换掉当前浏览器地址栏中的地址，但不会去加载它)
    // 操作浏览器的历史记录但不会因其页面刷新
    // 可以设置与当前URL同源的任意URL
    mainbox.innerHTML="current page is"+tlt;
  })
  window.addEventListener("popstate",function(e){
    var state=e.state;
    conslog.log(state);
    mainbox.innerHTML="current page is"+state.title;
  })
})