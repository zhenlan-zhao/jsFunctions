(function (exporter) {
  function isFunc (fn) {return typeof fn === 'function'};
  function str (s) {
    if (s==null) return null;
    s=s.repace(/^\s+|\s$/g,"");
    return s.length > 0 ? s.toLowerCase() : null;
  }

  function Handler() {
    var fns = [], datas = [];
    this.add = function (fn,data) {
      fns.push(fn);
      datas.push(data);
    }
    this.remove = function (fn) {
      var i = fns.indexOf(fn);
      if (i>=0) {
        fns.splice(i,1);
        datas.splice(i,1);
      }
    };
    this.invoke = function (sender, data) {
      fns.forEach( (fn,i) => {
        try {
          fn(sender,data,datas[i]);
        } catch (error) {
            console.error(error);
        }
      })
    }
  }

  function EventBus () {
    var handlers = {};
    this.on = function (eventName, fn, data) { //参数包括事件处理函数以及数据
      eventName = str(eventName);
      if (eventName == null) {
        throw new Error ('事件名无效')
      }
      if (!isFunc(fn)) {
        throw new Error('必须提供事件函数')
      }
      var handler = handlers[eventName];
      if (handler == null) {
        handler = new Handler();
        handlers[eventName] = handler
      };
      handler.add(fn,data);
    }

    this.off = function (eventName, fn) {
      eventName = str(eventName);
      if (eventName == null) return;
      var handler = handlers[eventName];
      if (handler !== null) {
        if (!fn) {
          delete handlers[eventName];
        } else {
          handler.remove(fn)
        }
      }
    }

    this.fire = this.emit = this.trigger = 
      function (eventName,sender,data) {
        eventName = str(eventName);
        if (eventName == null) return;
        var handler = handlers[eventName];
        if (handler != null) {
          handler.invoke(sender,data)
        }
      }
    var bus = this;
    this.bindTo = function (obj) {
      if (obj == null) throw new Error('obj is null')
      for (const key in bus) {
        if (bus.hasOwnProperty(key) && key !== 'bindto') {
          obj[key] = bus[key];
        }
      }
    }
  }
  var instance = new EventBus();
  instance.bindTo(eventBus);
  exporter(eventBus)
})(c => window.eventBus = c)