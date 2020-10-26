// Definition for a binary tree node.
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

// 二叉树的最近公共祖先
// 输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
// 输出: 3
// 解释: 节点 5 和节点 1 的最近公共祖先是节点 3。

// 首先遍历一遍二叉树，记录下每个节点的父节点。然后对于题目给的 p 节点，根据这个记录表不断的找 p 的上层节点，直到根，
// 记录下 p 的上层节点集合。然后对于 q 节点，根据记录不断向上找它的上层节点，在寻找的过程中一旦发现这个上层节点已经包含在刚刚的集合中，说明发现了最近公共祖先，直接返回。

var lowestCommonAncestor=function(root,p,q){
  if(root==null||root==p||root==q) return root;
  let set=new Set();
  let map=new WeakMap();
  let queue=[];
  queue.push(root);
  // 层序遍历
  while(queue.length){
    let size=queue.length;
    while(size--){
      let front=queue.shift();
      if(front.left){
        queue.push(queue.left);
        // 记录父节点
        map.set(front.left,front)
      }
      if(front.right){
        queue.push(front.right);
        map.set(front.right,front);
      }
    }
  }
  // 构造p的上层节点集合
  while(p){
    set.add(p);
    p=map.get(p)
  }
  while(q){
    if(set.has(q)) return q;
    q=map.get(q)
  }
}
// 可以看到整棵二叉树遍历了一遍，时间复杂度大致是 O(n)，但是由于哈希表的存在，空间复杂度比较高

// 深度优先遍历法
// 代码是自顶向下执行的，我建议大家用自底向上的方式来理解它，即从最左下的节点开始分析
var lowestCommonAncestor2=function(root,p,q){
  if(root==null||root==p||root==q) return root;
  let left=lowestCommonAncestor2(root.left,p,q);
  let right=lowestCommonAncestor2(root.right,p,q);
  if(left&&right) return root;
  return left?left:right;
}

// 二叉搜索树的最近公共祖先
var lowestCommonAncestor_serachTree=function(root,p,q){
  if(root==null||root==p||root==q) return root;
  // root.val比p,q都大的话，找左孩子
  if(root.val>p.val&&root.val>q.val){
    return lowestCommonAncestor_serachTree(root.left,p,q);
  }
  if(root.val<p.val&&root.val<q.val){
    return lowestCommonAncestor_serachTree(root.right,p,q);
  }
  else{
    // 如果p,q中一个比root大，另一个比root小，说明p,q在root两侧，则直接返回root
    return root;
  }
}

// 非递归实现
var lowestCommonAncestor_serachTree2=function(root,p,q){
  let node=root;
  while(node){
    if(p.val>node.val&&q.val>node.val){
      node=node.right;
    }else if(p.val<node.val&&q.val<node.val){
      node=node.left;
    }else{
      return node;
    }
  }
}