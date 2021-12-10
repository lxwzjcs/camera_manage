import Vue from 'vue'
import VueRouter from 'vue-router'




Vue.use(VueRouter)

const routes = [
  {
    path: '/User',
    name: 'User',
    component: () => import('../views/User.vue')
  },
  {
    path: '/',
    name: 'User',
    component: () => import('../views/User.vue')
  },
  {
    path: '/Manager',
    name: 'Manager',
    component: () => import('../views/Manager.vue')
  },
  {
    path: '/Device',
    name: 'Device',
    component: () => import('../views/Device.vue')
  },
  {
    path: '/Mission',
    name: 'Mission',
    component: () => import('../views/Mission.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
