<!--账务配置-详情-->
<template>
  <div>
    <!-- form -->
    <div class="content" >
        <el-form ref="form" :model="accountConfigForm" :inline=true label-position="top"  >
            <el-row>
                <el-col :span="3" >
                    <el-form-item label="编号" >
                        <el-input size="small"  v-model.trim="accountConfigForm.accountNumber" disabled ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" >
                    <el-form-item label="业务类型" >
                        <el-input size="small"  v-model.trim="accountConfigForm.businessTypeStr" disabled ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" >
                    <el-form-item label="凭证说明" >
                        <el-input size="small"  v-model.trim="accountConfigForm.voucherInstructionsStr" disabled ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" >
                    <el-form-item label="凭证筛选条件" >
                        <el-select size="medium" filterable v-model="voucherSelectedState" multiple placeholder="凭证筛选条件">
                            <el-option v-for="item in voucherOptConditionOpts" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5" >
                    <el-form-item label="描述" >
                        <el-input size="small"  v-model.trim="accountConfigForm.description" placeholder="请输入描述" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" >
                    <el-form-item label="账套" >
                        <el-select size="small" filterable v-model="accountConfigForm.accountMode" placeholder="账套">
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'ACCOUNTSET']" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3" >
                    <el-form-item label="JDE账务模块" >
                        <el-select size="small" filterable v-model="accountConfigForm.jdeAccountModule" placeholder="JDE账务模块">
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'JDEACCOUNTMODULE']" :key="item.id" :label="item.dictionaryEntryName" :value="Number(item.id)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3" >
                    <el-form-item label="JDE单据类型" >
                        <el-select size="small" filterable v-model="accountConfigForm.billType" placeholder="单据类型">
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'BILLTYPE']" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                 <el-col :span="3" >
                    <el-form-item label="生成方式" >
                        <el-select size="small"  v-model="accountConfigForm.buildType" placeholder="生成方式" @change="changeBuildType">
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'GENERATIONTYPE']" :key="item.id" :label="item.dictionaryEntryName" :value="Number(item.dictionaryEntryCode)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3" >
                    <el-form-item label="生成频次" >
                        <el-select size="small"  v-model="accountConfigForm.buildFrequency" placeholder="生成频次" :disabled="accountConfigForm.buildType == 1">
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in buildFrequencyOpts" :key="item.value" :label="item.label" :value="Number(item.value)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="5" >
                    <el-form-item label="生成时间" >
                        <el-date-picker v-model="accountConfigForm.createTimeStr" type="datetime"
                            value-format="yyyy-MM-dd hh:mm:ss" placeholder="生成时间" :disabled="accountConfigForm.buildType == 1"></el-date-picker>
                    </el-form-item>
                </el-col> -->
                <el-col :span="3" >
                    <el-form-item label="更新人" >
                        <el-input size="small"  v-model.trim="accountConfigForm.modifiedUser" placeholder="更新人" disabled ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>

    <!--body-->
    <div class="content" >
        <el-table :data="accountConfigForm.accountsSubjectConfigDtos" :border="true" style="width: 100%" >
            <el-table-column prop="bu" label="BU" column-key="BU" :formatter="renderTblData" ></el-table-column>
            <el-table-column prop="subject" label="科目名称" :formatter="renderSubject" ></el-table-column>
            <el-table-column prop="subjectNum" label="科目号" :formatter="renderSubject" ></el-table-column>
            <el-table-column prop="lendDirection" label="方向" column-key="LENDDIRECTION" :formatter="renderTblData" ></el-table-column>
            <el-table-column prop="subsidiaryLedgerType" label="子账类型" column-key="CHILDACCOUNT" :formatter="renderTblData" ></el-table-column>
            <el-table-column prop="subsidiaryLedger" label="子账" ></el-table-column>
            <el-table-column prop="currency" label="币种" ></el-table-column>
            <el-table-column prop="description" label="说明" ></el-table-column>
            <el-table-column prop="abstract1" label="摘要1" ></el-table-column>
            <el-table-column prop="abstract2" label="摘要2" ></el-table-column>
            <el-table-column prop="filterCondition" label="筛选条件" :formatter="formatFilterConditionForView" ></el-table-column>
            <el-table-column prop="calculationRule" label="计算规则" ></el-table-column>
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope" >
                    <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="getSubjectDetail(scope.row)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                    </el-tooltip>
                    <!-- <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteSubject(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
                    </el-tooltip> -->
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-row>
            <el-button size="small"  class="full-btn border-dashed" @click="newSubject" ><i class="el-icon-plus" ></i></el-button>
        </el-row> -->
    </div>

    <div class="btn-group txt-right" >
        <el-button size="small"  @click="cancel" >取消</el-button>
        <el-button size="small"  type="primary" @click="saveAccountConfig" class="c-button c-button--primary">保存</el-button>
    </div>

    <!-- dialog -->
    <el-dialog :title="dialogConfig.title" :visible.sync="dialogConfig.isVisible" >
        <el-form :model="subjectSubmit" :inline="true" label-width="85px" >
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="BU" >
                        <el-select size="small" filterable v-model="subjectSubmit.bu" >
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'BU']" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="科目号" >
                        <el-select size="small"  v-model="subjectSubmit.subject" @change="changeSubject" disabled >
                            <el-option v-for="item in subjects" :key="item.id" :label="item.subjectNum" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="方向" >
                        <el-select size="small"  v-model="subjectSubmit.lendDirection"  >
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'LENDDIRECTION']" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                            </el-option>
                        </el-select>
                        <!--<el-input size="small"  v-model.trim="subject.subjectType" disabled ></el-input>-->
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="子账类型" >
                        <el-select size="small" filterable v-model="subjectSubmit.subsidiaryLedgerType"  >
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'CHILDACCOUNT']" :key="item.id" :label="item.dictionaryEntryName" :value="Number(item.id)">
                            </el-option>
                        </el-select>
                        <!--<el-input size="small"  v-model.trim="subject.subsidiaryLedgerType" disabled ></el-input>-->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="子账" >
                        <el-input size="small"  v-model.trim="subjectSubmit.subsidiaryLedger"  ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="币种" >
                        <el-select size="small"  v-model="subjectSubmit.currency" >
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'CURRENCY']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="说明" >
                        <el-input size="small"  v-model.trim="subjectSubmit.description" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="摘要一" >
                        <el-select size="small" filterable v-model="abstrac1List" multiple >
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in optMap[key = 'ABSTRACT']" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="摘要二" >
                        <el-input size="small"  v-model.trim="subjectSubmit.abstract2" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="筛选条件" >
                        <el-select v-model="filterConditions" filterable multiple @change="changeTest">
                            <el-option label="请选择" value=""></el-option>
                            <el-option-group  v-for="(conditionOptsObj,pIndex) in filterConditionOpts"
                                              :key="conditionOptsObj.conditionName+'_'+pIndex"
                                              :label="conditionOptsObj.conditionName">
                                <el-option  v-for="(item,index) in conditionOptsObj.conditionOpts"
                                            :key="item+'_'+index"
                                            :label="item"
                                            :value="{name: conditionOptsObj.conditionName,value:item}"></el-option>
                            </el-option-group>
                        </el-select>
                        <!-- <el-input size="small"  v-model.trim="subjectSubmit.filterCondition" ></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" >
                    <el-form-item label="计算规则" >
                        <el-input size="small"  v-model.trim="subjectSubmit.calculationRule" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" >
            <el-button size="small"  @click="dialogConfig.isVisible = false;" >关闭</el-button>
            <el-button size="small"  type="primary" @click="addSubjectItem" class="c-button c-button--primary">保存</el-button>
        </div>
    </el-dialog>

  </div>
