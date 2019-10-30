<template>
  <div class="cart">
      <!-- header部分 -->
    <div class="cart-header">
      <div class="cart-header-title">购物清单</div>
      <div class="cart-header-main">
        <div class="cart-info">商品清单</div>
        <div class="cart-price">单价</div>
        <div class="cart-price">数量</div>
        <div class="cart-price">小计</div>
        <div class="cart-price">删除</div>
      </div>
    </div>
    <!-- 主要内容部分 -->
    <div class="cart-content">
      <div class="cart-content-main" 
            v-for="(item,index) in cartList" 
            :key="index">
        <div class="cart-info">
            <img :src="productDictList[item.id].image"/>
            <span>{{productDictList[item.id].name}}</span>
        </div>
        <div class="cart-price">￥{{productDictList[item.id].cost}}</div>
        <div class="cart-price">
            <span class="cart-control-minus"
                    @click="handleCount(index,-1)">-</span>
            {{item.count}}
            <span class="cart-control-adds"
                    @click="handleCount(index,1)">+</span>
        </div>
        <div class="cart-price">{{productDictList[item.id].cost*item.count}}</div>
        <div class="cart-price">
            <span class="cart-delete"
                    @click="handleDelete(index)">删除</span>
        </div>
        
      </div>
      <div class="cart-empty" v-if="!cartList.length">购物车为空</div>
    </div>
    <!-- footer部分 -->
    <div class="cart-footer" v-show="cartList.length">
            <div class="cart-footer-desc">
                 共计<span>{{countAll}}</span>件商品
            </div>
             <div class="cart-footer-desc">
                应付总额<span>￥{{costAll}}</span>
              <br>
            </div>
             <div class="cart-footer-desc">
                <div class="cart-control-order">现在结算</div>
            </div>
             

        </div>
  </div>
</template>
<script>
import product from "../../product";
export default {
  data() {
    return {};
  },
  computed: {
    //   从vuex中读取购物车内数据
    cartList() {
      return this.$store.state.cartList;
    },
    // 将product.js中数组装换为字典prosuctDictList，方便快速读取
    productDictList() {
      const dict = {};
      product.forEach(item => {
        dict[item.id] = item;
      });
      return dict;
    },
    //计算购物车中商品总数量
    countAll(){
        let count =0
        this.cartList.forEach(item => {
            count+=item.count
        })
        return count
    },
    // 计算购物车中总价钱
    costAll(){
        let cost = 0
        this.cartList.forEach(item => {
            cost+=this.productDictList[item.id].cost*item.count
        })
        return cost
    }
  },
  methods: {
    //   增加、减少某商品数量
      handleCount(index,count){
          if(count<0 && this.cartList[index].count ===1) return
          this.$store.commit('editCartCount',{
              id:this.cartList[index].id,
              count:count
          })
      },
      //删除
      handleDelete(index){
          this.$store.commit('deleteCart',{id:this.cartList[index]})
      }
  }
};
</script>
<style scoped>
.cart {
  margin: 32px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
}
.cart-header-title {
  padding: 16px 32px;
  border-bottom: 1px solid #ccc;
  background-color: #f8f8f9;
}
.cart-header-main {
  padding: 8px 32px;
  border-bottom: 1px solid #ccc;
  background-color: #eee;
  overflow: hidden;
}
.cart-header-main div {
  /* text-align: center; */
  font-size: 14px;
  float: left;
}
.cart-info {
  width: 60%;
  text-align: left;
}
.cart-price {
  width: 10%;
  text-align: center;
}
.cart-content-main{
    padding:0 32px;
    height:60px;
    line-height: 60px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    overflow: hidden;
}
.cart-content-main div{
    float: left;
}
.cart-content-main img{
    width:40px;
    height: 40px;
    position:relative;
    top:14px;
}
.cart-control-adds,
.cart-control-minus{
    display: inline-block;
    margin: 0 4px;
    width:22px;
    height: 22px;;
    background-color: #ccc;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
}
.cart-delete{
    cursor: pointer;
    color:#2d8cf0;
}
.cart-empty{
    text-align: center;
    padding:32px;
}
.cart-footer{
    padding:32px;
    text-align:right;
}
.cart-footer-desc{
    display: inline-block;
    padding:0 16px;
}
.cart-footer-desc span{
    color:#f2352e;
    font-size:20px;
}
.cart-control-order{
    padding: 8px 32px;
    border-radius: 5px;
    background-color: #2d8cf0;
    color:#fff;
    cursor: pointer;
}
</style>