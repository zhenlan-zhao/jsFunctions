let _toString=Object.prototype.toString;
let map={
  array:"Array",
  object:"Object",
  function:"Function",
  string:"String",
  null:"Null",
  undefined:"Undefined",
  boolean:"Boolean",
  number:"Number"
}
let getType=(item)=>{
  return _toString.call(item).slice(8);
}
let isTypeOf=(item,type)=>{
  return map[type]&&map[type]===getType(item)
}

let DFSdeepClone=(obj,visitedArr=[])=>{
  let _obj={}
  if(isTypeOf(obj,'array')||isTypeOf(obj,'object')){
    let index=visitedArr.indexOf(obj)
    _obj=isTypeOf(obj,'array')?[]:{}
    if(~index){//判断环状数据
      _obj=visitedArr[index]
    }else{
      visitedArr.push(obj)
      for(let item in obj){
        _obj[item]=DFSdeepClone(obj[item],visitedArr)
      }
    }
  }else if(isTypeOf(obj,"function")){
    _obj=eval("("+obj.toString()+")")
  }else{
    _obj=obj
  }
  return _obj
}
let deepTraversal1=(node,nodeList=[])=>{
  if(node!==null){
    nodeList.push(node)
    let children=node.children
    for(let i=0;i<children.length;i++){
      deepTraversal1(children[i],nodeList)
    }
  }
  return nodeList
};
let deepTraversal2 = (node)=>{
  let stack=[];
  let nodes=[];
  if(node){
    stack.push(node)
    while(stack.length){
      let item=stack.pop();
      let children=item.children;
      nodes.push(item)
      for(let i=children.length-1;i>=0;i--){
        stack.push(children[i])
      }
    }
  }
  return nodes
}
let deepTraversal3=(node)=>{
  let nodes=[]
  if(node!==null){
    nodes.push(node)
    let children=node.children;
    for(let i=0;i<children.length;i++){
      nodes=nodes.concat(deepTraversal3(children[i]))
    }
  }
  return nodes;
}

let widthTraversals=(node)=>{
  let nodes=[]
  let stack=[]
  if(node){
    stack.push(node)
    while(stack.length){
      let item=stack.shift();
      let children=item.children;
      nodes.push(item)
      for(let i=0;i<children.length;i++){
        stack.push(children[i])
      }
    }
  }
  return nodes
}


