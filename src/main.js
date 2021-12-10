import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import axios from 'axios'
axios.defaults.withCredentials = true

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueRouter)

new Vue({
  router:router,
  store,
  render: h => h(App)
}).$mount('#app')

//刷新保存状态
if (sessionStorage.getItem("store")) {
  store.replaceState(
      Object.assign({},
          store.state,
          JSON.parse(sessionStorage.getItem("store"))
      )
  );
  sessionStorage.removeItem("store")
}

//监听，在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("store", JSON.stringify(store.state));
});
