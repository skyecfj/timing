<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">自定义区域名称</div>
                <el-input size="small"  v-model.trim="customizeActivityAreaName" clearable placeholder="请输入自定义区域名称"></el-input>
            </div>
            <el-button size="small"  type="success" @click="search">查询</el-button>
            <el-button size="small"  type="success" @click="reset" plain>重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
                <el-button size="small"  type="success" @click="newCreate">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="id" label="记录ID" min-width="50px">
                </el-table-column>
                <el-table-column prop="customizeActivityAreaName" label="自定义区域名称" min-width="80px">
                </el-table-column>
                <el-table-column prop="fmContactName" label="FM" width="80px">
                </el-table-column>
                <el-table-column prop="fbcContactName" label="FBC" width="80px">
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="变更详情" placement="top" effect="light" popper-class="table-cell-toolTip" slot="reference" >
                            <el-button size="small"  class="c-button-icon--primary--opacity c-button-icon-circle" @click="changeDetails(scope.row.id)"><i class="fa fa-info-circle"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.id,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.id,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </div>
          <!--变更详情-->
            <el-dialog :visible.sync="changeDetailDialog" class="dialogContent" width="70%" title="变更详情" >
                <el-table :data="tableLogData" border>
                    <el-table-column prop="fieldName" label="更新字段" width="130px"></el-table-column>
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
                    <el-table-column prop="modifiedUser" label="更新人员" width="80px"></el-table-column>
                    <el-table-column prop="modifiedTime" label="更新时间" width="140px"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            @size-change="handleLogSizeChange"
                            @current-change="handleLogCurrentChange"
                            :current-page="currentLogPage"
                            :page-sizes="pageSizeList"
                            :page-size="pageLogSize"
                            class="gross"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalLogRecords">
                    </el-pagination>
            </div>
         </el-dialog>
         <!--变更详情-->
    </div>
</template>
<script>
    import api from '../../model/api'
    export default {
        name:'customArea',
        data(){
            return {
                pageSizeList:[25, 50, 75, 100, 125],
                totalRecords:0,
                currentPage: 1,
                pageSize:25,
                totalLogRecords:0,
                currentLogPage: 1,
                pageLogSize:25,
                customizeActivityAreaName:'',
                createUser:'',
                tableData:[],
                tableLogData:[],
                matserModule:'主档管理',
                subModule:'自定义区域',
                operationId:'',
                userName:'',
                changeDetailDialog:false
            }
        },
        beforeMount(){
            this.getCustomizeAreaList()
        },
        beforeRouteLeave(to, from, next) {
            if (to.path === '/masterManage/customAreaAdd' ||to.path === '/masterManage/customAreaEditDetail') {
                this.$store.dispatch('delCashedViews', from.name);
                from.meta.keepAlive = false;
            }else{
                from.meta.keepAlive = true;
            }
            next();
     },
        methods:{
            handleLogSizeChange(val){
                this.pageLogSize = val
                this.getLogList()
            },
            handleLogCurrentChange(val){
                this.currentLogPage = val
                this.getLogList()
            },
            handleSizeChange(val){
                this.pageSize = val
                this.getCustomizeAreaList()
            },
            handleCurrentChange(val){
                this.currentPage = val
                this.getCustomizeAreaList()
            },
            search(){
                this.currentPage = 1
                this.getCustomizeAreaList()
            },
            reset(){
                this.customizeActivityAreaName = ''
            },
            changeDetails(operationId)
            {
                this.changeDetailDialog = true
                this.operationId = operationId
                this.currentLogPage = 1
                this.pageLogSize = 10
                this.getLogList()

            },
            getLogList(){
                var that = this
                var param = [
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
                        value: this.matserModule
                    },
                    {
                        name:'submodule',
                        value:this.subModule
                    },
                    {
                        name:'operationId',
                        value:this.operationId
                    }]
                api.getDataLog(this.common.joinSearchParam(param),function(res){
                        that.tableLogData = [];
                        that.totalLogRecords = 0;
                        if(res.code === 200)
                        {
                            that.tableLogData = res.data.list;
                            that.totalLogRecords = res.data.totalRecords;
                        }
                        console.log('tableLogData',that.tableLogData)
                 })
            },
            getCustomizeAreaList(){
                var that = this
                var param = [
                   {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'customizeActivityAreaName',
                        value:this.customizeActivityAreaName
                    }
                ]
                api.getCustomizeAreaList(this.common.joinSearchParam(param),function(res){
                    that.tableData = [];
                    that.totalRecords = 0
                    if(res.code == 200)
                    {
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                    else if(res.code != 404){
                        that.common.messageUtil({
                            message: text,
                            type: type
                        });
                    }
                })
            },
            newCreate(){
                 this.$router.push({name:'customAreaAdd',params:{parentRoute:this.$route.fullPath}})
            },
            checkDetail(customizeActivityAreaId,isEdit){
                isEdit ? this.$router.push({name:'customAreaEditDetail',query:{customizeAreaId:customizeActivityAreaId},params:{parentRoute:this.$route.fullPath}}):
                 this.$router.push({name:'customAreaCheckDetail',query:{customizeAreaId:customizeActivityAreaId},params:{parentRoute:this.$route.fullPath}})
            },
            showTips(text,type){
                this.common.messageUtil({
                    message: text,
                    type: type
                });
           }

        }
    }
</script>
