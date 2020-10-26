//数组去重

//reduce + includes
function unique (arr) {
  return arr.reduce((prev,cur) => prev.includes(cur)? prev:[...prev,cur],[]);
}

//利用filter
function unique(arr) {
  return arr.filter(function (item,index,arr) {
    return arr.indexOf(item,0) === index;
  });
}

//利用sort
function unique(arr) {
  if (!Array.isArray(arr)) return;
  arr = arr.sort();
  var array = [arr[0]];
  for (let i = 1; i<arr.length;i++) {
    if (arr[i] !== arr[i-1]) {
      array.push(arr[i]);
    }
  }
  return array;
}

//splice去重
function unique(arr) {
  for (var i = 0; i<arr.length;i++) {
    for (var j=i+1;j<arr.length;j++) {
      if (arr[i] == arr[j]) {
        arr.splice(j,1);
        j--; //注意这里要j--
      }
    }
  }
  return arr;
}

//Set
function unique(arr) {
  return Array.from(new Set(arr));
}

let line1 = parseInt(readline());
let lin2 = readline().split(' ');
line2 = line2.map((val) => parseInt(val));
let M = parseInt(readline());
line2.sort((a,b) => a - b);
var time = 0;
for (let i = 0; i < line2.length ; i += 2) {
    time += line2[i];
}
let res = (time <= M) ? 1 : 0;
print(res);
(1 /2).toFixed(2)