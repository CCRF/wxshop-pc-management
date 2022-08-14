<template>
  <br>
  <div class="selectInp">
    <el-input   type="text" v-model="queryData"  placeholder="请输入查询内容"></el-input>
  </div>
  <div class="selectInp">
    <el-button class="setext" type="primary" round @click="query" :disabled="isClickButton">查询</el-button>
    <el-button class="setext" type="primary" round @click="insertNewUser" :disabled="isClickButton">新增用户</el-button>
    <el-button class="setext" type="primary" round @click="reload" :disabled="isClickButton">所有用户</el-button>
  </div>

  <el-table
      :data="userData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      border
      class="table"
      style="width:1520px"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange">

    <el-table-column
        fixed
        label="全选"
        align="center"
        width="40"
        type="selection"
        :reserve-selection="true"
        >
    </el-table-column>

    <el-table-column
        fixed
        align="center"
        prop="id"
        label="编号"
        width="60">
    </el-table-column>
    <el-table-column
        prop="name"
        align="center"
        label="名字"
        width="100">
    </el-table-column>
    <el-table-column
        prop="nickName"
        align="center"
        label="昵称"
        width="100">
    </el-table-column>
<!--    <el-table-column-->
<!--        prop="avatar"-->
<!--        label="avatar"-->
<!--        width="40">-->
<!--    </el-table-column>-->
<!--    <el-table-column-->
<!--        prop="password"-->
<!--        align="center"-->
<!--        label="密码"-->
<!--        width="180">-->
<!--    </el-table-column>-->
    <el-table-column
        prop="email"
        align="center"
        label="邮箱"
        width="220">
    </el-table-column>
    <el-table-column
        prop="mobile"
        align="center"
        label="电话号码"
        width="140">
    </el-table-column>
    <el-table-column
        prop="status"
        align="center"
        label="账户状态"
        :formatter="statusFormat"
        width="100">
    </el-table-column>
    <el-table-column
        prop="deptId"
        align="center"
        label="部门编号"
        width="100">
    </el-table-column>
    <el-table-column
        prop="createBy"
        align="center"
        label="创建者"
        width="100">
    </el-table-column>
    <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
        :formatter="timeFormatter"
        width="185">
    </el-table-column>
    <el-table-column
        prop="lastUpdateBy"
        align="center"
        label="最后更新"
        width="100">
    </el-table-column>
    <el-table-column
        prop="delFlag"
        align="center"
        label="封禁"
        :formatter="delFlagFormat"
        width="100">
    </el-table-column>
    <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="175">
      <template #default="scope">
        <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            :disabled="isClickButton">编辑</el-button>
        <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            :disabled="isClickButton">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="outerVisible" width="400px" >

    <div>
      <el-form
        status-icon
        label-width="80px"
        class="demo-ruleForm"
        :model="updateData"
        :rules="rules"
        ref="updateData"
    >
      <el-form-item label="头像">
        <el-upload
            action="https://g1.glypro19.com/user/upload"
            method="post"
            :show-file-list="false"
            :headers="header"
            :before-upload="beforeAvatarUpload"
            :on-success="successUpload"
            >
          <el-avatar size="large" class="herdIcon"><img :src="this.updateData.avatar" alt=""></el-avatar>
        </el-upload>

        
      </el-form-item>
      <el-form-item label="编号" >
        <el-input v-model="this.updateData.id"  type="text" readonly/>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="this.updateData.name" type="text" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input type="text" autocomplete="off" v-model="this.updateData.nickName"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="this.updateData.password" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" autocomplete="off" v-model="this.updateData.email"/>
      </el-form-item>
      <el-form-item label="电话号码" prop="mobile">
        <el-input type="text" autocomplete="off" v-model="this.updateData.mobile"/>
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <span>0:异常;1:正常</span>
        <el-input-number :min="0" :max="1" type="text" autocomplete="off" v-model="this.updateData.status"/>
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input type="text" autocomplete="off" v-model="this.updateData.deptId"/>
      </el-form-item>
      <el-form-item label="角色身份">
        <el-select v-model="this.roleData.remark" class="m-2" >
          <el-option
              v-for="item in roleData"
              :key="item.id"
              :label="item.remark"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否删除">
        <span>-1:已删除;0:使用中</span>
        <el-input-number  :min="-1" :max="0" type="text" autocomplete="off" v-model="this.updateData.delFlag"/>
      </el-form-item>



    </el-form></div>
    <div class="dialog-footer">
      <el-button @click="outerVisible = false" >取消</el-button>
      <el-button type="primary" @click="submit('updateData')">提交</el-button
      >
    </div>
  </el-dialog>

  <el-dialog v-model="insertVisible" title="新增用户" width="400px">
    <div><el-form
        status-icon
        label-width="80px"
        class="demo-ruleForm"
        :model="insertData"
        :rules="rules"
        ref="insertData"
    >
      <el-form-item label="头像">
        <el-upload
            action="https://g1.glypro19.com/user/upload"
            method="post"
            :show-file-list="false"
            :headers="header"
            :before-upload="beforeAvatarUpload"
            :on-success="successUpload1"
        >
          <el-avatar size="large" class="herdIcon"><img :src="this.insertData.avatar" alt=""></el-avatar>
        </el-upload>
      </el-form-item>
      <el-form-item label="编号" prop="id">
        <el-input v-model="this.insertData.id"  type="text" />
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="this.insertData.name" type="text" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input type="text" autocomplete="off" v-model="this.insertData.nickName"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="this.insertData.password" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" autocomplete="off" v-model="this.insertData.email"/>
      </el-form-item>
      <el-form-item label="电话号码" prop="mobile">
        <el-input type="text" autocomplete="off" v-model="this.insertData.mobile"/>
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <span>0:异常;1:正常</span>
        <el-input-number :min="0" :max="1" type="text" autocomplete="off"  v-model="this.insertData.status"/>
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input type="text" autocomplete="off" v-model="this.insertData.deptId"/>
      </el-form-item>
      <el-form-item label="角色身份">
        <el-select v-model="this.roleData.remark" class="m-2" >
          <el-option
              v-for="item in roleData"
              :key="item.id"
              :label="item.remark"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否删除">
        <span>-1:已删除;0:使用中</span>
        <el-input-number  :min="-1" :max="0" type="text" autocomplete="off" v-model="this.insertData.delFlag"/>
      </el-form-item>



    </el-form></div>
    <div class="dialog-footer">
      <el-button @click="insertVisible = false" >取消</el-button>
      <el-button type="primary" @click="insertSubmit('insertData')">提交</el-button
      >
    </div>
  </el-dialog>
  <br>
  <div class="selectInp">
    <el-button   type="primary" round @click="deleteMore" :disabled="isClickButton">批量删除</el-button>
  </div>
  <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="PageSize"
      layout="prev, pager, next"
      :total="this.totalCount"
      class="mt-4"
  />


