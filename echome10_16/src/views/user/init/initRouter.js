export let initRouter={
	path:'/init',
	name:"init",
	meta:{
		name:'注册',
		authRequired:false,
		layout:null,
	},
	component:()=>import('./index')
}