const Router=require('koa-router')
const userRouter=require('./user')

let router=new Router()

router.use(userRouter.routes())



module.exports=router


