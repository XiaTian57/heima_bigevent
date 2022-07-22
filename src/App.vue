<template>
  <!-- 一级路由挂载点 -->
  <router-view></router-view>
</template>

<script>
import { registerAPI } from '@/api/index.js'

export default {
  async created() {
    const { data: res } = await registerAPI()
    console.log(res)
  }
}
</script>

<style lang="less" scoped></style>
