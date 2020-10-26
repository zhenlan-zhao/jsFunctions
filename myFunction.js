function isObject(obj){
  return typeof obj==="object" && obj!=null
}

function cloneDeep(source,hash=new WeakMap()){
  if(!isObject(source)) return source;
  if(hash.has(source)) return hash.get(source);
  var target=Array.isArray(source)?[]:{};
  hash.set(source,target)
  for (var key in source){
    if(Object.prototype.hasOwnProperty.call(source,key)){
      if(isObject(source[key])){
        target[key]=cloneDeep(source[key],hash);
      }else{
        target[key]=source[key]
      }
    }
  }
  let symKeys=Object.getOwnPropertySymbols(source);
  if(symKeys.length){
    symKeys.forEach(symKey=>{
      if(isObject(source[symKey])){
        target[symKey]=cloneDeep(source[symKey],hash)
      }else{
        target[symKey]=source[symKey]
      }
    })
  }
  return target
}

function myInstanceof(left, right) {
  //基本数据类型直接返回false
  if(typeof left !== 'object' || left === null) return false;
  //getProtypeOf是Object对象自带的一个方法，能够拿到参数的原型对象
  let proto = Object.getPrototypeOf(left);
  while(true) {
      //查找到尽头，还没找到
      if(proto == null) return false;
      //找到相同的原型对象
      if(proto == right.prototype) return true;
      proto = Object.getPrototypeOf(proto);
  }
}
//console.log(myInstanceof("111", String)); //false
//console.log(myInstanceof(new String("111"), String));//true


function myObjectIs(x,y){
  if(x===y){
    // 运行到1/x === 1/y的时候x和y都为0，但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的
    return x!==0 || y!==0 || 1/x===1/y;
  }else{
    // NaN===NaN是false,这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理
    //两个都是NaN的时候返回true
    return x!==x && y!==y
  }
}
// 用setTimeout()实现setInterval()
let timeMap={}
let id=0
const mySetInterval=(cb,time)=>{
  let timeId=id;
  id++
  let fn=()=>{
    cb();
    timeMap[timeId]=setTimeout(()=>{
      fn()
    },time)
  }
  timeMap[timeId]=setTimeout(fn,time)
  return timeId;
}

const myClearInterval=(id)=>{
  clearTimeout(timeMap[id])
  delete timeMap[id];
}

function myMap(fn,context){
  var arr=Array.prototype.slice.call(this)
  // var arr=[...this];
  var mappedArr=[];
  for(var i=0;i<arr.length;i++){
    mappedArr.push(fn.call(context,arr[i],i,this));
  }
  return mappedArr;
}
// 在原始的map函数中，如果fn是箭头函数的话，那this无效，总是指向window
Array.prototype.selfMap=function(){
  const ary=this;
  const result=new Array(arr.length);
  // map第一个参数是回调函数，第二个函数是表示this对象
  const [fn,thisArg]=[].slice.call(arguments);
  if(typeof fn!=="function"){
    throw new TypeError(fn+"is not a function");
  }
  for(let i=0;i<ary.length;i++){
    //处理稀疏数组的情况
    // 如果是空位的话 in会返回false
    if(i in ary){
      result[i]=fn.call(thisArg,ary[i],i,ary);
    }
  }
  return result
}

// 用reduce实现map
const reduceMap=(fn,thisArg)=>{
  return (list)=>{
    if(typeof fn!=="function"){
      throw new TypeError(fn+"is not a function")
    }
    if(!Array.isArray(list)){
      throw new TypeError("list must be an array ")
    }
    if(list.length===0){
      return [];
    }
    const result=new Array(list.length);
    return list.reduce((acc,value,index)=>{
      if(index in list){
        acc[index]=fn.call(thisArg,value,index,list)
      }
      return acc
    },result)
  }
}

reduceMap(x=>x+1)([1,2,3])//[2,3,4]

const mapAry1=reduceMap(function(item){
  console.log(this)
  return item+1
},{msg:"mapping"})([1,2,3])//[2,3,4],logging {msg:"mapping"}} three times

//filter实现
Array.prototype.selfFilter=function(){
  const ary=this;
  const result=[];
  const [fn,thisArg]=[].slice.call(arguments);

  if(typeof fn!=="function"){
    throw new TypeError(fn+"is not a function")
  }
  for(let i=0;i<ary.length;i++){
    if (i in ary && fn.call(thisArg,arr[i],i,ary)){
      result.push(ary[i])
    }
  }
  return result
}
const a =new Array(1,2,3);
a.selfFilter(item=>item%2===0)//[2]
a.selfFilter(function(item){
  console.log(this)
  return item%2===0
},{})
// [2] and logging {} three times

//reduce实现filter
const reduceFilter=(fn,thisAry)=>{
  return (list)=>{
    if (typeof fn!=="function"){
      throw new TypeError(fn+"is not a function")
    }
    if(!Array.isArray(list)){
      throw new TypeError("list must be an array")
    }
    if(list.length===0) return []
    return list.reduce((acc,value,index)=>{
      return index in list && fn.call(thisAry,value,index,list)?
      acc.concat([value]):acc
    },[])
  }
}
reduceFilter(x=>x%2===0)([1,2,3])//[2]




