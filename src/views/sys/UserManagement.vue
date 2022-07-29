<template>
  <br>
  <div class="selectInp">
    <el-input   type="text" v-model="queryData"  placeholder="请输入查询内容"></el-input>

  </div>
  <el-button class="setext" type="primary" round @click="query">查询</el-button>
  <el-table
      :data="userData"
      border
      class="table"
      style="width: 100%">
    <el-table-column
        fixed
        prop="id"
        label="编号"
        width="60">
    </el-table-column>
    <el-table-column
        prop="name"
        label="名字"
        width="80">
    </el-table-column>
    <el-table-column
        prop="nickName"
        label="nickName"
        width="80">
    </el-table-column>
    <el-table-column
        prop="avatar"
        label="avatar"
        width="80">
    </el-table-column>
    <el-table-column
        prop="password"
        label="密码"
        width="175">
    </el-table-column>
    <el-table-column
        prop="salt"
        label="密码盐"
        width="175">
    </el-table-column>
    <el-table-column
        prop="email"
        label="邮箱"
        width="195">
    </el-table-column>
    <el-table-column
        prop="mobile"
        label="电话号码"
        width="120">
    </el-table-column>
    <el-table-column
        prop="status"
        label="账户状态"
        width="60">
    </el-table-column>
    <el-table-column
        prop="deptId"
        label="部门编号"
        width="60">
    </el-table-column>
    <el-table-column
        prop="createBy"
        label="创建者"
        width="60">
    </el-table-column>
    <el-table-column
        prop="createTime"
        label="创建时间"
        width="145">
    </el-table-column>
    <el-table-column
        prop="lastUpdateBy"
        label="最后更新"
        width="60">
    </el-table-column>
    <el-table-column
        prop="delFlag"
        label="封禁"
        width="60">
    </el-table-column>
    <el-table-column
        fixed="right"
        label="操作"
        width="160">
      <template #default="scope">
        <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="outerVisible" title="编辑" width="400px">
    <div><el-form
        status-icon
        label-width="80px"
        class="demo-ruleForm"
        :model="updateData"
        :rules="rules"

    >
      <el-form-item label="编号" >
        <el-input v-model="this.updateData.id"  type="text" readonly/>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="this.updateData.name" type="text" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="nickName">
        <el-input type="text" autocomplete="off" v-model="this.updateData.nickName"/>
      </el-form-item>
      <el-form-item label="avatar">
        <el-input v-model="this.updateData.avatar" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="this.updateData.password" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码盐">
        <el-input v-model="this.updateData.salt" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" autocomplete="off" v-model="this.updateData.email"/>
      </el-form-item>
      <el-form-item label="电话号码" prop="mobile">
        <el-input type="text" autocomplete="off" v-model="this.updateData.mobile"/>
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <el-input-number :min="0" :max="1" type="text" autocomplete="1：账号正常；0：账号弃用" v-model="this.updateData.status"/>
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input type="text" autocomplete="off" v-model="this.updateData.deptId"/>
      </el-form-item>
      <el-form-item label="是否删除">
        <el-input-number  :min="-1" :max="0" type="text" autocomplete="off" v-model="this.updateData.delFlag"/>
      </el-form-item>



    </el-form></div>
    <div class="dialog-footer">
      <el-button @click="outerVisible = false" >取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button
      >
    </div>
  </el-dialog>
  <br>
  <el-pagination
      background
      layout="prev, pager, next"
      :total="2"
      class="mt-4"
  />
</template>

<script>
import axios from "axios";



export default {
    name: "UserManagement",
  created() {
      let token=sessionStorage.getItem("token");
      axios.defaults.headers.common['Authorization'] = token;
      let _this=this;
      axios.get("http://localhost:8090/user/findAllUser").then(function (res){
        console.log("获取到的数据",res);
        _this.userData=res.data
      })

  },




  data(){


    return {
        userData: [
        ],
        outerVisible:false,
        updateData:
          {
            id:"",
            name:"",
            nickName:"",
            avatar:"",
            password:"",
            salt:"",
            email:"",
            mobile:"",
            deptId:"",
            status:'',
            delFlag:"",
            nowTime:"",
          },
      rules: {
        name: [
          {required: true, message: '请输入名字', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        mobile:[
          {required: true, message: '请输入合法的电话号码', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入11位电话号码', trigger: 'blur'}
        ],
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
      },
      queryData:''
      }
  },
  methods: {

    getCurrentTime() {
      //获取当前时间
      let myDate = new Date()
      let wk = myDate.getDay()
      let yy = String(myDate.getFullYear())
      let mm = myDate.getMonth() + 1
      let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
      let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
      let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
      let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())
      this.nowDate = yy + '-' + mm + '-' + dd +' '
      this.nowTime = hou + ':' + min + ':' + sec
      let nowdata=this.nowDate+this.nowTime
      return nowdata
    },

    handleDelete(row){
      let _this= this;
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete ("http://localhost:8090/user/deleteUser/"+row.id).then(function (res){
          if (res.data){
            _this.$alert(''+row.name+'删除成功','提示',{
              confirmButtonText:'确定',
            })
            location.reload()
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleEdit(row){
      console.log(this.updateData)
      let _this= this;

      axios.get("http://localhost:8090/user/findById/"+row.id)
      .then(function (res){
          console.log("填充",res.data)
          _this.updateData=res.data[0]
          console.log(_this.updateData)

          _this.outerVisible=true

      })
    },
    submit(){
      let _this= this;
      this.outerVisible = false;
      let nowDate=this.getCurrentTime();
      this.updateData.nowTime=nowDate;
      console.log(JSON.stringify(this.updateData))

      let d = JSON.parse(JSON.stringify(this.updateData))
      axios.post("http://localhost:8090/user/updateUser",d).then(function (res){
        if (res.data){
          _this.$alert('修改成功','提示',{
            confirmButtonText:'确定',
          })
          location.reload()
        }
      })

    },
    query(){
      let _this= this;
      axios.get("http://localhost:8090/user/findUserByMsg/"+this.queryData)
      .then(function (res){
        _this.userData=res.data
      })
    },


  },
}
</script>

<style>
.dialog-footer {
  margin-left: 200px;
}

.el-input-number{
  margin-left: 50px;
}
.mt-4{
  margin-left: 600px;
}
.selectInp{
  width: 300px;
  float: left;
}


</style>