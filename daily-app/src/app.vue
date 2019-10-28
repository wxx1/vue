<template>
  <div class="daily">
    <!-- daily-menu左边栏，该栏有两个模块--每日推荐，与主题推送 
        点击每个模块高亮显示，由两个函数控制，触发不同函数改变type值-->
    <div class="daily-menu">
      <div
        class="daily-menu-item"
        :class="{'active':type==='recommend' }"
        @click="handleToRecommend"
      >每日推荐</div>
      <div
        class="daily-menu-item"
        value="daily"
        :class="{active:type === 'daily'}"
        @click="handleToDaily"
      >主题推送</div>
      <ul v-show="showThemes">
        <li>111</li>
        <li>111</li>
        <li>111</li>
      </ul>
    </div>

    <!-- daily-list中边栏，该栏根据daily-menu中type控制，不同type显示不同内容，type默认值为recommend，
    在组件挂载时发送获取recommend信息
        1、type=recommend（从recommendList中取出数据(list)以天为单位循环显示）
            首先显示格式化（formatDay）之后的日期
            传入 list 给子组件item，由item显示每条信息（以每天的每条信息为单位循环显示）
        2、type=daily(由于没有接口，后续会自己尝试写接口，再来完成)-->
    <div class="daily-list" ref="list" @scroll="handleScroll">
      <template v-if="type === 'recommend'">
        <div class="daily-date" v-for="(list,index) in recommendList" :key="index">
          {{formatDay(list.date)}}
          <item
            v-for="(item,index) in list.stories"
            :key="index"
            :index="item.id"
            :listChildren="item"
            :imgPath="imgPath"
            @click.native="handleClick(item.id)"
          ></item>
        </div>
      </template>

      <template v-if="type === 'daily'">daily</template>
    </div>

    <!-- daily-content右边栏，该边栏由daily-list中每条item中id控制，点击item时（.native）时会触发一个方法改变articleId的值
        将articleId传入子组件
        在子组件中设置一个侦听属性，侦听id的变化，id变化时，重新发送getArticleId请求 -->
    <div class="daily-content">
      <daily-article :id="articleId" :imgPath="imgPath"></daily-article>
    </div>
  </div>
</template>

<script>
import item from "./components/item.vue";
import dailyArticle from "./components/daily-article.vue";

import { apiRequest } from "./network/request";
import Util from "./util/util";
export default {
  data() {
    return {
      type: "recommend",//控制高亮
      showThemes: false,//控制是否显示thems（一般在type=daily时显示）,
      recommendList: [],//保存请求获得的recommend信息
      dailyTime: Util.getTodayTime(),//获取今日0时时间戳，用于获取前一天数据（比直接天数减一简单，不需考虑每月日期、是否闰年等）
      loding: false,//用于控制上拉加载更多
      articleId: 0,//保存每个article的id值，用于传入子组件 切换文章
      imgPath: "http://127.0.0.1:3001/img/"//图片代理地址，定义此处可传入所有子组件，方便后期修改，维护
    };
  },
  components: {
    item,
    dailyArticle
  },
  /**
   * 需要在挂载阶段执行方法最好在methods写具体实现，在mounted中直接调用，逻辑较直观，注意良好的封装思想
   */
  mounted() {
    //请求每日推荐的数据
    this.getRecommend();
    //之所以在此处执行一次上拉加载更多方法是因为，可能当日的数据太少，以至于填不满daily-list页面，不能出现滚动条，之后的上拉加载更多函数也无法监听到
    this.handleScroll();
  },
  methods: {
    /**
     * 请求主题推荐数据，接口失效
     */
    getdaily() {
      apiRequest({
        url: "themes",
        method: "get"
      }).then(data => {
        console.log(data.data);
      });
    },
    /**
     * 请求每日推荐数据
     * 步骤：
     *      1、获取指定格式的日期信息（在Util.j中封装），同时将loding赋值为true
     *      2、发送请求
     *      3、resolve回调函数（成功请求），保存数据。不保存数据的话，每次请求完成之后会丢失
     *      4、请求完成之后，loding设未false
     */
    getRecommend() {
      this.loding = true;
      const preDay = Util.getPrevDay(this.dailyTime);
      apiRequest({
        url: "news/before/" + preDay,
        method: "get"
      }).then(res => {
        this.recommendList.push(data.res);
        this.loding = false
      });
    },
    /**
     * 切换到recommend
     */
    handleToRecommend() {
      this.type = "recommend";
      this.showThemes = false;
    },
    /**
     * 切换到daily
     */
    handleToDaily() {
      this.type = "daily";
      this.showThemes = true;
    },
    /**
     * 格式化输出年月日
     */
    formatDay(time) {
      console.log("--", typeof time);
      let month = time.substr(4, 2);
      let day = time.substr(6, 2);
      if (month.substr(0, 1) === "0") {
        month = month.substr(1, 1);
      }
      if (day.substr(0, 1) === "0") {
        day = day.substr(1, 1);
      }

      return month + "月" + day + "日";
    },
    /**
     * 监听DOM原生事件Scroll
     * 步骤：
     *      1、获取list子组件元素
     *      2、在daily或加载每日推荐列表时停止操作
     *      3、以滚动的距离+list页面高度>=整个内容区域高度时则视为触及底部
     * 书上写的滚动的距离加上body的距离，但经测试不对，因为此时body还没有被内容撑起来，高度十分小，这个数值加下来是不对的，
     * 个人认为应该加list div 的高度
     */
    handleScroll() {
      const list = this.$refs.list;
      //在daily或加载每日推荐列表时停止操作
      if(this.type === 'daily' || this.loding) return
      if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
        console.log("到底部了");
        //时间减少一天
        this.dailyTime -= 86400000;
        this.getRecommend();
      }
    },
    /**
     * 获取文章的id，赋值给data中定义的articleId,以便传入子组件中
     */
    handleClick(articleId) {
      this.articleId = articleId;
    }
  }
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
.daily {
  width: 100%;
  height: 100%;
}
.daily-menu {
  /* display: flex; */
  width: 150px;
  height: 100%;
  position: fixed;
  background-color: #f5f7f9;
}

.daily-menu-item {
  margin: 20px 0;
  padding: 18px 30px;
  cursor: pointer;
}
.daily-menu-item.on {
  background-color: aliceblue;
  cursor: pointer;
}
.active {
  background-color: #e3e8ee;
  cursor: pointer;
  border-right: 3px solid rosybrown;
}
.daily-list {
  /* display: flex; */
  width: 300px;
  top: 0;
  bottom: 0;
  position: fixed;
  left: 150px;
  background-color: #e3e8ee;
  overflow: auto;
}
.daily-date {
  margin: 10px;
  text-align: center;
  font-size: 20px;
}
.daily-content {
  /* display: flex; */
  /* background-color: bisque; */
  margin-left: 450px;
  padding: 30px;
}
</style>
