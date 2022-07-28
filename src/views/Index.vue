<template>
    <div class="index">
        <Header></Header>
        <side-bar></side-bar>
        <main-content></main-content>
    </div>
</template>

<script>
import Header from "./Header.vue"
import SideBar from "./SideBar.vue"
import MainContent from "./MainContent.vue"

export default {
    name: "IndexPage",
    components: {
        Header,
        SideBar,
        MainContent
    },

}
</script>

<style scoped>
    .index{
        width:100%;
        height:520px;
    }
</style>