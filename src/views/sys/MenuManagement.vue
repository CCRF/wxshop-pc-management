<template>
  <el-input v-model="input" class="search" placeholder="搜索" style="width: 70%"/>&nbsp;
  <el-button type="success" class="search" plain @click="search()" :disabled="clickButton">查询</el-button>
  <el-button type="warning" :disabled="clickAddButton" plain class="search" @click="dialogVisibleAdd = true">新增
  </el-button>
  <el-dialog
      title="新增"
      v-model="dialogVisibleAdd"
      width="30%"
      @close='cleanMsg'
  >
    <el-input
        v-model="addName"
        placeholder="菜单名字(必填)"
        size="small"
    />
    <br/><br/>
    <el-select v-model="value" clearable placeholder="父菜单" size="small">
      <el-option
          v-for="item in allMenu"
          :key="item"
          :label="item"
          :value="item"
      />
    </el-select>
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
      v-model="dialogVisibleUpdate"
      destroy-on-close
      draggable
      :data="tableData"
      @close='cleanMsg'
  >
    <el-form :model="newMessage" label-width="120px">
      <el-form-item label="菜单名字">
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
    >你确定要删除该管理吗？？？？</span
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

  <el-table
      :data="tableData"
      stripe
      default-expand-all
      border
      class="menuTable"
      height="500"
      row-key="id"
      :tree-props="treeConfig"
  >
    <el-table-column prop="name" label="菜单名字" width="200"/>
    <el-table-column label="菜单等级" width="200">
      <template #default="scope">
        <el-tag v-if="scope.row.type==='目录'" type="primary">{{ scope.row.type }}</el-tag>
        <el-tag v-else-if="scope.row.type==='菜单'" type="success">{{ scope.row.type }}</el-tag>
        <el-tag v-else type="warning">{{ scope.row.type }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="parentName" label="菜单所属" width="200"/>
    <el-table-column prop="createTime" label="创建时间" width="230"/>
    <el-table-column prop="lastUpdateTime" label="修改时间"/>
    <el-table-column fixed="right" header-align="center" label="选择" width="160">

      <template #default="scope">

        <el-button type="success" :plain="true" size="small" :disabled="clickUpdateButton"
                   @click="getNewMsg(scope.row.name,scope.row.url,scope.row.id);dialogVisibleUpdate=true"
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


</template>

<script>
import {ref} from "vue";
import {reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {changeMsg, deleteMsg, findNavTree} from "../../http/modules/menu";


const form = reactive({
  updateName: '',
  region: '',
  resource: '',

})

let updateId = ref("");
const value1 = ref([])
let newId = ref("");
const addName = ref("");
const input = ref("");
const arrayAuthority = ref([])
const dialogVisibleDelete = ref(false)
const dialogVisibleUpdate = ref(false)
const dialogVisibleAdd = ref(false)
const value = ref("")
export default {
  name: "MenuManagement.vue",


  data() {
    return {
      tableData: [],
      dialogVisibleDelete,
      dialogVisibleUpdate,
      dialogVisibleAdd,
      addName,
      form,
      options: [],
      value1,
      newMessage: {
        name: '',
      },
      input,
      clickAddButton: true,
      clickButton: true,
      clickDeleteButton: true,
      clickUpdateButton: true,
      dataAuthority: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      arrayAuthority,
      allMenu: [],
      value,
      allObject: [],
      allSearch: [],
      treeConfig: {
        children: 'children',
        hasChildren: 'hasChildren'
      },

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
          this.clickAddButton = false
          this.clickUpdateButton = false
          this.clickDeleteButton = false
          this.clickButton = false
        } else {
          this.$api.roleManagement.getAll(`/role/getNewMsgByName/${name}`).then(res => {
            console.log("aa", res)
            for (let j = 0; j < res.data.length; j++) {
              if (res.data[j].perms === "sys:menu:add") {
                this.clickAddButton = false
              } else if (res.data[j].perms === "sys:menu:edit") {
                this.clickUpdateButton = false
              } else if (res.data[j].perms === "sys:menu:delete") {
                this.clickDeleteButton = false
              } else if (res.data[j].perms === "sys:menu:view") {
                this.clickButton = false
              }
            }


          })
        }

      }
    }
    ,

    getMsg() {
      let allPermission1 = []

      let tableMenu = []
      this.$api.menu.findNavTree("/menu/findNavTree", {"userName": "admin"}).then(res => {
        tableMenu = res.data
      })
      this.$api.menu.findNavTree("/menu/findAllNavTree", {"userName": "admin"}).then(res => {


            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].type === 0) {
                res.data[i].type = '目录'
              }
              if (res.data[i].type === 1) {
                res.data[i].type = '菜单'
              }
              if (res.data[i].type === 2) {
                res.data[i].type = '按钮'
              }
              if (res.data[i].children) {
                for (let j = 0; j < res.data[i].children.length; j++) {
                  if (res.data[i].children[j].type === 0) {
                    res.data[i].children[j].type = '目录'
                  }
                  if (res.data[i].children[j].type === 1) {
                    res.data[i].children[j].type = '菜单'
                  }
                  if (res.data[i].children[j].type === 2) {
                    res.data[i].children[j].type = '按钮'
                  }
                  if (res.data[i].children[j].children) {
                    for (let k = 0; k < res.data[i].children[j].children.length; k++) {
                      if (res.data[i].children[j].children[k].type === 0) {
                        res.data[i].children[j].children[k].type = '目录'
                      }
                      if (res.data[i].children[j].children[k].type === 1) {
                        res.data[i].children[j].children[k].type = '菜单'
                      }
                      if (res.data[i].children[j].children[k].type === 2) {
                        res.data[i].children[j].children[k].type = '按钮'
                      }
                    }
                  }
                }
              }


            }
            let time1 = ''
            let time2 = ''
            this.tableData = res.data
            for (let i = 0; i < this.tableData.length; i++) {
              time1 = this.dateFormat(this.tableData[i].createTime);
              this.tableData[i].createTime = time1
              if (this.tableData[i].lastUpdateTime) {
                time2 = this.dateFormat(this.tableData[i].lastUpdateTime);
                this.tableData[i].lastUpdateTime = time2
              }
              if (this.tableData[i].children) {
                for (let j = 0; j < this.tableData[i].children.length; j++) {
                  time1 = this.dateFormat(this.tableData[i].children[j].createTime);
                  this.tableData[i].children[j].createTime = time1
                  if (this.tableData[i].children[j].lastUpdateTime) {
                    time2 = this.dateFormat(this.tableData[i].children[j].lastUpdateTime);
                    this.tableData[i].children[j].lastUpdateTime = time2
                  }
                  if (this.tableData[i].children[j].children) {
                    for (let k = 0; k < this.tableData[i].children[j].children.length; k++) {
                      time1 = this.dateFormat(this.tableData[i].children[j].children[k].createTime);
                      this.tableData[i].children[j].children[k].createTime = time1
                      if (this.tableData[i].children[j].children[k].lastUpdateTime) {
                        time2 = this.dateFormat(this.tableData[i].children[j].children[k].lastUpdateTime);
                        this.tableData[i].children[j].children[k].lastUpdateTime = time2
                      }
                    }
                  }
                }
              }
            }
            for (let j = 0; j < tableMenu.length; j++) {
              let copylist1 = {
                name: '',
                parentName: '',
                type: '',
                id: ''
              }
              copylist1.name = tableMenu[j].name
              copylist1.parentName = tableMenu[j].parentName
              copylist1.type = tableMenu[j].type
              copylist1.id = tableMenu[j].id
              allPermission1.push(copylist1)
              if (tableMenu[j].children) {
                for (let k = 0; k < tableMenu[j].children.length; k++) {
                  let copylist1 = {
                    name: '',
                    parentName: '',
                    type: '',
                    id: ''
                  }
                  copylist1.name = tableMenu[j].children[k].name
                  copylist1.parentName = tableMenu[j].children[k].parentName
                  copylist1.type = tableMenu[j].children[k].type
                  copylist1.id = tableMenu[j].children[k].id
                  allPermission1.push(copylist1)
                  if (tableMenu[j].children[k].children) {

                    for (let p = 0; p < tableMenu[j].children[k].children.length; p++) {
                      let copylist1 = {
                        name: '',
                        parentName: '',
                        type: '',
                        id: ''
                      }
                      copylist1.name = tableMenu[j].children[k].children[p].name
                      copylist1.parentName = tableMenu[j].children[k].children[p].parentName
                      copylist1.type = tableMenu[j].children[k].children[p].type
                      copylist1.id = tableMenu[j].children[k].children[p].id
                      allPermission1.push(copylist1)
                    }
                  }
                }

              }
            }
            this.allObject = allPermission1
            this.allSearch = allPermission1
            console.log("this.tableData", allPermission1)
            for (let i = 0; i < allPermission1.length; i++) {
              this.allMenu.push(allPermission1[i].name)
            }
          }
      )


    }
    ,
    getId(id) {
      newId = id;

      return newId;
    }
    ,
    deleteMessage(id) {
      id = newId

      this.$api.menu.deleteMsg(`/menu/deleteMsg/${id}`).then(res => {

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


      let garage = 0
      let parentId = 0

      for (let i = 0; i < this.allObject.length; i++) {
        if (this.value === this.allObject[i].name) {
          garage = this.allObject[i].type + 1
          parentId = this.allObject[i].id
        }
      }

      this.$api.menu.changeMsg('/menu/addMsg', {
        "name": addName.value,
        "type": garage,
        "parentId": parentId
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


      this.newMessage.name = r

      updateId = i
      console.log(r, n)
      return updateId
    }
    ,
    updateMsg() {

      this.$api.menu.changeMsg('/menu/updateName', {
        "name": this.newMessage.name,
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
    search() {

      if (input.value) {
        this.$api.menu.changeMsg("/menu/searchMsg", input.value).then(res => {
          console.log("s", res)
          if (res.code === 200) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].type === 0) {
                res.data[i].type = '目录'
              }
              if (res.data[i].type === 1) {
                res.data[i].type = '菜单'
              }
              if (res.data[i].type === 2) {
                res.data[i].type = '按钮'
              }
            }
            for (let i = 0; i < this.allSearch.length; i++) {
              for (let j = 0; j < res.data.length; j++) {
                if (res.data[j].name === this.allSearch[i].name) {
                  res.data[j].parentName = this.allSearch[i].parentName
                }
              }
            }
            this.tableData = res.data
            let time1 = ''
            let time2 = ''
            for (let i = 0; i < this.tableData.length; i++) {
              time1 = this.dateFormat(this.tableData[i].createTime);
              this.tableData[i].createTime = time1
              if (this.tableData[i].lastUpdateTime) {
                time2 = this.dateFormat(this.tableData[i].lastUpdateTime);
                this.tableData[i].lastUpdateTime = time2
              }
              if (this.tableData[i].children) {
                for (let j = 0; j < this.tableData[i].children.length; j++) {
                  time1 = this.dateFormat(this.tableData[i].children[j].createTime);
                  this.tableData[i].children[j].createTime = time1
                  if (this.tableData[i].children[j].lastUpdateTime) {
                    time2 = this.dateFormat(this.tableData[i].children[j].lastUpdateTime);
                    this.tableData[i].children[j].lastUpdateTime = time2
                  }
                  if (this.tableData[i].children[j].children) {
                    for (let k = 0; k < this.tableData[i].children[j].children.length; k++) {
                      time1 = this.dateFormat(this.tableData[i].children[j].children[k].createTime);
                      this.tableData[i].children[j].children[k].createTime = time1
                      if (this.tableData[i].children[j].children[k].lastUpdateTime) {
                        time2 = this.dateFormat(this.tableData[i].children[j].children[k].lastUpdateTime);
                        this.tableData[i].children[j].children[k].lastUpdateTime = time2
                      }
                    }
                  }
                }
              }
            }
          } else {
            this.getMsg()
          }
        })
      } else {
        this.getMsg()
      }

    },
    cleanMsg() {

      addName.value = null
      this.value = ""
    },
    dateFormat(dateStr) {
      const dt = new Date(dateStr);
      const y = dt.getFullYear()
      const m = dt.getMonth() + 1
      const d = dt.getDate()
      return `${y}-${m}-${d}`
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

.menuTable {
  position: relative;
  width: 95%;
  top: 20px;
  left: 25px;
  height: 500px;
  background-image: url("https://cdn.acwing.com/static/web/img/background.png");
}


</style>