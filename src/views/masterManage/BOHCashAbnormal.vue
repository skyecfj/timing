<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>BOH现金项目</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-select size="small" v-model="accountSubject" placeholder="请选择BOH现金项目" @change="getSelectObj" filterable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-button size="small" type="success" @click="getBOHList" class="c-button">查询</el-button>
                    <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small" type="success" @click="updateBOH" class="c-button">新增</el-button>
            </div>
            <el-table :data="tableData" tooltip-effect="dark" border>
                <el-table-column prop="accountSubject" label="BOH现金项目"></el-table-column>
                <el-table-column prop="ruleName" label="规则名称"></el-table-column>
                <el-table-column prop="ruleTypeStr" label="类型"></el-table-column>
                <el-table-column prop="operate" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-tooltip content="变更详情" placement="top" effect="light" popper-class="table-cell-toolTip" slot="reference" >
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="BOHDetails(scope.row.id)"><i class="fa fa-info-circle"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,true)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
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
         <el-dialog :visible.sync="BOHCashAbnormalDialog" class="dialogContent" width="70%">
            <div slot="title">{{BOHCashAbnormalTitle}}</div>
            <el-form :model="BOHCashData" ref="BOHCashData" label-width="110px" :rules="rules" class="viewForm">
                <div class="BOHContent" v-for="(item,itemIndex) in BOHCashData.list" :key="itemIndex">
                    <el-form-item
                            label="BOH现金项目"
                            :prop="'list.' +itemIndex+'.accountSubject'"
                            :rules="rules.accountSubject">
                        <el-select size="small"  v-model="item.accountSubject" placeholder="请选择项目名称" :disabled="isChecked">
                            <el-option v-for="item in BOHCash" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则名称"  :prop="'list.' +itemIndex+'.ruleName'"  :rules="rules.ruleName">
                       <el-input size="small" clearable :placeholder="isChecked ? '' :'请输入异常规则名称'"
                       v-model.trim="item.ruleName" :disabled="isChecked" maxlength="25"></el-input>
                    </el-form-item>
                    <el-form-item label="类型"   :prop="'list.' +itemIndex+'.ruleType'" :rules="rules.ruleType">
                        <el-select size="small"  v-model="item.ruleType" :placeholder="isChecked ? '' : '请选择类型'"
                         :disabled="isChecked" @change="changeRuleType">
                            <el-option v-for="item in ruleTypeOptions " :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="正常最小阈值" :prop="'list.' +itemIndex+'.minValue'" :rules="rules.minValue">
                       <el-input size="small" clearable :placeholder="(isChecked || isMinMaxAble) ? '' : '请输入正常最小阈值'"
                       v-model.trim="item.minValue" :disabled="isChecked || isMinMaxAble"></el-input>
                    </el-form-item>
                    <el-form-item label="正常最大阈值" :prop="'list.' +itemIndex+'.maxValue'" :rules="rules.maxValue">
                       <el-input size="small" clearable :placeholder="(isChecked || isMinMaxAble) ? '' : '请输入正常最大阈值'"
                       v-model.trim="item.maxValue" :disabled="isChecked || isMinMaxAble"></el-input>
                    </el-form-item>
                    <div>
                        <span class="warningTip">*不在阈值范围内（含）的则为异常数据</span>
                    </div>
                </div>
                <el-form-item label="更新时间" v-if="id !== ''">
                    <el-input size="small" placeholder="" v-model="BOHCashData.list[0].modifiedTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新人" v-if="id !== ''">
                    <el-input size="small" placeholder="" v-model="BOHCashData.list[0].modifiedUser" disabled></el-input>
                </el-form-item>
                <div class="BOHButton" v-if="!isChecked">
                    <el-form-item>
                        <el-button size="small" type="success" plain @click='BOHCashAbnormalDialog = false' class="c-button">取消</el-button>
                        <el-button size="small" type="success" @click="save" class="c-button">保存</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>

        <!--新增-->
        <!-- 变更详情 -->
        <el-dialog :visible.sync="dialogBOHCash" width="70%" title="变更详情">
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
    //弹框
    const defalutRules = {
        ruleCondition:'',
        symbol:'>',
        value:''
    };
    const defalutList = {
        list:[
            {
                accountSubject: "",
                id:'',
                maxValue:'',
                minValue:'',
                ruleName:''
            }
        ]

    };
    export default {
        name: "BOHCashAbnormal",
        data() {
            var validValue = (rule, value, callback) => {
                var minValue = this.BOHCashData.list[0].minValue
                var maxValue = this.BOHCashData.list[0].maxValue
                if (this.BOHCashData.list[0].ruleType == 0 && this.common.isNullString(minValue) && this.common.isNullString(maxValue)) {
                    callback(new Error('最小阈值和正常阈值至少有一个不为空'));
                }else if(!this.common.isNullString(minValue) && !this.common.isNullString(maxValue) && minValue > maxValue){
                    callback(new Error('最小阈值不能大于最大阈值'));
                }
                else{
                    callback()
                }
           };
        var validMinValue = (rule, value, callback) => {
                var minValue = this.BOHCashData.list[0].minValue
                if (this.BOHCashData.list[0].ruleType == 0 && !this.common.isNullString(minValue) && !/^((\-?)[1-9]\d{0,7}|0)(\.\d{1,2})?$/.test(minValue)) {
                    callback(new Error('最多输入8位数字,最多保留两位小数'));
                }else{
                    callback()
                }
           };

           var validMaxValue = (rule, value, callback) => {
                var maxValue = this.BOHCashData.list[0].maxValue
                if (this.BOHCashData.list[0].ruleType == 0 && !this.common.isNullString(maxValue) && !/^((\-?)[1-9]\d{0,7}|0)(\.\d{1,2})?$/.test(maxValue)) {
                    callback(new Error('最多输入8位数字,最多保留两位小数'));
                }else{
                    callback()
                }
           };

            return {
                id:'',
                masterModule: '主档管理',
                subModule: 'BOH现金项目异常配置',
                options: [{value:'',label:'请选择'}],
                dialogTableData: [],
                currentPage: 1,
                currentLogPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                pageLogSize: 25,
                tableData: [],
                totalRecords: 0,
                totalLogRecords: 0,
                accountSubject: '',
                dialogBOHCash:false,
                //弹框
                accountSubjectName:'',
                BOHCashAbnormalDialog:false,
                BOHCashAbnormalTitle:'',
                isChecked:false,
                isAdd:'',
                rules:{
                    accountSubject:[{required: true, message: '项目名称不能为空', trigger: 'blur'}],
                    ruleName:[{required: true, message: '异常规则名称不能为空', trigger: 'blur'}],
                    ruleType:[{required: true, message: '类型不能为空', trigger: 'blur'}],
                    minValue:[ { validator: validValue, trigger: 'blur'},
                               { validator: validMinValue, trigger: 'blur'}],
                    maxValue:[ { validator: validValue, trigger: 'blur'},
                               { validator: validMaxValue, trigger: 'blur'}]
                },
                BOHCashData:Object.assign({},defalutList),
                BOHCash: [],
                andOr: [
                    {
                        value:'且',
                        label:'且'
                    },
                    {
                        value:'或',
                        label:'或'
                    }
                ],
                signItem:'',
                sign: [
                    {
                        value:'>',
                        label:'>'
                    },
                    {
                        value:'>=',
                        label:'>='
                    },
                    {
                        value:'<',
                        label:'<'
                    },
                    {
                        value:'<=',
                        label:'<='
                    },
                    {
                        value:'=',
                        label:'='
                    }
                ],
                BOHId: '',
                ruleTypeOptions:[],
                isMinMaxAble:false
            }
        },
        methods: {
            handleLogSizeChange(size){
                this.pageLogSize = size;
                this.getDataLog()
            },
            handleLogCurrentChange(currentPage) {
                this.currentLogPage = currentPage;
                this.getDataLog()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getBOHList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getBOHList();
            },
            getSelectObj(obj){
                this.accountSubject = obj;
            },
            changeRuleType(val){
               if(val == 0){
                   this.isMinMaxAble = false
               }else{
                   this.isMinMaxAble = true
                   this.$set(this.BOHCashData.list[0],'minValue','')
                   this.$set(this.BOHCashData.list[0],'maxValue','')
               }
            },
            getRuleType(){
                var that = this
                that.ruleTypeOptions = []
                ip.getBOHRuleType(function(res){
                   for(var index in res.data){
                       that.ruleTypeOptions.push({
                           value:parseInt(index),
                           label:res.data[index]
                       })
                   }
                })
            },
            checkDetail(rows,isEdit){
                var that = this;
                this.id = rows.id;
                this.isAdd = false;
                this.isChecked = !isEdit;
                this.BOHCashAbnormalDialog = true;
                this.BOHCashAbnormalTitle = isEdit ? 'BOH现金项目异常配置-编辑' : 'BOH现金项目异常配置-详情';
                if(this.$refs.BOHCashData){
                    this.$refs.BOHCashData.resetFields()
                }
                this.BOHCashData = Object.assign({},defalutList)
                this.getRuleType()
                ip.getBOHById(rows.id,function (res) {
                    if(res.code === 200){
                        that.BOHCashData.list = [];
                        that.BOHCashData.list.push(res.data);
                        that.accountSubjectName = that.BOHCashData.list[0].accountSubject;
                        that.changeRuleType(that.BOHCashData.list[0].ruleType)
                    }else{
                        that.common.messageUtil({
                            type:'info',
                            message:res.msg
                        })
                    }
                })
            },
            updateBOH(index,rows){
                this.id = '';
                this.isAdd = true;
                this.isChecked = false;
                this.BOHCashAbnormalDialog = true;
                this.BOHCashAbnormalTitle = 'BOH现金项目异常配置-新增';
                this.isMinMaxAble = false
                if(this.$refs.BOHCashData){
                    this.$refs.BOHCashData.resetFields()
                }
                this.BOHCashData = Object.assign({},defalutList)
                this.getRuleType()
            },
            getSearchCondition(){
                var that = this;
                ip.getBOHNames(function (res) {
                    res.data.forEach(function (item,index) {
                        that.options.push({
                            value:item,
                            label:item
                        })
                    })
                });
                ip.getBohProject(function (res) {
                    res.data.forEach(function (item,index) {
                        that.BOHCash.push({
                            value:item,
                            label:item
                        })
                    })
                })
            },
            getBOHList(param){
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
                    }
                ];
                this.accountSubject||this.accountSubject === 0?condition.push({name:'accountSubject',value:encodeURIComponent(this.accountSubject)}):[];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getBOHList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            removeRow(id){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'module',
                        value:this.masterModule
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
                    ip.deleteBOH(tem,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getBOHList(true);
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                            that.getBOHList(true);
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
                this.accountSubject = '';
            },
            BOHDetails(id){
                this.operationId = id;
                this.dialogBOHCash = true;
                this.getDataLog()
            },
            getDataLog(){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'module',
                        value:this.masterModule
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
                    that.dialogTableData = [];
                    that.totalLogRecords = 0;
                    if(res.code === 200){
                        that.dialogTableData = res.data.list;
                        that.totalLogRecords = res.data.totalRecords
                    }
                })
            },
            //弹框
            BOHAddRow(itemIndex){
                this.BOHCashData.list[itemIndex].rules.push(Object.assign({},defalutRules))
            },
            BOHDeleteRow(itemIndex,listIndex){
                this.BOHCashData.list[itemIndex].rules.splice(listIndex,1)
            },
            save(){
                var that = this;
                var pathParam = [{
                    name:'module',
                    value: this.masterModule
                },{
                    name:'subModule',
                    value:this.subModule
                }];
                var conditionParam = {};
                // if(this.BOHCashData.list[0].rules.length === 1){delete this.BOHCashData.list[0].rules[0].ruleCondition}
                this.$refs.BOHCashData.validate((valid) => {
                    if (valid) {
                        if(that.isAdd){
                            ip.checkAccountSubject(that.BOHCashData.list[0].accountSubject,res=>{
                                if(res.data){
                                    ip.addBOH(that.common.joinSearchParam(pathParam),that.BOHCashData.list,function(res){that.showTips(res)})
                                }else{
                                    that.common.messageUtil({
                                        type: 'info',
                                        message: 'BOH现金项目名重复'
                                    });
                                }
                            });
                        }else{
                            conditionParam = {
                                accountSubject:that.BOHCashData.list[0].accountSubject,
                                id:that.BOHCashData.list[0].id,
                                maxValue:that.BOHCashData.list[0].maxValue,
                                minValue:that.BOHCashData.list[0].minValue,
                                ruleName:that.BOHCashData.list[0].ruleName,
                                ruleType:that.BOHCashData.list[0].ruleType
                            };
                            if(that.accountSubjectName === that.BOHCashData.list[0].accountSubject){
                                ip.updateBOHById(that.common.joinSearchParam(pathParam),conditionParam,function(res){that.showTips(res)})
                            }else{
                                ip.checkAccountSubject(that.BOHCashData.list[0].accountSubject,res=>{
                                    if(res.data){
                                        ip.updateBOHById(that.common.joinSearchParam(pathParam),conditionParam,function(res){that.showTips(res)})
                                    }else{
                                        that.common.messageUtil({
                                            type: 'info',
                                            message: 'BOH现金项目名重复'
                                        });
                                    }
                                })
                            }
                        }
                    }else{
                        return false
                    }
                })
            },
            showTips(res){
                var that = this;
                if(res.code === 200){
                    that.common.messageUtil({
                        type: 'success',
                        message: res.data
                    });
                    that.getBOHList();
                    that.BOHCashAbnormalDialog = false
                }else{
                    that.common.messageUtil({
                        type: 'warning',
                        message: res.msg
                    });
                }
            }
        },

        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            this.getBOHList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
    .warningTip{
        color: #E6A23C;
        font-size: 12px;
        margin-left: 20px;
    }
</style>
