
import { informRouter } from './inform/informRouter'
import { dashboardRouter } from './dashboard/dashboardRouter'
import { meetingRoute } from './meeting/meetingRouter'
export const oaRouter={
	path:'/oa',
	meta:{
		title:'协同办公'
	},
	component:()=>import('./index'),
	children:[dashboardRouter,informRouter,meetingRoute]
}