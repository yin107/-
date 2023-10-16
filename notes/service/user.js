// 查询数据库，根据查询结果判断，返回数据到contro
const bcrypt = require("bcrypt");
const { allSqlAction } = require("../lib/mysql");
const jsonwebtoken = require("jsonwebtoken");
const { password } = require("../config/dbConfig");
//先查询用户是否存在
async function findUser(regiData) {
  let sql = `select * from ejyy_property_company_user where account="${regiData.account}"`;
  return allSqlAction(sql).then((res) => {
    if (res.length === 0) {
      regiData.password = bcrypt.hashSync(regiData.password, 10);
      return registerUser1(regiData);
    } else {
      return { msg: "用户已经存在", code: 202 };
    }
  });
}

//先是用户注册
async function registerUser1(regiData) {
  let sql = `insert into ejyy_property_company_user(account,real_name,idcard,phone,password) values ("${regiData.account}","${regiData.real_name}","${regiData.idcard}","${regiData.phone}","${regiData.password}")`;

  return allSqlAction(sql).then((res) => {
    if (res.affectedRows === 1) {
      return { msg: "注册成功", code: 200 };
    } else {
      return { msg: "注册失败", code: 20 };
    }
  });
}
const secret = "jwt_secret";
const refreshSecret = "jwt_secret_refresh";
//用户登录
async function checkLogin1(loginData) {
  let sql = `select * from ejyy_property_company_user where account="${loginData.account}"`;

  return allSqlAction(sql).then((res) => {
    let ischeck = bcrypt.compareSync(loginData.password, res[0].password);
    if (res.length === 1 && ischeck) {
      let newObj = Object.assign(res[0]);
      delete newObj[password];
      return {
        msg: "登录成功",
        code: 200,
        data: {
          token:
            "Bearer " +
            jsonwebtoken.sign(
              {
                data: newObj, //token里面不能保存密码等信息
                // exp: (1 * 60*60),//秒为单位
              },
              secret,
              { expiresIn: 30*60*20 } //设置了30秒过期
            ),
          refreshToken:
            "Bearer " +
            jsonwebtoken.sign(
              {
                data: newObj, //token里面不能保存密码等信息
                // exp: (1 * 60*60),//秒为单位
              },
              refreshSecret,
              { expiresIn: 60 * 60 } //设置1个小时过期
            ),
          userInfo: {},
          postInfo: {},
        },
      };
    } else {
		console.log(res,ischeck)
      return {
        msg: "登录失败",
        code: 201,
      };
    }
  });
}

//获取用户信息
async function getInfo(userTotalInfo) {
  let obj = { real_name: userTotalInfo.real_name };
  return {
    msg: "获取数据成功",
    code: 200,
    data: {
      userInfo: obj,
    },
  };
}

const jwt = require("koa-jwt");
async function refreshT(auth) {
  //怎么对refreshtoken进行验证，之后再返回刷新后的accesstoken
  return "00";
}

module.exports = {
  registerUser1,
  findUser,
  checkLogin1,
  getInfo,
  refreshT,
};
