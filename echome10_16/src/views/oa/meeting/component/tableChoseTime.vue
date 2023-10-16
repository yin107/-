<template>
  <div class="meeting-selector">
    <div class="head">
      <div class="head-aside">
        <span class="time">时间</span>
        <span class="name">会议室</span>
      </div>
      <div class="head-right">
        <div class="header-top">
          <ul>
            <li
              v-for="item in dateChose"
              :key="item.week"
              @click="choseweekday = item.week"
              :class="{ bgcol: choseweekday === item.week }"
            >
              <p>{{ item.week }}</p>
              <p>{{ item.year }}年{{ item.month }}月{{ item.day }}日</p>
            </li>
          </ul>
        </div>
        <div class="header-bot">
          <el-button size="small" class="btn" @click="step = 0"> ← </el-button>
          <div class="time-span">
            <ul v-if="!step">
              <li v-for="(_, index) of Array(13)" :key="index">
                <p>{{ index }}:00</p>
              </li>
            </ul>
            <ul v-else>
              <li v-for="(_, index) of Array(13)" :key="index">
                <p>{{ index + step * 12 }}:00</p>
              </li>
            </ul>
          </div>
          <el-button size="small" class="btn" @click="step = 1"> → </el-button>
        </div>
      </div>
    </div>
    <div class="body">
      <div v-for="item in meeting_room" :key="item.name" class="body-item">
        <div class="box-content">
          <span class="meeting-name">{{ item.name }}</span>
          <div class="item" v-if="!step">
            <span
              class="meeting-item-box"
              v-for="(_, index) in Array(24)"
              :key="index"
              @click="
                clickitem(
                  item,
                  index,
                  disableChose.some((v) => v.id === item.id) &&
                    disableChose.some((v) => v.discur.includes(index))
                )
              "
              :class="{
                bgcol: chose.cur.includes(index) && chose.id === item.id,
                nobgc:
                  disableChose.some((v) => v.id === item.id) &&
                  disableChose.some((v) => v.discur.includes(index)),
              }"
            ></span>
          </div>
          <div class="item" v-if="step">
            <span
              class="meeting-item-box"
              v-for="(_, index) in Array(24)"
              :key="index"
              @click="
                clickitem(
                  item,
                  index + 24,
                  disableChose.some((v) => v.id === item.id) &&
                    disableChose.some((v) => v.discur.includes(index + 24))
                )
              "
              :class="{
                bgcol: chose.cur.includes(index + 24) && chose.id === item.id,
                nobgc:
                  disableChose.some((v) => v.id === item.id) &&
                  disableChose.some((v) => v.discur.includes(index + 24)),
              }"
            ></span>
          </div>
        </div>
        <div class="blck"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixins } from "@/minxin";
