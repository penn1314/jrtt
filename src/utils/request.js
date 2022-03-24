import theAxios from 'axios'
import router from '@/router/index.js'
import { Toast } from 'vant'
import { getToken } from '@/utils/token.js'
const axios = theAxios.create({
  baseURL: 'http://www.liulongbin.top:8000/',
  timeout: 20000 // 二十秒超时时间
})

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 如果存在token且config.headers.Authorization 不为 undefined 那么设置token
    // ?. 可选链操作符，当前的对象没有length时返回undefined
    if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    // 判断是否认证失效
    if (error.response.status === 401) {
      router.push('/login')
      Toast('认证过期，请重新登录')
    }
    return Promise.reject(error)
  }
)

export default ({ url, method = 'GET', data = {}, params = {}, headers = {} }) => {
  return axios({
    url,
    method,
    data,
    params,
    headers
  })
}
