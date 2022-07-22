<template>
  <el-container>
    <el-header></el-header>
    <!-- 整个主体 -->
    <el-container>
      <el-aside></el-aside>
      <!-- 主体下的内容和底部 -->
      <el-container>
        <el-main></el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout'
}
</script>

<style lang="less" scoped></style>
