<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" ref="formSearch">
          <el-form-item label="传输名称" prop="name">
            <el-input v-model="formSearch.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="flushTable(formSearch)">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSearchFormClear('formSearch')">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <el-button type="primary" icon="el-icon-plus" @click="onAdding">新增</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="传输名称" width="300" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onSetting(scope.row)">
              <i class="el-icon-setting"></i>配置
            </el-button>
            <el-button type="text" size="small">
              <i class="el-icon-tickets"></i>查看实例
            </el-button>
            <el-button type="text" size="small">
              <i class="el-icon-video-play"></i>运行
            </el-button>
            <el-button type="text" size="small">
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
  </div>
</template>

<script>
export default {
  name: "Transport",
  data() {
    return {
      formSearch: {
        name: "",
        pageSize: 10,
        pageNum: 0,
      },
      tableData: [
        {
          name: "MySql至MySql传输",
          createTime: "2020-04-22 00:00:00",
          updateTime: "2020-04-22 00:00:00",
        },
      ],
      pageParam: {
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50],
      },
    };
  },
  created() {
    console.log("111");
  },
  methods: {
    flushTable(params) {
      console.log(params);
    },
    onSearchFormClear(ref) {
      this.$refs[ref].resetFields();
      this.flushTable(this.formSearch);
    },
    onPageSizeChange(pageSize) {
      this.formSearch.pageSize = pageSize;
      this.flushTable(this.formSearch);
    },
    onPageNumChange(pageNum) {
      this.formSearch.pageNum = pageNum;
      this.flushTable(this.formSearch);
    },
    onAdding() {
      this.$router.push("/components/transport/AddOrEditTransport");
    },
    onSetting(row) {
      console.log(row);
      this.$router.push("/components/transport/AddOrEditTransport");
    },
  },
};
</script>

<style scoped>
</style>
