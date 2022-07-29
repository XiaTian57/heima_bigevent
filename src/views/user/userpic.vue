<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!avatar" src="../../assets/images/avatar.jpg" alt="" />
      <img class="the_img" v-else :src="avatar" alt="" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="uploadPic"
        >
          上传头像
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserPicAPI } from '@/api/index.js'
import { Message } from 'element-ui'
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: '' // 保存图片内存临时地址或base64码
    }
  },
  methods: {
    // 选择头像
    chooseImg() {
      // 触发input （type=file）的点击事件导致触发默认行为，出现选择文件的窗口
      this.$refs.iptRef.click()
    },
    // 确认选择头像
    onFileChange(e) {
      const files = e.target.files
      if (files.length === 0) {
        // 窗口打开了但没选择文件
      } else {
        // 选择了文件，默认只允许选择一个，要选择多个需要给input标签修改属性。
        // console.log(files[0])
        // 预览时img标签不能直接将文件传给src属性，需转换处理。
        // 方法一：转内存临时地址。
        // this.avatar = URL.createObjectURL(files[0])
        // 方法二：转base64字符串
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.onload = e => {
          this.avatar = e.target.result
        }
      }
    },
    // 上传头像
    async uploadPic() {
      const { data: res } = await updateUserPicAPI(this.avatar)
      // console.log(res)
      if (res.code === 0) {
        Message.success(res.message)
        // 上传成功 刷新vuex
        this.$store.dispatch('getUserInfo')
      } else {
        Message.error(res.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
