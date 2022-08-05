<template>
  <el-input v-model="input" placeholder="搜索" style="width: 70%"/>
  <el-button type="success" plain @click="search()" :disabled="clickButton">查询</el-button>
  <el-button type="warning" :disabled="clickAddButton" plain @click="dialogVisibleAdd = true">新增</el-button>
  <el-dialog
      title="新增"
      v-model="dialogVisibleAdd"
      width="30%"
      @close='cleanMsg'
  >
    <el-input
        v-model="addRole"
        placeholder="角色"
        size="small"
    />
    <br/><br/>
    <el-input
        v-model="addName"
        placeholder="名字"
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
  <el-dialog
      title="修改"
      destroy-on-close
      v-model="dialogVisibleUpdateAuthority"
      @close='cleanMsg'
      draggable
  >

    <el-tree
        ref="tree"
        :data="dataAuthority"
        show-checkbox
        :default-checked-keys="arrayAuthority"
        node-key="id"
        :props="defaultProps"
    />
    <template #footer>
              <span class="target">
                <el-button @click="cleanMsg();dialogVisibleUpdateAuthority = false">取 消</el-button>
                <el-button type="primary"
                           @click="updateAuthority();dialogVisibleUpdateAuthority = false">确 定</el-button>
              </span>
    </template>
  </el-dialog>
  <el-dialog
      title="修改"
      v-model="dialogVisibleUpdate"
      destroy-on-close
      draggable
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

  <el-dialog v-model="dialogVisibleDelete"
             title="Warning"
             width="30%"
             destroy-on-close
             draggable
             center>
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

  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="remark" label="角色" width="250"/>
    <el-table-column prop="name" label="名字" width="300"/>
    <el-table-column prop="createTime" label="创建时间" width="300"/>
    <el-table-column prop="lastUpdateTime" label="修改时间"/>
    <el-table-column fixed="right" label="选择" width="230">

      <template #default="scope">

        <el-button type="primary" size="small" :disabled="clickAuthorityButton"
                   plain
                   @click="dialogVisibleUpdateAuthority=true;getNewMsg(scope.row.remark,scope.row.name,scope.row.id);"
        >权限
        </el-button
        >

        <el-button type="primary" :plain="true" size="small" :disabled="clickUpdateButton"
                   @click="getNewMsg(scope.row.remark,scope.row.name,scope.row.id);dialogVisibleUpdate=true"
        >修改信息
        </el-button
        >

        <el-button type="primary" :plain="true" size="small" :disabled="clickDeleteButton"
                   @click="getId(scope.row.id);dialogVisibleDelete = true">
          删除
        </el-button>

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
import {reactive} from 'vue'
import {ElMessage} from 'element-plus'


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
const input = ref("");
const arrayAuthority = ref([])
const dialogVisibleDelete = ref(false)
const dialogVisibleUpdate = ref(false)
const dialogVisibleAdd = ref(false)
const dialogVisibleUpdateAuthority = ref(false)

