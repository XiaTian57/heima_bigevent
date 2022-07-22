import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  getters: {},
  mutations: {
    // 用来保存token
    updateToken(state, val) {
      state.token = val
    }
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState() // 插件：自动存储数据到本地,持久化存储vuex中的数据
  ]
})
