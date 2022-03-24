import axios from '@/utils/request.js'

// 获取搜索结果API
export const getSearchAPI = (page, perPage, q) =>
  axios({
    url: '/v1_0/search',
    method: 'GET',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
// 获取搜索结果API
export const loginAPI = ({ mobile, code }) =>
  axios({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })

// 获取用户频道列表
export const getChannelsAPI = () =>
  axios({
    url: '/v1_0/user/channels'
  })

// 获取所有频道列表
export const getAllChannelsAPI = () =>
  axios({
    url: '/v1_0/channels'
  })

// 获取指定频道的推荐内容
export const getArticleAPI = ({ channelId, timestamp }) =>
  axios({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })

// 文章 -- 反馈 -- 不喜欢
export const dislikeArticleAPI = (ArtId) =>
  axios({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: ArtId
    }
  })

// 举报文章
export const reportArticleAPI = ({ target, type }) =>
  axios({
    url: '/v1_0/article/reports',
    method: 'POST',
    data: {
      target,
      type,
      remark: 'null'
    }
  })

// 文章 - 获取详情
export const getArticleDetailAPI = (id) =>
  axios({
    url: `/v1_0/articles/${id}`
  })

// 文章点赞
export const likeArticleAPI = (id) =>
  axios({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target: id
    }
  })

// 文章 - 取消点赞
export const unlikeArticleAPI = (id) =>
  axios({
    url: `/v1_0/article/likings/${id}`,
    method: 'DELETE'
  })

// 设置用户的频道列表
export const setChannelListAPI = (channels) =>
  axios({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })

// 用户 - 获取用户自己信息
export const getUserInfoAPI = () =>
  axios({
    url: '/v1_0/user'
  })

// 用户 - 获取用户个人资料
export const getUserProfileAPI = () =>
  axios({
    url: '/v1_0/user/profile'
  })

// 用户 - 修改头像
export const userImgChangeAPI = (fd) =>
  axios({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: fd // fd 为FormData数据
  })

// 用户 - 修改个人信息
export const userProfileChangeAPI = ({ name, birthday }) => {
  let data = {}
  if (name !== undefined) {
    data = {
      name
    }
  }
  if (birthday !== undefined) {
    data = {
      birthday
    }
  }

  return axios({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}

// 搜索框 联想搜索
export const suggestListAPI = (key) =>
  axios({
    url: '/v1_0/suggestion',
    params: {
      q: key
    }
  })

// 搜索框 搜索结果
export const getResultAPI = ({ page = 1, per = 10, q }) =>
  axios({
    url: '/v1_0/search',
    params: {
      page,
      per_page: per,
      q
    }
  })

// 关注用户
export const followUserAPI = (id) =>
  axios({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target: id
    }
  })
// 取消关注
export const unfollowUserAPI = (id) =>
  axios({
    url: `/v1_0/user/followings/${id}`,
    method: 'DELETE'
  })

// 获取评论
export const getCommentAPI = ({ source, offset = null }) =>
  axios({
    url: '/v1_0/comments',
    params: {
      type: 'a',
      source,
      offset,
      limit: 10
    }
  })

// 评论 - 点赞
export const likeCommentAPI = (id) =>
  axios({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: id
    }
  })

// 评论 - 取消点赞
export const unlikeCommentAPI = (id) =>
  axios({
    url: `/v1_0/comment/likings/${id}`,
    method: 'DELETE'
  })

// 评论 - 发布评论
export const sendCommentAPI = ({ target, content }) => {
  return axios({
    url: '/v1_0/comments',
    method: 'POST',
    data: {
      target,
      content
    }
  })
}
