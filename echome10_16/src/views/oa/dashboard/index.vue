<template>
  <div>
    <bread-crumb></bread-crumb>
    <div class="content1">
      <el-card class="card-left">
        <div slot="header" style="text-align: left">代办事项</div>
        <todo-thing :totalData="totalData"></todo-thing>
      </el-card>
      <el-card class="card-right">
        <div slot="header" style="text-align: left">今日会议</div>
        <el-table :data="totalData.meeting" width="100%">
          <el-table-column
            v-for="item of meetingHead"
            :key="item.prop"
			:prop="item.prop"
			:label="item.label"
			:width="item.width"
          >
		<div slot-scope="scope" v-if="item.prop==='time'" >
		{{ scope.row.start_time*1000|formatDate}}-{{ scope.row.end_time*1000|formatDate }}
		</div>
		<div v-else-if="item.prop==='action'" class="doaction" style="color:skyblue"> 查看</div>
		<div v-else slot-scope="scope">{{ scope.row[item.prop] }}</div>
		</el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="content2">
      <div class="content-left">
        <el-card class="card-left">2</el-card>
        <el-card class="card-right">4</el-card>
      </div>
      <div class="content-right"><el-card>3</el-card></div>
    </div>
  </div>
</template>

<script>
import todoThing from "./components/todoThing.vue";
import breadCrumb from "@/components/breadCrumb.vue";
import { mixins } from "@/minxin";
export default {
  components: { breadCrumb, todoThing },
  mixins: [mixins],
  data() {
    return {
      totalData: {},
      meetingHead: [
        { prop: "time", label: "会议时间" ,width:'250'},
        { prop: "name", label: "会议室名称" ,width:'100'},
        { prop: "local", label: "会议室位置" ,width:'100'},
        { prop: "action", label: "查看",width:'60' },
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$request({
        url: "/statistic/work",
        method: "post",
        data: {
          community_id: this.community_id,
        },
      }).then((res) => {
        this.totalData = res.data.data;
      });
    },
  },
};
</script>

<style lang="less">
.flexSet {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.content1 {
  .flexSet();
  .card-left {
    flex: 0.6;
    margin-right: 10px;
  }
  .card-right {
    flex: 0.4;
  }
}
.content2 {
  .flexSet();
  .content-left {
    flex: 0.7;
    margin-right: 10px;
    display: flex;
    justify-content: space-between;
    .card-left {
      flex: 1;
      margin-right: 10px;
    }
    .card-right {
      flex: 1;
    }
  }
  .content-right {
    flex: 0.3;
  }
}
</style>
