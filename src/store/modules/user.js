import Cookies from 'js-cookie'
import axios from '@/libs/axios'

const user = {
  state: {
    loginUser: {}, // 当前登录用户
    userAuth: [], // 来自服务器的用户权限
    currAuth: [], // 本地路由授权的全心爱你
    completeAuth: false, // 是否完成路由授权
    avatorImgPath: ''// 用户头像地址
  },
  mutations: {
    // 刷新页面重新获取用户信息
    setLoginUser (state) {
      axios.get('/api/userInfo')
        .then(response => {
          let {code, message, result} = response.data
          state.loginUser = result
          state.avatorImgPath = result.avatar
          console.log(result)
        })
    },
    // 登录设置状态
    login (state, data) {
      state.completeAuth = false
      localStorage.userToken = data.userToken
    },
    setUserAuth (state, data) {
      state.userAuth = data
    },
    setCurrAuth (state, data) {
      state.currAuth = data
    },
    setCompleteAuth (state, flag) {
      state.completeAuth = flag
    },
    logout (state, vm) {
      state.completeAuth = false
      Cookies.remove('user')
      Cookies.remove('password')
      Cookies.remove('access')
      // 恢复默认样式
      let themeLink = document.querySelector('link[name="theme"]')
      themeLink.setAttribute('href', '')
      // 清空打开的页面等数据，但是保存主题数据
      let theme = ''
      if (localStorage.theme) {
        theme = localStorage.theme
      }
      localStorage.clear()
      if (theme) {
        localStorage.theme = theme
      }
    }
  },
  actions: {
    logout: ({commit}) => { // 执行多个 mutations 就需要用 action ,可以在这里触发其他的mutations方法
      commit('logout')
    }
  },
  // 相当于计算属性，可以自定义state所相关的属性，比如取反
  getters: {
    loginUser: state => {
      return state.loginUser
    },
    userAvatar: state => {
      return state.avatorImgPath + '?' + new Date()
    }
  }
}

export default user
