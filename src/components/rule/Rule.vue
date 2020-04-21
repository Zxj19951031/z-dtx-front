<template>
    <el-container direction="vertical">
        <el-row>
            <el-col :span="16">
                <el-form :inline="true" :model="formSearch" class="demo-form-inline" ref="formSearch">
                    <el-form-item label="规则名称" prop="name">
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
                <el-button type="primary" icon="el-icon-plus" @click="handleDrawerOpen(null)">新增</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="index" label="序号" width="50"/>
                <el-table-column prop="name" label="规则名称" width="300"/>
                <el-table-column prop="expression" label="规则表达式" width="180"/>
                <el-table-column prop="createTime" label="创建时间"/>
                <el-table-column prop="updateTime" label="修改时间"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleDrawerOpen(scope.row)">
                            <i class="el-icon-edit"></i>编辑
                        </el-button>
                        <el-button type="text" size="small" @click="handleRowDelete(scope.row)"><i
                                class="el-icon-delete"></i>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row type="flex" justify="center">
                <el-pagination
                        @size-change="onPageSizeChange"
                        @current-change="onPageNumChange"
                        :page-sizes=pageParam.pageSizes
                        :page-size=pageParam.pageSize
                        layout="total, sizes, prev, pager, next, jumper"
                        :total=pageParam.total>
                </el-pagination>
            </el-row>
        </el-row>
        <el-drawer
                :visible.sync="drawer.visible"
                :direction="drawer.direction"
                :before-close="beforeDrawerClose"
                @closed="handleDrawerClose('drawerForm')"
                :modal="drawer.model"
                ref="drawer"
                size="38%">
            <el-container direction="vertical">
                <el-main>
                    <el-form :model="formAddOrEdit" label-width="140px" style="margin-right: 20px" ref="drawerForm">
                        <el-form-item label="规则名称" prop="name">
                            <el-input placeholder="请输入规则名称" v-model="formAddOrEdit.name"></el-input>
                        </el-form-item>
                        <el-divider><i class="el-icon-timer"></i></el-divider>
                        <el-scrollbar style="height: 470px">
                            <el-form-item label="秒">
                                <el-select v-model="config.sec.type" size="small" style="width:250px"
                                           @change="onExpressionChange">
                                    <el-option v-for="item in config.sec.types"
                                               :key="item.value"
                                               :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-row v-if="config.sec.type===2" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.sec.from"
                                                     size="small"
                                                     :min="0"
                                                     :max="59"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    至
                                    <el-input-number v-model="config.sec.to"
                                                     size="small" :max="59"
                                                     :min="config.sec.from"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    秒执行
                                </el-row>
                                <el-row v-if="config.sec.type===3" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.sec.from"
                                                     size="small"
                                                     :min="0"
                                                     :max="59"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    开始，间隔
                                    <el-input-number v-model="config.sec.gap"
                                                     size="small" :max="59"
                                                     :min="1"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    秒执行
                                </el-row>
                                <el-row v-if="config.sec.type===4">
                                    <el-checkbox-group v-model="config.sec.checkList"
                                                       @change="onExpressionChange">
                                        <el-checkbox key="0" label="0" value="0"></el-checkbox>
                                        <el-checkbox v-for="cnt in 59"
                                                     :key="cnt"
                                                     :label="cnt"
                                                     :value="cnt" style="width: 40px">
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="分钟" prop="min">
                                <el-select v-model="config.min.type" size="small" style="width:250px"
                                           @change="onExpressionChange">
                                    <el-option v-for="item in config.min.types"
                                               :key="item.value"
                                               :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-row v-if="config.min.type===2" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.min.from"
                                                     size="small"
                                                     :min="0"
                                                     :max="59"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    至
                                    <el-input-number v-model="config.min.to"
                                                     size="small" :max="59"
                                                     :min="config.min.from"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    分钟执行
                                </el-row>
                                <el-row v-if="config.min.type===3" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.min.from"
                                                     size="small"
                                                     :min="0"
                                                     :max="59"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    开始，间隔
                                    <el-input-number v-model="config.min.gap"
                                                     size="small" :max="59"
                                                     :min="1"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    分钟执行
                                </el-row>
                                <el-row v-if="config.min.type===4">
                                    <el-checkbox-group v-model="config.min.checkList"
                                                       @change="onExpressionChange">
                                        <el-checkbox key="0" label="0" value="0"></el-checkbox>
                                        <el-checkbox v-for="cnt in 59"
                                                     :key="cnt"
                                                     :label="cnt"
                                                     :value="cnt" style="width: 40px">
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="小时" prop="hour">
                                <el-select v-model="config.hour.type" size="small" style="width:250px"
                                           @change="onExpressionChange">
                                    <el-option v-for="item in config.hour.types"
                                               :key="item.value"
                                               :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-row v-if="config.hour.type===2" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.hour.from"
                                                     size="small"
                                                     :min="0"
                                                     :max="23"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    至
                                    <el-input-number v-model="config.hour.to"
                                                     size="small" :max="23"
                                                     :min="config.hour.from"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    时执行
                                </el-row>
                                <el-row v-if="config.hour.type===3" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.hour.from"
                                                     size="small"
                                                     :max="23"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    时开始，间隔
                                    <el-input-number v-model="config.hour.gap"
                                                     size="small" :max="23"
                                                     :min="1"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    小时执行
                                </el-row>
                                <el-row v-if="config.hour.type===4">
                                    <el-checkbox-group v-model="config.hour.checkList" @change="onExpressionChange">
                                        <el-checkbox key="0" label="0" value="0"></el-checkbox>
                                        <el-checkbox v-for="cnt in 23"
                                                     :key="cnt"
                                                     :label="cnt"
                                                     :value="cnt" style="width: 40px">
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="日" prop="day">
                                <el-select v-model="config.day.type" size="small" style="width:250px"
                                           @change="onExpressionChange">
                                    <el-option v-for="item in config.day.types"
                                               :key="item.value"
                                               :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-row v-if="config.day.type===2" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.day.from"
                                                     size="small"
                                                     :min="1"
                                                     :max="31"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    至
                                    <el-input-number v-model="config.day.to"
                                                     size="small" :max="31"
                                                     :min="config.day.from"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    日执行
                                </el-row>
                                <el-row v-if="config.day.type===3" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.day.from"
                                                     size="small"
                                                     :min="1"
                                                     :max="31"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    日开始，间隔
                                    <el-input-number v-model="config.day.gap"
                                                     size="small" :max="31"
                                                     :min="1"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    日执行
                                </el-row>
                                <el-row v-if="config.day.type===5">
                                    <el-checkbox-group v-model="config.day.checkList" @change="onExpressionChange">
                                        <el-checkbox v-for="cnt in 31"
                                                     :key="cnt"
                                                     :label="cnt"
                                                     :value="cnt" style="width: 40px">
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="月" prop="mon">
                                <el-select v-model="config.mon.type" size="small" style="width:250px"
                                           @change="onExpressionChange">
                                    <el-option v-for="item in config.mon.types"
                                               :key="item.value"
                                               :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-row v-if="config.mon.type===2" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.mon.from"
                                                     size="small"
                                                     :min="1"
                                                     :max="12"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    至
                                    <el-input-number v-model="config.mon.to"
                                                     size="small" :max="12"
                                                     :min="config.mon.from"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    月执行
                                </el-row>
                                <el-row v-if="config.mon.type===3" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.mon.from"
                                                     size="small"
                                                     :max="12"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    月开始，间隔
                                    <el-input-number v-model="config.mon.gap"
                                                     size="small" :max="12"
                                                     :min="1"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    月执行
                                </el-row>
                                <el-row v-if="config.mon.type===4">
                                    <el-checkbox-group v-model="config.mon.checkList" @change="onExpressionChange">
                                        <el-checkbox v-for="cnt in 12"
                                                     :key="cnt"
                                                     :label="cnt"
                                                     :value="cnt" style="width: 40px">
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="周" prop="week">
                                <el-select v-model="config.week.type" size="small" style="width:250px"
                                           @change="onExpressionChange">
                                    <el-option v-for="item in config.week.types"
                                               :key="item.value"
                                               :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-row v-if="config.week.type===2" style="color: #606266">
                                    从周
                                    <el-select v-model="config.week.from" size="small" style="width:100px"
                                               @change="onExpressionChange">
                                        <el-option v-for="item in config.week.weeks"
                                                   :key="item.value"
                                                   :label="item.name"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                    至周
                                    <el-select v-model="config.week.to" size="small" style="width:100px"
                                               @change="onExpressionChange">
                                        <el-option v-for="item in config.week.weeks"
                                                   :key="item.value"
                                                   :label="item.name"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                    执行
                                </el-row>
                                <el-row v-if="config.week.type===3" style="color: #606266">
                                    本月最后一个周
                                    <el-select v-model="config.week.last" size="small" style="width:100px"
                                               @change="onExpressionChange">
                                        <el-option v-for="item in config.week.weeks"
                                                   :key="item.value"
                                                   :label="item.name"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                    执行
                                </el-row>
                                <el-row v-if="config.week.type===4">
                                    <el-checkbox-group v-model="config.week.checkList" @change="onExpressionChange">
                                        <el-checkbox v-for="cnt in config.week.weeks"
                                                     :key="cnt.value"
                                                     :label="cnt.name"
                                                     :value="cnt.value" style="width: 40px">
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="年" prop="year">
                                <el-select v-model="config.year.type" size="small" style="width:250px"
                                           @change="onExpressionChange">
                                    <el-option v-for="item in config.year.types"
                                               :key="item.value"
                                               :label="item.name"
                                               :value="item.value"></el-option>
                                </el-select>
                                <el-row v-if="config.year.type===2" style="color: #606266">
                                    从
                                    <el-input-number v-model="config.year.from"
                                                     size="small"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    年至
                                    <el-input-number v-model="config.year.to"
                                                     size="small"
                                                     controls-position="right"
                                                     @change="onExpressionChange"></el-input-number>
                                    年执行
                                </el-row>
                            </el-form-item>
                        </el-scrollbar>
                        <el-form-item label="规则表达式" prop="expression">
                            <el-input v-model="formAddOrEdit.expression" :readonly=true></el-input>
                        </el-form-item>
                        <el-form-item label="近十次运行时间演示">
                            <el-row type="flex" justify="space-between">
                                <el-col :span="18">
                                    <el-input type="textarea" :rows="2"
                                              :autosize="{ minRows: 4, maxRows: 4}"
                                              v-model="dateTimes"
                                              resize="none" :readonly=true></el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-button @click="handleNextFireQuery">运行</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>

                </el-main>
                <el-footer style="text-align: right; padding-top: 10px" justify="center">
                    <el-row>
                        <el-button type="primary" @click="handleDrawerAddOrEdit">
                            <span v-if="drawer.type==='add'">保存新增</span>
                            <span v-if="drawer.type==='edit'">保存编辑</span>
                        </el-button>
                    </el-row>
                </el-footer>
            </el-container>
        </el-drawer>
    </el-container>
