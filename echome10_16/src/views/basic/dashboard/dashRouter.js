export let dashboardRouter={
	path:'/basic',
	name:"服务统计",
	meta:{
		title:"服务统计",
		nav:true,
		authRequired:true,
		layout:'slider',
		icon:'el-icon-user'
	},
	component:()=>import('views/basic/dashboard/index'),
}