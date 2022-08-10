<template>
  <div class="sideBar">

        <!-- 菜单头部 -->
        <h2 style="text-align: center;color: white">菜单</h2>
        <hr>

        <!-- 菜单区域 -->
        <el-menu
            active-text-color="#ffd04b"
            background-color="9f9c9c"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
        >
          <!-- 菜单区域 -->
          <div class="menu" v-for="menu in navTree" :key="menu.id">

            <!-- 有二级菜单 -->
            <el-sub-menu :index="menu.id" v-if="menu.url==null || menu.url===''">
              <template #title>
                <el-icon><Setting /></el-icon>
                <a>{{menu.name}}</a>
              </template>
              <router-link :to="childMenu.url" v-for="childMenu in menu.children">
                <el-menu-item :index="menu.id+'-'+childMenu.id">
                  <el-icon><icon-menu /></el-icon>
                  {{childMenu.name}}
                </el-menu-item>
              </router-link>
            </el-sub-menu>

            <!-- 只有一级菜单 -->
            <router-link :to="menu.url" v-else>
              <el-menu-item :index="menu.id">
                <el-icon><icon-menu /></el-icon>
                {{menu.name}}
              </el-menu-item>
            </router-link>
          </div>
        </el-menu>

  </div>
</template>

<script>
export default {
  name: "SideBarTest",
  data(){
    return{
      p:0,
      c:0
    }
  },
  computed:{
    childId(parentId, childId){
      return parentId + "-" + childId;
    },
    navTree(){
      return this.$store.getters.getNavTree;
    }
  }
}
</script>

<style scoped>
  .sideBar{
    background-color: #9f9c9c;
    width: 15%;
    height: 100%;
    float: left;
  }
  a{
    text-decoration: none;
    color: white;
    font-size: large;
  }
  a.is-active {
    color: var(--el-menu-active-color);
  }
  li{
    font-size: large;
  }
</style>