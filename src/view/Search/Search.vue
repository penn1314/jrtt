<template>
  <div class="search-container">
    <!--顶部导航-->
    <div class="nav">
      <!--返回箭头-->
      <van-nav-bar left-arrow @click-left="onClickLeft"> </van-nav-bar>
      <!--搜索框-->
      <van-search
        v-focus
        v-model.trim="content"
        placeholder="请输入搜索关键词"
        shape="round"
        @input="input"
        @search="search(content, true)"
      />
    </div>
    <!--搜索历史-->
    <van-cell title="搜索历史" size="large">
      <template value>
        <van-icon name="delete" size="0.6rem" @click="clearHistory" />
      </template>
    </van-cell>
    <div class="history">
      <div class="history-item" v-for="(item, index) in history" :key="index" @click="search(item)">
        {{ item }}
      </div>
    </div>
    <!--联想菜单-->
    <div class="suggestion" v-if="show">
      <div
        class="suggest-item"
        v-for="(item, index) in suggestList"
        :key="index"
        v-html="keywordHigh(item, content)"
        @click="search(item, true)"
      ></div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api'
export default {
  name: 'Search',
  data() {
    return {
      content: '', // 搜索框内容
      timer: null, // 防抖定时器
      suggestList: [], // 联想菜单列表
      show: false, // 联想菜单是否显示
      history: JSON.parse(localStorage.getItem('history')) || [] // 历史搜索记录
    }
  },
  methods: {
    // 点击返回
    onClickLeft() {
      this.$router.back()
    },
    // 搜索框输入信息，设置防抖
    input(value) {
      // 清除定时器
      clearTimeout(this.timer)
      // 搜索框内容为空时，隐藏联想菜单，把联想菜单清空
      if (value === '') {
        this.show = false
        this.suggestList = []
      } else {
        // 设置新的定时器
        this.timer = setTimeout(async () => {
          const { data: res } = await suggestListAPI(value)
          // 获取内容后，显示联想菜单
          this.show = true
          // 获取联想菜单内容
          this.suggestList = res.data.options
        }, 300)
      }
    },
    // 搜索结果关键字高亮
    keywordHigh(originVal, keyword) {
      // 判断有没有联想菜单
      if (this.suggestList[0] !== null) {
        // 设置正则，匹配关键字
        const reg = new RegExp(keyword, 'ig')
        // 将关键字替换成红色
        return originVal.replace(reg, (match) => {
          return `<span style="color: red;">${match}</span>`
        })
      }
    },
    // 确认搜索内容，跳转到相应的搜索页面
    search(val, flag) {
      // 判断输入是否为空，空则不进行跳转和保存
      if (val === '') return null
      else {
        // flag 为是否记录history
        if (flag) {
          this.history.push(val)
          // 去重
          this.history = [...new Set(this.history)]
          // 将数据存入本地缓存
          localStorage.setItem('history', JSON.stringify(this.history))
        }
        this.$router.push(`/search_result/${val}`)
      }
    },
    // 清除历史记录
    clearHistory() {
      this.history = []
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  position: relative;
}
.van-search {
  position: absolute;
  top: 0;
  right: 10px;
  z-index: 9999;
  height: 46px;
  width: 330px;
  background-color: #eee;
}
.suggestion {
  position: absolute;
  top: 46px;
  width: 100vw;
  min-height: 70vh;
  background-color: #fff;
  z-index: 99;
}
.suggest-item {
  padding: 10px;
  font-size: 14px;
}
.history {
  display: flex;
  flex-wrap: wrap;
}
.history-item {
  margin: 10px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #eee;
  border-radius: 10px;
}
</style>
