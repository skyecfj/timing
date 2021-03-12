<template>
  <div class="mainContent">
      <div class="searchContent">
        <div class="selectContent">
          <div class="selectTitle">交易日期<br><span class="tips" >所选择结算日期的截止日期应与结算报告一致</span></div>
          <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                          end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
          </el-date-picker>
          <!-- <el-date-picker v-model="tradeStartTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
          <span>-</span>
          <el-date-picker v-model="tradeEndTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker> -->
        </div>
        <div class="selectContent">
          <div class="selectTitle">活动名称</div>
          <el-select size="small" v-model="activityId" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in activitySelect" :key="item.activityId" :label="item.activityName" :value="item.activityId">
            </el-option>
          </el-select>
        </div>
        <!-- <div class="selectContent">
          <div class="selectTitle">活动类型</div>
          <el-select size="small" v-model="activityType">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in activtyTypeSelect" :key="item.activityTypeId" :label="item.activityTypeName" :value="item.activityTypeId">
            </el-option>
          </el-select>
        </div> -->
        <div class="selectContent">
          <div class="selectTitle">法人公司/开票单位</div>
          <el-select size="small"  v-model="dealType" filterable>
            <el-option label="法人公司" value="0"></el-option>
            <el-option label="开票单位" value="1"></el-option>
          </el-select>
        </div>
        <div class="selectContent" v-if="dealType == '0'" key="companySearchSelected" >
          <div class="selectTitle">法人公司</div>
          <el-select size="small"  v-model="companyCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in companyCodeSelect" :key="item.companyCode" :label="item.companyName" :value="item.companyCode">
            </el-option>
          </el-select>
        </div>
        <div class="selectContent" v-if="dealType == '1'" key="billUnitSearchSelected" >
          <div class="selectTitle">开票单位</div>
          <el-select size="small"  v-model="billingUnitCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in billingUnitCodeSelect" :key="item.billingUnitCode" :label="item.billingUnitName" :value="item.billingUnitCode">
            </el-option>
          </el-select>
        </div>
        <div class="selectContent">
          <div class="selectTitle">餐厅类型</div>
          <el-select size="small"  v-model="storeType" >
          	<el-option value="" label="请选择"></el-option>
            <el-option value="FR" label="加盟" ></el-option>
            <el-option value="!FR" label="直营" ></el-option>
          </el-select>
        </div>
        <el-button size="small" @click="search" class="c-button c-button--primary">查询</el-button>
        <el-button size="small" @click="resetSerchParam" class="c-button c-button--plain">重置</el-button>
        <!--<el-button size="small" @click="handleReport" class="c-button c-button--primary">手动生成报告</el-button>-->
        <el-button size="small" class="c-button c-button--primary" @click="exportReport" :disabled="disabled"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
      </div>
      <div class="dataContent">
        <el-table :data="tableData" style="width: 100%;" border>
          <el-table-column prop="activityName" label="活动名称" width="130px" ></el-table-column>
          <el-table-column prop="activityTypeName" label="活动类型" width="130px" ></el-table-column>
          <el-table-column prop="storeType" label="餐厅类型" width="100px" ></el-table-column>
          <el-table-column prop="companyCodeAndBillingUnitCode" width="120px" >
            <template slot="header" slot-scope="scope">
              法人公司/<br>开票单位编号
            </template>
          </el-table-column>
          <el-table-column prop="companyNameAndBillingUnitName" label="法人公司/开票单位名称" min-width="210px" ></el-table-column>
          <el-table-column prop="allBillBalanceAmount" label="全单应结算金额" width="110px" ></el-table-column>
          <el-table-column prop="balanceActuralAmount" width="120px" >
            <template slot="header" slot-scope="scope">
              非全单应结算金额<br>（顾客实付）
            </template>
          </el-table-column>
          <el-table-column prop="balanceThirdSubsidyAmount" width="120px" >
            <template slot="header" slot-scope="scope">
              非全单应结算金额<br>（第三方补贴）
            </template>
          </el-table-column>
          <el-table-column prop="confirmAmount" label="已确认结算金额" width="110px" ></el-table-column>
          <el-table-column prop="noConfirmAmount" label="未确认结算金额" width="110px" ></el-table-column>
        </el-table>
        <!--<div class="pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizeList" :total="totalRecords">
          </el-pagination>
        </div>-->
      </div>
    <el-dialog :visible.sync="handleRepDialog" class="dialogContent" width="70%">
      <div slot="title">手动生成报告</div>
      <el-form :model="handleRepForm" label-width="110px" ref="handleRepForm" :rules="rules">
    	  <el-form-item label="交易日期" prop="rangeDate">
          <el-date-picker size="small" v-model="handleRepForm.rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="onDialogRangeDatePick" @change="dialogRangeDateChange" value-format="yyyy-MM-dd" >
          </el-date-picker>
          <!-- <el-date-picker v-model="handleRepForm.tradeStartTime " type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerHandleStart"></el-date-picker> -->
        </el-form-item>
        <!-- <el-form-item label="交易结束日期" prop="tradeStartTime">
          <el-date-picker v-model="handleRepForm.tradeEndTime "  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerHandleEnd"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="法人公司" prop="companyCode" >
          <el-select size="small"  v-model="handleRepForm.companyCode" filterable>
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="item in companyCodeOption" :key="item.companyCode" :label="item.companyName" :value="item.companyCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票单位" prop="billingUnitCode" >
          <el-select size="small"  v-model="handleRepForm.billingUnitCode" filterable>
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="item in billingUnitCodeOption" :key="item.billingUnitCode" :label="item.billingUnitName" :value="item.billingUnitCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="activityName">
          <el-select size="small"  v-model="handleRepForm.activityName" filterable>
            <el-option v-for="item in activityOption" :key="item.activityId" :label="item.activityName" :value="item.activityName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型" prop="activityType">
          <el-select size="small"  v-model="handleRepForm.activityType">
            <el-option v-for="item in activityTypeOption" :key="item.activityTypeId" :label="item.activityTypeName" :value="item.activityTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态" prop="activityStatusId">
          <el-select size="small"  v-model="handleRepForm.activityStatusId">
            <el-option v-for="item in activtyStatusOption" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small"  @click="handleRepDialog = false" class="c-button c-button--plain">取消</el-button>
        <el-button size="small"  @click="submits('handleRepForm')" class="c-button c-button--primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apidr from '@/model/apidr'

