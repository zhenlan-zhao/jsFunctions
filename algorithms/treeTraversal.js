// Definition for a binary tree node.
function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
 }
// 递归前序遍历
var preOrderTraversal1=function(root){
  let arr=[];
  let traverse=(root)=>{
    if(root==null) return;
    arr.push(root.val);
    traverse(root.left);
    traverse(root.right);
  }
  traverse(root);
  return arr;
}

// 迭代前序遍历
var preorderTraversal2=function(root){
  if(root==null) return null;
  let stack=[],res=[];
  stack.push(root)
  while(stack.length){
    let node=stack.pop();
    res.push(node.val);
    // 左孩子后进先出（栈，push&pop)，进行先左后右的深度优先遍历；
    if(node.right){
      stack.push(node.right);
    }
    if(node.left){
      stack.push(node.left)
    }
  }
}

// 递归中序遍历
var inorderTraversal1=function(root){
  let arr=[];
  let traverse=(root)=>{
    if(root==null) return;
    traverse(root.left);
    arr.push(root.val);
    traverse(root.right);
  }
  traverse(root);
  return arr;
}
// 迭代中序遍历
var inorderTraversal2=function(root){
  if(root==null) return null;
  let stack=[],res=[];
  let p=root;
  while(stack.length||p){
    while(p){
      stack.push(p);
      p=p.left
    }
    let node=stack.pop();
    res.push(node.val);
    p=node.right
  }
  return res
}

// 递归后序遍历
var aftorderTraversal1=function(root){
  let arr=[];
  let traverse=(root)=>{
    if(root==null) return;
    traverse(root.left);
    traverse(root.right);
    arr.push(root.val);
  }
  traverse(root);
  return arr;
}
// 非递归后序遍历---比较难理解，注意顺序
var aftorderTraversal2=function(root){
  if(!root) return null
  let res=[],stack=[];
  let visited=new Set()
  let p=root;
  while(stack.length||p){
    while(p){
      stack.push(p);
      p=p.left
    }
    let node=stack[stack.length-1];
    if(node.right&&!visited.has(node.right)){
      p=node.right;
      visited.add(node.right);
    }else{
      res.push(node.val);
      stack.pop()
    }
  }
}



 