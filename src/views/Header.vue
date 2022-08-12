<template>
  <div class="header">
      <!-- 右边区域 -->
      <div class="toolbar">
        <div class="nickName">{{this.nickName}}</div>
        <el-dropdown>

            <el-avatar
                fit="contain"
                size="large"
                :src="avatar"
            />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logoutVisible=true">注销</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

    <!-- 注销提示框 -->
    <el-dialog
        v-model="logoutVisible"
        title="Tips"
        width="30%"
    >
      <span>是否确认退出？</span>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="logoutVisible = false">取消</el-button>
        <el-button type="primary" @click="logout">确认</el-button>
      </span>
      </template>
    </el-dialog>
  </div>

</template>

<script>
export default {
    name: "HeaderPage",
  created() {
      this.avatar=sessionStorage.getItem('avatar')
  },
  data(){
      return{
        logoutVisible:false,
        avatar:"",
        nickName:sessionStorage.getItem("nickName"),
      }
    },
    methods:{
      logout(){
        this.logoutVisible=false
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("username")
        this.$router.push("/");
      },

    }
}
</script>

<style scoped>
    .header{
        background-color: #4e5455;
        width: 100%;
        height: 15%;
    }
    .toolbar{
      text-align: right;
      padding: 15px 15px 0 0 ;
    }
    .nickName{
      float: left;
      margin-top: 16px;
      margin-left: 94%;
    }
</style>