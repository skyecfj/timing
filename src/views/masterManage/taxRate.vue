<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">业务类型</div>
                <el-select size="small"  v-model="businessType" placeholder="请选择" filterable>
                    <el-option v-for="item in businessTypeOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">税率名称</div>
                <el-select size="small"  v-model="taxRateName" placeholder="请选择" value-key="id" filterable>
                    <el-option label="请选择" value="" ></el-option>
                    <el-option v-for="item in taxRateNameOption" :key="item.value" :label="item.dictionaryEntryName" :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">税率编码</div>
                <el-input size="small"  v-model.trim="taxRateNumber" placeholder="请输入税率编码" clearable></el-input>
            </div>
            <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="reset"  class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="viewButton">
                <el-button size="small"   @click="checkDetail()"  class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableDataTaxRate" style="width: 100%" border>
                <el-table-column prop="id" label="记录ID" width="80px">
                </el-table-column>
                <el-table-column prop="businessType" label="业务类型" min-width="60px">
                </el-table-column>
                <el-table-column prop="taxRateName" label="税率名称" min-width="80px" sortable>
                </el-table-column>
                <el-table-column prop="taxRateNumber" label="税率编码" min-width="50px">
                </el-table-column>
                <el-table-column prop="commencementDate" label="生效日期" min-width="50px" sortable>
                </el-table-column>
                <el-table-column prop="taxRateValue" label="税率(%)" width="80px">
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip content="变更详情" placement="top" effect="light" popper-class="table-cell-toolTip" slot="reference" >
                            <el-button size="small"  class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkLog(scope.row.id)"><i class="fa fa-info-circle"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.id,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip" v-if="scope.row.state != 0" >
                        <el-button size="small"   @click="checkDetail(scope.row.id,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
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
        <el-dialog :visible.sync="taxRateLogDialog" class="dialogContent" width="70%" title="变更详情">
            <el-table :data="logDetailData" style="width: 100%" border>
                <el-table-column prop="fieldName" label="更新字段" min-width="60px">
                </el-table-column>
                <el-table-column prop="startValue" label="原值" min-width="60px">
                </el-table-column>
                <el-table-column prop="updateValue" label="更新值" min-width="80px">
                </el-table-column>
                <el-table-column prop="modifiedUser" label="更新人员" min-width="50px">
                </el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间" min-width="50px" sortable>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleLogSizeChange" @current-change="handleLogCurrentChange" :current-page.sync="currentLogPage"
                    :page-size="pageLogSize" layout="total, sizes, prev, pager, next, jumper" :total="totalLogRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </el-dialog>
        <!--变更详情-->

        <!--新增-->
        <el-dialog :visible.sync="taxRateDialog" class="dialogContent" width="70%">
            <div slot="title">
                {{taxRateDialogTitle}}
            </div>
            <el-form :model="taxRateForm" label-width="110px" :rules="rules" ref="taxRateForm">
                <el-form-item label="业务类型" prop="businessType">
                    <el-select size="small"  v-model="taxRateForm.businessType" placeholder="请选择" :disabled="isDisabled" filterable>
                        <el-option v-for="item in addBusinessTypeOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="税率名称" prop="taxRateName">
                    <el-select  size="small"  v-model="taxRateForm.taxRateName" placeholder="请选择税率名称"
                                value-key="id" :disabled="isDisabled" @change="changeTaxRate"  filterable>
                        <el-option v-for="item in taxRateNameOption" :key="item.value" :label="item.dictionaryEntryName" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="税率编码" prop="taxRateNumber">
                    <el-input size="small"  v-model.trim="taxRateForm.taxRateNumber" disabled clearable placeholder="请输入税率编码" :maxlength="32"></el-input>
                </el-form-item>
                <el-form-item label="生效日期" prop="commencementDate">
                    <el-date-picker v-model="taxRateForm.commencementDate" type="date"
                                    placeholder="请选择生效日期"
                                    :disabled="isDisabled"
                                    clearable
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerDateOption">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="税率(%)" prop="taxRateValue">
                    <el-input size="small"  v-model.trim="taxRateForm.taxRateValue" :disabled="isDisabled" clearable placeholder="请输入税率" :maxlength="10"></el-input>
                </el-form-item>
                <div>
                <el-form-item label="备注">
                    <el-input size="small"  v-model.trim="taxRateForm.remark" :disabled="isDisabled" clearable :autosize="{minRows:8}" :placeholder="isDisabled?'':'请输入(1-100位)'" type="textarea" :maxlength="100"></el-input>
                </el-form-item>
                </div>
                <el-form-item label="更新时间" v-if="!isAdd">
                    <el-date-picker v-model="taxRateForm.modifiedTime" type="datetime" placeholder="" disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人" v-if="!isAdd">
                    <el-input size="small"  v-model.trim="taxRateForm.modifiedUser" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="taxRateDialog = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  @click="newAddForm()" class="c-button c-button--primary">保存</el-button>
            </div>
        </el-dialog>
        <!--新增-->
    </div>
