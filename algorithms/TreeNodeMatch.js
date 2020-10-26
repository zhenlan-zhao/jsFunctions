// tree = [
//   {name: 'A'},
//   {name: 'B', children: [
//     {name: 'A'},
//     {name: 'AA', children: [...]}
//   ]},
//   {name: 'C'}
// ]
 
// 1. 假设我输入的 str 为 A 则过滤后返回的结果为
// [
//   {name: 'A'},
//   {name: 'B', children: [
//     {name: 'A'}
//   ]}
// ]

//要考虑保存这棵树的信息 并且不要别的无关枝干
function clear (tree,str) {
  let result = [];
  tree.forEach ((item) => {
    if (item.name == str) {
      result.push(item);
    } else {
      if (item.children) {
        let obj = clear(item.children,str); //注意 item.children的结构跟tree是一样的
        if (obj.length > 0) {
          item.children = obj;
          result.push(item)
        }
      }
    }
  });
  return result;
}
