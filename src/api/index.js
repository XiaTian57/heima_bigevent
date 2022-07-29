// 封装请求具体接口的方法，每个方法只请求一个地址。
import Axios from '@/utils/request.js'
// 导入vuex相关

// 导出接口方法，逻辑页面按需导入
// 注册接口
export const registerAPI = ({ username, password, repassword }) => {
  // 在此处得到响应没有意义，需要返回给调用请求的逻辑页面
  return Axios({
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

// 登录接口
export const loginAPI = ({ username, password }) => {
  return Axios({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

// 根据用户名/token获取用户信息
export const getUserInfoAPI = () => {
  return Axios({
    url: '/my/userinfo',
    method: 'GET' // get 不写时默认为get方式
  })
}

// 获取侧边栏数据
export const getMenusAPI = () => {
  return Axios({
    url: '/my/menus',
    method: 'GET'
  })
}

// 跟新用户信息
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return Axios({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

// 跟新用户头像
export const updateUserPicAPI = avatar => {
  return Axios({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar // 头像base64字符串
    }
  })
}

// 修改密码
/**
 *
 * @param {*} param0{ old_pwd:旧密码, new_pwd:新密码, re_pwd:确认密码 }
 * @returns Promise对象
 */
export const updateUserPwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return Axios({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
