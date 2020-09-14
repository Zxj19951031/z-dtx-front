<template>
  <el-container>
    <el-row>
      <el-menu
          :default-active="this.$route.path"
          router
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">
        <el-menu-item class="menuItem" v-for="(item,index) in navList" :key="index" :index="item.name"
                      style="padding-left: 10px">
          <template slot="title">
            <i :class="item.icon"></i>
            <span> {{ item.navItem }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-row>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {name: '/components/database/DatabaseManager', navItem: '数据源管理', icon: 'el-icon-coin'},
        {name: '/components/rule/Rule', navItem: '规 则 管 理', icon: 'el-icon-timer'},
        {name: '/components/data/Transport', navItem: '传 输 管 理', icon: 'el-icon-cpu'},
        {name: '/components/Test', navItem: '数 据 转 换（待开发）', icon: 'el-icon-refresh'},
        {name: '/components/data/Clean', navItem: '数 据 清 洗（待开发）', icon: 'el-icon-help'},
      ]
    }
  },
  name: "Nav",
  methods:
      {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        }
        ,
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        }
      }
}
</script>

<style>
.el-container {
  height: 100%;
}


.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  height: 100%;
}
</style>
