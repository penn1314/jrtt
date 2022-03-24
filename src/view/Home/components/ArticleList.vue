<template>
  <div class="articleList-container">
    <!--文章简述-->
    <!--下拉刷新-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!--上拉底部加载-->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad"
        offset="50"
      >
        <!--文章数据-->
        <article-item
          v-for="item in list"
          :key="item.art_id"
          :articleObj="item"
          @click.native="itemClick(item.art_id)"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { getArticleAPI } from '@/api/index.js'
import { Toast } from 'vant'
export default {
  name: 'ArticleList',
  async created() {
    this.getAritcles()
  },
  components: {
    ArticleItem
  },
  props: {
    channelId: {
      type: Number
    }
  },
  data() {
    return {
      // 文章列表
      list: [],
      loading: false, // 底部加载状态
      finished: false, // 底部加载内容是否没有更多内容可以加载了
      theTime: +new Date(), // 用于分页
      isLoading: false // 上拉刷新状态
    }
  },
  methods: {
    // 当标签变化时，获取变化后对应标签的文章列表
    async getAritcles() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const { data: article } = await getArticleAPI({
        channelId: this.channelId,
        timestamp: this.theTime
      })
      Toast.clear()
      // 获取新的数据
      this.list = [...this.list, ...article.data.results]
      // 获取下一页的时间戳
      this.theTime = article.data.pre_timestamp
      // 获取下一页完毕
      this.loading = false
      // 没有下一页了
      if (article.data.pre_timestamp === null) {
        this.finished = true
      }
    },
    // 底部加载回调函数
    onLoad() {
      // 列表为0 不加载， 反正和created函数获取的数据冲突
      if (this.list.length === 0) {
        this.loading = false
        return
      }
      this.getAritcles()
    },
    // 上拉刷新回调函数
    onRefresh() {
      this.list = []
      this.theTime = +new Date()
      this.getAritcles()
      this.isLoading = false
    },
    // 文章单元点击
    itemClick(id) {
      this.$router.push(`/detail?art_id=${id}`)
    }
  }
}
</script>

<style lang="less" scoped></style>
