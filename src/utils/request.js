// 基于axios封装发起网络请求的函数 myAxios
import axios from 'axios'

// 给请求设置基地址，使用时再赋值并拼接完整地址（类似：'/api/user）
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

export default myAxios