</template>
<script>
import api from '../../model/api'
const defaultTaxRateForm = {
       businessType:'',
       taxRateName:{},
       commencementDate:'',
       taxRate:'',
       modifiedTime:'',
       modifiedUser:'one'
    }
 export default {
     name:'taxRate',
     data(){
         var validTaxRate = (rule, value, callback) => {
            if(parseFloat(value) > 100){
                callback(new Error('数值范围1-100的数字,最多保留两位小数'));
            }else if ((!/^([1-9]\d{0,1}|0|100)(\.\d{1,2})?$/.test(value)) &&!this.common.isNullString(value)) {
                callback(new Error('数值范围1-100的数字,最多保留两位小数'));
            }
            else{
                callback();
            }
        };
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         pageLogSize:25,
         currentLogPage:1,
         totalLogRecords:0,
         matserModule:'主档管理',
         submodule:'税率',
         operationId:'',
         userName:'',
         logDetailData:[],
         businessType:'',
         businessTypeOption:[],
         addBusinessTypeOption:[],
         isAdd:false,
         isDisabled:false,
         taxRateNumber:'',
         taxRateDialog:false,
         taxRateLogDialog:false,
         taxRateDialogTitle:'',
         taxRateForm: Object.assign({},defaultTaxRateForm) ,
         tableDataTaxRate:[],
         taxRateName:'请选择',
         taxRateNameOption:[],
         rules: {
          businessType: [
            { required: true, message: '业务类型不能为空', trigger: 'blur' }
          ],
          taxRateName: [
            { required: true, message: '税率名称不能为空', trigger: 'blur' }
          ],
          taxRateNumber: [
            { required: true, message: '税率编码不能为空', trigger: 'blur' }
          ],
          commencementDate: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          taxRateValue: [
              { required: true, message: '税率不能为空', trigger: 'blur' },
              { validator: validTaxRate, trigger: 'blur'}
          ]
        },
        pickerDateOption:{
            disabledDate(time){
                return time.getTime() < new Date(new Date().getTime() - 24*60*60*1000)
            }
        },
        confirmStashParam : {
            businessType  : '',
            startDate     : '',
            taxRateNumber : ''
        }
      }
    },
    beforeMount(){
      this.getTaxRateList()
      this.getTaxRateSearchType()
      this.getTaxRateNameList()
    },
     methods:{
         handleLogSizeChange(val){
             this.pageLogSize = val
             this.getTaxRateLogList()
         },
         handleLogCurrentChange(val) {
              this.currentLogPage = val
              this.getTaxRateLogList();
         },
         handleSizeChange(val) {
              this.pageSize = val
              this.getTaxRateList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getTaxRateList();
         },
         search(){
             this.currentPage = 1
             this.getTaxRateList();
         },
         reset(){
           this.businessType = ''
           this.taxRateName = '请选择'
           this.taxRateNumber = ''
         },
         checkLog(taxRateId){
             this.operationId = taxRateId
             this.taxRateLogDialog = true
             this.pageLogSize = 10
             this.currentLogPage = 1
             this.getTaxRateLogList()
         },
         checkDetail(taxRateId,isEdit){
            var that = this;
            this.confirmStashParam = {
                businessType  : '',
                startDate     : '',
                taxRateNumber : ''
            }
            if(!taxRateId){
                this.isAdd = true;
                this.isDisabled = false;
                this.taxRateForm = Object.assign({},defaultTaxRateForm)
            }else{
                this.taxRateDialogTitle = isEdit ? '税率-编辑':'税率-详情';
                this.isAdd = false;
                this.isDisabled = !isEdit;
            }
           this.taxRateDialog = true
           if(this.$refs.taxRateForm){
                 this.$refs.taxRateForm.resetFields()
           }
           if(taxRateId){
               this.getTaxDetail(taxRateId,isEdit);
           }

         },
        getTaxDetail(taxRateId,isEdit){
            let that = this;
            api.getTaxRateById(taxRateId,function(res){
                that.taxRateForm = res.data
                that.confirmStashParam = {
                    businessType  : res.data.businessType,
                    startDate     : res.data.commencementDate,
                    taxRateNumber : res.data.taxRateNumber
                }
                that.taxRateForm.businessType = parseInt(res.data.businessType)
                that.taxRateNameOption.forEach(function(item,index){
                    if(res.data.taxRateName == item.id){
                        that.taxRateForm.taxRateName = item;
                    }
                });
                // if(isEdit){
                //     that.taxRateForm.commencementDate > that.getCurrentDate() ? that.$set(that.taxRateForm,'updateFlag',false) :
                //     that.$set(that.taxRateForm,'updateFlag',true)
                // }
            })
         },
         deleteRow(taxRateId){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                 var param = [
                 {
                    name:'id',
                    value:taxRateId
                 },
                 {
                   name:'module',
                   value: this.matserModule
                },
                {
                   name:'subModule',
                   value:this.submodule
                }]
                api.deleteTaxRate(this.common.joinSearchParam(param),function(res){
                 res.code == 200 ? (that.showTips(res.data,'success'),that.getTaxRateNameList() ,that.getTaxRateList()): that.showTips(res.msg,'warning')
               })
        }).catch(() => {
             this.common.messageUtil({
                type: 'info',
                message: '已取消删除'
               });
            });
         },
         newAddForm(){
             var that = this
              this.$refs.taxRateForm.validate((valid) => {
                    if (valid) {
                        var param = [
                        {
                        name:'module',
                        value: that.matserModule
                        },
                        {
                        name:'subModule',
                        value:that.submodule
                        }]
                        var submitTaxRateForm = {
                            id:that.taxRateForm.id,
                            businessType:that.taxRateForm.businessType,
                            taxRateName:that.taxRateForm.taxRateName.id,
                            taxRateNumber:that.taxRateForm.taxRateNumber,
                            commencementDate:that.taxRateForm.commencementDate,
                            taxRate:that.taxRateForm.taxRateValue,
                            remark:that.taxRateForm.remark
                        }
                        let confirmParam = {
                            businessType : that.taxRateForm.businessType,
                            startDate : that.taxRateForm.commencementDate,
                            taxRateNumber : that.taxRateForm.taxRateNumber
                        }
                        let needConfirm = false;
                        for(let key in confirmParam){
                            if(confirmParam[key] != that.confirmStashParam[key]){
                                needConfirm = true;
                            }
                        }
                        if(that.isAdd){
                            api.validateTaxRate(confirmParam,function(res){
                                if(res.data && res.data === true){
                                   that.doAddTaxRate(param,submitTaxRateForm);
                                }else{
                                    that.showTips('业务类型、税率编码、生效时间不能同时相同','warning')
                                }
                            })
                        }else{
                            if(needConfirm){
                                api.validateTaxRate(confirmParam,function(res){
                                    if(res.data && res.data === true){
                                        that.doEditTaxRate(param,submitTaxRateForm);
                                    }else{
                                        that.showTips('业务类型、税率编码、生效时间不能同时相同','warning')
                                    }
                                })
                            }else{
                                that.doEditTaxRate(param,submitTaxRateForm);
                            }
                        }

                    } else {
                        return false;
                    }
            });
         },
         doAddTaxRate(param,submitTaxRateForm){
            let that = this;
            api.addTaxRate(that.common.joinSearchParam(param),submitTaxRateForm,function(res){
                if(res.code === 200){
                    that.showTips(res.data,'success');
                    that.$refs.taxRateForm.resetFields()
                    that.taxRateDialog = false;
                    that.getTaxRateList();
                }else{
                    that.showTips(res.msg,'warning')
                }
            })
         },
         doEditTaxRate(param,submitTaxRateForm){
            let that = this;
            api.updateTaxRate(that.common.joinSearchParam(param),submitTaxRateForm,function(res){
                if(res.code === 200){
                    that.showTips(res.data,'success');
                    that.$refs.taxRateForm.resetFields()
                    that.taxRateDialog = false;
                    that.getTaxRateList();
                }else{
                    that.showTips(res.msg,'warning')
                }
            })
         },
         getTaxRateSearchType(){
             var that = this
             that.businessTypeOption = []
            api.getDictionaryByNumber('MASTERDATA_BUESSINISS_TYPE',function(res){
                that.businessTypeOption = []
                that.addBusinessTypeOption = []
                that.businessTypeOption.push(
                        {
                            value:'',
                            label:'请选择'
                        })
                res.data.forEach(function(item,index){
                    that.businessTypeOption.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        })
                    that.addBusinessTypeOption.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        })
                })
            })

         },

        changeTaxRate(){
            this.taxRateForm.taxRateNumber = this.taxRateForm.taxRateName.dictionaryEntryCode;
        },
         getTaxRateNameList(){
             var that = this
             that.taxRateNameOption = []
             api.getDictionaryByNumber('TAX_CODE_VALUE',function(res){
                that.taxRateNameOption = []
                that.taxRateNameOption = that.taxRateNameOption.concat(res.data);
            })
         },
         getTaxRateLogList(){
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
                   value:this.submodule
               },
               {
                   name:'operationId',
                   value:this.operationId
               }]
               api.getDataLog(this.common.joinSearchParam(param),function(res){
                        that.logDetailData = [];
                        that.totalLogRecords = 0;
                        if(res.code === 200)
                        {
                             that.logDetailData = res.data.list;
                             that.totalLogRecords = res.data.totalRecords;
                        }
                        else if(res.code != 404){
                            that.showTips(res.msg,'warning')
                        }
               })
         },
         getTaxRateList(){
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
                    name:'taxRateName',
                    value:this.taxRateName == '请选择' ? '' : this.taxRateName.id
                 },
                 {
                    name:'businessType',
                    value:this.businessType
                 },
                 {
                    name:'taxRateNumber',
                    value:this.taxRateNumber
                 }]
               api.getTaxRateData(this.common.joinSearchParam(param),function(res){
                        that.tableDataTaxRate = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.tableDataTaxRate = res.data.list;
                             that.totalRecords = res.data.totalRecords;
                        }
                        else if(res.code != 404){
                            that.showTips(res.msg,'warning')
                        }
                })
         },
        getCurrentDate(){
            var currentDate = new Date()
            var currentYear = currentDate.getFullYear()
            var currentMonth = currentDate.getMonth() + 1
            currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth
            var currentDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
            var currentDateString = currentYear + '-' + currentMonth +'-'+currentDay
            return currentDateString.toString()
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
<style lang="scss">
.viewButton {margin-bottom: 10px;text-align: right}
</style>
