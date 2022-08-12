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

// 获取文章分类列表
export const getArtCateListAPI = () => {
  return Axios({
    url: '/my/cate/list'
  })
}

// 保存用户添加的文章分类
/**
 *
 * @param {*} param0 {cate_name:文章分类名字, cate_alias：文章分类别名 }
 * @returns Promise对象
 */
export const saveArtCateAPI = ({ cate_name, cate_alias }) => {
  return Axios({
    url: 'my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

// 文章分类的修改接口
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return Axios({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

// 删除文章分类
export const deleteArtCateAPI = id => {
  return Axios({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}
/**
 *
 * @param {*} fd form-data表单数据对象
 * @returns promise对象
 */
// 发布文章
export const uploadArticleAPI = fd => {
  return Axios({
    url: '/my/article/add',
    method: 'POST',
    // 接口文档要求form-data表单数据对象格式，因为数据中有文件。
    // 不能使用普通对象，axios会把对象转换为json格式.
    data: fd
  })
}

/**
 *
 * @param {*} param0 { pagemun:当前页码, pagesize： 当前页面要展示的数据条数, cate_id：文章分类id, state：文章状态（已发布或草稿） }
 * @returns promise对象
 */
// 获取文章列表
export const getArtListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return Axios({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

// 获取文章详情
export const getArtMsgAPI = artid => {
  return Axios({
    url: `/my/article/info?id=${artid}`
  })
}

// 删除文章
export const deleteArtAPI = artid => {
  return Axios({
    url: `/my/article/info?id=${artid}`,
    method: 'DELETE'
  })
}
