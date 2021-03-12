<!--餐厅手工分录-->
<template>
  <div>
    <!-- form -->
    <div class="content" >
        <div class="float-right upload-btn" >
            <el-button type="text" @click="upload()" ><i class="el-icon-upload"></i>上传附件</el-button>
            <el-button v-if="accountConfigForm.filePath && accountConfigForm.filePath != '0'" type="text" @click="downloadAttachmentFile()" ><i class="el-icon-download"></i>下载附件</el-button>
        </div>
        <el-form ref="accountConfigForm" :model="accountConfigForm" :rules="accountConfigRules" :inline=true label-position="top">
            <el-row>
                <el-col :span="3" >
                    <el-form-item label="业务类型" prop="businessType" >
                        <el-select size="small"  v-model="accountConfigForm.businessType" placeholder="业务类型" disabled >
                            <el-option v-for="item in businessTypeOptions" :key="item.id" :label="item.instruction" :value="item.instruction" >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" >
                    <el-form-item label="法人公司" prop="company" >
                        <el-select  v-model="accountConfigForm.company" filterable remote placeholder="请输入jde号进行查询" size="small" value-key="jdeCode"
                                    :remote-method="getCompany" :loading="getCompanyLoading" @change="companyChange" @keyup.native="keyupFn" :disabled="$route.query.source != 'leftMenu'"  >
                            <el-option  v-for="item in companyList" :key="item.jdeCode" :label="item.jdeCode" :value="item" ></el-option>
                        </el-select>
                        <!-- <el-select size="small"  v-model="accountConfigForm.company" placeholder="法人公司" >
                            <el-option v-for="item in companyOpts" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select> -->
                    </el-form-item>
                </el-col>
                <el-col :span="4" >
                    <el-form-item label="总账日期" prop="generalDate" >
                        <el-date-picker v-model="accountConfigForm.generalDate" type="date" value-format="yyyy-MM-dd"
                                        placeholder="总账日期" :picker-options="pickerOptionsStart" ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3" >
                    <el-form-item label="账套" prop="accountMode" >
                        <el-select size="small"  v-model="accountConfigForm.accountMode" placeholder="账套">
                            <el-option v-for="item in optMap[key = 'ACCOUNTSET']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" >
                    <el-form-item label="JDE账务模块" prop="jdeAccountModule" >
                        <el-select size="small"  v-model="accountConfigForm.jdeAccountModule" placeholder="JDE账务模块">
                            <el-option v-for="item in optMap[key = 'JDEACCOUNTMODULE']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" >
                    <el-form-item label="说明" prop="remark" >
                        <el-input size="small"  v-model="accountConfigForm.remark" placeholder="说明"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>

    <!--body-->
    <div class="content" >
        <el-table :data="accountConfigForm.detailDtoList" max-height="500" border >
            <el-table-column label="BU" column-key="BU">
                <template slot-scope="scope" >
                    <span>{{buTypeTrans[scope.row.buType]}}  {{scope.row.buType == '法人'? scope.row.bu : scope.row.bu.buName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="subjectNum" label="会计科目" :formatter="renderSubject" ></el-table-column>
            <el-table-column prop="subsidiaryLedgerTypeDesc" width="80" label="子账类型"></el-table-column>
            <el-table-column prop="subsidiaryLedger" label="子账" ></el-table-column>
            <!-- <el-table-column prop="description" label="子账描述" ></el-table-column> -->
            <el-table-column prop="currency" label="币种" ></el-table-column>
            <el-table-column prop="abstractInfo" label="备注" ></el-table-column>
            <el-table-column prop="amount" label="金额" >
                <template slot-scope="scope">
                    {{formatterAmount(scope.row.amount)}}
                </template>
            </el-table-column>
            <el-table-column prop="bohAdjustType" label="调整类型" ></el-table-column>
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
        <p v-if="$route.query.source != 'voucherManual' && $route.query.source != 'leftMenu' && checkAmount" class="adjust-item-amount">金额：{{checkAmount}}</p>
        <el-form :model="subjectSubmit" ref="subjectSubmit" :rules="subjectRules" :inline="true" label-width="85px" >
            <el-row>
                <el-form-item label="BU" required >
                    <el-col :span="10">
                        <el-form-item prop="buType">
                            <el-select size="small"  v-model="subjectSubmit.buType" @change="buTypeChange" >
                                <el-option v-for="item in buOpts" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="10">
                        <el-form-item prop="bu">
                            <el-input   size="small" v-if="subjectSubmit.buType == 'LEGALPERSON'"  v-model.trim="subjectSubmit.bu" disabled ></el-input>
                            <el-select  v-if="subjectSubmit.buType != 'LEGALPERSON'" v-model="subjectSubmit.bu" filterable remote value-key="buCode"
                                        :placeholder="subjectSubmit.buType != 'RESTAURANT'?'请输入jde号进行查询' : '请输入餐厅编号进行查询'" size="small" :remote-method="getBuName" :loading="getBuNameLoading" >
                                <el-option  v-for="item in buNameList" :key="item.buCode" :label="item.buCode" :value="item" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="会计科目" prop="subjectNum" >
                        <el-select  size="small" filterable v-model="subjectSubmit.subjectNum" @change="changeSubject" >
                            <el-option v-for="item in subjects" :key="item.id" :label="item.subjectNum + '--' + item.subjectName" :value="item.subjectNum">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="子账类型" prop="subsidiaryLedgerTypeDesc" >
                        <el-select size="small"  v-model="subjectSubmit.subsidiaryLedgerTypeDesc" @change="subjectSubmit.subsidiaryLedger = ''" >
                            <el-option label="请选择" value="" ></el-option>
                            <el-option v-for="item in optMap[key = 'CHILDACCOUNT']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName" >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="子账" prop="subsidiaryLedger" >
                        <el-input v-if="subjectSubmit.subsidiaryLedgerTypeDesc == 'X'" size="small" v-model.trim="subjectSubmit.subsidiaryLedger" maxlength="8" ></el-input>
                        <el-select  v-else-if="subjectSubmit.subsidiaryLedgerTypeDesc == 'C'" v-model="subjectSubmit.subsidiaryLedger" filterable remote
                                    placeholder="请选择餐厅JDE Code" size="small" :remote-method="getStoreList" :loading="getResLoading" >
                            <el-option v-for="item in storeList" :key="item.buCode" :label="item.buCode" :value="item.buCode" ></el-option>
                        </el-select>
                        <el-select  v-else-if="subjectSubmit.subsidiaryLedgerTypeDesc == 'A'" v-model="subjectSubmit.subsidiaryLedger" filterable remote
                                    placeholder="请选择餐厅JDE Code" size="small" :remote-method="getCustList" :loading="getCustLoading" >
                            <el-option v-for="item in custList" :key="item.buCode" :label="item.buCode" :value="item.buCode" ></el-option>
                        </el-select>
                        <el-input v-else size="small" v-model.trim="subjectSubmit.subsidiaryLedger" disabled ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                     <el-form-item label="币种" prop="currency" >
                        <el-input size="small"  v-model.trim="subjectSubmit.currency" disabled ></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12" >
                    <el-form-item label="子账描述" prop="description" >
                        <el-input size="small"  v-model.trim="subjectSubmit.description" ></el-input>
                    </el-form-item>
                </el-col> -->
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="备注" prop="abstractInfo" >
                        <el-input size="small"  v-model.trim="subjectSubmit.abstractInfo" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="金额" prop="amount" >
                        <el-input size="small"  v-model.trim="subjectSubmit.amount" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="调整类型" prop="bohAdjustType" >
                        <el-select size="small" filterable v-model="subjectSubmit.bohAdjustType" >
                            <el-option v-for="item in bohAdjustTypeOpts" :key="item.id" :label="item.adjustCode + ' ' + item.adjustName" :value="item.adjustCode + ' ' + item.adjustName">
                            </el-option>
                        </el-select>
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
    <el-dialog :visible.sync="importOpreDialog" class="dialogContent" width="40%"   title="上传附件" :close-on-click-modal='false'>
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
                <el-button class="c-button c-button--primary">上传附件</el-button>
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
    import apiStore from '../../model/apidr'
    import ip from '../../model/tempIp'
	export default {
        name:'StoreManualAccounting',
        activated(){
            // console.log('params======' + JSON.stringify(this.$route.params));
            // console.log('localStorage=============='+window.localStorage.storeManualAccountingParams);
            // console.log('stashParams======' + JSON.stringify(this.stashParams));
            let params = window.localStorage.storeManualAccountingParams;
            let source = this.$route.query.source;
            //let params  = this.$route.params;
            if(source == 'voucherManual') return;
            if(params !== this.stashParams){
                this.stashParams = JSON.stringify(params);
                let storage = window.localStorage;
                if(storage.storeManualAccountingParams){
                    let params  = JSON.parse(storage.storeManualAccountingParams);
                    this.accountConfigForm.id = params.id;
                    this.accountConfigForm.source = params.source;
                    this.accountConfigForm.type = params.type;
                    this.accountConfigForm.voucherId = params.voucherId;
                    this.checkAmount = params.checkAmount;
                }
            };
            if(source == 'leftMenu'){
                this.accountConfigForm.id = '';
                this.accountConfigForm.source = '';
                this.accountConfigForm.type = '';
                this.accountConfigForm.voucherId = '';
                // this.accountConfigForm.remark = '';
                // this.accountConfigForm.accountMode = '';
                // this.accountConfigForm.jdeAccountModule = '';
            }else if(source == 'cashManualCheck'){
                this.accountConfigForm.accountMode = 'AA';
                this.accountConfigForm.jdeAccountModule = '总账';
            }
            if(source != 'leftMenu'){
                this.getCompanyJde();
            }
            // console.log('accountConfigForm======' + JSON.stringify(this.accountConfigForm));
            // console.log('=======* end *======');
        },
        deactivated(){
            let params  = window.localStorage.storeManualAccountingParams;
            // let params  = JSON.stringify(this.$route.params);
            this.stashParams = params;
        },
        created(){},
        beforeMount(){
            this.getDictionaryOptions();
            this.getSelectOpts();
            this.getAccountSubject();
            if(this.$route.query.voucherId){
            this.getEditAccountInfo(this.$route.query.voucherId)
            }
        },
        mounted(){
            // console.log('storeManualAccountingParams=====' + this.stashParams,JSON.parse(window.localStorage.storeManualAccountingParams));
        },
        data() {
            var floatNumPass = (rule, value, callback)=> {
                const reg = /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/;
                if (!value) {
                    return callback(new Error('请输入金额'))
                } else if (!reg.test(value)) {
                    return callback(new Error('请输入正确的金额,最多2位小数'))
                } else {
                    callback()
                }
            };
            return {
                floatObj : floatObj,
                stashParams : '',
                manualDescType : '',
                checkAmount : 0,
                accountConfigForm: {
                    company : {},
                    accountMode : '',
                    jdeAccountModule : '',
                    remark : '',
                    //ids : [],
                    businessType  : 'STORE',
                    generalDate   : '',
                    detailDtoList : [],
                },
                businessTypeOptions : [],
                bohAdjustTypeOpts : [],
                companyList   : [],
                buNameList    : [],
                storeList     : [],
                custList      : [],
                buObj : {
                    法人     : 'LEGALPERSON',
                    餐厅     : 'RESTAURANT',
                    开票单位 : 'BUSINESSUNIT'
                },
                buTypeTrans : {
                    LEGALPERSON  : '法人',
                    RESTAURANT   : '餐厅',
                    BUSINESSUNIT : '开票单位'
                },
                buOpts : [{
                    label : '法人',
                    value : 'LEGALPERSON'
                },{
                    label : '餐厅',
                    value : 'RESTAURANT'
                },{
                    label : '开票单位',
                    value : 'BUSINESSUNIT'
                }],
                getCompanyLoading : false,
                getSubjectLoading : false,
                getBuNameLoading  : false,
                getResLoading     : false,
                getCustLoading    : false,
                accountConfigRules:{
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
                pickerOptionsStart: {},
                // startDate : null,
                voucherOpts : [],
                companyOpts : [],
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
                    bu : [
                        { required: true, message: '请填写bu信息', trigger: 'change' }
                    ],
                    buType : [
                        { required: true, message: '请填写bu信息', trigger: 'change' }
                    ],
                    subjectNum : [
                        { required: true, message: '请选择科目', trigger: 'change' }
                    ],
                    amount : [
                        { required: true, message: '请输入金额', trigger: 'blur' },
                        // { type: 'number', message: '请输入正确的金额' },
                        { validator: floatNumPass, trigger: 'blur' }
                    ],
                    abstractInfo: [
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ]
                },
                selectedRows : [],
                reasonSubjectsObj : {},
                importOpreDialog  : false,
                attachFileUrl : '',
                fileList  :  [],
                importUrl : ip.accountConfig_ip + '/store-manual-entry/upload',
                uploadDisabled : true,
                loadFile  : false,
                isTimeOut : false,
                tempDesc  : ''
            }
        },
        computed: {
        },
        watch : {
            startDate(val,oldVal){
                this.pickerOptionsStart = Object.assign({},this.pickerOptionsEnd,{
                    disabledDate: (time) => {
                        return time.getTime() < val;
                    }
                });
            },
        },
        methods: {
            formatterAmount(amount){
                let amountAtr = 0;
                if(amount < 0){
                    amountAtr = Math.abs(Number(amount)).toFixed(2);
                }else{
                    amountAtr = Number(amount).toFixed(2);
                }

                let formatterValue = amountAtr.toString().split("").reverse().join("").replace(/(\d{3})+?/g,function(s){
                    return s+",";
                }).replace(/,$/,"").split("").reverse().join("");
                return amount < 0? '-'+formatterValue : formatterValue ;
            },
            getCompanyJde(){
                let _self = this;
                let comJde = this.$route.query.companyJde;
                this.getCompany(comJde,true);
            },
            companyChange(){
                let _self = this;
                this.accountConfigForm.detailDtoList = []
                let param = this.common.formatPathParam({
                    companyJdeCode : _self.accountConfigForm.company.jdeCode
                });
                _self.accountConfigForm.generalDate = '';
                api.getStartDate(param,function(res){
                    _self.startDate = res.data;
                });
            },
            keyupFn(event){
                //console.log(param);
                if(!event.target.value){
                    this.getCompany('');
                }
            },
            //获取编辑餐厅手工账务信息
            getEditAccountInfo(voucherId){
                var that = this
                api.editVoucher(voucherId,function(res){
                if(res.code == 200){
                    that.accountConfigForm = res.data
                    that.accountConfigForm.company = that.accountConfigForm.companyObject
                    that.getCompany(that.accountConfigForm.company.jdeCode);
                }
            })
            //    window.localStorage.setItem('storeManualAccountingParams','{}');
            //    console.log('localStorage=============='+window.localStorage.storeManualAccountingParams);
            },
            //关闭当前页
            cancel(){
                this.common.deleteTag(this.$route,this);
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
            //加载list中的科目
            renderSubject(row,column,cellValue,index){
                let _self = this;
                let subjectOpj = {};
                this.subjects.forEach(function(item,index){
                    if(row.subjectNum == item.subjectNum){
                        subjectOpj = item;
                    }
                });
                return subjectOpj.subjectNum +'--'+ subjectOpj.subjectName;
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
                //获取业务类型
                api.getBusinessType('',function(res){
                    _self.businessTypeOptions = res.data;
                });
                //调整类型list
                apiStore.getBohAdjustTypeList('',function(result){
                    //console.log(result);
                    if(result.code === 200){
                        _self.bohAdjustTypeOpts = result.data;
                    }else{
                        _self.bohAdjustTypeOpts = [];
                    }
                });
            },
            //获取法人公司
            getCompany(query,isSetVal){
                let _self = this;
                this.getCompanyLoading = true;
                let param = this.common.formatPathParam({
                    companyName : query,
                    judgePermission: _self.$route.query.source == 'leftMenu'? true : false
                });
                api.getAllCompanyIdNamess(param,function(result){
                    _self.getCompanyLoading = false;
                    if(result.code == 200){
                        _self.companyList = result.data.list;
                        if(isSetVal){
                            _self.accountConfigForm.company = _self.companyList[0];
                        }
                    }else if(result.code == 404){
                        _self.companyList = [];
                    }
                })
            },
            getAccountSubject(){
                let _self = this;
                this.getSubjectLoading = true;
                let param = this.common.formatPathParam({
                    pageSize : 999999
                });
                api.getAccountingSubjectList(param,function(result){
                    _self.getSubjectLoading = false;
                    if(result.data.list.length){
                        _self.subjects = result.data.list.concat();
                    }else{
                        _self.subjects = [];
                    }
                })
            },
            //获取buName
            getBuName(query){
                let _self = this;
                if(query !== '') {
                    this.getBuNameLoading = true;
                    let param = this.common.formatPathParam({
                        companyCode : this.accountConfigForm.company.jdeCode,
                        buType : this.subjectSubmit.buType,
                        buName : query
                    });
                    apiStore.getBuNameList(param,function(result){
                        _self.getBuNameLoading = false;
                        if(result.code == 200){
                            _self.buNameList = result.data;
                        }else if(result.code == 404){
                            _self.buNameList = [];
                        }
                    })
                }else {
                    this.buNameList = [];
                }
            },
            buTypeChange(){
                let _self = this;
                if(this.subjectSubmit.buType === 'LEGALPERSON'){
                    this.subjectSubmit.bu = this.accountConfigForm.company.jdeCode;
                }else{
                    this.subjectSubmit.bu = '';
                }
            },
            //获取餐厅
            getStoreList(query){
                let _self = this;
                if(query !== '') {
                    this.getResLoading = true;
                    let param = this.common.formatPathParam({
                        companyCode : this.accountConfigForm.company.jdeCode,
                        buType : 'RESTAURANT',
                        buName : query
                    });
                    apiStore.getBuNameList(param,function(result){
                        _self.getResLoading = false;
                        if(result.code == 200){
                            _self.storeList = result.data;
                        }else if(result.code == 404){
                            _self.storeList = [];
                        }
                    })
                }else {
                    this.storeList = [];
                }
            },
            //获取客户
            getCustList(query){
                let _self = this;
                if(query !== '') {
                    this.getCustLoading = true;
                    let param = this.common.formatPathParam({
                        customerCode : query
                    });
                    apiStore.getCustsBykeyWord(param,function(result){
                        _self.getCustLoading = false;
                        if(result.code == 200){
                            _self.custList = result.data;
                        }else if(result.code == 404){
                            _self.custList = [];
                        }
                    })
                }else {
                    this.custList = [];
                }
            },
            //设置科目list中的BU
            setCompany(){
                let _self = this;
                this.accountConfigForm.detailDtoList.forEach(function(item,index){
                    item.bu = _self.accountConfigForm.company.jdeCode;
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
                let tempSubsidiaryLedgerTypeDesc = '';
                this.optMap['CHILDACCOUNT'].forEach(function(item,index){
                    if(item.id == tempSubjectObj.subsidiaryLedgerType){
                        tempSubsidiaryLedgerTypeDesc = item.dictionaryEntryName;
                    }
                })
                this.subjectSubmit.subsidiaryLedgerTypeDesc = tempSubsidiaryLedgerTypeDesc;
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
            //打开新增科目弹框
            newSubject(){
                let _self = this;
                if(this.accountConfigForm.company.jdeCode){
                    _self.dialogConfig.isVisible = true;
                    _self.subjectSubmit = {
                        subsidiaryLedgerTypeDesc : null,
                        subsidiaryLedger : '',
                        currency : 'CNY',
                        bu : _self.accountConfigForm.company.jdeCode,
                        company : _self.accountConfigForm.company.jdeCode,
                        buType  : 'LEGALPERSON'
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
            //验证科目中的金额总和是否为0
            validSubjectAmount(){
                let _self = this;
                let totalAmount = 0;
                this.accountConfigForm.detailDtoList.forEach(function(item,index){
                    totalAmount = floatObj.add(totalAmount,item.amount)
                    //totalAmount += Number(item.amount.toFixed(2));
                })
                return Number(totalAmount.toFixed(2));
            },
            getDiscountCheckAmount(){
                let _self = this;
                let checkAmount = Number(this.checkAmount.toString().replace(/,/gi,''));
                let sumTotal = 0;
                this.accountConfigForm.detailDtoList.forEach(function(item,index){
                    if(item.amount > 0){
                        sumTotal = floatObj.add(sumTotal,item.amount)
                    }
                });
                let discountAmount = Math.abs(checkAmount) - sumTotal;
                return discountAmount;
            },
            beforeFileUpload(file){
                let _self = this;
                let Xls = file.name.split('.');
                const isLt50M = file.size / 1024 / 1024 <= 50
                if(Xls[Xls.length - 1] === 'xls'||Xls[Xls.length - 1] === 'xlsx'){
                    return file;
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
            //上传附件
            upload(){
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
            uploadSuccess(response, file, fileList){
                let _self = this;
                if(response.code === 200){
                    this.importOpreDialog = false;
                    if(response.code === 200){
                        this.attachFileUrl = response.data.filePath;
                        this.common.messageUtil({
                            message: '附件上传成功',
                            type: 'success'
                        });
                    }else{
                        this.common.messageUtil({
                            message: response.msg,
                            type: 'warning'
                        });
                    }
                }else{
                    this.common.messageUtil({
                        message: response.msg,
                        type: 'warning'
                    });
                }
            },
            //下载附件
            downloadAttachmentFile(){
                let _self = this;
                let param = this.common.formatPathParam({
                    url : this.accountConfigForm.filePath
                })
                let fileName = this.accountConfigForm.filePath.split('/')[_self.accountConfigForm.filePath.split('/').length - 1];
                apiStore.downLoadStoreManualAccountingAttach(param,function(res){
                    if(res.code === 200){
                        let link = document.createElement('a');
                        link.href = res.data;
                        link.download = fileName;
                        link.target = '_blank';link.click();
                    }else{
                        _self.common.errorMessage(res.msg)
                    }
                })
            },
            //保存手工分录
            saveAccountConfig(){
                let _self = this;
                let accConfigObj = {};
                this.$refs['accountConfigForm'].validate((valid) => {
                    if(!valid){
                        return false;
                    }
                    if(_self.accountConfigForm.detailDtoList.length < 2){
                        _self.common.messageUtil({
                            message: '请至少配置两条科目',
                            type: 'error'
                        });
                        return false;
                    }
                    let totalAmount = _self.validSubjectAmount();
                    let discountCheckAmount = 0;
                    if(_self.$route.query.source != 'leftMenu' && _self.$route.query.source != 'voucherManual'){
                        discountCheckAmount = _self.getDiscountCheckAmount();
                    }
                    if(discountCheckAmount != 0){
                        _self.common.errorMessage('科目金额正向金额总和与调整金额不一致');
                        return false;
                    }
                    if(totalAmount != 0){
                        _self.common.messageUtil({
                            message: '科目金额总和必须为0',
                            type: 'error'
                        });
                        return false;
                    }
                    // console.log(_self.accountConfigForm);
                    let param = Object.assign({},_self.accountConfigForm);
                    param.company = _self.accountConfigForm.company.jdeCode;
                    param.detailDtoList.forEach(function(item,index){
                        let tempBuObj = Object.assign({},item.bu);
                        let buType = item.buType;
                        if(buType == 'LEGALPERSON'){
                            item.bu = _self.accountConfigForm.company.jdeCode
                        }else if(buType == 'BUSINESSUNIT'){
                            item.bu = tempBuObj.buCode
                        }else if(buType == 'RESTAURANT'){
                            item.bu = tempBuObj.buName
                        }
                        //item.bu = buType == 'LEGALPERSON'? _self.accountConfigForm.company.jdeCode : tempBuObj.buCode;
                        item.buName = buType == 'LEGALPERSON'? _self.accountConfigForm.company.companyName :tempBuObj.buName;
                        //delete item.buType;
                    });
                    if(!_self.attachFileUrl){
                        _self.common.warningMessage('请上传附件')
                        return false;
                    }
                    param.filePath = _self.attachFileUrl;
                    // console.log(param);
                    apiStore.generateStoreManualEntry(param,function(res){
                        if(res.code === 200){
                            _self.common.messageUtil({
                                message: res.data,
                                type: 'success'
                            });
                            _self.$refs['accountConfigForm'].resetFields();
                            _self.accountConfigForm = {
                                company : '',
                                remark : '',
                                //ids : [],
                                businessType  : 'STORE',
                                generalDate   : '',
                                detailDtoList : [],
                            };
                            window.localStorage.setItem('storeManualAccountingParams','{}');
                            if(_self.$route.query.voucherId){
                                _self.common.deleteTag(_self.$route,_self)
                            }
                            // console.log('localStorage=============='+window.localStorage.storeManualAccountingParams);
                        }else{
                        _self.common.messageUtil({
                                message: res.msg,
                                type: 'error'
                            });
                        }
                    });
                });

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








