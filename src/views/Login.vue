<template>
  <div class="bgImg">
    <n-card
            :hoverable="true"
    >
      <n-avatar
              :style="{
      color: 'white',
      backgroundColor: '#6e6c6d'
    }"
      >
        {{avatar}}
      </n-avatar>
      <n-input
              :on-blur="showAvator"
              v-model:value="loginForm.username"
              placeholder="用户名："
              id="username"
      />
      <n-input
              v-model:value="loginForm.password"
              placeholder="密码："
              id="password"
              type="password"
      />
      <n-button tertiary type="primary"  @click="login">
        登录
      </n-button>
    </n-card>
  </div>
</template>

<script>
    export default {
        name: 'LoginPage',
        data() {
            return {
                loginForm: {
                    username: "liwei",
                    password: "lw1234",
                },
                avatar:''
            }
        },
        mounted() {
            this.avatar = this.loginForm.username
        },
        methods: {
            showAvator(){
                this.avatar = this.loginForm.username
            },
            login() {
                //1、登录

                this.$api.login.login("/login", this.loginForm).then(res => {
                    console.log("登录成功");
                    console.log(res);

                    //2、存储token(存储在session中)
                    sessionStorage.setItem("token", res.data.token)
                    sessionStorage.setItem("username", this.loginForm.username)


                    console.log(res.data.token)

                    //3、获取用户菜单(该数据要作用于SideBar.vue中)
                    this.$api.menu.findNavTree("/menu/findNavTree", {"userName": this.loginForm.username})
                        .then(res => {
                            console.log("获取用户菜单成功！");
                            console.log(res);

                            this.$store.commit('setNavTree', res.data);

                        }, err => {
                            console.log("获取用户菜单失败！");
                            console.log(err);


                        })
                  let _this=this;
                  this.$api.userManagement.findUserByMsg("/user/findUserByMsg/"+this.loginForm.username).then(function (res){
                    console.log("头像数据",res.data[0].avatar)
                    console.log("昵称",res.data[0].nickName)
                    sessionStorage.setItem("avatar",res.data[0].avatar)
                    sessionStorage.setItem("nickName",res.data[0].nickName)



                    //5、获取头像后再跳转到index.vue
                    _this.$router.push("/index");
                  })

                    //4、获取用户权限
                    // this.$api.user.findPermissions("/user/findPermissions", {'name': this.loginForm.username})
                    //   .then(res => {
                    //     this.$store.commit('setPerms',res);
                    // })



                }, err => {
                    console.log("登录失败", err);
                })
            }
        }
    }
</script>

<style scoped lang="less">

  .bgImg {
    height: 791px;
    background: url("../../public/guet.jpeg") no-repeat;
    background-size: 100% 791px;
    .n-card{
      width: 550px;
      height: 380px;
      position: relative;
      background: rgba(0, 0, 0, 0.6);
      top:28%;
      left: 30%;
      box-shadow: 0 15px  25px rgba(54, 49, 49, 0.5);
      border-radius: 10px;
      .n-avatar{
        width: 60px;
        height: 60px;
        position: absolute;
        top: 25%;
        left: 42%;
      }
      #username{
        width: 300px;
        position: absolute;
        top: 45%;
        left: 20%;
      }
      #password{
        width: 300px;
        position: absolute;
        top: 60%;
        left: 20%;
      }
      .n-button{
        width: 100px;

        position: absolute;
        top: 75%;
        left:38%;
        border: 1px #109258 solid;
      }
    }
  }


</style>
