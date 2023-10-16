<template>
  <el-table ref="targetTable" border :data="data" v-bind="$attrs" v-on="$listeners">
    <slot slot="empty" name="empty" />
    <slot slot="append" name="append" />
    <slot name="columns">
      <el-table-column
        v-for="column in computedColumns"
        :key="column.prop"
        v-bind="column"
      >
        <template slot="header" slot-scope="scope">
          <tabel-head-cell
            :column="column"
            :scope-column="scope.column"
            :index="scope.$index"
            :render="column.headerRender"
            :columns="columns"
            :data="data"
          />
        </template>
        <template slot-scope="scope">
          <tabel-cell
            :row="scope.row"
            :column="column"
            :scope-column="scope.column"
            :index="scope.$index"
            :render="column.render"
            :columns="columns"
            :data="data"
          />
        </template>
      </el-table-column>
    </slot>
  </el-table>
</template>

<script>
import TabelCell from "./TableCell";
import TabelHeadCell from "./TableHeaderCell";
const TATGET_TABLE_REF = "targetTable";
export default {
  name: "RenderTable",
  components: { TabelHeadCell, TabelCell },
  props: {
    columns: { type: Array, default: () => {} },
    data: { type: Array, default: () => {} },
  },
  computed: {
    computedColumns() {
      return (
        this.columns &&
        this.columns.filter(
          (column) =>
            column.visible === undefined ||
            column.visible === null ||
            !!column.visible
        )
      );
    },
  },
  methods: {
    // 表格原始方法
    clearSelection() {
      this.$refs[TATGET_TABLE_REF].clearSelection();
    },
    toggleRowSelection(row, selected) {
      this.$refs[TATGET_TABLE_REF].toggleRowSelection(row, selected);
    },
    toggleAllSelection() {
      this.$refs[TATGET_TABLE_REF].toggleAllSelection();
    },
    toggleRowExpansion(row, expanded) {
      this.$refs[TATGET_TABLE_REF].toggleRowExpansion(row, expanded);
    },
    setCurrentRow(row) {
      this.$refs[TATGET_TABLE_REF].setCurrentRow(row);
    },
    clearSort() {
      this.$refs[TATGET_TABLE_REF].clearSort();
    },
    clearFilter(columnKey) {
      this.$refs[TATGET_TABLE_REF].clearFilter(columnKey);
    },
    doLayout() {
      this.$refs[TATGET_TABLE_REF].doLayout();
    },
    sort(prop, order) {
      this.$refs[TATGET_TABLE_REF].sort(prop, order);
    },
  },
};
</script>
<style>
.el-table--enable-row-transition .el-table__body td.el-table__cell {
  text-align: center;
}
.el-table th.el-table__cell>.cell{
	text-align: center;
}
</style>
