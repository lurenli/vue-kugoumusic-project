import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import {routes} from './router';
import axios from 'axios';
import MintUI from 'mint-ui';
import {store}  from './store/index.js';
import 'mint-ui/lib/style.css';
import './assets/css/neat-min.css';
import './assets/css/style.css';
import $ from 'jquery';
Vue.prototype.$http = axios

Vue.use(MintUI);
Vue.use(VueRouter);
Vue.use(axios)





const router = new VueRouter({
	routes:routes, // 可以直接写成routes
	mode:'history' // mode设置成history，那么地址就可以请求http://localhost:8080/user
});
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

