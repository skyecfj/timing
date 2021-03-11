<!--数据日志-->
<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>模块</div></el-col>
                <el-col :span="4"><div>子模块</div></el-col>
                <el-col :span="4"><div>表名</div></el-col>
                <el-col :span="4"><div>记录ID</div></el-col>
                <el-col :span="6"><div></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <template>
                        <el-select size="small"  v-model="module" placeholder="主档管理" @change="getModule" filterable>
                            <el-option
                                    v-for="item in moduleOpt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-col>
                <el-col :span="4">
                    <template>
                        <el-select size="small"  v-model="subModule" placeholder="活动主档" @change="getSubModule" :disabled="isSelectSub" filterable>
                            <el-option
                                    v-for="item in subModuleOpt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-col>
                <el-col :span="4">
                    <template>
                        <el-select size="small"  v-model="tableName" placeholder="title" filterable>
                            <el-option
                                    v-for="item in tableNameOpt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-col>
                <el-col :span="4">
                    <template>
                        <el-input size="small"
                                placeholder="请输入ID"
                                v-model="operationId"
                                clearable>
                        </el-input>
                    </template>
                </el-col>
                <el-col :span="6">
                    <el-button size="small"  type="success" @click="getDataLogList" class="c-button">查询</el-button>
                    <el-button size="small"  type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <el-table
                    :data="tableData"
                    border
                    class="viewTable">
                <el-table-column prop="module" label="模块"></el-table-column>
                <el-table-column prop="submodule" label="子模块"></el-table-column>
                <el-table-column prop="tableName" label="表名"></el-table-column>
                <el-table-column prop="operationId" label="记录ID"></el-table-column>
                <el-table-column prop="fieldName" label="更新字段"></el-table-column>
                <el-table-column prop="startValue" label="原值">
                    <template slot-scope="scope">
                        <div v-html="scope.row.startValue" style="white-space: pre-wrap;"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="updateValue" label="更新值">
                    <template slot-scope="scope">
                        <div v-html="scope.row.updateValue" style="white-space: pre-wrap;"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="modifiedUser" label="更新人员"></el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizesList"
                        :page-size="pageSize"
                        class="gross"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "dataLog",
        data() {
            return {
                module:'',
                moduleName:'',
                subModule:'',
                subModuleName:'',
                tableName:'',
                operationId:'',
                moduleOpt:[{value:'',label:'请选择'}],
                subModuleOpt:[{value:'',label:'请选择'}],
                tableNameOpt:[{value:'',label:'请选择'}],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                isSelectSub:true
            }
        },
        methods: {
            handleSizeChange:function(size) {
                this.pageSize = size;
                this.getDataLogList();
            },
            handleCurrentChange:function(currentPage) {
                this.currentPage = currentPage;
                this.getDataLogList();
            },
            getModule(val){
                var that = this;
                this.subModuleOpt = [{value:'',label:'请选择'}];
                this.subModule = '';
                ip.getSonModule(val,res => {
                    res.data.forEach(function(item,index) {
                        that.subModuleOpt.push({
                            value:item.id,
                            label:item.name
                        })
                    });
                });
                this.isSelectSub = false;
                //获得label
                let obj = {};
                obj = this.moduleOpt.find(item => {
                    return item.value === val
                });
                this.moduleName = obj.label;
            },
            getSubModule(val){
                let obj = {};
                obj = this.subModuleOpt.find(item => {
                    return item.value === val
                });
                this.subModuleName = obj.label;
            },
            getSearchCondition(param){
                var that = this;
                ip.getParentModule(res => {
                    res.data.forEach(function(item,index) {
                        that.moduleOpt.push({
                            value:item.id,
                            label:item.name
                        })
                    });
                });
                ip.getTableName(res => {
                    res.data.forEach(function(item,index) {
                        that.tableNameOpt.push({
                            value:item,
                            label:item
                        })
                    });
                })
            },
            getDataLogList(param){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'operationId',
                        value:this.operationId
                    }
                ];
                this.module||this.module === 0?condition.push({name:'module',value:this.moduleName}):[];
                this.subModule||this.subModule === 0?condition.push({name:'submodule',value:this.subModuleName}):[];
                this.tableName||this.tableName === 0?condition.push({name:'tableName',value:this.tableName}):[];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getDataLogList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                        that.totalRecords = 0;
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            reset(){
                this.module = '';
                this.subModule = '';
                this.tableName = '';
                this.operationId = '';
                this.isSelectSub = true;
                // this.getDataLogList();
            }
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            this.getDataLogList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/center';
</style>
