<template>
  <div class="list">
    <div class="list-control">
      <div class="list-control-order">
        <!-- 根据品牌、颜色过滤 -->
        <div class="list-control-filter">
          <span>品牌：</span>
          <span
            v-for="brand in brands"
            :key="brand"
            class="list-control-filter-item"
            @click="handleFilterBrand(brand)"
            :class="{on:selectBrand === brand}"
          >{{brand}}</span>
        </div>
        <div class="list-control-filter">
          <span>颜色：</span>
          <span
            v-for="color in colors"
            :key="color"
            class="list-control-filter-item"
            @click="handleFilteColor(color)"
            :class="{on:selectColor === color}"
          >{{color}}</span>
        </div>

      <!-- 根据价格和销量排序 -->
        <span>排序：</span>
        <span
          class="list-control-order-item"
          :class="{on:order===''}"
          @click="handleOrderDefault"
        >默认</span>
        <span
          class="list-control-order-item"
          :class="{on:order==='sales'}"
          @click="handleOrderSales"
        >销量</span>
        <span
          class="list-control-order-item"
          :class="{on:order.indexOf('cost')>-1}"
          @click="handleOrderCost"
        >价格</span>
        <template v-if="order === 'cost-desc'">↓</template>
        <template v-if="order === 'cost-asc'">↑</template>
      </div>
    </div>

    <!-- 商品显示区域 -->
    <div class="list-product" v-if="productList.length">
      <product-item 
        v-for="item in filteredAndOrderList" 
        :key="item.id" 
        :productItem="item"></product-item>
    </div>
  </div>
</template>

<script>
import productItem from "../components/product";

export default {
  components: {
    productItem
  },
  data() {
    return {
      order: "", //当前选择的排序方式——默认，销量，价格
      selectBrand: "", //当前选择的品牌
      selectColor: "" //当前选择的颜色
    };
  },
  mounted() {
    //初始化时，通过vuex的action请求数据
    this.$store.dispatch("getProductList");
  },

  computed: {
    productList() {
      //从vuex中读取商品列表数据
      return this.$store.state.productList;
    },
    //从store中取的brands
    brands() {
      return this.$store.getters.brands;
    },
    //从store中取colors
    colors() {
      return this.$store.getters.colors;
    },
    /**
     * 过滤或排序后的数组，赋值给product组件，
     * 此处采用计算属性，是一旦data中定义的数据发生变化，该计算属性也会发生变化，显示区域也会发生相应变化
     * 若将每一个过滤和排序的方法写在各自methods中，则每次都要返回一个数组，赋值product组件，不好控制，且麻烦
     * 步骤：
     *    1、复制原数据——不能直接使用productList，也不能重置productList,因为排序，过滤不是一次性的，并不能破环原数据，否则无法复原
     *    2、排序
     *        2.1、若排序（order）不是默认，则判断当前是什么排序
     *        2.2、根据当前排序对list使用sort,sort可接受一个方法，具体查看API
     *    3、若selectBrand不为空，则说明当前由品牌选中，按品牌分类，对list使用filter(),使用list接受新数组
     *    4、若selectColor不为空，则说明当前有颜色选中，按颜色分类，对list使用filter(),使用list接受新数组
     */
    filteredAndOrderList() {
      //复制原始数据
      let list = [...this.productList];
      if (this.order !== "") {
        if (this.order === "sales") {
          //降序
          list.sort((a, b) => b.sales - a.sales);
        } else if (this.order === "cost-asc") {
          list.sort((a, b) => a.cost - b.cost);
        } else if (this.order === "cost-desc") {
          list.sort((a, b) => b.cost - a.cost);
        }
      }
      //按品牌分类
      if (this.selectBrand !== "") {
        list = list.filter(item => item.brand === this.selectBrand);
      }
      //按颜色分类
      if(this.selectColor !== ""){
        list = list.filter( item => item.color === this.selectColor)
      }
      return list;
    }
  },

  methods: {
    //默认排序
    handleOrderDefault() {
      this.order = "";
    },
    //按限量排序
    handleOrderSales() {
      this.order = "sales";
    },
    //按价格排序
    handleOrderCost() {
      if (this.order === "cost-asc") {
        this.order = "cost-desc";
      } else {
        this.order = "cost-asc";
      }
    },
    /**
     * 筛选品牌
     * 单次点击选中，再次点击取消选中
     */
    handleFilterBrand(brand) {
      if (this.selectBrand === brand) {
        this.selectBrand = '';
      } else {
        this.selectBrand = brand;
      }
    },
    /**
     * 筛选颜色
     * 单次点击选中，再次点击取消选中
     */
    handleFilteColor(color) {
      if (this.selectColor === color) {
        this.selectColor = '';
      }else{
        this.selectColor = color
      }
      
    }
  }
};
</script>

<style scoped>
.list-product {
  display: flex;
  /* 如果一条轴线排不下，换行 */
  flex-wrap: wrap;
}
.list-control {
  margin: 18px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  font-size: 14px;
}
/* .list-control span{
      padding:8px;
    } */
.list-control-filter {
  margin: 16px 0;
}
.list-control-filter-item,
.list-control-order-item {
  margin-right: 6px;
  padding: 2px 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}
.on {
  background-color: #222;
  color: #fff;
}
</style>