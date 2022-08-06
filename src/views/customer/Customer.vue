<template>
  <!-- 操作区域 -->
  <div>

  </div>

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
export default {
  name: "Customer.vue",
  data(){
    return{
      tableData:[]
    }
  },
  mounted() {
    this.$api.customer.getAllCustomer("/customer/getAll").then(res=>{
        console.log(res.data)
      this.tableData = res.data;
    },err=>{

    })
  },
  methods:{
    test(e) {
      console.log(e);
    }
  }
}
</script>

<style scoped>

</style>