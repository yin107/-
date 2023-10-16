<template>
  <div>
    <el-menu
      :router="true"
      :default-active="$route.path"
      style="height: 100vh"
      :background-color="$store.state.sliderbgc === 1 ? '#fff' : '#545c64'"
    >
      <h5>物业管理</h5>
      <!-- 导航栏区域 -->
      <!-- 没有子路由 -->
      <div v-for="item of noChidrenRoute()" :key="item.meta.title">
        <el-menu-item
          :index="item.path"
          v-if="item.meta.nav"
          :class="[item.path == $route.path ? 'bgclolr' : '']"
          style="text-align: left"
        >
          <i :class="item.meta.icon"></i>
          {{ item.meta.title }}
        </el-menu-item>
      </div>

      <!-- 有子路由 -->
      <el-submenu
        v-for="item of hasChildrenRoute()"
        :key="item.meta.title"
        :index="item.path"
      >
        <template slot="title">
          <span><i :class="item.meta.icon"></i>{{ item.meta.title }}</span>
        </template>
        <template v-for="chilItem of item.children">
          <el-menu-item
            v-bind:key="chilItem.meta.title"
            :index="chilItem.path"
            v-if="chilItem.meta.nav"
            :class="[chilItem.path == $route.path ? 'bgclolr' : '']"
            ><i :class="chilItem.meta.icon"></i
            >{{ chilItem.meta.title }}</el-menu-item
          >
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { basicRouter } from "@/views/basic/basicRouter";
import { iotRouter } from "@/views/iot/iotRouter";
import { userCenterRouter } from "@/views/center/centerCenterRouter";
import { oaRouter } from "@/views/oa/oaRouter";
export default {
  name: "navAside",
  mounted() {},
  data() {
    return {
      total: [basicRouter, iotRouter, userCenterRouter, oaRouter],
    };
  },
  computed: {
    routes() {
      let res1 = "/" + this.$route.path.split("/")[1]; //根据当前路由是/iot还是/basic来筛选导航栏中的选项应该是哪一个
      let res2 = this.total.filter((item) => {
        return item.path == res1;
      });
      //不能直接return res2[0].children 一开始刷新页面的时候是res2还是空的
      return res2.length ? res2[0].children : [];
    },
  },
  methods: {
    hasChildrenRoute() {
      //有子路由
      return this.routes.filter((item) => {
        return item.children;
      });
    },
    noChidrenRoute() {
      //没有子路由
      return this.routes.filter((item) => {
        return !item.children;
      });
    },
  },
};
</script>

<style scope>
.bgclolr {
  background-color: skyblue !important;
}
.el-submenu__title {
  text-align: left;
}
</style>
