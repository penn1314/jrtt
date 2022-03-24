<template>
  <div class="user-container">
    <!--用户信息-->
    <div class="userinfo">
      <div class="user-img">
        <!--用户头像-->
        <van-image round width="1.5rem" height="1.5rem" :src="userObj.photo" />
        <!--用户名称-->
        <span class="username">{{ userObj.name }}</span>
      </div>
      <div class="user-count">
        <div class="box">
          <span>{{ userObj.art_count }}</span>
          <div>动态</div>
        </div>
        <div class="box">
          <span>{{ userObj.follow_count }}</span>
          <div>关注</div>
        </div>
        <div class="box">
          <span>{{ userObj.art_count }}</span>
          <div>粉丝</div>
        </div>
      </div>
    </div>
    <!--资料编辑-->
    <van-cell is-link to="/user_edit">
      <template #title>
        <van-icon name="edit" class="search-icon" size="0.5rem" />&nbsp; 编辑资料
      </template>
    </van-cell>
    <van-cell is-link @click="quit">
      <template #title>
        <van-icon name="warn-o" size="0.5rem" class="search-icon" />&nbsp; 退出登录
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getUserInfoAPI } from '@/api/index.js'
import { Dialog, Toast } from 'vant'
import { removeToken } from '@/utils/token.js'

export default {
  name: 'User',
  async created() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    })
    const { data: res } = await getUserInfoAPI()
    Toast.clear()
    this.userObj = res.data
  },
  data() {
    return {
      userObj: {} // 用户信息
    }
  },
  methods: {
    quit() {
      Dialog.confirm({
        title: '是否退出登录',
        message: '要退出了吗，不再看看？？？'
      }).then(() => {
        removeToken() // 移除token
        this.$router.replace('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.userinfo {
  overflow: hidden;
  height: 195px;
  color: #fff;
  background-color: #007bff;
}
.user-count {
  display: flex;
  margin-top: 30px;
  justify-content: space-around;
}
.box {
  text-align: center;
  font-size: 14px;
}
.user-img {
  position: relative;
  padding-top: 20px;
  padding-left: 20px;
  padding: 20px;
}
.username {
  position: absolute;
  top: 50%;
  left: 90px;
  transform: translateY(-50%);
  font-size: 20px;
}
</style>
