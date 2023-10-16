<template>
  <div>
    <bread-crumb></bread-crumb>
    <el-card style="margin-top: 20px">
      <!-- 步骤条 -->
      <el-steps :active="step" align-center>
        <el-step title="业主信息" description="通过手机号查找业主"></el-step>
        <el-step title="宠物信息" description="录入宠物信息"></el-step>
        <el-step title="建档成功" description="档案创建完成"></el-step>
      </el-steps>

      <div v-if="step == 1">
        <div class="info">
          <div class="icon"><i class="el-icon-warning"></i></div>
          <div class="context">
            <p>业主手机号码是业主唯一身份识别标识</p>
            <p>
              未注册小程序的业主需要先引导注册，手机号必须与微信绑定手机号一致。
            </p>
          </div>
        </div>
        <div class="input">
          <el-input
            type="text"
            placeholder="请输入业主手机号"
            v-model="userPhone"
            style="width: 80%"
          >
            <template slot="prepend"
              ><i class="el-icon-user-solid"></i
            ></template>
          </el-input>
        </div>
        <el-button type="primary" style="margin-top: 20px" @click="nextStep1"
          >下一步</el-button
        >
      </div>
      <div v-if="step == 2">
        <el-form
          label-position="right"
          label-width="180px"
          ref="petInfo"
          :model="petInfo"
          style="width: 80%; margin-top: 20px"
          :rules="petInfoRules"
        >
          <el-form-item label="业主姓名："
            ><span style="float: left">{{
              userinfo.real_name
            }}</span></el-form-item
          >
          <el-form-item prop="pet_type" label="宠物类型：">
            <el-input
              placeholder="请输入宠物类型"
              v-model="petInfo.pet_type"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="宠物名称：">
            <el-input
              placeholder="请输入宠物名称"
              v-model="petInfo.name"
            ></el-input>
          </el-form-item>
          <el-form-item prop="sex" label="雌雄：">
            <el-radio-group
              v-model="petInfo.sex"
              size="medium"
              style="float: left"
            >
              <el-radio border label="雌"></el-radio>
              <el-radio border label="雄"></el-radio
            ></el-radio-group>
          </el-form-item>
          <el-form-item prop="photo" label="上传照片：">
            <el-upload style="float: left" action="">
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item prop="coat_color" label="宠物毛色：">
            <el-input
              v-model="petInfo.coat_color"
              placeholder="请输入宠物毛色"
            ></el-input>
          </el-form-item>
          <el-form-item prop="breed" label="宠物品种：">
            <el-input
              v-model="petInfo.breed"
              placeholder="请输入宠物品种"
            ></el-input>
          </el-form-item>
          <el-form-item prop="haveLicense" label="已办理宠物登记证：">
            <el-switch
              v-model="petInfo.haveLicense"
              style="float: left"
            ></el-switch>
          </el-form-item>
          <template v-if="petInfo.haveLicense">
            <el-form-item prop="pet_license" label="证书编号：">
              <el-input
                v-model="petInfo.pet_license"
                placeholder="请输入证书编号"
              ></el-input>
            </el-form-item>
            <el-form-item prop="pet_license_award_at" label="发证日期：">
              <el-date-picker
                v-model="petInfo.pet_license_award_at"
                type="date"
                placeholder="请选择发证日期"
                format="yyyy年MM月dd日"
                value-format="timestamp"
                style="float: left"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="vaccinated_at" label="接种日期">
              <el-date-picker
                v-model="petInfo.vaccinated_at"
                type="date"
                placeholder="请选择发证日期"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
                style="float: left"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="vaccine_type" label="疫苗类型：">
              <el-input
                v-model="petInfo.vaccine_type"
                placeholder="请输入疫苗类型"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
        <el-button @click="step--">上一步</el-button
        ><el-button type="primary" @click="nextStep2">下一步</el-button>
      </div>
      <div v-if="step == 3">
        <data-create-suc @gotoDetail="gotoDetail">
			<div slot="suce-info">
				宠物档案登记成功
			</div>
          <div slot="mention-info">
            <p>提醒业主按时录入疫苗接种信息。</p>
            <p>遛狗需要纤绳。</p>
            <p>注意公共环境卫生</p>
          </div>
        </data-create-suc>
		<el-button type="primary" @click="gotoDetail">查看宠物信息</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
import dataCreateSuc from "components/dataCreateSuc";
export default {
  components: { breadCrumb, dataCreateSuc },
  data() {
    return {
      userPhone: "",
      userinfo: {
        real_name: "dd",
      },
      petInfo: {
        pet_type: "",
        name: "",
        sex: "",
        photo: "",
        coat_color: "",
        breed: "",
        haveLicense: undefined,
        pet_license: "",
        pet_license_award_at: "",
        vaccinated_at: "",
        vaccine_type: "",
      },
      petInfoRules: {
        pet_type: [{ required: true }],
        name: [{ required: true }],
        sex: [{ required: true }],
        coat_color: [{ required: true }],
        breed: [{ required: true }],
        pet_license: [{ required: true }],
        pet_license_award_at: [{ required: true }],
        vaccinated_at: [{ required: true }],
        vaccine_type: [{ required: true }],
      },
      step: 1,
    };
  },
  methods: {
    nextStep1() {
      //首先对userPhone进行校验
      if (!/^1\d{10}$/.test(this.userPhone)) {
        this.notifyError("请输入正确的手机号码");
      } else {
        //向后端发送请求查询用户信息
        this.$request({
          url: "/option/owner",
          method: "post",
          data: {
            phone: this.userPhone,
            community_id: this.community_id,
          },
        }).then((res) => {
          //能够查到用户之后，就进入下一个步骤
          this.userinfo = res.data.data;
          this.step++;
          this.userPhone = "";
        });
      }
    },
    nextStep2() {
      this.$refs["petInfo"].validate((valid) => {
        if (valid) {
          //通过表单验证的话就向后端发送请求
          this.$request({
            url: "/pet/create",
            method: "post",
            data: {
              ...this.petInfo,
              community_id: this.community_id,
              user_id: this.user_id,
            },
          }).then((res) => {
            this.step++;
            this.petInfo = {
              pet_type: "",
              name: "",
              sex: "",
              photo: "",
              coat_color: "",
              breed: "",
              haveLicense: undefined,
              pet_license: "",
              pet_license_award_at: "",
              vaccinated_at: "",
              vaccine_type: "",
            };
          });
        }
      });
    },
    gotoDetail() {
      this.$router.push({ name: "detailpet", query: { id: 9 } });
      this.step = 1;
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
    user_id() {
      if (this.$store.getters.getUserInfo.id != undefined) {
        return this.$store.getters.getUserInfo.id;
      } else {
        return "1";
      }
    },
  },
  deactivated() {
    this.step = 1;
  },
};
</script>

<style scoped>
.info {
  width: 80%;
  height: 100px;
  background-color: #c0dcee;
  margin: 10px auto;
  display: flex;
  padding: 0px 10px;
  box-sizing: border-box;
}
.icon {
  width: 40px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  margin-right: 10px;
}

.context {
  text-align: left;
}

.el-switch {
  height: 40px;
}
</style>
