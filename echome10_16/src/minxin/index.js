import * as moment from "moment";
export const mixins = {
  data() {
    return {
      res: 1,
      dateChose: [],
    };
  },
  computed: {
    community_id() {
      if (this.$store.getters.getPostInfo.community_list != undefined) {
        return this.$store.getters.getPostInfo.community_list[0].community_id;
      } else {
        return "1";
      }
    },
  },
  methods: {

    //building
    //builduingType
    buildingType(item) {
      let res = {};
      switch (item) {
        case 1:
          res = { value: "住宅", color: "red" };
          break;
        case 2:
          res = { value: "车位", color: "blue" };
          break;
        case 3:
          res = { value: "仓房", color: "pink" };
          break;
        case 4:
          res = { value: "商户", color: "skyblue" };
          break;
        case 5:
          res = { value: "车库", color: "orange" };
          break;
      }
      return res;
    },
    //detail
    detailInfo(item) {
      let types = this.buildingType(item.type);
      let res =
        (item.area ? item.area : "") +
        " " +
        (item.building ? item.building : "") +
        " " +
        (item.unit ? item.unit : "") +
        " " +
        item.number +
        (types.value ? types.value : "");
      return res;
    },
    //全屏
    screenfullEnter() {
      const el = document.documentElement;
      const eventEnter =
        el.requestFullscreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen;
      if (typeof eventEnter !== "undefined" && eventEnter) {
        eventEnter.call(el);
      }
    },
    //退出全屏
    screenfullOut() {
      let eventOut =
        document.cancelFullScreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen ||
        document.msExitFullScreen;
      if (typeof eventOut !== "undefined" && eventOut) {
        eventOut.call(document);
      }
    },
    //检测是否全屏
    checkFull() {
      let isFullScreen =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullScreenElement ||
        document.msFullscreenElement;
      if (isFullScreen === undefined) isFullScreen = false;
      return isFullScreen;
    },

    //获取当天0点的时间戳，以及这一周的日期信息
    getDayInfo() {
      var initTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
      var bound = 24 * 60 * 60 * 1000;
      for (let i = 0; i < 7; i++) {
        let item = moment(initTime + bound * i)
          .format("YYYY-M-D-d")
          .split("-");
        let arr = [
          "星期天",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ];
        let items = {
          year: item[0],
          month: item[1],
          day: item[2],
          week: arr[item[3]],
        };
        this.dateChose.push(items);
      }
    },

	//文件上传部分
	
  },
};
