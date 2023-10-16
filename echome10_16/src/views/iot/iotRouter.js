import { dashRouter } from "@/views/iot/dashboard/dashboardRouter";
import  {elecatorRouter}  from "@/views/iot/elevator/elecatorRouter";
export let iotRouter = {
  path: "/iot",
  name: "智慧物联",
  meta: {
    title: "智慧物联",
  },
  component: () => import("./index"),
  children: [dashRouter, elecatorRouter],
};
