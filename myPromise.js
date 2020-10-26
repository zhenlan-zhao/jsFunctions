function Mypromise(executor){
  let self=this;
  self.value=undefined;
  self.reason=undefined;
  self.status="pending";
  self.onResolvedCallbacks=[];
  self.onRejectedCallbacks=[];
//const promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('成功');
//   },1000);
// })
//因为 promise 调用 then 方法时，当前的 promise 并没有成功，一直处于 pending 状态。所以如果当调用 then 方法时，当前状态是 pending，我们需要先将成功和失败的回调分别存放起来，
// 在executor()的异步任务被执行时，触发 resolve 或 reject，依次调用成功或失败的回调。
  function resolve(value){
    if(value instanceof Mypromise){
      return value.then(resolve,reject)
    }
   
    if(self.status==="pending"){
      self.value=value
      self.status="resolved"
      self.onResolvedCallbacks.forEach(fn=>{
        fn()
      })
    }
    
  }
  function reject(reason){
    
    if(self.status==="pending"){
      self.reason=reason;
      self.status="rejected"
      self.onRejectedCallbacks.forEach(fn => {
        fn()
      })
    }
  }
  try {
    executor(resolve,reject)
  } catch (error) {
    reject(e)
  }
 
}

Mypromise.prototype.then=function(onFullfiled,onRejected){
  let self=this;
  var promise2
  onFullfiled=typeof onFullfiled==="function"?onFullfiled:function(v){};
  onRejected=typeof onRejected==="function"?onRejected:function(r){};
  if(self.status==="resolved"){
    promise2=new Mypromise(function(resolve,reject){
      try{
        var x=onFullfiled(self.value);
        if(x instanceof Mypromise){
          x.then(resolve,reject)
        }
        resolve(x)
      }catch(e){
        reject(e)
      }
    })
    return promise2;
  }
  if(self.status==="rejected"){
    promise2=new Mypromise(function(resolve,reject){
      try {
        var x=onRejected(self.reason)
        if(x instanceof Mypromise){
          x.then(resolve,reject)
        }
        reject(x)
      } catch (error) {
        reject(error)
      }
    })
    return promise2
  }
  if(self.status==="pending"){
    promise2=new Mypromise(function(resolve,reject){
      self.onResolvedCallbacks.push(function(){
        try {
          var x=onFullfiled(self.value)
          if(x instanceof Mypromise){
            x.then(resolve,reject)
          }
          resolve(x)
        } catch (error) {
          reject(error)
        }
      })
      self.onRejectedCallbacks.push(function(){
        try{
          var x=onRejected(self.reason)
          if(x instanceof Mypromise){
            x.then(resolve,reject)
          }
          reject(x)
        }catch(e){
          reject(e)
        }
      })
    })
    return promise2
  }
}

Mypromise.prototype.catch=function(onRejected){
  return this.then(null,onRejected)
}

function myAjax({
  url=null,method="GET",dataType="JSON",async=true
}){
  return new Promise((resolve,reject)=>{
    let xhr=new XMLHttpRequest();
    xhr.open(method,url,async);
    xhr.responseType=dataType;
    xhr.onreadystatechange=()=>{
      if(! /^[23]\d{2}$/.test(xhr.status)) return
      if(xhr.readyState===4){
        try {
          let result=xhr.responseText;
        switch(this.dataType.toUpperCase()){
          case "TEXT":
          case "HTML":
            break;
          case "JSON":
            result=JSON.parse(result)
            break;
          case "XML":
            result=xhr.responseXML;
        }
        resolve(result)
        } catch (error) {
          reject(error)
        }
      }
    }
    xhr.onerror=(err)=>{
      reject(err)
    }
    xhr.send()
  })
}


function myPromiseAll(promises){
  return new Promise(function(resolve,reject){
    if(!Array.isArray(promises)){
      return reject(new TypeError("arguments must be an array"));
    }
    var resolveCunter=0;
    var promiseNum=promises.length;
    var resolvedValues=new Array(promiseNum);
    for(var i=0;i<promiseNum;i++){
      (function(i){
        Promise.resolve(promises[i]).then(function(value){
          resolveCunter++
          resolvedValues[i]=value;
          if(resolveCunter==promiseNum){
            return resolve(resolvedValues)
          }
        },function(reason){
            return reject(reason);
        })
      })(i)
    }
  })
}

function myPromiseRace(promises){
  return new Promise((resolve,reject)=>{
    if(!Array.isArray(promises)){
      return reject(new TypeError("arguments must be an array"));
    }
    for(let i=0;i<promises.length;i++){
      Promise.resolve(promises[i]).then((data)=>{
        resolve(data);
        return
      },err=>reject(err))
    }
  });
}

Promise.prototype.myFinally = function (callback) {
  let P = this.constructor; //Promise.resolve()
  return this.then(
    value => P.resolve(callback()).then(()=> value),
    reason => P.resolve(callback()).then(()=> {throw reason})
  )
}






