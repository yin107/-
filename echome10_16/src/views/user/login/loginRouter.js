export let loginRouter = {
  path: "/user/login",
  name: "login",
  meta: {
    title: "登录页",
    nav: false, 
	layout:null
  },
  component: () => import("./index"),
};
