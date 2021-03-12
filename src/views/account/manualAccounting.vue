<!--手工分录-->
<template>
  <div>
    <!-- form -->
    <div class="content" >
        <div v-show="selectedRows.length < 1 && !this.voucherId && source != 'leftMenu'"  class="float-right upload-btn" >
            <el-button type="text" @click="upload('accountingData')" ><i class="el-icon-upload"></i>上传手工分录数据</el-button>
            <el-button type="text" @click="upload('attachmentFile')" ><i class="el-icon-upload"></i>上传附件</el-button>
        </div>
        <div v-show="this.voucherId && source != 'leftMenu'"  class="float-right upload-btn" >
            <el-button type="text" @click="upload('attachmentFile')" ><i class="el-icon-upload"></i>上传附件</el-button>
            <el-button v-if="accountConfigForm.filePath && accountConfigForm.filePath != '0'" type="text" @click="downloadAttachmentFile()" ><i class="el-icon-download"></i>下载附件</el-button>
        </div>
        <div v-show="source == 'leftMenu'"  class="float-right upload-btn" >
            <el-button type="text" @click="upload('voucher')" ><i class="el-icon-upload"></i>上传凭证</el-button>
            <el-button type="text" @click="upload('attachmentFile')" ><i class="el-icon-upload"></i>上传附件</el-button>
        </div>
        
        <div v-show="selectedRows.length > 0 && !this.voucherId"  class="float-right" >
           <span>汇总金额：{{formaSelectedDiffAmountSum}}</span>
        </div>
        <el-form ref="accountConfigForm" :model="accountConfigForm" :rules="accountConfigRules" :inline=true label-position="top"  >
            <el-row>
                <el-col :span="3" >
                    <el-form-item label="业务类型" prop="businessType" :rules="source == 'leftMenu'? [{ required: true, message: '请选择业务类型', trigger: 'change' }] : []" >
                        <el-select  size="small"  v-model="accountConfigForm.businessType" placeholder="业务类型" 
                                    :disabled="source != 'leftMenu'" @change="getVoucherOpts" >
                            <el-option v-for="item in optMap[key = 'BUSINESSTYPEFORCHECK']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" >
                    <el-form-item label="子业务类型" prop="accountVoucherCode" >
                        <el-select size="small" filterable v-model="accountConfigForm.accountVoucherCode" placeholder="子业务类型" >
                            <el-option v-for="item in voucherOpts" :key="item.id" :label="item.instruction" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="4" >
                    <el-form-item label="凭证说明" prop="voucherDesc" >
                        <el-input size="small"  v-model.trim="accountConfigForm.voucherDesc" placeholder="凭证说明" ></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :span="2" >
                    <el-form-item label="账套" prop="accountMode" >
                        <el-select size="small"  v-model="accountConfigForm.accountMode" placeholder="账套">
                            <el-option v-for="item in optMap[key = 'ACCOUNTSET']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3" >
                    <el-form-item label="法人公司" prop="company" >
                        <el-select size="small"  v-model="accountConfigForm.company" placeholder="法人公司" @change="setStartDate" >
                            <el-option v-for="item in companyOpts" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5" >
                    <el-form-item label="总账日期" prop="generalDate" >
                        <el-date-picker v-model="accountConfigForm.generalDate" type="date"
                            value-format="yyyy-MM-dd" placeholder="总账日期" :picker-options="pickerOptionsStart"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="3" >
                    <el-form-item label="JDE账务模块" prop="jdeAccountModule" >
                        <el-select size="small"  v-model="accountConfigForm.jdeAccountModule" placeholder="JDE账务模块">
                            <el-option v-for="item in optMap[key = 'JDEACCOUNTMODULE']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5" >
                    <el-form-item label="原因" prop="reason" >
                        <el-select size="small" v-model="accountConfigForm.reason" placeholder="原因" @visible-change="resonSetBack = false;" >
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'MANUALACCOUNTINGREASON']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="凭证说明" prop="remark">
                        <el-input type="textarea" placeholder="凭证说明" v-model.trim="accountConfigForm.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>

    <!--body-->
    <div class="content" >
        <el-table :data="accountConfigForm.detailDtoList" max-height="256" border >
            <el-table-column prop="bu" label="BU" column-key="BU" :formatter="renderTblData" ></el-table-column>
            <el-table-column prop="subjectNum" label="会计科目" :formatter="renderSubject" ></el-table-column>
            <el-table-column prop="subsidiaryLedgerTypeDesc" label="子账类型"></el-table-column>
            <el-table-column prop="subsidiaryLedger" label="子账" ></el-table-column>
            <el-table-column prop="abstractInfo" label="备注" ></el-table-column>
            <el-table-column prop="amount" label="金额" ></el-table-column>
            <el-table-column prop="currency" label="币种" ></el-table-column>
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope" >
                    <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="getSubjectDetail(scope.row,scope.$index)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                    </el-tooltip>
                    <el-tooltip v-if="accountConfigForm.detailDtoList.length > 2" content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteSubject(scope.$index)"><i class="fa fa-trash-alt"></i></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-button size="small"  class="full-btn border-dashed" @click="newSubject" ><i class="el-icon-plus" ></i></el-button>
        </el-row>
    </div>

    <div class="btn-group txt-right" >
        <el-button size="small"  @click="cancel" >取消</el-button>
        <el-button size="small"  type="primary" @click="saveAccountConfig" >保存</el-button>
    </div>

    <!-- dialog -->
    <el-dialog :title="dialogConfig.title" :visible.sync="dialogConfig.isVisible" >
        <el-form :model="subjectSubmit" ref="subjectSubmit" :rules="subjectRules" :inline="true" label-width="85px" >
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="BU" prop="bu" >
                        <el-select size="small"  v-model="subjectSubmit.bu" >
                            <el-option v-for="item in companyOpts" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="科目" prop="subjectNum" >
                        <el-select size="small" filterable v-model="subjectSubmit.subjectNum" @change="changeSubject" >
                            <el-option v-for="item in subjects" :key="item.id" :label="item.subjectName + '--' + item.subjectNum" :value="item.subjectNum">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="子账类型" prop="subsidiaryLedgerTypeDesc" >
                        <el-select size="small"  v-model="subjectSubmit.subsidiaryLedgerTypeDesc" @change="changeSubsidiaryLedgerType" >
                            <el-option v-for="item in optMap[key = 'CHILDACCOUNT']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName" >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="子账" prop="subsidiaryLedger" >
                        <el-input size="small"  v-model.trim="subjectSubmit.subsidiaryLedger" :maxlength="subjectSubmit.subsidiaryLedgerTypeDesc == 'X'? 8 : null" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="备注" prop="abstractInfo" >
                        <el-input size="small"  v-model.trim="subjectSubmit.abstractInfo" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                     <el-form-item label="币种" prop="currency" >
                        <el-input size="small"  v-model.trim="subjectSubmit.currency" disabled ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="金额" prop="amount" >
                        <el-input size="small"  v-model.number="subjectSubmit.amount" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" >
            <el-button size="small"  @click="dialogConfig.isVisible = false; $refs['subjectSubmit'].resetFields();" >取消</el-button>
            <el-button size="small"  type="primary" @click="addSubjectItem" >确定</el-button>
        </div>
    </el-dialog>

    <!--上传文件-->
    <el-dialog :visible.sync="importOpreDialog" class="dialogContent" width="40%"   :title="uploadDialogTitle" :close-on-click-modal='false'>
        <div  class="loadFileContent" v-loading="loadFile">
            <el-upload  :action="importUrl"  ref="importCommodity"
                        :file-list="fileList" 
                        :on-change="handleChange"
                        :auto-upload="false"
                        :before-upload="beforeFileUpload"
                        :on-remove="removeFile"
                        :on-error="uploadError"
                        :on-success="uploadSuccess"
                        accept=".xlsx" >
                <el-button class="c-button c-button--primary">{{uploadDialogTitle}}</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls/xlsx格式文件,且不超过50M</div>
            </el-upload>
            <div slot="footer" class="dialog-footer txt-right">
                <el-button size="small"  @click="cancelUpload" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  type="primary" @click="importCommodity" class="c-button c-button--primary" :disabled="uploadDisabled">确定</el-button>
            </div>
        </div>
    </el-dialog>

  </div>
