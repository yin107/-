import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import { basicRouter } from "@/views/basic/basicRouter";
import { homebasic } from "@/views/home/redirectRouter";
import { iotRouter } from "@/views/iot/iotRouter";
import { userRouter } from "@/views/user/userRouter";
import { userCenterRouter } from "@/views/center/centerCenterRouter";
import { oaRouter } from "@/views/oa/oaRouter";
const myroutes = [
  homebasic,
  basicRouter,
  iotRouter,
  userRouter,
  userCenterRouter,
  oaRouter ,
  {
	path:'*',
	redirect:'/basic'
  }
];
const router = new Router({
  mode: "history",
  routes: myroutes,
});
export default router;

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  if (to.meta.authRequired && !token) {
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});
