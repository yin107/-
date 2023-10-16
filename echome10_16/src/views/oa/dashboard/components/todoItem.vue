<template>
  <div>
    <el-col :span="8">
      <el-card shadow="hover" class="contlist">
        <p class="title"><slot name="title"></slot></p>
        <p class="add"><slot name="add"></slot></p>
        <p class="result">
          <span v-if="!itemdata">已处理完毕</span
          ><span v-else>{{ itemdata }}项待处理</span>
        </p>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "todoItem",
  props: ["itemdata"],
};
</script>

<style lang="less">
.contlist {
  padding: 0px;
  height: auto;
  box-sizing: border-box;
}
.title {
  text-align: left;
  font-size: 18px;
}
.add,
.result {
  font-size: 15px;
  color: grey;
  text-align: left;
}
</style>
