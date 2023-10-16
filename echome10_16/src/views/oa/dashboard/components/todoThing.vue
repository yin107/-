<template>
  <div>
	<el-row>
          <todo-item :itemdata="totalData.repair_total"
            ><span slot="title">维修工单</span>
            <span slot="add"
              >维修工单指派通知，请及时处理，五分好评才是目标</span
            >
          </todo-item>
          <todo-item :itemdata="totalData.complain_total">
            ><span slot="title">投诉工单</span>
            <span slot="add"
              >投诉工单指派通知，请及时处理，五分好评才是目标</span
            ></todo-item
          >

          <todo-item :itemdata="totalData.mission_total">
            ><span slot="title">巡检工单</span>
            <span slot="add"
              >今日巡检任务已经开始，按照巡检路线开始努力工作吧</span
            ></todo-item
          >
        </el-row>
        <el-row>
          <todo-item :itemdata="totalData.refound_total">
            ><span slot="title">报销审批</span>
            <span slot="add"
              >工作都已经完成了，快把钱给员工报销了吧，不然下次谁干</span
            ></todo-item
          >
          <todo-item :itemdata="totalData.leave_total">
            ><span slot="title">请假审批</span>
            <span slot="add"
              >谁都有点急事，工作能安排就开始审批</span
            ></todo-item
          >
          <todo-item :itemdata="totalData.purchase_total">
            ><span slot="title">采购审批</span>
            <span slot="add"
              >你我他都是企业的主人</span
            ></todo-item
          >
        </el-row>
  </div>
</template>

<script>
import todoItem from "./todoItem.vue";
export default {
name:'todoThing',
components: { todoItem },
props:['totalData']
}
</script>

<style>

</style>