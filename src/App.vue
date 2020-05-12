<template>
    <el-container ref="homePage">
        <el-header>
            <Header></Header>
        </el-header>
        <el-container>
            <el-aside width="240px">
                <Nav></Nav>
            </el-aside>
            <el-main id="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Header from "@/components/Header";
    import Nav from "@/components/Nav";

    export default {
        name: 'App',
        components: {
            Header, Nav
        }
    }
</script>

<style>

    .el-header {
        position: relative;
        width: 100%;
        border-bottom-width: 1px;
        border-bottom-color: #dedfe2;
        border-bottom-style: solid;
    }

    .el-footer {
        border-top-width: 1px;
        border-top-color: #dedfe2;
        border-top-style: solid;
    }

    .el-aside {
        display: block;
        position: absolute;
        left: 0;
        top: 60px;
        bottom: 0;
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
        border-right-width: 1px;
        border-right-color: #dedfe2;
        border-right-style: solid;
    }

    #main {
        position: absolute;
        left: 240px;
        right: 0;
        top: 60px;
        bottom: 0;
        overflow-y: scroll;
    }

    body > .el-container {
        width: 100%;
        position: absolute;
    }

    body {
        margin: 0;
    }


    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>
