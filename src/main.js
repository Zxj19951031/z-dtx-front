import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import dbApi from './api/dbApi'
import ruleApi from "@/api/ruleApi";
import respHandler from "@/response/respHandler";

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$dbApi = dbApi
Vue.prototype.$ruleApi = ruleApi
Vue.prototype.$respHandler = respHandler


new Vue({
    render: h => h(App),
    router
}).$mount('#app')
