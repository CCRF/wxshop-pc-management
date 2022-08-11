<template>
  <el-input v-model="input" class="search"  placeholder="搜索" style="width: 70%"/>&nbsp;
  <el-button type="success" class="search" plain @click="search()" :disabled="clickButton">查询</el-button>
  <el-button type="warning" class="search" :disabled="clickAddButton" plain @click="dialogVisibleAdd = true">新增</el-button>
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

  <div class="roleTable">
  <el-table :data="tableData" stripe style="width: 100%" border>
    <el-table-column prop="remark" label="角色" width="250"/>
    <el-table-column prop="name" label="名字" width="250"/>
    <el-table-column prop="createTime" label="创建时间" width="250"/>
    <el-table-column prop="lastUpdateTime" label="修改时间"/>
    <el-table-column fixed="right" header-align="center" label="选择" width="230">

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

        <el-button type="danger" :plain="true" size="small" :disabled="clickDeleteButton"
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
  </div>
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
      dataAuthority: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      arrayAuthority,
      deleteArray: []
    }
  },

  mounted() {
    this.getMsg()
    this.definiteMsg()
  }
  ,
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
              if (res.data[j].perms === "sys:role:view") {
                this.clickButton = false
              } else if (res.data[j].perms === "sys:role:add") {
                this.clickAddButton = false
              } else if (res.data[j].perms === "sys:role:edit") {
                this.clickUpdateButton = false
                this.clickAuthorityButton = false
              } else if (res.data[j].perms === "sys:role:delete") {
                this.clickDeleteButton = false
              }
            }


          })
        }

      }
    }
    ,

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
    }
    ,
    dateFormat(dateStr) {
      const dt = new Date(dateStr);
      const y = dt.getFullYear()
      const m = dt.getMonth() + 1
      const d = dt.getDate()
      return `${y}-${m}-${d}`
    }
    ,
    getId(id) {
      newId = id;

      return newId;
    }
    ,
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

    }
    ,
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
    }
    ,
    getNewMsg(r, n, i) {


      this.newMessage.remark = r
      this.newMessage.name = n
      let array1 = []
      let array2 = []
      let array5 = []


      this.$api.menu.findNavTree("/menu/findAllNavTree", {"userName": "admin"})
          .then(res => {
            console.log("权限有：", res.data)
            let allPermission = []
            let allPermission1 = []
            for (let j = 0; j < res.data.length; j++) {
              let copylist = {
                children: '',
                id: '',
                name: ''
              }
              let copylist1 = {
                name: '',
                parentName: ''
              }
              allPermission.push(res.data[j].name)
              copylist.children = res.data[j].children
              copylist.id = res.data[j].id
              copylist.name = res.data[j].name
              copylist1.name = res.data[j].name
              copylist1.parentName = res.data[j].parentName
              allPermission1.push(copylist1)
              if (res.data[j].children) {
                for (let k = 0; k < res.data[j].children.length; k++) {
                  let copylist1 = {
                    name: '',
                    parentName: ''
                  }
                  allPermission.push(res.data[j].children[k].name)
                  copylist1.name = res.data[j].children[k].name
                  copylist1.parentName = res.data[j].children[k].parentName
                  allPermission1.push(copylist1)
                  if (res.data[j].children[k].children) {

                    for (let p = 0; p < res.data[j].children[k].children.length; p++) {
                      let copylist1 = {
                        name: '',
                        parentName: ''
                      }
                      allPermission.push(res.data[j].children[k].children[p].name)
                      copylist1.name = res.data[j].children[k].children[p].name
                      copylist1.parentName = res.data[j].children[k].children[p].parentName
                      allPermission1.push(copylist1)
                    }
                  }
                }

              }
              array5.push(copylist)
            }
            console.log("这就是", allPermission1)
            this.dataAuthority = array5
            console.log(this.dataAuthority)
            this.$api.roleManagement.getAll(`/role/getNewMsg/${i}`).then(res => {

              for (let j = 0; j < res.data.length; j++) {
                array1.push(res.data[j].name)
              }
              let a = new Set(allPermission)
              let b = new Set(array1)

              let difference = new Set([...a].filter(x => !b.has(x)))

              let c = Array.from(difference)

              console.log("array1", c)

              let deleteName = []

              for (let k = 0; k < allPermission1.length; k++) {
                for (let q = 0; q < c.length; q++) {
                  if (c[q] === allPermission1[k].name) {
                    deleteName.push(allPermission1[k].parentName)
                    for (let w = 0; w < allPermission1.length; w++) {
                      if (allPermission1[k].parentName === allPermission1[w].name) {
                        if (allPermission1[w].parentName !== null) {
                          deleteName.push(allPermission1[w].parentName)
                        }
                      }
                    }
                  }
                }
              }

              let getNew = Array.from(new Set(deleteName))

              console.log("deleteName", getNew)

              for (let m = 0; m < getNew.length; m++) {
                let index = array1.indexOf(getNew[m])
                array1.splice(index,1)
              }

              console.log("最终",array1)

              for (let t = 0; t < this.dataAuthority.length; t++) {
                for (let y = 0; y < array1.length; y++) {
                  if (this.dataAuthority[t].name === array1[y]) {
                    array2.push(this.dataAuthority[t].id)
                  } else {
                    for (let u = 0; u < this.dataAuthority[t].children.length; u++) {
                      if (this.dataAuthority[t].children[u].name === array1[y]) {
                        array2.push(this.dataAuthority[t].children[u].id)
                      } else if (this.dataAuthority[t].children[u].children) {
                        for (let o = 0; o < this.dataAuthority[t].children[u].children.length; o++) {
                          if (this.dataAuthority[t].children[u].children[o].name === array1[y]) {
                            array2.push(this.dataAuthority[t].children[u].children[o].id)
                          }
                        }
                      }
                    }
                  }
                }
              }
              console.log("获得的权限", array2)
              this.arrayAuthority = array2
              this.deleteArray = []
              console.log("拥有的权", this.arrayAuthority)
            })
          })


      updateId = i
      console.log(r, n)
      return updateId
    }
    ,
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


    }
    ,
    updateAuthority() {
      /*this.$api.roleManagement.addMessage(`/role/updateRoleMenu/${updateId}`, this.arrayAuthority).then(res => {
        console.log(res)
        this.cleanMsg()
        this.getMsg()
      })*/

      var checkedNodes = this.$refs.tree.getCheckedNodes();
      let array3 = []

      for (let i = 0; i < checkedNodes.length; i++) {
        if (checkedNodes[i].name) {
          array3.push(checkedNodes[i].name)

        }
        if (checkedNodes[i].parentName) {
          array3.push(checkedNodes[i].parentName)
        }
      }
      console.log(checkedNodes)
      let array6 = [...new Set(array3)]


      this.$api.roleManagement.addMessage(`/role/updateRoleMenu/${updateId}`, array6).then(res => {
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

    }
    ,

    search() {

      if (input.value) {
        this.$api.roleManagement.addMessage(`/role/searchMsg/${this.currentPage}/${this.pageSize}`, input.value).then(res => {

          if (res.code === 200) {
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
    }
    ,
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMsg();
    }
    ,

    cleanMsg() {
      this.arrayAuthority = []
      addName.value = null
      addRole.value = null
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.arrayAuthority)
      })
    }


  }
  ,


}
</script>

<style scoped>
.search {
  position: relative;
  top: 10px;
  left: 25px;
}

.roleTable {
  position: relative;
  width: 95%;
  top: 20px;
  left: 25px;
}
</style>