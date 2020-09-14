<!--数据源管理-->
<template>
  <div>
    <!--搜索行-->
    <el-row>
      <el-col :span="16">
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" ref="formSearch">
          <el-form-item label="数据源名称" prop="dbName">
            <el-input v-model="formSearch.dbName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="数据源类型" prop="dbType">
            <el-select v-model="formSearch.dbType" placeholder="请选择">
              <el-option
                  v-for="item in dbType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="flushTable(formSearch)" icon="el-icon-search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSearchFormClear()">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <el-button type="primary" @click="handleDrawerOpen(null)" icon="el-icon-plus">新增</el-button>
      </el-col>
    </el-row>
    <!--记录行-->
    <el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"/>
        <el-table-column prop="dbName" label="数据源名称" width="350"/>
        <el-table-column prop="dbTypeStr" label="数据源类型" width="180">
          <template slot-scope="scope">
            <img class="database-icon" v-if="scope.row.dbTypeStr==='MySql'" src="../../assets/mysql.png" height="16"
                 width="16"/>
            <img class="database-icon" v-if="scope.row.dbTypeStr==='Oracle'" src="../../assets/oracle.png" height="16"
                 width="16"/>
            <img class="database-icon" v-if="scope.row.dbTypeStr==='SqlServer'" src="../../assets/sqlserver.png"
                 height="16" width="16"/>
            <span>
              {{ scope.row.dbTypeStr }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="host" label="主机地址" width="300"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column prop="updateTime" label="修改时间"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDrawerOpen(scope.row)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button type="text" size="small" @click="handleRowDelete(scope.row)">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-pagination
            @size-change="onPageSizeChange"
            @current-change="onPageNumChange"
            :page-sizes="pageParam.pageSizes"
            :page-size="pageParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParam.total"
        ></el-pagination>
      </el-row>
    </el-row>
    <!--抽屉页-->
    <el-drawer
        :visible.sync="drawer.visible"
        :direction="drawer.direction"
        :modal="drawer.model"
        ref="drawer"
    >
      <el-container direction="vertical">
        <el-main>
          <el-form
              :model="formAddOrEdit"
              label-width="100px"
              style="margin-right: 20px"
              ref="drawerForm"
          >
            <el-form-item label="数据源名称" prop="dbName">
              <el-input placeholder="请输入数据源名称" v-model="formAddOrEdit.dbName"></el-input>
            </el-form-item>
            <el-form-item label="数据源类型" placeholder="请选择" prop="dbType">
              <el-select v-model="formAddOrEdit.dbType">
                <el-option
                    v-for="item in dbType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <MySqlForm v-if="formAddOrEdit.dbType===1" :ref="dbType[formAddOrEdit.dbType-1].label"></MySqlForm>
            <OracleForm v-if="formAddOrEdit.dbType===2" :ref="dbType[formAddOrEdit.dbType-1].label"></OracleForm>
            <SqlServerFrom v-if="formAddOrEdit.dbType===3" :ref="dbType[formAddOrEdit.dbType-1].label"></SqlServerFrom>
          </el-form>
        </el-main>
        <el-footer style="text-align: right; padding-top: 10px" justify="center">
          <el-row>
            <el-button :loading="loading" @click="checkConnection">测试连通性</el-button>
            <el-button type="primary" @click="handleDrawerAddOrEdit">
              <span v-if="drawer.type==='add'">保存新增</span>
              <span v-if="drawer.type==='edit'">保存编辑</span>
            </el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-drawer>
  </div>
</template>

<script>
import MySqlForm from "@/components/database/form/MySqlForm";
import OracleForm from "@/components/database/form/OracleForm";
import SqlServerFrom from "@/components/database/form/SqlServerFrom";

export default {
  components: {MySqlForm, OracleForm, SqlServerFrom},
  created() {
    this.flushTable(this.formSearch);
  },
  data() {
    return {
      dbType: [
        {
          label: "MySql",
          value: 1,
          icon: "../../assets/mysql.png"
        },
        {
          label: "Oracle",
          value: 2,
        },
        {
          label: "Sql Server",
          value: 3
        }
      ],
      drawer: {
        visible: false,
        direction: "rtl",
        model: true,
        type: "add",
      },
      formSearch: {
        dbName: "",
        dbType: "",
        pageSize: 10,
        pageNum: 0,
      },
      tableData: [],
      pageParam: {
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50],
      },
      formAddOrEdit: {
        dbName: "",
        dbType: 1,
      },
      loading: false,
      disable: false,
    };
  },
  name: "DatabaseManager",
  methods: {
    flushTable(params) {
      this.$dbApi.get("db/listPage", params == null ? {} : params,
          (response) => {
            this.tableData = response.data.data.list;
            this.pageParam.total = response.data.data.total;
          }
      );
    },
    onPageSizeChange(pageSize) {
      this.formSearch.pageSize = pageSize;
      this.flushTable(this.formSearch);
    },
    onPageNumChange(pageNum) {
      this.formSearch.pageNum = pageNum;
      this.flushTable(this.formSearch);
    },
    onSearchFormClear() {
      this.$refs['formSearch'].resetFields();
      this.flushTable(this.formSearch);
    },
    handleDrawerAddOrEdit() {
      if (this.drawer.type === "add") {
        this.$dbApi.post("db/addOne",
            Object.assign(this.$refs[this.dbType[this.formAddOrEdit.dbType - 1].label].form, this.formAddOrEdit),
            (response) => {
              this.$respHandler.handleResponse(response, "新增成功");
              this.$refs.drawer.closeDrawer();
              this.onSearchFormClear();
            });
      } else {
        this.$dbApi.post("db/modify",
            Object.assign(this.$refs[this.dbType[this.formAddOrEdit.dbType - 1].label].form, this.formAddOrEdit),
            (response) => {
              this.$respHandler.handleResponse(response, "编辑成功");
              this.$refs.drawer.closeDrawer();
              this.onSearchFormClear();
            });
      }

    },
    //抽屉打开
    handleDrawerOpen(row) {
      this.drawer.visible = true;
      if (row == null) {
        this.drawer.type = "add";
        this.$refs.drawerForm.resetFields();
        this.$refs[this.dbType[this.formAddOrEdit.dbType - 1].label].restForm();
      } else {
        this.formAddOrEdit.dbType = row.dbType;
        this.drawer.type = "edit";
        this.$dbApi.get(
            "db/find",
            {id: row.id, dbType: row.dbType},
            (response) => {
              this.formAddOrEdit.dbName = response.data.data.dbName;
              this.$refs[this.dbType[row.dbType - 1].label].form = response.data.data;
            }
        );
      }
    },
    handleRowDelete(row) {
      this.$dbApi.post(
          "db/deleteBatch",
          {rows: [{type: row.dbType, id: row.id,}]},
          (response) => {
            this.$respHandler.handleResponse(response);
            this.flushTable(this.formSearch);
          });
    },
    checkConnection() {
      this.loading = true;
      this.$dbApi.post(
          "db/connection/check",
          Object.assign(this.$refs[this.dbType[this.formAddOrEdit.dbType - 1].label].form, this.formAddOrEdit),
          (response) => {
            this.$respHandler.handleResponse(response, 'success');
            this.loading = false;
          }
      );
    },
  },
};
</script>

<style scoped>
</style>
