<template> 
  <div ref="list" class="infinite-list-container" v-on:scroller="scrollEvent($event)">
    <div class="infinite-list-phantom" v-bind:style="{height: listHeight + 'px'}"></div>
    <div class="infinite-list" v-bind:style="{transform: genTransform}">
      <div ref="items" class="infinite-list-item" v-for="item in visibleData" v-bind:key="item.id" 
          v-bind:style="{height:itemSize + 'px',lineHeight: itemSize + 'px'}">
      {{item.value}}
      </div>    
    </div>
  </div>
</template>

<script>
export default {
  name : 'VirtualList',
  props: {
    listData : {
      type: Array,
      default: ()=>[];
    },
    itemSize : {
      type: Number,
      default: 200
    }
  },
  computed: {
    listHeight() {
      return this.listData.length * this.itemSize;
    },
    visibleCount() {
      return Math.ceil(this.screenHeight / this.itemSize);
    },
    getTransform() {
      return `translate3d(0,${this.startOffset}px,0)`;
    },
    visibleData() {
      return this.listData.slice(this.start,Math.min(this.end,this.listData.length));
    }
  },
  mounted() {
    this.screenHeight = this.$el.clientHeight;
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  data() {
    return {
      screenHeight:0,
      startOffset:0,
      start:0,
      end: null
    };
  }
  methods: {
    scrollEvent() {
      //当前滚动位置
      let scrollTop = this.$refs.list.scrollTop;
      //此时的开始索引
      this.start = Math.floor(scrollTop / this.itemSize);
      //结束索引
      this.end = this.start + this.visibleCount;
      //偏移量
      this.startOffset = scrollTop - (scrollTop % this.itemSize); //如果scollTop > this.item
    }
  }
}
</script>

