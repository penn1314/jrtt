import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/view/Login/login.vue'
import User from '@/view/User/User.vue'
import Home from '@/view/Home/Home.vue'
import Layout from '@/view/Layout/Layout.vue'
import Search from '@/view/Search/Search.vue'
import SearchResult from '@/view/Search/SearchResult.vue'
import ArticleDetail from '@/view/ArticleDetail/ArticleDetail.vue'
import UserEdit from '@/view/User/UserEidt.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/layout/home' }, // 首页
  { path: '/login', component: Login }, // 登录页
  {
    path: '/layout',
    component: Layout,
    children: [
      { path: 'home', component: Home }, // 首页
      { path: 'user', component: User } // 我的 页面
    ]
  },
  { path: '/search', component: Search }, // 搜索页面
  { path: '/search_result/:kw', component: SearchResult, props: true }, // 搜索结果页面
  { path: '/detail', component: ArticleDetail },
  { path: '/user_edit', component: UserEdit }
]

const router = new VueRouter({
  routes
})

export default router
