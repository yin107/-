<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
  <div class="box">
    <div class="login">
      <div class="header">账号密码登录</div>
      <el-card class="box-card">
        <el-form ref="loginInfo" :model="loginInfo" :rules="loginRules">
          <el-form-item prop="account">
            <el-input v-model="loginInfo.account" placeholder="请输入账号">
              <template slot="prepend">
                <i class="el-icon-user-solid"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginInfo.password"
              placeholder="请输入密码"
              type="password"
            >
              <template slot="prepend">
                <i class="el-icon-unlock"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="captcha" class="test">
            <el-col :span="11">
              <el-input
                v-model="loginInfo.captcha"
                placeholder="验证码"
                width="200"
              ></el-input>
            </el-col>
            <el-col :span="3"><div>&nbsp;</div></el-col>
            <el-col :span="10">
              <img :src="testUrl" alt="" width="100%" height="40" />
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="btn">
        <el-button type="primary" @click="login()"> 登录 </el-button>
        <el-button @click="$router.push({ name: 'init' })">注册</el-button>
      </div>
	  <img>
    </div>
  </div>
</template>

<script>
import VueNativeSock from 'vue-native-websocket'
import Vue from 'vue'
export default {
  name: "loginVue",
  data() {
    return {
      loginInfo: {
        account: "",
        password: "",
        captcha: "",
      },
      loginRules: {
        account: [
          { required: true, message: "请输入账号" },
          { min: 4, message: "账号长度应该大于4个字符" },
        ],
        password: [{ required: true, message: "请输入密码" }],
        captcha: [{ required: true, message: "请输入验证码" }],
      },
      testUrl: "",
    };
  },
  created() {
    //获取验证码图片
    this.$request({
      url: "/user/captcha",
      method: "get",
    })
      .then((res) => {
        this.testUrl = res.data.data.img;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  mounted(){
	Vue.use(VueNativeSock,'ws://localhost:400',{
		reconnection:true,
	})

	this.$socket.onmessage=(message)=>{
		//服务端传递过来的数据
		//当服务端验证通过之后，就可以直接跳转到首页
		console.log(message,'---')
	}
  },
  methods: {
    login() {
      //首先进行表单规则的校验
      this.$refs.loginInfo.validate((valid) => {
        if (!valid) return;
        //通过校验 发送请求进行账号密码的验证，如果验证失败的话，就清空表单，并说明失败信息，以及重新刷新验证码
        this.$mylocalrequest({
          url: "/user/account_login",
          method: "post",
          data: this.loginInfo,
        }).then((res) => {
			console.log(res,'---')
          //验证成功 表单清空+路由跳转
          this.$store.commit("setToken", res.data.token);
          this.$store.commit("setUserInfo", res.data.userInfo);
          this.$store.commit("setPostInfo", res.data.postInfo);

          //登录成功之后跳转页面
          if (this.$route.query.redirect == undefined) {
            this.$router.push({ path: "/basic" });
          } else {
            this.$router.push(this.$route.query.redirect);
          }

          this.loginInfo = {
            account: "",
            password: "",
            captcha: "",
          };
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
.box {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  background: url(https://ts1.cn.mm.bing.net/th/id/R-C.55ac8437aee12f9d351af783a093af00?rik=52P45x%2fsuQMrhw&riu=http%3a%2f%2fnews.mydrivers.com%2fImg%2f20091207%2f09430342.png&ehk=E0LHTTLS4BMjFIybCY0W4PoX%2fNSho610ikL7Y%2flterc%3d&risl=&pid=ImgRaw&r=0)
    no-repeat;
  background-size: cover;
}
.login {
	padding-top:10px;
  width: 600px;
  height: 400px;
  background-color:rgba(244, 212, 244, 0.3);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
box-shadow: 4px 4px 6px #cab7b7;
  z-index: 1;
  .header {
    height: 40px;
    font-size: 30px;
    text-align: center;
    display: inline-block;
    line-height: 40px;
    width: 100%;
    margin-bottom: 20px;
  }
}
.box-card {
  width: 70%;
  margin: 0 auto;
}

.btn {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>
