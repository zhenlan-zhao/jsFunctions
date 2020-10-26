//判断是长按还是点击还是移动
{/* <div v-if="total != 0" class="project-details" 
    @touchstart.prevent="goTouchstart(item)"
    @touchmove="goTouchmove(item)" 
    @touchend="goTouchend(item)" >
</div> */}
const vue = {
  data () {
    return {
      timeoutEvent : 0
    }
  },
  methods : {
    goTouchstart () {
      clearTimeout (this.timeOutEvent);
      this.timeOutEvent = 0;
      this.timeOutEvent = setTimeout(() => {
        this.handleHold();
        this.timeOutEvent = 0;
      },1000)
    },
    goTouchend(item){
      clearTimeout(this.timeOutEvent);
      if (this.timeOutEvent) {//在1s内就松开了，不触发长按
        //这里写要执行的内容（例如onclick事件）
        this.selectProject(item)
      }
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    goTouchmove (item) {
      clearTimeout(this.timeOutEvent);
      this.timeOutEvent = 0; //放置触发onclick事件
    }
  }
  
}
