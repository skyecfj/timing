<template>
    <div id="home">
        <div class="partTop">
            <el-row>
                <el-col :span="12">
                    <!--正在进行表格-->
                    <div class="topLeftTa">
                        <p class="topTitle"><span>正在进行</span><el-button size="small"  class="updateBtn c-button c-button--primary" @click="updateTask">刷新</el-button></p>
                        <el-table height="290" :data="tableDataNow" border>
                            <el-table-column prop="taskName" label="当前任务">
                            </el-table-column>
                            <el-table-column prop="actualStartTime" label="实际开始时间">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="12">
                    <!--任务计划表格-->
                    <div class="topRightTa">
                        <p class="topTitle"><span>任务计划</span> <el-button size="small"  class="updateBtn c-button c-button--primary" @click="updateTask">刷新</el-button></p>
                        <el-table height="290" :data="tableDataLe" border>
                            <el-table-column prop="taskName" label="任务名">
                            </el-table-column>
                            <el-table-column prop="planStartTime" label="计划开始时间">
                                <template slot-scope="scope">
                                    <span class="{timeColor:(scope.row.planAcTime)}">{{ scope.row.planStartTime }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--查询框-->
        <div class="nav">
            <div class="selectContent">
                <div class="selectTitle">任务类型</div>
                <el-select size="small"  v-model="taskType" placeholder="请选择"  filterable>
                    <el-option v-for="item in taskOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">任务状态</div>
                <el-select size="small"  v-model="searchStatus" placeholder="请选择">
                    <el-option v-for="item in searchStatusOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!--筛选模糊查询-->
            <div class="selectContent">
                <div class="selectTitle">任务名称</div>
                <el-input size="small"  placeholder="请输入查询内容" v-model="fuzzySearch" class="navSear" clearable>
                </el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">任务组名称</div>
                <el-select size="small"  v-model="groupIds" placeholder="请选择" multiple filterable>
                    <el-option v-for="item in taskGroupIdsOption" :key="item.code" :label="item.message" :value="item.code">
                    </el-option>
                </el-select>
            </div>
            <el-button size="small"   @click="searchTaskList" class="c-button c-button--primary" >查询</el-button>
            <el-button size="small"  @click="newAdd" plain class="c-button c-button--plain">新增</el-button>
            <el-button size="small"   @click="viewDetails" class="c-button c-button--primary" >执行记录</el-button>
        </div>
        <!--详细的表格-->
        <div class="tableRight">
            <template>
                <el-table :data="tableDataRi" @selection-change="handleSelectionChange" style="width: 100%" border>
                    <el-table-column type="index" width="60px">
                    </el-table-column>
                    <el-table-column prop="taskName" show-overflow-tooltip label="任务名" min-width="100px">
                    </el-table-column>
                    <el-table-column prop="cronDescription" label="频率" min-width="60px">
                    </el-table-column>
                    <el-table-column prop="taskType" label="任务类型" width="80px">
                    </el-table-column>
                    <el-table-column prop="timeout" label="超时时间(分)" width="80px">
                    </el-table-column>
                    <el-table-column prop="sourceType" label="处理类型" width="60px">
                    </el-table-column>
                    <el-table-column prop="lastExecuteTime" label="上次执行时间" min-width="80px">
                    </el-table-column>
                    <el-table-column prop="lastExecuteStatus" label="上次执行状态" class-name="status-col" width="80px">
                        <template slot-scope="scope">
                            <span v-if="scope.row.lastExecuteStatus=== '成功'" style="color:#409EFF">成功</span>
                            <span v-else-if="scope.row.lastExecuteStatus=== '失败'" style="color:#F56C6C">失败</span>
                            <span v-else>{{scope.row.lastExecuteStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="nextExecuteTime" label="计划下次执行时间" min-width="80px">
                    </el-table-column>
                    <el-table-column prop="modifiedTime" label="更新时间" min-width="80px">
                    </el-table-column>
                    <el-table-column prop="action" label="操作" min-width="150px">
                        <template slot-scope="scope">
                            <el-tooltip content="立即执行" placement="top" effect="light" popper-class="table-cell-toolTip">
                                <el-button size="small"    class="c-button-icon--primary--opacity c-button-icon-circle" @click="actionNow(scope.$index,true,scope.row)"><i class="fa fa-play-circle "></i></el-button>
                            </el-tooltip>
                            <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                                <el-button size="small"   @click="editTask(scope.$index,true,scope.row)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                                <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="handleDelete(scope.$index,scope.row)"><i class="fa fa-trash-alt"></i></el-button>
                            </el-tooltip>
                            <el-tooltip content="查看执行记录" placement="top" effect="light" popper-class="table-cell-toolTip">
                                <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click.native.prevent="viewDetails(scope.$index, scope.row)"><i class="fa fa-toolbox"></i></el-button>
                            </el-tooltip>
                            <el-tooltip content="查看任务依赖关系" placement="top" effect="light" popper-class="table-cell-toolTip">
                                <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="echartTestFn(scope.row)"><i class="fa fa-code-branch"></i></el-button>
                            </el-tooltip>
                            <div class="switchDiv">
                                <el-switch active-text="启用" inactive-text="停用" active-color="#56CD74" inactive-color="#bdbdbd" v-model="scope.row.taskStatus == '启用' ? true:false"
                                           :width=60 @change="ableChange(scope.$index,scope.row)">
                                </el-switch>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <!--分页-->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizesList"
                               :page-size="pageSize" class="gross" background layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
                </el-pagination>
            </div>
        </div>
        <!--立即执行-->
        <el-dialog title="立即执行" :visible.sync="dialogFormVisibleAC" class="executeDialog" width="70%">
            <el-form :model="formAC" ref="formAC">
                <div v-model="formAC.taskId" style="display:none"></div>
                <el-form-item label="任务名" :label-width="formLabelWidth">
                    <el-input size="small"   v-model="excuteTaskName" disabled>
                    </el-input>
                </el-form-item>
                <!--<el-form-item label="是否影响下次执行" :label-width="formLabelWidth">
                    <el-select size="small"  v-model="finalResultEnable">
                        <el-option v-for="item in finalResultEnableOption"
                                   :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="参数 :" :label-width="formLabelWidth" :rules="{ required: true, message: '参数不能为空', trigger: 'blur' }" prop="param">
                    <el-input size="small"  type="textarea" v-model="formAC.param" :autosize="{ minRows: 4}" >
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="dialogFormVisibleAC = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="submitFormAC()" class="c-button c-button--primary">确定</el-button>
            </div>
        </el-dialog>
        <!--立即执行-->
        <!--编辑-->
        <el-dialog :visible.sync="dialogFormVisible" width="70%" class="editDialog">
            <div slot="title">
                {{taskDialogTitle}}
            </div>
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="taskName">
                    <el-input size="small"  v-model.trim="form.taskName" clearable :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="任务类型" :label-width="formLabelWidth" v-if="!this.isEdit" prop="taskType">
                    <el-select size="small"  v-model="form.taskType" clearable filterable>
                        <el-option v-for="item in taskTypeOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处理类型" :label-width="formLabelWidth" v-if="!this.isEdit" clearable>
                    <el-input size="small"  v-model.trim="sourceType.message" disabled></el-input>
                </el-form-item>
                <el-form-item label="定时执行频率" :label-width="formLabelWidth">
                    <el-select size="small"  v-model="form.frequency" @change="banMonth" placeholder="请选择">
                        <el-option v-for="item in frequencyOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" :label-width="formLabelWidth" v-if="this.isShow">
                    <el-select size="small"  v-model="form.day" placeholder="请选择" :disabled="isAble" @change="dateChange" filterable>
                        <el-option v-for="item in dayRangeOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" :label-width="formLabelWidth" v-if="this.isShow">
                    <el-time-picker arrow-control v-model="form.time" :picker-options="{start: '00:00：00',step: '00:15:15', end: '23:59:59'}"
                                    placeholder="请选择" value-format="HH:mm:ss" :disabled="isDateAble" clearable @change="timeChange">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="任务超时时间(分)" :label-width="formLabelWidth">
                    <el-input size="small"  v-model.trim="form.timeout" placeholder="任务超时时间" clearable></el-input>
                </el-form-item>
                <el-form-item label="cron表达式" :label-width="formLabelWidth">
                    <el-input size="small"  v-model.trim="form.cronExpression" placeholder="cron表达式" clearable :disabled="isShow"></el-input>
                </el-form-item>
                <el-form-item label="任务依赖" :label-width="formLabelWidth">
                    <el-select size="small"  v-model="relyTask" multiple filterable placeholder="请选择">
                        <el-option v-for="item in relyTasksOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务冲突" :label-width="formLabelWidth">
                    <el-select size="small"  v-model="form.conflictTasks" multiple filterable placeholder="请选择">
                        <el-option v-for="item in relyTasksOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日志级别" :label-width="formLabelWidth" prop="logLevel">
                    <el-select size="small"  v-model="form.logLevel" filterable placeholder="请选择">
                        <el-option v-for="item in logLevelOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自动执行类型" :label-width="formLabelWidth" prop="autoExecuteType">
                    <el-select size="small"  v-model="form.autoExecuteType" filterable placeholder="请选择">
                        <el-option v-for="item in autoExecuteTypeOption" :key="item.code" :label="item.message" :value="item.code">
                            <div class="autoExecuteTypeLeftOption">{{ item.message }}</div>
                            <div class="autoExecuteTypeOption float-right">{{ item.desc }}</div>
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="fullItem">
                    <el-form-item label="参数" :label-width="formLabelWidth">
                        <el-input size="small"  type="textarea" :autosize="{ minRows: 3,maxRows:10}" v-model.trim="form.param" clearable>
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="dialogFormVisible = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="submitForm()" class="c-button c-button--primary">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="echartTest"  class="editDialog" fullscreen>
            <taskDepends  :taskId="taskId" :taskName="taskName"></taskDepends>
        </el-dialog>
        <!--编辑-->
    </div>
</template>
<script>
    import api from '../../model/api'
    import taskDepends from './taskDepends.vue'
    const defaultForm = {
        taskName:'',
        frequency: 2,
        sourceType:'',
        day:"",
        time: "",
        timeout: '',
        param:'',
        editRelyTasks:[],
        taskType: '',
        relyTasks:[],
        conflictTasks:[],
        logLevel:'',
        cronExpression:''
    }
    export default{
        name: 'taskCenter',
        data() {
            return {
                title:'编辑任务',
                isEdit: false,
                isShow:false,
                searchStatus: '',
                searchStatusOption: [],
                frequencyOption:[],
                dayRangeOption:[],
                tableDataNow: [],
                tableDataLe: [],
                logLevelOption:[],
                taskOptions: [],
                taskTypeOption:[],
                relyTasksOption:[],
                relyTask:[],
                taskType:'',
                fuzzySearch: '',
                tableDataRi: [],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords:0,
                totalPages: 0,
                dialogFormVisible: false,
                dialogFormVisibleAC: false,
                editRelyTasks:[],
                sourceType:[],
                form: Object.assign({},defaultForm),
                formAC:{
                    taskId:'',
                    param:'{}'
                },
                excuteTaskName:'',
                isAble: true,
                formLabelWidth: '130px',
                taskDialogTitle:'',
                isDateAble:true,
                echartTest:false,
                taskId:'',
                taskName:'',
                finalResultEnable:1,
                finalResultEnableOption:[
                    {
                        value:1,
                        label:'是'
                    }
                    ,{
                        value:0,
                        label:'否'
                    }
                ],
                rules: {
                    taskName: [
                        { required: true, message: '任务名称不能为空', trigger: 'blur' }
                    ],
                    taskType: [
                        { required: true, message: '任务类型不能为空', trigger: 'blur' }
                    ],
                    logLevel: [
                        { required: true, message: '日志级别不能为空', trigger: 'blur' }
                    ],
                    autoExecuteType:[
                        { required: true, message: '自动执行类型不能为空', trigger: 'blur' }
                    ]
                },
                groupIds:[],
                taskGroupIdsOption:[],
                autoExecuteTypeOption:[]
            }
        },
        components:{
            taskDepends
        },
        methods: {
            updateTask(){
                this.getRunningList();
                this.getReadyList();
            },
            getRelationship(id){
                api.viewTaskRelationship(id,function(res){
                })
            },
            echartTestFn(row){
                this.taskId = row.taskId;
                this.taskName = row.taskName ;
                this.echartTest = true;
//                api.viewTaskRelationship(id,function(res){
//                    console.log(res);
//                })
            },
//立即执行
            actionNow(index,param,rowData){
                var that=this;
                that.formAC.param = '{}';
                that.dialogFormVisibleAC = param;
                if(that.$refs.formAC){
                    that.$refs.formAC.clearValidate()
                }
                this.finalResultEnable=1
                this.excuteTaskName = rowData.taskName
                that.formAC.taskId=rowData.taskId;
            },
            submitFormAC(){
                var that=this;
                this.$refs.formAC.validate((valid) => {
                    if (valid) {
                        that.formAC.finalResultEnable = that.finalResultEnable
                        api.startManualTask(that.formAC,function(res){
                            that.dialogFormVisibleAC=false;
                            if(res.code=="200"){
                                that.showTips(res.data,'success');
                                that.getTaskListByCondition();
                                that.updateTask();
                            }else{
                                that.showTips(res.msg,'warning')
                            }
                        })
                    }
                    else{
                        return false
                    }
                })
            },
            searchTaskList(){
                this.currentPage = 1
                this.getTaskListByCondition();
            },
//编辑页面
            newAdd(){
                this.isAble = true;
                this.isDateAble = true;
                this.taskDialogTitle = '新增任务'
                this.relyTask=[]
                this.isEdit = false;
                this.form = Object.assign({},defaultForm);
                this.dialogFormVisible = true;
                this.openEdit(this.isEdit)
            },
            editTask(index,param,rowData){
                this.taskDialogTitle = '编辑任务'
                var that = this;
                this.isEdit = true;
                this.dialogFormVisible = param;
                api.getSingleTask(rowData.taskId,function(res){
                    that.banMonth(res.data.frequency);
                    that.form=res.data;
                    that.form.conflictTasks = res.data.conflictTasks ? res.data.conflictTasks :[]
                    that.form.frequency = 2
                    that.isShow = false
                    that.relyTask = []
                    res.data.relyTasks.forEach(function(item,index){
                        that.relyTask.push(item.code)
                    })
                })
                this.openEdit(this.isEdit)
            },
//编辑页面
            openEdit(isEdit){
                var that=this;
                if(that.$refs.form){
                    that.$refs.form.clearValidate()
                }
                var taskType = isEdit ? 3 : 4;
                api.getPageSearch(taskType, function (res) {
                    if(!isEdit)
                    {
                        that.sourceType= res.data.sourceType[0]
                        that.form.sourceType = that.sourceType.code
                    }
                    that.relyTasksOption = []
                    res.data.task.forEach(function (item, index){
                        that.relyTasksOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                    that.taskTypeOption=[];
                    res.data.taskType.forEach(function (item, index) {
                        that.taskTypeOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                    that.frequencyOption=[{value:'',label:'请选择'}];
                    res.data.frequency.forEach(function (item, index) {
                        that.frequencyOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                    that.frequencyOption.push({
                        value: 2,
                        label: '自定义'
                    })
                    that.dayRangeOption=[];
                    res.data.dayRange.forEach(function (item, index) {
                        that.dayRangeOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                    that.logLevelOption =[];
                    res.data.logLevel.forEach(function (item, index) {
                        that.logLevelOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })

                    that.autoExecuteTypeOption = res.code == 200 ? res.data.autoExecuteType : (res.code == 404 ? [] : that.autoExecuteTypeOption)
                })
            },
//编辑页面
//删除
            handleDelete(index,rowData){
                var that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteTask(rowData.taskId,function(res){
                        that.showTips(res.data,'success');
                        if(res.code === 200){
                            that.showTips(res.data,'success');
                        }else if(res.code === 404){
                            that.showTips(res.msg,'warning');
                        }else{
                            that.showTips(res.msg,'error');
                        }
                        that.getTaskListByCondition();
                    });
                }).catch(() => {
                    that.showTips('已取消删除','info')
                });
            },
//删除
//启用禁用
            ableChange(index,row){
                var that=this;
                if(row.taskStatus=="禁用"){
                    this.$confirm(' 是否继续启用?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        api.usingTask(row.taskId,function(res){
                            if(res.code == "200"){
                                that.showTips(res.data,'success');
                                that.getTaskListByCondition();
                                that.updateTask();
                            }else{
                                that.showTips(res.msg,'info')
                            }
                        })
                    }).catch(() => {
                        that.common.messageUtil({
                            type: 'info',
                            message: '已取消禁用'
                        });
                    });
                }else if(row.taskStatus=="启用"){
                    this.$confirm(' 是否继续停用?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        api.disableTask(row.taskId,function(res){
                            if(res.code=="200"){
                                that.showTips(res.data,'success');
                                that.getTaskListByCondition();
                                that.updateTask();
                            }else{
                                that.showTips(res.msg,'info')
                            }
                        })
                    }).catch(() => {
                        that.common.messageUtil({
                            type: 'info',
                            message: '已取消启用'
                        });
                    });
                }
            },
            timeChange(){
                this.form.cronExpression = this.calCron(this.form.frequency,this.form.day,this.form.time)
            },
            dateChange(){
                this.form.cronExpression = this.calCron(this.form.frequency,this.form.day,this.form.time)
            },
//启用禁用
//提交表单
            submitForm(){
                var that=this;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.form.editRelyTasks = this.relyTask;
                        if(this.isEdit)
                        {
                            api.updateTask(that.form,function(res){
                                if(res.code == 200)
                                {
                                    that.dialogFormVisible = false;
                                    that.showTips(res.data,'success')
                                    that.getTaskListByCondition();
                                }
                                else{
                                    that.showTips(res.msg,'warning')
                                }
                                that.$refs.form.clearValidate()
                            })
                        }
                        else{
                            this.form.relyTasks = this.relyTask
                            api.insertTask(that.form,function(res){
                                if(res.code == 200)
                                {
                                    that.dialogFormVisible = false;
                                    that.showTips(res.data,'success')
                                    that.currentPage = 1;
                                    that.getTaskListByCondition();
                                }
                                else{
                                    that.showTips(res.msg,'warning')
                                }
                                that.$refs.form.clearValidate()
                            })
                        }
                    }
                    else{
                        return false
                    }
                })

            },
//提交表单{name: 'kettleLog',params:{parentRoute:this.$route.fullPath,jobId:jobId}}
            viewDetails(index, rows) {
                if(rows){
                    this.$router.push({name: 'taskDetailList',query:{taskId:[rows.taskId]},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name: 'taskDetailList',params:{parentRoute:this.$route.fullPath}});
                }
            },
            banMonth(val){
                if(val==2)
                {
                    this.isShow = false
                }
                else{
                    this.isShow = true
                    this.isDateAble = (val == 1 || val == 0) ? false : true
                    this.isAble = val == 1 ? false : true
                    this.form.cronExpression = this.calCron(this.form.frequency,this.form.day,this.form.time)
                }
            },
            //分页
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getTaskListByCondition();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getTaskListByCondition();
            },
            getSearchCondition(){
                var that = this;that.taskOptions = [];
                that.searchStatusOption = [];
                api.getPageSearch(0, function (res) {
                    that.taskOptions.push({value: '', label: '请选择'});
                    res.data.taskType.forEach(function (item, index) {
                        that.taskOptions.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                    that.searchStatusOption.push({value: '', label: '请选择'});
                    res.data.taskStatus.forEach(function (item, index) {
                        that.searchStatusOption.push({
                            value: item.code,
                            label: item.message
                        })
                    })
                })
            },
            getTaskListByCondition(){
                var _this = this;
                var params = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'taskName',
                        value:this.fuzzySearch
                    },
                    {
                        name:'taskType',
                        value:this.taskType
                    },
                    {
                        name:'taskStatus',
                        value:this.searchStatus
                    },
                    {
                        name:'groupIds',
                        value:this.groupIds
                    }
                ]
                var param = this.common.joinSearchParam(params);
                api.getPageTaskList(param ? param : '', function (res) {
                    _this.tableDataRi = []
                    _this.totalRecords = 0
                    if(res.code === 200)
                    {
                        _this.tableDataRi = res.data.list;
                        _this.totalRecords = res.data.totalRecords;
                    }
                    else if(res.code != 404)
                    {
                        _this.showTips(res.msg,'warning')
                    }
                })
            },
            getRunningList(){
                var that = this;
                api.getRunningTask(function (res) {
                    if (res.code === 200) {
                        that.tableDataNow = res.data
                    } else if (res.code === 404){
                        that.tableDataNow = [];
//                        that.common.messageUtil({
//                            type: 'info',
//                            message: res.msg
//                        })
                    }else{
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            },
            getReadyList(){
                var that = this;
                api.getPlanTask(function (res) {
                    if (res.code === 200) {
                        that.tableDataLe = res.data
                    } else if (res.code === 404){
                        that.tableDataLe = [];
//                        that.common.messageUtil({
//                            type: 'info',
//                            message: res.msg
//                        })
                    }else{
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            },
            showTips(text,type){
                this.common.messageUtil({
                    type: type,
                    message: text
                })
            },
            //根据频率、日期和时间点计算cron表达式
            calCron(frequency,day,time){
                var cron = null;
                frequency = parseInt(frequency);
                if(typeof(frequency) =="number" && (frequency == 0 || frequency == 1) && this.isNull(time) == false){
                    if(frequency == 1 && this.isNull(day) == true){
                        return cron;
                    }
                    //time拆分
                    var re = new RegExp("^[\\d]{2}:[\\d]{2}:[\\d]{2}$","m");
                    if(re.test(time) == false){
                        return cron;
                    }
                    var points = time.split(":");
                    var second = parseInt(points[2]);
                    var minute = parseInt(points[1]);
                    var hour = parseInt(points[0]);
                    if( second>=0 && second < 60 &&  minute>=0 && minute < 60 &&  hour>=0 && hour < 24){
                        //如果频率是天
                        if(frequency == 0 ){
                            cron = second+" "+minute+" "+hour+" * * ?"
                            return cron;
                        }
                        //如果频率是月
                        if(frequency == 1){
                            //day处理
                            if(day == "L" || day == "LW" || (parseInt(day) >0 && parseInt(day) <= 31))
                                cron = second+" "+minute+" "+hour+" "+day+" * ?"
                            return cron;
                        }
                    }
                }
                return cron;
            },
            isNull(str){
                if (str !== undefined && str !== null && str !== '') {
                    return false;
                }
                return true;
            },
            getTaskGroupIds(){
            var that = this
            api.getPageSearch(0, function (res) {
                if(res.code == 200){
                    that.taskGroupIdsOption = res.data.taskGroups
                }else if(res.code == 404){
                    that.taskGroupIdsOption = []
                }
            })
          }
        },
        beforeMount(){
            this.getRunningList();
            this.getReadyList();
            this.getTaskGroupIds()
        },
        created(){
            this.getSearchCondition();
            this.getTaskListByCondition();
        },
        mounted(){
        }
    }
</script>
<style lang="scss" scoped>
    .autoExecuteTypeOption{
       max-width: 300px;
       white-space: normal;
       line-height: 15px;
       display: inline-block;
    }
    .autoExecuteTypeLeftOption{
       max-width: 50px;
       white-space: normal;
       line-height: 15px;
       display: inline-block;
    }
    .updateBtn{
        float:right;
        margin-bottom:10px;
    }
    .el-table__row {
        padding: 100px;
    }

    $gBorder:1px solid #EBEEF5;
    $LColor:#0094D4;
    $tColor:#409EFF;
    .actionColumn {
        width: 50%
    }

    #home {
        text-align: left;
        .topLeftTa {
            background: white;
        }
        .topRightTa {
            margin-left: 30px;
            background: white;
            .checkRe {
                color: $tColor;
                padding-left: 10px;
                font-size: 13px;
            }
        }
        .topTitle {
            padding: 15px;
        }
        .nav {
            background: white;
            margin: 30px 0;
            padding: 20px;
        }
        .tableRight {
            background: white;
        }
        .navSele {
            margin: 30px;
        }
        .navSear {
            width: 217px;
        }
        .timeColor {
            color: $tColor;
        }
        .switchDiv{
            height:24px;
            overflow:hidden;
            display: inline-block;
            vertical-align: middle;
            margin-bottom: 5px;
            .el-switch{
                width:136px;
            }
        }
        .paginationDR {
            text-align: right;
            padding: 30px;
        }
        .executeDialog {
            .el-select {
                width: 80%
            }
            .el-textarea {
                width: 80%;
            }
            .el-input {
                width: 80%;
            }
        }
        .editDialog {
            .el-dialog .el-form .el-form-item {
                display: inline-block;
                width: 48%;
                .el-form-item__content {
                    .el-select {
                        width: 100%;
                    }
                    .el-date-editor.el-input {
                        width: 100%;
                    }
                }
            }
            .el-dialog .el-form .fullItem {
                .el-form-item {
                    width: 100%;
                }
            }
            .el-dialog .el-form .el-form-item:nth-child(even) {
                float: right;
            }
        }
    }
</style>
