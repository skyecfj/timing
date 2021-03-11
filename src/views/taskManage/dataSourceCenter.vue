<!--数据源中心-->
<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="6"><div>数据源名</div></el-col>
                <el-col :span="6"><div>类型</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <template>
                        <el-input size="small"  placeholder="请输入内容" suffix-icon="el-icon-search" v-model="sourceName" clearable>
                        </el-input>
                    </template>
                </el-col>
                <el-col :span="6">
                    <template>
                        <el-select size="small"  v-model="value1" placeholder="请选择类型" @change="getSelectObj" filterable>
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-col>
                <el-col :span="6">
                    <el-button size="small"  @click="getDsData" class="c-button c-button--primary">查询</el-button>
                    <el-button size="small"  @click="addDialog()" class="c-button c-button--plain">新增</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <el-table v-if="tableData" :data="tableData" border class="viewTable">
                <el-table-column type="index" width="60px"></el-table-column>
                <el-table-column prop="sourceName" label="数据源名"></el-table-column>
                <el-table-column prop="sourceType" label="类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sourceType === 0">kettle</span>
                        <span v-else-if="scope.row.sourceType === 1">爬虫</span>
                    </template>
                </el-table-column>
                <el-table-column prop="bizType" label="业务类型"></el-table-column>
                <el-table-column prop="increaseType" label="增量类型"></el-table-column>
                <el-table-column prop="value" label="值"></el-table-column>
                <el-table-column prop="userName" label="用户名"></el-table-column>
                <el-table-column prop="param" label="其他参数"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   @click="alterDataSource(scope.row.id)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id,tableData)"><i class="fa fa-trash-alt"></i></el-button>
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
        <!--弹框-->
        <el-dialog :visible.sync="dialogPopupVisible" width="60%" class="dialogContent">
            <div slot="title">
                {{updateDialogTitle}}
            </div>
            <el-form :model="editDs" :rules="rules" ref="editDsForm">
                <el-form-item label="数据源名" :label-width="formLabelWidth" prop="sourceName">
                    <el-input size="small"  v-model.trim="editDs.sourceName" auto-complete="off" clearable :disabled="mark == 'modify'"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth" prop="sourceType">
                    <el-select size="small"  placeholder="请选择类型" v-model="editDs.sourceType" filterable>
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务类型" :label-width="formLabelWidth" prop="bizType">
                    <el-select size="small"  placeholder="请选择业务类型" v-model="editDs.bizType" filterable>
                        <el-option v-for="item in bizTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="增量类型" :label-width="formLabelWidth" prop="increaseType">
                    <el-select size="small"  placeholder="请选择增量类型" v-model="editDs.increaseType" filterable>
                        <el-option v-for="item in increaseTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="执行任务" :label-width="formLabelWidth" prop="value">
                    <el-input size="small"  v-model.trim="editDs.value" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="taskAccountId">
                    <el-select size="small"  placeholder="请选择用户名" v-model="editDs.taskAccountId" filterable>
                        <el-option v-for="item in taskAccountOption" :key="item.id" :label="item.userName" :value="item.id">
                            <span style="float: left">{{ item.accountTitle }}</span>
                            <span style="float: right;">{{ item.userName }}</span>
                        </el-option>
                    </el-select>
                    <!--<el-input size="small"  v-model.trim="editDs.userName" auto-complete="off" clearable></el-input>-->
                </el-form-item>
                <div>
                    <el-form-item label="参数" :label-width="formLabelWidth">
                        <el-input size="small"  v-model.trim="editDs.param" type="textarea" :autosize="{ minRows: 3}" clearable></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="dialogPopupVisible = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  @click="insertDs" class="c-button c-button--primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import ip from '../../model/api'
    export default {
        name: "dataSourceCenter",
        data() {
            return {
                input: '',
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                totalPages: 0,
                options: [{value:'',label:'请选择'}],
                options1: [],
                bizTypeOptions:[],
                increaseTypeOptions:[],
                value1: '',
                value2: '',
                dialogPopupVisible: false,
                isShow: false,
                sourceName:'',
                sourceType:'',
                mark: 'add',
                editDs:{
                    sourceName:'',
                    sourceType:'',
                    value:'',
                    taskAccountId:'',
                    param:'',
                    createBy:'',
                    increaseType:'',
                    bizType:''
                },
                formLabelWidth: '100px',
                updateDialogTitle:'',
                rules:{
                    sourceName:[{ required: true, message: '数据源名不能为空', trigger: 'blur'}],
                    sourceType:[{ required: true, message: '数据类型不能为空', trigger: 'blur'}],
                    increaseType:[{ required: true, message: '增量类型不能为空', trigger: 'blur'}],
                    bizType:[{ required: true, message: '业务类型不能为空', trigger: 'blur'}],
                    value:[{ required: true, message: '执行任务不能为空', trigger: 'blur' }],
                    // userName:[{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                    // password:[{ required: true, message: '密码不能为空', trigger: 'blur' }]
                },
                taskAccountOption:[]
            }
        },
        methods: {
            getAllTaskAccount(){
                var that = this
                ip.getAllTaskAccount(function(res){
                            if(res.code === 200)
                            {
                                that.taskAccountOption = res.data;
                            }
                            else if(res.code !== 404){
                                that.taskAccountOption = [];
                            }
                    })
            },
            handleSizeChange(size) {
                var that = this;
                // var tem = [];
                this.pageSize = size;
                // tem.push({name:'pageSize',value:this.pageSize},{name:'pageIndex',value:this.currentPage});
                // var condition = this.common.joinSearchParam([{name:'pageSize',value:this.pageSize},{name:'pageIndex',value:this.currentPage},{name:'sourceName',value:this.sourceName}]);
                ip.queryDsByCondition(this.common.joinSearchParam([{
                    name: 'pageSize',
                    value: this.pageSize
                }, {name: 'pageIndex', value: this.currentPage}, {
                    name: 'sourceName',
                    value: this.sourceName
                }, {name: 'sourceType', value: this.sourceType}]), function (res) {
                    if(res.data == null){
                        that.tableData = [];
                    }else{
                        that.tableData = res.data.list;
                    }
                })
            },
            handleCurrentChange(currentPage) {
                var that = this;
                // var tem = [];
                this.currentPage = currentPage;
                ip.queryDsByCondition(this.common.joinSearchParam([{
                    name: 'pageSize',
                    value: this.pageSize
                }, {name: 'pageIndex', value: this.currentPage}, {
                    name: 'sourceName',
                    value: this.sourceName
                }, {name: 'sourceType', value: this.sourceType}]), function (res) {
                    if(res.data == null){
                        that.tableData = [];
                    }else{
                        that.tableData = res.data.list;
                    }
                })
            },
            getSelectObj(obj){
                this.sourceType = obj;
            },
            getDsData(param){
                var that = this;
                var condition = '';
                var tem = [];
                this.sourceName?tem.push({name:'sourceName',value:this.sourceName}):[];
                this.sourceType||this.sourceType === 0?tem.push({name:'sourceType',value:this.sourceType}):[];
                condition = this.common.joinSearchParam(tem);
                if(param === true){
                    condition='';
                }
                ip.queryDsByCondition(condition,function(res){
                    if(res.data == null){
                        that.tableData = [];
                    }else{
                        that.tableData = res.data.list;
                        that.currentPage = res.data.pageIndex;
                        that.pageSize = res.data.pageSize;
                        that.totalRecords = res.data.totalRecords;
                        that.totalPages = res.data.totalPages;
                        if(that.totalPages<=10){
                            that.pageSize = 10;
                        }
                    }
                })
            },
            removeRow(id,rows) {
                var that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteDs(id,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getDsData(true);
                        }else{
                            that.common.messageUtil({
                                type: 'warning',
                                message: res.msg
                            });
                            that.getDsData(true);
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getSearchCondition(){
                var that = this;
                ip.getPageSearch(2,function(res){
                    res.data.sourceType.forEach(function (item,index) {
                        that.options.push({
                            value:item.code,
                            label:item.message
                        })
                    });
                    res.data.sourceType.forEach(function (item,index) {
                        that.options1.push({
                            value:item.code,
                            label:item.message
                        })
                    });
                });

                ip.getPageSearch(6,function(res){
                    res.data.bizType.forEach(function (item,index) {
                        that.bizTypeOptions.push({
                            value:item.code,
                            label:item.message
                        })
                    });
                    res.data.increaseType.forEach(function (item,index) {
                        that.increaseTypeOptions.push({
                            value:item.code,
                            label:item.message
                        })
                    });
                })




            },
            alterDataSource(id){
                var that = this;
                this.updateDialogTitle = '修改数据源';
                this.mark = 'modify';
                this.getAllTaskAccount()
                ip.queryDsById(id,function (res) {
                    if(res.code === 200){
                        that.$set(that.editDs,'id',id);
                        that.editDs.sourceName = res.data.sourceName;
                        that.editDs.sourceType =  res.data.sourceType;
                        that.editDs.value = res.data.value;
                        that.editDs.taskAccountId =  res.data.taskAccountId;
                        that.editDs.param = res.data.param;
                        that.editDs.createBy =  res.data.createBy;
                        that.editDs.bizType =  res.data.bizType;
                        that.editDs.increaseType =  res.data.increaseType;
                        that.dialogPopupVisible = true;
                        if(that.$refs.editDsForm)
                        {
                            that.$refs.editDsForm.clearValidate()
                        }
                    }else{
                        that.common.messageUtil({
                            type:'warning',
                            message:res.msg
                        })
                    }
                })
            },
            insertDs(){
                var that = this;
                this.$refs.editDsForm.validate((valid) => {
                    if (valid) {
                        if(this.mark === 'add'){
                            ip.saveDs(that.editDs,function (res) {
                                if(res.code === 200){
                                    that.common.messageUtil({
                                        type:'success',
                                        message:res.data
                                    });
                                    that.getDsData(true);
                                }
                                else{
                                    that.common.messageUtil({
                                        type:'warning',
                                        message:res.msg
                                    });
                                }
                                that.dialogPopupVisible = false;
                            })
                        }else if(this.mark === 'modify'){
                            ip.updateDs(that.editDs,function (res) {
                                if(res.code === 200){
                                    that.common.messageUtil({
                                        type:'success',
                                        message:res.data
                                    });
                                    that.getDsData(true);
                                }
                                else{
                                    that.common.messageUtil({
                                        type:'warning',
                                        message:res.msg
                                    });
                                }
                                that.dialogPopupVisible = false;
                            })
                        }
                    }
                    else{
                        return false
                    }
                })
            },
            addDialog(){
                this.updateDialogTitle = '新增数据源';
                this.mark = 'add';
                this.editDs = {};
                this.dialogPopupVisible = true;
                if(this.$refs.editDsForm)
                {
                    this.$refs.editDsForm.clearValidate()
                }
                this.getAllTaskAccount()
            }
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            this.getDsData();
        }
    }
</script>
<style scoped lang="scss">
    @import '../../assets/scss/task';
</style>
