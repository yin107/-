<template>
  <div>
    <bread-crumb></bread-crumb>
    <el-card style="margin-top: 20px">
      <filter-chose :filterData.sync="filterData"></filter-chose>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column
          v-for="item of tableHeader"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <div slot-scope="scope" v-if="item.prop === 'type'">
            <el-tag
              :style="{
                backgroundColor: buildingType(scope.row[item.prop]).color,
              }"
              >{{ buildingType(scope.row[item.prop]).value }}</el-tag
            >
          </div>
          <div slot-scope="scope" v-else-if="item.prop === 'created_at'">
            {{ (scope.row[item.prop] * 1000) | formatDate() }}
          </div>
          <div slot-scope="scope" v-else-if="item.prop === 'detail'">
            {{ detailInfo(scope.row) }}
          </div>
          <div
            slot-scope="scope"
            v-else-if="item.prop === 'action'"
            style="color: blue"
            class="doaction"
            @click="gotoDetail(scope.row.id)"
          >
            查看
          </div>
          <div v-else slot-scope="scope">
            {{ scope.row[item.prop] }}
          </div>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <pagnation-com
        :pagenum="pagenum"
        :pagesize="pagesize"
        :total="total"
        @handleSizeChange="handleSizeChange"
        @handlechangenum="handlechangenum"
        :pagesizes="pagesizes"
      ></pagnation-com>
    </el-card>
  </div>
</template>

<script>
import { mixins } from "@/minxin/index.js";
import breadCrumb from "components/breadCrumb";
import pagnationCom from "components/pagnationCom";
import filterChose from "@/components/filterChose.vue";
export default {
  name: "ListVue",
  components: { breadCrumb, pagnationCom, filterChose },
  mixins: [mixins],
  data() {
    return {
      tableData: [],
      tableHeader: [
        { prop: "id", label: "编号" },
        { prop: "detail", label: "详细" },
        { prop: "type", label: "房产类型" },
        { prop: "created_at", label: "导入时间" },
        { prop: "action", label: "操作" },
      ],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      pagesizes: [20, 50, 100, 200],
      filterData: [
        {
          title: "房产类型：",
          type: "radio",
          value: "buildingType",
          filters: { buildingType: undefined },
          radiod: [
            { label: undefined, title: "全部" },
            { label: 1, title: "住宅" },
            { label: 2, title: "车位" },
            { label: 3, title: "仓库" },
            { label: 4, title: "商户" },
            { label: 5, title: "车库" },
          ],
        },
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      this.$request({
        url: "/building/list",
        method: "post",
        data: {
          community_id: this.community_id,
          page_num: this.pagenum,
          page_size: this.pagesize,
          type: this.filter,
        },
      }).then((res) => {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      });
    },
    //查看详情
    gotoDetail(id) {
      this.$router.push({ name: "detailbuilding", query: { id: id } });
    },

    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    handlechangenum(val) {
      this.pagenum = val;
      this.getData();
    },
  },
  computed: {
	filter(){
		return this.filterData[0].filters.buildingType
	}
  },
  watch: {
    filter: {
      handler() {
        this.getData();
      },
    },
  },
};
</script>

<style></style>
