<template>
  <div class="login-container">
    <van-nav-bar title="今日头条-登录" />
    <van-form @submit="onSubmit">
      <van-field
        required
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        placeholder="请填写11位手机号"
        :rules="[{ required: true, message: '请填写11位手机号', pattern: /^1[3-9]\d{9}$/ }]"
      />
      <van-field
        required
        v-model="user.code"
        type="password"
        name="code"
        label="密码"
        placeholder="请填写6位密码"
        :rules="[{ required: true, message: '请填写6位密码', pattern: /^\d{6}$/ }]"
      />
      <div style="margin: 16px">
        <van-button
          round
          block
          loading-text="登录中..."
          type="info"
          native-type="submit"
          :loading="isLoging"
          :disabled="isLoging"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入登录接口
import { loginAPI } from '@/api/'
// 导入消息通知函数
import { Notify, Toast } from 'vant'
// 导入token模块
import { setToken } from '@/utils/token.js'

export default {
  name: 'Login',
  data() {
    return {
      user: {
        mobile: '13888888888',
        code: '246810'
      },
      isLoging: false
    }
  },
  methods: {
    async onSubmit(values) {
      this.isLoging = true
      try {
        // 发送登录请求
        Toast.loading({
          message: '加载中...',
          forbidClick: true
        })
        const { data: res } = await loginAPI(values)
        if (res.message === 'OK') {
          Toast.clear()
          // 状态提示
          Notify({ type: 'success', message: '登录成功' })
          this.isLoging = false
          // 存储token
          setToken(res.data.token)
          // 跳转到首页
          this.$router.replace('/layout/home')
        }
      } catch (err) {
        Toast.clear()
        Notify({ type: 'danger', message: '账号或者密码错误' })
        this.isLoging = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
