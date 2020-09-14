<template>
  <div>
    <el-form :model="form" label-width="100px" ref="form" style="margin-right: 20px">
      <el-form-item label="主机地址" prop="host">
        <el-input placeholder="请输入主机地址，例如127.0.0.1" v-model="form.host"></el-input>
      </el-form-item>
      <el-form-item label="端口号" prop="port">
        <el-input type="number" v-model="form.port"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="user">
        <el-input placeholder="请出入用户名，例如root" v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input show-password v-model="form.password" placeholder="请出入密码"
                  autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="数据库" prop="database">
        <el-input placeholder="请出入Database" v-model="form.database"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SqlServerFrom",
  data() {
    return {
      form: {
        host: '',
        port: 1433,
        user: '',
        password: '',
        database: ''
      }
    }
  },
  methods: {
    restForm() {
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style scoped>

</style>