export default {
  name: 'activeSettlement',
  watch:{
    tradeStartTimeVal(val,oldVal){
        this.onRangeDatePick = Object.assign({},{
            onPick:(dateRange)=>{
              this.tradeStartTimeVal =  new Date(dateRange.minDate).getTime();
              this.tradeEndTimeVal =  new Date(dateRange.maxDate).getTime();
            },
            disabledDate: (time) => {
              if(val){
                return time.getTime() <= this.tradeStartTimeVal-31*24*60*60*1000 || time.getTime() >= this.tradeStartTimeVal + 31*24*60*60*1000
              }else{
                return false;
              }
            }
      });
    },
    dialogStartTimeVal(val,oldVal){
        this.onDialogRangeDatePick = Object.assign({},{
            onPick:(dateRange)=>{
              this.dialogStartTimeVal =  new Date(dateRange.minDate).getTime();
              this.dialogEndTimeVal =  new Date(dateRange.maxDate).getTime();
            },
            disabledDate: (time) => {
              if(val){
                return time.getTime() <= this.dialogStartTimeVal-31*24*60*60*1000 || time.getTime() >= this.dialogStartTimeVal + 31*24*60*60*1000
              }else{
                return false;
              }
            }
      });
    }

  },
  data () {
    return {
    	onRangeDatePick: {
        onPick:(dateRange)=>{
          this.tradeStartTimeVal =  new Date(dateRange.minDate).getTime();
          this.tradeEndTimeVal =  new Date(dateRange.maxDate).getTime();
        }
      },
    	onDialogRangeDatePick: {
        onPick:(dateRange)=>{
          this.dialogStartTimeVal =  new Date(dateRange.minDate).getTime();
          this.dialogEndTimeVal =  new Date(dateRange.maxDate).getTime();
        }
      },
      rangeDate: [],
      tradeStartTimeVal: '',
      tradeEndTimeVal: '',
      tradeStartTime: '',
      tradeEndTime: '',
      billingUnitCode: '',
      companyCode: '',
      activityType: '',
      activityStatus: '',
      activityId: '',
      storeType: null,
      companyCodeSelect: [],
      billingUnitCodeSelect: [],
      activtyTypeSelect: [],
      activtyStatusSelect: [{
        name: '进行中',
        value: 0
      }, {
        name: '未开始',
        value: 1
      }, {
        name: '已关闭',
        value: 2
      }],
      activitySelect: [],
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      totalRecords: 3,
      currentPage: 1,
      pageSize: 25,
      disabled: true,
      handleRepDialog: false,
      handleRepForm: {
        tradeStartTime: '',
        tradeEndTime: '',
        companyCode: '',
        billingUnitCode: '',
        activityType: '',
        activityStatusId: '',
        activityName: '',
        rangeDate : []
      },
      dialogStartTimeVal: '',
      dialogEndTimeVal: '',
      rules: {
        rangeDate: [{ required: true, message: '请选交易日期', trigger: 'change' }],
        activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        activityStatusId: [{ required: true, message: '请选择活动状态', trigger: 'change' }],
        activityName: [{ required: true, message: '请选择活动名称', trigger: 'change' }],
      },
      companyCodeOption: [],
      billingUnitCodeOption: [],
      activityOption: [],
      activityTypeOption: [],
      activtyStatusOption: [{
        name: '草稿',
        value: 1
      }, {
        name: '未开始',
        value: 2
      }, {
        name: '启用中',
        value: 3
      }, {
        name: '已结束',
        value: 4
      }],
      uuidCode: '',
      dealType: '0'
    }
  },
  methods: {
    rangeDateChange(){
      if(this.rangeDate){
        this.tradeStartTime = this.rangeDate[0];
        this.tradeEndTime = this.rangeDate[1];
      }else{
        this.tradeStartTime = '';
        this.tradeEndTime = '';
        this.tradeStartTimeVal = '';
        this.tradeEndTimeVal = '';
      }
    },
    dialogRangeDateChange(){
      if(this.handleRepForm.rangeDate){
        this.handleRepForm.tradeStartTime = this.handleRepForm.rangeDate[0];
        this.handleRepForm.tradeEndTime = this.handleRepForm.rangeDate[1];
      }else{
        this.handleRepForm.tradeStartTime = '';
        this.handleRepForm.tradeEndTime = '';
        this.tradeStartTimeVal = '';
        this.tradeEndTimeVal = '';
      }
    },
  	handleSizeChange (val) {
      this.pageSize = val
      this.getSettlementList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSettlementList()
    },
    search () {
      if(!this.tradeStartTimeVal || !this.tradeEndTimeVal){
        this.showTips('请选择结算日期','warning');
        return false;
      }
      if(!this.activityId){
        this.showTips('请选择活动名称','warning');
        return false;
      }
      this.getSettlementList()
      // if (!this.tradeStartTime || !this.tradeEndTime) {
      //   this.showTips('请选择交易日期','warning')
      // } else if (!this.activityId) {
      //   this.showTips('请选择活动名称','warning')
      // } else {
      //   this.getSettlementList()
      // }
    },
    resetSerchParam () {
      this.tradeStartTime = ''
      this.tradeEndTime = ''
      this.companyCode = ''
      this.billingUnitCode = ''
      this.activityType = ''
      this.activityStatus = ''
      this.activityId = ''
      this.rangeDate = []
      this.tradeStartTimeVal = '';
      this.tradeEndTimeVal = '';
      this.storeType = null;
    },
    handleReport () {
      this.handleRepDialog = true
      if (this.$refs.handleRepForm) {
        this.$refs['handleRepForm'].resetFields()
      }
    },
    exportReport () {
      let that = this
      // let filePath = this.tableData[0].filePath
      // let nameArr = filePath.split('/')
      // let name = nameArr[nameArr.length - 1]
      // nameArr.splice(nameArr.length - 1, 1)
      // let path = nameArr.join('/')
      // let fileInfo = {
      //   fileName: name,
      //   filePath: path
      // }
      if(!this.tradeStartTimeVal || !this.tradeEndTimeVal){
        this.showTips('请选择结算日期','warning');
        return false;
      }
      if(!this.activityId){
        this.showTips('请选择活动名称','warning');
        return false;
      }
      let param = {
        activityId : this.activityId,
        // activityType : this.activityType,
        statisticType : this.dealType,
        billingUnitCode : this.billingUnitCode,
        companyCode : this.companyCode,
        storeType : this.storeType,
        tradeStartTime : this.tradeStartTime,
        tradeEndTime : this.tradeEndTime
      }
      apidr.exportActivitySettlementRepo(param, 'application/vnd.ms-excel', function(res){
        if(res.code){
          that.common.warningMessage(res.msg)
        }else{
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '活动结算统计报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    submits (form) {
      this.$refs[form].validate((valid) => {
        if(valid){
          this.handleSettlementReport()
        } else {
          return false
        }
      })
    },
    getActivitySelect () {
      let that = this
      let pathParams = [{
      	name: 'thirdId',
        value: ''
      }]
      apidr.getActivitySelect(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.activitySelect = res.data
          that.activityOption = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getActivityType () {
      let that = this
      apidr.getActivityType(function(res){
        if (res.code === 200) {
          that.activtyTypeSelect = res.data
          that.activityTypeOption = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getBillingUnit () {
      let that = this
      apidr.getBillingUnit(function(res){
        if (res.code === 200) {
          that.billingUnitCodeSelect = res.data
          that.billingUnitCodeOption = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCompany () {
      let that = this
      apidr.getCompany(function(res){
        if (res.code === 200) {
          that.companyCodeSelect = res.data
          that.companyCodeOption = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getSettlementList () {
    	let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'tradeStartTime',
        value: this.tradeStartTime
      }, {
      	name: 'tradeEndTime',
        value: this.tradeEndTime
      }, {
      	name: 'companyCode',
        value: this.companyCode
      }, {
      	name: 'billingUnitCode',
        value: this.billingUnitCode
      }, 
      // {
      // 	name: 'activityType',
      //   value: this.activityType
      // },
       {
        name: 'activityStatus',
        value: this.activityStatus
      }, {
        name: 'activityId',
        value: this.activityId
      },{
        name: 'storeType',
        value: this.storeType
      },{
        name: 'statisticType',
        value: this.dealType
      }]
      apidr.getSettlementList(this.common.joinSearchParam(pathParams), function(res){
      	that.tableData = []
//    	that.totalRecords = 0
        if (res.code === 200) {
          that.disabled = false
          that.tableData = res.data
//        that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    handleSettlementReport() {
      let that = this
      let param = [{
        name: 'activityId',
        value: this.getOptionId(this.handleRepForm.activityName, this.activityOption)
      }, {
        name: 'activityName',
        value: this.handleRepForm.activityName
      }, {
        name: 'companyCode',
        value: this.handleRepForm.companyCode
      }, {
        name: 'billingUnitCode',
        value: this.handleRepForm.billingUnitCode
      }, {
        name: 'activityType',
        value: this.handleRepForm.activityType
      }, {
        name: 'activityStatusId',
        value: this.handleRepForm.activityStatusId
      }, {
        name: 'uuidCode',
        value: this.uuidCode
      }, {
        name: 'tradeStartTime',
        value: this.handleRepForm.tradeStartTime
      }, {
        name: 'tradeEndTime',
        value: this.handleRepForm.tradeEndTime
      }]
      apidr.handleSettlementReport(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
        	that.handleRepDialog = false
          that.showTips('手动生成报告成功', 'success')
          that.getSettlementList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getOptionId (name, arr) {
      let id = ''
      arr.forEach(function(v, i) {
        if (v.activityName) {
        	id = v.activityId
        }
      })
      return id
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
  	this.getActivityType()
    this.getBillingUnit()
    this.getCompany()
    this.getActivitySelect()
  }
}
</script>


<style scoped>
.el-date-editor--daterange.el-input__inner{
  width: 290px;
}
.tips{
  /* color: #a5a5a5 */
  font-size: 12px;
}
</style>
