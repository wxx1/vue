import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
//懒加载  
const list = ()=> import('../views/list.vue')
const cart = () => import('../views/cart.vue')
const productDetails = () => import('../views/productDetails')
const routes = [
  {
    path:'/',
  component:list
  },
  {
    path:'/list',
    component:list
  },
  {
    path:'/cart',
    component:cart
  },
  {
    path:'/product/:id',
    component:productDetails
  }
]
const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
