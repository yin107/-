<template>
  <div>
    <table-comon :columns="myListHead" :data="ListData"></table-comon>
    <pagnation-com
      :pagenum="pagenum"
      :pagesize="pagesize"
      :total="total"
      :pagesizes="pagesizes"
      @handleSizeChange="handleSizeChange"
      @handlechangenum="handlechangenum"
    ></pagnation-com>
  </div>
</template>

<script>
import pagnationCom from "@/components/pagnationCom.vue";
import tableComon from "components/tableComon.vue";
import { mixins } from "@/minxin";
export default {
  name: "myMeeting",
  components: { tableComon, pagnationCom },
  mixins: [mixins],
  data() {
    return {
      myListHead: [
        {
          prop: "meetID",
          label: "会议编号",
          render(h, { row }) {
            return h("span", row.id);
          },
        },
        {
          prop: "meetTime",
          label: "会议时间",
          render(h, { row }) {
            return h(
              "span",
              `${this.standDate(
                row.created_at,
                "YYYY-MM-DD HH:mm:ss"
              )}至${this.standDate(row.end_time, "YYYY-MM-DD HH:mm:ss")}`
            );
          },
        },
        { prop: "theme", label: "会议主题" },
        { prop: "name", label: "会议室名称", key: "name" },
        { prop: "local", label: "会议室位置", key: "local" },
        {
          prop: "status",
          label: "会议状态",
          key: "cancel",
          render(h, { row }) {
            let res, type;
            if (row.cancel == 0) {
              res = "已结束";
              type = "info";
            } else {
              res = "待开始";
              type = "success";
            }
            return h("el-tag", { attrs: { type: type } }, res);
          },
        },
        {
          prop: "created_at",
          label: "预定时间",
          render(h, { row }) {
            return h(
              "span",
              `${this.standDate(row.created_at, "YYYY-MM-DD HH:mm:ss")}`
            );
          },
        },
        {
          prop: "action",
          label: "操作",
          render(h, { row }) {
			const _this=this
            return h(
              "span",
              {
                class: { doaction: true },
                style: {
                  color: "skyblue",
                },
                on: {
                  click() {
                    _this.gotodetail(row);
                  },
                },
              },
              "查看"
            );
          },
        },
      ],
      ListData: [],
      pagenum: 1,
      pagesize: 20,
      total: 40,
      pagesizes: [10, 20, 50],
    };
  },
  mounted() {
    this.getMyData();
  },
  methods: {
    getMyData() {
      let data = {
        community_id: this.community_id,
        page_num: 1,
        page_size: 20,
      };
      this.$request({
        url: "/meeting/my",
        method: "post",
        data: data,
      }).then((res) => {
        this.ListData = res.data.data.list;
      });
    },
    handlechangenum(val) {
      this.pagenum = val;
      this.getMyData();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getMyData();
    },
    gotodetail(row) {
     this.$router.push({name:'detailMeeting',query:{id:row.id}})
    },
  },
};
</script>

<style></style>
