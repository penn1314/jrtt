import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入amfe-flexible 根据网页宽度调试font-size的大小
import 'amfe-flexible'
// 使用vant组件
import '@/utils/vant.js'

Vue.config.productionTip = false

// 定义自动聚焦指令
Vue.directive('focus', {
  inserted(el) {
    const input = el.querySelector('input')
    input.focus()
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
