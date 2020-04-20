<template>
    <el-container direction="vertical">
        <el-row>
            <el-col :span="16">
                <el-form :inline="true" :model="formSearch" class="demo-form-inline" ref="formSearch">
                    <el-form-item label="规则名称" prop="rName">
                        <el-input v-model="formSearch.dbName" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button>清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8" style="text-align: right">
                <el-button type="primary" icon="el-icon-plus">新增</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="index" label="序号" width="50"/>
                <el-table-column prop="rName" label="规则名称" width="300"/>
                <el-table-column prop="rExpression" label="规则表达式" width="180"/>
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
                    rName: ''
                },
                tableData: {},
                pageParam: {
                    total: 0,
                    pageSize: 10,
                    pageSizes: [10, 20, 30, 40, 50]
                }
            }
        },
        methods: {
            flushTable(params) {
                console.log(params)
            },
            onPageSizeChange() {

            },
            onPageNumChange() {

            },
            handleDrawerOpen(row) {
                console.log(row)
            },
            handleRowDelete(row) {
                console.log(row)
            }
        }
    }
</script>

<style scoped>

</style>