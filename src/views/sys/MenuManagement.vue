<template>
  <el-input v-model="input" class="search" placeholder="搜索" style="width: 70%"/>&nbsp;
  <el-button type="success" plain @click="search()" class="search" :disabled="clickButton">查询</el-button>
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
    <el-input
        v-model="addUrl"
        placeholder="菜单路径"
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
      <el-form-item label="菜单路径(非必须)">
        <el-input v-model="newMessage.url"/>
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
  <div class="menuTable">
    <el-table :data="tableData" stripe>
      <el-table-column prop="name" label="菜单名字" width="250"/>
      <el-table-column prop="url" label="菜单路径" width="300"/>
      <el-table-column prop="parentName" label="菜单所属" width="300"/>
      <el-table-column prop="type" label="菜单等级"/>
      <el-table-column fixed="right" label="选择" width="200">

        <template #default="scope">

          <el-button type="primary" :plain="true" size="small" :disabled="clickUpdateButton"
                     @click="getNewMsg(scope.row.name,scope.row.url,scope.row.id);dialogVisibleUpdate=true"
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
  </div>


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
const addUrl = ref("");
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
      addUrl,
      form,
      options: [],
      value1,
      newMessage: {
        name: '',
        url: '',
      },
      input,
      clickAddButton: true,
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
      allMenu: [],
      value,
      allObject: []
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
          this.clickDeleteButton = false
        } else {
          this.$api.roleManagement.getAll(`/role/getNewMsgByName/${name}`).then(res => {

            for (let j = 0; j < res.data.length; j++) {
              if (res.data[j].name === "菜单查看") {
                this.clickButton = false
              } else if (res.data[j].name === "菜单新增") {
                this.clickAddButton = false
              } else if (res.data[j].name === "菜单修改") {
                this.clickUpdateButton = false
              } else if (res.data[j].name === "菜单删除") {
                this.clickDeleteButton = false
              }
            }


          })
        }

      }
    }
    ,

    getMsg() {
      let allPermission1 = []
      this.$api.menu.findNavTree("/menu/findAllNavTree", {"userName": "admin"}).then(res => {

            for (let j = 0; j < res.data.length; j++) {
              let copylist1 = {
                name: '',
                parentName: '',
                type: '',
                id: ''
              }
              copylist1.name = res.data[j].name
              copylist1.parentName = res.data[j].parentName
              copylist1.type = res.data[j].type
              copylist1.id = res.data[j].id
              allPermission1.push(copylist1)
              if (res.data[j].children) {
                for (let k = 0; k < res.data[j].children.length; k++) {
                  let copylist1 = {
                    name: '',
                    parentName: '',
                    type: '',
                    id: ''
                  }
                  copylist1.name = res.data[j].children[k].name
                  copylist1.parentName = res.data[j].children[k].parentName
                  copylist1.type = res.data[j].children[k].type
                  copylist1.id = res.data[j].children[k].id
                  allPermission1.push(copylist1)
                  if (res.data[j].children[k].children) {

                    for (let p = 0; p < res.data[j].children[k].children.length; p++) {
                      let copylist1 = {
                        name: '',
                        parentName: '',
                        type: '',
                        id: ''
                      }
                      copylist1.name = res.data[j].children[k].children[p].name
                      copylist1.parentName = res.data[j].children[k].children[p].parentName
                      copylist1.type = res.data[j].children[k].children[p].type
                      copylist1.id = res.data[j].children[k].children[p].id
                      allPermission1.push(copylist1)
                    }
                  }
                }

              }
            }
            this.allObject = allPermission1
            console.log("allPermission1", this.allObject)

          }
      )
      this.$api.menu.findNavTree(`/menu/findAll/${this.currentPage}/${this.pageSize}`).then(res => {


        this.totalCount = res.data.totalCount;
        for (let i = 0; i < allPermission1.length; i++) {
          for (let o = 0; o < res.data.rows.length; o++) {
            if (res.data.rows[o].name === allPermission1[i].name) {
              res.data.rows[o].parentName = allPermission1[i].parentName
            }
          }
        }
        this.tableData = res.data.rows
        console.log(this.tableData)
        for (let i = 0; i < allPermission1.length; i++) {
          this.allMenu.push(allPermission1[i].name)
        }
        console.log("allMenu", this.allMenu)
      })


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
        "url": addUrl.value,
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
      this.newMessage.url = n

      updateId = i
      console.log(r, n)
      return updateId
    }
    ,
    updateMsg() {

      this.$api.menu.changeMsg('/menu/updateName', {
        "name": this.newMessage.name,
        "url": this.newMessage.url,
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


    search() {

      if (input.value) {
        this.$api.menu.changeMsg("/menu/searchMsg", input.value).then(res => {
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

    }
    ,

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

      addName.value = null
      addUrl.value = null
      this.value = ""
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
}
</style>