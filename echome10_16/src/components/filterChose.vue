<template>
  <div>
    <div class="item" v-for="item in filterData" :key="item.title">
      <span>{{ item.title }}</span>
      <el-radio-group
        v-model="item.filters[item.value]"
        v-if="item.type === 'radio'"
      >
        <div
          v-for="itemchi in item.radiod"
          :key="itemchi.label"
          style="display: inline-block"
        >
          <el-radio-button :label="itemchi.label">{{
            itemchi.title
          }}</el-radio-button>
        </div>
      </el-radio-group>
      <el-input
        v-if="item.type === 'input'"
        :placeholder="item.placeholder"
        v-model="item.filters[item.value]"
        style="width: 280px"
      >
        <el-button slot="append">检索</el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "filterChose",
  props:['filterData'],
  data() {
    return {
    
    };
  },
};
</script>

<style scoped>
.item {
  height: 50px;
  padding: 0px;
  line-height: 40px;
  height: 40px;
  padding-left: 20px;
  margin-bottom: 20px;
  text-align: left;
}
.item span {
  margin-right: 20px;
}
</style>
