import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        { path: 'home', component: () => import('@/views/home/index.vue') },
        { path: 'user-info', component: () => import('@/views/user/userInfo.vue') },
        { path: 'user-avatar', component: () => import('@/views/user/userpic.vue') },
        { path: 'user-pwd', component: () => import('@/views/user/userpwd.vue') }
      ]
    },
    { path: '/reg', component: () => import('@/views/register/index.vue') },
    { path: '/log', component: () => import('@/views/login/index.vue') }
  ]
})

const whiteList = ['/log', '/reg'] // 白名单
// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 有token证明已经登录（token过期了怎么办？后端返回结果是的HTTP响应状态为401）
  if (token) {
    if (token && !store.state.userInfo.username) {
      store.dispatch('getUserInfo')
    }
    next()
  } else {
    // 没有token且不在白名单
    // 数组.includes(参数)，参数在数组中则返回true，否则是false
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/log')
    }
  }
})

export default router
