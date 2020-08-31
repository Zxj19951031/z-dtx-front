<template>
  <el-form v-model="reader" label-width="160px">
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
    <el-form-item>
      <el-switch
        v-model="formData.ifQuery"
        active-color="#13ce66"
        inactive-color="#13ce66"
        active-text="自定义"
        inactive-text="选择表"
      ></el-switch>
    </el-form-item>
    <el-form-item label="选择表" v-if="!formData.ifQuery">
      <el-select
        v-model="reader.parameter.table"
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
    <el-form-item label="条件设置" v-if="!formData.ifQuery">
      <el-input v-model="reader.parameter.where" placeholder="请输入Where内容，例如id=1"></el-input>
    </el-form-item>
    <el-form-item label="查询设置" v-if="formData.ifQuery">
      <el-input v-model="reader.parameter.querySql" placeholder="请输入Select内容"></el-input>
    </el-form-item>
    <el-form-item label="预处理">
      <el-input v-model="reader.parameter.preSql" placeholder="请输入预处理Sql"></el-input>
    </el-form-item>
    <el-form-item label="结束处理">
      <el-input v-model="reader.parameter.postSql" placeholder="请输入结束处理Sql"></el-input>
    </el-form-item>
    <el-form-item label="切分主键">
      <el-input v-model="reader.parameter.primaryKey" placeholder="请输入切分主键字段" style="width:300px"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="查询超时时间(秒）">
          <el-input-number v-model="reader.parameter.queryTimeout" size="mini"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登录超时时间(秒）">
          <el-input-number v-model="reader.parameter.loginTimeout" size="mini"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "MySqlRead",
  data() {
    return {
      //下拉框内容
      selectData: {
        catalog: [],
        table: [],
      },
      formData: {
        source_id: "",
        schema: "",
        ifQuery: false, //是否自定义查询sql
      },
      reader: {
        name: "mysqlreader",
        parameter: {
          jdbcUrl: "",
          username: "",
          password: "",
          table: "",
          columns: [],
          querySql: "",
          queryTimeout: 60,
          loginTimeout: 120,
          where: "",
          primaryKey: "",
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
          ["db", 1, this.formData.source_id, "table", "get"].join("/"),
          { catalog: item },
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
          ["db", 1, this.formData.source_id, "column", "get"].join("/"),
          {
            catalog: this.formData.schema,
            table: this.reader.parameter.table,
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