export default {
  name: "RoleManangement",


  data() {
    return {
      tableData: [],
      dialogVisibleDelete,
      dialogVisibleUpdate,
      dialogVisibleAdd,
      dialogVisibleUpdateAuthority,
      addName,
      addRole,
      form,
      options: [],
      value1,
      newMessage: {
        remark: '',
        name: '',
      },
      input,
      clickAddButton: true,
      clickAuthorityButton: true,
      clickDeleteButton: true,
      clickUpdateButton: true,
      clickButton: true,
      totalCount: 100,
      currentPage: 1,
      pageSize: 10,
      dataAuthority: [{
        id: 1,
        label: '系统管理',
        children: [
          {
            id: 6,
            label: '用户管理',
            children: [
              {
                id: 18,
                label: '用户查看',
              },
              {
                id: 19,
                label: '用户新增',
              },
              {
                id: 20,
                label: '用户修改',
              },
              {
                id: 21,
                label: '用户删除',
              },
            ],
          }, {
            id: 7,
            label: '角色管理',
            children: [
              {
                id: 22,
                label: '角色查看',
              },
              {
                id: 23,
                label: '角色新增',
              },
              {
                id: 24,
                label: '角色修改',
              },
              {
                id: 25,
                label: '角色删除',
              },
            ],
          },
        ],
      },
        {
          id: 2,
          label: '商品管理',
          children: [
            {
              id: 8,
              label: '单品管理',
              children: [
                {
                  id: 26,
                  label: '单品查看',
                },
                {
                  id: 27,
                  label: '单品新增',
                },
                {
                  id: 28,
                  label: '单品修改',
                },
                {
                  id: 29,
                  label: '单品删除',
                },
              ],
            },
            {
              id: 9,
              label: '套餐管理',
              children: [
                {
                  id: 30,
                  label: '套餐查看',
                },
                {
                  id: 31,
                  label: '套餐新增',
                },
                {
                  id: 32,
                  label: '套餐修改',
                },
                {
                  id: 33,
                  label: '套餐删除',
                },
              ],
            },
          ],
        },
        {
          id: 3,
          label: '订单管理',
          children: [
            {
              id: 10,
              label: '订单查看',
            },
            {
              id: 11,
              label: '订单新增',
            },
            {
              id: 12,
              label: '订单修改',
            },
            {
              id: 13,
              label: '订单删除',
            },
          ],
        },
        {
          id: 4,
          label: '顾客管理',
          children: [
            {
              id: 14,
              label: '顾客查看',
            },
            {
              id: 15,
              label: '顾客新增',
            },
            {
              id: 16,
              label: '顾客修改',
            },
            {
              id: 17,
              label: '顾客删除',
            },
          ],
        },
        {
          id: 5,
          label: '接口文档',
          children: [
            {
              id: 18,
              label: '文档查看',
            },
          ],
        },],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      arrayAuthority,
    }
  },

  mounted() {
    this.getMsg()
    this.definiteMsg()
  },
  methods: {

    definiteMsg() {

      if (sessionStorage.getItem("username")) {
        let name = sessionStorage.getItem("username")

        if (sessionStorage.getItem("username") === "admin") {
          this.clickButton = false
          this.clickAddButton = false
          this.clickUpdateButton = false
          this.clickAuthorityButton = false
          this.clickDeleteButton = false
        } else {
          this.$api.roleManagement.getAll(`/role/getNewMsgByName/${name}`).then(res => {

            for (let j = 0; j < res.data.length; j++) {
              if (res.data[j].name === "角色查看") {
                this.clickButton = false
              } else if (res.data[j].name === "角色新增") {
                this.clickAddButton = false
              } else if (res.data[j].name === "角色修改") {
                this.clickUpdateButton = false
                this.clickAuthorityButton = false
              } else if (res.data[j].name === "角色删除") {
                this.clickDeleteButton = false
              }
              console.log(res.data[j].name)
            }


          })
        }

      }
    },

    getMsg() {
      this.$api.roleManagement.getAll(`/role/findAll/${this.currentPage}/${this.pageSize}`).then(res => {

        this.tableData = res.data.rows
        for (let i = 0; i < this.tableData.length; i++) {
          let time1 = this.dateFormat(this.tableData[i].createTime);
          if (this.tableData[i].lastUpdateTime) {
            let time2 = this.dateFormat(this.tableData[i].lastUpdateTime);
            this.tableData[i].lastUpdateTime = time2
          }
          this.tableData[i].createTime = time1

        }
        this.totalCount = res.data.totalCount;

      })
    },
    dateFormat(dateStr) {
      const dt = new Date(dateStr);
      const y = dt.getFullYear()
      const m = dt.getMonth() + 1
      const d = dt.getDate()
      return `${y}-${m}-${d}`
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
          ElMessage({
            message: res.msg,
            type: 'success',
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning',
          })
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
          ElMessage({
            message: res.msg,
            type: 'success',
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning',
          })
        }
        console.log(res)
        this.cleanMsg()
        this.getMsg()
      })
    },
    getNewMsg(r, n, i) {


      this.newMessage.remark = r
      this.newMessage.name = n
      let array1 = []
      let array2 = []
      this.$api.roleManagement.getAll(`/role/getNewMsg/${i}`).then(res => {
        console.log(this.arrayAuthority)

        for (let j = 0; j < res.data.length; j++) {
          array1.push(res.data[j].name)
        }
        console.log(array1)

        for (let t = 0; t < this.dataAuthority.length; t++) {
          for (let y = 0; y < array1.length; y++) {
            if (this.dataAuthority[t].label === array1[y]) {
              array2.push(this.dataAuthority[t].id)
            } else {
              for (let u = 0; u < this.dataAuthority[t].children.length; u++) {
                if (this.dataAuthority[t].children[u].label === array1[y]) {
                  array2.push(this.dataAuthority[t].children[u].id)
                } else if (this.dataAuthority[t].children[u].children) {
                  for (let o = 0; o < this.dataAuthority[t].children[u].children.length; o++) {
                    if (this.dataAuthority[t].children[u].children[o].label === array1[y]) {
                      array2.push(this.dataAuthority[t].children[u].children[o].id)
                    }
                  }
                }
              }
            }
          }
        }
        this.arrayAuthority = array2
        console.log(this.arrayAuthority)

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
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '修改失败',
            type: 'warning',
          })
        }
        console.log(res)

        this.getMsg()
      })


    },
    updateAuthority() {
      /*this.$api.roleManagement.addMessage(`/role/updateRoleMenu/${updateId}`, this.arrayAuthority).then(res => {
        console.log(res)
        this.cleanMsg()
        this.getMsg()
      })*/

      var checkedNodes = this.$refs.tree.getCheckedNodes();
      let array3 = []
      for (let i = 0; i < checkedNodes.length; i++) {
        if (checkedNodes[i].label) {
          array3.push(checkedNodes[i].label)
        }
      }
      /*alert(array3)*/

      this.$api.roleManagement.addMessage(`/role/updateRoleMenu/${updateId}`, array3).then(res => {
        if (res.code === 200) {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '修改失败',
            type: 'warning',
          })
        }
        this.cleanMsg()
        this.getMsg()
      })

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
      this.arrayAuthority = []
      addName.value = null
      addRole.value = null
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.arrayAuthority)
      })
    }


  },


}
</script>

<style scoped>

</style>