<template>
  <div>
    <bread-crumb>
      <span
        slot="goback"
        style="float: right"
        @click="$router.go(-1)"
        class="doaction"
      >
        返回</span
      >
    </bread-crumb>
    <!-- 宠物信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>宠物信息</span>
        <span
          style="color: blueviolet"
          @click="updateInfo = true"
          class="doaction"
          >更新登记证</span
        >
      </div>
      <div class="content">
        <el-row>
          <el-col :span="8">宠物名称：{{ petInfo.name }}</el-col>
          <el-col :span="8">宠物类型：{{ petInfo.pet_type }}</el-col>
          <el-col :span="8">宠物品种：{{ petInfo.breed }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">宠物毛色：{{ petInfo.coat_color }}</el-col>
          <el-col :span="8">小区名称：{{ petInfo.community_name }}</el-col>
          <el-col :span="8"
            >宠物登记：<el-tag
              :type="petInfo.pet_license ? 'success' : 'info'"
              >{{ petInfo.pet_license ? "已登记" : "未登记" }}</el-tag
            ></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8">证书编号：{{ petInfo.pet_license }}</el-col>
          <el-col :span="8"
            >发证日期：{{
              petInfo.pet_license_award_at | formatDate("YYYY-MM-DD")
            }}</el-col
          >
          <el-col :span="8">主人信息：{{ petInfo.wechat_mp_user_id }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8"
            >宠物照片：<img :src="petInfo.photo" alt="" width="80" height="80"
          /></el-col>
          <el-col :span="8"
            >是否注销：<el-tag :type="petInfo.remove ? 'success' : 'info'">{{
              petInfo.remove ? "是" : "否"
            }}</el-tag></el-col
          >
          <el-col :span="8" v-if="petInfo.remove"
            >注销时间：{{ petInfo.remove_at | formatDate() }}</el-col
          >
        </el-row>
        <el-row v-if="petInfo.remove">
          <el-col :span="8" v-if="petInfo.remove"
            >注销原因：{{ petInfo.remove_reason }}</el-col
          >
        </el-row>
      </div>
    </el-card>
    <!-- 更新宠物登记信息 -->
    <el-dialog :visible.sync="updateInfo">
      <span slot="title">更新宠物登记证</span>
      <el-form ref="updateform" :model="updateform" :rules="updaterules">
        <el-form-item prop="pet_license" label="证书编号">
          <el-input
            v-model="updateform.pet_license"
            placeholder="请输入登记编号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pet_license_award_at" label="发证日期">
          <el-date-picker
            v-model="updateform.pet_license_award_at"
            type="date"
            placeholder="选择日期"
            format="yyyy年MM月dd日"
            value-format="timestamp"
            style="width: 300px; float: left"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="updateInfo = false">取消</el-button>
        <el-button type="primary" @click="updatePetInfo">更新</el-button>
      </span>
    </el-dialog>

    <!-- 一疫苗接种历史 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>疫苗接种历史</span>
        <span style="color: skyblue" class="doaction" @click="deleteHis"
          >删除</span
        >
        <span
          style="color: blueviolet"
          @click="updatevacci = true"
          class="doaction"
          >添加</span
        >
      </div>
      <el-table :data="vacciInfo" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          v-for="item of columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </el-card>

    <!-- 添加疫苗信息 -->
    <el-dialog :visible.sync="updatevacci">
      <span slot="title">疫苗接种信息</span>
      <el-form
        ref="updatevacciform"
        :model="updatevacciform"
        :rules="updatevaccirules"
      >
        <el-form-item prop="vaccine_type" label="疫苗类型">
          <el-input
            v-model="updatevacciform.vaccine_type"
            placeholder="请输入疫苗类型"
          ></el-input>
        </el-form-item>
        <el-form-item prop="vaccinated_at" label="接种日期">
          <el-date-picker
            v-model="updatevacciform.vaccinated_at"
            type="date"
            placeholder="选择接种日期"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            style="width: 300px; float: left"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="updatevacci = false">取消</el-button>
        <el-button type="primary" @click="updatevacciconfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
import { mixins } from "@/minxin";
export default {
  components: { breadCrumb },
  mixins: [mixins],
  name: "detailVue",
  mounted() {
    this.getData();
  },
  data() {
    return {
      petInfo: {},
      vacciInfo: [],
      updateInfo: false,
      updateform: {
        pet_license: "",
        pet_license_award_at: "",
      },
      updaterules: {
        pet_license: [{ required: true }],
        pet_license_award_at: [{ required: true }],
      },
      columns: [
        { prop: "vaccinated_at", label: "接种时间" },
        { prop: "vaccine_type", label: "接种类型" },
      ],
      updatevacciform: {
        vaccinated_at: "",
        vaccine_type: "",
      },
      updatevacci: false,
      updatevaccirules: {
        vaccinated_at: [{ required: true }],
        vaccine_type: [{ required: true }],
      },
      multipleSelection: [],
    };
  },
  methods: {
    //获取数据
    getData() {
      this.$request({
        url: "/pet/detail",
        method: "post",
        data: {
          community_id: this.community_id,
          id: this.petId,
        },
      }).then((res) => {
        this.petInfo = res.data.data.info;
        this.vacciInfo = res.data.data.vaccinates;
        this.vacciInfo = this.vacciInfo.map((item) => {
          item.vaccinated_at = this.standDate(item.vaccinated_at);
          return item;
        });
      });
    },
    //更新宠物信息
    updatePetInfo() {
      ///先验证表单
      this.$refs["updateform"].validate((valid) => {
        if (valid) {
          //向后端发送请求
          this.$request({
            url: `/pet/license/${this.petId}`,
            method: "post",
            data: {
              community_id: this.community_id,
              ...this.updateform,
            },
          }).then((res) => {
            this.petInfo.pet_license = this.updateform.pet_license;
            this.petInfo.pet_license_award_at =
              this.updateform.pet_license_award_at;
            this.updateInfo = false;
          });
        }
      });
    },
    //添加疫苗信息
    updatevacciconfirm() {
      this.$refs["updatevacciform"].validate((valid) => {
        if (valid) {
          this.$request({
            url: `/pet/vaccinate/${this.petId}`,
            method: "post",
            data: {
              community_id: this.community_id,
              ...this.updatevacciform,
            },
          }).then(() => {
            this.vacciInfo.push(this.updatevacciform);
            this.updatevacci = false;
          });
        }
      });
    },
    //删除宠物疫苗接种记录处理
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //根据multipleSelction表示需要删除的记录，vacciInfo表示全部信息。首先发送请求给后端，返回成功后前端处理，在vacciInfo中删除multipleSelection的内容进行删除
    deleteHis() {
      if (this.multipleSelection.length == 0) {
        this.notifyError("请选择需要删除的接种历史");
      } else {
        this.$request({
          url: "/pet/deleteVacciHis",
          method: "post",
          data: {
            community_id: this.community_id,
            id: this.petId,
            deletItems: this.multipleSelection,
          },
        }).then(() => {
          let res1 = this.vacciInfo.filter((item) => {
            return !this.multipleSelection.includes(item);
          });
          this.vacciInfo = res1;
        });
      }
    },
  },
  computed: {
    petId() {
      return this.$route.query.id;
    },
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
}
.content {
  font-size: 15px;
}
.content img {
  vertical-align: text-top;
}
.el-row{
	display: flex;
    justify-content: flex-start;
    text-align: left;
    margin-top: 10px;
}
</style>
