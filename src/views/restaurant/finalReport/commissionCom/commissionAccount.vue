<template>
  <div class="coupon-account">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">交易日期</div>
        <el-date-picker v-model="rangeDate" type="daterange" value-format="yyyy-MM-dd" @change="dateRangeChange" size="small"
                        range-separator="-" start-placeholder="开始日期"  end-placeholder="结束日期" :picker-options="onRangeDatePick" ></el-date-picker>
        <!-- <el-date-picker v-model="startDate" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="endDate"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker> -->
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
          <el-select size="small"  v-model="brandType" filterable>
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="item in brandSelect" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">第三方</div>
          <el-select size="small"  v-model="thirdParty" @change="thirdChange" filterable remote :remote-method="remoteMethod" v-scroll="scrollLoading" :loading="loading">
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="item in thirdSelect" :key="item.thirdId" :label="item.thirdName" :value="item.thirdId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动名称</div>
          <el-select size="small"  v-model="activeName" @change="activeChange" filterable>
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="item in activeSelect" :key="item.activityId" :label="item.activityName" :value="item.activityId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">结算状态</div>
          <el-select size="small"  v-model="accountState">
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="item in accountSelect" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchData">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="handleReport">手动生成报告</el-button>
      <el-button size="small" type="success"  @click="importFile">上传</el-button>
      <el-button size="small"  @click="exportTemplateFile" class="c-button c-button--primary"><i class="fa fa-download c-button-icon--left"></i>模板下载</el-button>
    </div>
    <div class="dataContent" >
      <el-table :data="commissionDatas" @selection-change="handleSelectionChange" style="width: 100%" border>
        <el-table-column prop="activityName" label="活动名称"></el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column prop="thirdName" label="第三方" ></el-table-column>
        <el-table-column prop="balanceCycle" label="结算周期" width="170px">
          <template slot-scope="scope">
            <span>{{ scope.row | checkBalanceCycle }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balanceAmount" label="结算金额（单位：元）" width="150px"></el-table-column>
        <el-table-column prop="chargeType" label="费用类型" width="85px">
          <template slot-scope="scope">
            <span v-if="scope.row.chargeType == 1">手续费</span>
            <span v-if="scope.row.chargeType == 2">服务费</span>
          </template>
        </el-table-column>
        <el-table-column prop="handleStatus" label="执行情况" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.handleStatus | checkHandleStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balanceStatus" label="结算状态" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.balanceStatus | checkBalanceStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" >
          <template slot-scope="scope">
          	<el-tooltip   content="下载" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button  size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="downloadList(scope.row.filePath)"
                          :disabled="scope.row.handleStatus != 2"><i class="fa fa-download"></i></el-button>
           </el-tooltip>
            <el-tooltip   content="确认结算" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button  size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="affirmBalance(scope.row.id)"
                          :disabled="scope.row.balanceStatus == 1 || scope.row.handleStatus != 2" ><i class="fas fa-check-circle"></i></el-button>
            </el-tooltip>
          	<el-tooltip   content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button  size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="deleteList(scope.row.id)"
                          :disabled="scope.row.balanceStatus == 1" ><i class="fa fa-trash-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip  content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="detailList(scope.row.id,scope.row.chargeType)"
                         :disabled="scope.row.handleStatus != 2"><i class="fa fa-file-alt"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
    	  @size-change="handleSizeChange"
    	  @current-change="handleCurrentChange"
    	  :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords" :page-sizes="pageSizeList">
        </el-pagination>
      </div>
    </div>
    <handle-rep-com :isShow="isShow" :type='type' :chargeTypeOptFlag="chargeTypeOptFlag" @submitForm="submits" @close="close"></handle-rep-com>
    <!--上传文件-->
    <el-dialog :visible.sync="importOpreDialog" class="dialogContent" width="40%"   title="上传文件" :close-on-click-modal='false'>
      <el-form :model="importForm" label-width="75px" ref="importForm" >
        <el-form-item label="费用类型" prop="chargeType" :rules="{ required : true, message : '请选择费用类型', trigger : 'change'}" >
          <el-select size="small"  v-model="importForm.chargeType"  >
            <el-option label="手续费" value="1"></el-option>
            <el-option label="服务费" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div  class="loadFileContent" v-loading="loadFile"
        element-loading-text="上传中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="transparent">
        <el-upload :action="importUrl"  ref="importCommodity"
          :file-list="fileList"
          :on-change="handleChange"
          :auto-upload="false"
          :before-upload="beforeFileUpload"
          :on-remove="removeFile"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          accept=".xlsx">
          <el-button size="small" class="c-button c-button--primary">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx格式文件,且不超过50M</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button size="small"  @click="cancelUpload" class="c-button c-button--plain">取 消</el-button>
          <el-button size="small"  type="primary" @click="importCommodity" class="c-button c-button--primary" :disabled="uploadDisabled">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/model/api'
import apidr from '@/model/apidr'
import Main from '@/main'
import  ip from '@/model/tempIp'
import handleRepCom from '../handleRepCom'
import scroll from '@/directives/index'

export default {
  name: 'commissionAccount',
  watch:{
    startTimeVal(val,oldVal){
      this.onRangeDatePick = Object.assign({},{
        onPick:(dateRange)=>{
          this.startTimeVal =  new Date(dateRange.minDate).getTime();
          this.endTimeVal =  new Date(dateRange.maxDate).getTime();
        },
        disabledDate: (time) => {
          if(val){
            return time.getTime() <= this.startTimeVal-180*24*60*60*1000 || time.getTime() >= this.startTimeVal + 180*24*60*60*1000
          }else{
            return false;
          }
        }
      });
    }
  },
  data () {
    return {
      importForm : {
        chargeType : null
      },
      onRangeDatePick: {
        onPick:(dateRange)=>{
          this.startTimeVal =  new Date(dateRange.minDate).getTime();
          this.endTimeVal =  new Date(dateRange.maxDate).getTime();
        }
      },
      rangeDate:[],
      startTimeVal: '',
      endTimeVal: '',
      startDate: '',
      endDate: '',
      brandType: '',
      brandSelect: [],
      thirdParty: '',
      thirdSelect: [],
      activeName: '',
      activeSelect: [],
      accountState: 0,
      accountSelect: [{
        id: 1,
        value: '已结算'
      }, {
        id: 0,
        value: '未结算'
      }],
      commissionDatas: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      isShow: false,
      type: '3',
      activityNameOption: [],
      importOpreDialog:false,
      fileList:[],
      importUrl:'',
      uploadDisabled:true,
      loadFile:false,
      isTimeOut:false,
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId: '',
      chargeTypeOptFlag: ''
    }
  },
  components: {
    handleRepCom
  },
  directives: {
    scroll
  },
  methods: {
    dateRangeChange(){
      if(this.rangeDate){
        this.startDate = this.rangeDate[0];
        this.endDate = this.rangeDate[1];
      }else{
        this.startDate = '';
        this.endDate = '';
        this.startTimeVal = '';
        this.endTimeVal = '';
      }
    },
    remoteMethod (query) {
      this.pageNumber = 1
  	  this.loading = true
  	  if (query !== '' && query !== '请选择') {
        this.query = query
      } else {
        this.query = ''
      }
      this.getThirdSelect()
    },
    scrollLoading (param) {
  	  if (param) {
  	    this.pageNumber +=1
  	    this.getThirdSelect()
  	  }
  	},
  	activeChange (val) {
  	  this.curActiveId = val
      this.brandType = ''
  	  this.getThirdSelect()
      this.getBrandSelect(val)
  	},
  	thirdChange (val) {
  	  this.curThirdId = val
  	  this.getActivitySelect()
  	},
  	handleSizeChange (val) {
      this.pageSize = val
      this.getBalanceList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getBalanceList()
    },
    searchData () {
			this.getBalanceList()
    },
    reset () {
      this.startDate = ''
      this.endDate = ''
      this.brandType = ''
      this.thirdParty = ''
      this.activeName = ''
      this.accountState = ''
      this.rangeDate = []
      this.startTimeVal = '';
      this.endTimeVal = '';
    },
    handleReport () {
      this.isShow = true
    },
    importFile(){
      this.importOpreDialog = true
      this.fileList =[]
      this.uploadDisabled = true
      this.loadFile = false
      this.isTimeOut = false
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    importCommodity(){
      this.$refs.importForm.validate((valid) =>{
        if(valid){
          this.loadFile = true
          this.$refs.importCommodity.submit();
          this.uploadDisabled = true
        }
      });
    },
    cancelUpload(){
      this.importOpreDialog = false
    },
    uploadError(err, file, fileList){
      this.loadFile = false
      this.isTimeOut = true
      this.showTips('请求超时','warning')
    },
    uploadSuccess(response, file, fileList){
      if (response.code === 200) {
        this.$refs.importCommodity.clearFiles();
        this.importOpreDialog = false
        this.reset()
        this.showTips(response.data,'success')
        this.getBalanceList()
      } else {
        this.showTips(response.msg,'warning')
      }
    },
    exportTemplateFile(){
      let _self = this;
      let param = {
        fileName : '手续费导入模板.xlsx',
        filePath : '/fsc/third-sales-promotion/HandleCharge/Model'
      }
      apidr.downBalanceList(param, 'application/vnd.ms-excel', function(res){
        if(res.code){
          _self.common.warningMessage(res.msg)
        }else{
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = param.fileName
          link.target = '_blank';link.click()
        }
      })
    },
    beforeFileUpload(file){
      let _self = this;
      let Xls = file.name.split('.');
      const isLt50M = file.size / 1024 / 1024 <= 50
      if(Xls[Xls.length - 1] === 'xls'||Xls[Xls.length - 1] === 'xlsx'){
        return new Promise((resolve, reject) => {
          this.$nextTick(() => {
            _self.importUrl = ip.third_sales_ip + '/handle-charge/importHandleCharge?chargeType=' + _self.importForm.chargeType
            resolve()
          })
        })
      }else {
        this.showTips('上传文件只能是 xls/xlsx 格式!','warning')
        return false
      }
      if(!isLt50M){
        this.showTips('不能超过50M!','warning')
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
      if (file.response || this.isTimeOut) {
        this.fileList = []
        this.uploadDisabled = true
        this.loadFile = false
      }
    },
    downloadList (filePath) {
      this.downBalanceList(filePath)
    },
    affirmBalance (id) {
      let that = this
    	this.$confirm('确认结算后无法取消，是否确认结算?', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.updateChargeStatus(id)
      }).catch(() => {
        //that.common.infoMessage('已取消')
      })
    },
    deleteList (id) {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delChargeList(id)
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    detailList (id,chargeType) {
      this.$router.push({name: 'commissionChargeRep', query: {id: id,chargeType}, params: {parentRoute:this.$route.fullPath}})
    },
    submits(formData) {
      let that = this
      let param = [{
        name: 'activityId',
        value: formData.activityId
      }, {
        name: 'activityName',
        value: formData.activityName
      }, {
        name: 'thirdId',
        value: formData.thirdId
      }, {
        name: 'thirdName',
        value: formData.thirdName
      }, {
        name: 'tradeStartTime',
        value: formData.tradeStartTime
      }, {
        name: 'tradeEndTime',
        value: formData.tradeEndTime
      }, {
        name: 'chargeType',
        value: formData.chargeType
      }]
      apidr.handleChargeReport(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
        	that.isShow = false
          that.showTips('手动生成报告成功', 'success')
          that.getBalanceList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    close () {
      this.isShow = false
    },
    getBrandSelect (activityId) {
      let that = this
      this.brandSelect = [];
      let param = activityId? this.common.formatPathParam({
        activityId : activityId
      }) : ''
      apidr.getBrandSelect(param,function(res){
        if (res.code === 200) {
          that.brandSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getThirdSelect () {
      let that = this
      let pathParams = [{
      	name: 'thirdName',
        value: this.query
      }, {
      	name: 'pageNumber',
        value: this.pageNumber
      }, {
      	name: 'activityId',
        value: this.curActiveId
      }]
      apidr.getThirdSelect(this.common.joinSearchParam(pathParams), function(res){
        that.loading = false
        if (res.code === 200) {
          that.thirdSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getActivitySelect () {
      let that = this
      let pathParams = [{
      	name: 'thirdId',
        value: this.curThirdId
      },{
      	name: 'businessType',
        value: this.type
      }]
      apidr.getActivitySelect(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.activeSelect = res.data
          that.activityNameOption = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getBalanceList () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'balanceStartDate',
        value: this.startDate
      }, {
      	name: 'balanceEndDate',
        value: this.endDate
      }, {
      	name: 'brandId',
        value: this.brandType
      }, {
      	name: 'thirdId',
        value: this.thirdParty
      }, {
      	name: 'activityId',
        value: this.activeName
      }, {
        name: 'balanceStatus',
        value: this.accountState
      }, {
        name: 'businessType',
        value: '3'
      }]
      apidr.getBalanceList(this.common.joinSearchParam(pathParams), function(res){
      	that.commissionDatas = []
      	that.totalRecords = 0
        if (res.code === 200) {
          that.commissionDatas = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    downBalanceList (filePath) {
      let that = this
      this.common.checkFilePath(filePath).forEach(function(value, index) {
        apidr.downBalanceList(value, 'application/vnd.ms-excel', function(res){
          if(res.code){
            that.common.warningMessage(res.msg)
          }else{
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = value.fileName
            link.target = '_blank';link.click()
          }
        })
      })
    },
    updateChargeStatus (id) {
      let that = this
      let param = [{
        name: 'id',
        value: id
      }]
      apidr.updateChargeStatus(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.getBalanceList()
          that.showTips('结算成功','success')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    delChargeList (id) {
      let that = this
      let param = [{
        name: 'id',
        value: id
      }]
      apidr.delChargeList(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.showTips('删除成功','success')
          that.getBalanceList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.getBalanceList()
    this.getBrandSelect()
    this.getThirdSelect()
    this.getActivitySelect()
    Main.$off('updateList')
    Main.$on('updateList', () => {
      this.getBalanceList()
    })
  },
  filters: {
    checkBalanceCycle (val) {
      if (!val.balanceStartDate) return ''
  	  let balanceStartDate = val.balanceStartDate
  	  let balanceEndDate = val.balanceEndDate
  	  balanceStartDate = balanceStartDate.split(' ')[0]
  	  balanceEndDate = balanceEndDate.split(' ')[0]
  	  return balanceStartDate + '至' + balanceEndDate
  	},
    checkHandleStatus (val) {
      if (!val) return ''
      return val == 0 ? '已提交' : val == 1 ? '进行中' : val === '2' ? '已完成' : '失败'
    },
    checkBalanceStatus (val) {
      if (!val) return ''
      return val == 0 ? '未结算' : '已结算'
    }
  }
}
</script>

<style lang="scss" scoped>
.loadFileContent {
  .dialog-footer {
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 20px;
  }
}
</style>
