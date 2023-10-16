
import {loginRouter} from './login/loginRouter'
import { initRouter } from './init/initRouter'
export let userRouter={
	path:'/user',
	name:'user',
	component:()=>import('./index'),
	children:[loginRouter,initRouter]
}