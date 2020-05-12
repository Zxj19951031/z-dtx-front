<template>
    <el-form v-model="formData" label-width="100px">
        <el-form-item label="选择库">
            <el-select v-model="formData.schema" placeholder="请选择（Schema）">

            </el-select>
        </el-form-item>
        <el-form-item label="选择表">
            <el-select v-model="formData.table" placeholder="请选择（Table）">

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
                formData: {
                    schema: '',
                    table: '',
                    insertMode:''
                }
            }
        }
    }
</script>

<style scoped>

</style>