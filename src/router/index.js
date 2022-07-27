import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/log' },
    { path: '/index', component: () => import('@/views/layout/index.vue') },
    { path: '/reg', component: () => import('@/views/register/index.vue') },
    { path: '/log', component: () => import('@/views/login/index.vue') }
  ]
})

// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token && !store.state.userInfo.username) {
    store.dispatch('getUserInfo')
  }
  next()
})

export default router
