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
        background-color: beige;
        height: 100%;
        width: 85%;
        float: left;
    }
</style>
