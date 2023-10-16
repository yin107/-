export let fitmentRouter = {
  path: "/basic/fitment",
  name: "装修登记",
  meta: {
    title: "装修登记",
	icon:'el-icon-user'
  },
  component: () => import("./index"),
  children: [
    {
      path: "/basic/fitment",
      name: "全部装修",
      meta: {
        title: "全部装修",
        nav: true,
        authRequired: true,
        layout: "slider",
      },
      component: () => import("./list"),
    },
    {
      path: "/basic/fitment/create",
      name: "新建登记",
      meta: {
        title: "新建登记",
        nav: true,
        authRequired: true,
        layout: "slider",
      },
      component: () => import("./create"),
    },
    {
      path: "/basic/fitment/detail",
      name: "装修详情",
      meta: {
        title: "装修详情",
        nav: false,
        authRequired: true,
        layout: "slider",
      },
      component: () => import("./detail"),
    },
  ],
};
