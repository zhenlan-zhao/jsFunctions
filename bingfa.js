// 批量请求数据，所有URL在urls参数中，可以通过max控制请求的并发度。
// 所有请求结束后，需要执行callback函数。发请求的函数可以直接用fetch

// fetch返回promise
const group = (list = [], max = 0) => {
  if (!list.length) return list;
  let results = [];
  for (let i=0; i<list.length;i += max) {
    results.push(list.slice(i,i+max));
  }
}

const requestHandler = async (
  groupedUrl = [],
  callback = () => {}
)  => {
  if (!groupedUrl.length) {
    callback();
    return groupedUrl
  }
  const newGroupedUrl = groupedUrl.map (fetch => fetch());
  const resultsMapper = (results) => results.map(callback);
  const data = await Promise.allSettled(newGroupedUrl).then(resultsMapper);
  return data;
}

const sendRequest = async (
  urls = [],
  max = 0,
  callback = () => {}
) => {
  if (!urls.length) return urls;
  const groupedUrls = group(urls,max);
  const results = [];
  for (let groupedUrl of groupedUrls) {
    try {
      const result = await requestHandler(groupedUrl,callback);
      results.push(result);
    } catch (error) {
      console.log(error);
    }
  }
  return results;
}


// const p1 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p1'))
// const p2 = () => Promise.resolve(2)
// const p3 = () => new Promise((resolve, reject) => setTimeout(resolve, 2000, 'p3'))
// const p4 = () => Promise.resolve(4)
// const p5 = () => new Promise((resolve, reject) => setTimeout(reject, 2000, 'p5'))
// const p6 = () => Promise.resolve(6)
// const p7 = () => new Promise((resolve, reject) => setTimeout(resolve, 1000, 'p7'))
// const p8 = () => Promise.resolve(8)
// const p9 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p9'))
// const p10 = () => Promise.resolve(10)
// const p11 = () => new Promise((resolve, reject) => setTimeout(resolve, 2000, 'p10'))
// const p12 = () => Promise.resolve(12)
// const p13 = () => new Promise((resolve, reject) => setTimeout(reject, 1000, 'p11'))
// const p14 = () => Promise.resolve(14)
 
// const ps = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14]
// sendRequest(ps, 3, ({reason, value}) => {
//   console.log(reason || value)
// })

/**
 * @params list {Array} - 要迭代的数组
 * @params limit {Number} - 并发数量控制数
 * @params asyncHandle {Function} - 对`list`的每一个项的处理函数，参数为当前处理项，
 * 必须 return 一个Promise来确定是否继续进行迭代
 * @return {Promise} - 返回一个 Promise 值来确认所有数据是否迭代完成
 */

 let mapList = (list,limit,asyncHandle) => {
   let recursion = (arr) => {
     return asyncHandle(arr.shift())
      .then(() => {
        if (arr.length !== 0) {
          return recursion (arr)
        } else {
          return 'finish'
        }
      })
   };
   let listCopy = [].concat(list);
   let asyncList = [];
   while (limit--) {
     asyncList.push(recursion(listCopy))
   } //同步  控制并发数
   return Promise.all(asyncList);
 }

 var dataLists = [1,2,3,4,5,6,7,8,9,11,100,123];
 var count = 0;

 mapList (dataLists, 2, (curItem) => {
   return new Promise(resolve => {
     count++;
     setTimeout(() => {
       console.log(curItem, '当前并发量',count--)
       resolve(curItem);
     }, Math.random() * 100);
   }).then(response => {
     console.log('finsish', response)
   })
 }).then ((res) =>{
   console.log(res) //[ 'finish', 'finish' ]
 })


 

 // 封装一个异步加载图片的方法

 function loadImg (url) {
  return new Promise ((resolve,reject) => {
    let img = new Image;
    img.src = url;
    img.onerror = () => {
      reject(new Error('Could not load image at' + url))
    }
    img.onload = () => {
      resolve(img)
    }
  })
 }

// 限制异步操作的并发个数并尽可能快的完成全部
// 有8个图片资源的url，已经存储在数组urls中。
// urls类似于['https://image1.png', 'https://image2.png', ....]
// 而且已经有一个函数function loadImg，输入一个url链接，返回一个Promise，该Promise在图片下载完成的时候resolve，下载失败则reject。
// 但有一个要求，任何时刻同时下载的链接数量不可以超过3个。
// 请写一段代码实现这个需求，要求尽可能快速地将所有图片下载完成。


var urls = [
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting1.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting2.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting3.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting4.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting5.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn6.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn7.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn8.png",
];
// 看到这道题时，我最开始的想法是：

// 拿到urls，然后将这个数组每3个url一组创建成一个二维数组
// 然后用Promise.all()每次加载一组url（也就是并发3个），这一组加载完再加载下一组。

function limitLoad (urls, handler, limit) {
  const data = [];
  let p = Promise.resolve();//初始化一个promis对象
  const groupUrls = (urls) => {
    const doubleDim = [];
    for (let i=0; i<urls.length;i += limit) {
      doubleDim.push(urls.slice(i,i+limit));
    }
    return doubleDim;
  }
  let ajaxImge = (groupedUrl) => {
    return groupedUrl.map((url) => handler(url));
  }
  const groupedUrls = groupUrls(urls);
  groupedUrls.forEach( (groupUrl) => {
    p = p.then( Promise.all(ajaxImge(groupUrl))).then(res => {
      data.push(...res);
      return data;
    })
  })
  return p; //返回的是一个promise对象
}


limitLoad(urls, loadImg, 3).then(res => {
  console.log(res); // 最终得到的是长度为8的img数组: [img, img, img, ...]
  res.forEach(img => {
    document.body.appendChild(img);
  })
})

