<!-- 对页签功能进行封装 -->
<template>
   <div class="tags">
      <el-tag
        v-for="(item, index) in taglist"
        :key="item.title"
        style="margin-right: 10px"
        closable
        @close="closetag(item, index)"
        :type="item.path === $route.path ? 'success' : 'info'"
        @click="togo(item)"
        >{{ item.title }}</el-tag
      >
    </div>
</template>

<script>
export default {
name:'tagsVue',
mounted(){
	this.inittag();
},
computed:{
	taglist() {
      return this.$store.state.tags.taglist;
    }
},
methods:{
	inittag() {
      let cur = {};
      cur.path = this.$route.path;
      cur.title = this.$route.meta.title;
      this.$store.commit("tags/initag", cur);
    },
    closetag(item, index) {
      //删除不tag不是当前的页面,那么就直接删除
      if (item.path != this.$route.path) {
        this.$store.commit("tags/deleteTag", item);
      } else {
        if (this.taglist.length > 1) {
          //删除的tag就是当前的页面
          //如果是最后一个元素
          if (index + 1 === this.taglist.length) {
            //删除tag，并且把路由放到前面一个
            this.$store.commit("tags/deleteTag", item);
            this.$router.push({ path: this.taglist[index - 1].path });
          } else {
            //删除这个标签，应该往后挪动
            this.$store.commit("tags/deleteTag", item);
            this.$router.push({ path: this.taglist[index].path });
          }
        } else {
          //如果是最后一个tag,提示不能删除了
          this.notifyError("这是最后一个了，不能删除");
        }
      }
    },
    togo(item) {
      //点击header上的大板块，修改路由
      if (this.$route.path != item.path) {
        this.$router.push({ path: item.path });
      }
    },

},
watch: {
    $route: {
      handler() {
        let cur = {};
        cur.path = this.$route.path;
        cur.title = this.$route.meta.title;
        this.$store.commit("tags/addtag", cur);
      },
    },
  },
}
</script>

<style scoped>
.tags {
  height: 40px;
  margin-top: 0px;
  text-align: left;
  line-height: 50px;
  display: flex;
}
</style>