</template>

<script>
    export default {
        name: "Rule",
        created() {
            this.flushTable(this.formSearch);
        },
        data() {
            return {
                formSearch: {
                    name: '',
                    pageSize: 10,
                    pageNum: 0
                },
                tableData: [],
                pageParam: {
                    total: 0,
                    pageSize: 10,
                    pageSizes: [10, 20, 30, 40, 50]
                },
                drawer: {
                    visible: false,
                    direction: 'rtl',
                    model: true,
                    type: 'add'
                },
                formAddOrEdit: {
                    id: '',
                    name: '',
                    expression: '* * * * * ? *',
                    var1: ''
                },
                config: {
                    sec: {
                        value: '*',
                        from: 0,
                        to: 59,
                        gap: 1,
                        checkList: ['0'],
                        type: 1,
                        types: [{
                            name: '每秒执行',
                            value: 1
                        }, {
                            name: '周期从N-M秒执行',
                            value: 2
                        }, {
                            name: '间隔从N秒开始，每M秒执行一次',
                            value: 3
                        }, {
                            name: '指定某几秒执行',
                            value: 4
                        }]
                    },
                    min: {
                        value: '*',
                        from: 0,
                        to: 59,
                        gap: 1,
                        checkList: ['0'],
                        type: 1,
                        types: [{
                            name: '每分钟执行',
                            value: 1
                        }, {
                            name: '周期从N-M分钟执行',
                            value: 2
                        }, {
                            name: '间隔从N开分钟始，每M分钟执行一次',
                            value: 3
                        }, {
                            name: '指定某几分钟执行',
                            value: 4
                        }]
                    },
                    hour: {
                        value: '*',
                        from: 0,
                        to: 23,
                        gap: 1,
                        checkList: ['0'],
                        type: 1,
                        types: [{
                            name: '每小时执行',
                            value: 1
                        }, {
                            name: '周期从N-M小时执行',
                            value: 2
                        }, {
                            name: '间隔从N时开始，每M小时执行一次',
                            value: 3
                        }, {
                            name: '指定某几小时执行',
                            value: 4
                        }]
                    },
                    day: {
                        value: '*',
                        from: 1,
                        to: 31,
                        gap: 1,
                        checkList: [1],
                        type: 1,
                        types: [{
                            name: '每日执行',
                            value: 1
                        }, {
                            name: '周期从N-M日执行',
                            value: 2
                        }, {
                            name: '间隔从N日开始，每M日执行一次',
                            value: 3
                        }, {
                            name: '本月最后一天',
                            value: 4
                        }, {
                            name: '指定某几日执行',
                            value: 5
                        }, {
                            name: '不指定',
                            value: 6
                        }]
                    },
                    mon: {
                        value: '*',
                        from: 1,
                        to: 12,
                        gap: 1,
                        checkList: [1],
                        type: 1,
                        types: [{
                            name: '每月执行',
                            value: 1
                        }, {
                            name: '周期从N-M月执行',
                            value: 2
                        }, {
                            name: '间隔从N月开始，每M个月执行一次',
                            value: 3
                        }, {
                            name: '指定某几月执行',
                            value: 4
                        }]
                    },
                    week: {
                        value: '?',
                        type: 1,
                        from: '1',
                        to: '2',
                        last: '1',
                        checkList: ['1'],
                        weeks: [
                            {
                                name: '日', value: '1'
                            }, {
                                name: '一', value: '2'
                            }, {
                                name: '二', value: '3'
                            }, {
                                name: '三', value: '4'
                            }, {
                                name: '四', value: '5'
                            }, {
                                name: '五', value: '6'
                            }, {
                                name: '六', value: '7'
                            }
                        ],
                        types: [
                            {
                                name: '不指定',
                                value: 1
                            }, {
                                name: '周期从周N-周M执行',
                                value: 2
                            }, {
                                name: '本月最后一个周N',
                                value: 3
                            }, {
                                name: '指定执行',
                                value: 4
                            }
                        ]
                    },
                    year: {
                        value: '*',
                        from: '2000',
                        to: '2020',
                        type: 1,
                        types: [
                            {
                                name: '每年',
                                value: 1
                            }, {
                                name: '周期从N-M年执行',
                                value: 2
                            }
                        ]
                    }
                },
                dateTimes: ''
            }
        },
        methods: {
            flushTable(params) {
                this.$ruleApi.get('rule/listPage', params == null ? {} : params, response => {
                    this.tableData = response.data.data.list;
                    this.pageParam.total = response.data.data.total;
                })
            },
            onPageSizeChange(pageSize) {
                this.formSearch.pageSize = pageSize;
                this.flushTable(this.formSearch)
            },
            onPageNumChange(pageNum) {
                this.formSearch.pageNum = pageNum;
                this.flushTable(this.formSearch)
            },
            onSearchFormClear(ref) {
                this.$refs[ref].resetFields()
                this.flushTable(this.formSearch)
            },
            handleDrawerOpen(row) {
                this.drawer.visible = true;
                if (row == null) {
                    this.drawer.type = 'add';
                } else {
                    this.drawer.type = 'edit'
                    this.$ruleApi.get('rule/find', {id: row.id}, response => {
                        this.formAddOrEdit.id = row.id
                        this.formAddOrEdit.name = response.data.data.name;
                        this.formAddOrEdit.expression = response.data.data.expression;
                        for (let item in this.config) {
                            Object.assign(this.config[item], JSON.parse(response.data.data.var1)[item])
                        }
                    })
                }
            },
            handleRowDelete(row) {
                this.$ruleApi.post('rule/deleteBatch', [row.id], response => {
                    this.$respHandler.handleResponse(response)
                    this.flushTable(this.formSearch)
                })
            },
            beforeDrawerClose(done) {
                done()
            },
            handleDrawerClose(ref) {
                Object.assign(this.config, this.$options.data().config)
                this.dateTimes = ''
                this.onSearchFormClear(ref);
            },
            handleDrawerAddOrEdit() {
                let url = '';
                if (this.drawer.type === 'add') {
                    url = 'rule/add'
                } else {
                    url = 'rule/modify'
                }
                this.$ruleApi.post(url, this.formAddOrEdit, response => {
                    this.$respHandler.handleResponse(response)
                })
                this.$refs.drawer.closeDrawer()
            },
            onExpressionChange() {
                let expression = [];
                if (this.config.sec.type === 1)
                    this.config.sec.value = '*'
                else if (this.config.sec.type === 2)
                    this.config.sec.value = this.config.sec.from + '-' + this.config.sec.to
                else if (this.config.sec.type === 3)
                    this.config.sec.value = this.config.sec.from + '/' + this.config.sec.gap
                else
                    this.config.sec.value = this.config.sec.checkList.join(',');

                if (this.config.min.type === 1)
                    this.config.min.value = '*'
                else if (this.config.min.type === 2)
                    this.config.min.value = this.config.min.from + '-' + this.config.min.to
                else if (this.config.min.type === 3)
                    this.config.min.value = this.config.min.from + '/' + this.config.min.gap
                else
                    this.config.min.value = this.config.min.checkList.join(',');

                if (this.config.hour.type === 1)
                    this.config.hour.value = '*'
                else if (this.config.hour.type === 2)
                    this.config.hour.value = this.config.hour.from + '-' + this.config.hour.to
                else if (this.config.hour.type === 3)
                    this.config.hour.value = this.config.hour.from + '/' + this.config.hour.gap
                else
                    this.config.hour.value = this.config.hour.checkList.join(',');

                if (this.config.day.type === 1)
                    this.config.day.value = '*'
                else if (this.config.day.type === 2)
                    this.config.day.value = this.config.day.from + '-' + this.config.day.to
                else if (this.config.day.type === 3)
                    this.config.day.value = this.config.day.from + '/' + this.config.day.gap
                else if (this.config.day.type === 4)
                    this.config.day.value = 'L'
                else if (this.config.day.type === 5)
                    this.config.day.value = this.config.day.checkList.join(',')
                else
                    this.config.day.value = '?'

                if (this.config.mon.type === 1)
                    this.config.mon.value = '*'
                else if (this.config.mon.type === 2)
                    this.config.mon.value = this.config.mon.from + '-' + this.config.mon.to
                else if (this.config.mon.type === 3)
                    this.config.mon.value = this.config.mon.from + '/' + this.config.mon.gap
                else
                    this.config.mon.value = this.config.mon.checkList.join(',');

                if (this.config.week.type === 1)
                    this.config.week.value = '?'
                else if (this.config.week.type === 2)
                    this.config.week.value = this.config.week.from + '-' + this.config.week.to
                else if (this.config.week.type === 3)
                    this.config.week.value = this.config.week.last + 'L'
                else
                    this.config.week.value = this.config.week.checkList.join(',');

                if (this.config.year.type === 1)
                    this.config.year.value = '*'
                else
                    this.config.year.value = this.config.year.from + '-' + this.config.year.to

                expression.push(this.config.sec.value);
                expression.push(this.config.min.value);
                expression.push(this.config.hour.value);
                expression.push(this.config.day.value);
                expression.push(this.config.mon.value);
                expression.push(this.config.week.value);
                expression.push(this.config.year.value);

                this.formAddOrEdit.expression = expression.join(' ')

                let temp = JSON.parse(JSON.stringify(this.config))

                for (let item in temp) {
                    this.$delete(temp[item], 'types')
                }

                this.formAddOrEdit.var1 = JSON.stringify(temp)

            },
            handleNextFireQuery() {
                this.$ruleApi.get('rule/nextFires', {cron: this.formAddOrEdit.expression}, response => {
                    this.$respHandler.handleResponse(response)
                    if (response.data.code === 200)
                        this.dateTimes = response.data.data.join('\n');
                })
            }
        }
    }
</script>

<style scoped>

</style>