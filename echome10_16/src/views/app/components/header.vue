<template>
  <div>
    <div class="header">
      <div class="header-left">
        <span
          class="header-list"
          v-for="item of Lists"
          :key="item.meta.title"
          @click="togo(item)"
          :class="{ fontcolor: item.path === '/' + $route.path.split('/')[1] }"
          >{{ item.meta.title }}</span
        >
      </div>
      <div class="header-right">
        <screen-full-vue></screen-full-vue>
        <!-- 小区位置 -->
        <span class="right-location">
          <i class="el-icon-location"></i>
          {{ defaultCommunityName }}小区
        </span>
        <!-- 个人信息 -->
        <span class="right-mess">
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span>{{ userfo.real_name }}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="gotocenter">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="loginOut"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <!-- 更多 -->
        <span class="right-more">
          <i class="el-icon-more" @click="drawerClick"></i>
        </span>
      </div>
    </div>
    <tags-vue></tags-vue>
	<!-- 这个为什么不能实现了呢 -->
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="400px"
      class="drawer"
    >
      <!-- <el-divider>主题风格设置</el-divider> -->
      <div class="list1-div">
        <div :class="{ circle: $store.state.sliderbgc === 2 }">
          <img
            src="@/assets/sider-theme-dark.svg"
            alt=""
            @click="$store.commit('convertbgc', 2)"
          />
        </div>
        <div :class="{ circle: $store.state.sliderbgc === 1 }">
          <img
            src="@/assets/sider-theme-light.svg"
            alt=""
            @click="$store.commit('convertbgc', 1)"
          />
        </div>
      </div>
      <div class="list2-div">
        <div :class="{ circle: $store.state.headbgc === 1 }">
          <img
            src="@/assets/sider-theme-dark.svg"
            alt=""
            @click="$store.commit('convertheadbgc', 1)"
          />
        </div>
        <div :class="{ circle: $store.state.headbgc === 2 }">
          <img
            src="@/assets/header-theme-dark.svg"
            alt=""
            @click="$store.commit('convertheadbgc', 2)"
          />
        </div>
        <div :class="{ circle: $store.state.headbgc === 3 }">
          <img
            src="@/assets/header-theme-primary.svg"
            alt=""
            @click="$store.commit('convertheadbgc', 3)"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { basicRouter } from "@/views/basic/basicRouter";
import { iotRouter } from "@/views/iot/iotRouter";
import { oaRouter } from "@/views/oa/oaRouter";
import tagsVue from "components/tagsVue";
import screenFullVue from "@/components/screenFullVue.vue";
export default {
  name: "headeVue",
  components: { tagsVue, screenFullVue },
  props: ["userInfo", "postInfo"],
  data() {
    return {
      Lists: [basicRouter, iotRouter, oaRouter],
      drawer: false,
    };
  },

  computed: {
    userfo() {
      //当我刷新的时候返回的是一个observer对象
      return JSON.parse(JSON.stringify(this.$store.getters.getUserInfo));
    },
    postfo() {
      return JSON.parse(JSON.stringify(this.$store.getters.getPostInfo));
    },
    //小区名称
    defaultCommunityName() {
      if (this.postfo.community_list != undefined) {
        return this.postfo.community_list[0].name;
      } else {
        return "...";
      }
    },
  },
  methods: {
	drawerClick(){
		console.log('drawer')
		this.drawer=true
	},
    togo(item) {
      //点击header上的大板块，修改路由
      if (this.$route.path != item.path) {
        this.$router.push({ path: item.path });
      }
    },

    handleCommand(command) {
      //退出登录
      if (command === "loginOut") {
        this.$confirm(
          "您确定退出登录当前账户吗?个人设置将会保存",
          "退出登录确认",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.$store.commit("removeToken");
            //退出登录
            this.$router.replace({ name: "login" });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消退出登录",
            });
          });
      }
      // 个人中心
      if (command === "gotocenter") {
        this.$router.push({ path: "/user/zone" });
      }
    },
  },
};
</script>

<style lang="less">
.header {
  display: flex;
  justify-content: space-between;
  .header-list {
    display: inline-block;
    margin-right: 20px;
  }
  .fontcolor {
    color: rgb(40, 170, 170);
  }
  .header-right {
    width: 300px;
    display: flex;
    justify-content: space-around;
    height: 100%;
  }
  .list1-div,
  .list2-div {
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
    div {
      margin-right: 10px;
    }
  }

  .circle {
    font-size: 15px;
    position: relative;
    top: 0px;
    &::after {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      top: 50px;
      left: 25px;
      border-radius: 5px;
      background-color: rgb(19, 15, 223);
    }
  }
}
</style>
<style>
.el-drawer__header {
  margin-bottom: 0px;
  padding: 0px;
}
.el-divider__text {
  font-size: 20px;
}
</style>
