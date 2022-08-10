<template>
  <!-- 操作区域 -->
  <div>
<!--    <el-upload action="http://localhost:8090/customer/upload">-->
    <el-upload action="https://g1.glypro19.com/customer/upload">
      <el-button type="primary">新增</el-button>
    </el-upload>
    <el-button type="primary" @click="this.insertVisible=true">新增商品</el-button>
    <el-button type="primary" @click="test">test</el-button>
  </div>

  <el-dialog v-model="insertVisible" title="新增商品" width="500px" @close="close" center>
    <el-form label-width="100px" label-position="right"  >
      <el-form-item label="套 餐 名 称">
        <el-input v-model="addform.name" />
      </el-form-item>
      <el-form-item label="套 餐 名 称">
        <el-input v-model="addform.nickName" />
      </el-form-item>

      <el-form-item label="图片上传">
        <el-upload
            action=''
            ref="upload"
            list-type="picture-card"
            accept="image/jpeg,image/jpg,image/png"
            :auto-upload="false"
            :file-list="files"
            :headers="importHeaders"
        >
          <el-button type="primary">上传图片</el-button>
        </el-upload>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click='insertGoods'>提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 顾客数据表格 -->
  <div>
    <el-table :data="tableData" style="width: 100%" height="400" border stripe>
      <el-table-column fixed prop="avatar" label="头像" width="70" >
        <template #default="scope">
          <el-image :src="scope.row.avatar"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="微信名" width="120" />
      <el-table-column prop="phoneNumber" label="手机号" width="120" />
      <el-table-column prop="sum" label="总消费额" width="120" sortable />
      <el-table-column prop="isMember" label="会员" width="120" />
      <el-table-column prop="expireTime" label="会员到期时间" width="120" />
      <el-table-column prop="latestTime" label="最近消费时间" width="120" />
      <el-table-column prop="remark" label="备注" width="120" />
    </el-table>
  </div>

</template>


<script>
import axios from 'axios';
import qs from 'qs';

export default {
  name: "Customer.vue",
  data(){
    return{
      tableData:[],
      insertVisible:false,
      addform:{
        name:"",
        nickName:""
      },
      files:[],
      importHeaders: {
        enctype: "multipart/form-data",
      },
    }
  },
  mounted() {
    let token=sessionStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = token;

    this.$api.customer.getAllCustomer("/customer/getAll").then(res=>{
        console.log(res.data)
      this.tableData = res.data;
    },err=>{

    })
  },
  methods:{
    test(e) {
       axios.get("http://localhost:8090/customer/test")
    },
    insertGoods(){

      // axios.post("http://localhost:8090/customer/upload",
      //     {
      //   "insertVisible":this.insertVisible,
      //   "file":this.address
      //     }, {
      //       headers: {
      //         'Content-Type': 'application/x-www-form-urlencoded'
      //       }
      //     })

      const data = { 'file': this.files[0],'insertVisible':this.insertVisible ,'name':this.addform.name };
      const options = {
        method: 'POST',
        // headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { 'content-type': 'multipart/form-data' },

        data: qs.stringify(data),
        url:"http://localhost:8090/customer/upload",
      };
      axios(options)
    }
  }
}
</script>

<style scoped>

</style>