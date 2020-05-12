<template>
    <div>
        <el-row>
            <el-col :span="16">
                <el-form :inline="true" :model="formSearch" class="demo-form-inline" ref="formSearch">
                    <el-form-item label="数据源名称" prop="dbName">
                        <el-input v-model="formSearch.dbName" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="数据源类型" prop="dbType">
                        <el-select v-model="formSearch.dbType" placeholder="请选择">
                            <el-option v-for="item in dbType"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="flushTable(formSearch)" icon="el-icon-search">查询
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="onSearchFormClear('formSearch')">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8" style="text-align: right">
                <el-button type="primary" @click="handleDrawerOpen(null)" icon="el-icon-plus">新增</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="index" label="序号" width="50"/>
                <el-table-column prop="dbName" label="数据源名称" width="300"/>
                <el-table-column prop="dbTypeStr" label="数据源类型" width="180"/>
                <el-table-column prop="host" label="主机地址"/>
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
                :modal="drawer.model" ref="drawer">
            <el-container direction="vertical">
                <el-main>
                    <el-form :model="formAddOrEdit" label-width="100px" style="margin-right: 20px" ref="drawerForm">
                        <el-form-item label="数据源名称" prop="dbName">
                            <el-input placeholder="请输入数据源名称" v-model="formAddOrEdit.dbName"></el-input>
                        </el-form-item>
                        <el-form-item label="数据源类型" placeholder="请选择" prop="dbType">
                            <el-select v-model="formAddOrEdit.dbType">
                                <el-option v-for="item in dbType"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <MySqlForm v-if="formAddOrEdit.dbType===1"
                                   :ref="dbType[formAddOrEdit.dbType-1].label"></MySqlForm>
                    </el-form>
                </el-main>
                <el-footer style="text-align: right; padding-top: 10px" justify="center">
                    <el-row>
                        <el-button :loading="loading" @click="checkConnection">测试连通性
                        </el-button>
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
    import MySqlForm from "@/components/database/form/MySqlForm"

    export default {
        components: {MySqlForm},
        created() {
            this.flushTable(this.formSearch);
        },
        data() {
            return {
                dbType: [{
                    label: 'MySql',
                    value: 1
                }, {
                    label: 'Oracle',
                    value: 2
                }],
                drawer: {
                    visible: false,
                    direction: 'rtl',
                    model: true,
                    type: 'add'
                },
                formSearch: {
                    dbName: '',
                    dbType: '',
                    pageSize: 10,
                    pageNum: 0
                },
                tableData: [],
                pageParam: {
                    total: 0,
                    pageSize: 10,
                    pageSizes: [10, 20, 30, 40, 50]
                },
                formAddOrEdit: {
                    dbName: '',
                    dbType: 1
                },
                loading: false,
                disable: false
            }
        },
        name: "DatabaseManager",
        methods: {
            flushTable(params) {
                this.$dbApi.get('db/listPage', params == null ? {} : params, response => {
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
            beforeDrawerClose(done) {
                done()
            },
            handleDrawerAddOrEdit() {
                this.formAddOrEdit = Object.assign(this.$refs[this.dbType[this.formAddOrEdit.dbType - 1].label].form, this.formAddOrEdit);
                let url = '';
                if (this.drawer.type === 'add') {
                    url = 'db/addOne'
                } else {
                    url = 'db/modify'
                }
                this.$dbApi.post(url, this.formAddOrEdit, response => {
                    this.$respHandler.handleResponse(response)
                    this.$refs.drawer.closeDrawer()
                })
            },
            handleDrawerClose(ref) {
                this.$refs[this.dbType[this.formAddOrEdit.dbType - 1].label].restForm();
                this.onSearchFormClear(ref);
            },
            handleDrawerOpen(row) {
                this.drawer.visible = true;
                if (row == null) {
                    this.drawer.type = 'add';
                } else {
                    this.drawer.type = 'edit'
                    this.$dbApi.get('db/find', {id: row.id, dbType: row.dbType}, response => {
                        this.formAddOrEdit.dbName = response.data.data.dbName;
                        this.formAddOrEdit.dbType = row.dbType;
                        this.$refs[this.dbType[this.formAddOrEdit.dbType - 1].label].form = response.data.data
                    })
                }
            },
            handleRowDelete(row) {
                let params = {
                    rows: [{
                        type: row.dbType,
                        id: row.id
                    }]
                }
                this.$dbApi.post('db/deleteBatch', params, response => {
                    this.$respHandler.handleResponse(response)
                    this.flushTable(this.formSearch)
                })
            },
            checkConnection() {
                this.formAddOrEdit = Object.assign(this.$refs[this.dbType[this.formAddOrEdit.dbType - 1].label].form, this.formAddOrEdit);
                this.loading = true;
                this.$dbApi.post('db/connection/check', this.formAddOrEdit, response => {
                    this.$respHandler.handleResponse(response)
                    this.loading = false;
                })
            }
        }
    }
</script>

<style scoped>

</style>
