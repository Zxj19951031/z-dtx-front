<template>
    <el-form v-model="formData" label-width="100px">
        <el-form-item label="选择库">
            <el-select v-model="formData.schema" placeholder="请选择（Schema）"></el-select>
        </el-form-item>
        <el-form-item>
            <el-switch
                    v-model="formData.ifQuery"
                    active-color="#13ce66"
                    inactive-color="#13ce66"
                    active-text="自定义"
                    inactive-text="选择表">
            </el-switch>
        </el-form-item>

        <el-form-item label="选择表" v-if="!formData.ifQuery">
            <el-select v-model="formData.table" placeholder="请选择（Table）">
            </el-select>
        </el-form-item>
        <el-form-item label="条件设置" v-if="!formData.ifQuery">
            <el-input v-model="formData.where" placeholder="请输入Where内容，例如id=1"></el-input>
        </el-form-item>
        <el-form-item label="查询设置" v-if="formData.ifQuery">
            <el-input v-model="formData.querySql" placeholder="请输入Select内容"></el-input>
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
        name: "MySqlRead",
        data() {
            return {
                formData: {
                    schema: '',
                    table: '',
                    preSql: '',
                    postSql: '',
                    where: '',
                    querySql: '',
                    ifQuery: false
                }
            }
        }
    }
</script>

<style scoped>

</style>
