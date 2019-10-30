<template>
  <div v-if="product">
    <div class="product">
      <div class="product-img">
        <img :src="product.image" />
      </div>
      <div class="product-info">
        <h1>{{product.name}}</h1>
        <div class="product-cost">￥{{product.cost}}</div>
        <div class="product-cart"
            @click="handleAddToCart">加入购物车</div>
      </div>
    </div>
  </div>
</template>

<script>
import product from "../../product";
import products from "../../product";
export default {
  data() {
    return {
      id: parseInt(this.$route.params.id),
      product: null
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    /**
     * 使用setTimeout来模仿异步
     * 实际开发中会根据id发送ajax得到数据
     */
    getProduct() {
      setTimeout(() => {
        this.product = product.find(item => item.id === this.id);
      }, 500);
    },
    /**
     * 加入购物车
     */
    handleAddToCart(){
        this.$store.commit('addCart',this.id)
    }
  }
};
</script>

<style scoped>
.product {
  margin: 32px;
  padding: 32px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
}
.product-img {
  width: 50%;
  height: 550px;
  float: left;
}
.product-img img {
  height: 100%;
}
.product-info{
    width:50%;
    height: 150px;
    text-align: center;
    padding:150px 0 250px;
    float: left;
}
.product-cost{
    color:#f2352e;
    font-size:18px;
    margin:10px 0;
}
.product-cart{
    display: inline-block;
    width:150px;
    line-height: 36px;
    height: 36px;
    background-color: #2d8cf0;
    color:#fff;
    font-size: 18px;
    border-radius: 5px;
    margin:10px 0;
    cursor: pointer;
}
</style>