<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>会计科目号</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <template>
                        <el-input size="small"
                                placeholder="请输入会计科目号"
                                v-model="subjectNum"
                                clearable>
                        </el-input>
                    </template>
                </el-col>
                <el-col :span="6">
                    <el-button size="small" type="success" @click="getAccountSubjectList" class="c-button">查询</el-button>
                    <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small"  type="success" @click="addAccountSubject('dataAccountSubject')" class="c-button">新增</el-button>
                <el-button size="small"  type="success" @click="exportAccountSubject" class="c-button"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
            </div>
            <el-table
                    :data="tableData"
                    tooltip-effect="dark"
                    border>
                <el-table-column prop="subjectType" label="科目类型"></el-table-column>
                <el-table-column prop="subjectNum" label="科目编号"></el-table-column>
                <el-table-column prop="subjectName" label="科目名称"></el-table-column>
                <el-table-column prop="subsidiaryLedger" label="子账"></el-table-column>
                <el-table-column prop="subsidiaryLedgerType" label="子账类型"></el-table-column>
                <el-table-column prop="lendDirection" label="借贷方向" width="80"></el-table-column>
                <el-table-column prop="tax" label="税率(%)" width="80"></el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间"></el-table-column>
                <el-table-column prop="modifiedUser" label="更新人" width="100"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.id,false,'dataAccountSubject')"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.id,true,'dataAccountSubject')"><i class="fa fa-edit"></i></el-button>
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
        <!-- 新增 -->
        <el-dialog :visible.sync="openDialog" width="80%" :title="accountSubTitle">
            <el-form  ref="dataAccountSubject" :model="dataAccountSubject" :rules="rules" label-width="90px">
                <el-row :gutter="20" >
                    <el-col :span="6" >
                        <el-form-item label="科目编号" prop="subjectNum">
                            <el-input size="small"  placeholder="请输入科目编号" maxlength="20" v-model="dataAccountSubject.subjectNum" clearable :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" >
                        <el-form-item label="科目名称" prop="subjectName">
                            <el-input size="small"  placeholder="请输入科目名称" maxlength="50" v-model="dataAccountSubject.subjectName" clearable :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" >
                    <el-col :span="6">
                        <el-form-item label="借贷方向" rop="lendDirection">
                            <el-select size="small"  v-model="dataAccountSubject.lendDirection" placeholder="请选择" :disabled="isDisabled" filterable>
                                <el-option v-for="item in lendDirection" :key="item.id" :label="item.dictionaryEntryName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" >
                    <el-col :span="6" >
                        <el-form-item label="科目类型" prop="subjectType">
                            <el-select size="small" @change="getSubject" v-model="dataAccountSubject.subjectType" placeholder="请选择" :disabled="isDisabled" filterable>
                                <el-option v-for="(item,index) in subjectTypeOpt" :key="index" :label="item.dictionaryEntryName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6"  v-show="subject === '资产负债类'">
                        <el-form-item label="总账冲销码">
                            <!--<el-input size="small"  placeholder="" v-model="dataAccountSubject.accountCancellationCode" clearable :disabled="isDisabled"></el-input>-->
                            <el-select size="small" v-model="dataAccountSubject.accountCancellationCode" :disabled="isDisabled">
                                <el-option value="">请选择</el-option>
                                <el-option v-for="(item,index) in generalOffCodes" :key="index" :value="item.code" :lable="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="subject === '收入类'" >
                        <el-form-item label="税率(%)">
                            <el-input size="small" placeholder="" v-model="dataAccountSubject.tax" clearable disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="subject === '破月含税统计类'">
                        <el-form-item label="破月不含税统计类科目" label-width="160px" :prop="subject === '破月含税统计类' ? 'notaxIncludeBreakenMonth' : ''" >
                            <el-select size="small"  v-model="dataAccountSubject.notaxIncludeBreakenMonth" placeholder="请选择" :disabled="isDisabled" filterable @change="changeForce">
                                <el-option v-for="(item,index) in brokeMonthWithOutTaxSubjects" :key="index" :label="item.subjectNum" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="subject === '费用类' || subject === '资产负债类'">
                        <el-form-item label="整月不含税统计科目" label-width="150px"
                                :prop="subject === '费用类' ? 'notaxIncludeWholeMonth' : ''" >
                            <el-select size="small"  v-model="dataAccountSubject.notaxIncludeWholeMonth" placeholder="请选择" :disabled="isDisabled" filterable @change="changeForce">
                                <el-option v-for="(item,index) in notaxIncludeWholeMonthOpt" :key="index" :label="item.subjectNum" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="subject === '收入类' || subject === '折扣类'">
                        <el-form-item label="整月含税统计类科目" label-width="150px" :prop="subject === '收入类' || subject === '折扣类' ? 'taxIncludeWholeMonth' : ''" >
                            <el-select size="small"  v-model="dataAccountSubject.taxIncludeWholeMonth" placeholder="请选择" :disabled="isDisabled" filterable @change="changeForce">
                                <el-option v-for="(item,index) in fullMonthWithTaxSubjects" :key="index" :label="item.subjectNum" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="subject === '收入类' || subject === '折扣类'">
                        <el-form-item label="破月含税统计类科目" label-width="150px" :prop="subject === '收入类' || subject === '折扣类' ? 'taxIncludeBreakenMonth' : ''" >
                            <el-select size="small"  v-model="dataAccountSubject.taxIncludeBreakenMonth" placeholder="请选择" :disabled="isDisabled" filterable @change="changeForce">
                                <el-option v-for="(item,index) in brokeMonthWithTaxSubjects" :key="index" :label="item.subjectNum" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="子账类型" >
                            <el-select @change="getSubsidiaryLedgerType" size="small"  v-model="dataAccountSubject.subsidiaryLedgerType" placeholder="请选择" :disabled="isDisabled" filterable>
                                <el-option :value="0" label="请选择"></el-option>
                                <el-option v-for="(item,index) in subsidiaryLedgerTypeOpt" :key="index" :label="item.dictionaryEntryName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" >
                        <el-form-item label="子账" >
                            <el-input size="small"  placeholder="" v-model="dataAccountSubject.subsidiaryLedger" clearable :disabled="isDisabled || subsidiaryLedgerDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="手工分录原因" >
                            <el-select size="small"  v-model="dataAccountSubject.reason" placeholder="请选择" :disabled="isDisabled" filterable>
                                <el-option :value="0" label="请选择"></el-option>
                                <el-option v-for="(item,index) in reason" :key="index" :label="item.dictionaryEntryName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="id!==''">
                    <el-col :span="6">
                        <el-form-item label="更新时间">
                            <el-input size="small"  placeholder="" v-model="dataAccountSubject.modifiedTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="更新人">
                            <el-input size="small"  placeholder="" v-model="dataAccountSubject.modifiedUser" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  type="success" plain @click='openDialog = false' class="c-button">取消</el-button>
                <el-button size="small"  type="success" @click="insertAccountSubject('dataAccountSubject')" class="c-button">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ip from '../../model/api'
    import  tempIp from '../../model/tempIp'
    import api from '@/model/apidr'
    export default {
        name: "accountSubject",
        data(){
            // var tax = (rule,value,callback) => {
            //     if(!/^([1-9]\d{0,1}|100)$/.test(value) && !this.common.isNullString(value)){
            //         callback(new Error('只能输入1-100的正整数'));
            //     }else{
            //         callback()
            //     }
            // };
            var subjectNum = (rule,value,callback) => {
                if(!/^[0-9.]+$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入数字和"."'));
                }else{
                    callback()
                }
            };
            return{
                id:'',
                subjectNum: '',
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                openDialog:false,
                isAdd:false,
                isDisabled:false,
                accountSubTitle:'',
                isChecked:false,
                subsidiaryLedgerDisabled:true,
                dataAccountSubject:{},
                notaxIncludeWholeMonthOpt:[],
                fullMonthWithTaxSubjects:[],
                brokeMonthWithTaxSubjects:[],
                brokeMonthWithOutTaxSubjects:[],
                // taxOpt:[],
                rules:{
                    subjectType: { required: true, message: '请选择科目类型', trigger: 'change' },
                    subjectNum: [
                        { required: true, message:'科目编号不能为空' },
                        // { validator: subjectNum, trigger: 'blur' }
                    ],
                    subjectName: { required: true, message:'科目名称不能为空' },
                    lendDirection: { required: true, message: '请选择借贷方向', trigger: 'change' },
                    // tax: { required: true, message: '请选择税率', trigger: 'change' },
                    subsidiaryLedger:{ max: 8, message: '最多输入8位字符', trigger: ['blur','change'] },
                    notaxIncludeWholeMonth:{ required: true, message: '整月不含税统计科目', trigger: 'change' },
                    taxIncludeBreakenMonth:{ required: true, message: '破月含税统计类科目', trigger: 'change' },
                    taxIncludeWholeMonth:{ required: true, message: '整月含税统计类科目', trigger: 'change' },
                    notaxIncludeBreakenMonth:{ required: true, message: '整月含税统计类科目', trigger: 'change' }
                },
                subjectTypeOpt:[],
                subjectId:0,
                subject:'收入类',
                subsidiaryLedgerTypeOpt:[],
                lendDirection:[],
                reason:[{value:'',label:'请选择'}],
                subjectNums:'',
                subjectName:'',
                generalOffCodes:[]
            }
        },

        methods:{
            changeForce(){
                this.$forceUpdate()
            },
            handleSizeChange(size){
                this.pageSize = size;
                this.getAccountSubjectList();
            },
            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.getAccountSubjectList();
            },
            checkDetail(id,isEdit,formName){
                let that = this;
                this.id = id;
                this.isAdd = false;
                this.isDisabled = !isEdit;
                this.openDialog = true;
                this.accountSubTitle = isEdit ? '会计科目主档-编辑' : '会计科目主档-详情';
                ip.getAccountingSubjectById(id, function (res) {
                    if(res.code === 200){
                        that.dataAccountSubject = res.data;
                        //处理会计科目类型，手工分录原因，子账类型和借贷方向,整月不含税统计科目
                        that.dataAccountSubject.reason = that.dataAccountSubject.reason? parseInt(that.dataAccountSubject.reason) : 0;

                        that.dataAccountSubject.subsidiaryLedgerType = that.dataAccountSubject.subsidiaryLedgerType? parseInt(that.dataAccountSubject.subsidiaryLedgerType) : 0;

                        that.dataAccountSubject.subjectType = that.dataAccountSubject.subjectType? parseInt(that.dataAccountSubject.subjectType) : that.subjectId;

                        that.getSubject(that.dataAccountSubject.subjectType);

                        that.dataAccountSubject.lendDirection = that.dataAccountSubject.lendDirection? parseInt(that.dataAccountSubject.lendDirection) : null;

                        that.dataAccountSubject.notaxIncludeWholeMonth = that.dataAccountSubject.notaxIncludeWholeMonth? parseInt(that.dataAccountSubject.notaxIncludeWholeMonth) : null;

                        that.dataAccountSubject.taxIncludeWholeMonth = that.dataAccountSubject.taxIncludeWholeMonth? parseInt(that.dataAccountSubject.taxIncludeWholeMonth) : null;

                        that.dataAccountSubject.taxIncludeBreakenMonth = that.dataAccountSubject.taxIncludeBreakenMonth? parseInt(that.dataAccountSubject.taxIncludeBreakenMonth) : null;

                        that.dataAccountSubject.notaxIncludeBreakenMonth = that.dataAccountSubject.notaxIncludeBreakenMonth? parseInt(that.dataAccountSubject.notaxIncludeBreakenMonth) : null;

                        that.subjectNums = res.data.subjectNum;
                        that.subjectName = res.data.subjectName
                    }else{
                        that.showTips(res.msg,'info')
                    }
                    that.$refs[formName].resetFields();
                })
            },
            addAccountSubject(formName){
                let that = this;
                ip.getNotaxIncludeWholeMonth(res => {that.notaxIncludeWholeMonthOpt = res.data});
                ip.getFullMonthWithTaxSubjects(res => {that.fullMonthWithTaxSubjects = res.data});
                ip.getBrokeMonthWithTaxSubjects(res => {that.brokeMonthWithTaxSubjects = res.data});
                ip.getBrokeMonthWithOutTaxSubjects(res => {that.brokeMonthWithOutTaxSubjects = res.data});
                if(this.$refs[formName] !== undefined){
                    this.$nextTick(() => {
                        that.$refs[formName].resetFields()
                    })
                }
                this.dataAccountSubject = {subjectType:this.subjectId,reason:0,subsidiaryLedgerType:0};
                this.subject = '收入类';
                this.id = '';
                this.isAdd = true;
                this.isDisabled = false;
                this.accountSubTitle = '会计科目主档-新增';
                this.openDialog = true;
            },
            getAccountSubjectList(param){
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
                        name:'subjectNum',
                        value:this.subjectNum
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getAccountingSubjectList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                        that.totalRecords = 0;
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            removeRow(id) {
                let that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteAccountingSubject(id,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getAccountSubjectList(true);
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                            that.getAccountSubjectList(true);
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
                this.subjectNum = ''
            },
            exportAccountSubject(){
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
                        name:'subjectNum',
                        value:this.subjectNum
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                window.location.href = tempIp.master_ip + '/accountingSubject/export'+tem;
            },
            getSearchCondition(){
                let that = this;
                ip.getDictionaryByNumber('ACCOUNTSUBJECTTYPE',res => {
                    that.subjectTypeOpt = res.data;
                    that.subjectTypeOpt.forEach(item => {if(item.dictionaryEntryName === '收入类'){that.subjectId = item.id}})
                });
                ip.getDictionaryByNumber('CHILDACCOUNT',res => {that.subsidiaryLedgerTypeOpt = res.data});
                ip.getDictionaryByNumber('LENDDIRECTION',res => {that.lendDirection = res.data});
                ip.getDictionaryByNumber('MANUALACCOUNTINGREASON',res => {that.reason = res.data});
                ip.getNotaxIncludeWholeMonth(res => {that.notaxIncludeWholeMonthOpt = res.data});
                ip.getFullMonthWithTaxSubjects(res => {that.fullMonthWithTaxSubjects = res.data});
                ip.getBrokeMonthWithTaxSubjects(res => {that.brokeMonthWithTaxSubjects = res.data});
                ip.getBrokeMonthWithOutTaxSubjects(res => {that.brokeMonthWithOutTaxSubjects = res.data});
            },
            insertAccountSubject(formName){
                let that = this;
                delete this.dataAccountSubject.modifiedTime;
                delete this.dataAccountSubject.modifiedUser;
                delete this.dataAccountSubject.createUser;
                if(this.subject === '破月不含税统计类' || this.subject === '整月不含税统计类'){
                    this.dataAccountSubject.notaxIncludeWholeMonth = null
                }
                if(this.subject !== '收入类'){
                    this.dataAccountSubject.tax = null
                }
                if(this.subject !== '资产负债类'){
                    this.dataAccountSubject.accountCancellationCode = null
                }
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        if(!that.isAdd){
                            if(that.subjectNums === that.dataAccountSubject.subjectNum && that.subjectName === that.dataAccountSubject.subjectName){
                                ip.updateAccountingSubject(that.dataAccountSubject,function (res) {
                                    res.code === 200 ? (that.showTips(res.data,'success'),that.getAccountSubjectList()) : that.showTips(res.msg,'warning');
                                });
                                that.openDialog = false;
                            }else if(that.subjectNums !== that.dataAccountSubject.subjectNum && that.subjectName === that.dataAccountSubject.subjectName){
                                ip.checkAccountingSubjectNum(that.dataAccountSubject.subjectNum,res => {
                                    if(res.data){
                                        ip.updateAccountingSubject(that.dataAccountSubject,function (res) {
                                            res.code === 200 ? (that.showTips(res.data,'success'),that.getAccountSubjectList()) : that.showTips(res.msg,'warning');
                                        });
                                        that.openDialog = false;
                                    }else{
                                        that.showTips('科目编号重复','info')
                                    }
                                })
                            }else if(that.subjectName !== that.dataAccountSubject.subjectName && that.subjectNums === that.dataAccountSubject.subjectNum){
                                // ip.checkAccountingSubjectName(that.dataAccountSubject.subjectName,res => {
                                //     if(res.data){
                                        ip.updateAccountingSubject(that.dataAccountSubject,function (res) {
                                            res.code === 200 ? (that.showTips(res.data,'success'),that.getAccountSubjectList()) : that.showTips(res.msg,'warning');
                                        });
                                        that.openDialog = false;
                                    // }else{
                                    //     that.showTips('科目名称重复','info')
                                    // }
                                // })
                            }else{
                                // ip.checkAccountingSubjectName(that.dataAccountSubject.subjectName,res => {
                                //     if(res.data){
                                        ip.checkAccountingSubjectNum(that.dataAccountSubject.subjectNum,res => {
                                            if(res.data){
                                                ip.updateAccountingSubject(that.dataAccountSubject,function (res) {
                                                    res.code === 200 ? (that.showTips(res.data,'success'),that.getAccountSubjectList()) : that.showTips(res.msg,'warning');
                                                });
                                                that.openDialog = false;
                                            }else{
                                                that.showTips('科目编号重复','info')
                                            }
                                        })
                                //     }else{
                                //         that.showTips('科目名称重复','info')
                                //     }
                                // })
                            }
                        }else {
                            // ip.checkAccountingSubjectName(that.dataAccountSubject.subjectName,res => {
                            //     if(res.data){
                                    ip.checkAccountingSubjectNum(that.dataAccountSubject.subjectNum,res => {
                                        if(res.data){
                                            ip.addAccountingSubject(that.dataAccountSubject,function (res) {
                                                res.code === 200 ? (that.showTips(res.data,'success'),that.getAccountSubjectList()) : that.showTips(res.msg,'warning');
                                            });
                                            that.openDialog = false;
                                        }else{
                                            that.showTips('科目编号重复','info')
                                        }
                                    })
                            //     }else{
                            //         that.showTips('科目名称重复','info')
                            //     }
                            // })
                        }
                    }else {
                        return false;
                    }
                })
            },
            showTips(text,type){this.common.messageUtil({message:text, type:type})},
            getSubsidiaryLedgerType(val){
                let _self = this;
                if(val === 372){
                    this.$set(_self.dataAccountSubject,'subsidiaryLedger','客户');
                    this.subsidiaryLedgerDisabled = true
                }else if(val === 370){
                    this.$set(_self.dataAccountSubject,'subsidiaryLedger','餐厅');
                    this.subsidiaryLedgerDisabled = true
                }else if(val === 371){
                    this.$set(_self.dataAccountSubject,'subsidiaryLedger',null);
                    this.subsidiaryLedgerDisabled = false
                }
            },
            getSubject(val){
                let obj = this.subjectTypeOpt.find(item => {return item.id === val});
                this.subject = obj.dictionaryEntryName
            },
            getGeneralOffCodes(){
                let that = this;
                api.getGeneralOffCodeList(function(res){
                    that.generalOffCodes = res.data||[];
                })
            }
        },
        beforeMount(){
            this.getSearchCondition();
            this.getGeneralOffCodes();
        },
        mounted(){
            this.getAccountSubjectList()
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>
