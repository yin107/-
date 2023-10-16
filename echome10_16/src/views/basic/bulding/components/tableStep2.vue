<template>
  <div class="box-table">
    <slot name="title"></slot>
    <div class="content-table">
      <el-table :data="tableData">
        <el-table-column
          v-for="item of tableHead"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
	<div slot-scope="scope" v-if="item.prop==='detail'">
	{{ detailInfo(scope.row) }}
	</div>
	<div v-else slot-scope="scope">
		{{scope.row[item.prop]}}
	</div>
	</el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mixins } from "@/minxin/index.js";
export default {
  name: "tableVue",
  props: ["tableData", "tableHead"],
  mixins:[mixins],
  data() {
    return {};
  },
  computed: {
   
  },
  methods:{

  },
  mounted() {},
};
</script>

<style scoped>
.box-table {
  width: 80%;
  margin: 20px auto;
}
.content-table {
  border: 1px solid olivedrab;
  width: 100%;
  height: 400px;
  overflow: auto;
}
</style>
