<template>
  <div class="sideBar">
    <ul class="menu" v-for="menu in navTree" :key="menu.id">
      <tree-menu :menu="menu"></tree-menu>
    </ul>
  </div>
</template>

<script>
import TreeMenu from "./TreeMenu.vue"

export default {
  name: "SideBar",
  components:{
    TreeMenu
  },
  computed: {
    navTree() {
      let tree = this.$store.getters.getNavTree;
      return tree;
    }
  },
}
</script>

<style scoped>
  .sideBar{
    background-color: antiquewhite;
    width: 15%;
    height: 100%;
    float: left;
  }
</style>