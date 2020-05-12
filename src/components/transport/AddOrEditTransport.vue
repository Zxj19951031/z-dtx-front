<template>
    <div>
        <el-form v-model="formAddOrEdit" label-width="100px" label-position="left" pre="formAddOrEdit">
            <el-timeline style="padding-inline-start:0">
                <el-timeline-item>
                    <el-divider content-position="left">基本信息</el-divider>
                    <el-form-item label="传输名称" prop="name">
                        <el-input type="text" placeholder="请输入" v-model="formAddOrEdit.name"></el-input>
                    </el-form-item>
                </el-timeline-item>
                <el-timeline-item>
                    <el-divider content-position="left">源头表</el-divider>
                    <el-form-item label="数据源">
                        <el-select v-model="formAddOrEdit.source_db" placeholder="请选择数据源"
                                   @change="onSourceSelectChange" clearable>
                            <el-option v-for="(item,index) in dbList"
                                       :key="index"
                                       :label="item.dbName"
                                       :value="item.dbType+'-'+item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <MySqlRead v-if="formAddOrEdit.source_db.split('-')[0]==='1'"></MySqlRead>
                </el-timeline-item>
                <el-timeline-item>
                    <el-divider content-position="left">目标表</el-divider>
                    <el-form-item label="数据源">
                        <el-select v-model="formAddOrEdit.target_db" placeholder="请选择数据源"
                                   @change="onTargetSelectChange" clearable>
                            <el-option v-for="(item,index) in dbList"
                                       :key="index"
                                       :label="item.dbName"
                                       :value="item.dbType+'-'+item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <MySqlWrite v-if="formAddOrEdit.target_db.split('-')[0]==='1'"></MySqlWrite>
                </el-timeline-item>
                <el-timeline-item>
                    <el-divider content-position="left">列映射</el-divider>
                    <el-row>
                        <el-col :span="10">
                            <el-table :data="formAddOrEdit.source_col" id="source_col_tb"
                                      style="text-align: center">
                                <el-table-column prop="name" label="字段名称"/>
                                <el-table-column prop="type" label="字段类型"/>
                            </el-table>
                        </el-col>
                        <el-col :span="4">
                            连线
                        </el-col>
                        <el-col :span="10">
                            <el-table :data="formAddOrEdit.target_col" id="target_col_tb">
                                <el-table-column prop="name" label="字段名称"/>
                                <el-table-column prop="type" label="字段类型"/>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-timeline-item>
                <el-timeline-item>
                    <el-divider content-position="left">调度规则</el-divider>
                </el-timeline-item>
                <el-timeline-item>
                    <el-divider content-position="left">完成</el-divider>
                </el-timeline-item>
            </el-timeline>
        </el-form>
    </div>
</template>

<script>
    import MySqlRead from "@/components/transport/form/MySqlRead";
    import MySqlWrite from "@/components/transport/form/MySqlWrite";
    import Sortable from "sortablejs";
    import jsplumb from "jsplumb"

    export default {
        name: "AddOrEditTransport",
        components: {MySqlWrite, MySqlRead},
        created() {
            this.$dbApi.get('db/listPage', {pageNum: -1}, response => {
                this.dbList = response.data.data.list
            })
        },
        data() {
            return {
                dbList: [],
                formAddOrEdit: {
                    name: '',
                    source_db: '',
                    target_db: '',
                    source_col: [{
                        name: '1',
                        type: 'int'
                    }, {
                        name: '2',
                        type: 'int'
                    }, {
                        name: '3',
                        type: 'int'
                    }, {
                        name: '4',
                        type: 'int'
                    }, {
                        name: '5',
                        type: 'int'
                    }],
                    target_col: [{
                        name: '1',
                        type: 'int'
                    }, {
                        name: '2',
                        type: 'int'
                    }, {
                        name: '3',
                        type: 'int'
                    }, {
                        name: '4',
                        type: 'int'
                    }, {
                        name: '5',
                        type: 'int'
                    }]
                }
            }
        },
        mounted() {
            this.sourceRowDrag();
            this.targetRowDrag();
            this.initJsplumb();
        },
        methods: {
            onSourceSelectChange() {
            },
            onTargetSelectChange() {
            },
            sourceRowDrag() {
                const tbody = document.querySelector('#source_col_tb tbody')
                const _this = this
                Sortable.create(tbody, {
                    onEnd({newIndex, oldIndex}) {
                        const temp = _this.formAddOrEdit.source_col[newIndex];
                        _this.formAddOrEdit.source_col[newIndex] = _this.formAddOrEdit.source_col[oldIndex]
                        _this.formAddOrEdit.source_col[oldIndex] = temp;
                    }
                })
            },
            targetRowDrag() {
                const tbody = document.querySelector('#target_col_tb tbody')
                const _this = this
                Sortable.create(tbody, {
                    onEnd({newIndex, oldIndex}) {
                        const temp = _this.formAddOrEdit.target_col[newIndex];
                        _this.formAddOrEdit.target_col[newIndex] = _this.formAddOrEdit.target_col[oldIndex]
                        _this.formAddOrEdit.target_col[oldIndex] = temp;
                    }
                })
            },
            initJsplumb() {
                const jsplb = jsplumb.jsPlumb;
                jsplb.ready(() => {

                })
            }
        }
    }
</script>

<style scoped>

</style>
