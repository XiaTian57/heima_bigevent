<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option
                v-for="obj in cateList"
                :key="obj.id"
                :label="obj.cate_name"
                :value="obj.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="choseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">
          发表文章
        </el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <!-- 组件标签内使用插槽自定义内容 -->
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 发表文章的dialog对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="dialogCloseFn"
    >
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="obj in cateList"
              :key="obj.id"
              :label="obj.cate_name"
              :value="obj.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFileRef"
            @change="changeCoverFn"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 文章详情的dialog对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        &nbsp;&nbsp;
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        &nbsp;&nbsp;
        <span>所属分类：{{ artDetail.cate_name }}</span>
        &nbsp;&nbsp;
        <span>状态：{{ artDetail.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章封面 -->
      <img v-if="artDetail.cover_img" :src="bURL + artDetail.cover_img" alt="" />
      <!-- 文章内容 -->
      <div class="msg-box" v-html="artDetail.content"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArtCateListAPI,
  getArtListAPI,
  uploadArticleAPI,
  getArtMsgAPI,
  deleteArtAPI
} from '@/api/index.js'
import { baseURL } from '@/utils/request.js'
import coverpic from '@/assets/images/cover.jpg'
import { Message } from 'element-ui'

export default {
  name: 'ArtList',
  created() {
    // 请求文章分类
    this.getCateListFn()
    // 请求文章列表
    this.getArticleListFn()
  },
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, // 默认获取第一页的数据
        pagesize: 3, // 默认每页两条数据
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制发布文章的对话框出现或隐藏
      detailVisible: false, // 控制文章详情的对话框显示或隐藏
      // 发布文章
      pubForm: {
        // 表单的数据对象
        title: '',
        cate_id: '',
        content: '', // 文章内容
        cover_img: '', // 文章封面图片文件
        state: '' // 文章发布状态：已发布 草稿
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        // content 部分不是element标签，是quill-editor，不能使用element-ui的验证规则。
        // 解决：参考npm插件介绍，自己定义并绑定各种事件。
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'change' }]
      },
      cateList: [], // 分类列表
      artList: [], // 文章列表
      total: 0, // 现有文章总数，默认0
      artDetail: [], // 保存文章详情
      bURL: baseURL // 基地址
    }
  },
  methods: {
    // 获取文章分类
    async getCateListFn() {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    // 获取文章列表
    async getArticleListFn() {
      const { data: res } = await getArtListAPI(this.q)
      if (res.code !== 0) return this.$message.error('获取文章列表失败!')
      this.artList = res.data // 保存当前获取的分页数据，不是全部数据。
      this.total = res.total
    },
    // 发布文章--对话框--关闭前的回调
    // done调用才会放行，让对话框关闭。
    async handleClose(done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 发表文章的点击事件
    showPubDialogFn() {
      this.pubDialogVisible = true
    },
    // 选择封面点击事件
    selCoverFn() {
      this.$refs.iptFileRef.click() // 模拟点击事件
    },
    // 用户选择了文章封面
    changeCoverFn(e) {
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择文件
        this.pubForm.cover_img = ''
        // html 和css 可以直接使用图片地址，但JS不行，webpack会把地址解析为字符串，解决办法 import引入图片
        this.$refs.imgRef.setAttribute('src', coverpic)
      } else {
        // 用户选择了图片，保存到data中
        this.pubForm.cover_img = files[0]
        // 图片文件转码预览
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      // 封面选择的校验规则
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 文章发布或存为草稿的点击事件
    pubArticleFn(str) {
      // str 值只能为 已发布 或 草稿
      this.pubForm.state = str
      // 表单兜底校验
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          // 验证通过
          const fd = new FormData() // 准备from-data格式的数据对象，fd.append('参数名'，值)
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) {
            return Message.error(res.message)
          } else {
            Message.success(res.message)
            // 清空表单并关闭对话框
            this.pubDialogVisible = false
          }
          // 刷新文章列表
          this.getArticleListFn()
        } else {
          return false // 阻止按钮默认提交行为a
        }
      })
    },
    // 富文本编辑器验证必填内容的事件
    contentChangeFn() {
      // 目标：再次触发element校验规则且本次只校验该项.
      this.$refs.pubFormRef.validateField('content')
    },
    // 关闭发布文章对话框
    dialogCloseFn() {
      this.$refs.pubFormRef.resetFields()
      // 手动重置封面和富文本验证
      this.$refs.imgRef.setAttribute('src', coverpic)
    },
    // 分页-> 每页条数改变时触发
    handleSizeChangeFn(sizes) {
      // 当前每页显示的条数
      // 为 pagesize 赋值 这里不用重新赋值，因为element UI的table属性pagesize上加了sync，实现了双向数据绑定。
      // this.q.pagesize = sizes
      // 默认展示第一页数据,解决分页请求和条数改变请求的并发的两次请求带来的数据覆盖问题。
      this.q.pagenum = 1
      // 重新发起请求，获取文章列表.
      this.getArticleListFn()
    },
    // 分页-> 页码改变时触发
    handleCurrentChangeFn(nowpage) {
      // 当前要去的页码
      // 核心思想：（同上）操作q对象的属性值，重新发起请求获取新结果。
      this.getArticleListFn()
    },
    // 筛选按钮的点击事件
    choseFn() {
      // 目的： 页码回到第一页，每页条数不变。
      this.q.pagenum = 1
      this.getArticleListFn()
    },
    // 重置筛选条件
    resetFn() {
      this.q.cate_id = ''
      this.q.state = ''
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArticleListFn()
    },
    // 文章标题的点击事件 => 查看文章详情
    async showDetailFn(artid) {
      const { data: res } = await getArtMsgAPI(artid)
      if (res.code !== 0) return this.$message.error('获取文章详情失败!')
      this.artDetail = res.data
      this.detailVisible = true
      // console.log(res.data)
    },
    // 删除文章点击事件
    async removeFn(artid) {
      const { data: res } = await deleteArtAPI(artid)
      // console.log(res)
      if (res.code !== 0) return Message.error('删除文章出错！')
      // 重置分页及筛选条件并重新获取文章列表
      // bug:当最后一个分页中文章只有一条时，点击删除，分页少了一页正确，但文章不显示。
      // 原因：当时的分页pagenum在删除文章后就不存在了，但前端data中的pagenum还是等于上一个值，以此调用接口查询不到数据。
      // 解决：删除的是数据库中的内容，前端data中的数据还没有代码操作它，所以此时的分页中的长度是1，因为是最后一个分页中的最后一条数据。让pagenum也减少再调接口刷新列表，调接口后才会刷新data中的数据。
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--
        }
      }
      this.getArticleListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-pagination {
  margin-top: 15px;
}
</style>
