<template>
  <div>
    <el-form v-model="job" label-width="100px" label-position="left" pre="job">
      <el-timeline style="padding-inline-start:0">
        <el-timeline-item>
          <el-divider content-position="left">基本信息</el-divider>
          <el-form-item label="传输名称" prop="name">
            <el-input type="text" placeholder="请输入" v-model="formData.name"></el-input>
          </el-form-item>
        </el-timeline-item>
        <el-timeline-item>
          <el-divider content-position="left">源头表</el-divider>
          <el-form-item label="数据源">
            <el-select
              v-model="formData.sourceDb"
              placeholder="请选择数据源"
              @change="onSourceSelectChange"
              ref="source"
              class="transport_edit_select"
            >
              <el-option
                v-for="(item,index) in dbList"
                :key="index"
                :label="item.dbName"
                :value="item.dbType+'-'+item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <MySqlRead
            v-if="formData.sourceDb.split('-')[0]==='1'"
            ref="sourceDetail"
            @receiveChildren="receiveSourceCol"
          ></MySqlRead>
        </el-timeline-item>
        <el-timeline-item>
          <el-divider content-position="left">目标表</el-divider>
          <el-form-item label="数据源">
            <el-select
              v-model="formData.targetDb"
              placeholder="请选择数据源"
              @change="onTargetSelectChange"
              class="transport_edit_select"
            >
              <el-option
                v-for="(item,index) in dbList"
                :key="index"
                :label="item.dbName"
                :value="item.dbType+'-'+item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <MySqlWrite
            v-if="formData.targetDb.split('-')[0]==='1'"
            ref="targetDetail"
            @receiveChildren="receiveTargetCol"
          ></MySqlWrite>
        </el-timeline-item>
        <el-timeline-item>
          <el-divider content-position="left">列映射</el-divider>
          <el-row>
            <el-col :span="10">
              <el-table
                :data="formData.source_col"
                id="source_col_tb"
                :header-cell-style="()=>{return 'text-align: center'}"
                :cell-style=" ()=>{return 'text-align: center'}"
              >
                <el-table-column prop="name" label="字段名称" />
                <el-table-column prop="type" label="字段类型" />
              </el-table>
            </el-col>
            <el-col :span="4">
              <el-table
                :data="formData.line"
                :cell-style="()=>{return 'text-align: center'}"
                @cell-click="onProgressCellClick"
                empty-text=" "
              >
                <el-table-column>
                  <template slot-scope="scope">
                    <el-progress :percentage="scope.row.value" :show-text="false"></el-progress>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="10">
              <el-table
                :data="formData.target_col"
                id="target_col_tb"
                :cell-style="()=>{return 'text-align: center'}"
                :header-cell-style="()=>{return 'text-align: center'}"
              >
                <el-table-column prop="name" label="字段名称" style="height: 60px" />
                <el-table-column prop="type" label="字段类型" />
              </el-table>
            </el-col>
          </el-row>
        </el-timeline-item>
        <el-timeline-item>
          <el-divider content-position="left">调度规则</el-divider>
          <el-form-item label="调度器">
            <el-select
              v-model="formData.rule_id"
              placeholder="请选择调度规则"
              class="transport_edit_select"
            >
              <el-option
                v-for="(item,index) in ruleList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-timeline-item>
        <el-timeline-item>
          <el-divider content-position="left">完 成</el-divider>
          <el-row style="text-align: right;">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onSave">
              <span>保存新增</span>
              <span>保存编辑</span>
            </el-button>
          </el-row>
        </el-timeline-item>
      </el-timeline>
    </el-form>
  </div>
</template>

<script>
import MySqlRead from "@/components/transport/form/MySqlRead";
import MySqlWrite from "@/components/transport/form/MySqlWrite";
import Sortable from "sortablejs";

