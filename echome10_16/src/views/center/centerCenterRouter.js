export let userCenterRouter = {
  path: "/user",
  meta: {
    title: "用户",
  },
  component: () => import("./userindex"),
  children: [
    {
      path: "/user/zone",
      name: "userzone",
      meta: {
        title: "个人中心",
      },
      component: () => import("./index"),
      children: [
        {
          path: "/user/zone",
          name: "zone",
          meta: {
            title: "我的资料",
            nav: true,
            layout: "slider",
          },
          component: () => import("./userInfo"),
        },
        {
          path: "/user/reset",
          name: "reset",
          meta: {
            title: "修改密码",
            nav: true,
            layout: "slider",
          },
          component: () => import("./userReset"),
        },
      ],
    },
  ],
};
