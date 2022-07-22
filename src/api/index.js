// 封装请求具体接口的方法，每个方法只请求一个地址。
import request from '@/utils/request.js'

// 导出接口方法，逻辑页面按需导入
export const registerAPI = ({ username, password, repassword }) => {
  // request 是基于axios封装的，请求返回值是promise对象，
  // 在此处得到响应没有意义，需要返回给调用请求的逻辑页面
  return request({
    method: 'POST',
    url: '/api/reg',
    data: {
      // key和value同名时可以简写.
      username,
      password,
      repassword
    }
  })
}
