<template>
    <div class="mainContent">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "MainContent"
}
</script>

<style>
    .mainContent{
        background-color: white;
        background-image: url("https://cdn.acwing.com/static/web/img/background.png");
        height: 100%;
        width: 85%;
        float: left;
    }
</style>
