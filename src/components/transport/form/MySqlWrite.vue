<template>
    <el-form v-model="formData" label-width="100px">
        <el-form-item label="选择库">
            <el-select v-model="formData.schema" placeholder="请选择（Schema）" @change="onSchemaChange"
                       class="transport_edit_select">
                <el-option v-for="(item,index) in selectData.catalog"
                           :key="index"
                           :label="item"
                           :value="item"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选择表">
            <el-select v-model="formData.table" placeholder="请选择（Table）" @change="onTableChange"
                       class="transport_edit_select">
                <el-option v-for="(item,index) in selectData.table"
                           :key="index"
                           :label="item"
                           :value="item"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选择写入方式">
            <el-radio-group v-model="formData.insertMode">
                <el-radio label="insert">Insert</el-radio>
                <el-radio label="update">Update</el-radio>
                <el-radio label="replace">Replace</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="预处理">
            <el-input v-model="formData.preSql" placeholder="请输入Sql"></el-input>
        </el-form-item>
        <el-form-item label="结束处理">
            <el-input v-model="formData.postSql" placeholder="请输入Sql"></el-input>
        </el-form-item>
    </el-form>

</template>

<script>
    export default {
        name: "MySqlWrite",
        data() {
            return {
                selectData: {
                    target_id: '',
                    catalog: [],
                    table: [],
                },
                formData: {
                    schema: '',
                    table: '',
                    insertMode: 'insert',
                    preSql: '',
                    postSql: '',
                }
            }
        },
        methods: {
            onSchemaChange(item) {
                if (item !== '') {
                    this.$dbApi.post(['db', 1, this.selectData.target_id, 'table', 'get'].join('/'), {catalog: item}, response => {
                        if (response.data.code === 200) {
                            this.selectData.table = response.data.data
                        } else {
                            this.$respHandler.handleResponse(response)
                        }
                    })
                }
            },
            onTableChange(item) {
                if (item !== '') {
                    this.$dbApi.post(['db', 1, this.selectData.target_id, 'column', 'get'].join('/'), {
                        catalog: this.formData.schema,
                        table: this.formData.table
                    }, response => {
                        if (response.data.code === 200) {
                            this.$emit('receiveChildren', response.data.data)
                        } else {
                            this.$respHandler.handleResponse(response)
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
