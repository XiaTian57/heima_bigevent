// 基于axios封装发起网络请求的函数 myAxios
import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router/index.js'
import { Message } from 'element-ui'

// 给请求设置基地址，使用时再赋值并拼接完整地址（类似：'/api/user）
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 定义请求拦截器
myAxios.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers.Authorization = store.state.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 定义响应拦截器
myAxios.interceptors.response.use(
  response => {
    // 响应HTTP状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
    return response
  },
  error => {
    // 响应状态码不是 2xx，例如404，401，5xx 时触发失败的回调，形参中的 error 是“失败的结果”
    // return到逻辑页面中调用接口的地方，使用try...catch/catch 捕获error的值。
    // 错误对象必须用console.dir（）进行详细打印。
    if (error.response.status === 401) {
      // 为401时 token 过期 被动退出登陆状态
      // 清除vuex中的数据,commit方法调用mutation中的方法给state传入空数据
      store.commit('updateToken', '')
      store.commit('updateUserInfo', '')
      // 跳转登录页
      // 弹窗小技巧
      Message.error('用户身份已过期！')
      router.push('/log')
    }
    return Promise.reject(error)
  }
)
export default myAxios
