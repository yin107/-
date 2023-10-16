import {dashboardRouter} from "./dashboard/dashRouter"
import {fitmentRouter}  from "./fitment/fitmentRouter"
import { petRouter } from "./pet/petRouter";
import { buildingRouter } from "./bulding/buildingRouter";
export let basicRouter = {
  path: "/basic",
  name: "basic",
  meta: {
    title: "物业服务",
	icon:"el-icon-user"
  },
  component: () => import("views/basic/index"),
  children: [
    dashboardRouter,
    fitmentRouter,
	petRouter,
	buildingRouter
  ],
};
