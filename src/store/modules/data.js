import axios from '@/libs/axios'

const data = {
  state: {
    //角色列表
    roleList: [],
    //资源数据
    resData: {
      tree: [], //树
      list: [], //列表
    },
  },
  mutations: {
    setRoleList (state, result) {
      state.roleList = result
    },
    setResData (state, result) {
      state.resData = result
    },
  },
  actions: {
    //refresh: true 每次都去服务器获取， false:如果存在，则用内存中的
    getRoleList: async ({state, commit}, refresh) => {
      return await new Promise(function (resolve, reject) {
        if (state.roleList.length === 0 || refresh) {
          axios.get('/api/role/select').then(response => {
            let {code, msg, result} = response.data
            if (code === 0) {
              commit('setRoleList', result)
              resolve(result)
            } else {
              resolve([])
            }
          })
        } else {
          resolve(state.roleList)
        }
      })
    },
    //refresh: true 每次都去服务器获取， false:如果存在，则用内存中的
    getResData: async ({state, commit}, refresh) => {
      return await new Promise(function (resolve, reject) {
        if (state.resData.tree.length === 0 || refresh) {
          axios.get('/api/resource/tree').then(response => {
            let {code, msg, result} = response.data
            if (code === 0) {
              commit('setResData', result)
              resolve(result)
            } else {
              resolve([])
            }
          })
        } else {
          resolve(state.resData)
        }
      })
    },
  },
  //相当于计算属性，可以自定义state所相关的属性，比如取反
  getters: {
    resDataList: state => {
      return state.resData.list
    },
    resDataTree: state => {
      return state.resData.tree
    }
  }
}

export default data
