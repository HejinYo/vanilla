import Vue from 'vue'
import iView from 'iview'
import Util from '../libs/util'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import {routers, otherRouter, appRouter} from './router'
import store from '../store'
import axios from '@/libs/axios'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers
}

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
    console.log('进入路由' + to.name)
    iView.LoadingBar.start()
    //根据路由名称，设置标题
    Util.title(to.meta.title)
    if (to.name === 'login') {
      next()
    } else {
      processAuth().then(value => {
        if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
          next({replace: true, name: 'locking'})
        } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
          next(false)
        } else {
          // 需要判断权限的路由
          if (to.meta.requireAuth) {
            let userToken = localStorage.getItem('userToken')
            // 判断是否已经登录
            if (userToken) {
              //检查权限
              if (checkAuth(value, to.name)) {
                // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
                Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next)
              } else {
                //无权限页面
                next({replace: true, name: 'error-403'})
              }
            } else {
              //没有登录，跳转登录页面
              console.log('跳转登录页面')
              next({name: 'login'})
            }
          } else {
            // 没有配置权限的路由, 直接通过
            Util.toDefaultPage([...routers], to.name, router, next)
          }
        }
      })
    }

  }
)
const processAuth = async () => {
  //获取菜单和权限
  let userToken = localStorage.getItem('userToken')
  // 判断是否已经登录
  //没有完成授权，则去完成授权
  if (userToken && !store.state.user.completeAuth) {
    return await new Promise(function (resolve, reject) {
      axios.get('/api/userMenu')
        .then(response => {
          store.commit('setUserAuth', response.data.result)
          resolve(processMenu(store.state.user.userAuth))
        }).catch(error => {
        resolve([])
      })
    })
  } else {
    return store.state.user.currAuth
  }
}
//检查权限，遍历用户当前权限
const checkAuth = (auths, name) => {
  for (let auth of auths) {
    if (auth === name) {
      return true
    }
  }
  return false
}

//生成菜单和用户当前权限
const processMenu = (value) => {
  let menuList = []
  let currAuth = []
  //遍历appRouter
  appRouter.forEach((item, index) => {
    // 父路由必须拥有一个子路由
    if (item.meta.requireAuth && item.children.length > 0) {
      //此路由需要权限访问
      let auth = Util.getMenuAuth(value, item.name)
      if (auth) {
        currAuth.push(item.name)
        item.icon = auth.micon ? auth.micon : item.icon
        if (item.children.length === 1) {
          let child = item.children[0]
          if (!child.meta.requireAuth) {
              menuList.push(item)
          } else {
            let authItem = Util.getMenuAuth(auth.children, child.name)
            if (authItem) {
                menuList.push(item)
                currAuth.push(child.name)
                item.children[0].icon = authItem.micon ? authItem.micon : item.children[0].icon
            }
          }
        } else {
          let len = menuList.push(item)
          let childrenArr = []
          //检查子路由是否拥有权限
          childrenArr = item.children.filter(child => {
            if (!child.meta.requireAuth) {
              //子路由不需要权限
              return child
            } else {
              if (authItem) {
                let authItem = Util.getMenuAuth(auth.children, child.name)
                child.icon = authItem.micon ? authItem.micon : child.icon
                //子路由需要权限，并且用户拥有此权限
                currAuth.push(child.name)
                return child
              }
            }
          })
          menuList[len - 1].children = childrenArr
        }
      }
    } else if (item.children.length > 0) {
      //路由不需要权限，这里声明，如果父路由不需要权限处理，则所有子路由都不进行处理
      menuList.push(item)
    }
  })
  //设置otherRouter
  let auth = Util.getMenuAuth(value, otherRouter.name)
  if (auth) {
    currAuth.push(otherRouter.name)
    otherRouter.children.forEach((child, i) => {
      if (child.meta.requireAuth) {
        if (Util.getMenuAuth(auth.children, child.name)) {
          currAuth.push(child.name)
        }
      }
    })
  }
  store.commit('setMenuList', menuList)
  store.commit('setCurrAuth', currAuth)
  store.commit('setCompleteAuth', true)
  return currAuth
}

router.afterEach((to) => {
  Util.openNewPage(router.app, to.name, to.params, to.query)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
