<template>
  <div class="home-container">
    <!--顶部导航-->
    <van-nav-bar fixed>
      <template #left>
        <img class="logo" src="@/assets/logo.png" alt="" />
      </template>
      <template #right>
        <van-icon name="search" size="0.48rem" @click="search" />
      </template>
    </van-nav-bar>
    <!--顶部标签栏-->
    <van-tabs v-model="channelId" sticky animated offset-top="1.226667rem">
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id" :name="item.id">
        <!--文章列表-->
        <article-list :channelId="channelId"></article-list>
      </van-tab>
    </van-tabs>
    <!--标签栏右侧编辑图标-->
    <van-icon class="plus" name="plus" size="0.37333rem" @click="plusClick" />
    <!--频道管理弹出层-->
    <van-popup class="channelMask" v-model="show" get-container="body">
      <channel-edit
        @channelClose="channelClose"
        :userList="channelList"
        :checkList="selectChannelList"
        @removeContent="removeContent"
        @addContent="addContent"
        @changeChannel="changeChannel"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getChannelsAPI, getAllChannelsAPI, setChannelListAPI } from '@/api/index.js'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
import { Notify } from 'vant'
export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit
  },
  async created() {
    try {
      // 获取用户频道列表
      const { data: res1 } = await getChannelsAPI()
      this.channelList = res1.data.channels
      // 获取所有频道列表
      const { data: res2 } = await getAllChannelsAPI()
      this.channelAllList = res2.data.channels
      // 获取用户频道列表中没有的频道列表
      this.removeChannel()
    } catch (err) {
      console.log(err)
    }
  },
  data() {
    return {
      // 标签栏默认显示
      channelId: 0,
      // 用户频道列表
      channelList: [],
      // 所有频道列表
      channelAllList: [],
      // 可添加用户列表
      selectChannelList: [],
      // 文章列表
      articleList: [],
      // 频道管理弹出层显示
      show: false
    }
  },
  methods: {
    // 点击频道管理，显示出频道管理层
    plusClick() {
      this.show = true
    },
    // 频道管理层g关闭
    channelClose(val) {
      this.show = val
    },
    // 在所有频道列表中筛选掉用户频道列表的数据
    removeChannel() {
      this.selectChannelList = this.channelAllList.filter((item) => {
        let flag = 0
        // 遍历用户列表，如果用户列表数据在所有列表数据中找到，则标识，退出遍历
        this.channelList.some((value) => {
          if (value.id === item.id) {
            flag = 1 // 找到标志
            return true // 停止循环
          }
        })
        if (flag === 1) {
          // 是否找到相同数据
          return false // 不要该数据
        } else return true
      })
    },
    // 移除选中的用户频道数据，将移除的数据放到可添加用户列表
    removeContent(id) {
      this.channelList = this.channelList.filter((item) => {
        if (item.id === id) {
          this.selectChannelList.push(item) // 将移除的数据放到可添加用户列表
          return false
        } else return true
      })
      // 保存至后台
      this.saveUserChannel()
    },
    // 向用户频道列表添加所选的频道数据，并在可选添加频道中删除所选数据
    addContent(id) {
      this.selectChannelList = this.selectChannelList.filter((item) => {
        if (item.id === id) {
          this.channelList.push(item) // 向用户列表添加所选的数据
          return false
        } else return true
      })
      // 保存至后台
      this.saveUserChannel()
    },
    // 向后台保存用户频道列表
    async saveUserChannel() {
      try {
        await setChannelListAPI(this.channelList)
      } catch (err) {
        Notify({ type: 'danger', message: '保存失败' })
      }
    },
    // 跳转到频道管理里选中的频道
    changeChannel(id) {
      this.show = false
      this.channelId = id
    },
    // 点击搜索按钮
    search() {
      this.$router.push('/search')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  position: relative;
}
.logo {
  width: 100px;
}
/deep/ .van-icon {
  color: #111;
}
.van-tabs {
  padding-top: 46px;
  padding-bottom: 50px;
  width: 100%;
}
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
.plus {
  position: absolute;
  top: 60px;
  right: 8px;
  z-index: 999;
}
.channelMask {
  width: 100vw;
  height: 100vh;
}
</style>
