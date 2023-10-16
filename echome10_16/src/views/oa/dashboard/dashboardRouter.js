export const dashboardRouter={
	path:'/oa',
	title:"oaDash",
	meta:{
		title:'工作台',
		nav:true,
		layout:'slider'
	},
	component:()=>import('./index')
}