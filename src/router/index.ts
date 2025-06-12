import { createRouter, createWebHistory } from 'vue-router'
import UsrEncrypt from '../views/UsrEncrypt.vue'

const routes = [
  {
    path: '/',
    redirect: '/usr-encrypt'
  },
  {
    path: '/usr-encrypt',
    name: 'UsrEncrypt',
    component: UsrEncrypt,
    meta: {
      title: '🐌 SnailLab - 蜗牛实验室'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router 