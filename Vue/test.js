// arr.sort((a,b) => {
//   return a[1]-b[1];
// });
// function dfs(arr,leftDays,temMax) {
//   if (leftDays <= 0) {
//       max = Math.max(max,temMax);
//       return;
//   }
//   for (let i=0;i<arr.length;i++) {
//       if (arr[i][1] <= leftDays) {
//           temMax += arr[i][0];
//       }
//       if (i != arr.length -1) {
//           dfs(arr.slice(i+1),leftDays-arr[i][1],temMax);
//       }
//   }
// }
// dfs(arr,days,0);
// printsth(max);

// var a = 1;
// function fn () {
//   console.log(a);
//   var a = 2;
//   console.log(this.a);
//   this.a = 3;
// }
// fn();
// var ff = new fn()

const shape = {
  radius: 10,
  diameter() {return this.radius*2;},
  perimeter: ()=> 2*this.radius
}
console.log(shape.diameter());
console.log(shape.perimeter());


setTimeout(()=>{console.log(100)}) //1 2 3 4 6 100 10
console.log(1)
new Promise((resolve,reject) => {
    resolve();
    console.log(2)
}).then(() => {
    console.log(3)
    setTimeout(() => {
        console.log(10) 
    },0);
    Promise.resolve().then(() => {
        console.log(4);
        return Promise.reject()
    }).catch(() => {
    console.log(6)
  })
})


