<template>
    <div class="taskDetail">
        <!--导航下拉框-->
        <div class="nav">
            <div class="selectContent">
                <div class="selectTitle">任务类型</div>
                <el-select size="small"  v-model="taskType" placeholder="任务类型" class="navSele" filterable>
                    <el-option v-for="item in taskTypeOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">执行方式</div>
                <el-select size="small"  v-model="taskExecute" placeholder="执行方式" class="navSele" filterable>
                    <el-option v-for="item in taskExecuteOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">任务状态</div>
                <el-select size="small"  v-model="taskInstanceStatus" placeholder="任务状态" class="navSele" filterable>
                    <el-option v-for="item in taskInstanceStatusOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">任务名称</div>
                <el-select size="small"  v-model="taskIds" placeholder="请选择" class="navSele" multiple filterable>
                    <el-option v-for="item in taskOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">计划开始时间</div>
                <el-date-picker v-model="prePlanStartTime" type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerDateOption">
                </el-date-picker>
                <span>-</span>
                <el-date-picker v-model="finalPlanStartTime" type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerDateOption">
                </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">实际结束时间</div>
                <el-date-picker v-model="preActualEndTime" type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerDateOption">
                </el-date-picker>
                <span>-</span>
                <el-date-picker v-model="finalActualEndTime" type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerDateOption">
                </el-date-picker>
            </div>
            <el-button size="small"  type="success" @click="search">查询</el-button>
        </div>
        <div class="searchContent">
            <el-table :data="tableDataRi"  style="width: 100%" border>
                <el-table-column type="index" width=50 :index="typeIndex">
                </el-table-column>
                <el-table-column prop="taskName" show-overflow-tooltip label="任务名" min-width="100px">
                </el-table-column>
                <el-table-column prop="taskType" label="任务类型" min-width="50px">
                </el-table-column>
                <el-table-column prop="executeType" label="执行方式" min-width="50px">
                </el-table-column>
                <el-table-column prop="taskInstanceStatus" label="任务状态" min-width="50px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskInstanceStatus === '成功'" class="successColor">
                        {{scope.row.taskInstanceStatus}}
                    </span>
                        <span v-else-if="scope.row.taskInstanceStatus === '失败'" class="failColor">
                        {{scope.row.taskInstanceStatus}}
                    </span>
                        <span v-else-if="scope.row.taskInstanceStatus === '准备'" class="preColor">
                        {{scope.row.taskInstanceStatus}}
                    </span>
                        <span v-else-if="scope.row.taskInstanceStatus === '等待'" class="waitColor">
                        {{scope.row.taskInstanceStatus}}
                    </span>
                        <span v-else-if="scope.row.taskInstanceStatus === '运行中'" class="runColor">
                        {{scope.row.taskInstanceStatus}}
                    </span>
                        <span v-else>
                        {{scope.row.taskInstanceStatus}}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column prop="taskInstanceProgress" label="任务进度" min-width="50px">
                </el-table-column>
                <el-table-column prop="createUser" label="执行人" min-width="50px">
                </el-table-column>
                <el-table-column prop="planStartTime" label="计划开始时间" min-width="60px">
                </el-table-column>
                <el-table-column prop="actualStartTime" label="实际开始时间" class-name="status-col" min-width="60px">
                </el-table-column>
                <el-table-column prop="actualEndTime" label="实际结束时间" min-width="60px">
                </el-table-column>
                <el-table-column label="操作" min-width="80px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="日志" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   @click="checkLog(scope.row)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-clipboard-list"></i></el-button>
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
        <!--查看日志-->
        <el-dialog title="日志" :visible.sync="logFormDialog" class="logDialog" width="80%" >
            <div>
                <el-form  label-width="75px">
                    <el-form-item label="日志级别">
                        <el-select size="small"  v-model="logLevel" placeholder="日志级别" @change="selectByLogLevel">
                            <el-option v-for="item in logLevelOption" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="logForm"  style="width: 100%;" height="450">
                <el-table-column prop="createTime" label="时间" width=150px>
                </el-table-column>
                <el-table-column prop="level" label="level" width=100px>
                    <template slot-scope="scop">
                        <span v-if="scop.row.level == 0" class="failColor">ERROR</span>
                        <span v-else-if="scop.row.level == 1" class="waitColor">WARN</span>
                        <span v-else class="preColor">INFO</span>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="内容" >
                    <template slot-scope="scop">
                        <pre style="white-space: pre-wrap;">{{scop.row.content}}</pre>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChanges" @current-change="handleCurrentChanges"
                               :current-page="currentPage" :page-sizes="pageSizesList"
                               :page-size="pageSize" class="gross" background
                               layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
                </el-pagination>
            </div>
        </el-dialog>

        <!--查看日志-->
        <!--查看详情-->
        <el-dialog title="详情" :visible.sync="detailFormDialog" class="detailDialog" width="65%">
            <el-form :model="detailForm"  label-width="140px">
                <el-form-item label="任务名称">
                    <el-input size="small"  v-model.trim="detailForm.taskName" readonly :title="detailForm.taskName"></el-input>
                </el-form-item>
                <el-form-item label="任务类型">
                    <el-input size="small"  v-model.trim="detailForm.taskType"  readonly></el-input>
                </el-form-item>
                <el-form-item label="处理类型">
                    <el-input size="small"  v-model.trim="detailForm.sourceType"  readonly></el-input>
                </el-form-item>
                <el-form-item label="执行方式">
                    <el-input size="small"  v-model.trim="detailForm.executeType" readonly></el-input>
                </el-form-item>
                <el-form-item label="任务状态" >
                    <el-input size="small"  v-model.trim="detailForm.taskInstanceStatus" readonly></el-input>
                </el-form-item>
                <el-form-item label="任务进度" >
                    <el-input size="small"  v-model.trim="detailForm.taskInstanceProgress" readonly></el-input>
                </el-form-item>
                <el-form-item label="执行人" >
                    <el-input size="small"  v-model.trim="detailForm.createUser" readonly></el-input>
                </el-form-item>
                <el-form-item label="计划开始时间" >
                    <el-input size="small"  v-model.trim="detailForm.planStartTime" readonly :title="detailForm.planStartTime"></el-input>
                </el-form-item>
                <el-form-item label="实际开始时间" >
                    <el-input size="small"  v-model.trim="detailForm.actualStartTime" readonly :title="detailForm.actualStartTime"></el-input>
                </el-form-item>
                <el-form-item label="实际结束时间" >
                    <el-input size="small"  v-model.trim="detailForm.actualEndTime" readonly :title="detailForm.actualEndTime"></el-input>
                </el-form-item>
                <el-form-item label="理由" >
                    <el-input size="small"  v-model.trim="detailForm.reason" readonly></el-input>
                </el-form-item>
                <el-form-item label="kettle任务id" v-if="detailForm.sourceType == 'kettle'">
                    <el-button type="text" @click="getKettleLog(detailForm.jobId)">{{detailForm.jobId}}</el-button>
                </el-form-item>
                <div class="paramItem">
                    <el-form-item label="执行参数">
                        <el-input size="small"  v-model.trim="detailForm.param" readonly :autosize="{mminRows:8 }" type="textarea"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
        <!--查看详情-->
    </div>
