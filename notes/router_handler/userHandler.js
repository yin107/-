const user = require("../service/user");
const jwt = require("koa-jwt");
async function checkLogin(ctx, next) {
  let loginData = ctx.request.body;
  let data = await user.checkLogin1(loginData);
  return (ctx.response.body = data);
}

async function registerUser(ctx, next) {
  let requestData = ctx.request.body;
  let data = await user.findUser(requestData);
  // let data=await user.registerUser()
  return (ctx.response.body = data);
}

//获取用户信息
async function getInfo(ctx, next) {
  let data = await user.getInfo(ctx.state.user.data);
  return (ctx.response.body = data);
}

async function refreshT(ctx, next) {
	let pass=ctx.headers
  let data = await user.refreshT(pass);
  return (ctx.response.body = data);
}

module.exports = {
  checkLogin,
  registerUser,
  getInfo,
  refreshT,
};
