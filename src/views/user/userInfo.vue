<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFn">提交修改</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updateUserInfoAPI } from '@/api/index.js'
export default {
  name: 'UserInfo',
  data() {
    return {
      userForm: {
        username: this.$store.state.userInfo.username, // 默认值用登录后获取到的用户名
        nickname: '',
        email: ''
      },
      // 表单的验证规则对象
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交修改的点击事件
    submitFn() {
      // 判断是否表单为空就修改,js兜底校验
      this.$refs.userFormRef.validate(async valid => {
        if (valid) {
          // 表单使用双向数据绑定，vuex数据自动跟新。
          // 调用接口把用户修改的值跟新入数据库（传入：昵称，邮箱。使用token验证该条信息归属身份。）
          this.userForm.id = this.$store.state.userInfo.id
          this.userForm.user_pic = this.$store.state.userInfo.user_pic
          const { data: res } = await updateUserInfoAPI(this.userForm)
          // console.log(res)
          if (res.code !== 0) return this.$message.error('更新用户信息失败！')
          // 更新用户信息成功，刷新 Vuex 中的数据
          this.$message.success('更新成功！')
          // 重新让vuex获取下最新的用户数据
          this.$store.dispatch('getUserInfo')
        } else {
          return false
        }
      })
    },
    // 重置按钮的点击事件
    resetFn() {
      // this.userForm.nickname = ''
      // this.userForm.email = ''
      // 使用el-form 的重置功能，清空表单和报错提示
      this.$refs.userFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
