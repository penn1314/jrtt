<template>
  <div class="commentlist-container">
    <!--评论项-->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多评论了"
      :immediate-check="false"
      @load="onLoad"
    >
      <div class="item" v-for="item in commentArr" :key="item.com_id">
        <!--用户信息-->
        <div class="info">
          <!--用户头像-->
          <van-image round width="1rem" height="1rem" :src="item.aut_photo" />
          <!--用户名称-->
          <span class="username">{{ item.aut_name }}</span>
          <!--点赞-->
          <van-icon
            class="like"
            name="like-o"
            v-if="item.is_liking === false"
            @click="likeComment(item, true)"
          />
          <van-icon class="like" name="like" color="red" v-else @click="likeComment(item, false)" />
        </div>
        <!--评论内容-->
        <div class="content">{{ item.content }}</div>
        <!--评论时间-->
        <div class="commment-time">{{ timeAgo(item.pubdate) }}</div>
      </div>
    </van-list>
    <!--评论底部导航-->
    <div class="comment-nav">
      <!--输入框-->
      <input class="comment-input" type="text" placeholder="发表评论" @focus="inputFocus" />
      <div class="comment-icon">
        <!--评论数-->
        <van-icon
          class="comment-count"
          name="chat-o"
          :badge="commentCount > 99 ? '99+' : '' + commentCount"
          v-if="commentCount !== 0"
          @click="toComment"
        />
        <van-icon class="comment-count" name="chat-o" v-else @click="toComment" />
        <!--收藏-->
        <van-icon class="comment-start" name="star-o" />
      </div>
    </div>
    <!--评论输入区域-->
    <van-field
      center
      ref="input"
      class="input-box"
      clearable
      type="textarea"
      placeholder="请输入评论"
      v-model.trim="commentText"
      v-if="isShow"
      @blur="commentBlur"
    >
      <template #button>
        <van-button
          size="small"
          type="primary"
          round
          :disabled="commentText.length === 0"
          @click="sendComment"
          >发布</van-button
        >
      </template>
    </van-field>
  </div>
</template>

<script>
import { getCommentAPI, unlikeCommentAPI, likeCommentAPI, sendCommentAPI } from '@/api/'
import { timeAgo } from '@/utils/date.js'
import { Toast } from 'vant'
export default {
  name: 'CommentList',
  async created() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    })
    const { data: res } = await getCommentAPI({
      source: this.$route.query.art_id
    })
    if (res.message === 'OK') {
      Toast.clear()
      this.commentCount = res.data.total_count // 评论总数
      this.commentArr = res.data.results
      this.lastId = res.data.last_id // 下一页
    }
  },
  data() {
    return {
      commentArr: [], // 评论列表
      commentCount: 0, // 评论数
      isShow: false, // 输入框显示
      commentText: '', // 评论内容
      loading: false,
      finished: false,
      lastId: '' // 下一页评论
    }
  },
  methods: {
    timeAgo, // 时间格式化
    // 对评论点赞 - 取消点赞
    async likeComment(item, bool) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      // true 表示点击了点赞爱心 点赞
      if (bool === true) {
        const { data: res } = await likeCommentAPI(item.com_id)
        if (res.message === 'OK') {
          Toast.clear()
          item.is_liking = true
        }
      } else {
        // 取消点赞
        const res = await unlikeCommentAPI(item.com_id)
        if (res.status === 204) {
          Toast.clear()
          item.is_liking = false
        }
      }
    },
    // 输入框聚焦，输入框显示出来
    inputFocus() {
      this.isShow = true
      // 等下次dom树更新完再执行输入框聚焦
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 点击评论数，去往评论区域
    toComment() {
      document.querySelector('.good').scrollIntoView({
        behavior: 'smooth' // 平滑过渡
      })
    },
    // 发布评论
    async sendComment() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const { data: res } = await sendCommentAPI({
        target: this.$route.query.art_id,
        content: this.commentText
      })
      if (res.message === 'OK') {
        Toast.clear()
        this.commentArr.unshift(res.data.new_obj)
        this.commentCount++
      }
    },
    // 评论框失去焦点
    commentBlur() {
      // 使用异步代码让隐藏最后执行
      setTimeout(() => {
        this.isShow = false
      }, 0)
    },
    // 上拉加载更多
    async onLoad() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const { data: res } = await getCommentAPI({
        source: this.$route.query.art_id,
        offset: this.lastId
      })
      if (res.message === 'OK') {
        Toast.clear()
        this.loading = false
        this.commentArr = [...this.commentArr, ...res.data.results]
        if (res.data.last_id !== null) {
          this.lastId = res.data.last_id // 下一页
        } else {
          // 最后一页 last_id 为 null
          this.finished = true
        }
      }
    }
  }
}
</script>

<style scoped>
.commentlist-container {
  position: relative;
  margin-top: 5px;
  padding: 0 5px 50px 5px;
}
.item {
  padding: 10px;
}
.info {
  position: relative;
  overflow: hidden;
  margin: 10px;
}
.username {
  display: block;
  position: absolute;
  top: 50%;
  left: 60px;
  transform: translateY(-50%);
  font-size: 16px;
}
.like {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
}
.content {
  text-indent: 2em;
  font-size: 16px;
}
.commment-time {
  margin-top: 10px;
  font-size: 14px;
  color: #999;
}
.comment-input {
  width: 250px;
  padding: 8px 0 8px 20px;
  background-color: #eee;
  font-size: 14px;
  border: 1px solid transparent;
  border-radius: 100px;
}
.comment-nav {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #fff;
  padding: 5px 10px;
}
.comment-icon {
  display: inline-block;
}
.comment-count {
  margin: 0 15px;
}
.input-box {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 99;
}
</style>
