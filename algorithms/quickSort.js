var quickSort = function (arr) {
  if (arr.length <=1) return arr;
  var pivotIndex = Math.floor(arr.length/2);
  var pivot = arr.splice(pivotIndex,1)[0];
  var left = [],right = [];
  for (let i=0;i<arr.length;i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot],quickSort(right));
}
//获取基准点使用了一个splice操作，在js中splice会对数组进行一次拷贝的操作，而它最坏的情况下复杂度为O(n)，而O(n)代表着针对数组规模的大小进行了一次循环操作。
// 首先我们每次执行都会使用到两个数组空间，产生空间复杂度。
// concat操作会对数组进行一次拷贝，而它的复杂度也会是O(n)
// 对大量数据的排序来说相对会比较慢

function swap (A,i,j) {
  const temp = A[i];
  A[i] = A[j];
  A[j] = temp;
}

/**
 *
 * @param {*} A  数组
 * @param {*} p  起始下标
 * @param {*} r  结束下标 + 1
 */
function divide(A,p,r) {
  const x = A[r-1];
  let i = p-1;

  for (let j = p;j<r-1;j++) {
    if (A[j] <= x) {
      i++;
      swap(A,i,j);
    }
  }
  swap(A,i+1,r-1);
  return i+1;
}


/**
 * 
 * @param {*} A  数组
 * @param {*} p  起始下标
 * @param {*} r  结束下标 + 1
 */
function qsort(A,p=0,r) {
  r = r || A.length;
  if (p < r-1) {
    const q = divide(A,p,r);
    qsort(A, p, q);
    qsort (A,q+1,r);
  }
}

// 初始化i = -1
// 循环数组，找到比支点小的数就将i向右移动一个位置，同时与下标i交换位置
// 循环结束后，最后将支点与i+1位置的元素进行交换位置
// 最后我们会得到一个由i指针作为分界点，分割成从下标0-i，和 i+1到最后一个元素。

// 快排
function quickSort(arr, i, j) {
  if(i < j) {
    let left = i;
    let right = j;
    let pivot = arr[left];
    while(i < j) {
      while(arr[j] >= pivot && i < j) {  // 从后往前找比基准小的数
        j--;
      }
      if(i < j) {
        arr[i++] = arr[j];
      }
      while(arr[i] <= pivot && i < j) {  // 从前往后找比基准大的数
        i++;
      }
      if(i < j) {
        arr[j--] = arr[i];
      }
    }
    arr[i] = pivot;
    quickSort(arr, left, i-1);
    quickSort(arr, i+1, right);
    return arr;
  }
}

// example
let arr = [2, 10, 4, 1, 0, 9, 5 ,2];
console.log(quickSort(arr, 0 , arr.length-1));


