function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

// 节点的左子树只包含小于当前节点的数。 节点的右子树只包含大于当前节点的数。 所有左子树和右子树自身必须也是二叉搜索树。
// 验证二叉搜索树

// 通过中序遍历，保存前一个节点的值，扫描到当前节点时，和前一个节点的值比较，如果大于前一个节点，则满足条件，否则不是二叉搜索树。
var isValidBST=function(root){
  let prev=null;
  const help=(node)=>{
    if(node==null) return true;
    if(!help(node.left)) return false;
    if(prev!==null && prev>=node.val) return false;
    prev=node.val;
    return help(node.right)
  }
  help(root)
}

var isValidBST2=function(root){
  let stack=[];
  let inorder=-Infinity;
  while(stack.length||root!=null){
    while(root!=null){
      stack.push(root);
      root=root.left
    }
    root=stack.pop();
    if(root.val<=inorder) return false;
    inorder=root.val;
    root=root.right;
  }
  return true;
}
var isValidBST3=function(root,arr=[]){
  if(!root){
    return true;
  }
  return isValidBST3(root.left,arr) && compareAndPush(root.val,arr) && isValidBST3(root.right,arr);
}
function compareAndPush(val,arr){
  if(arr.length){
    if(arr[arr.length-1]>=val) return false;
  }
  arr.push(val);
  return true;
}

// 方法二: 限定上下界进行DFS
// 二叉搜索树每一个节点的值，都有一个上界和下界，深度优先遍历的过程中，如果访问左孩子，则通过当前节点的值来更新左孩子节点的上界，
// 同时访问右孩子，则更新右孩子的下界，只要出现节点值越界的情况，则不满足二叉搜索树的条件。

var isValidBST4=function(root){
  const help=(node,max,min)=>{
    if(node==null) return true;
    if(node.val>=max || node.val<=min) return false;
    return help(node.left,node.val,min)&&
           help(node.right,max,node.val);
  }
  return help(root,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER);
}
// 非递归实现
var isValidBST5=function(root){
  if(root==null) return true;
  let stack=[root];
  let min=Number.MIN_SAFE_INTEGER;
  let max=Number.MAX_SAFE_INTEGER;
  root.max=max;root.min=min;
  while(stack.length){
    let node=stack.pop();
    if(node.val<=node.min||node.val>=node.max) return false;
    if(node.left){
      stack.push(node.left);
      node.left.max=node.val;
      node.left.min=node.min;
    }
    if(node.right){
      stack.push(node.right)
      node.right.max=node.max;
      node.right.min=node.val;
    }
  }
  return true
}

// 将有序数组转换为二叉搜索树
// 将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。
// 本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。
// 给定有序数组: [-10,-3,0,5,9],

// 一个可能的答案是：[0,-3,9,-10,null,5]，它可以表示下面这个高度平衡二叉搜索树：

//       0
//      / \
//    -3   9
//    /   /
//  -10  5


// 将数组从最中间项分割得到三个部分：子数组1，中间项，子数组2。将中间项作为当前节点的val，
// 对子数组1和子数组2分别递归执行原方法，得到的两个子树分别作为上一个节点的左子树与右子树
var sortedArrayToBST=function(nums){
  let help=(start,end)=>{
    if(start>end) return null;
    if(start===end) return new TreeNode(nums[start]);
    let mid=Math.floor((start+end)/2);
    let node=new TreeNode(nums[mid]);
    node.left=help(start,mid-1);
    node.right=help(mid+1,end);
    return node
  }
  return help(0,nums.length-1)
}

// 二叉树展开为链表
// 给定一个二叉(搜索)树，原地将它展开为链表。

// 例如，给定二叉树

// 1
// / \
// 2   5
// / \   \
// 3   4   6

// 1
//  \
//  2
//   \
//    3
//     \
//      4
//       \
//        5
//         \
//          6

// 递归方式（后序遍历）
var flatten=function(root){
  if(root==null) return;
  flatten(root.left)
  flatten(root.right);
  if(root.left){
    let p=root.left;
    while(root.right){
      p=p.right
    }
    p.right=root.right;
    root.right=root.left
    root.left=null;
  }
}
// 非递归方式
var flatten=function(root){
  if(root==null) return;
  let stack=[];
  let visited=new Set();
  let p=root;
  // 开始后续遍历
  while(stack.length||p){
    while(p){
      stack.push(p);
      p=p.left;
    }
    let node=stack[stack.length-1];
    if(node.right&&!visited.has(node.right)){
      p=node.right;
      visited.add(node.right);
    }else{
      // 关键逻辑
      if(node.left){
        let p=node.left;
        while(p.right){
          p=p.right
        }
        p.right=node.right;
        node.right=node.left;
        node.left=null;

      }
      stack.pop()
    }
  }
}

// 给定一个整数 n，生成所有由 1 ... n 为节点所组成的二叉搜索树。

// 输入: 3
// 输出:
// [
//   [1,null,3,2],
//   [3,2,null,1],
//   [3,1,null,null,2],
//   [2,1,3],
//   [1,null,2,null,3]
// ]
// 解释:
// 以上的输出对应以下 5 种不同结构的二叉搜索树：

//    1         3     3      2      1
//     \       /     /      / \      \
//      3     2     1      1   3      2
//     /     /       \                 \
//    2     1         2                 3

var generateTrees=function(n){
  let help=(start,end)=>{
    if(start>end) return[null];
    if(start===end) return [new TreeNode(start)];
    let res=[];
    for(let i=start;i<=end;i++){
      let leftNodes=help(start,i-1)
    }
  }
}