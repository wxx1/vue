<template>
  <div id="app">
    <div class="header">
      <router-link to="/list" 
                  class="header-title">电商网站示例</router-link>
      <div class="header-menu">
        <router-link to="/cart" 
                    class="header-menu-cart">购物车
            <span v-if="cartList.length">{{cartList.length}}</span>            
        </router-link>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script>
export default {
  /**
   * 计算属性，当插值表达式中逻辑较复杂时使用
   * 一般建议vuex中state中一些常用变量写在计算属性中，为之后使用带来便利
   */
  computed: {
    cartList(){
      return this.$store.state.cartList
    }
  },
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
body{
  background-color: #f8f8f9;
}
.header {
  /* background-color: cornflowerblue; */
  background-color: rgba(0, 0, 0, 0.8);
  line-height: 48px;
  font-size: 18px;
  height: 48px;
}

.header a {
  color: #fff;
  text-decoration: none;
}
.header :hover a {
  background-color: aquamarine;
}
.header-title {
  float: left;
  margin-left:20px;
}
.header-menu {
  float: right;
  margin-right: 32px;
  
}
.header-menu-cart span{
  display: inline-block;
  background-color: #ff5500;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  line-height: 16px;
  font-size:12px;
  text-align: center;
}
</style>
