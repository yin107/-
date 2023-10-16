<template>
  <div class="create">
    <bread-crumb></bread-crumb>
    <el-card style="margin-top: 10px">
      <div class="check-box">
        会议室设施：&nbsp;
        <div>
          <el-checkbox-group v-model="filters">
            <el-checkbox label="电视"></el-checkbox>
            <el-checkbox label="白板"></el-checkbox>
            <el-checkbox label="投影仪"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <table-chose-time
        :meeting_room="meeting_room"
        :usingRoom="usingRoom"
        @modiRoomName="modiRoomName"
        @modiTime="modiTime"
      ></table-chose-time>

      <el-form>
        <el-form-item :label="'会议名称：' + meeting_room_name"> </el-form-item>
        <el-form-item :label="'预定时间：' + choseTime"> </el-form-item>
        <el-form-item
          :label="'预定人：' + $store.getters.getUserInfo.real_name"
        >
        </el-form-item>
        <el-form-item label="会议主题：">
          <el-input
            type="textarea"
            placeholder="请输入会议主题内容"
            v-model="theme"
            maxlength="256"
            show-word-limit
            style="float: left; width: 80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="参会人员：">
          <div>
            <el-input
              placeholder="搜索员工"
              style="width: 400px; float: left"
              v-model="filterText"
            >
              <i class="el-icon-edit el-input__icon" slot="prefix"> </i>
            </el-input>
            <el-tree
              :data="data"
              show-checkbox
              node-key="label"
              :props="defaultProps"
              default-expand-all
              @check-change="handleCheckChange"
              style="width: 90%; float: right"
              :filter-node-method="filterNode"
              ref="tree"
            ></el-tree>
            已选： {{ checkcolleag.length ? checkcolleag : "" }}
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="confirm">约定会议室</el-button>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb.vue";
import tableChoseTime from "./component/tableChoseTime.vue";
import { mixins } from "@/minxin";
export default {
  components: { breadCrumb, tableChoseTime },
  mixins: [mixins],
  data() {
    return {
      meeting_room: [
        {
          id: "48",
          local: "ea sunt magna ut",
          name: "计选再合克达",
          have_tv: false,
          have_board: false,
          have_projector: false,
        },
        {
          id: "51",
          local: "et sunt ipsum velit incididunt",
          name: "通志照她今",
          have_tv: false,
          have_board: false,
          have_projector: false,
        },
        {
          id: "40",
          local: "Excepteur",
          name: "新书九使",
          have_tv: true,
          have_board: false,
          have_projector: false,
        },
        {
          id: "24",
          local: "eiusmod",
          name: "圆明写运须",
          have_tv: true,
          have_board: true,
          have_projector: false,
        },
      ],
      usingRoom: [
        {
          end_time: "1680466931",
          meeting_room_id: "40",
          start_time: "1680456931",
        },
        {
          end_time: "1680346931",
          meeting_room_id: "24",
          start_time: "1680336931",
        },
        {
          end_time: "1680334931",
          meeting_room_id: "24",
          start_time: "1680314931",
        },
      ],

      participant: [
        {
          department: "tempor",
          department_id: "19",
          id: "28",
          job: "ut enim exercitation in non",
          job_id: "90",
          real_name: "部给片议",
        },
        {
          department: "ex",
          department_id: "15",
          id: "74",
          job: "proident et qui",
          job_id: "35",
          real_name: "生和然大权可军",
        },
        {
          department: "ex",
          department_id: "15",
          id: "23",
          job: "in",
          job_id: "43",
          real_name: "信图你",
        },
        {
          department: "veniam ut",
          department_id: "62",
          id: "12",
          job: "irure tempor",
          job_id: "56",
          real_name: "究离采除",
        },
      ],
      defaultprops: {
        label: "",
        children: "",
      },
      filters: [],
      meeting_room_name: "",
      choseTime: "",
      theme: "",
      arr: [],
      checkcolleag: [],
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  computed: {
    data() {
      this.participant.forEach((item) => {
        let arrstring = JSON.stringify(this.arr);
        let obj = { label: "", children: [] };
        let childrenitem = { label: "" };
        if (arrstring.includes(item.department)) {
          this.arr.map((v) => {
            if (v.label === item.department) {
              let obj = { label: item.real_name };
              v.children.push(obj);
            }
            return item;
          });
        } else {
          obj.label = item.department;
          childrenitem.label = item.real_name;
          obj.children.push(childrenitem);
          this.arr.push(obj);
        }
      });
      return this.arr;
    },
  },
  watch: {
    filterText(val) {//实现过滤搜索
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    // this.getMeetingRoom();
    // this.getParticipant();
  },
  methods: {
    handleCheckChange() {
      let checkarr = this.$refs.tree.getCheckedNodes(true); //获取当前选中的子节点
      this.checkcolleag = [];
      checkarr.forEach((v) => {
        this.checkcolleag.push(v.label);
      });
    },

    //实现搜索查询
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
confirm(){
let data={community_id:this.community_id,theme:this.theme,time:this.choseTime,meeting_room_name:this.meeting_room_name,participant:this.checkcolleag}
this.$request({
	url:"/meeting/create",
	method:'post',
	data:data
}).then(res=>{
	console.log(res);
	//返回一个id
	let meetingId=res.data.data.id
	//在跳转到会议详情页
	this.$router.push({name:'detailMeeting',query:{id:meetingId}})

})
},
    modiRoomName(newValue) {
      this.meeting_room_name = newValue;
    },
    modiTime(newValue) {
      this.choseTime = newValue;
    },
    getMeetingRoom() {
      this.$request({
        url: "/meeting/option",
        method: "post",
        data: {
          community_id: this.community_id,
        },
      }).then((res) => {
        this.meeting_room = res.data.data.list;
        this.usingRoom = res.data.data.using;
      });
    },
    getParticipant() {
      this.$request({
        url: "/option/colleague",
        method: "post",
        data: {
          community_id: this.community_id,
        },
      }).then((res) => {
        this.participant = res.data.data.list;
      });
    },
  },
};
</script>

<style lang="less">
.create {
  .check-box {
    display: flex;
    align-content: flex-start;
  }
  .meeting-selector {
    margin-top: 20px;
    overflow: hidden;
    margin-bottom: 20px;
    .head {
      height: 80px;
      border: 1px solid #0000ff;
      display: flex;
      overflow: hidden;
      .head-aside {
        width: 80px;
        height: 80px;
        background-color: #fff;
        position: relative;
        .time {
          right: 5px;
          position: absolute;
          top: 5px;
        }
        .name {
          left: 5px;
          position: absolute;
          bottom: 5px;
        }
        &::after {
          content: "";
          position: absolute;
          left: -108px;
          top: 2px;
          width: 221px;
          background-color: blue;
          height: 1px;
          transform: rotate(47deg);
        }
      }
      .head-right {
        width: 100%;
        display: flex;
        flex-direction: column;
        .header-top {
          border-bottom: 1px solid #0000ff;
          ul {
            padding: 0px;
            margin: 0px;
            display: flex;
            width: 100%;
            justify-content: space-between;
            background-color: #fff;
          }
          ul li {
            margin: 0px;
            padding: 0px;
            list-style: none;
            float: left;
            height: 100%;
            text-align: center;
            width: 100%;
            border-left: 1px solid blue;
            p {
              margin: 0px;
            }
          }
        }
        .header-bot {
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          .btn {
            border-left: 1px solid blue;
            width: 43px;
            height: 40px;
          }
          .time-span {
            width: 100%;
            height: 40px;
            overflow: hidden;
            ul {
              width: auto;
              height: 40px;
              margin: 0px;
              padding: 0px;
              background-color: skyblue;
            }
            ul li {
              list-style: none;
              float: left;
              width: 85.51px;
              height: 40px;
              border-left: 1px solid blue;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-content: center;
              p {
                margin: 0px;
              }
            }
          }
        }
      }
    }
    .body {
      .body-item {
        height: 40px;
        display: flex;
        border-bottom: 1px solid blue;
        .box-content {
          width: calc(100% - 45px);
          height: 100%;
          border-left: 1px solid blue;
          .meeting-name {
            float: left;
            height: 100%;
            text-align: center;
            line-height: 40px;
            width: 118px;
            border-right: 1px solid blue;
          }
          .item {
            display: flex;
            height: 100%;
            justify-content: space-between;
            border-bottom: 1px solid blue;

            .meeting-item-box {
              flex: 1;
              border-right: 1px solid blue;
            }
          }
        }
        .blck {
          width: 43px;
          height: 100%;
          border-right: 1px solid blue;
          border-bottom: 1px solid #fff;
        }
      }
    }
    .body-item:last-of-type {
      .blck {
        border-bottom: 1px solid blue;
      }
    }
  }
  .bgcol {
    background-color: papayawhip;
  }
  .nobgc {
    background-color: grey;
  }
}
</style>
