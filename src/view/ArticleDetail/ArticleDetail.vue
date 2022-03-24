<template>
  <div class="detail-container">
    <!--顶部导航-->
    <van-nav-bar title="文章详情" left-arrow fixed @click-left="onClickLeft"> </van-nav-bar>
    <!--作者信息，关注-->
    <h4>{{ articleInfo.title }}</h4>
    <div class="author-info">
      <!--头像-->
      <van-image class="au-img" round width="2rem" height="2rem" :src="articleInfo.aut_photo" />
      <!--信息-->
      <div class="info">
        <p class="au-name">{{ articleInfo.aut_name }}</p>
        <p class="ar-time">{{ formatDate(articleInfo.pubdate) }}</p>
      </div>
      <!--关注-->
      <van-button
        class="concern"
        plain
        type="info"
        size="mini"
        v-if="!articleInfo.is_followed"
        @click="followedUser(true)"
        >+ 关注</van-button
      >
      <van-button class="concern" type="info" size="mini" v-else @click="followedUser(false)"
        >已关注</van-button
      >
    </div>
    <!--分割线-->
    <van-divider />
    <!--内容-->
    <div class="ar-content" v-html="articleInfo.content"></div>
    <!--内容结束-->
    <van-divider>End</van-divider>
    <!--点赞-->
    <van-button
      class="good"
      type="danger"
      size="small"
      v-if="articleInfo.attitude === 1"
      @click="likeArticle(false)"
      >已点赞</van-button
    >
    <van-button class="good" color="red" plain size="small" v-else @click="likeArticle(true)"
      >点赞</van-button
    >
    <!--评论-->
    <CommentList></CommentList>
  </div>
</template>

<script>
import {
  getArticleDetailAPI,
  unfollowUserAPI,
  followUserAPI,
  unlikeArticleAPI,
  likeArticleAPI
} from '@/api/index.js'
import { timeAgo } from '@/utils/date.js'
import CommentList from './CommentLIst.vue'
import { Toast } from 'vant'
export default {
  name: 'ArticleDetail',
  async created() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    })
    const { data: res } = await getArticleDetailAPI(this.$route.query.art_id)
    if (res.message === 'OK') {
      Toast.clear()
      this.articleInfo = res.data
    }
  },
  methods: {
    formatDate: timeAgo, // 格式化时间 ...多久之前
    // 点击返回
    onClickLeft() {
      this.$router.back()
    },
    // 关注 - 取关
    async followedUser(bool) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      // true证明 是没关注 点击后要关注
      if (bool === true) {
        // 关注
        const { data: res } = await followUserAPI(this.articleInfo.aut_id)
        if (res.message === 'OK') {
          Toast.clear()
          this.articleInfo.is_followed = true
        }
      } else {
        // 取消关注
        const res = await unfollowUserAPI(this.articleInfo.aut_id)
        if (res.status === 204) {
          Toast.clear()
          this.articleInfo.is_followed = false
        }
      }
    },
    // 文章点赞
    async likeArticle(bool) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      // true 为点击了点赞按钮 要点赞
      if (bool === true) {
        // 点赞
        const { data: res } = await likeArticleAPI(this.articleInfo.art_id)
        if (res.message === 'OK') {
          Toast.clear()
          this.articleInfo.attitude = 1
        }
      } else {
        // 取消点赞
        const res = await unlikeArticleAPI(this.articleInfo.art_id)
        if (res.status === 204) {
          Toast.clear()
          this.articleInfo.attitude = 0
        }
      }
    }
  },
  data() {
    return {
      articleInfo: {} // 文章详情
    }
  },
  components: {
    CommentList
  }
}
</script>

<style lang="less" scoped>
p,
h4 {
  padding: 0;
  margin: 0;
}
h4 {
  margin: 10px 0 10px 10px;
}
.detail-container {
  padding-top: 46px;
}
.author-info {
  position: relative;
  overflow: hidden;
  vertical-align: middle;
}
.au-name {
  font-size: 16px;
}
.ar-time {
  margin-top: 10px;
  font-size: 14px;
  color: #999;
}
.au-img {
  display: inline-block;
  margin-left: 10px;
}
.info {
  position: absolute;
  top: 50%;
  left: 95px;
  transform: translate(0, -50%);
}
.concern {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}
.good {
  display: block;
  margin: 0 auto;
}
.ar-content {
  font-size: 0.32rem;
  line-height: 0.64rem;
  overflow-x: scroll;
  word-break: break-all;
  padding: 20px;
}
</style>
