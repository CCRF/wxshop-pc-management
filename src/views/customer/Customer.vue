<template>
  <!-- 操作区域 -->
  <div>

  </div>


  <!-- 顾客数据表格 -->
  <div>
    <div class="tbDiv">
    <el-table class="tb" :data="tableData" height="550" border stripe >
      <el-table-column fixed prop="avatar" label="头像" width="110" >
        <template #default="scope">
          <el-image :src="scope.row.avatar"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="微信名" width="120" />
      <el-table-column prop="phoneNumber" label="手机号" width="150" />
      <el-table-column prop="sum" label="总消费额" width="120" sortable />
      <el-table-column prop="isMember" label="会员" width="120" />
      <el-table-column prop="expireTime" label="会员到期时间" width="120" />
      <el-table-column prop="latestTime" label="最近消费时间" width="120" />
      <el-table-column prop="remark" label="备注" width="120" />
    </el-table>
  </div>

    <!-- 排名区域 -->
    <div class="rankDiv">
      <h2>消费排名</h2>
      <div class="first">
        <el-avatar
            fit="contain"
            :size="110"
            :src="rank[0].avatar"
        />

      </div>
      <div class="second">
        <el-avatar
            fit="contain"
            :size="110"
            :src="rank[1].avatar"
            :alt="123"
        />
      </div>
      <div class="third">
        <el-avatar
            fit="contain"
            :size="110"
            :src="rank[2].avatar"
        />
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: "Customer.vue",
  data(){
    return{
      tableData:[],
      rank:[]
    }
  },
  created() {
    this.$api.customer.getAllCustomer("/customer/getAll").then(res=>{
        console.log(res.data)
        this.tableData = res.data;
    })

    this.$api.customer.rank("/customer/rank").then(res=>{
      this.rank = res.data
    })
  },
  methods:{
  }
}
</script>

<style scoped>
  .tbDiv{
    width: 950px;
    padding: 20px 0 0 20px;
    box-shadow: 25px 25px 40px -23px grey;
    float: left;
  }
  .tb{
    width: 950px;
  }
  .rankDiv{
    margin: -5px 0 0 100px; /* 外边距 */
    padding: 0 0 0 5px; /* 内边距 */

    float: left;
  }

  .first{
    padding: 0 0 0 70px;
  }
  .second{
    float: left;
  }
  .third{
    float: left;
    margin-left: 35px
  }
</style>