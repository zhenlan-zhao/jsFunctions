// Definition for a binary tree node.
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

// 给定一个二叉树，找出其最大深度。
// 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

// 递归实现
var maxDepth=function(root){
  if(root===null) return 0;
  return Math.max(maxDepth(root.left)+1,maxDepth(root.right)+1);
}
var maxDepth2=function(root){
  if(root==null) return 0;
  let queue=[root];
  let level=0;
  while(queue.length){
    let size=queue.length;
    while(size--){
      // 层序遍历
      let front=queue.shift();
      if(front.left) queue.push(front.left);
      if(front.right) queue.push(front.right);
    }
    level++
  }
  return level;
}

// 最小深度
// 给定一个二叉树，找出其最小深度。
// 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
// 当 root 节点有一个孩子为空的时候，此时返回的是 1， 但这是不对的，最小高度指的是根节点到最近叶子节点的最小路径，而不是到一个空节点的路径。

// 递归实现
var minDepth=function(root){
  if(root==null) return 0;
  // 当左右孩子都不为空时
  if(root.left && root.right){
    return Math.min(minDepth(root.left),minDepth(root.right))+1;
  }else if(root.left){
    // 右孩子为空
    return minDepth(root.left)+1;
  }else if(root.right){
    // 左孩子为空
    return minDepth(root.right)+1;
  }else{
    // 两孩子都为空说明到达了叶子节点
    return 1;
  }
}

// 非递归实现
var minDepth2=function(root){
  if(root==null) return 0;
  let queue=[root];
  let level=0;
  while(queue.length){
    let size=queue.length;
    while(size--){
      let front=queue.shift();
      // 找到出现的第一个叶子节点，其level即为最小高度
      if(!front.left&&!front.right){
        return level+1;
      }
      if(front.left) queue.push(front.left);
      if(front.right) queue.push(front.right)
    }
    level++
  }
}