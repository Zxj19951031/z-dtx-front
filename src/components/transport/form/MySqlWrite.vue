<template>
  <el-form v-model="formData" label-width="160px">
    <el-form-item label="选择库">
      <el-select
          v-model="formData.schema"
          placeholder="请选择（Schema）"
          @change="onSchemaChange"
          class="transport_edit_select"
      >
        <el-option
            v-for="(item,index) in selectData.catalog"
            :key="index"
            :label="item"
            :value="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择表">
      <el-select
          v-model="writer.parameter.table"
          placeholder="请选择（Table）"
          @change="onTableChange"
          class="transport_edit_select"
      >
        <el-option
            v-for="(item,index) in selectData.table"
            :key="index"
            :label="item.split('.')[1]"
            :value="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择写入方式">
      <el-radio-group v-model="writer.parameter.method">
        <el-radio label="insert">Insert</el-radio>
        <el-radio label="update">Update</el-radio>
        <el-radio label="replace">Replace</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="预处理">
      <el-input v-model="writer.parameter.preSql" placeholder="请输入Sql"></el-input>
    </el-form-item>
    <el-form-item label="结束处理">
      <el-input v-model="writer.parameter.postSql" placeholder="请输入Sql"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="查询超时时间(秒）">
          <el-input-number v-model="writer.parameter.queryTimeout" size="mini"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登录超时时间(秒）">
          <el-input-number v-model="writer.parameter.loginTimeout" size="mini"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="最大缓冲记录数(条）">
          <el-input-number v-model="writer.parameter.bufferSize" size="mini"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "MySqlWrite",
  data() {
    return {
      selectData: {
        catalog: [],
        table: [],
      },
      formData: {
        target_id: "",
        schema: "",
      },
      writer: {
        name: "mysqlwriter",
        parameter: {
          jdbcUrl: "",
          username: "",
          password: "",
          table: "",
          method: "insert",
          columns: [],
          loginTimeout: 120,
          bufferSize: 1000,
          queryTimeout: 60,
          preSql: "",
          postSql: "",
        },
      },
    };
  },
  methods: {
    onSchemaChange(item) {
      if (item !== "") {
        this.$dbApi.post(
            ["db", 1, this.formData.target_id, "table", "get"].join("/"),
            {catalog: item},
            (response) => {
              if (response.data.code === 200) {
                this.selectData.table = [];
                for (let tb of response.data.data) {
                  this.selectData.table.push(this.formData.schema + "." + tb);
                }
              } else {
                this.$respHandler.handleResponse(response);
              }
            }
        );
      }
    },
    onTableChange(item) {
      if (item !== "") {
        this.$dbApi.post(
            ["db", 1, this.formData.target_id, "column", "get"].join("/"),
            {
              catalog: this.formData.schema,
              table: this.writer.parameter.table,
            },
            (response) => {
              if (response.data.code === 200) {
                this.$emit("receiveChildren", response.data.data);
              } else {
                this.$respHandler.handleResponse(response);
              }
            }
        );
      }
    },
  },
};
</script>

<style scoped>
</style>
