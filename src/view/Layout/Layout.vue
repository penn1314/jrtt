<template>
  <div>
    <!--二级路由跳转-->
    <router-view></router-view>
    <!--底部区域-->
    <van-tabbar route v-model="active">
      <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/layout/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style></style>
