{/* <style>
  .div_banner {
    width: 100%;
    height: atuo;
    padding: 0;
    display: -webkit-flex;
    display: felx;
    algin-items: center; //垂直居中
    background-repeat: no-repeat;
    background-size: 100%;
  }
  .btn_shift {
    width: 40px;
    height: 80px;
    margin: 0;
    padding: 0;
    display: inline-block;
    text-align: center;
    visibility： hidden;
    opacity: 0.7;
    -webkit-transition-duration: 0.5s;
    transition-duration: 0.5s; //动画
    cursor: pointer;
    z-index: 999
  }
  .img_banner {
    width 100%;
    height: 100%;
    max-height: 600px;
    flex: 1;
    margin-left: -40px; //左右两边有按钮
    margin-right: -40px;
    cursor: pointer;
  }
</style> */}
<div class="div_banner" onmouseover="bannerOver()" onmouseout="bannerOut()"> 
  <button class="btn_shift" name="btn_shift" onclick="clickPrev()">&lt;</button> 
  <img class="img_banner" id="banner" src="banner_internship.jpeg" width="1000" height="600" /> 
  <button class="btn_shift" name="btn_shift" onclick="clickNext()">&gt;</button> 
</div>

var timeout = 5000;
var bannerIndex = 1000, bannerInterval;
var bannerJson = [
{
  "imgUrl": "banner_internship.jpeg",
    "desUrl": "https://frogfans.github.io/blog.html?blogId=18"
},
{
    "imgUrl": "banner_recruit.jpg",
    "desUrl": "https://frogfans.github.io/blog.html?blogId=18"
}
]

function interval () {
  if (bannerIndex > 1000) bannerIndex -= 1000;
  if (bannerIndex < 0) bannerIndex += 1000;
  var banner = document.getElementById('banner');
  banner.src = bannerJson[bannerIndex % bannerJson.length].imgUrl;
  banner.setAttribute('desUrl',bannerJson[bannerIndex % bannerJson.length].desUrl);
  banner.onclick = function() {
    window.open(this.getAttribute('desUrl'));
  }
  bannerIndex++;
}

function startBanner () {
  interval();
  bannerInterval = setInterval(interval,timeout);
}

function bannerOver () {
  var btn = document.getElementsByName('btn_shift');
  for (var i = 0; i< btn.length;i++) {
    btn[i].style.visibility= "visible";
  }
}

function bannerOut () {
  var btn = document.getElementsByName('btn_shift');
  for (let i = 0 ; i < btn.length; i++) {
    btn[i].style.visibility = 'visibile';
  }
}

function clickPrev () {
  clearInterval(bannerInterval);
  bannerIndex -=2;
  //执行startBanner index会立刻++
  startBanner();
}

function clickNext() {
  clearInterval(bannerInterval);
  startBanner()
}