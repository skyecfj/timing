<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>活动区域名称</div></el-col>
                <el-col :span="4"><div>创建人</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <template>
                        <el-input size="small"
                                placeholder="请输入"
                                v-model="activityAreaName"
                                clearable>
                        </el-input>
                    </template>
                </el-col>
                <el-col :span="4">
                    <template>
                        <el-input size="small"
                                placeholder="请输入"
                                v-model="creator"
                                clearable>
                        </el-input>
                    </template>
                </el-col>
                <el-col :span="6">
                    <el-button size="small" @click="getActiveList" class="c-button c-button--primary">查询</el-button>
                    <el-button size="small" @click="reset" class="c-button c-button--plain">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small"  @click="activeHallUpdate" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    tooltip-effect="dark"
                    border>
                <el-table-column prop="id" label="记录ID"></el-table-column>
                <el-table-column prop="activityAreaName" label="活动区域名称"></el-table-column>
                <el-table-column prop="createUser" label="创建人"></el-table-column>
                <el-table-column prop="history" label="变更记录">
                    <template slot-scope="scope">
                        <el-popover
                                placement="left"
                                width="1000"
                                trigger="click">
                            <el-table
                                    :data="dialogTableData"
                                    tooltip-effect="dark"
                                    border>
                                <el-table-column prop="fieldName" label="更新字段"></el-table-column>
                                <el-table-column prop="startValue" label="原值"></el-table-column>
                                <el-table-column prop="updateValue" label="更新值"></el-table-column>
                                <el-table-column prop="modifiedUser" label="更新人员"></el-table-column>
                                <el-table-column prop="modifiedTime" label="更新时间"></el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination
                                        @size-change="handleLogSizeChange"
                                        @current-change="handleLogCurrentChange"
                                        :current-page="currentLogPage"
                                        :page-sizes="pageSizesList"
                                        :page-size="pageLogSize"
                                        class="gross"
                                        background
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="totalLogRecords">
                                </el-pagination>
                            </div>
                            <el-button size="small"  type="text" slot="reference" @click="activeDetails(scope.row.id)">变更详情</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="activeHallUpdate(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
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
        name: "activeHall",
        data() {
            return {
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                activityAreaName: '',
                creator: '',
                module: '主档管理',
                subModule: '活动区域与餐厅映射',
                dialogTableData: [],
                currentLogPage: 1,
                pageLogSize: 10,
                totalLogRecords: 0

            }
        },
        methods: {
            handleLogSizeChange(size){
                this.pageLogSize = size
                this.getDataLog()
            },
            handleLogCurrentChange(currentPage) {
                this.currentLogPage = currentPage
                this.getDataLog()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getActiveList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getActiveList();
            },
            checkDetail(rows){
                this.$router.push({name:'activeHallEdit',query:{id:rows.id,detail:true},params:{parentRoute:this.$route.fullPath}});
            },
            activeHallUpdate(index,rows){
                if(rows){
                    this.$router.push({name:'activeHallEdit',query:{id:rows.id},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name:'activeHallAdd',params:{parentRoute:this.$route.fullPath}});
                }
            },
            getActiveList(param){
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
                        name:'activityAreaName',
                        value:this.activityAreaName
                    },
                    {
                        name:'modifiedUser',
                        value:this.creator
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getActivityAreaList(tem,function(res){
                    if(res.code === 404){
                        that.tableData = [];
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            removeRow(id) {
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'module',
                        value:this.module
                    },
                    {
                        name:'subModule',
                        value:this.subModule
                    },
                    {
                        name:'id',
                        value:id
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteActivityArea(tem,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getActiveList(true);
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                            that.getActiveList(true);
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            reset(){
                this.activityAreaName = '';
                this.creator = '';
                // this.getActiveList(true);
            },
            activeDetails(id){
                this.operationId = id;
                this.getDataLog();
            },
            getDataLog(){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentLogPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageLogSize
                    },
                    {
                        name:'module',
                        value:this.module
                    },
                    {
                        name:'submodule',
                        value:this.subModule
                    },
                    {
                        name:'operationId',
                        value:this.operationId
                    },
                ];
                tem = this.common.joinSearchParam(condition);
                ip.getDataLog(tem,function (res) {
                    if(res.code === 404){
                        that.dialogTableData = [];
                    }else if(res.code === 200){
                        that.dialogTableData = res.data.list;
                        that.totalLogRecords = res.data.totalRecords;
                    }
                })
            }
        },
        mounted(){
            this.getActiveList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>
