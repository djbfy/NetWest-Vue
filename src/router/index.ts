import { createRouter, createWebHistory } from 'vue-router'
// 引入创建路由模式 history模式
import webNest from '../components/WebNest.vue'
import plum from '../components/bg/plum.vue'
import HtmlApi from '../components/Pages/HtmlApi.vue'
// 引入路由各页面配置
const pageRoutes  = [
  {
    path: '/',
    name: 'webNest  ',
    component: webNest
  },
  {
    path: '/plum',
    name: 'plum  ',
    component: plum
  },
  {
    path: '/HtmlApi',
    name: 'HtmlApi  ',
    component: HtmlApi
  },
]
 
const router = createRouter({
  history: createWebHistory(),//hash模式
  //createWebHistory(process.env.BASE_URL),histroy模式
 routes: pageRoutes})

export default router
