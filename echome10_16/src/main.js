//main.js
import Vue from 'vue'
import App from './views/app/App.vue'
import router from './router'
import store from './store'
import {request} from '@/network/config'//axios
import { mylocalrequest } from '@/network/config'
import { myrequest } from '@/network/config'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Moment from 'moment'
import echarts from "echarts";

import './assets/css/common.css'
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
Vue.prototype.$request=request
Vue.prototype.$mylocalrequest=mylocalrequest
Vue.prototype.$myrequest=myrequest
Vue.use(ElementUI);
new Vue({
	router,
	store,
  render: h => h(App),
}).$mount('#app')

Vue.prototype.notifyError=function (msg){
	this.$notify.error({
		title:"错误",
		message:msg,
		offset:50
	})
}
Vue.prototype.notifySuccess=function (msg){
	this.$notify({
		title:'成功',
		message:msg,
		type:'success',
		offset:50
	})
}

Vue.filter('formatDate',function(value,form='YYYY-MM-DD HH:mm:ss'){
	return Moment(value).format(form)
})

Vue.prototype.standDate=function(val,form='YYYY-MM-DD'){
	return Moment(parseInt(val)*1000).format(form)
}
Vue.prototype.standDate2=function(val,form='YYYY-MM-DD'){
	return Moment(parseInt(val)).format(form)
}


