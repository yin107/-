<template>
  <div>
    <div class="header">系统初始化信息</div>
    <!-- 信息 -->
    <div class="info">
      <!-- 个人信息 -->
      <el-card class="box-card">
        <div slot="header">
          <span>个人基本资料</span>
        </div>
        <!-- form表单区域 -->
        <form-finish
          :name="usermessForm.formName"
          :FormRes.sync="usermessForm.FormRes"
          :FormData.sync="usermessForm.FormData"
          ref="Mymess"
        ></form-finish>
      </el-card>

      <!-- 小区信息 -->
      <el-card class="box-card">
        <div slot="header">
          <span>初始化小区信息</span>
        </div>
        <form-finish
          :name="commuForm.formName"
          :FormRes.sync="commuForm.FormRes"
          :FormData.sync="commuForm.FormData"
          ref="comuMess" @selectedAddress="selectedAddress"
        ></form-finish>
      </el-card>
    </div>
    <el-button @click="$router.push({ name: 'login' })">返回登录页</el-button>
    <el-button @click="regester()" type="primary">注册</el-button>



 </div>
</template>

<script>

import formFinish from "@/components/formFinish.vue";
export default {
  components: { formFinish },
  data() {
    return {
		selectOptions:[],

      usermessForm: {
        formName: "usermessForm",
        FormRes: {
          real_name: "尹采云",
          idcard: "430525199902093329",
          avatar_url: undefined,
          phone: "18397681878",
          account: "红薯粉丝",
          password: "w12345678",
          password2: "w12345678",
        },
        FormData: {
          Info: [
            {
              label: "姓名",
              prop: "real_name",
              type: "input",
            },
            {
              label: "身份证号",
              prop: "idcard",
              type: "input",
            },
            {
              label: "手机号码",
              prop: "phone",
              type: "input",
            },
            {
              label: "登录账号",
              prop: "account",
              type: "input",
            },
            {
              label: "登录密码",
              prop: "password",
              type: "input",
              ispass: true,
            },
            {
              label: "确认登录密码",
              prop: "password2",
              type: "input",
              ispass: true,
            },
          ],
          Rules: {
            real_name: [
              { required: true, message: "请输入您的真实姓名" },
              { max: 8, message: "姓名不能超过8个字符" },
            ],
            idcard: [
              { required: true, message: "请输入您的身份证号码" },
              { pattern: /^\d{17}\d|x$/i, message: "请输入正确的身份证号码" },
            ],
            phone: [
              { required: true, message: "请输入您的手机号码" },
              { pattern: /^\d{11}$/, message: "请输入正确的手机号码" },
            ],
            account: [
              { required: true, message: "请输入账号" },
              { min: 4, message: "账号的长度应该大于4个字符" },
            ],
            password: [
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码的长度应该大于6个字符" },
            ],
            password2: [
              { required: true, message: "请确认密码" },
              { min: 6, message: "密码的长度应该大于6个字符" },
              {
                validator: (rule, val, cb) => {
                  if (
                    val &&
                    this.usermessForm.FormRes.password &&
                    val === this.usermessForm.FormRes.password
                  ) {
                    cb();
                  } else {
                    this.notifyError("两次输入的密码不一致");
                    new Error("两次输入的密码不一致");
                  }
                },
                message: "两次输入的密码不一致",
              },
            ],
          },
        },
      },

      commuForm: {
        formName: "commuForm",
        FormRes: {
          name: "cfdfd",
          address: "fddf",
          service_phone: "18397681878",
          banner: "",
          access_nfc: 0,
          access_qrcode: 0,
          access_remote: 0,
          fitment_pledge: 0,
          carport_max_car: 1,
        },
        FormData: {
          Info: [
            { label: "小区名称", prop: "name", type: "input" },
            { label: "小区所在地", prop: "address", type: "address" },
            { label: "客服电话", prop: "service_phone", type: "input" },
            {
              label: "NFC门禁",
              prop: "access_nfc",
              type: "switch",
              actCol: "#13ce66",
              inacCol: "#ff4949",
              actV: 1,
              inacV: 0,
            },
            {
              label: "二维码门禁",
              prop: "access_qrcode",
              type: "switch",
              actCol: "#13ce66",
              inacCol: "#ff4949",
              actV: 1,
              inacV: 0,
            },
            {
              label: "远程开门",
              prop: "access_remote",
              type: "switch",
              actCol: "#13ce66",
              inacCol: "#ff4949",
              actV: 1,
              inacV: 0,
            },
            {
              label: "装修保证金",
              prop: "fitment_pledge",
              type: "switch",
              actCol: "#13ce66",
              inacCol: "#ff4949",
              actV: 1,
              inacV: 0,
            },
            {
              label: "车位绑定车辆数",
              prop: "carport_max_car",
              type: "inputNumber",
              controlPos: "right",
              min: 1,
            },
          ],
          Rules: {
            name: [
              { required: true, message: "请输入小区名称" },
              { max: 12, message: "小区名称不能超过12个字符" },
            ],
            address: [{ required: true }],
            service_phone: [
              { required: true, message: "请输入小区客户电话" },
              { pattern: /^\d{11}$/, message: "请输入正确的电话号码" },
            ],
            access_nfc: [{ required: true, type: "number" }],
            access_qrcode: [{ required: true, type: "number" }],
            access_remote: [{ required: true, type: "number" }],
            fitment_pledge: [{ required: true, type: "number" }],
            carport_max_car: [
              {
                required: true,
                pattern: /^\d+$/,
                message: "请输入正确的车位可绑定车辆的数目",
              },
            ],
          },
        },
      },
    };
  },
  mounted() {
    console.log(this.$refs["Mymess"].$refs["usermessForm"]);
  },
  methods: {
	selectedAddress(val){
		this.commuForm.FormRes.address=val
	},
    checkForm(forName) {
      return new Promise((resolve, reject) => {
        this.$refs["Mymess"].$refs[forName].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject("请输入正确的信息");
          }
        });
      });
    },
	checkForm2(forName) {
      return new Promise((resolve, reject) => {
        this.$refs["comuMess"].$refs[forName].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject("请输入正确的信息");
          }
        });
      });
    },
    regester() {
      // 先对两个form表单进行验证
      Promise.all([
        this.checkForm("usermessForm"),
        this.checkForm2("commuForm"),
      ])
        .then(() => {
          //表单验证成功的话，就发送请求
          const { code, state } = this.$route.query;
          const obj2 = {
            province: "湖南省",
            city: "邵阳市",
            district: "洞口",
            code,
            state,
            open_id: 1,
          };
          const data = Object.assign(
            this.usermessForm.FormRes,
            this.commuForm.FormRes,
            obj2
          );

          delete data.address;
          this.$mylocalrequest({
            url: "/init/run",
            method: "post",
            data: data,
          })
            .then(() => {
              //注册成功之后就跳转到登录页
              this.$router.push({ path: "/user/login" });
            })
            .catch((err) => {
              this.notifyError(err);
            });
        })
        .catch((err) => {
          this.notifyError(err);
        });
    },
  },
  name: "indexVue",
};
</script>

<style scoped>
.header {
  width: 100vw;
  height: 100px;
  line-height: 100px;
  font-size: 30px;
  display:inline-block;
  text-align: center;
  margin-bottom: 20px;
  background-color: #e8e4e4;
  box-shadow:2px 7px 0.7 #545050
}.box-card {
  width: 90%;
  margin: 20px auto;
}
</style>
