<template>
  <div>
    <bread-crumb>
      <span
        slot="goback"
        style="float: right"
        @click="$router.go(-1)"
        class="doaction"
      >
        返回</span
      >
    </bread-crumb>
	<el-card style="margin-top:20px">
	<el-row>
		<el-col :span="8">小区名称：默认未处理</el-col>
		<el-col :span="8">房产详情：{{  buildingData.building?`${buildingData.building}栋`:''}}{{ buildingData.unit?`${buildingData.unit}单元`:"" }}{{ buildingData.number }}</el-col>
		<el-col :span="8">房产类型：<el-tag :style="{backgroundColor:buildingType(buildingData.type).color}">{{ buildingType(buildingData.type).value }}</el-tag></el-col>
	</el-row>
	</el-card>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
import { mixins } from "@/minxin";
export default {
  name: "buildingDetail",
  components: { breadCrumb },
  mixins: [mixins],
  data() {
    return {
      buildingData: {},
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$request({
        url: "/building/detail",
        method: "post",
        data: {
          community_id: this.community_id,
          id: this.$route.query.id,
        },
      }).then((res) => {
        this.buildingData = res.data.data;
      });
    },
  },
};
</script>

<style scoped>
.el-row{
	display: flex;
    justify-content: flex-start;
    text-align: left;
    margin-top: 10px;
}
</style>
