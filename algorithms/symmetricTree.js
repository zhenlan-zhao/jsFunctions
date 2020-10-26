// Definition for a binary tree node.
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

// 对称二叉树

// 递归实现
var isSymmetirc=function(root){
  let help=(node1,node2)=>{
    // 都为空
    if(!node1&&!node2) return true;
    if(!node||!node2||node1.val!==node2.val) return false;
    return help(node1.left,node2.right) && help(node1.right,node1.left);
  }
  if(root==null) return true;
  return help(root.left,root.right);
}
// 非递归实现
// 用一个队列保存访问过的节点，每次取出两个节点

var isSymmetirc2=function(root){
  if(root==null) return true;
  let queue=[root.left,root.right];
  let node1,node2;
  while(queue.length){
    node1=queue.shift();
    node2=queue.shift();
    if(!node1&&!node2) continue;
    if(!node1||!node2||node1.val!==node2.val) return false;
    queue.push(node1.left);
    queue.push(node2.right);
    queue.push(node1.right);
    queue.push(node2.left);
  }
  return true;
}