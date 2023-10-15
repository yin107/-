const Router = require("koa-router");
const service = require("../lib/mysql");
const controller = require("../router_handler/userHandler");

const router = new Router();

router.prefix("/pc");

router.post("/user/account_login", controller.checkLogin);
router.post("/init/run", controller.registerUser);

//获取用户数据
router.get("/user/info", controller.getInfo);

router.get("/user/refresh", controller.refreshT);

const multiparty = require("multiparty");
const path = require("path");
const fs = require("fs-extra");
const targetPath = path.resolve(__dirname, "../target");





module.exports = router;
