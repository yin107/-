<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item v-for="item of NameList" :key="item.meta.title">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <slot name="goback"></slot>
  </el-card>
</template>

<script>
export default {
  name: "breadCrumb",
  mounted() {},
  computed: {
    NameList() {
      return this.$route.matched;
    },
  },
};
</script>

<style scoped>
.box-card {
  background-color: #fff;
  padding: 0px;
  margin: 0px;
  overflow: auto;
  height: 60px;
}
.bread {
  float: left;
  padding: 0px;
  font-size: 18px;
}
</style>
