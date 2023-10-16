<template>
  <div>
    全部文章
    <div id="virtual-list">
      <!-- 虚拟列表的内容 -->
      <ul id="list-content">
        <!-- 列表项 -->
        <li v-for="item in articles" :key="item.name">Item 1</li>
        <!-- 更多列表项 -->
      </ul>
      <!-- 加载更多按钮 -->
    </div>
    <button id="load-more">加载更多</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articles: [{ name: "1" }, { name: "2" }, { name: "3" }],
    };
  },
  mounted() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    console.log(`可视区域宽度：${viewportWidth}px`);
    console.log(`可视区域高度：${viewportHeight}px`);
    const loadMoreButton = document.getElementById("load-more");
    const options = {
      threshold: 0,
      root: document.querySelector("#virtual-list"),
    };
    let _this = this;
    const callback = function () {
      console.log("加载更多");
      loadMoreButton.style.display = "block";
      console.log(_this.articles);
      _this.articles.push({ name: "1" });
    };
    const observer = new IntersectionObserver(callback);
    observer.observe(loadMoreButton, options);
  },
};
</script>

<style scoped>
ul li {
  height: 500px;
  background-color: red;
  margin-bottom: 10px;
}
#load-more {
  display: none;
}
/* #virtual-list{
	height:1500px;
	border: 15px solid grey;
} */
</style>