</template>
<script>
  import api from '../../model/api'
	export default {
    name:'accountDetail',
    activated(){
        let params  = JSON.parse(window.localStorage.params);
        if(params.id !== this.stashId){
            this.getDictionaryOptions();
            this.getConfigDetail();
            this.getSubjectOptions();
        }
    },
    deactivated(){
        let params  = JSON.parse(window.localStorage.params);
        this.stashId = params.id;
    },
    created(){},
    beforeMount(){
        // this.getDictionaryOptions();
        // this.getConfigDetail();
        // this.getSubjectOptions();
    },
    mounted(){},
    data() {
        return {
            stashId : '',
            navTitle:{
                fontSize: '20px'
            },
            tabIndex: 2,
            accountConfigForm: {},
            voucherSelectedState: [],
            dialogConfig: {
                isVisible : false,
                title : '科目配置',
                type  : ''
            },
            accountConfigOpt: {},
            subjects: [],
            tblData:[],
            buildFrequencyOpts: [
                {
                    value: '0',
                    label: '每月'
                },{
                    value: '1',
                    label: '每天'
                }
            ],
            abstrac1List: [],
            voucherOptConditionOpts: [],
            //数据字典中配置的字段
            optFromDic: ['ACCOUNTSET','JDEACCOUNTMODULE','BILLTYPE','GENERATIONTYPE','BU','CURRENCY','ABSTRACT','LENDDIRECTION','CHILDACCOUNT'],
            optMap: {},
            subject: {},
            subjectSubmit : {
                lendDirection : '',
                subsidiaryLedgerType : null,
                subsidiaryLedger : ''
            },
            filterConditions : [],
            filterConditionOpts : [],
            currentPage : 1,
            pageSizeOpt : [25,50,75,100,125],
            pageSize    : 25,
            totalRecord : 0
        }
    },
    methods: {
        changeTest(){
            //console.log(this.getAndFormatFilterCondition());
        },
        //关闭当前页
        cancel(){
            this.common.deleteTag(this.$route,this);
        },
        //生成凭证
        accountCreate(id){
            let _self = this;
        },
        //获取详情
        getConfigDetail(){
            let _self   = this;
            let storage = window.localStorage;
            let params  = this.common.formatPathParam(JSON.parse(storage.params));
            api.getConfigDetail(params,function(result){
                _self.accountConfigForm = Object.assign({},result.data);
                _self.getBusinessType();
            })
        },
        //处理表单数据
        renderTblData(row,column,cellValue,index){
            let _self = this;
            let actCellVal = '';
            if(this.optMap[column.columnKey]){
                this.optMap[column.columnKey].forEach(function(item,index){
                    if(cellValue == item.id){
                        actCellVal = item.dictionaryEntryName;
                    }
                })
            }
            return actCellVal;
        },
        //加载科目
        renderSubject(row,column,cellValue,index){
            let _self = this;
            let subjectOpj = {};
            this.subjects.forEach(function(item,index){
                if(row.subject == item.id){
                    subjectOpj = item;
                }
            });
            if(column.property == 'subject'){
                return subjectOpj.subjectName;
            }else if(column.property == 'subjectNum'){
                return subjectOpj.subjectNum;
            }else if(column.property == 'lendDirection'){
                return subjectOpj.lendDirection;
            }else if(column.property == 'subsidiaryLedgerType'){
                return subjectOpj.subsidiaryLedgerType;
            }else if(column.property == 'subsidiaryLedger'){
                return subjectOpj.subsidiaryLedger;
            }
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
        //获取业务类型
        getBusinessType(){
            let _self = this;
            api.getBusinessType('',function(res){
                let vouchers = [];
                res.data.forEach(function(item,index){
                    if(_self.accountConfigForm.businessType == item.id){
                        vouchers = item.vouchers;
                    }
                });
                if(vouchers.length){
                    vouchers.forEach(function(item,index){
                        if(_self.accountConfigForm.voucherInstructions == item.id){
                            _self.voucherOptConditionOpts = item.optionalState.split(',');
                            _self.voucherSelectedState = item.selectedState.split(',');
                        }
                    });
                }
            })
        },
        //获取科目list
        getSubjectOptions(){
            let _self = this;
            let searchParam = this.common.formatPathParam({
                pageIndex : 1,
                pageSize  : 99999999
            });
            api.getAccountingSubjectList(searchParam,function(result){
                console.log(result);
                if(result.data.list){
                    _self.subjects = result.data.list;
                }else{
                    _self.subjects = [];
                }
            })
        },
        reset(){
            this.searchObj = {
                businessType: '',
                accountSet: '',
                accountModule: ''
            };
            this.getData();
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getData();
        },
        //编辑科目
        getSubjectDetail(row){
            let _self = this;
            this.subjectSubmit = Object.assign({},row);
            this.abstrac1List  = row.abstract1? Object.assign([],row.abstract1.split(',')) : [];
            //this.changeSubject();
            this.filterConditionOpts = row.filterCondition ? this.formatFilterConditionOpts(JSON.parse(row.filterCondition).optional) : [];
            this.filterConditions = row.filterCondition ? this.formatSelectedFilterCondition(JSON.parse(row.filterCondition).selected) : [];
            this.dialogConfig.type = 'edit';
            this.dialogConfig.isVisible = true;
        },
        //格式化筛选条件选项
        formatFilterConditionOpts(optsObj){
            let filterConditionOpts = []
            for(let key in optsObj){
                let opts = optsObj[key].split(',');
                filterConditionOpts.push({
                    conditionName : key,
                    conditionOpts : opts
                })
            }
            return filterConditionOpts;
        },
        //格式化已选“筛选条件”
        formatSelectedFilterCondition(optsObj){
            let selectedConditions = [];
            //循环已选属性名
            for(let key in optsObj){
                let selectedByKey = optsObj[key].split(',');
                selectedByKey.forEach(function(item,index){
                    selectedConditions.push({
                        name  : key,
                        value : item
                    })
                })
            }
            return selectedConditions;
        },
        //获取并格式化筛选条件
        getAndFormatFilterCondition(){
            let _self = this;
            let tempCondition = {};
            this.filterConditions.forEach(function(item,index){
                if(index == 0){
                    //将list中的第一个值写入tempCondition对象
                    tempCondition[item.name] = [item.value];
                }else{
                    let isKeyExist = false;
                    //循环tempCondition中的属性名，将其与的选项写入
                    for(let key in tempCondition){
                        if(key == item.name){
                            isKeyExist = true;
                        }
                    }
                    if(isKeyExist){
                        //若属性名已存在，直接push进已有的list中
                        tempCondition[item.name].push(item.value);
                    }else{
                        //若属性名不存在，创建以该属性名为key的list
                        tempCondition[item.name] = [item.value];
                    }
                }
            });
            for(let key in tempCondition){
                tempCondition[key] = _self.common.listToString(tempCondition[key],',');
            }
            return tempCondition;
        },
        //格式化筛选条件forSubmit
        formatFilterConditionForSubmit(){
            let _self = this;
            let filterConditionObj = {
                optional : {},
                selected : _self.getAndFormatFilterCondition()
            };
            //格式化“optional”
            this.filterConditionOpts.forEach(function(item,index){
                filterConditionObj.optional[item.conditionName] = _self.common.listToString(item.conditionOpts,',');
            });
            return filterConditionObj;
        },
        //格式化筛选条件forView
        formatFilterConditionForView(row,column,cellValue,index){
            let tempStr = '';
            if(cellValue){
                let tempSelected = JSON.parse(cellValue).selected;
                tempStr = JSON.stringify(tempSelected).replace('{','').replace('}','');
            }
            return tempStr;
        },
        //切换生成方式
        changeBuildType(){
            let _self = this;
            if(this.accountConfigForm.buildType == 1){
                _self.accountConfigForm.buildFrequency = '';
                _self.accountConfigForm.createTimeStr  = '';
            }
        },
        //选择会计科目
        changeSubject(){
            let _self = this;
            let tempSubjectObj = this.getCurrentSubject();
            console.log(tempSubjectObj);
            this.optMap['LENDDIRECTION'].forEach(function(item,index){
                if(item.dictionaryEntryName == tempSubjectObj.lendDirection){
                   _self.subjectSubmit.lendDirection = item.id;
                }
            });
            this.subjectSubmit.subsidiaryLedgerType = tempSubjectObj.subsidiaryLedgerType;
            this.subjectSubmit.subsidiaryLedger = tempSubjectObj.subsidiaryLedger;
        },
        getCurrentSubject(){
            let _self = this;
            let currentSubject = {};
            this.subjects.forEach(function(item,index){
                if(_self.subjectSubmit.subject == item.id){
                    currentSubject = item;
                }
            });
            return currentSubject;
        },
        //打开新增科目弹框
        newSubject(){
            let _self = this;
            this.dialogConfig.isVisible = true;
            this.subjectSubmit = {
                lendDirection : '',
                subsidiaryLedgerType : null,
                subsidiaryLedger : ''
            };
            this.abstrac1List = [];
            // let tempOpt = Object.assign([],this.optMap['ABSTRACT']);
            // this.optMap['ABSTRACT'] = [];
            // this.optMap['ABSTRACT'] = Object.assign([],tempOpt);
            this.dialogConfig.type = 'new';
        },
        //新增、编辑科目
        addSubjectItem(){
            let _self = this;
            this.subjectSubmit.accountsId = this.accountConfigForm.id;
            this.subjectSubmit.abstract1  = this.common.listToString(this.abstrac1List,',');
            this.subjectSubmit.filterCondition = JSON.stringify(this.formatFilterConditionForSubmit());
            if(this.dialogConfig.type == 'new'){
                api.saveSubject(_self.subjectSubmit,function(res){
                    if(res.code === 200){
                        _self.common.messageUtil({
                            type : 'success',
                            message : res.msg,
                            onClose : function(){
                            }
                        });
                        _self.getConfigDetail();
                        _self.dialogConfig.isVisible = false;
                    }else{
                        _self.common.messageUtil({
                            type : 'info',
                            message : res.msg,
                            onClose : function(){
                            }
                        });
                    }

                })
            }else if(this.dialogConfig.type == 'edit'){
                api.updateSubject(_self.subjectSubmit,function(res){
                    _self.common.messageUtil({
                        type : 'success',
                        message : res.msg,
                        onClose : function(){
                            _self.getConfigDetail();
                            _self.dialogConfig.isVisible = false;
                        }
                    });
                })
            }

        },
        //删除科目
        deleteSubject(id){
            let _self = this;
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteSubject(id,function(res){
                    _self.common.messageUtil({
                        type : 'success',
                        message : res.msg,
                        onClose : function(){
                            _self.getConfigDetail();
                        }
                    });
                });
            }).catch(() => {
                // this.common.messageUtil({
                //     type: 'info',
                //     message: '已取消删除'
                // });
            });
        },
        //保存账务配置
        saveAccountConfig(){
            let _self = this;
            let accConfigObj = {};
            accConfigObj.accountVoucherDto = {};
            accConfigObj.accountVoucherDto.selectedState = this.common.listToString(this.voucherSelectedState,',');
            accConfigObj.accountVoucherDto.id = this.accountConfigForm.voucherInstructions;
            accConfigObj.id = this.accountConfigForm.id;
            accConfigObj.accountNumber = this.accountConfigForm.accountNumber;
            accConfigObj.businessType  = this.accountConfigForm.businessType;
            accConfigObj.voucherInstructions = this.accountConfigForm.voucherInstructions;
            accConfigObj.description = this.accountConfigForm.description;
            accConfigObj.accountMode = this.accountConfigForm.accountMode;
            accConfigObj.jdeAccountModule = this.accountConfigForm.jdeAccountModule;
            accConfigObj.billType  = this.accountConfigForm.billType;
            accConfigObj.buildType = this.accountConfigForm.buildType;
            accConfigObj.buildFrequency = this.accountConfigForm.buildFrequency;
            api.updateAccountConfig(accConfigObj,function(res){
                if(res.code === 200){
                    _self.common.messageUtil({
                        type : 'success',
                        message : res.msg,
                        onClose : function(){
                            _self.cancel();
                        }
                    });
                }else{
                    _self.common.messageUtil({
                        type : 'info',
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









