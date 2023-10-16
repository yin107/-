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
    <el-card style="margin-top: 10px">
      <div slot="header" style="overflow: auto">
        <span style="float: left">会议信息</span>
        <span class="doaction" style="color: skyblue; float: right">取消</span>
      </div>
      <el-row>
        <el-col :span="8"> 会议编号：{{ meetingInfo.id }}</el-col>
        <el-col :span="8">
          会议时间：{{
            standDate(meetingInfo.start_time, "YYYY-MM-DD HH:mm:ss")
          }}
          至
          {{ standDate(meetingInfo.end_time, "YYYY-MM-DD HH:mm:ss") }}</el-col
        >
        <el-col :span="8"> 会议室名称：{{ meetingInfo.name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"> 会议室位置：{{ meetingInfo.local }}</el-col>
        <el-col :span="8"> 会议主题：{{ meetingInfo.theme }}</el-col>
        <el-col :span="8">
          会议状态：<el-tag :type="meetingInfo.cancel ? 'success' : 'info'">{{
            meetingInfo.cancel ? "未结束" : "已结束"
          }}</el-tag></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="8">
          会议预定时间：{{
            standDate(meetingInfo.created_at, "YYYY-MM-DD HH:mm:ss")
          }}</el-col
        >
        <el-col :span="8">
          会议室有电视：<el-tag
            :type="meetingInfo.have_tv ? 'success' : 'info'"
            >{{ meetingInfo.have_tv ? "有" : "无" }}</el-tag
          ></el-col
        >
        <el-col :span="8">
          会议室有白板：<el-tag
            :type="meetingInfo.have_board ? 'success' : 'info'"
            >{{ meetingInfo.have_board ? "有" : "无" }}</el-tag
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="8">
          会议室有投影仪：<el-tag
            :type="meetingInfo.have_projector ? 'success' : 'info'"
            >{{ meetingInfo.have_projector ? "有" : "无" }}</el-tag
          ></el-col
        >
        <el-col :span="8"> 会议发起人：{{ meetingInfo.real_name }}</el-col>
      </el-row>
    </el-card>

    <el-card style="margin: 10px 0px; overflow: auto;padding-bottom:10px">
      <div slot="header" style="overflow: auto">
        <span style="float: left">参会人员</span>
      </div>
      <el-tag style="float: left">{{ participant.real_name }}</el-tag>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb.vue";
import { mixins } from "@/minxin";
export default {
  components: { breadCrumb },
  mixins: [mixins],
  data() {
    return {
      meetingInfo: {},
      participant: {},
    };
  },
  computed: {
    meetingID() {
      return this.$route.query.id;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$request({
        url: "/meeting/detail",
        method: "post",
        data: {
          id: this.meetingID,
          community_id: this.community_id,
        },
      }).then((res) => {
        this.meetingInfo = res.data.data.info;
        this.participant = res.data.data.participant;
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