</template>

<script>
import axios from "axios";




export default {
    name: "UserManagement",
  created() {
      let username=sessionStorage.getItem("username")
      let token=sessionStorage.getItem("token");
      axios.defaults.headers.common['Authorization'] = token;
      let _this=this;
      this.$api.userManagement.findAllUser("/user/findAllUser").then(function (res){
      // axios.get("http://localhost:8090/user/findAllUser").then(function (res){
        _this.userData=res.data
        _this.totalCount=res.data.length
      })
      this.$api.userManagement.findAllRole("/user/findAllRole").then(function (res){
      // axios.get("http://localhost:8090/user/findAllRole").then(function (res){
        console.log("信息",res.data)
        _this.roleData=res.data})
      this.$api.userManagement.findUserByName("/user/findUserByName/"+username).then(function (res){
      // axios.get("http://localhost:8090/user/findUserByName/"+username)
      //   .then(function (res){
          _this.permission=res.data[0]
          console.log(_this.permission.remark)
          if(_this.permission.remark==="admin"){
            _this.isClickButton=false
          }
        })
  },

  data(){
    return {
      header:{
        token:sessionStorage.getItem("token"),
      },
        ImageUrl:'',
        PageSize:7,
        currentPage:1,
        totalCount:"",
        isClickButton:true,
        permission:[
          {
            name:"",
            remark:"",
          }
        ],
        userData: [
        ],
        outerVisible:false,
        insertVisible:false,
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
            roleId:"",
          },
      insertData:
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
            status:1,
            delFlag:"",
            nowTime:"",
            roleId:"",
          },
      rules: {
          id:[
            {required: true, message: '请输入编号', trigger: 'blur'}
          ],
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
      queryData:'',
      roleData:[
      ],
      multipleSelection: [],
      imghead:"https://g1.glypro19.com/img/avatar/",

      }
  },

  methods: {
    beforeAvatarUpload(file){
      console.log("file文件为",file)

      const isJPG = file.type === "image/jpeg";
      const isJPG2 = file.type === "image/jpg";
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isJPG2 && !isPNG) {
        ElMessage({
          type:"warning",
          message:"只支持jpg或png格式图片"
        })
      }
      if (!isLt5M) {
        ElMessage({
          type:"warning",
          message:"请上传5MB以内的图片!"
        })
      }
      this.uploadImage = file
      return (isJPG || isJPG2 || isPNG) && isLt5M;
    },

    successUpload(response){
      let _this=this;
      let path=this.updateData.avatar.replace('https://g1.glypro19.com/img/avatar/','')
      if(this.insertData.avatar!=""&&this.insertData.avatar!=null){
        this.$api.userManagement.deleteImg("/user/deleteImg/"+path).then(function (res){
          if(res){
            if (response.code==200){
              _this.updateData.avatar = _this.imghead+response.msg;
              console.log("返回的路径为",_this.updateData.avatar);
              _this.$api.userManagement.updateUser("/user/updateUser",JSON.parse(JSON.stringify(_this.updateData)));
            }else {
              window.alert("上传失败")
            }
          }
        });
      }else{
        if (response.code==200){
          _this.updateData.avatar = _this.imghead+response.msg;
          console.log("返回的路径为",_this.updateData.avatar);
          _this.$api.userManagement.updateUser("/user/updateUser",JSON.parse(JSON.stringify(_this.updateData)));
        }
      }
    },
    successUpload1(response){
      let _this=this;
      let path=this.insertData.avatar.replace('https://g1.glypro19.com/img/avatar/','')
      if(this.insertData.avatar!=""&&this.insertData.avatar!=null){
        this.$api.userManagement.deleteImg("/user/deleteImg/"+path).then(function (res){
          if(res){
            if (response.code==200){
              _this.insertData.avatar = _this.imghead+response.msg;
              console.log("返回的路径为",_this.insertData.avatar);
              _this.$api.userManagement.updateUser("/user/updateUser",JSON.parse(JSON.stringify(_this.insertData)));
            }else {
              window.alert("上传失败")
            }
          }

        });
      }else{
        if (response.code==200) {
          _this.insertData.avatar = _this.imghead + response.msg;
          console.log("返回的路径为", _this.insertData.avatar);
          _this.$api.userManagement.updateUser("/user/updateUser", JSON.parse(JSON.stringify(_this.insertData)));
        }
      }
    },
    getRowKeys(row) {
      return row.id
    },
    timeFormatter(row){
      let a = new Date(row.createTime).getTime();
      let myDate = new Date(a);
      let yy = String(myDate.getFullYear())
      let mm = myDate.getMonth() + 1
      let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
      let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
      let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
      let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())
      let date = yy + '-' + mm + '-' + dd +' '
      let time = hou + ':' + min + ':' + sec
      let data=date+time
      return data;
    },
    statusFormat(row){
      if(row.status===1){
        row.status="正常";
      }else if(row.status===0){
        row.status="异常";
      }
      return row.status;
    },
    delFlagFormat(row){
      if(row.delFlag===0){
        row.delFlag="正常";
      }else if(row.status===-1){
        row.delFlag="异常";
      }
      return row.delFlag;
    },
    deleteMore(){
      for(let i=0;i<this.multipleSelection.length;i++){
        this.$api.userManagement.deleteUser("/user/deleteUser/"+this.multipleSelection[i].id+"/"+
            this.multipleSelection[i].avatar.replace('https://g1.glypro19.com/img/avatar/','')+"")
      }
      this.$alert("删除成功！")
      this.reload();
    },
    handleSelectionChange(val) {
      let _this= this;
      this.multipleSelection = val;
      for(let i=0;i<this.multipleSelection.length;i++){
        _this.arr.push(this.multipleSelection[i].id)
      }
      console.log(this.arr)
    },
    handleSizeChange(val) {
      this.PageSize=val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage=1
    },
    handleCurrentChange(val) {
      this.currentPage=val
    },

    getCurrentTime() {
      //获取当前时间
      let myDate = new Date()
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
        this.$api.userManagement.deleteUser("/user/deleteUser/"+row.id+"/"+row.avatar.replace('https://g1.glypro19.com/img/avatar/','')+"").then(function (res){
        // axios.delete ("http://localhost:8090/user/deleteUser/"+row.id).then(function (res){
          if (res.data){
            _this.$alert(''+row.name+'删除成功','提示',{
              confirmButtonText:'确定',
            })
            _this.reload()
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
      this.$api.userManagement.findById("/user/findById/"+row.id).then(function (res){
          // axios.get("http://localhost:8090/user/findById/"+row.id)
          //     .then(function (res){
                if(res){
                  console.log("填充",res.data[0])
                  _this.updateData=res.data[0]
                  _this.roleData.id=res.data[0].roleId
                  _this.roleData.remark=Number(_this.roleData.id)
                  if(_this.roleData.remark!=null){
                    _this.outerVisible = true
                  }else {
                    _this.outerVisible = false
                  }
                }
              })
    },
    submit(formName){
      let _this= this;
      let nowDate=this.getCurrentTime();
      this.updateData.nowTime=nowDate;
      this.updateData.roleId=this.roleData.remark;
      console.log("id",this.updateData.roleId)
      console.log(JSON.stringify(this.updateData))
      let d = JSON.parse(JSON.stringify(this.updateData))


      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.userManagement.updateUser("/user/updateUser",d).then(function (res){
          // axios.post("http://localhost:8090/user/updateUser",d).then(function (res){
            if (res){
              _this.$alert('修改成功','提示',{
                confirmButtonText:'确定',
              })
              _this.reload()
            }
          })
          this.outerVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      })


    },
    query(){
      if(this.queryData!=null&&this.queryData.length>0){
        let _this= this;
        this.$api.userManagement.findUserByMsg("/user/findUserByMsg/"+this.queryData).then(function (res){
        // axios.get("http://localhost:8090/user/findUserByMsg/"+this.queryData)
        //     .then(function (res){
              _this.userData=res.data
              _this.totalCount=res.data.length
            })
      }else {
        this.$message({
          type: 'warning',
          message: '请输入查询内容！'
        });
      }

    },
    insertNewUser(){
      this.roleData.remark=3;
      this.insertVisible=true;
    },
    insertSubmit(formName){
      let _this= this;

      let nowDate=this.getCurrentTime();
      this.insertData.nowTime=nowDate;
      this.insertData.roleId=this.roleData.remark;
      console.log("roleId",this.insertData.roleId)
      console.log(JSON.stringify(this.insertData))
      let data = JSON.parse(JSON.stringify(this.insertData))

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.userManagement.insertUser("/user/insertUser",data).then(function (res){
          // axios.post("http://localhost:8090/user/insertUser",data)
          // .then(function (res){
            if(res){
              _this.$alert("插入用户成功！");
              _this.reload()
            }
          })
          this.insertVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      })




    },
    reload(){
      let _this= this;
      this.$route.path='/index/1'
      this.$router.replace({path:this.$route.path}).then(function (){
            _this.$route.path='/index/user';
            _this.$router.replace({path:_this.$route.path})
      })

    }


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
  margin-top: 20px;
  margin-left: 700px;
}
.selectInp{
  position: relative;
  width: 300px;
  float: left;
  top: 20px;
  left: 25px;
  right: 25px;
  margin-bottom: 10px;
}
.m-2{
  width: 300px;
}
.setext{
  margin-left: 10px;
}
.table {
  position: relative;
  top: 20px;
  left: 25px;
}
.herdIcon{
  margin-left: 80px;
}

</style>