<template>
  <div>
    <el-form :model="form" label-width="100px" ref="form" style="margin-right: 20px">
      <el-form-item label="主机地址" prop="host" v-if="form.connType!=='TNS'">
        <el-input placeholder="请输入主机地址，例如127.0.0.1" v-model="form.host"></el-input>
      </el-form-item>
      <el-form-item label="端口号" prop="port" v-if="form.connType!=='TNS'">
        <el-input type="number" v-model="form.port"></el-input>
      </el-form-item>
      <el-form-item label="连接类型" placeholder="请选择" prop="connType">
        <el-select v-model="form.connType">
          <el-option
              v-for="item of connTypes"
              :key="item"
              :label="item"
              :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="form.connType" prop="connValue">
        <el-input placeholder="请输入类型值" v-model="form.connValue"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="user">
        <el-input placeholder="输输入用户名" v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input show-password v-model="form.password" placeholder="请输入密码"
                  autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="驱动类型" placeholder="请选择" prop="driver">
        <el-select v-model="form.driver">
          <el-option
              v-for="item of drivers"
              :key="item"
              :label="item"
              :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "OracleForm",
  data() {
    return {
      connTypes: ['SID', 'TNS', 'SERVICE NAME'],
      drivers: ['Thin', 'OCI', 'OCI8'],
      form: {
        host: '',
        port: 1521,
        user: '',
        password: '',
        connType: 'SID',
        connValue: '',
        driver: 'Thin'
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
