// 使用websocket实现二维码登录
const Koa = require("koa");
const app = new Koa();
const WebSocket=require('ws')
const server=require('http').createServer(app.callback())
const wss=new WebSocket.Server({server})


wss.on('connection',(ws)=>{
	console.log('web')
	ws.on('message',(message)=>{
		console.log('mess from user')
	})
	ws.send('hello')
})

server.listen(400,()=>{
	console.log('11')
})

module.exports={
	server
}