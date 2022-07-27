<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="user_pic" alt="" v-if="user_pic" class="avatar" />
            <img src="@/assets/images/logo.png" alt="" v-else class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1">
            <i class="el-icon-s-operation"></i>
            基本资料
          </el-menu-item>
          <el-menu-item index="1-2">
            <i class="el-icon-camera"></i>
            更换头像
          </el-menu-item>
          <el-menu-item index="1-3">
            <i class="el-icon-key"></i>
            重置密码
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="quitFn">
          <i class="el-icon-switch-button"></i>
          退出
        </el-menu-item>
      </el-menu>
    </el-header>
    <!-- 头部以下 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 左侧边栏的用户信息 -->
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="@/assets/images/logo.png" alt="" v-else />
          <span>欢迎 {{ nicname || username }}</span>
        </div>
        <!-- 左侧边栏的导航菜单 -->
        <el-menu
          default-active="/home"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
          <template v-for="item in menus">
            <el-menu-item v-if="!item.children" :index="item.indexPath" :key="item.indexPath">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </el-menu-item>
            <el-submenu v-else :index="item.indexPath" :key="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <template v-for="(children, index) in item.children">
                <el-menu-item :index="children.indexPath" :key="index">
                  <i :class="children.icon"></i>
                  <span>{{ children.title }}</span>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-menu>
        <!--  -->
      </el-aside>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 主体内容 -->
        <el-main>Main.vue后台主页</el-main>
        <!-- 主体的底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 映射使用vuex中的getters
import { mapGetters } from 'vuex'
import { getMenusAPI } from '@/api/index.js'

export default {
  name: 'my-layout',
  created() {
    this.getMenus()
  },
  computed: {
    ...mapGetters(['username', 'nicname', 'user_pic'])
  },
  data() {
    return {
      menus: []
    }
  },
  methods: {
    async getMenus() {
      const { data: res } = await getMenusAPI()
      console.log(res)
      this.menus = res.data
    },
    quitFn() {
      // 确认退出，清除vuex，回到登录界面
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确认执行退出操作 清除vuex
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', '')
          this.$router.push('/log')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
</style>
