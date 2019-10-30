import Vue from 'vue'
import Vuex from 'vuex'
//模拟请求的商品数据
import product_data from '../../product'
//从工具模块中导入
import { getFilterArray} from '../Utils/util'

Vue.use(Vuex)

export default new Vuex.Store({
  /**
   * 后期需要响应式的数据，先在此处定义，这样才会加入到Vue响应式系统中
   */
  state: {
    productList: [],//数据列表
    cartList: []//购物车数据列表
  },
  getters:{
    //得到去重后的所有品牌
    brands(state){
      //得到productList中所有品牌
      const brands=state.productList.map(item => item.brand)
      //去重
      return getFilterArray(brands)
    },
    //得到去重后的所有品牌
    colors(state){
      const colors = state.productList.map(item => item.color)
      return getFilterArray(colors)
    }
  },
  /**
   * 只有mutation可修改state中数据
   * 同步请求
   */
  mutations: {
    //将请求过来的数据添加到商品列表
    setProductList(state,product) {
      state.productList=product
    },
    //向商品列表中添加数据——加入购物车
    addCart(state,productId){
      //判断购物车是否已有，如果有，数量加1
      const isAdded = state.cartList.find(item => item.id === productId)
      if(isAdded){
        isAdded.count++
      }else{
        state.cartList.push({
          id:productId,
          count:1
        })
      }
    },
    //修改商品数量
    editCartCount(state,payload){
      const product = state.cartList.find(item => item.id===payload.id)
      product.count+=payload.count
    },
    //删除购物车中商品
    deleteCart(state,payload){
      const index = state.cartList.findIndex(item => item.id === payload.id)
      state.cartList.splice(index,1)
    }
  },

  /**
   * actions中不可修改state中数据
   * 封装异步请求
   */
  actions: {
    /**
     * 请求数据列表
     * 真实开发中应使用Ajax，此处用异步模拟
     */
    getProductList(context) {
      setTimeout(() => {
        context.commit('setProductList',product_data)
        console.log('请求成功')
      }, 500)
    }
  }
})