export default {
  name: "AddOrEditTransport",
  components: { MySqlWrite, MySqlRead },
  created() {
    this.$dbApi.get("db/listPage", { pageNum: -1 }, (response) => {
      this.dbList = response.data.data.list;
    });
    this.$ruleApi.get("rule/listPage", { pageNum: -1 }, (response) => {
      for (let rule of response.data.data.list) {
        this.ruleList.push(rule);
      }
    });
  },
  data() {
    return {
      //数据源下拉框内容
      dbList: [],
      //规则下拉框内容
      ruleList: [
        {
          name: "单次运行",
          id: -1,
        },
      ],
      formData: {
        name: "",
        sourceDb: "",
        targetDb: "",
        source_col: [],
        target_col: [],
        line: [],
        rule_id: "",
        reader: {},
        writer: {},
      },
      job: {
        content: {
          reader: {},
          writer: {},
        },
        setting: {
          speed: {
            channel: 1,
          },
          report: {
            interval: 5000,
          },
        },
        tunnel: {
          bufferSize: 1024,
          byteCapacity: 8388608,
        },
      },
    };
  },
  mounted() {
    this.sourceRowDrag();
    this.targetRowDrag();
  },
  methods: {
    onSourceSelectChange(item) {
      if (item !== "") {
        const type = item.split("-")[0];
        const id = item.split("-")[1];
        this.$dbApi.post(
          ["db", type, id, "catalog", "get"].join("/"),
          {},
          (response) => {
            if (response.data.code === 200) {
              this.$refs["sourceDetail"].formData.source_id = id;
              this.$refs["sourceDetail"].selectData.catalog =
                response.data.data;
            } else {
              this.$respHandler.handleResponse(response);
            }
          }
        );
      }
    },
    onTargetSelectChange(item) {
      if (item !== "") {
        const type = item.split("-")[0];
        const id = item.split("-")[1];
        this.$dbApi.post(
          ["db", type, id, "catalog", "get"].join("/"),
          {},
          (response) => {
            if (response.data.code === 200) {
              this.$refs["targetDetail"].formData.target_id = id;
              this.$refs["targetDetail"].selectData.catalog =
                response.data.data;
            } else {
              this.$respHandler.handleResponse(response);
            }
          }
        );
      }
    },
    sourceRowDrag() {
      const tbody = document.querySelector("#source_col_tb tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const temp = _this.formData.source_col[newIndex];
          _this.formData.source_col[newIndex] =
            _this.formData.source_col[oldIndex];
          _this.formData.source_col[oldIndex] = temp;
        },
      });
    },
    targetRowDrag() {
      const tbody = document.querySelector("#target_col_tb tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const temp = _this.formData.target_col[newIndex];
          _this.formData.target_col[newIndex] =
            _this.formData.target_col[oldIndex];
          _this.formData.target_col[oldIndex] = temp;
        },
      });
    },
    receiveSourceCol(data) {
      let cols = [];
      for (let col of data) {
        let t = {
          name: col.match(/^(\w+)\[(\w+)]/)[1],
          type: col.match(/^(\w+)\[(\w+)]/)[2],
        };
        cols.push(t);
      }
      this.formData.source_col = cols;
      this.connectCol();
    },
    receiveTargetCol(data) {
      let cols = [];
      for (let col of data) {
        let t = {
          name: col.match(/^(\w+)\[(\w+)]/)[1],
          type: col.match(/^(\w+)\[(\w+)]/)[2],
        };
        cols.push(t);
      }
      this.formData.target_col = cols;
      this.connectCol();
    },
    connectCol() {
      this.formData.line = [];
      let minLineCount = Math.min(
        this.formData.source_col.length,
        this.formData.target_col.length
      );
      for (let index = 0; index < minLineCount; index++) {
        this.formData.line.push({ value: 100 });
      }
    },
    onProgressCellClick(item) {
      item.value = Math.abs(item.value - 100);
    },
    onSave() {
      this.job.content.reader = Object.assign(
        this.$refs["sourceDetail"].reader,
        this.job.content.reader
      );
      this.job.content.writer = Object.assign(
        this.$refs["targetDetail"].writer,
        this.job.content.writer
      );
      console.log(JSON.stringify(this.job));
    },
    onCancel() {
      this.$router.push("/components/data/Transport");
    },
  },
};
</script>

<style>
</style>
