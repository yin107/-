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
      ></bread-crumb
    >

    <el-card style="margin-top: 20px">
      <!-- 步骤 -->
      <el-steps :active="step" align-center>
        <el-step title="上传数据" description="上传房产数据"></el-step>
        <el-step title="数据验证" description="验证数据是否正确"></el-step>
        <el-step title="导入成功" description="房产数据导入成功"></el-step>
      </el-steps>
      <div v-if="step == 1">
        <file-upload @cando="candoNext = false"></file-upload>
        <el-button type="primary" :disabled="candoNext" @click="getTotalData"
          >下一步</el-button
        >
      </div>

      <div v-if="step == 2">
        <table-step2 :tableData="rightData" :tableHead="tableHead2">
          <p slot="title" style="text-align: left">
            可导入数据{{ rightData.length }}条
          </p>
        </table-step2>

        <table-step2 :tableData="errorData" :tableHead="tableHead3">
          <p slot="title" style="text-align: left">
            不可导入数据{{ errorData.length }}条
          </p>
        </table-step2>

        <el-button @click="step--"> 上一步</el-button>
        <el-button type="primary" @click="gotoStep3">下一步</el-button>
      </div>

      <div v-if="step == 3">
        <data-create-suc>
          <div slot="suce-info">数据导入成功</div>
          <div slot="mention-info">本次共导入{{ rightData.length }}条数据</div>
        </data-create-suc>
        <el-button @click="step = 1">继续导入</el-button>
        <el-button @click="gotoList" type="primary">查看房产</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
import tableStep2 from "./components/tableStep2.vue";
import dataCreateSuc from "components/dataCreateSuc.vue";
import { mixins } from "@/minxin";
import DataCreateSuc from "../../../components/dataCreateSuc.vue";
import fileUpload from "@/components/fileUpload.vue";

export default {
  components: {
    breadCrumb,
    tableStep2,
    dataCreateSuc,
    DataCreateSuc,
    fileUpload,
  },
  mixins: [mixins],
  data() {
    return {
      candoNext: true,
      errorData: [],
      rightData: [],
      step: 1,
      ary: [],
      tableHead2: [
        { prop: "detail", label: "详细" },
        { prop: "construction_area", label: "建筑面积" },
        { prop: "name", label: "业主姓名" },
        { prop: "idcard", label: "业主身份证号" },
        { prop: "phone", label: "业主电话号码" },
      ],
    };
  },
  mounted() {},
  computed: {
    tableHead3() {
      let res = [];
      res.push(...this.tableHead2);
      res.push({ prop: "error", label: "错误原因" });
      return res;
    },
  },
  methods: {
    gotoList() {
      this.step = 1;
      this.rightData = [];
      this.errorData = [];
      this.$router.push({ name: "building" });
    },
    //获取全部数据
    getTotalData() {//组件里面合并文件之后需要将上传的文件hash返回来，请求后端去根据文件的唯一hash去解析文件数据
      this.$request({
        url: "/building/parse",
        method: "post",
        data: {
          id: 2
        },
      }).then((res) => {
        this.rightData = res.data.data.rightData;
        this.errorData = res.data.data.errorData;
        this.step++;
      });
    },

    //将正确的数据提交到后端
    gotoStep3() {
      this.$request({
        url: "/building/import",
        method: "post",
        data: {
          community_id: this.community_id,
          buildings: this.rightData,
        },
      }).then(() => {
        this.step++;
      });
    },
  },
};
</script>

<style scoped>
.upload-demo {
  width: 80%;
  margin: 20px auto;
  height: auto;
}
</style>
<style>
.upload-demo .el-upload .el-upload-dragger {
  height: auto;
  width: 600px;
  padding-bottom: 20px;
}
</style>