// reducer 函数接收4个参数:
// Accumulator (acc) (累计器)
// Current Value (cur) (当前值)
// Current Index (idx) (当前索引)
// Source Array (src) (源数组)
// arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])

// 数组求和
[0,1,2,3,4].reduce(function(accumulator,currentValue,currentIndex,array){
  return accumulator+currentValue;
},0)
Array.prototype.myReduce=function(fn,initialValue){
  var arr=Array.prototype.slice.call(this);
  var res,startIndex;
  res=initialValue?initialValue:arr[0];
  startIndex=initialValue?0:1;
  for(var i=startIndex;i<arr.length;i++){
    res=fn.call(null,res,arr[i],i,this);
  }
  return res
}

Object.defineProperty (Array.prototype, 'myReduce', {
  value: function (reducer, initialValue) {
      if (typeof reducer !== "function") {
          throw new Error('reducer应该是一个函数！')
      }
      let thisArr = this;
      let accumulator = initialValue || thisArr[0];
      let startIndex = initialValue? 0 :1;
      for (let i=startIndex; i<thisArr.length;i++) {
          let curVal = thisArr[i];
          accumulator = reducer.call(null,accumulator,curVal,i,thisArr);
      }
      return accumulator;
   }
})

const computeStartIndex=(startIndex,len)=>{
  if(startIndex<0){
    return startIndex+len>0?startIndex+len:0;
  }
  return startIndex>=len?len:startIndex;
}
const computeDeleteCount=(startIndex,len,deleteCount,argumentsLen)=>{
  if(argumentsLen===1){
    return len-startIndex;
  }
  if(deleteCount<0){
    return 0;
  }
  if(deleteCount>(len-startIndex)){
    return len-startIndex;
  }
  return deleteCount
}

Array.prototype.mySplice=function(startIndex,deleteCount,...addElements){
  let argumentsLen=arguments.length;
  let array=Object(this);
  let len=array.length;
  let deletArr=new Array(deleteCount);
  startIndex=computeStartIndex(startIndex,len);
  deleteCount=computeDeleteCount(startIndex,len,deleteCount,argumentsLen);

  // 拷贝删除的元素
  sliceDeleteElements(array,startIndex,deleteCount,deletArr);
 // 移动删除元素后面的元素
  movePostElemts(array,startIndex,len,deleteCount,addElements);
  // 插入新元素
  for(let i=0;i<addElements.length;i++){
    array[startIndex+i]=addElements[i]
  }
  array.length=len-deleteCount+addElements.length;
  return deletArr

}
const sliceDeleteElements=(array,startIndex,deleteCount,deletArr)=>{
  for(let i=0;i<deleteCount;i++){
    let index=startIndex+i;
    if(index in array){
      let current=array[index];
      deletArr[i]=current;
    }
  }
}
const movePostElemts=(array,startIndex,len,deleteCount,addElements)=>{
  if(deleteCount===addElements.length) return;
  // 如果添加的元素和删除的元素个数不相等，则移动后面的元素
  // / 删除的元素比新增的元素多，那么后面的元素整体向前挪动
    // 一共需要挪动 len - startIndex - deleteCount 个元素
  if(deleteCount>addElements.length){
    for(let i=startIndex+deleteCount;i<len;i++){
      let fromIndex=i;
      let toIndex=i-(deleteCount-addElements.length)
      if(fromIndex in array){
        array[toIndex]=array[fromIndex]
      }else{
        delete array[toIndex]
      }
    }
    // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
    // 目前长度为 len + addElements - deleteCount
    for(let i=len-1;i>=len+addElements.length-deleteCount;i--){
      delete array[i]
    }
  }
  if(deleteCount<addElements.length){
    // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
    // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
    for(let i=len-1;i>=startIndex+deleteCount;i--){
      let fromIndex=i;
      let toIndex=i+(addElements.length-deleteCount);
      if(fromIndex in array){
        array[toIndex]=array[fromIndex]
      }else{
        delete array[toIndex];
      }
    }
  }
}

Array.prototype.mySlice=function(start,end){
  var len=this.length; //数组的length
  start=start===undefined?0:start; 
  start=(start>=0)?start:Math.max(0,len+start) //可能为负数
  end=end===undefined?len:end;
  if(end<0){end=len+end}
  var res=[];
  for(var i=start;i<end;i++){
    res.push(this[i])
  }
  return res;
}

Array.prototype.myPush = function (...item) {
  let O = Object(this);
  let len = this.length;
  let argLen = item.length; //可以传入多个值
  if (len + argLen > 2*53-1) {
    throw new TypeError("The number of array is over the max value restricted!") 
  }
  for (let i =0;i<argLen;i++) {
    O[len+i] = item[i];
  }
  let newLen = len + argLen;
  O.length = newLen;
  return newLen;
}

Array.prototype.myPop = function () {
  let O = Object(this);
  let len = this.length;
  if (len == 0) {
    O.length = 0;
    return undefined;
  }
  len--;
  let value = O[len]; //先减后用
  delete O[len];
  O.length = len;
  return value;
}