<template>
    <div>
        <!-- <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>费率名称</div></el-col>
                <el-col :span="4"><div>费率编码</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-select size="small"  v-model="accountingName" filterable>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-input size="small"  placeholder="请输入费率编码" v-model="accountingNumber" clearable></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button size="small" @click="getRateList" class="c-button c-button--primary">查询</el-button>
                    <el-button size="small" @click="reset" class="c-button c-button--plain">重置</el-button>
                </el-col>
            </el-row>
        </div> -->
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small"  type="success" @click="accountRateUpdate" class="c-button">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    tooltip-effect="dark"
                    border>
                <el-table-column prop="id" label="记录ID"></el-table-column>
                <el-table-column prop="brandId" label="品牌"></el-table-column>
                <el-table-column prop="accountingNumber" label="费率编码"></el-table-column>
                <el-table-column prop="accountingName" label="费率名称"></el-table-column>
                <el-table-column prop="accountingValue" label="费率值(%)"></el-table-column>
                <el-table-column prop="operate" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-tooltip content="变更详情" placement="top" effect="light" popper-class="table-cell-toolTip" slot="reference" >
                            <el-button size="small"  class="c-button-icon--primary--opacity c-button-icon-circle" @click="historyDetails(scope.row.id)"><i class="fa fa-info-circle"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip" v-if="scope.row.state != 0" >
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,true)"><i class="fa fa-edit"></i></el-button>
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
        <!--新增-->
          <el-dialog  :visible.sync="accountRateDialog" class="dialogContent" width="70%">
              <div slot="title">{{accountRateDialogTitle}}</div>
            <el-form ref="rateData" :model="rateData" label-width="100px" :rules="rules">
                <el-form-item label="费率编码" class="viewFormRate" prop="accountingNumber">
                    <el-input size="small"  placeholder="请输入费率编码" v-model.trim="rateData.accountingNumber" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="费率名称" class="viewFormRate" prop="accountingName">
                    <el-input size="small"  placeholder="请输入费率名称" v-model.trim="rateData.accountingName" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="费率值(%)" class="viewFormRate" prop="accountingValue">
                    <el-input size="small"  placeholder="请输入费率值" v-model.trim="rateData.accountingValue" clearable :disabled="isChecked"></el-input>
                </el-form-item>
                <el-form-item label="品牌" class="viewFormRate" prop="brandId">
                    <el-select size="small"  v-model="rateData.brandId" filterable :disabled="isChecked">
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="(item,index) in brandIdOpt" :key="index" :label="item.englishName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效日期" class="viewFormRate" prop="startDate">
                    <el-date-picker size="small" v-model="rateData.startDate" type="date" value-format="yyyy-MM-dd" :disabled="isChecked"
                                    :picker-options="pickerDateOption" ></el-date-picker>
                </el-form-item><br>
                <el-form-item label="更新时间" v-if="accountRateId !== ''">
                    <el-input size="small"  placeholder="" v-model="rateData.modifiedTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新人" v-if="accountRateId !== ''">
                    <el-input size="small"  placeholder="" v-model="rateData.modifiedUser" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isChecked">
                <el-button size="small"  @click="accountRateDialog = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  @click="insertRate()" class="c-button c-button--primary">保存</el-button>
            </div>
          </el-dialog>
        <!--新增-->
        <!-- 变更详情 -->
        <el-dialog :visible.sync="dialogAccountRate" width="70%" title="变更详情">
            <el-table :data="dialogTableData" border>
                <el-table-column prop="fieldName" label="更新字段" min-width="60px"></el-table-column>
                <el-table-column prop="startValue" label="原值" min-width="60px"></el-table-column>
                <el-table-column prop="updateValue" label="更新值" min-width="80px"></el-table-column>
                <el-table-column prop="modifiedUser" label="更新人员" min-width="50px"></el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间" min-width="50px"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        @size-change="handleLogSizeChange"
                        @current-change="handleLogCurrentChange"
                        :current-page.sync="currentLogPage"
                        :page-size="pageLogSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalLogRecords"
                        :page-sizes="pageSizesList">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 变更详情 -->
    </div>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "accountRate",
        data() {
            let accountValue = (rule,value,callback) => {
                if(!/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('输入范围1-100以内的数值(最多支持2位小数)'));
                }else{
                    callback()
                }
            };
            return {
                accountRateId:'',
                accountRateDialog:false,
                accountRateDialogTitle:'',
                isChecked:false,
                rateData:{},
                originStartDate:null,
                brandId:null,
                originEndDate:null,
                options: [],
                currentPage: 1,
                currentLogPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                pageLogSize: 25,
                tableData: [],
                dialogTableData: [],
                totalRecords: 0,
                totalLogRecords:0,
                accountingName: '',
                accountingNumber: '',
                masterModule:'主档管理',
                subModule:'结算费率',
                operationId:'',
                userName:'one',
                dialogAccountRate:false,
                rules:{
                    accountingNumber: { required: true, message: '请输入费率编码', trigger: 'blur' },
                    accountingName: { required: true, message: '请输入费率名称', trigger: 'blur' },
                    accountingValue: [
                        { required: true, message: '请输入费率值', trigger: 'blur' },
                        { validator: accountValue }
                    ],
                    brandId: { required: true, message: '请输入品牌', trigger: 'blur' },
                    startDate: { required: true, message: '请输入生效日期', trigger: 'change' },
                },
                checkTime:false,
                brandIdOpt:[],
                pickerDateOption:{
                    disabledDate(time){
                        return time.getTime() < new Date(new Date().getTime() - 24*60*60*1000)
                    }
                },
            }
        },
        methods: {
            handleLogSizeChange(size){
                this.pageLogSize = size;
                this.getLogList()
            },
            handleLogCurrentChange(currentPage) {
                this.currentLogPage = currentPage;
                this.getLogList()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getRateList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getRateList();
            },
            checkDetail(rows,isEdit){
                let that = this;
                this.accountRateId = rows.id;
                this.isChecked = !isEdit;
                this.accountRateDialog = true;
                this.accountRateDialogTitle = isEdit ? '结算费率-编辑' : '结算费率-详情';
                if(this.$refs.rateData){
                    this.$refs.rateData.resetFields()
                }
                ip.getRateById(rows.id,res => {
                    if(res.code === 200){
                        that.rateData = res.data;
                        if(that.rateData.brandId){that.rateData.brandId = parseInt(res.data.brandId);that.brandId = parseInt(res.data.brandId)}
                        that.originStartDate = res.data.startDate;
                        //res.data.startDate < that.common.getNowFormatDate() ? that.checkTime = true : that.checkTime = false
                    }else{
                        that.common.messageUtil({
                            type:'warning',
                            message:res.msg
                        })
                    }
                })
            },
             insertRate(){
                let that = this;
                 delete this.rateData.modifiedTime;
                 delete this.rateData.modifiedUser;
                 delete this.rateData.createTime;
                 delete this.rateData.createUser;
                 let param = [
                     {
                         name:'module',
                         value: that.masterModule
                     },
                     {
                         name:'subModule',
                         value:that.subModule
                     }
                 ];
                 let tem = {
                     brandId:this.rateData.brandId,
                     startDate:this.rateData.startDate
                 };
                this.$refs.rateData.validate((valid) => {
                    if(valid){
                        if(this.accountRateId !== ''){
                            this.rateData.accountingValue = parseFloat(this.rateData.accountingValue);
                            if(this.originStartDate === this.rateData.startDate && this.brandId === this.rateData.brandId){
                                ip.updateRateById(that.common.joinSearchParam(param),that.rateData,res => {
                                    if(res.code === 200){
                                        that.common.messageUtil({
                                            type:'success',
                                            message:res.data
                                        });
                                        that.getRateList();
                                        that.accountRateDialog = false
                                    }
                                    else{
                                        that.common.messageUtil({
                                            type:'warning',
                                            message:res.msg
                                        });
                                    }
                                })
                            }else{
                                ip.checkBrandRateValidity(tem,res => {
                                    if(res.data){
                                        ip.updateRateById(that.common.joinSearchParam(param),that.rateData,res => {
                                            if(res.code === 200){
                                                that.common.messageUtil({
                                                    type:'success',
                                                    message:res.data
                                                });
                                                that.getRateList();
                                                that.accountRateDialog = false
                                            }
                                            else{
                                                that.common.messageUtil({
                                                    type:'warning',
                                                    message:res.msg
                                                });
                                            }
                                        })
                                    }else{
                                        that.common.messageUtil({
                                            type:'warning',
                                            message:'此生效日期已关联过此品牌'
                                        });
                                    }
                                })
                            }
                        }else{
                            this.rateData.accountingValue = parseFloat(this.rateData.accountingValue);
                            ip.checkBrandRateValidity(tem,res => {
                                if(res.data){
                                    ip.addRate(that.common.joinSearchParam(param),that.rateData,res => {
                                        if(res.code === 200){
                                            that.common.messageUtil({
                                                type:'success',
                                                message:res.data
                                            });
                                            that.getRateList();
                                            that.accountRateDialog = false
                                        }
                                        else{
                                            that.common.messageUtil({
                                                type:'warning',
                                                message:res.msg
                                            });
                                        }
                                    })
                                }else{
                                    that.common.messageUtil({
                                        type:'warning',
                                        message:'此生效日期已关联过此品牌'
                                    });
                                }
                            })
                        }
                    }else{
                        return false;
                    }
                });
            },
            getSearchCondition(){
                let that = this;
                ip.getRateNames(res => {that.options = res.data});
                ip.getBrandEnglishNames('?flag=3',res => {that.brandIdOpt = res.data})
            },
            getRateList(param){
                let that = this;
                let tem = [];
                let condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'accountingNumber',
                        value:this.accountingNumber
                    }
                ];
                this.accountingName||this.accountingName === 0?condition.push({name:'accountingName',value:this.accountingName}):[];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getRateList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                        that.totalRecords = 0
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords
                    }
                })
            },
            removeRow(id){
                let that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = [
                    {
                        name:'id',
                        value:id
                    },
                    {
                        name:'module',
                        value: that.masterModule
                    },
                    {
                        name:'subModule',
                        value:that.subModule
                    }];
                    ip.deleteRate(that.common.joinSearchParam(param),function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getRateList(true);
                            that.getSearchCondition()
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                            that.getRateList(true);that.reset()
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
                this.accountingName = '';
                this.accountingNumber = '';
                // this.getRateList(true);
            },
            historyDetails(operationId){
                this.pageLogSize = 10;
                this.currentLogPage = 1;
                this.operationId = operationId;
                this.dialogAccountRate = true;
                this.getLogList()
            },
            getLogList() {
                let that = this;
                let param = [
                    {
                        name: 'pageIndex',
                        value: this.currentLogPage
                    },
                    {
                        name: 'pageSize',
                        value: this.pageLogSize
                    },
                    {
                        name: 'module',
                        value: this.masterModule
                    },
                    {
                        name: 'submodule',
                        value: this.subModule
                    },
                    {
                        name: 'operationId',
                        value: this.operationId
                    }
                ];
                ip.getDataLog(this.common.joinSearchParam(param), function (res) {
                    that.dialogTableData = [];
                    that.totalLogRecords = 0;
                    if (res.code === 200) {
                        that.dialogTableData = res.data.list;
                        that.totalLogRecords = res.data.totalRecords;
                    }
                })
            },
            accountRateUpdate(){
                this.accountRateId = '';
                this.isChecked = false;
                //this.checkTime = false;
                this.accountRateDialog = true;
                this.accountRateDialogTitle = '结算费率-新增';
                if(this.$refs.rateData){
                    this.$refs.rateData.resetFields()
                }
                this.rateData = {
                    accountingNumber:'FFS',
                    accountingName:'卡券服务费结算费率'
                }
            }
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            this.getRateList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>
