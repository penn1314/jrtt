<template>
  <div class="useredit-container">
    <!--顶部导航-->
    <van-nav-bar title="编辑资料" left-arrow @click-left="onClickLeft" />
    <!--编辑资料-->
    <van-cell-group>
      <van-cell class="img" is-link title="头像" @click="imgClick">
        <template #default>
          <van-image round width="1.5rem" height="1.5rem" :src="userObj.photo" />
        </template>
      </van-cell>
      <van-cell is-link title="名称" :value="userObj.name" @click="nameChange" />
      <van-cell is-link title="生日" :value="userObj.birthday" @click="dateClick" />
    </van-cell-group>
    <input type="file" accept=".jpg,.png" v-show="false" ref="iptfile" @change="fileChage" />
    <van-dialog v-model="show" title="标题" show-cancel-button @confirm="nameConfirm">
      <!--名称输入框-->
      <van-field v-model="text" class="input" input-align="center" placeholder="请输入名称" />
    </van-dialog>
    <van-action-sheet v-model="isshow">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        @confirm="dateConfirm"
        @cancel="dateCancel"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import { getUserProfileAPI, userImgChangeAPI, userProfileChangeAPI } from '@/api/'
import { timeFormat } from '@/utils/date.js'
import { Toast } from 'vant'
export default {
  name: 'UserEdit',
  methods: {
    timeFormat,
    // 点击返回
    onClickLeft() {
      this.$router.back()
    },
    // 打开上传图片的窗口
    async fileChage(e) {
      if (e.target.files === 0) return
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const formData = new FormData()
      formData.append('photo', e.target.files[0]) // 将图片保存到表单中
      const { data: res } = await userImgChangeAPI(formData)
      Toast.clear()
      this.userObj.photo = res.data.photo // 更换图片
    },
    // 点击头像，转成点击上传图片
    imgClick() {
      this.$refs.iptfile.click()
    },
    // 修改用户名称
    nameChange() {
      this.show = true
    },
    // 确认修改名称
    async nameConfirm() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const { data: res } = await userProfileChangeAPI({ name: this.text })
      if (res.message === 'OK') {
        Toast.clear()
        Toast('修改成功')
        this.userObj.name = this.text
      }
      console.log(res)
    },
    // 生日修改 - 显示出日期框
    dateClick() {
      this.isshow = true
    },
    // 生日修改 - 确认修改
    async dateConfirm() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      const { data: res } = await userProfileChangeAPI({ birthday: timeFormat(this.currentDate) })
      if (res.message === 'OK') {
        Toast.clear()
        Toast('修改成功')
        this.userObj.birthday = timeFormat(this.currentDate)
      }
      this.isshow = false
    },
    // 生日修改 - 取消修改
    dateCancel() {
      this.isshow = false
    }
  },
  async created() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true
    })
    const { data: res } = await getUserProfileAPI()
    Toast.clear()
    this.userObj = res.data
    this.text = this.userObj.name
  },
  data() {
    return {
      userObj: {}, // 用户个人资料
      show: false, // 名称修改窗口显示
      text: '', // 用户名称
      isshow: false, // 日期选择窗口显示
      currentDate: new Date(2021, 0, 17)
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell--center {
  align-items: center;
}
.van-cell__title,
.van-cell__right-icon {
  align-self: center;
}
</style>
