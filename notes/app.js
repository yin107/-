const serve=require('./websocket/login/login')
const Koa = require("koa");
const router = require("./router/totalRouter");
const {koaBody }= require("koa-body"); //解析表单数据
const app = new Koa();
const secret = "jwt_secret";
const jwt = require("koa-jwt");
const refreshSecret='jwt_secret_refresh'

const cors = require("koa2-cors");

const static=require('koa-static')
const WebSocket=require('ws')
const server=require('http').createServer(app.callback())
const wss=new WebSocket.Server({server})


app.use(
  cors({
    origin: function (ctx) {
      return "*";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);
const path=require('path')
app.use(koaBody({
	multipart:true,
	enableTypes:['json','form','text'],
	keepExtensions: true,
	formidable: {
        maxFileSize: 500*1024*1024	// 设置上传文件大小最大限制，默认2M
    },
	//是否支持multipart-formdate的表单
}));

app.use(static(__dirname,+'/target',{
	index:false,
	hidden:false,
	defer:false
}))


app.use(async (ctx, next) => {
	
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status= 401;//如果这里不写ctx.status=401的话就默认是ctx.status=200,即响应成功就不会进入到错误的回调中
      ctx.body = {
        code: 401,
        error: err.originalError ? err.originalError.message : err.message,
      };
    } else {
      throw err;
    }
  });
});

app.use(
	jwt({ secret }).unless({
	  path: [/\/init\/run/, /\/user\/account_login/, /\/user\/refresh/],
	})
  );








app.use(router.routes());

app.use(async (ctx) => {
  console.log("404");
});




app.listen(300);
