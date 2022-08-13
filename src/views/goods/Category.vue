<template>
  <div class="all">
    <div class="topItem">
      <div class="queryInput no mr">
        <el-input type="text" v-model="queryData" @clear="choAll" placeholder="请输入查询关键字" clearable></el-input>
      </div>
      <el-button type="primary" @click="choAll">查询商品类型</el-button>
      <el-button type="primary" @click="this.insertVisible = true">新增商品类型</el-button>
      <el-button type="info" @click="returnGoods">返回单品管理</el-button>
    </div>
    <div class="main">
      <el-table
          :data="categoryList.slice((pageInfo.currentPage - 1) * pageInfo.size, pageInfo.currentPage * pageInfo.size)"
          :row-style="{height: '70px'}"
          border>
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column prop="name" label="类型名称" width="120" />
        <el-table-column prop="nickname" label="昵称" width="150" />
        <el-table-column prop="remark" label="类型描述" width="270" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="info" @click="update(scope.row)">编辑</el-button>
            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                confirm-button-type="danger"
                title="确认删除这条类型数据吗？"
                @confirm="deleteCategory(scope.row)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageInfo.currentPage"
          :page-size="pageInfo.size"
          layout="prev, pager, next"
          :total="pageInfo.total"
          class="fenye" />
    </div>

    <el-dialog v-model="insertVisible" title="新增商品类型" width="500px" center>
      <el-form :model="insertData" :rules="rules" label-width="100px" label-position="right">
        <!--        <el-form-item label="编号">-->
        <!--          取当前categoryList最后一个的编号+1-->
        <!--        </el-form-item>-->
        <el-form-item label="类型名称：" prop="name">
          <el-input v-model="insertData.name" type="text" placeholder="请输入类型名称" clearable/>
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="insertData.nickname" type="text" placeholder="请输入昵称" clearable/>
        </el-form-item>
        <el-form-item label="类型描述：">
          <el-input v-model="insertData.remark" type="textarea" rows="3" resize="none"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='insertCategory' class="ml">提交</el-button>
          <el-button type="info" @click='insertData = this.$options.data().insertData'>重置</el-button>
          <el-button type="info" @click='insertVisible = false'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="updateVisible" title="编辑商品类型信息" width="500px" center>
      <el-form :model="updateData" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="编号：">
          <el-input v-model="updateData.id" type="text" readonly/>
        </el-form-item>
        <el-form-item label="类型名称：" prop="name">
          <el-input v-model="updateData.name" type="text" placeholder="请输入类型名称" clearable/>
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="updateData.nickname" type="text" placeholder="请输入昵称" clearable/>
        </el-form-item>
        <el-form-item label="类型描述：">
          <el-input v-model="updateData.remark" type="textarea" rows="3" resize="none"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='updateCategory' class="ml">保存</el-button>
          <el-button type="info" @click='updateData = this.$options.data().updateData'>重置</el-button>
          <el-button type="info" @click='updateVisible = false'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "Category",
  created() {
    this.getAllType()
  },
  data(){
    return {
      categoryList: [],
      pageInfo: {
        size: 5,
        currentPage: 1,
        total: 0
      },
      queryData: '',
      rules: {
        name: [
          {required: true, message: '请输入类型名称', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ]
      },
      insertVisible: false,
      insertData: {
        id:"",
        name:"",
        nickname:"",
        remark:""
      },
      updateVisible: false,
      updateData: {
      },
    }
  },
  methods: {
    getAllType() {
      this.$api.category.findCategory("/category/findAllType").then(res => {
            console.log("获取Category成功", res)
            this.categoryList = res.data;
          }, err => {
            console.log("获取失败")
            console.log(err)
          }
      )
    },
    returnGoods() {
      this.$router.push('goods')
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val
    },
    // 通过输入框中的信息搜索（包括id、name、nickname、remark
    choAll() {
      this.$api.category.findCategory("/category/selectCategoryByAllMsg", {msg: this.queryData}).then(res => {
            // console.log(this.saleData,'@',this.typeData,'@',this.priceData,'@',this.queryData)
            console.log("通过All获取商品类型", res)
            this.categoryList = res.data
            this.pageInfo.total = res.data.length
          }, err => {
            console.log("获取失败")
            console.log(err)
          }
      )
    },
    // 新增商品类型的方法（取当前categoryList最后一个的编号+1
    insertCategory() {
      console.log(this.insertData)
      let data = this.insertData
      this.$api.category.modifyCategory("/category/insertCategory",
          {id: this.categoryList.pop().id+1, name: data.name, nickname: data.nickname, remark: data.remark}).then(res => {
            // console.log(this.saleData,'@',this.typeData,'@',this.priceData,'@',this.queryData)
            console.log("新增类型", res)
          }, err => {
            console.log("获取失败")
            console.log(err)
          }
      )
      this.insertVisible = false
      this.insertData = this.$options.data().insertData
      // this.$router.go(0)
      this.reload()
    },
    // 获取当前对应行id的所有数据
    update(row) {
      this.$api.category.findCategory("/category/selectCategoryById", {id: row.id}).then(res => {
            console.log(row.id,"获取对应id数据", res)
            this.updateData = res.data
          }, err => {
            console.log("获取失败")
            console.log(err)
          }
      )
      this.updateVisible = true
    },
    // 修改商品类型数据的方法
    updateCategory() {
      console.log(this.updateData)
      let data = this.updateData
      this.$api.category.modifyCategory("/category/updateCategory",
          {id: data.id, name: data.name, nickname: data.nickname, remark: data.remark}).then(res => {
            // console.log(this.saleData,'@',this.typeData,'@',this.priceData,'@',this.queryData)
            console.log("修改类型", res)
          }, err => {
            console.log("获取失败")
            console.log(err)
          }
      )
      this.updateVisible = false
      this.updateData = this.$options.data().updateData
      // this.$router.go(0)
      this.reload()
    },
    // 删除对应行id的数据
    deleteCategory(row) {
      this.$api.category.modifyCategory("/category/deleteCategory", row.id).then(res => {
            console.log(row.id, "删除类型", res)
            if (res.code === 500 && res.msg === '数据删除失败') {
              ElMessage({
                type:'error',
                message:"不允许删除有关联商品的类型"
              })
            }
          }, err => {
            console.log("获取失败")
            console.log(err)
          }
      )
      // this.$router.go(0)
      this.reload()
    },
    reload(){
      let _this= this;
      this.$route.path='/index/1'
      this.$router.replace({path:this.$route.path}).then(function (){
        _this.$route.path='/index/goods';
        _this.$router.replace({path:_this.$route.path})
      })
    }
  }
}
</script>

<style scoped>
  .main{
    width: 70%;
  }
  .fenye{
    margin-left: 40%;
  }
</style>