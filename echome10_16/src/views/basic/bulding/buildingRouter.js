export let buildingRouter = {
  path: "/basic/building",
  name: "buildingindex",
  meta: {
    title: "房产档案",
	icon:'el-icon-user'
  },
  component: () => import("./index"),
  children: [
    {
      path: "/basic/building",
      name: "building",
      meta: {
        title: "全部房产",
        nav: true,
        layout: "slider",
      },
      component: () => import("./list"),
    },
    {
      path: "/basic/building/import",
      name: "importbuilding",
      meta: {
        title: "房产导入",
        nav: true,
        layout: "slider",
      },
      component: () => import("./create"),
    },
	{
		path:'/basic/building/detail',
		name:'detailbuilding',
		meta:{
			title:'房产详情',
			nav:false,
			layout:'slider'
		},
		component:()=>import('./detail')
	}
  ],
};
