<template>
  <div ref="list" :style = "{height}" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div ref="phantom" class="infinite-list-phantom"></div>
    <div ref="content" class = "infinite-list">
      <div 
        class="infinite-list-item"
        ref="items"
        :id="item._index"
        :key="item._index"
        v-for="item in visibleData"
      >
        <slot ref="slot" :item="item.item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      //所有列表数据
      listData: {
        type: Array,
        default: () => []
      },
      //预估高度
      estimatedItemSize: {
        type: Number,
        required: true
      },
      //容器高度 100px or 50vh
      height: {
        type: String,
        default: "100%"
      }
    },
    computed:{
      _listData() {
        return this.listData.map((item,index) => {
          return {
            _index: `_${index}`,
            item
          };
        });
      },
      visibleCount() {
        return Math.ceil(this.screenHeight / this.estimatedItemSize)
      }
    },
    created() {
      this.initPositions();
    },
    mounted() {
      this.screenHeight = this.$el.clientHeight;
      this.start = 0;
      this.end = this.start + this.visibleCount;
    },
    updataed() {
      this.$nextTick(function() {
        if (!this.$refs.items || !this.$refs.items.length) {
          return;
        }
        this.updateItemSize();
        let height = this.positions[this.positions.length -1].bottom;
        this.$refs.phantom.style.height = height + 'px';
        this.startOffSet();
      })
    },
    data() {
      return {
        screenHeight:0,
        start:0,
        end:0
      };
    },
    methods() {
      initPositions() {
        this.positions = this.listData.map((d,index) => ({
          index,
          height:this.estimatedItemSize,
          top:index * this.estimatedItemSize,
          bottom: (index+1) * this.estimatedItemSize
        }));
      },
      getStartIndex (scrollTop = 0) {
        return this.binarySearch (this.positions,scrollTop);
      },
      binarySearch (list,value) {
        let start = 0, end = list.length - 1, tempIndex = null;
        while(start <= end) {
          let midIndex = parseInt((start + end) /2);
          let midValue = list[midIndex].bottom;
          if (midValue == value) {
            return midIndex + 1;
          } else if (midValue < value) {
            start = midIndex + 1;
          } else if (midValue > value) {
            if (tempIndex == null || tempIndex > midIndex ) {
              tempIndex = midIndex;
            }
            end = end - 1;
          }
        }
        return tempIndex
      },
      updateItemSize() {
        let nodes = this.$refs.items;
        nodes.forEach((node) => {
          let rect = node.getBoundingClientRect();
          let height = rect.height;
          let index = +node.id.slice(1);
          let oldHeight = this.positions[index].height;
          let dValue = oldHeight - height;
          if (dValue) {
            this.positions[index].bottom = this.positions[index].bottom - dValue;
            this.positions[index].height = height;
            for (let k = index + 1; k < this.positions.length; k++) {
              this.positions[k].top = this.positions[k - 1].bottom;
              this.positions[k].bottom = this.positions[k].bottom - dValue;
            }
          }
        })
      },
      setStartOffset() {
        let startOffSet = 
          this.start >=1 ? this.positions[this.start-1].bottom : 0;
        this.$refs.content.style.tranform = `translate3d(0,${startOffset}px,0)`;
      },
      scrollEvent () {
        //当前滚动位置
        let scrollTop = this.$refs.list.scrollTop;
        //此时的开始索引
        this.start = this.getStartIndex(scrollTop);
        //结束索引
        this.end = this.start + this.visibleCount;
        //此时的偏移
        this.setStartOffset();
      }
    }
  }
</script>