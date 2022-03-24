<template>
  <div class="articleItem-container">
    <van-cell>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span class="custom-title">{{ articleObj.title }}</span>
          <!-- 单图位置 -->
          <img class="thumb" :src="articleObj.cover.images[0]" v-if="articleObj.cover.type === 1" />
        </div>
        <!-- 三图位置 -->
        <div class="thumb-box" v-if="articleObj.cover.type === 3">
          <img
            class="thumb"
            :src="imagesUrl"
            v-for="(imagesUrl, index) in articleObj.cover.images"
            :key="index"
          />
        </div>
      </template>
      <template #label>
        <!-- 作者 评论 时间 -->
        <span>作者&nbsp; {{ articleObj.aut_name }}&nbsp;</span>
        <span>{{ articleObj.comm_count }}&nbsp;评论 &nbsp; </span>
        <span>发布日期&nbsp; {{ formatDate(articleObj.pubdate) }} &nbsp;</span>
        <!-- 关闭标签 -->
        <van-icon name="cross" class="close" @click.stop="show = true" v-if="isShow" />
      </template>
    </van-cell>
    <!-- 遮罩层 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      get-container="body"
      :cancel-text="cancelText"
      @select="onSelect"
      @cancel="onCancel"
      @closed="onClose"
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import { firstAciton, secondAction } from '@/api/report.js'
import { dislikeArticleAPI, reportArticleAPI } from '@/api/index.js'
import { Notify, Toast } from 'vant'
export default {
  name: 'ArticleItem',
  props: {
    articleObj: {
      type: Object
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatDate: timeAgo, // 格式化时间 ...多久之前
    async onSelect(item, index) {
      // 反馈垃圾信息时显示二级选项
      if (item.name === '反馈垃圾信息') {
        this.actions = secondAction
        this.cancelText = '返回'
      } else if (item.name === '不感兴趣') {
        // 点击不感兴趣，向后台发送请求
        try {
          Toast.loading({
            message: '加载中...',
            forbidClick: true
          })
          await dislikeArticleAPI(this.articleObj.art_id)
          Toast.clear()
          // 显示成功
          Notify({ type: 'success', message: '反馈成功' })
          // 关闭反馈面板
          this.show = false
        } catch (err) {
          Toast.clear()
          Notify({ type: 'danger', message: '用户认证失败,请重新登录' })
        }
      } else {
        // 举报内容
        try {
          Toast.loading({
            message: '加载中...',
            forbidClick: true
          })
          await reportArticleAPI({ target: this.articleObj.art_id, type: item.value })
          Notify({ type: 'success', message: '举报成功' })
          this.show = false
          Toast.clear()
        } catch (err) {
          Toast.clear()
          Notify({ type: 'danger', message: '举报失败' })
        }
      }
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
    },
    onCancel() {
      // 点击返回选项
      if (this.cancelText === '返回') {
        this.show = true // 显示遮罩层
        this.cancelText = '取消' // 恢复原有内容
        this.actions = firstAciton
      }
    },
    // 关闭遮罩层触发
    onClose() {
      this.actions = firstAciton
      this.cancelText = '取消'
    }
    // 反馈对内容不感兴趣
  },
  data() {
    return {
      show: false, // 遮罩层显示
      actions: firstAciton, // 反馈内容
      cancelText: '取消' // 反馈中关闭选项的内容
    }
  }
}
</script>

<style lang="less" scoped>
.close {
  float: right;
}
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.thumb {
  width: 100px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
