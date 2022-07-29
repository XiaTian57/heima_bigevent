import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    // 用户信息 {id,username,nicname,email,user_pic}
    userInfo: {}
  },
  getters: {
    // 计算属性定义userInfo的键值对
    username(state) {
      return state.userInfo.username
    }, // 用户名
    // 上面的简写形式
    nickname: state => state.userInfo.nickname, // 昵称
    user_pic: state => state.userInfo.user_pic, // 头像
    id: state => state.userInfo.id,
    email: state => state.userInfo.email
  },
  mutations: {
    // 给state存入token
    updateToken(state, val) {
      state.token = val
    },
    // 存入用户信息
    updateUserInfo(state, val) {
      state.userInfo = val
    }
  },
  actions: {
    // 请求用户信息
    async getUserInfo(store) {
      const { data: res } = await getUserInfoAPI()
      store.commit('updateUserInfo', res.data)
      // console.log(res.data)
    }
  },
  modules: {},
  plugins: [
    createPersistedState() // 插件：自动存储数据到本地,持久化存储vuex中的数据
  ]
})
