<template>
  <!-- 父级大盒子 放背景 -->
  <div class="reg-container">
    <!-- 内容盒子 放表单 -->
    <div class="reg-box">
      <!-- 标题-->
      <div class="title-box"></div>
      <!-- 表单区域 -->
      <el-form :model="form" :rules="regRules" ref="regRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 密码确认 -->
        <el-form-item prop="repassword">
          <el-input
            v-model="form.repassword"
            type="password"
            placeholder="请再次确认密码"
          ></el-input>
        </el-form-item>
        <!-- 注册按钮和去登录链接 -->
        <el-form-item>
          <el-button type="primary" class="btn-reg" @click="registerFn">注册</el-button>
          <el-link type="info" class="log-link" @click="$router.push('/log')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api/index.js'

export default {
  name: 'Register',
  data() {
    // 自定义的验证规则函数写在data中确保能访问this的数据。
    const samePwdFn = (rule, value, callback) => {
      if (value !== this.form.password) {
        // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
        callback(new Error('两次输入的密码不一致!'))
      } else {
        // 如果验证成功，则直接调用 callback 回调函数即可。
        callback()
      }
    }
    return {
      // 表单中绑定的变量名与接口文档中的参数名保持一致，这样可以整个表单变量弄成一个对象直接当成参数对象传过去
      // 声明表单的数据对象
      form: {
        username: '',
        password: '',
        repassword: ''
      },
      // 声明表单的验证规则对象
      regRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须不超过10字符的大小写字母和数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15位的非空字符',
            trigger: 'blur'
          }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
          { validator: samePwdFn, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册的点击事件
    registerFn() {
      // js兜底校验
      this.$refs.regRef.validate(async valid => {
        if (valid) {
          // 通过校验 把传参调接口发送请求，获取请求结果。
          const { data: res } = await registerAPI(this.form)
          // 判断注册结果 ElementUI的提示 $message
          // 1.注册失败
          if (res.code !== 0) return this.$message.error(res.message)
          // 2.注册成功 通过路由跳转地址
          this.$message.success(res.message)
          this.$router.push('/log')
        } else {
          return false // 阻止提交,验证的错误提示显示
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('@/assets/images/login_bg.jpg');
  background-size: cover;
  height: 100%;
  position: relative;

  .reg-box {
    position: absolute;
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;
  }

  .title-box {
    height: 60px;
    background: url('@/assets/images/login_title.png') center no-repeat;
  }

  .btn-reg {
    width: 100%;
  }
}
</style>
