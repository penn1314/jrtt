<template>
  <div class="channel-container">
    <!--顶部导航-->
    <van-nav-bar title="标题">
      <template #right>
        <van-icon name="cross" size="0.48rem" @click="closeClick" />
      </template>
    </van-nav-bar>

    <!--已添加频道-->
    <div class="main">
      <van-cell>
        <template #title>
          <span class="title">已添加频道: </span>
          <span class="info">{{ text }}</span>
        </template>
        <template #right-icon>
          <van-button round size="small" type="default" v-if="isEdit" @click="editting"
            >编辑</van-button
          >
          <van-button round size="small" type="default" v-else @click="edited">完成</van-button>
        </template>
      </van-cell>
      <!--已添加频道分类-->
      <van-row type="flex">
        <van-col span="5" v-for="item in userList" :key="item.id">
          <div class="content" @click="removeContent(item.id, item.name)">
            {{ item.name }}
            <van-icon class="delete" name="cross" v-if="isDelete && item.name !== '推荐'" />
          </div>
        </van-col>
      </van-row>

      <!--可添加频道-->
      <van-cell class="addChannel">
        <template #title>
          <span class="title">可添加频道: </span>
          <span class="info">点击添加频道</span>
        </template>
      </van-cell>
      <!--可添加频道分类-->
      <van-row type="flex">
        <van-col span="5" v-for="item in checkList" :key="item.id" @click="addUserContent(item.id)">
          <div class="content">{{ item.name }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChannelEdit',
  methods: {
    closeClick() {
      this.$emit('channelClose', false)
    },
    // 编辑状态中
    editting() {
      this.isEdit = false
      this.isDelete = true // 显示删除标志
      this.text = '点击移除频道'
    },
    // 完成编辑
    edited() {
      this.isEdit = true
      this.isDelete = false // 隐藏删除标志
      this.text = '点击进入频道'
    },
    // 移除选中的数据
    removeContent(id, name) {
      // 判断是否为可删除状态
      if (this.isDelete === true && name !== '推荐') {
        this.$emit('removeContent', id)
      }
      // 不是删除状态下，点击相应频道将跳转到相应频道中
      if (!this.isDelete) {
        this.$emit('changeChannel', id)
      }
    },
    // 在可添加频道中，向用户频道添加所选数据
    addUserContent(id) {
      this.$emit('addContent', id)
    }
  },
  data() {
    return {
      isEdit: true, // 是否为编辑按钮
      isDelete: false, // 是否显示删除按钮
      text: '点击进入频道'
    }
  },
  props: {
    checkList: Array,
    userList: Array
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 14px;
  color: #000;
}
.info {
  font-size: 12px;
  color: #808080;
}
.van-col {
  float: left;
  width: 25%;
  font-size: 0.32rem;
  min-height: 48px;
  background-color: #fff;
}
.addChannel {
  margin-top: 30px;
}
.content {
  position: relative;
  margin: 10px;
  text-align: center;
  line-height: 36px;
  box-sizing: border-box;
  background-color: #fafafa;
}
.delete {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
