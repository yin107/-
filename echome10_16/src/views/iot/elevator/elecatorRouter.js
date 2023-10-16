export let elecatorRouter= {
  path: "/iot/elevator",
  name: "智能电梯",
  meta: {
    title: "智能电梯",
  },
  component: () => import("./index"),
  children: [
    {
      path: "/iot/elevator",
      name: "通行记录",
      meta: {
        title: "通行记录",
        nav: true,
		authRequired:true,
		layout:'slider'
      },
      component: () => import("./log"),
    },
    {
      path: "/iot/elevator/manage",
      name: "电梯管理",
      meta: {
        title: "电梯管理",
        nav: true,
		authRequired:true,
		layout:'slider'
      },
      component: () => import("./manage"),
    },
  ],
};
