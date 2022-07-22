import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/reg', component: () => import('@/views/register/index.vue') },
    { path: '/log', component: () => import('@/views/login/index.vue') }
  ]
})

export default router
