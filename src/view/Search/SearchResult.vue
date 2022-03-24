<template>
  <div class="search-result-container">
    <!--顶部导航-->
    <van-nav-bar title="搜索结果" left-arrow @click-left="onClickLeft"> </van-nav-bar>
    <!--搜索内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 文章列表  click.native 为原生的点击事件，不是自定义事件-->
        <article-item
          v-for="item in articleList"
          :key="item.art_id"
          :articleObj="item"
          :isShow="false"
          @click.native="itemClick(item.art_id)"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getResultAPI } from '@/api/'
import { Toast } from 'vant'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  name: 'SearchResult',
  created() {
    this.getResult()
  },
  components: {
    ArticleItem
  },
  methods: {
    // 点击返回
    onClickLeft() {
      this.$router.back()
    },
    // 获取搜索结果
    async getResult(fresh) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const { data: res } = await getResultAPI({ q: this.kw })
      if (res.message === 'OK') {
        Toast.clear()
        this.articleList = res.data.results
        this.page++
        if (fresh) {
          this.isLoading = false
        }
      }
    },
    // 上拉加载内容
    async onLoad() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const { data: res } = await getResultAPI({ page: this.page, q: this.kw })
      if (res.message === 'OK') {
        // 判断是否为最后一页
        if (res.data.results.length === 0) {
          this.finished = true
        } else {
          Toast.clear()
          this.articleList = [...this.articleList, ...res.data.results]
          this.page++
          this.loading = false
        }
      }
    },
    // 下拉刷新
    onRefresh() {
      this.articleList = []
      this.page = 1
      this.getResult(true)
    },
    // 文章单元点击
    itemClick(id) {
      this.$router.push(`/detail?art_id=${id}`)
    }
  },
  props: ['kw'],
  data() {
    return {
      articleList: [], // 文章列表
      loading: false, // 上拉加载状态
      finished: false, // 上拉加载内容已经全部加载完毕
      isLoading: false, // 下拉刷新状态
      page: 1 // 加载第几页
    }
  }
}
</script>

<style scoped></style>
