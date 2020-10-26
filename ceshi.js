// 本题为考试单行多行输入输出规范示例，无需提交，不计分。
// while(line=readline()){
//   var lines = line.split(" ");
//   var a = parseInt(lines[0]);
//   var b = parseInt(lines[1]);
//   print(a+b);
// }

// var n = parseInt(readline());
// var ans = 0;
// for(var i = 0;i < n; i++){
//     lines = readline().split(" ")
//     for(var j = 0;j < lines.length; j++){
//         ans += parseInt(lines[j]);
//     }
// }
// print(ans);

// function DistanceToHigher( height ) {
//   // write code here
//   let len=height.length;
//   let result=[0];
//   let temp=[height[0]];
//   for(var i=1;i<len;i++){
//     let maxnum=Math.max.apply(null,temp);
//     console.log(maxnum)
//     if(maxnum<=height[i]){
//       result[i]=0;
//     }else{
//       for(var j=i-1;j>=0;j--){
//         if(height[j]>height[i]){
//           result[i]=i-j;
//           break;
//         }
//       }
//     }
//     temp.push(height[i])
//   }
//   return result;
// }
// var input=[175,173,174,163,182,177]
// console.log(DistanceToHigher(input))

let line=readline()
let numbers=line.split(",")
let result=[]
let obj=new Map()
numbers.forEach(num => {
    let number=num.slice(3)
    let tempnums=[];
    for(var i=0;i<=5;i++){
      let increment=2;
      let valNum=0,bNum=0;
      let a=Number(number[i]),b=Number(number[i+1])
      if(Math.abs(a-b)===1){
        let markBool=a<b?true:false;
        if(markBool){
          while(Number(number[i+increment])==Number(number[i+increment-1])+1){
            increment+=1
          }
        }else{
          while(Number(number[i+increment])==Number(number[i+increment-1])-1){
            increment+=1
          }
        }
        valNum=increment;
        console.log(valNum)
      }else if(a===b){
        while(Number(number[i+increment])==Number(number[i+increment-1])){
          increment+=1
        }
        bNum=increment*1.1
      }
      let maxNum=bNum>valNum?bNum:valNum;
      if(maxNum){
        tempnums.push(maxNum)
      }
     
    }
    let finalNum=Math.max.apply(null,tempnums)
    if(finalNum>=3){
      if(obj.has(finalNum)){
        obj.set(finalNum+0.01,num)
      }else{
        obj.set(finalNum,num)
      }
    }
});
let sortedKey=[...obj.keys()].sort()
sortedKey.forEach(key=>{
  result.push(obj.get(key))
})
// console.log(result.join(","))
return result.join(",")




