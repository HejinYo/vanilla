import axios from 'axios'
import { router } from '../../router'
import Message from 'iview/src/components/message'
import Notice from 'iview/src/components/notice'

//https://www.kancloud.cn/yunye/axios/234845 详细配置
axios.interceptors.request.use(
  config => {
    let userToken = localStorage.getItem('userToken')
    if (userToken !== null) {
      config.headers['Authorization'] = userToken
    }
    if (config.method === 'post') {
      /*config.data = {
        ...config.data
      }*/
    } else if (config.method === 'get') {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params
      }
    }
    return config
  }, error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(function (response) {
  // token 已过期，重定向到登录页面
  let code = response.data.code
  if (1130 === code) {
    Notice.destroy('authc_error')
    Notice.info({
      title: '温馨提示',
      desc: response.data.message,
      duration: 0,
      name: 'authc_error'
    })
    router.replace({
      path: '/login',
      query: {redirect: router.currentRoute.fullPath}
    })
    //返回reject阻拦本次请求，会报错，但是没办法
    return Promise.reject(response.data.message)
  } else {
    return response
  }
}, error => {
  if (error.response) {
    let message = error.response.data.message
    switch (error.response.status) {
      case 401:
        Message.warning({
          content: message
        })
        break
      case 500:
        Message.warning({
          content: message
        })
        break
      case 504:
        Message.warning({
          content: '网络连接超时'
        })
        break
      default:
        Message.warning({
          content: '服务器繁忙，请稍候再试'
        })
    }
  }
  return Promise.reject(error)
})

export default axios
