// 给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过根结点。
//  1
// / \
// 2   3
// / \     
// 4   5  
// 返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。

// 注意：两结点之间的路径长度是以它们之间边的数目表示。
// 所谓的求直径, 本质上是求树中节点左右子树高度和的最大值
    //       1
    //      / 
    //     2   
    //    / \     
    //   4   5
    //  /     \
    // 8       6
    //          \
    //           7
    // 那这个时候，直径最大的路径是: 8 -> 4 -> 2-> 5 -> 6 -> 7。交界的元素并不是根节点。这是这个问题特别需要注意的地方，不然无解。

var diameterOfBinaryTree=function(root){
  let maxDepth=(node)=>{
    if(node==null) return 0;
    return Math.max(maxDepth(node.left)+1,maxDepth(node.right)+1);
  }
  let help=(node)=>{
    if(node==null) return 0;
    let rootSum=maxDepth(node.left)+maxDepth(node.right);
    let childSum=Math.max(help(node.left),help(node.right));
    return Math.max(rootSum,childSum);
  }
  if(root==null) return 0;
  return help(root);
}
// 反复调用 maxDepth 的过程，对树中的一些节点增加了很多不必要的访问
// 每一个节点访问的次数大概是 O(logK)(设当前节点在第 K 层)

var diameterOfBinaryTree2=function(root){
  let help=(node)=>{
    if(node==null) return 0;
    let left=node.left?help(node.left)+1:0;
    let right=node.right?help(node.right)+1:0;
    let cur=left+right;
    if(cur>max) max=cur;
    return Math.max(left,right);
  }
  let max=0;
  if(root==null) return 0;
  help(root);
  return max;
}

// 设置了一个max全局变量，深度优先遍历这棵树，每遍历完一个节点就更新max，并通过返回值的方式自底向上把当前节点左右子树的最大高度传给父函数使用，使得每个节点只需访问一次即可。

// 二叉树的所有路径(返回所有从根节点到叶子节点的路径)
// 递归解法(DFS)
var binaryTreePaths=function(root){
  let path=[];
  let res=[];
  let dfs=(node)=>{
    if(node==nul) return;
    path.push(node);
    dfs(node.left);
    dfs(node.right);
    if(!node.left&&!node.right){
      res.push(path.map(item=>item.val).join("->"));
    }
    // 注意每访问完一个节点记得把它从path中删除，达到回溯效果
    path.pop()
  }
  dfs(root);
  return res;
}

// 非递归(后续遍历)
var binaryTreePaths2=function(root){
  if(root==null) return [];
  let stack=[];
  let p=root;
  let set=new Set();
  res=[];
  while(stack.length||p){
    while(p){
      stack.push(p);
      p=p.left;
    }
    let node=stack[stack.length-1];
    // 叶子节点
    if(!node.right&&!node.left){
      res.push(stack.map(item=>item.val).join("->"));
    }
    // 右孩子存在且未被访问
    if(node.right&&!set.has(node.res)){
      p=node.right;
      set.add(node.right);
    }else{
      stack.pop()
    }
  }
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



// 二叉树的最大路径和
// 路径被定义为一条从树中任意节点出发，达到任意节点的序列。该路径至少包含一个节点，且不一定经过根节点。
var maxSum=function(root){
  let help=(node)=>{
    if(node==null) return 0;
    let left=Math.max(help(node.left),0);
    let right=Math.max(help(node.right),0);
    let cur=left+node.val+right;
    if(cur>max) max=cur;
    return Math.max(left,right)+node.val
  }
  let max=Number.MIN_SAFE_INTEGER;
  help(root);
  return max;
}