export default {
  name: "tableChosingTime",
  mixins: [mixins],
  props: ["meeting_room", "usingRoom"],
  data() {
    return {
      chose: { cur: [], id: "", weekday: "" },
      step: 0,
      disableChose: [], //不能使用的时间，根据hasUsing处理
      choseweekday: "",
      meeting_room_name: "",
    };
  },
  mounted() {
    this.getDayInfo();
  },
  watch: {
    "chose.id": {
      handler(newValue) {
        if (newValue != "") {
          //当变化不同的会议室的话，就需要更具filter函数，筛选出会议室名字
          this.meeting_room_name = this.meeting_room.filter(
            (item) => item.id === newValue
          )[0].name;
        }
      },
    },
    choseweekday(newValue, oldValue) {
      this.disableChose = [];
      this.meeting_room_name = "";
      this.chose.weekday = newValue;
      if (newValue != oldValue) {
        //重新选择一个不同的日子的话，之前选择的时间就重置
        this.chose = { cur: [], id: "", weekday: "" };
        this.chose.weekday = newValue;
      }
      //不可选择的项目
      this.hasUsing.forEach((item) => {
        let obj = { id: "", discur: [] };
        if (item.start_time.weekday === newValue) {
          obj.id = item.room_id;
          let addstart = Number(item.start_time.startMin) >= 30 ? "1" : "0";
          let start = item.start_time.startHour * 2 + Number(addstart);
          let endadd = item.end_time.endMin >= 30 ? 1 : 0;
          let end = item.end_time.endHour * 2 + Number(endadd);
          for (let i = start; i <= end; i++) {
            obj.discur.push(i);
          }
        }
        this.disableChose.push(obj);
      });
    },
    meeting_room_name(newValue) {
      this.$emit("modiRoomName", newValue);
    },
    choseTime(newValue) {
      this.$emit("modiTime", newValue);
    },
  },
  computed: {
    choseTime() {
      //计算选择的时间
      if (this.chose.weekday) {
        if (this.chose.cur.length) {
          let res1 = (this.chose.cur[0] / 2).toFixed(1).split(".");
          let start_time;
          if (res1[1] === "0") {
            start_time = res1[0] + ":00";
          } else {
            start_time = res1[0] + ":" + Number(res1[1]) * 6;
          }
          let res2 = ((this.chose.cur[this.chose.cur.length - 1] + 1) / 2)
            .toFixed(1)
            .split(".");
          let end_time;
          if (res2[1] === "0") {
            end_time = res2[0] + ":00";
          } else {
            end_time = res2[0] + ":" + Number(res2[1]) * 6;
          }
          return this.chose.weekday + " " + start_time + "至" + end_time;
        } else {
          return this.chose.weekday;
        }
      } else {
        return "";
      }
    },
    hasUsing() {
      //计算会议室已经使用过的时间
      let res = [];
      let arr = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      this.usingRoom.forEach((item) => {
        let obj = { start_time: "", end_time: "", room_id: "" };
        let weekday = arr[new Date(item.start_time * 1000).getDay()];
        let startHour = new Date(item.start_time * 1000).getHours();
        let startMin;
        if (new Date(item.start_time * 1000).getMinutes() > 30) {
          startHour += 1;
          startMin = "00";
        } else if (new Date(item.start_time * 1000).getMinutes() == 0) {
          startMin = "00";
        } else {
          startMin = "30";
        }

        let endHour = new Date(item.end_time * 1000).getHours();
        let endMin;
        if (new Date(item.end_time * 1000).getMinutes() > 30) {
          endHour += 1;
          endMin = "00";
        } else if (new Date(item.end_time * 1000).getMinutes() == 0) {
          endMin = "00";
        } else {
          endMin = "30";
        }

        obj.start_time = { weekday, startHour, startMin };
        obj.end_time = { weekday, endHour, endMin };
        obj.room_id = item.meeting_room_id;
        res.push(obj);
      });
      return res;
    },
  },
  methods: {
    canchose(item, index) {
      this.chose.id = item.id; //确定选中的会议室名称
      if (this.chose.cur.length === 0) {
        this.chose.cur.push(index);
      } else {
        this.chose.cur.sort((a, b) => a - b);
        if (!this.chose.cur.includes(index)) {
          //做的是添加
          let max = Math.max(...this.chose.cur); //不能把这个放到条件判断里面
          let min = Math.min(...this.chose.cur);
          if (index > max) {
            //尾部添加
            for (let i = max + 1; i <= index; i++) {
              this.chose.cur.push(i);
            }
          } else {
            //首部添加
            for (let i = index; i < min; i++) {
              this.chose.cur.unshift(i);
            }
          }
        } else {
          //如果已经有这个格子了还点击，那么就是删除
          let max = Math.max(...this.chose.cur);
          for (let i = 0; i <= max - index; i++) {
            this.chose.cur.pop();
          }
        }
      }
      this.chose.cur.sort((a, b) => a - b);
    },
    clickitem(item, index, isdis) {
      //isdis是一个布尔值，如果当前时间已经被预定了的话，就给出提示信息，并且不做任何操作
      if (!isdis) {
        //对于可选择的项目
        if (this.chose.weekday === "") {
          this.notifyError("请选择日期");
        } else {
          if (this.chose.id === "" || this.chose.id === item.id) {
            this.canchose(item, index);
          } else {
            //当重新选择会议室之后
            this.chose.cur = [];
            this.chose.cur.push(index);
            this.chose.id = item.id;
          }
        }
      } else {
        this.notifyError("该时间已经预定了");
      }
    },
  },
};
</script>

<style lang="less">
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
</style>
