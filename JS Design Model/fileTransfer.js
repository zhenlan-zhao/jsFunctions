//file -> Dataurl
//Data URL 由前缀(data:)，MIME类型，非文本可选的base64标记，数据本身组成;
// data:<mediatype>,<data>
//data:image/png;base64,......(data)
function file2Dataurl (file,callback) {
  var reader = new FileReader();
  //FileReader的实例不仅可以处理file，还可以处理blob对象数据
  //file是特殊的blob
  reader.readAsDataURL(file);
  reader.onload = function () {
    callback(reader.result); //callback的参数是dataurl
  }
}

// file -> image
//如果用户上传的图片想用img标签显示出来，除了可以用file2Dataurl转换成base64字符串作为图片url
//还可以直接用URL对象，引用保存在File和Blob中的URL
function file2Image (file,callback) {
  var image = new Image();
  var URL = window.webkitURL || window.URL;
  if (URL) {
    var url = URL.createObjectURL(file);
    image.onload = function () {
      callback(image);
      URL.revokeObjectURL(url); //方法在URL对象上
    };
    image.src = url;
  } else {
    file2Dataurl(file,function(dataurl) {
      image.onload = function() {
        callback(image);
      }
      image.src = dataurl;
    })
  }
}

//url -> image
//通过图片链接据获取图片Image对象，由于图片加载时异步的，因此放到回调函数获取获取到的Imgae对象
function url2Image (url,callback) {
  var image = new Image();
  image.src = url;
  image.onload = function() {
    callback(image);
  }
}

//image -> canvas
function image2Canvas (image) {
  var canvas = document.createElement('canvas');
  var contex = canvas.getContext('2d');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  contex.drawImage(image,0,0,canvas.width,canvas.height);
  return canvas;
}

//canvas -> dataurl
//canvas 的toDataURL(type,encoderOptions)方法，返回一个包含图片展示的data url，并且可以指定输出格式和质量
function canvas2DataUrl (canvas,quality,type) {
  return canvas.toDataURL(type || 'image/jpeg',quality||0.8);
}

//dataurl -> image
function dataurl2Image (dataurl,callback) {
  var image = new Image();
  image.onload = function() {
    callback(image);
  }
  image.src = dataurl;
}

//dataurl -> blob
function dataurl2Blob (dataurl,type) {
  var data = data.split(',')[1];
  var mimePattern = /^data:(.*)(;base64)?,/;
  var mime = dataurl.match(mimePattern)[1];
  var binStr = atob(data);
  //atob用于对经过base64编码的字符串进行解码
  var arr = new Uint8Array(len);
  for (var i =0;i<len;i++) {
    //再把base64解码后的对象转化成unicode编码，存储在Unit8Array中
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr],{type:type || mime});
}

// canvas -> blob
function canvas2Blob (canvas,callback,quality,type) {
  canvas.toBlob(function(blob) {
    callback(blob)
  }, type || 'imgge/jpeg', quality || 0.8);
}

//blob -> dataUrl
function blob2DataUrl (blob,callback) {
  file2Dataurl
}
//blob -> image 
function blob2Image (blob,callback) {
  file2Image(blob,callback)
}


//简易图片压缩
(function (win) {
  var REG_IMAGE_TYPE = /^image\//;
  var util = {};
  var defaultOptions = {
    file: null,
    quality: 0.8
  }
  var isFunc = function (fn) {
    return typeof fn === 'function';
  }
  var isImageType = function(value) {
    return REG_IMAGE_TYPE.test(value);
  }
  /**
   * 简易图片压缩构造函数
   * @param {Object} options 相关参数
   */
  function ImageConpressor (options) {
    options = Object.assign({},defaultOptions,options);
    this.options = options;
    this.file = options.file;
    this.init();
  }

  var _proto = ImageConpressor.prototype;
  win.ImageConpressor = ImageConpressor;

  _proto.init = function init() {
    var _this = this;
    var file = _this.file, options = _this.options;
    if (!file || !isImageType(file.type)) {
      console.error('请上传图片');
      return;
    }
    if (!isImageType(options.mimeType)) {
      options.mimeType = file.type;
    }
    util.file2Image(file, function(img) {
      var canvas = util.image2Canvas(img);
      file.width = img.naturalWidth;
      file.height = image.naturalHeight;
      _this.beforeCompress(file,canvas);

      util.canvas2Blob(canvas,function(blob) {
        blob.width = canvas.width;
        blob.height = canvas.height;
        options.success && options.success(blob);
      },options.mimeType,options.quality);
    })
  }

   /**
   * 压缩之前，读取图片之后钩子函数
   */
  _proto.beforeCompress = function beforeCompress () {
    if (isFunc(this.options.beforeCompress)) {
      this.options.beforeCompress(this.file);
    }
  }
  for (key in util) {
    if (util.hasOwnProperty(key)) {
      ImageConpressor[key] = util[key];
    }
  }
})(window)

//使用
var fileElment = document.getElementById('file');
fileElment.addEventListener('change',function() {
  file = this.files[0];
  var options = {
    file: file,
    quality: 0.6,
    mimeType: 'image/jpeg',
    beforeCompress(result) {
      console.log('压缩之前图片尺寸大小: ', result.size)
      console.log('mime类型',result.type);
      // 将上传图片在页面预览
      ImageConpressor.file2Dataurl(result,function(url) {
        document.getElementById('origin').src = url;
      })
    },
    success(result) {
      console.log('压缩之后图片尺寸大小: ', result.size)
      console.log('mime类型',result.type);
      console.log('压缩率：', (result.size / file.size * 100).toFixed(2) + '%');
      // 生成压缩后图片在页面展示
      ImageConpressor.file2Dataurl(result,function(url) {
        document.getElementById('output').src = url;
      })
      ImageConpressor.upload('/upload.png',result)
    } 
  }
})