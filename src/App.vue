<template>
    <el-container>
        <el-header>
            <Header></Header>
        </el-header>
        <el-container>
            <el-aside width="240px">
                <Nav></Nav>
            </el-aside>
            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
                <el-footer>
                    <Footer></Footer>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Header from "@/components/Header";
    import Nav from "@/components/Nav";
    import Footer from "@/components/Footer";

    export default {
        name: 'App',
        components: {
            Header, Nav, Footer
        }
    }
</script>

<style>
    .el-header{
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
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
        border-right-width: 1px;
        border-right-color: #dedfe2;
        border-right-style: solid;
    }

    body > .el-container {
        height: 100%;
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
