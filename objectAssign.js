if(typeof Object.assign2!="function"){
  Object.defineProperty(Object,"assign2",{
    value:function(target){
      "use strict";
      if(target==null){
        throw new TypeError("cannot convert undefined or null to object")
      }
      var to=Object(target);
      for(var index=1;index<arguments.length;index++){
        var nextSource=arguments[index];
        if(nextSource!=null){
          for (var nexkey in nextSource){
            if(Object.prototype.hasOwnProperty.call(nextSource,nexkey)){
              to[nexkey]=nextSource[nexkey];
            }
          }
        }
      }
      return to;
    },
    writable:true,
    configurable:true,
    enumerable:false
  })
}

function cloneShallow(source){
  var target={};
  for(var key in source){
    if(Object.prototype.hasOwnProperty.call(source,key)){
      target[key]=source[key];
    }
  }
  return target
}

function cloneDeep1(source){
  var target={};
  for(var key in source){
    if(Object.prototype.hasOwnProperty.call(source,key)){
      if(typeof source[key]=="object"){
        target[key]=cloneDeep1(source[key]);
      }else{
        target[key]=source[key];
      }
    }
  }
  return target
}


function isObject(obj){
  return typeof obj ==="object" && obj!=null
}

// 兼容数组
function cloneDeep2(source){
  if(!isObject(source)) return source
  var target=Array.isArray(source)?[]:{}
  for(var key in source){
    if (Object.prototype.hasOwnProperty.call(source,key)){
      if(isObject(source[key])){
        target[key]=cloneDeep2(source[key])
      }else{
        target[key]=source[key]
      }
    }
  }
  return target;
}


function cloneDeep3(source,hash=new WeakMap()){
  if(!isObject(source)) return source;
  if(hash.has(source)) return hash.get(source);
  var target=Array.isArray(source)?[]:{};
  hash.set(source,target)

  let symKeys=Object.getOwnPropertySymbols(source);
  if(symKeys.length){
    symKeys.forEach(symKey=>{
      if(isObject(source[symKey])){
        target[symKey]=cloneDeep3(source[symKey],hash)
      }else{
        target[symKey]=source[symKey]
      }
    })
  }

  for (var key in source){
    if(Object.prototype.hasOwnProperty.call(source,key)){
      if(isObject(source[key])){
        target[key]=cloneDeep3(source[key],hash);
      }else{
        target[key]=source[key]
      }
    }
  }
  return target
}

function find(arr,item){
  for(var i=0;i<arr.length;i++){
    if(arr[i].source===item){
      return arr[i]
    }
  }
  return null
}

function cloneDeep3_2(source,uniqueList){
  if(!isObject(source)) return source;
  if(!uniqueList) uniqueList=[];
  var target=Array.isArray(source)?[]:{};
  var uniqueData=find(uniqueList,source);
  if(uniqueData){
    return uniqueData.target;
  }
  uniqueList.push({
    source:source,
    target:target
  })
  for (var key in source){
    if(Object.prototype.hasOwnProperty.call(source,key)){
      if(isObject(source[key])){
        target[key]=cloneDeep3_2(source[key],uniqueList);
      }else{
        target[key]=source[key]
      }
    }
  }
  return target
}

function cloneDeep4(source,hash=new WeakMap()){
  if(!isObject(source)) return source;
  if(hash.has(source)) return hash.get(source);
  let target=Array.isArray(source)?[]:{};
  hash.set(source,target);
  Reflect.ownKeys(source).forEach((key)=>{
    if(isObject(source[key])){
      target[key]=cloneDeep4(source[key],hash);
    }else{
      target[key]=source[key]
    }
  });
  return target
}
