<template>
  <div>
    <label for="userName">用户名：</label><input type="text" id="userName" v-model="loginForm.username">
    <label for="password">密码：</label><input type="text" id="password" v-model="loginForm.password">
    <button @click="login">登录</button>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return{
        loginForm: {
            username: "liwei",
            password: "lw1234"
        }
    }
  },
  methods:{
    login(){
      //1、登录
      this.$api.login.login("/login", this.loginForm).then(res=>{
        console.log("登录成功");
        console.log(res);

        //2、存储token(存储在session中)
        sessionStorage.setItem("token", res.data.token)

        //3、获取用户菜单(该数据要作用于SideBar.vue中)
        this.$api.menu.findNavTree("/menu/findNavTree", {"userName":this.loginForm.username})
        .then(res => {
          console.log("获取用户菜单成功！");
          console.log(res);

          this.$store.commit('setNavTree',res.data);

        },err => {
          console.log("获取用户菜单失败！");
          console.log(err);


        })

        //4、获取用户权限


        //5、跳转到index.vue
        this.$router.push("/index");
      },err => {
        console.log("登录失败", err);
      })
    }
  }
}
</script>

<style scoped>

</style>
