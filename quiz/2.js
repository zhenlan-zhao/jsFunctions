function fib(n, ac1 = 1, ac2 = 1) {
  if (n <= 1) {return ac2};
  return fib(n-1, ac2, ac1 + ac2);
}

function findFibonacci (arr) {
  const res = [];
  for (let num of arr) {
    for (let i = 0; fib(i) < num; i++) {
      if (fib(i+1) == num) {
        res.push(num);
      }
    }
  }
  return res.sort((a,b) => a-b);
}
console.log(findFibonacci([13,9,3,8,5,25,31,11,21]));

