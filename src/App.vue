<template>
  <div>
    <el-button>hahh</el-button>
  </div>
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