</template>
<script>
    import checkResultsUtil from '../../utils/checkResultsUtil'
    import floatObj from '../../utils/floatObj'
    import api from '../../model/api'
    import ip from '../../model/tempIp'
	export default {
    name:'manualAccountingCheck',
    props : ['source'],
    activated(){
        let params  = window.localStorage.manualAccountingParams;
        if(this.source != 'leftMenu' && params !== this.stashParams){
            let storage = window.localStorage;
            let params  = JSON.parse(storage.manualAccountingParams);
            this.resetForm(params);
            this.accountConfigForm.businessType = params.businessType;
            this.selectedRows   = params.selectData;
            this.manualDescType = params.type;
            this.detailType = params.detailType;
            this.activeTabType = params.activeTabType;
            this.voucherId = params.voucherId;
            if(params.voucherId){
                this.firstLoad = true;
                this.getVoucherDetail();
            };
            if(this.selectedRows.length > 0){
                this.countTotalSelectedAmount();
            }
        };
        if(this.source == 'leftMenu'){
            this.accountConfigForm.businessType = '';
            this.accountConfigForm = Object.assign({},{
                businessType : '',
                accountMode : '',
                accountVoucherCode : '',
                voucherDesc : '',
                company : '',
                jdeAccountModule : '',
                ids : [],
                generalDate : '',
                detailDtoList : [],
                reason : ''
            })
        }
        console.log('tblType=============='+this.manualDescType);
        console.log('selectedSum=================='+this.selectDiffAmountSum);
    },
    deactivated(){
        let params  = window.localStorage.manualAccountingParams? window.localStorage.manualAccountingParams : {};
        this.stashParams = params;
    },
    created(){},
    beforeMount(){
        let storage = window.localStorage;
        let params  = storage.manualAccountingParams ? JSON.parse(storage.manualAccountingParams) : {};
        this.voucherId = params.voucherId;
        if(params.voucherId && this.source != 'leftMenu'){
            this.firstLoad = true;
            this.getVoucherDetail();
        }
        this.getDictionaryOptions();
        this.getSelectOpts();
        this.getVoucherOpts();
        this.countTotalSelectedAmount();
    },
    mounted(){
        
        //console.logconsole.log('selectData=====' + params.selectData.length);
    },
    data() {
        return {
            floatObj : floatObj,
            stashParams : '',
            firstLoad   : false,
            voucherId   : '',
            manualDescType : '',
            selectDiffAmountSum : 0,
            formaSelectedDiffAmountSum : '',
            accountConfigForm: {
                businessType : '',
                accountMode : '',
                accountVoucherCode : '',
                voucherDesc : '',
                company : '',
                jdeAccountModule : '',
                ids : [],
                generalDate : '',
                detailDtoList : [],
                reason : ''
            },
            resonSetBack : false,
            accountConfigRules:{
                accountVoucherCode: [
                    { required: true, message: '请选择凭证说明', trigger: 'change' }
                ],
                accountMode: [
                    { required: true, message: '请选择账套', trigger: 'change' }
                ],
                company: [
                    { required: true, message: '请选择法人公司', trigger: 'change' }
                ],
                generalDate: [
                    { required: true, message: '请选择总账日期', trigger: 'change' }
                ],
                jdeAccountModule: [
                    { required: true, message: '请选择JDE账务模块', trigger: 'change' }
                ]
            },
            voucherOpts : [],
            companyOpts : [],
            pickerOptionsStart: {},
            startDate : null,
            dialogConfig: {
                isVisible : false,
                title : '科目配置',
                type  : '',
                index : null
            },
            subjects: [],
            //数据字典中配置的字段
            optFromDic : ['BUSINESSTYPEFORCHECK','ACCOUNTSET','JDEACCOUNTMODULE','LENDDIRECTION','CHILDACCOUNT','MANUALACCOUNTINGREASON'],
            optMap: {},
            subjectSubmit : {
                subsidiaryLedgerTypeDesc : null,
                subsidiaryLedger : '',
                currency : 'CNY'
            },
            subjectRules: {
                subjectNum : [
                    { required: true, message: '请选择科目', trigger: 'change' }
                ],
                amount : [
                    { required: true, message: '请输入金额', trigger: 'blur' },
                    { type: 'number', message: '请输入正确的金额' },
                ],
                abstractInfo: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            selectedRows : [],
            reasonSubjectsObj : {},
            importOpreDialog  : false,
            attachFileUrl : '',
            uploadType : '',
            uploadDialogTitle : '',
            fileList  :  [],
            importUrl : '',
            uploadDisabled : true,
            loadFile  : false,
            isTimeOut : false,
            tempDesc  : ''
        }
    },
    computed: {
        reason() {
    　　　　return this.accountConfigForm.reason
    　　}
    },
    watch : {
        startDate(val,oldVal){
            this.pickerOptionsStart = Object.assign({},this.pickerOptionsEnd,{
                disabledDate: (time) => {
                    return time.getTime() < val;
                }
            });
        },
        reason(newValue, oldValue) {
            if(!this.resonSetBack){
                this.changeReason(oldValue);
            }
　　    }
    },
    methods: {
        //关闭当前页
        cancel(){
            this.common.deleteTag(this.$route,this);
        },
        resetForm(params){
            this.accountConfigForm = Object.assign({},{
                businessType : '',
                accountMode : '',
                accountVoucherCode : '',
                voucherDesc : '',
                company : '',
                jdeAccountModule : '',

                ids : [],
                generalDate : '',
                detailDtoList : [],
                reason : ''
            });
            this.$refs['accountConfigForm'].resetFields();
            this.accountConfigForm.businessType = params.businessType;
            this.selectedRows   = params.selectData;
            this.manualDescType = params.type;
            this.detailType = params.detailType;
            this.activeTabType = params.activeTabType;
            this.voucherId = params.voucherId;
            this.selectDiffAmountSum = 0;
        },
        //处理表单数据
        renderTblData(row,column,cellValue,index){
            let _self = this;
            let actCellVal = '';
            if(this.optMap[column.columnKey]){
                this.optMap[column.columnKey].forEach(function(item,index){
                    if(cellValue == item.dictionaryEntryName){
                        actCellVal = item.dictionaryEntryName;
                    }
                })
            }
            if(column.columnKey == 'BU'){
                this.companyOpts.forEach(function(item,index){
                    if(cellValue == item.value){
                        actCellVal = item.label;
                    }
                })
            }
            return actCellVal;
        },
        getVoucherDetail(){
            let _self = this;
            api.getBBCManualVoucherDetail(this.voucherId,function(res){
                if(res.code == 200){
                    _self.accountConfigForm = Object.assign(_self.accountConfigForm,res.data);
                    _self.accountConfigForm.reason = '';
                    _self.resonSetBack = true;
                    let param = _self.common.formatPathParam({
                        companyJdeCode : _self.accountConfigForm.company
                    });
                    api.getStartDate(param,function(res){
                        _self.startDate = res.data;
                    });
                    //_self.setCompany();
                }else{
                    _self.common.messageUtil({
                        type: 'warning',
                        message: res.msg
                    });
                }
            })
        },
        //加载list中的科目
        renderSubject(row,column,cellValue,index){
            let _self = this;
            let subjectOpj = {};
            this.subjects.forEach(function(item,index){
                if(row.subjectNum == item.subjectNum){
                    subjectOpj = item;
                }
            });
            return subjectOpj.subjectName;
        },
        //获取数据字典中的配置项
        getDictionaryOptions(){
            let _self = this;

            this.optFromDic.forEach(function(item,index){
                api.getDictionaryByNumber(item,function(res){
                    _self.optMap[item] = Object.assign([],res.data);
                })
            })
        },
        //获取下拉框选项
        getSelectOpts(){
            let _self = this;
            //获取法人公司
            api.getCompany('',function(res){
                for(let key in res.data){
                    _self.companyOpts.push({
                        label : key,
                        value : res.data[key]
                    })
                }
            });
            //获取科目list
            let searchParam = this.common.formatPathParam({
                pageIndex : 1,
                pageSize  : 99999999
            });
            api.getAccountingSubjectList(searchParam,function(result){
                //console.log(result);
                if(result.data.list){
                    _self.subjects = result.data.list;
                }else{
                    _self.subjects = [];
                }
            });
            //获取原因-科目对应关系
            api.getReasonSubject('',function(res){
                _self.reasonSubjectsObj = res.data;
            });
        },
        //获取子业务类型
        getVoucherOpts(){
            let _self = this;
            //获取凭证类型
            api.getBusinessType('',function(res){
                res.data.forEach(function(item,index){
                    if(_self.accountConfigForm.businessType == item.code){
                        _self.voucherOpts = item.vouchers;
                    }
                });
            });
        },
        //设置总账日期起始时间
        setStartDate(){
            let _self = this;
            let param = this.common.formatPathParam({
                companyJdeCode : _self.accountConfigForm.company
            });
            if(this.accountConfigForm.detailDtoList.length > 0){
                _self.$confirm('切换法人公司，科目列表中的BU将会更换为当前法人公司', '提示', {
                    confirmButtonText: '确定切换',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.accountConfigForm.generalDate = '';
                    api.getStartDate(param,function(res){
                        _self.startDate = res.data;
                    });
                    _self.setCompany();
                }).catch(() => {
                    _self.accountConfigForm.company = _self.accountConfigForm.detailDtoList[0].bu;
                });
            }else{
                _self.accountConfigForm.generalDate = '';
                api.getStartDate(param,function(res){
                    _self.startDate = res.data;
                });
            }
        },
        //设置科目list中的BU
        setCompany(){
            let _self = this;
            this.accountConfigForm.detailDtoList.forEach(function(item,index){
                item.bu = _self.accountConfigForm.company;
            })
        },
        //编辑科目
        getSubjectDetail(row,index){
            let _self = this;
            this.subjectSubmit = Object.assign({},row);
            //this.changeSubject();
            this.dialogConfig.type = 'edit';
            this.dialogConfig.index = index;
            this.dialogConfig.isVisible = true;
        },
        //选择会计科目
        changeSubject(){
            let _self = this;
            let tempSubjectObj = this.getCurrentSubject();
            //console.log(tempSubjectObj);
            this.subjectSubmit.subsidiaryLedgerTypeDesc = tempSubjectObj.subsidiaryLedgerType;
            this.subjectSubmit.subsidiaryLedger = tempSubjectObj.subsidiaryLedger;
        },
        getCurrentSubject(){
            let _self = this;
            let currentSubject = {};
            this.subjects.forEach(function(item,index){
                if(_self.subjectSubmit.subjectNum == item.subjectNum){
                    currentSubject = item;
                }
            });
            return currentSubject;
        },
        //切换原因，将原因中的会计科目push至科目list
        changeReason(oldVal){
            let _self = this;
            // if(this.firstLoad && this.voucherId){
            //     this.firstLoad = false;
            //     return false;
            // }
            this.$confirm('更换原因，科目列表将被替换', '提示', {
                confirmButtonText: '确定更换',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _self.accountConfigForm.detailDtoList = [];
                if(_self.accountConfigForm.reason){
                    let subjects = this.reasonSubjectsObj[this.accountConfigForm.reason];
                    if(subjects.length > 0){
                        subjects.forEach(function(item,index){
                            _self.accountConfigForm.detailDtoList.push({
                                bu : _self.accountConfigForm.company,
                                subjectNum : item.subjectNum,
                                subsidiaryLedgerTypeDesc : item.subsidiaryLedgerTypeDesc,
                                subsidiaryLedger : item.subsidiaryLedger,
                                abstractInfo : _self.accountConfigForm.reason,
                                currency : 'CNY'
                            })
                        })
                    }
                }

            }).catch(() => {
                _self.resonSetBack = true;
                this.accountConfigForm.reason = oldVal;
            });

        },
        beforeUpload(file) {
            let _self = this;
            this.loadFile = true;
            return new Promise((resolve, reject) => {
                this.$nextTick(() => {
                    _self.uploadUrl =  '/fsc/store/file-upload/attachment?source=cashaException&foreignId=' + _self.fileObjTemp.foreignId
                    resolve()
                })
            })
        },
        //上传附件
        upload(uploadType){
            this.uploadType = uploadType;
            switch (uploadType) {
                case 'accountingData':
                    this.uploadDialogTitle = '上传手工分录数据';
                    this.fileList =[];
                    break;
                case 'attachmentFile':
                    this.uploadDialogTitle = '上传附件'
                    break;
                case 'voucher':
                    this.uploadDialogTitle = '上传凭证';
                    this.fileList =[];
                    break;
                default: 
                    break;
            }
            this.importOpreDialog = true;
            this.uploadDisabled = true;
            this.loadFile = false;
            this.isTimeOut = false;
        },
        importCommodity(){
            this.loadFile = true;
            this.$refs.importCommodity.submit();
            this.uploadDisabled = true;
        },
        cancelUpload(){
            this.importOpreDialog = false;
        },
        uploadError(err, file, fileList){
            this.$refs.importCommodity.clearFiles();
            this.fileList =[];
            this.uploadDisabled = true;
            this.loadFile = false;
            this.isTimeOut = false;
            this.common.messageUtil({
                message: '上传有误',
                type: 'warning'
            });
        },
        uploadSuccess(response, file, fileList){
            let _self = this;
            if(response.code === 200){
                if(this.uploadType != 'attachmentFile'){
                    this.$refs.importCommodity.clearFiles();
                }
                this.importOpreDialog = false;
                switch (this.uploadType) {
                    case 'accountingData':
                        _self.accountingDataUploaded(response)
                        break;
                    case 'attachmentFile':
                        _self.attachmentUploaded(response)
                        break;
                    case 'voucher':
                        _self.voucherUploaded(response)
                        break;
                    default: 
                        break;
                }
                
            }else{
                this.common.messageUtil({
                    message: response.msg,
                    type: 'warning'
                });
            }
        },
        //下载附件
        // downloadAttachmentFile(){
        //     let _self = this;
        //     let param = this.common.formatPathParam({
        //         url : this.accountConfigForm.filePath
        //     })
        //     api.downLoadBBCManualAccountingAttach(param,'application/vnd.ms-excel',function(res){
        //         if(res.code){
        //             _self.common.warningMessage(res.msg)
        //         }else{
        //             let link = document.createElement('a');
        //             link.href = res;
        //             link.download = '手工分录附件.xlsx';
        //             link.target = '_blank';link.click();
        //         }
        //     })
        // },
        // accountingDataUploaded(response){
        //     this.tempDesc = response.data.desc;
        //     this.accountConfigForm.ids = response.data.ids;
        //     this.common.messageUtil({
        //         message: '数据上传成功',
        //         type: 'success'
        //     });
        // },
        // attachmentUploaded(response){
        //     if(response.code === 200){
        //         this.attachFileUrl = response.data;
        //         this.common.messageUtil({
        //             message: '附件上传成功',
        //             type: 'success'
        //         });
        //     }else{
        //         this.common.messageUtil({
        //             message: response.msg,
        //             type: 'warning'
        //         });
        //     }
            
        // },
        // voucherUploaded(response){
        //     console.log(response);
        //     this.accountConfigForm = Object.assign({},{
        //         businessType : '',
        //         accountMode : '',
        //         accountVoucherCode : '',
        //         voucherDesc : '',
        //         company : '',
        //         jdeAccountModule : '',
        //         ids : [],
        //         generalDate : '',
        //         detailDtoList : [],
        //         reason : ''
        //     })
        //     this.common.messageUtil({
        //         message: '凭证上传成功',
        //         type: 'success'
        //     }); 
        // },
        //下载附件
        downloadAttachmentFile(){
            let _self = this;
            let param = this.common.formatPathParam({
                url : this.accountConfigForm.filePath
            })
            api.downLoadBBCManualAccountingAttach(param,function(res){
                if(res.code != 200 ){
                    _self.common.errorMessage(res.msg)
                }else{
                    let fileName = _self.accountConfigForm.filePath.split('/')[_self.accountConfigForm.filePath.split('/').length - 1];
                    let link = document.createElement('a');
                    link.href = res.data;
                    link.download = fileName;
                    link.target = '_blank';link.click();
                }
            })
        },
        accountingDataUploaded(response){
            this.tempDesc = response.data.desc;
            this.accountConfigForm.ids = response.data.ids;
            this.common.messageUtil({
                message: '数据上传成功',
                type: 'success'
            });
        },
        attachmentUploaded(response){
            if(response.code === 200){
                this.attachFileUrl = response.data;
                this.common.messageUtil({
                    message: '附件上传成功',
                    type: 'success'
                });
            }else{
                this.common.errorMessage(response.msg);
            }
            
        },
        voucherUploaded(response){
            console.log(response);
            this.accountConfigForm = Object.assign({},{
                businessType : '',
                accountMode : '',
                accountVoucherCode : '',
                voucherDesc : '',
                company : '',
                jdeAccountModule : '',
                ids : [],
                generalDate : '',
                detailDtoList : [],
                reason : ''
            })
            this.common.messageUtil({
                message: '凭证上传成功',
                type: 'success'
            }); 
        },
        beforeFileUpload(file){
            let _self = this;
            let Xls = file.name.split('.');
            const isLt50M = file.size / 1024 / 1024 <= 50
            if(Xls[Xls.length - 1] === 'xls'||Xls[Xls.length - 1] === 'xlsx'){
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        switch (_self.uploadType) {
                            case 'accountingData':
                                _self.importUrl =  ip.manualAccounting_ip + '/upload'
                                break;
                            case 'attachmentFile':
                                _self.importUrl =  ip.manualAccounting_ip + '/upload-others'
                                break;
                            case 'voucher':
                                _self.importUrl =  ip.manualAccounting_ip + '/upload-voucher-info'
                                break;
                            default: 
                                break;
                        }
                        resolve()
                    })
                })
            }else {
                this.common.messageUtil({
                    message: '上传文件只能是 xls/xlsx 格式!',
                    type: 'warning'
                });
                return false
            }
            if(!isLt50M){
                this.common.messageUtil({
                    message: '不能超过50M',
                    type: 'warning'
                });
                return false
            }
            
        },
        removeFile(file,fileList){
            this.fileList=[]
            this.loadFile = false
            this.uploadDisabled = true
        },
        handleChange(file, fileList) {
           this.fileList = fileList.slice(-1)
           this.uploadDisabled = this.fileList.length >0 ? false:true
           if(file.response || this.isTimeOut){
                // if(this.uploadType != 'attachmentFile'){
                //    this.fileList = []
                // }
                this.fileList = []
                this.uploadDisabled = true
                this.loadFile = false
           }
        },
        //打开新增科目弹框
        newSubject(){
            let _self = this;
            if(this.accountConfigForm.company){
                _self.dialogConfig.isVisible = true;
                _self.subjectSubmit = {
                    subsidiaryLedgerTypeDesc : null,
                    subsidiaryLedger : '',
                    currency : 'CNY',
                    bu : _self.accountConfigForm.company
                };
                _self.dialogConfig.type = 'new';
            }else{
                _self.common.messageUtil({
                    message: '请先选择法人公司',
                    type: 'error'
                });
            }

        },
        //新增、编辑科目
        addSubjectItem(index){
            let _self = this;
            this.$refs['subjectSubmit'].validate((valid) => {
                if (valid){
                    let tempSubjectObj = Object.assign({},_self.subjectSubmit);
                    if(_self.dialogConfig.type == 'new'){
                        _self.accountConfigForm.detailDtoList.push(tempSubjectObj);
                    }else if(_self.dialogConfig.type == 'edit'){
                        for(let key in tempSubjectObj){
                            _self.$set(_self.accountConfigForm.detailDtoList[_self.dialogConfig.index],key,tempSubjectObj[key])
                        }
                    }
                    _self.$refs['subjectSubmit'].resetFields();
                    _self.dialogConfig.isVisible = false;
                }else {
                    return false;
                }
            });
        },
        //删除科目
        deleteSubject(dx){
            let _self = this;
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let tempDetailList = _self.common.removeIndex(_self.accountConfigForm.detailDtoList,dx);
                _self.accountConfigForm.detailDtoList = tempDetailList;
            }).catch(() => {
            });
        },
        //验证科目中的金额是否为空
        validSubjectAmount(){
            let _self = this;
            let amountValid = true;
            this.accountConfigForm.detailDtoList.forEach(function(item,index){
                if(!item.amount){
                    amountValid = false;
                    return false;
                }
            })
            return amountValid;
        },
        changeSubsidiaryLedgerType(){
            if(this.subjectSubmit.subsidiaryLedgerTypeDesc == 'X'){
                this.subjectSubmit.subsidiaryLedger = '';
            }
        },
        countTotalSelectedAmount(){
            let _self = this;
            let calTotalKey = [];
            let selectSum = 0;
            checkResultsUtil.totalAmountCalKey.forEach(function(item,index){
                if(_self.manualDescType == item.type){
                    calTotalKey = item.detailType[Number(_self.detailType)].split('-');
                }
            });
            this.selectedRows.forEach(function(item,index){
                let curCalItem = 0;
                if(calTotalKey.length == 1){
                    let formatAmount = item[calTotalKey[0]]? item[calTotalKey[0]].toString().replace(/,/g, "") : 0;
                    curCalItem = Number(formatAmount);
                }else{
                    let subtractA = item[calTotalKey[0]]? Number(item[calTotalKey[0]].toString().replace(/,/g, "")) : 0;
                    let subtractB = item[calTotalKey[1]]? Number(item[calTotalKey[1]].toString().replace(/,/g, "")) : 0;
                    curCalItem = floatObj.subtract(subtractA,subtractB);
                };
                selectSum = floatObj.add(selectSum,curCalItem);
            });
            this.selectDiffAmountSum = selectSum;
            if(selectSum > 999.99){
                this.formaSelectedDiffAmountSum = this.common.formatterAmount(selectSum.toFixed(2));
            }else{
                this.formaSelectedDiffAmountSum = selectSum.toFixed(2);
            }
        },
        countTotalSubAmount(){
            let _self = this;
            let subAmountSum = 0;
            this.accountConfigForm.detailDtoList.forEach(function(item,index){
                if(Number(item.amount) > 0){
                    subAmountSum = floatObj.add(subAmountSum,Number(item.amount));
                }
            });
            return subAmountSum;
        },
        //保存手工分录
        saveAccountConfig(){
            let _self = this;
            let accConfigObj = {};
            this.$refs['accountConfigForm'].validate((valid) => {
                if(valid){
                    if(_self.accountConfigForm.detailDtoList.length > 1){
                        let amountValid = _self.validSubjectAmount();
                        if(amountValid){
                            if(_self.voucherId || _self.selectedRows.length > 0 || _self.accountConfigForm.ids.length > 0){
                                let selectedIds = [];
                                _self.selectedRows.forEach(function(item,index){
                                    selectedIds.push(item.id);
                                });
                                _self.accountConfigForm.detailDtoList.forEach(function(item,index){
                                    item.company = item.bu;
                                });
                                if(!_self.voucherId){
                                    _self.accountConfigForm.ids = _self.accountConfigForm.ids.length ? _self.accountConfigForm.ids : selectedIds;
                                    let manualType = checkResultsUtil.manualAccountingDesc[Number(_self.manualDescType.split('-')[0])];
                                    _self.accountConfigForm.desc = manualType.type + manualType.detailType[Number(_self.detailType)];
                                    if(_self.activeTabType || _self.activeTabType === '0'){
                                        _self.accountConfigForm.desc += manualType.activeTabType[Number(_self.activeTabType)];
                                    }
                                }
                                console.log('success===========');
                                console.log(_self.accountConfigForm);
                                let subAmountSum    = _self.countTotalSubAmount();
                                let totalDiffAmount = floatObj.subtract(_self.selectDiffAmountSum,subAmountSum);
                                if(_self.selectedRows.length > 0 && totalDiffAmount != 0){
                                    _self.$confirm('科目正向总金额与差异汇总金额不一致，是否继续？', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        _self.toManualEntry();
                                    }).catch(() => {});
                                }else{
                                    _self.toManualEntry();
                                }
                            }else if(_self.source == 'leftMenu'){
                                _self.toManualEntry();
                            }else{
                                _self.common.messageUtil({
                                    message: '请选择要手工分录的数据或上传附件',
                                    type: 'error'
                                });
                            }
                        }else{
                            _self.common.messageUtil({
                                message: '科目金额不能为空',
                                type: 'error'
                            });
                        }
                    }else{
                        _self.common.messageUtil({
                            message: '请至少配置两条科目',
                            type: 'error'
                        });
                    }
                }else{
                    return false;
                }
            });
        },

        toManualEntry(){
            let _self = this;
            if(this.attachFileUrl){
                this.accountConfigForm.filePath = this.attachFileUrl;
            }
            api.generateManualEntry(_self.accountConfigForm,function(res){
                if(res.code === 200){
                    _self.common.messageUtil({
                        type : 'success',
                        message : '操作成功',
                        onClose : function(){
                            _self.cancel();
                            if(_self.source == 'leftMenu'){
                                _self.accountConfigForm = Object.assign({},{
                                    businessType : '',
                                    accountMode : '',
                                    accountVoucherCode : '',
                                    voucherDesc : '',
                                    company : '',
                                    jdeAccountModule : '',
                                    ids : [],
                                    generalDate : '',
                                    detailDtoList : [],
                                    reason : ''
                                })
                            }
                        }
                    });
                }else{
                    _self.common.messageUtil({
                        type : 'warning',
                        message : res.msg,
                        onClose : function(){
                        }
                    });
                }
            })
        }
    }
}
</script>
<style lang="scss">
.upload-btn{
    position: relative;
    z-index: 2000;
    span{
        color: #2AAF37;
    }
}
.loadFileContent {
    .dialog-footer {
        padding-top: 20px;
    }
}
</style>