</template>
<script>
    import api from '../../model/api'
    const defalutDetailForm = {
        taskName:'',
        taskType:'',
        executeType:'',
        taskInstanceStatus:'',
        taskInstanceProgress:'',
        createBy:'',
        planStartTime:'',
        actualStartTime:'',
        actualEndTime:'',
        reason:'',
        param:{},
        sourceType:'',
        lastId:[],

    }
    export default{
        name:'taskDetailList',
        data() {
            return {
                pageSizeList:[25, 50, 75, 100, 125],
                pageSizesList:[50,100,150,200,250],
                totalRecords:0,
                totalRecordss:0,
                totalPage:1,
                currentPage: 1,
                pageSize:25,
                currentPages: 1,
                pageSizes:50,
                taskExecute:'',
                searchDate:'',
                taskType:'',
                taskTypeOption: [],
                taskExecuteOption:[],
                taskInstanceStatus:'',
                taskInstanceStatusOption:[],
                task:'',
                taskOption:[],
                tableDataLe:[],
                fuzzySearch:'',
                tableDataRi: [],
                taskIds:[],
                prePlanStartTime:'',
                finalPlanStartTime:'',
                preActualEndTime:'',
                finalActualEndTime:'',
                detailFormDialog:false,
                logFormDialog:false,
                detailForm: Object.assign({},defalutDetailForm),
                logForm:[],
                pickerDateOption:{
                    disabledDate(time){
                        return time.getTime() > Date.now();
                    }
                },
                logLevel:'',
                logLevelOption:[],
                currentTaskInstanceId:''
            }
        },
        watch:{
            $route(to,from){
                // console.log('变了');
            }
        },
        activated(){
            if((JSON.stringify(this.lastId) !== JSON.stringify(this.taskIds)) &&(!this.common.isNullString(JSON.stringify(this.lastId)))){
                this.getPageData(this.taskIds)
            }
        },
        deactivated(){
            this.lastId = this.taskIds;
        },
        created(){
            if(this.$route.query.taskId){
                this.taskIds = this.$route.query.taskId
            }
            this.getPageData(this.taskIds)
            this.getSearchParams('1')
            this.getSeachLogLevel('5')
        },
        methods:{
            getKettleLog(jobId){
                this.detailFormDialog = false
                this.$router.push({name: 'kettleLog',params:{parentRoute:this.$route.fullPath,jobId:jobId}});
            },
            change:function(index,row){
            },
            selectByLogLevel(){
                this.getTaskLog()
            },
            checkDetail(rowData){
                this.detailFormDialog = true
                this.detailForm = rowData
                if(this.detailForm.param == '{}')
                {
                    this.detailForm.param =''
                }
            },
            checkLog(rowData){
                var that = this
                this.logLevel = ''
                this.currentTaskInstanceId = rowData.taskInstanceId
                this.getTaskLog()
            },
            getTaskLog(){
                var that = this
                var param = [
                    {
                        name:'taskInstanceId',
                        value:this.currentTaskInstanceId
                    },
                    {
                        name:'logLevel',
                        value:this.logLevel
                    },
                    {
                        name:'pageSize',
                        value:this.pageSizes
                    },
                    {
                        name:'pageIndex',
                        value:this.currentPages,
                    }
                ]
                api.getTaskLog(this.common.joinSearchParam(param),function(res){
                    that.logForm = [];
                    if (res.code === 200 || res.code === 404) {
                        res.data.list.forEach(function (item, index) {
                            item.createTime = that.common.formatDate(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss')
                        })
                        that.logForm = res.data.list;
                        that.totalRecords = res.data.totalRecords || 0;
                        that.logFormDialog = true
                    }
                    else if (res.code !== 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getSeachLogLevel(param){
                var that = this
                api.getPageSearch(param, function (res) {
                    that.logLevelOption = []
                    that.logLevelOption.push({value: '', label: '请选择'});
                    res.data.logLevel.forEach(function (item, index) {
                        that.logLevelOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                })
            },
            getSearchParams(param){
                var that = this
                api.getPageSearch(param ? param : '', function (res) {
                    that.taskTypeOption = []
                    that.taskExecuteOption = []
                    that.taskStatusOption =[]
                    that.taskOption = []
                    that.taskTypeOption.push({value: '', label: '请选择'});
                    res.data.taskType.forEach(function (item, index) {
                        that.taskTypeOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                    that.taskExecuteOption.push({value: '', label: '请选择'});
                    res.data.taskExecute.forEach(function (item, index) {
                        that.taskExecuteOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                    that.taskInstanceStatusOption.push({value: '', label: '请选择'});
                    res.data.taskInstanceStatus.forEach(function (item, index) {
                        that.taskInstanceStatusOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                    res.data.task.forEach(function (item, index) {
                        that.taskOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                })
            },
            getPageData(taskIds){
                var that = this
                var params = [
                    {
                        name:'taskIds',
                        value:taskIds
                    },
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'taskType',
                        value:this.taskType
                    },
                    {
                        name:'executeType',
                        value:this.taskExecute
                    },
                    {
                        name:'taskInstanceStatus',
                        value:this.taskInstanceStatus
                    }
                ]
                if(this.prePlanStartTime)
                {
                    params.push({ name:'prePlanStartTime',value:this.prePlanStartTime})
                }
                if(this.finalPlanStartTime)
                {
                    params.push({ name:'finalPlanStartTime',value:this.finalPlanStartTime})
                }
                if(this.preActualEndTime)
                {
                    params.push({ name:'preActualEndTime',value:this.preActualEndTime})
                }
                if(this.finalActualEndTime)
                {
                    params.push({ name:'finalActualEndTime',value:this.finalActualEndTime})
                }
                var param = this.common.joinSearchParam(params)
                api.getTaskInstance(param,function(res){
                    that.tableDataRi = [];
                    that.totalPage = 0;
                    that.totalRecords = 0;
                    if(res.code === 200)
                    {
                        that.tableDataRi = res.data.list;
                        that.totalPage = res.data.totalPages;
                        that.totalRecords = res.data.totalRecords;
                    }
                    else if(res.code != 404){
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            search(){
                if(this.finalPlanStartTime < this.prePlanStartTime || (this.common.isNullString(this.prePlanStartTime)&& !this.common.isNullString(this.finalPlanStartTime))
                    || (!this.common.isNullString(this.prePlanStartTime)&& this.common.isNullString(this.finalPlanStartTime)))
                {
                    this.showTips('计划开始时间的日期范围有误','warning')
                }
                else if(this.finalActualEndTime < this.preActualEndTime || (this.common.isNullString(this.preActualEndTime)&& !this.common.isNullString(this.finalActualEndTime))
                    || (!this.common.isNullString(this.preActualEndTime)&& this.common.isNullString(this.finalActualEndTime)))
                {
                    this.showTips('实际结束时间的日期范围有误','warning')
                }
                else{
                    this.getPageData(this.taskIds)
                }
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getPageData(this.taskIds)
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getPageData(this.taskIds)
            },
            typeIndex(index) {
                return this.pageSize * (this.currentPage - 1) + index + 1;
            },
            showTips(text,type){
                this.common.messageUtil({
                    message: text,
                    type: type
                });
            },
            handleSizeChanges(val) {
                this.pageSizes = val
                this.getTaskLog();
            },
            handleCurrentChanges(val) {
                this.currentPages = val
                this.getTaskLog()
            },
        }
    }
</script>
<style lang="scss" scoped>
    $tColor:#409EFF;
    $scussessColor:#67C23A;
    $failColor:#F56C6C;
    $preColor:#409EFF;
    $waitColor:#E6A23C;
    $runColor:#0094D4;
    .taskDetail {
        .nav {
            padding: 20px;
            background: white;
            margin-bottom: 20px;
        }
        .navSear {
            width: 217px;
        }
        .timeColor {
            color: $tColor;
        }
        .searchContent {
            background-color: white;
            .pagination {
                text-align: right;
                padding: 20px;
            }
        }
    }
    .el-dialog .el-form .el-form-item {
        display: inline-block;
        width: 45%;
        .el-form-item__content {
            .el-select {
                width: 100%;
            }
            .el-date-editor.el-input {
                width: 100%;
            }
        }
    }
    .el-dialog .el-form .paramItem{
        .el-form-item {
            width: 96%
        }
    }
    .el-dialog .el-form .el-form-item:nth-child(even) {
        float: right;
        margin-right: 50px;
    }
    .successColor {
        color: $scussessColor
    }
    .failColor {
        color: $failColor;
    }
    .preColor {
        color: $preColor;
    }
    .waitColor {
        color: $waitColor;
    }
    .runColor {
        color: $runColor;
    }
</style>
