<template>
  <div id="totalMeet">
    <bread-crumb></bread-crumb>
    <div class="tagCh">
      <el-tag class="tagitem" @click="chose='my'" :type="chose==='my'?'success':'info'">我发起的会议</el-tag>
      <el-tag class="tagitem" @click="chose='par'" :type="chose==='par'?'success':'info'">需要我参加的会议</el-tag>
    </div>

    <el-card style="margin-top: 10px">
      <my-meeting v-if="chose === 'my'"></my-meeting>
      <participant v-if="chose==='par'"></participant>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb.vue";
import myMeeting from "./component/myMeeting.vue";
import { mixins } from "@/minxin";
import Participant from "./component/participant.vue";
export default {
  name: "totalMeeting",
  components: { breadCrumb, myMeeting, Participant },
  mixins: [mixins],
  data() {
    return {
      chose: "my",
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less">
#totalMeet {
  .tagCh {
    background-color: #fff;
    width: 100%;
    height: 50px;
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    .tagitem {
      margin-left: 10px;
    }
  }
}
</style>
