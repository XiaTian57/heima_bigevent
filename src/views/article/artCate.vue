<template>
  <div>
    <!-- 预览文章分类卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addVisibleFn">添加分类</el-button>
      </div>
      <!-- 铺设文章分类的表格 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <!-- scope对象中有个row行属性，值为确定的该行 -->
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateCateFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delCateFn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加文章分类的点击事件弹出对话框 -->
    <el-dialog title="添加文章分类" :visible.sync="addVisible" width="35%" @close="dialogCloseFn">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="addFn">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArtCateListAPI,
  saveArtCateAPI,
  updateArtCateAPI,
  deleteArtCateAPI
} from '@/api/index.js'
import { Message } from 'element-ui'

export default {
  name: 'ArtCate',
  created() {
    // 获取文章分类列表
    this.getArtCateListFn()
  },
  data() {
    return {
      artList: [], // 文章分类列表数组
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      },
      addVisible: false,
      isEdit: false, // false表示新增，true表示修改
      editId: '' // 修改时传入id，为了不出现bug修改完成后还是给id置空吧
    }
  },
  methods: {
    // 获取文章分类列表
    async getArtCateListFn() {
      const { data: res } = await getArtCateListAPI()
      // console.log(res)
      this.artList = res.data
    },
    // 添加分类按钮点击事件
    addVisibleFn() {
      this.addVisible = true
      this.isEdit = false
      this.editId = ''
    },
    // 对话框点击取消
    cancelFn() {
      this.addVisible = false
    },
    // 对话框点击确认,
    addFn() {
      // js对表单的兜底校验
      this.$refs.addRef.validate(async valid => {
        if (!valid) {
          return false
        } else {
          // 验证通过调接口，将用户添加的分类存入数据库
          if (this.isEdit) {
            // 要修改  为true 是修改
            this.addForm.id = this.editId // 优化写法如下
            const { data: res } = await updateArtCateAPI(this.addForm)
            if (res.code !== 0) {
              return Message.error(res.message)
            }
            Message.success(res.message)
            // 有个bug :使用resetFields()重置表单时，重置为表单的初始值。
            // 因为dialog懒加载，第一次加载时不渲染dom，如果点击新增让其加载就会把data中addForm的空值给他用于重置表单，但如果直接点击修改让其第一次加载，代码就会把row对象的值赋给addForm再赋给他，此时重置表单就不再是空值了。
            // 解决： 让row对象赋值addForm的代码异步执行，先把原始空值赋给dialog绑定。this.$nextTick(function (){赋值代码})
          } else {
            // 要新增
            const { data: res } = await saveArtCateAPI(this.addForm)
            if (res.code !== 0) {
              return Message.error(res.message)
            }
            Message.success(res.message)
          }
          // 此时虽然添加了文章分类，但页面没有刷新不会显示新分类，需手动刷新页面请求数据。
          // 生命周期函数不会挂载到this上，不能使用this.created（）等
          this.getArtCateListFn()
          this.addVisible = false
          // console.log(res)
        }
      })
    },
    dialogCloseFn() {
      // 关闭事件 => 关闭对话框重置表单
      this.$refs.addRef.resetFields()
    },
    // 修改文章分类 obj对象是点击的row的一些属性
    updateCateFn(obj) {
      this.isEdit = true
      this.addVisible = true
      this.editId = obj.id
      // 数据回填
      // 解决dialog的bug
      this.$nextTick(() => {
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
      // console.log(obj)
    },
    // 删除文章分类 参数只需要obj中的id
    async delCateFn({ id }) {
      const { data: res } = await deleteArtCateAPI(id)
      if (res.code !== 0) {
        return Message.error(res.message)
      }
      Message.success(res.message)
      this.getArtCateListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
