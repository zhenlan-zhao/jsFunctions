// 红灯2s,黄灯1s,绿灯3s

// setTimeout实现
function changeColor(color){
  console.log(`${new Date().toLocaleString()} ,${color}`);
}
function main1(){
  changeColor("red");
  setTimeout(()=>{
    changeColor("yellow");
    setTimeout(()=>{
      changeColor("green");
      setTimeout(main,3000)
    },1000)
  },2000)
}
// main1()

// Promise实现
function sleep(duration){
  return new Promise(resolve=>{
    setTimeout(resolve,duration)
  })
}
function changeColor2(duration,color){
  return new Promise(resolve=>{
    console.log(`traffic light, ${new Date().toLocaleString()},${color}`);
    sleep(duration).then(resolve);
  })
}
function main2(){
  return new Promise(resolve=>{
    changeColor2(2000,"red").then(()=>{
      changeColor2(1000,"yellow").then(()=>{
        changeColor2(3000,"green").then(()=>{
          main2()
        })
      })
    })
  })
}
// main2()

// async await实现：
function sleep3(duration){
  return new Promise(resolve=>{
    setTimeout(resolve,duration)
  })
};

async function changeColor3(color,duration){
  console.log("traffic-light",color);
  await sleep3(duration)
}

async function main3(){
  while(true){
    await changeColor3("red",2000);
    await changeColor3("yellow",1000);
    await changeColor3("green",3000);
  }
}
// main3()


function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}

const light = function (timer, cb) {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb();
      resolve()
    },timer)
  }) 
}

const step = function () {
  Promise.resolve().then(() => {
    return light(3000,red)
  }).then(() => {
    return light(2000,green);
  }).then(() => {
    return light(1000,yellow);
  }).then(() => {
    return step()
  })
};

step();


// 封装一个异步加载图片的方法
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = function() {
      console.log("一张图片加载完成");
      resolve(img);
    };
    img.onerror = function() {
    	reject(new Error('Could not load image at' + url));
    };
  });
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
  const data = []; // 存储所有的加载结果
  let p = Promise.resolve();
  const handleUrls = (urls) => { // 这个函数是为了生成3个url为一组的二维数组
    const doubleDim = [];
    const len = Math.ceil(urls.length / limit); // Math.ceil(8 / 3) = 3
    for (let i = 0; i < len; i++) {
      doubleDim.push(urls.slice(i * limit, (i + 1) * limit))
    }
    return doubleDim;
  }
  const ajaxImage = (urlCollect) => { // 将一组字符串url 转换为一个加载图片的数组
    return urlCollect.map(url => handler(url))
  }
  const doubleDim = handleUrls(urls); // 得到3个url为一组的二维数组
  doubleDim.forEach(urlCollect => {
    p = p.then(() => Promise.all(ajaxImage(urlCollect))).then(res => {
      data.push(...res); // 将每次的结果展开，并存储到data中 (res为：[img, img, img])
      return data;
    })
  })
  return p;
}
limitLoad(urls, loadImg, 3).then(res => {
  console.log(res); // 最终得到的是长度为8的img数组: [img, img, img, ...]
  res.forEach(img => {
    document.body.appendChild(img);
  })
});

//既然题目的要求是保证每次并发请求的数量为3，那么我们可以先请求urls中的前面三个(下标为0,1,2)，
// 并且请求的时候使用Promise.race()来同时请求，三个中有一个先完成了(例如下标为1的图片)，
// 我们就把这个当前数组中已经完成的那一项(第1项)换成还没有请求的那一项(urls中下标为3)。
// 直到urls已经遍历完了，然后将最后三个没有完成的请求(也就是状态没有改变的Promise)用Promise.all()来加载它们。

function limitLoad(urls, handler, limit) {
  let sequence = [].concat(urls); // 复制urls
  // 这一步是为了初始化 promises 这个"容器"
  let promises = sequence.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      // 返回下标是为了知道数组中是哪一项最先完成
      return index;
    });
  });
  // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
  return sequence
    .reduce((pCollect, url) => {
      return pCollect
        .then(() => {
          return Promise.race(promises); // 返回已经完成的下标
        })
        .then(fastestIndex => { // 获取到已经完成的下标
        	// 将"容器"内已经完成的那一项替换
          promises[fastestIndex] = handler(url).then(
            () => {
              return fastestIndex; // 要继续将这个下标返回，以便下一次变量
            }
          );
        })
        .catch(err => {
          console.error(err);
        });
    }, Promise.resolve()) // 初始化传入
    .then(() => { // 最后三个用.all来调用
      return Promise.all(promises);
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





