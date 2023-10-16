export let  dashRouter={
	path:'/iot',
	name:'物联拓扑',
	meta:{
		title:'物联拓扑',
	nav:true,
	authRequired:true,
		layout:'slider'
	},
	component:()=>import('./index')
}