<template>
	<!-- 对全屏按钮进行了封装 -->
  <!-- 全屏按钮 -->
  <span class="right-full" @click="handleFullScreen">
    <i class="el-icon-full-screen"></i>
  </span>
</template>

<script>
import { mixins } from "@/minxin";
export default {
  name: "screenFullVue",
  mixins: [mixins],
  data() {
    return {
      isFullScreen: false,
    };
  },
  mounted() {
    this.watchFull();
  },
  methods: {
    watchFull() {
      void [
        "fullscreenchange",
        "webkitfullscreenchange",
        "mozfullscreenchange",
      ].forEach((item) => {
        window.addEventListener(item, () => {
          this.isFullScreen = this.checkFull();
        });
      });
    },
    handleFullScreen() {
      this.isFullScreen ? this.screenfullOut() : this.screenfullEnter();
    },
  },
};
</script>

<style></style>
