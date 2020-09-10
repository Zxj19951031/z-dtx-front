<!--传输管理页-->
<template>
  <div>
    <!--    搜索行-->
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
    <!--    记录行-->
    <el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"/>
        <el-table-column prop="name" label="传输名称" width="350"/>
        <el-table-column prop="registeredDesc" label="任务状态" width="180"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column prop="updateTime" label="修改时间"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onSetting(scope.row)">
              <i class="el-icon-setting"></i>配置
            </el-button>
            <el-button type="text" size="small" @click="onInstanceClicked(scope.row)">
              <i class="el-icon-tickets"></i>查看实例
            </el-button>
            <el-button
                type="text"
                size="small"
                @click="onRegister(scope.row)"
                v-if="scope.row.registered===0"
            >
              <i class="el-icon-video-play"></i>运行
            </el-button>
            <el-button
                type="text"
                size="small"
                @click="onCancel(scope.row)"
                v-if="scope.row.registered===1"
            >
              <i class="el-icon-video-pause"></i>停止
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
    <!--  实例信息  -->
    <el-dialog title="任务实例" :visible.sync="dialogVisible" width="70%">
      <el-table :data="instanceTableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"/>
        <el-table-column prop="startTime" label="开始时间" width="200"/>
        <el-table-column prop="endTime" label="结束时间" width="200"/>
        <el-table-column prop="readCnt" label="读取记录数(条)"/>
        <el-table-column prop="writeCnt" label="写入记录数(条)"/>
        <el-table-column prop="errorCnt" label="异常记录数(条)"/>
        <el-table-column prop="statusDesc" label="状态"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onLogClick(scope.row)">
              <i class="el-icon-setting"></i>查看日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-pagination
            @size-change="onInstancePageSizeChange"
            @current-change="onInstancePageNumChange"
            :page-sizes="instancePageParam.pageSizes"
            :page-size="instancePageParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="instancePageParam.total"
        ></el-pagination>
      </el-row>
    </el-dialog>
    <el-dialog title="实例日志" :visible.sync="logDialogVisible" width="80%" >
      <div class="infinite-list-wrapper" style="overflow:auto;height: 500px">
        <ul class="list"
            v-infinite-scroll="onWrapperScroll"
            :infinite-scroll-disabled="this.listWrapper.disable">
          <li v-for="i in this.instanceLog" :key="i.label" class="list-item">
            <pre>{{ i }}</pre>
          </li>
        </ul>
        <p v-if="this.listWrapper.disable">没有更多了</p>
      </div>
    </el-dialog>
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
      tableData: [],
      pageParam: {
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50],
      },
      dialogVisible: false,
      logDialogVisible: false,
      instanceFormSearch: {
        pageSize: 5,
        pageNum: 1,
      },
      instanceTableData: [],
      instancePageParam: {
        total: 0,
        pageSize: 5,
        pageSizes: [5, 20, 30, 40, 50],
      },
      instanceLog: [],
      listWrapper: {
        instanceId: 0,
        pageNum: 1,
        pageSize: 20,
        disable: false
      }
    };
  },
  created() {
    this.flushTable(this.formSearch);
  },
  methods: {
    flushTable(params) {
      this.$dbApi.get(
          "transport/page/list",
          params == null ? {} : params,
          (response) => {
            this.tableData = response.data.data.list;
            this.pageParam.total = response.data.data.total;
          }
      );
    },
    flushInstanceTable(params) {
      this.$dbApi.get(
          "transport/instance/page/list",
          params == null ? {} : params,
          (response) => {
            this.instanceTableData = response.data.data.list;
            this.instancePageParam.total = response.data.data.total;
          }
      );
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
      this.$router.push({
        name: "AddOrEditTransport",
        query: {id: row.id},
      });
    },
    onRegister(row) {
      this.$dbApi.get("transport/register", {id: row.id}, (response) => {
        this.$respHandler.handleResponse(response);
        this.flushTable(this.formSearch);
      });
    },
    onCancel(row) {
      this.$dbApi.get("transport/cancel", {id: row.id}, (response) => {
        this.$respHandler.handleResponse(response);
        this.flushTable(this.formSearch);
      });
    },
    onInstanceClicked(row) {
      this.dialogVisible = true;
      this.instanceFormSearch.id = row.id;
      this.flushInstanceTable(this.instanceFormSearch)
    },
    onInstancePageSizeChange(pageSize) {
      this.instanceFormSearch.pageSize = pageSize;
      this.flushInstanceTable(this.instanceFormSearch);
    },
    onInstancePageNumChange(pageNum) {
      this.instanceFormSearch.pageNum = pageNum;
      this.flushInstanceTable(this.instanceFormSearch);
    },
    onLogClick(row) {
      this.logDialogVisible = true;
      this.listWrapper.instanceId = row.id;
      this.instanceLog = []
      this.listWrapper.pageNum = 1
      this.listWrapper.disable = false
      this.$dbApi.get(
          "transport/instance/log",
          {instanceId: row.id},
          (response) => {
            if (response.data.data.length === 0) {
              this.listWrapper.disable = true;
            } else {
              for (let log of response.data.data) {
                this.instanceLog.push(log)
              }
              this.listWrapper.disable = false;
            }
          });
    },
    onWrapperScroll() {
      this.$dbApi.get(
          "transport/instance/log",
          this.listWrapper,
          (response) => {
            if (response.data.data.length === 0) {
              this.listWrapper.disable = true;
            } else {
              this.listWrapper.pageNum++;
              for (let log of response.data.data) {
                this.instanceLog.push(log)
              }
              this.listWrapper.disable = false;
            }
          });
    }
  },
};
</script>

<style scoped>
</style>
