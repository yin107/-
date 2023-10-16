<template>
  <div class="pignation">
    <el-pagination
      :page-size="pagesize"
      :total="total"
      :current-page="pagenum"
      @size-change="handleSizeChange"
      layout="total, prev, pager, next,sizes, jumper"
      @current-change="handlechangenum"
      :page-sizes="pagesizes"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: ["pagenum", "pagesize", "total",'pagesizes'],
  methods: {
    //当页面数据条数或者当前页改变的时候也要向后端发送请求
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handlechangenum(val) {
      this.$emit("handlechangenum", val);
    },
  },
};
</script>

<style scoped>
.pignation {
  height: 30px;
  margin-top: 30px;
  text-align: right;
}
</style>
