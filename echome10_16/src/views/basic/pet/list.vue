<template>
  <div>
    <bread-crumb></bread-crumb>
    <!--筛选列表 -->
    <el-card style="margin-top: 20px">
      <filter-chose :filterData.sync="filterData"></filter-chose>
    </el-card>
    <!-- 表格 -->

    <el-card style="margin-top: 20px; padding: 0px">
      <table-common :data="tableData" :columns="tableHeader"></table-common>

      <!-- 分页器 -->
      <div class="pignation">
        <el-pagination
          :page-sizes="[100, 200, 230, 400]"
          :page-size="pagesize"
          :total="tableData.length"
          :current-page="pagenum"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlechangenum"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
import tableCommon from "components/tableComon";
import filterChose from "@/components/filterChose.vue";
import { mixins } from "@/minxin";
export default {
  components: { breadCrumb, tableCommon, filterChose },
  mixins: [mixins],
  name: "petListVue",
  data() {
    return {
      filterData: [
        {
          title: "雌雄：",
          type: "radio",
          value: "sex",
          filters: { sex: undefined },
          radiod: [
            { label: undefined, title: "全部" },
            { label: 1, title: "雄" },
            { label: 0, title: "雌" },
          ],
        },
        {
          title: "登记：",
          type: "radio",
          value: "license",
          filters: { license: undefined },
          radiod: [
            { label: undefined, title: "全部" },
            { label: true, title: "已登记" },
            { label: false, title: "未登记" },
          ],
        },
        {
          title: "注销：",
          type: "radio",
          value: "remove",
          filters: { remove: undefined },
          radiod: [
            { label: undefined, title: "全部" },
            { label: 1, title: "是" },
            { label: 0, title: "否" },
          ],
        },
        {
          title: "品种：",
          type: "input",
          value: "bread",
          filters: { bread: undefined },
          placeholder: "请输入品种搜索",
        },
        {
          title: "毛色：",
          type: "input",
          value: "coat_color",
          filters: { coat_color: undefined },
          placeholder: "请输入毛色搜索",
        },
      ],
      filters: {
        sex: undefined,
        license: undefined,
        remove: undefined,
        bread: undefined,
        coat_color: undefined,
      },
      tableData: [],
      tableHeader: [
        { prop: "id", label: "编号", width: "150" },
        { prop: "name", label: "宠物名", width: "100 " },
        {
          prop: "pet_type",
          label: "宠物类型",
          width: "80",
          render(h, { row }) {
            function typeChose(val) {
              var type = "";
              switch (val) {
                case 1:
                  type = "狗";
                  break;
                case 2:
                  type = "猪";
                  break;
                case 3:
                  type = "锚";
                  break;
                case 4:
                  type = "老鼠";
                  break;
              }
              return type;
            }

            return h("span", typeChose(row.pet_type));
          },
        },
        {
          prop: "sex",
          label: "雌雄",
          width: 40,
          render(h, { row }) {
            return h("span", row.sex === 1 ? "雄" : "雌");
          },
        },
        { prop: "breed", label: "品种", width: 80 },
        { prop: "coat_color", label: "毛色", width: 60 },
        {
          prop: "pet_license",
          label: "宠物登记",
          width: 100,
          render(h, { row }) {
            return h(
              "el-tag",
              { attrs: { type: row.pet_license ? "primary" : "success" } },
              row.pet_license ? "已登记" : "未登记"
            );
          },
        },
        {
          prop: "remove",
          label: "是否注销",
          width: 100,
          render(h, { row }) {
            return h(
              "el-tag",
              { attrs: { type: row.remove ? "primary" : "success" } },
              row.remove ? "是" : "否"
            );
          },
        },
        {
          prop: "created_at",
          label: "登记时间",
          width: 180,
          render(h, { row }) {
            return h("span", this.standDate2(row.created_at));
          },
        },
        {
          prop: "action",
          label: "操作",
          render(h, { row }) {
            //this指向的是当前table的父节点
            let _this = this;
            return h(
              "span",
              {
                class: { doaction: true },
                style: {
                  color: "skyblue",
                },
                on: {
                  click() {
                    //	console.log(_this.$parent);
                    //_this.togoDetail(row.id)
                    _this.$parent.togoDetail(row.id);
                  },
                },
              },
              "查看"
            );
          },
        },
      ],
      pagenum: 1, //第几页
      pagesize: 10, //这一页有多少条数据这个数据并不会改变表格里面的渲染数据的条数，在表格中他是根据tableData来显示的，tableData有几条数据就显示几条。pagesize作为每页显示的数目，pagenum作为当前页，在向后端请求数据的时候，会发送过去，后端将会根据这两个参数返回相对应的table数据，然后前端拿到这个table数据之后，根据这个数据进行渲染
    };
  },
  methods: {
    //去往详情页
    togoDetail(val) {
      this.$router.push({ name: "detailpet", query: { id: val } });
    },
    //当页面数据条数或者当前页改变的时候也要向后端发送请求
    handleSizeChange(val) {
      this.pagesize = val;
      this.getPetData();
    },
    handlechangenum(val) {
      this.pagenum = val;
      this.getPetData();
    },
    //获取数据
    getPetData() {
      let obj = {};
      this.filterData.forEach((item) => {
        obj = Object.assign(obj, item.filters);
      });
      this.$request({
        url: "/pet/list",
        method: "post",
        data: {
          page_num: this.pagenum,
          page_size: this.pagesize,
          community_id: this.community_id,
          ...obj,
        },
      }).then((res) => {
        this.tableData = res.data.data.list.map((item) => {
          item.created_at = item.created_at * 1000;
          return item;
        });
      });
    },
  },
  mounted() {
    this.getPetData();
  },
  watch: {
    watchFilters: {
      handler(newValue, oldValue) {
        this.getPetData(); //当数据发生变化的时候，向后端重新发送请求
      },
      deep: true,
    },
  },
  computed: {
    community_id() {
      if (this.$store.getters.getPostInfo.community_list != undefined) {
        return this.$store.getters.getPostInfo.community_list[0].community_id;
      } else {
        return "1";
      }
    },
    watchFilters() {
      let obj = {};
      this.filterData.forEach((item) => {
        obj = Object.assign(obj, item.filters);
      });
      return JSON.parse(JSON.stringify(obj));
    },
  },
};
</script>

<style scoped>
.item {
  height: 50px;
  padding: 0px;
  line-height: 40px;
  height: 40px;
  padding-left: 20px;
  margin-bottom: 20px;
  text-align: left;
}
.item span {
  margin-right: 20px;
}
.pignation {
  height: 30px;
  margin-top: 30px;
  text-align: right;
}
</style>
