<template>
  <div class="intrabranch">
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
        <div class="selectTitle">餐厅类型</div>
        <el-select size="small"  v-model="storeType">
          <el-option value="ALL" label="请选择"></el-option>
          <el-option v-for="item in storeSelect" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">报告状态</div>
        <el-select size="small"  v-model="accountState">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in accountSelect" :key="item.id" :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="handleReport">手动生成报告</el-button>
      <el-button size="small" type="success"  @click="setBlackList">设置加盟商黑名单</el-button>
      <el-button size="small" type="success"  @click="exportReport">下载</el-button>
    </div>
    <div class="dataContent" >
      <div class="opreRight">
        <span class="unit">单位：元</span>
      </div>
      <el-table :data="intrabranchAccountData" style="width: 100%" border>
        <el-table-column prop="activityName" label="活动名称" width="100px" >
          <template slot-scope="scope" >
            <span>{{scope.row.activityName}}</span>
            <div v-if="scope.row.auditBack == '1'" class="icon-content" >
              <span class="column-icon split" >退</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column prop="thirdName" label="第三方"></el-table-column>
        <el-table-column prop="insideCompanyName" label="法人公司"></el-table-column>
        <el-table-column prop="storeType" label="餐厅类型">
          <template slot-scope="scope">
            <span>{{ scope.row.storeType | checkStoreType }}</span>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="balanceCycle" label="结算周期" width="170px">
          <template slot-scope="scope">
            <span>{{ scope.row | checkBalanceCycle }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balanceAmount" label="结算金额" width="150px"></el-table-column>
        <el-table-column prop="handleStatus" label="执行情况" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.handleStatus | checkHandleStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="报告状态" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.auditStatus | checkBalanceStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
          	<el-tooltip content="下载明细" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="downloadList(scope.row.filePath)" :disabled="scope.row.handleStatus === '1' || scope.row.handleStatus === '3'"><i class="fa fa-download"></i></el-button>
            </el-tooltip>
            <el-tooltip content="提交" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="apply(scope.row.id)" :disabled="scope.row.auditStatus != '0' || scope.row.handleStatus === '3' || scope.row.handleStatus === '1'"><i class="fas fa-clipboard-check"></i></el-button>
            </el-tooltip>
            <el-tooltip content="审批" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"  @click="approve(scope.row.id)" :disabled="scope.row.auditStatus != '1'"><i class="fas fa-user-check"></i></el-button>
            </el-tooltip>
            <el-tooltip content="退回" placement="top" effect="light" popper-class="table-cell-toolTip">
            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="reject(scope.row.id)" :disabled="scope.row.auditStatus != '1'"><i class="fas fa-user-times"></i></el-button>
            </el-tooltip>
          	<el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="deleteList(scope.row)" :disabled="scope.row.auditStatus === '1' || scope.row.auditStatus === '2'"><i class="fa fa-trash-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="detailList(scope.row)" :disabled="scope.row.handleStatus === '3' || scope.row.handleStatus === '1'"><i class="fa fa-file-alt"></i></el-button>
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
    <!-- 设置加盟商白名单dialog -->
    <el-dialog  title="设置加盟商黑名单" :visible.sync="setBlackListVisible" :close-on-click-modal="false"
                custom-class="set-blacklist-dialog"  >
        <el-transfer filterable v-model="blackValue" :data="blackListData" :titles="blackListTitle"></el-transfer>
      <!-- <el-form :model="setBlForm" label-width="150px" ref="setReasonForm">
        <el-form-item label="异常原因类别" prop="reason" :rules="[{ required: true, message: '请选择异常原因类别', trigger: 'change' }]">
          <el-select size="samll" v-model="setReasonForm.reason" placeholder="请选择" :filterable="true" >
            <el-option  v-for="(item,index) in reasonOpts" :key="index"
                        :label="item.entryName" :value="item.entryCode" ></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <div slot="footer" class="dialog-footer">
          <el-button size="small" class="c-button c-button--plain" @click="setBlackListVisible = false">取 消</el-button>
          <el-button size="small" class="c-button c-button--primary" @click="doSubmitBlackList">确 定</el-button>
      </div>
    </el-dialog>
    <handle-rep-com
      :isShow="isShow"
      :type="type"
      :storeTypeParam="storeTypeParam"
      @submitForm="submits"
      @close="close"></handle-rep-com>
  </div>
</template>

<script>
import api from '@/model/api'
import Main from '@/main'
import apidr from '@/model/apidr'
import handleRepCom from '../handleRepCom'
import scroll from '@/directives/index'

export default {
  name: 'intrabranchAccount',
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
      accountState: '',
      storeType: 'ALL',
      storeSelect: [{
        name: '直营',
        value: '!FR'
      }, {
        name: '加盟',
        value: 'FR'
      }],
      accountSelect: [{
        id: 0,
        value: '待提交'
      }, {
        id: 1,
        value: '待审批'
      }, {
        id: 2,
        value: '已审批'
      }],
      intrabranchAccountData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      isShow: false,
      type: '2',
      storeTypeParam : '0',
      activityNameOption: [],
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId: '',
      setBlackListVisible:false,
      blackListTitle:['白名单','黑名单'],
      blackListData:[],
      blackValue:[]
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
    setBlackList (){
      let _self = this;
      //获取加盟商名单
      apidr.getFranchiseeList('',function(res){
        _self.blackListData = [];
        _self.blackValue = [];
        if(res.code === 200){
          let allFranchisee = res.data;
          allFranchisee.forEach(function(item,index){
            _self.blackListData.push({
              key : item.companyCode+'_'+index,
              label : item.companyName
            });
            if(item.attribute === '1'){
              _self.blackValue.push(item.companyCode+'_'+index);
            }
          })
        }
        _self.setBlackListVisible = true;
      });
    },
    doSubmitBlackList (){
      let _self = this;
      let param = {
        attribute : 1,
        companyCode : []
      }
      this.blackValue.forEach(function(item,index){
        param.companyCode.push(item.split('_')[0]);
      })
      apidr.setFranchiseeBlackList(param,function(res){
        if (res.code === 200) {
          _self.common.successMessage(res.data);
          _self.setBlackListVisible = false;
        } else if (res.code != 404) {
          _self.common.errorMessage(res.msg);
        }
      });
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
    searchList () {
      this.currentPage = 1
      this.getBalanceList()
    },
    reset () {
      this.startDate = ''
      this.endDate = ''
      this.brandType = ''
      this.thirdParty = ''
      this.activeName = ''
      this.storeType = ''
      this.accountState = ''
      this.rangeDate = []
      this.startTimeVal = '';
      this.endTimeVal = '';
    },
    handleReport () {
      this.isShow = true
    },
    downloadList (filePath) {
      this.downBalanceList(filePath)
    },
    apply (id) {
      let that = this
    	this.$confirm('是否提交审批？', '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.applyList(id)
      }).catch(() => {
        //that.common.infoMessage('已取消')
      })
    },
    approve (id) {
      let that = this
    	this.$confirm('审批后无法取消，是否审批？', '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.replyList(id, '2')
      }).catch(() => {
        //that.common.infoMessage('已取消')
      })
    },
    reject (id) {
      this.replyList(id, '1')
    },
    deleteList (row) {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delIntrabranchList(row)
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    detailList (row) {
      this.$router.push({name: 'intrabranchRep', query: {id: row.id, storeType: row.storeType}, params: {parentRoute:this.$route.fullPath}})
    },
    submits (formData) {
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
        name: 'storeType',
        value: formData.storeTypeId
      }]
      apidr.handleInsideReport(this.common.joinSearchParam(param),function(res){
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
        value: 2
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
        name: 'storeType',
        value: this.storeType
      }, {
        name: 'auditStatus',
        value: this.accountState
      }, {
        name: 'businessType',
        value: '2'
      }]
      apidr.getBalanceList(this.common.joinSearchParam(pathParams), function(res){
      	that.intrabranchAccountData = []
      	that.totalRecords = 0
        if (res.code === 200) {
          that.intrabranchAccountData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    applyList (id) {
      let that = this
      let pathParams = [{
      	name: 'id',
        value: id
      }]
      apidr.applyList(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.showTips('提交成功','success')
          that.getBalanceList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    replyList (id, type) {
      let that = this
      let pathParams = [{
      	name: 'id',
        value: id
      }, {
        name: 'type',
        value: type
      }]
      apidr.replyList(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
        	type === '1' ? that.showTips('已退回','success') : that.showTips('已审批','success')
          that.getBalanceList()
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
    exportReport(){
      let _self = this;
      let param = {
        pageIndex : this.currentPage,
        pageSize  : this.pageSize,
        balanceStartDate : this.startDate,
        balanceEndDate   : this.endDate,
        brandId      : this.brandType,
        thirdId      : this.thirdParty,
        activityId   : this.activeName,
        storeType    : this.storeType,
        auditStatus  : this.accountState,
        businessType : '2'
      }
      apidr.exportBalanceList(param,'application/vnd.ms-excel',function(res){
        if (res.code) {
          _self.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.download = '内部往来结算报告.xlsx'
          link.target = '_blank';link.click()
        }
      })

    },
    delIntrabranchList (row) {
      let that = this
      let param = [{
        name: 'id',
        value: row.id
      }, {
        name: 'storeType',
        value: row.storeType
      }, {
        name: 'uuidCode',
        value: row.uuidCode
      }]
      apidr.delIntrabranchList(this.common.joinSearchParam(param),function(res){
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
  	checkStoreType (val) {
  		if (!val) return ''
  	  return val === 'FR' ? '加盟' : '直营'
  	},
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
      return val === '0' ? '待提交' : val === '1' ? '待审批' : '已审批'
    }
  }
}
</script>

<style scoped lang="scss" >
.intrabranch /deep/{
  .icon-content{
    display: inline-block;
    border: 1px solid red;
    color: red;
    height: 20px;
    line-height: 18px;
    padding: 0 2px;
  }
  .set-blacklist-dialog{
    width: 600px;
    .el-transfer{
      padding-left: 5%;
    }
  }
}
</style>
