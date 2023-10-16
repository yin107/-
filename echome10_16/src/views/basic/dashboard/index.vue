<template>
  <div>
    <div class="topCard">
      <div class="card">
        <p class="title">小区住宅入住率</p>
        <p class="sta">已入住0套</p>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="70"
          style="margin-top: 30px"
        ></el-progress>
        <p class="total">
          <span>总计</span> <span>0套，0位业主，3只宠物</span>
        </p>
      </div>

      <div class="card">
        <p class="title">小区车位占有率</p>
        <p class="sta">已使用0个</p>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="70"
          style="margin-top: 30px"
        ></el-progress>
        <p class="total"><span>总计</span> <span>0个，0辆车</span></p>
      </div>

      <div class="card">
        <p class="title">小区仓库占有率</p>
        <p class="sta">已使用0个</p>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="70"
          style="margin-top: 30px"
        ></el-progress>
        <p class="total"><span>总计</span> <span>0个</span></p>
      </div>

      <div class="card">
        <p class="title">总使用率</p>
        <p class="sta">已关联0个</p>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="70"
          style="margin-top: 30px"
        ></el-progress>
        <p class="total"><span>总计</span> <span>0房产</span></p>
      </div>
    </div>
    <!-- echart区域 -->
    <el-card class="box-card">
      <div slot="header" style="overflow: auto">
        <span style="float: left; height: 40px; line-height: 40px"
          >7日内服务统计</span
        >
        <div class="option">
          <ul>
            <li
              :class="[optionsChose == 1 ? 'color' : '','doaction']"
              @click="optionsChose = 1"
            >
              维修维护
            </li>
            <li
              :class="[optionsChose == 2 ? 'color' : '','doaction']"
              @click="optionsChose = 2"
            >
              投诉建议
            </li>
          </ul>
        </div>
      </div>
      <div class="content">
        <div ref="myEchart1" class="myEchart1"></div>
        <div ref="myEchart2" class="myEchart2"></div>
      </div>
    </el-card>
    <!-- chart区域2 -->
    <div class="box">
      <el-card style="flex: 0.5; margin-right: 10px">
        <div slot="header" style="overflow: auto">
          <span style="float: left">7日内访客、宠物、挪车统计</span>
        </div>
        <div ref="chart1" class="chart1"></div>
      </el-card>
      <el-card style="flex: 0.5">
        <div slot="header" style="overflow: auto">
          <span style="float: left">7日内小区通知统计</span>
        </div>
        <div ref="noticeChart" class="noticeChart"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      optionsChose: 1,
      //   服务统计 服务满意度-维修维护 数据
      fitmentData: {
        lineSource: [
          ["type", "工单上报", "工单指派", "工单确认", "工单完成"],
          ["03月17日", 1, 2, 2, 1],
          ["03月18日", 1, 2, 3, 2],
          ["03月19日", 1, 2, 1, 1],
          ["03月20日", 1, 2, 3, 1],
          ["03月21日", 1, 2, 3, 2],
          ["03月22日", 1, 2, 3, 1],
          ["03月23日", 1, 2, 3, 2],
        ],
        pieData: [
          {
            value: 130,
            name: "非常满意",
          },
          {
            value: 120,
            name: "满意",
          },
          {
            value: 10,
            name: "一般满意",
          },
          { value: 2, name: "非常不满意" },
          { value: 5, name: "很不满意" },
          { value: 19, name: "不满意" },
        ],
      },
      //服务统计 服务满意度-投诉建议 数据
      complainData: {
        lineSource: [
          ["type", "工单上报", "工单指派", "工单确认", "工单完成"],
          ["03月17日", 1, 1, 2, 1],
          ["03月18日", 1, 1, 3, 2],
          ["03月19日", 1, 2, 2, 1],
          ["03月20日", 1, 2, 3, 1],
          ["03月21日", 1, 2, 1, 2],
          ["03月22日", 1, 2, 3, 1],
          ["03月23日", 1, 2, 3, 2],
        ],
        pieData: [
          {
            value: 150,
            name: "非常满意",
          },
          {
            value: 110,
            name: "满意",
          },
          {
            value: 0,
            name: "一般满意",
          },
          { value: 2, name: "非常不满意" },
          { value: 5, name: "很不满意" },
          { value: 19, name: "不满意" },
        ],
      },
      //   服务统计配置
      service1Options: {
        title: {
          show: true,
          text: "服务统计",
        },
        tooltip: {
          trigger: "axis",
        },
        dataset: {
          source: [],
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
          interval: 0.5,
        },
        series: [
          { type: "line" },
          { type: "line" },
          { type: "line" },
          { type: "line" },
        ],
      },
      //服务满意度
      serviceCount: {
        title: {
          show: true,
          text: "服务满意度",
        },
        tooltip: {
          trigger: "item",
          formatter: `{b}:{c} ({d}%)`,
        },
        series: [
          {
            type: "pie",
            data: [],
            radius: ["7%", "60%"],
            roseType: "area",
          },
        ],
      },
      //小区挪车等
      chart1: {
        yAxis: { type: "value" },
        xAxis: { type: "category" },
        dataset: {
          source: [
            ["type", "小区挪车", "宠物登记", "访客登记"],
            ["03月17日", 1, 2, 2],
            ["03月18日", 1, 2, 2],
            ["03月19日", 1, 2, 1],
            ["03月20日", 1, 2, 1],
            ["03月21日", 1, 2, 2],
            ["03月22日", 1, 2, 1],
            ["03月23日", 1, 2, 2],
          ],
        },
        series: [{ type: "line" }, { type: "line" }, { type: "line" }],
        tooltip: {
          trigger: "axis",
        },
      },
      //小区通知等
      noticeChart: {
        xAxis: { type: "category" },
        yAxis: { type: "value" },
        tooltip: { trigger: "axis" },
        dataset: {
          source: [
            ["type", "小区通知"],
            ["03月17日", 1],
            ["03月18日", 2],
            ["03月19日", 1],
            ["03月20日", 1],
            ["03月21日", 2],
            ["03月22日", 1],
            ["03月23日", 2],
          ],
        },
        series: [{ type: "line" }],
      },
    };
  },
  computed: {
    dataChose() {
      if (this.optionsChose == 1) {
        return this.fitmentData;
      } else {
        return this.complainData;
      }
    },
  },
  watch: {
    dataChose: {
      deep: true,
      handler(newValue) {
        this.service1Options.dataset.source = newValue.lineSource;
        this.serviceCount.series[0].data = newValue.pieData;
        this.initCharts2();
        this.initCharts1("myEchart1", this.service1Options);
      },
    },
  },
  mounted() {
    this.service1Options.dataset.source = this.fitmentData.lineSource;
    this.serviceCount.series[0].data = this.fitmentData.pieData;
    this.initCharts1("myEchart1", this.service1Options);
    this.initCharts1("chart1", this.chart1);
    this.initCharts1("noticeChart", this.noticeChart);
    this.initCharts2();
  },
  methods: {
    initCharts1(name, option) {
      var myEchart1 = this.$echarts.init(this.$refs[`${name}`]);
      // 使用刚指定的配置项和数据显示图表。
      myEchart1.setOption(option);
    },
    initCharts2() {
      var myEchart2 = this.$echarts.init(this.$refs["myEchart2"]);
      myEchart2.setOption(this.serviceCount);
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.initCharts1, 20);
    window.removeEventListener("resize", this.initCharts2, 20);
  },
};
</script>

<style scoped>
.topCard {
  display: flex;
  justify-content: space-between;
}
.card {
  width: 340px;
  height: 200px;
  background-color: #fff;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  margin-right: 20px;
  flex-grow:1
}
.card:last-child{
	margin-right:0px
}
.title {
  color: grey;
  text-align: left;
}
.sta {
  text-align: left;
}
.total {
  border-top: 1px solid grey;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}
.box-card {
  margin-top: 20px;
}
.content {
  display: flex;
  justify-content: space-between;
  text-align: center;
}
.myEchart1 {
  width: 1000px;
  height: 600px;
  background-color: #fff;
  margin-top: 20px;
  flex-grow:1
}
.myEchart2 {
  width: 500px;
  height: 600px;
  background-color: #fff;
}
.option {
  float: right;
}
.option ul li {
  list-style: none;
  float: left;
  margin-left: 10px;
}
.color {
  color: blue;
}
.box {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.chart1 {
  width: 100%;
  height: 400px;
}
.noticeChart {
  width: 100%;
  height: 400px;
}
</style>