//既然题目的要求是保证每次并发请求的数量为3，那么我们可以先请求urls中的前面三个(下标为0,1,2)，
// 并且请求的时候使用Promise.race()来同时请求，三个中有一个先完成了(例如下标为1的图片)，
// 我们就把这个当前数组中已经完成的那一项(第1项)换成还没有请求的那一项(urls中下标为3)。
// 直到urls已经遍历完了，然后将最后三个没有完成的请求(也就是状态没有改变的Promise)用Promise.all()来加载它们。

function raceLimitLoad (urls, handler, limit) {
  let seqeunces = [].concat(urls);
  let promises = seqeunces.splice(0,limit).map( (url,index) => {
    return handler(url).then(() => {
      return index;
    })
  })

  return seqeunces
  .reduce((pCollect,curUrl) => {
    return pCollect.then(() => {
      return Promise.race(promises)
    })
    .then (fastIndex => {
      promises[fastIndex] = handler(curUrl).then(() => { //// 获取到已经完成的下标
        // 将"容器"内已经完成的那一项替换
        return fastIndex; //// 要继续将这个下标返回，以便下一次变量使用
      });
    })
    .catch (err => {
      console.error(err);
    }) //每一次reduce 返回的都是promise对象
  }, Promise.resolve()) // 初始化传入空promise对象
  .then(() => {
    return Promise.all(promises); // 最后三个用.all来调用
  });
}


limitLoad(urls, loadImg, 3)
  .then(res => {
    console.log("图片全部加载完毕");
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });

  //urls尽可能快地并发请求，并按照urls的顺序输出结果

  function promisesOutput (urls) {
    let len = urls.length;
    for (let i = 0; i < len; i++) {
      fetch(urls[i]).then((val) => {
        console.log(val);
      })
    }
  }

//同时发送多个请求并按顺序输出

let p1 = fetch('role.json').then(res => {
  console.log(1)
})

let p2 = fetch('login').then( async res => {
  await p1;
  console.log(2);
})

let p3 = fetch('user.json').then(async res => {
  await p2;
  console.log(3);
});

//方法2
async function ajax () {
  let p1 = fetch('role.json');
  let p2 = fetch('login');
  let p3 = fetch ('user.json');
  console.log(await p1);
  console.log(await p2);
  console.log(await p3);
}

//方法3
let urls = ['role.json','login','user.json'];
async function loginOrder (urls) {
  const myPromises = urls.map ( async url => {
    return await fetch(url);
  })

  for (const mypromise of myPromises) {
    console.log(await mypromise)
  }
}




//要链式执行可以用 reduce 把 promise 串起来。
var files = [1,2,3,4,5];
var initialPromise = Promise.resolve([]); //一开始要为[]
var detalWithItem = item => {
  return new Promise((resolve,reject) => {
    setTimeout(() => resolve(item),1000);
  })
}
var chainedPromise = files.reduce((pre,item) => {
  return pre.then(data => {
    return detalWithItem(item)
          .then (dealedItem => {
            data.push(dealedItem);
            return data; //注意要return data
          })
  })
},initialPromise);
chainedPromise.then(data => console.log(data));



//要链式执行可以async / await
var files = [1,2,3,4,5];

var detalWithItem = item => new Promise((resolve,reject) => {
  setTimeout(() => {
    return resolve(item);
  }, 1000);
});
var data = []
async function myResult () {
  try {
    for (var i = 0; i < files.length; i++) {
      data.push(await detalWithItem(files[i]));
    }
  } catch (e) {
    console.log(e)
  }
}

//若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，
//若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。
//另外，如果 await 操作符后的表达式的值不是一个 Promise，则返回该值本身。


var p1 = new Promise((resolve,reject) => {
  setTimeout(() => {
      resolve(1);
  }, 1);
})

var p2 = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve(2);
  }, 200);
})

var p3 = new Promise((resolve,reject) => {
  //当promise捕获到error 的时候，代码吃掉这个异常，返回resolve，约定特殊格式表示这个调用成功了
  setTimeout (() => {
    try {
      throw new Error('Error')
    } catch (error) {
      resolve('error')
    }
  },100)
})

Promise.all[p1,p2,p3].then((results) => {
  console.log(results);
}).catch(r => {
  console.log('error',r)
})

var p4 = new Promise((resolve,reject) => {
  setTimeout(( ) => {
    reject('error');
  },300)
})


async function ayancParallel () {
   let results = [];
   var promises = [p1,p2,p4];
   for (let promise of promises) {
     try {
       let temp = await promise;
       results.push(temp)
     } catch (error) {
       results.push('error');
     }
   }
   return results;
}

//用async实现并发
//继发
let foo = await p1;
let bar = await p2;

//并发
let [foo,bar] = Promise.all([p1,p2]);

let fooPromise = p1;
let barPromise = p2;
let foo = await fooPromise;
let bar = await barPromise; //p1 p2同时触发


//一组异步操作，需要按照顺序完成。比如，依次远程读取一组 URL，然后按照读取的顺序输出结果。
//Promise实现

function logInOrder (urls) {
  const textPromises = urls.map ( url => {
    return fetch(url).then((response) => response.text())
  })
  textPromises.reduce((chain,textPromise) => {
    return chain.then(() => textPromise).then(text => console.log(text));
  })
}

async function logInOrder (urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text()); //继发
  }
}

//并发发出远程请求。
async function logInOrders (urls)  {
  const textPromises = urls.map(async url => {//并发
    const response = await fetch(url);
    return response.text();
  })
  //虽然map方法的参数是async函数，但它是并发执行的，因为只有async函数内部是继发执行，外部不受影响。
  //按次序输出
  for (const textPromise of textPromises) {
    //后面的for..of循环内部使用了await，因此实现了按顺序输出。
    console.log(await textPromise);
  }
}
