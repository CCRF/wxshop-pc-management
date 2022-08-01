<template>
  <el-input v-model="input" placeholder="搜索" style="width: 70%"/>
  <el-button type="success" plain @click="search()" :disabled="clickButton">查询</el-button>
  <el-button type="warning" :disabled="clickButton" plain @click="dialogVisibleAdd = true">新增</el-button>
  <el-dialog
      title="新增"
      v-model="dialogVisibleAdd"
      width="30%"
      :before-close="handleClose"
      append-to-body
      @close='cleanMsg'
  >
    <el-input
        v-model="addName"
        placeholder="名称"
        size="small"
    />
    <br/><br/>
    <el-input
        v-model="addRole"
        placeholder="角色名称"
        size="small"
    />
    <br/><br/>


    <template #footer>
      <span class="target">
        <el-button @click="cleanMsg();dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addMsg();dialogVisibleAdd = false"
        >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="remark" label="角色" width="250"/>
    <el-table-column prop="name" label="名字" width="300"/>
    <el-table-column prop="createTime" label="创建时间" width="600"/>
    <el-table-column fixed="right" label="选择">
      <template #default="scope">
        <el-button link type="primary" size="small" :disabled="clickButton"
                   @click="getNewMsg(scope.row.remark,scope.row.name,scope.row.id);dialogVisibleUpdate=true"
        >修改
        </el-button
        >
        <el-dialog
            title="修改"
            v-model="dialogVisibleUpdate"
            width="70%"
            :modal="false"
            :before-close="handleClose"
            append-to-body
            :data="tableData"
            @close='cleanMsg'
        >
          <el-form :model="newMessage" label-width="120px">
            <el-form-item label="角色">
              <el-input v-model="newMessage.remark"/>
            </el-form-item>
            <el-form-item label="名字">
              <el-input v-model="newMessage.name"/>
            </el-form-item>
            <el-form-item label="权限">
              <el-checkbox-group v-model="checkboxGroup1" size="large">
                <el-checkbox-button v-for="city in cities" :key="city" :label="city">
                  {{ city }}
                </el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>

          </el-form>


          <template #footer>
      <span class="target">
        <el-button @click="cleanMsg();dialogVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateMsg();dialogVisibleUpdate = false"
        >确 定</el-button
        >
      </span>
          </template>
        </el-dialog>
        <el-button link type="primary" size="small" :disabled="clickButton" @click="getId(scope.row.id);dialogVisibleDelete = true">
          删除
        </el-button>
        <el-dialog v-model="dialogVisibleDelete" :modal="false" title="Warning" width="30%" center>
    <span
    >你确定要删除该角色吗？？？？</span
    >
          <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleDelete = false">取消</el-button>
        <el-button type="primary" @click="deleteMessage(id);dialogVisibleDelete = false"
        >确定</el-button
        >
      </span>
          </template>
        </el-dialog>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      :pager-count="11"
      layout="prev, pager, next"
      :total="totalCount"
      class="limit"
  />
</template>

<script>
import {ref} from "vue";
import {deleteMsg, getAll} from "../../http/modules/roleManagement";
import {reactive} from 'vue'


const form = reactive({
  updateName: '',
  region: '',
  resource: '',

})

let updateId = ref("");
const value1 = ref([])
let newId = ref("");
const addName = ref("");
const addRole = ref("");
const checkboxGroup1 = []
const input = ref("");
const cities = ['系统管理',
  '用户管理', '用户查看', '用户新增', '用户修改', '用户删除',
  '角色管理', '角色查看', '角色新增', '角色修改', '角色删除',
  '商品管理', '商品查看', '商品新增', '商品修改', '商品删除',
  '订单管理', '订单查看', '订单新增', '订单修改', '订单删除',
  '套餐管理', '套餐查看', '套餐新增', '套餐修改', '套餐删除',
  '接口文档', '文档查看']




export default {
  name: "RoleManangement",


  data() {
    return {
      tableData: [],
      dialogVisibleDelete: false,
      dialogVisibleUpdate: false,
      dialogVisibleAdd: false,
      addName,
      addRole,
      form,
      options: [],
      value1,
      newMessage: {
        remark: '',
        name: '',
      },
      cities,
      checkboxGroup1,
      input,
      clickButton: false,
      totalCount: 100,
      currentPage: 1,
      pageSize: 10,

    }
  },
  mounted() {
    this.getMsg()
    this.definiteMsg()
  },
  methods: {

    definiteMsg(){
      if (sessionStorage.getItem("username")!=="admin"){
        this.clickButton=true
      }
    },

    getMsg() {
      this.$api.roleManagement.getAll(`/role/findAll/${this.currentPage}/${this.pageSize}`).then(res => {
        console.log(res)
        this.tableData=res.data.rows
        this.totalCount = res.data.totalCount;


      })
    },
    getId(id) {
      newId = id;

      return newId;
    },
    deleteMessage(id) {
      id = newId
      console.log(id)
      this.$api.roleManagement.deleteMsg(`/role/deleteMsg/${id}`).then(res => {

        if (res.code === 200) {
          alert(res.msg)
        } else {
          alert(res.msg)
        }

        this.getMsg()
        console.log(res)
      })

    },
    addMsg() {
      this.$api.roleManagement.addMessage('/role/addMsg', {
        "name": addName.value,
        "remark": addRole.value,
      }).then(res => {
        if (res.code === 200) {
          alert(res.msg)
        } else {
          alert(res.msg)
        }
        console.log(res)
        this.cleanMsg()
        this.getMsg()
      })
    },
    getNewMsg(r, n, i) {

      this.newMessage.remark = r
      this.newMessage.name = n
      this.$api.roleManagement.getAll(`/role/getNewMsg/${i}`).then(res => {
        console.log(res)
        for (let j = 0; j < res.data.length; j++) {
          this.checkboxGroup1.push(res.data[j].name)
        }
        console.log(this.checkboxGroup1)
      })

      updateId = i
      console.log(r, n)
      return updateId
    },
    updateMsg() {

      this.$api.roleManagement.addMessage('/role/updateName', {
        "name": this.newMessage.name,
        "remark": this.newMessage.remark,
        "id": updateId
      }).then(res => {
        if (res.code === 200) {
          alert("修改成功")
        } else {
          alert("修改失败")
        }
        console.log(res)

        this.getMsg()
      })
      this.$api.roleManagement.addMessage(`/role/updateRoleMenu/${updateId}`, this.checkboxGroup1).then(res => {

        this.cleanMsg()
        this.getMsg()
      })


      console.log(this.checkboxGroup1)

    },

    search() {

      if (input.value) {
        this.$api.roleManagement.addMessage("/role/searchMsg", input.value).then(res => {
          console.log(res)

          if (res.code === 200) {
            this.tableData = res.data
          } else {
            this.getMsg()
          }
        })
      } else {
        this.getMsg()
      }

    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getMsg();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMsg();
    },

    cleanMsg() {
      this.checkboxGroup1 = []
      addName.value = null
      addRole.value = null
    }


  },


}
</script>

<style scoped>

</style>