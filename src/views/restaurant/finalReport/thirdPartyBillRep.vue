<template>
  <div class="mainContent" id="thirdBillRepo">
    <div class="report-info">
      <div class="info-content">
      	<div class="info-title">活动名称</div>
        <div class="info-value">{{ reportInfo.activityName }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">第三方</div>
        <div class="info-value">{{ reportInfo.thirdName }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">结算期间</div>
        <div class="info-value">{{ accountPriod }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">报告生成日期</div>
        <div class="info-value">{{ createDate }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">报告生成人</div>
        <div class="info-value">{{ reportInfo.createUser }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">报告确认日期</div>
        <div class="info-value">{{ confirmDate }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">报告确认人</div>
        <div class="info-value">{{ reportInfo.confirmUser }}</div>
      </div>
      <div class="btn-wrap">
        <el-button size="small"   @click="downloadList" type="success"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        <el-button size="small"   @click="sendEmail" type="success" :disabled="reportInfo.balanceStatus === '1'">发送邮件</el-button>
        <el-button size="small"   @click="affirmBalance" type="success" :disabled="reportInfo.balanceStatus === '1'">确认结算</el-button>
        <el-button size="small"   @click="deleteList" type="danger" :disabled="reportInfo.balanceStatus === '1'">删除</el-button>
      </div>
    </div>
    <!--<div class="dataContent" >
      <el-table :data="totalDate" show-summary :sum-text="sum_text" style="width: 100%" border>
      	<el-table-column prop="checkState" label="核对情况"></el-table-column>
        <el-table-column prop="sum" label="金额（单位：元）"></el-table-column>
      </el-table>
    </div>-->
    <div class="sec-data-con">
      <div class="tab-content" >
        <el-button size="small" class="update-account-btn" @click="updateAccount" type="success" :disabled="reportInfo.balanceStatus === '1' && isHaveDetail == 1">更新结算</el-button>
        <el-tabs v-model="activeTabName" @tab-click="handleSwitch">
          <el-tab-pane label="历史未结算明细" name="historyReport" v-if="isHaveDetail == 1 && reportInfo.balanceStatus != '1'">
            <third-table-com :tableData="simpleTableData" :tableKey="simpleTableKey" :searchShow="searchShow" :isHaveDetail = "isHaveDetail"
            :balanceStatus="reportInfo.balanceStatus" :total_account="total_account" :activeTabName="activeTabName" :promotionId = "currentBillId"
            :ishistory="true" :showComment="true" :storeCodeSearchType="historySearchType" @searchList="searchList" @delectList="delectList" @cancelDelete="cancelDelete" >
              <template slot-scope="scope" slot="bizDate">
                <span>{{ scope.row.bizDate | checkBizDate }}</span>
              </template>
            </third-table-com>
          </el-tab-pane>
          <el-tab-pane label="订单明细" name="detailReport" v-if="isHaveDetail == 1">
            <third-table-com :tableData="simpleTableData" :tableKey="simpleTableKey" :searchShow="searchShow" :isHaveDetail = "isHaveDetail"
            :balanceStatus="reportInfo.balanceStatus" :total_account="total_account" @searchList="searchList" @delectList="delectList"
            :activeTabName="activeTabName" :promotionId = "currentBillId" :storeCodeSearchType="orderSearchType" @cancelDelete="cancelDelete" >
              <template slot-scope="scope" slot="bizDate">
                <span>{{ scope.row.bizDate | checkBizDate }}</span>
              </template>
            </third-table-com>
          </el-tab-pane>
          <el-tab-pane label="按餐厅" name="restaurantReport">
            <third-table-com :tableData="simpleTableData" :isHaveDetail = "isHaveDetail" :tableKey="simpleTableKey" :searchShow="searchShow" :total_account="total_account">
              <template slot-scope="scope" slot="tradeDate">
                <span>{{ scope.row.tradeDate | checkBizDate }}</span>
              </template>
            </third-table-com>
          </el-tab-pane>
          <el-tab-pane label="按开票单位" name="companyReport">
            <third-table-com :tableData="simpleTableData" :isHaveDetail = "isHaveDetail" :tableKey="simpleTableKey" :searchShow="searchShow" :total_account="total_account"></third-table-com>
          </el-tab-pane>
          <el-tab-pane label="按法人公司" name="legalReport">
            <third-table-com :tableData="simpleTableData" :isHaveDetail = "isHaveDetail" :tableKey="simpleTableKey" :searchShow="searchShow" :total_account="total_account"></third-table-com>
          </el-tab-pane>
        </el-tabs>
      </div>
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
    <send-email-com :isShow="isShow" :sendEmailForm="sendEmailForm" :notNeedPassword="notNeedPassword" @close="close"></send-email-com>
  </div>
</template>

<script>
import thirdTableCom from './thirdPartyCom/thirdTableCom.vue'
import sendEmailCom from './sendEmailCom.vue'
import api from '@/model/api'
import apidr from '@/model/apidr'
import Main from '@/main'

export default {
	name: 'thirdPartyBillRep',
  data () {
    return {
      reportInfo: {
        activityName: '',
        thirdName: '',
        balanceStartDate: '',
        balanceEndDate: '',
        createTime: "",
        createUser: "",
        confirmTime: '',
        confirmUser: '',
      },
      sum_text: '总金额',
      totalDate: [{
        id: 1,
        checkState: '核对无差异',
        sum: '72829500'
      }, {
        id: 2,
        checkState: '核对有差异',
        sum: '10000000'
      }],
      total_account: '--',
      activeTabName: 'historyReport',
      searchShow: true,
      simpleTableData: [],
      simpleTableKey: [{
        name: '品牌',
        value: 'brandName'
      }, {
        name: '消费餐厅编号',
        value: 'deliveryStoreCode',
        width: '100'
      }, {
        name: '消费餐厅名称',
        value: 'deliveryStoreName',
        width: '100'
      }, {
        name: '第三方交易订单号',
        value: 'orderNo',
        width: '120'
      }, {
        name: 'POS交易号',
        value: 'posTradeNo',
        width: '100'
      }, {
        name: '商户号',
        value: 'businessNo'
      }, {
        name: '消费者账户',
        value: 'consumerAccount',
        width: '100'
      }, {
        name: '营业日期',
        value: 'bizDate',
        special: true
      }, {
        name: '交易日期',
        value: 'tradeDate'
      },
      // {
      //   name: '结算金额',
      //   value: 'tradeAmount'
      // },
       {
        name: '百胜折扣',
        value: 'bsSubsidy'
      }, {
        name: '交易金额',
        value: 'tradeAmount1'
      }, {
        name: '与第三方结算金额',
        value: 'storeReceivable',
        width: '120'
      }, {
        name: '消费者支付金额',
        value: 'acturalAmount',
        width: '120'
      }, {
        name: '第三方补贴金额',
        value: 'thirdSubsidy',
        width: '120'
      }, {
        name: '手续费',
        value: 'handingCharge'
      }, {
        name: '服务费',
        value: 'serviceCharge'
      }, {
        name: '配送费（百胜）',
        value: 'bsShippingFee',
        width: '120'
      }, {
        name: '配送费（第三方补贴）',
        value: 'thirdShippingFee',
        width: '150'
      }, {
        name: '券名称',
        value: 'couponName'
      }, {
        name: '营运市场',
        value: 'operateMarket'
      }, {
        name: '财务市场',
        value: 'financialMarket'
      }, {
        name: '法人公司CODE',
        value: 'companyCode',
        width: '110'
      }, {
        name: '法人公司名称',
        value: 'companyName',
        width: '100'
      }, {
        name: '开票单位编号',
        value: 'billingUnit',
        width: '100'
      }, {
        name: '开票单位名称',
        value: 'billingUnitName',
        width: '100'
      }, {
        name: '历史/当期',
        value: 'resourceType',
        special: true
      }],
//    {
//      name: '交易类型',
//      value: 'transactionType'
//    }, {
//      name: '交易渠道',
//      value: 'transactionChannel'
//    }
      defaultHeader: [],
      currentBillId: '',
      currentTab: 'detailReport',
      isHaveDetail: '',
      fileArr: [],
      orderNo: '',
      deliveryStoreCode: '',
      storeReceivableStart: '',
      storeReceivableEnd: '',
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      isShow: false,
      sendEmailForm: {
        receiveUserMail: '',
        ccUserMail: '',
        financialManagerUser: '',
        activityManagerUser: '',
        emailTitle: '',
        emailContext: '',
        emailAttachmentDTOList: []
      },
      notNeedPassword:false,
      saleAmount: {},
      historySearchType : '1',
      orderSearchType : '0'
    }
  },
  computed: {
    accountPriod () {
      if (this.reportInfo.balanceStartDate == null) return ''
      let balanceStartDate = this.reportInfo.balanceStartDate
  	  let balanceEndDate = this.reportInfo.balanceEndDate
  	  balanceStartDate = balanceStartDate.split(' ')[0]
  	  balanceEndDate = balanceEndDate.split(' ')[0]
  	  return balanceStartDate + '至' + balanceEndDate
    },
    createDate () {
      if (this.reportInfo.createTime == null) return ''
      return this.reportInfo.createTime.split(' ')[0]
    },
    confirmDate () {
    	if (this.reportInfo.confirmTime == null) return ''
    	return this.reportInfo.confirmTime.split(' ')[0]
    }
  },
  components: {
    thirdTableCom,
    sendEmailCom
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      this.currentRequest()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.currentRequest()
    },
    handleClose(tag) {
      this.sendEmailForm.emailAttachmentDTOList.splice(this.sendEmailForm.emailAttachmentDTOList.indexOf(tag), 1);
    },
    downloadList () {
      let that = this
      let params = [{
        name: 'promotionId',
        value: this.currentBillId
      }]
      apidr.getGenerateFile(this.common.joinSearchParam(params), function(res){
        if (res.code === 200) {
          that.downBalanceList(res.data)
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    deleteList () {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delThirdBillList()
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    affirmBalance (id) {
      let that = this
    	this.$confirm('确认结算后无法取消，是否确认结算?', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.updateBalanceStatus()
      }).catch(() => {
        //
      })
    },
    sendEmail () {
      this.getThirdEmailDetail()
    },
    close () {
      this.isShow = false
    },
    downBalanceList (filePaths) {
      let that = this
      filePaths.forEach(function(value, index) {
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
    delThirdBillList () {
      let that = this
      let param = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.delThirdBillList(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.showTips('删除成功','success')
          that.common.deleteTag(that.$route,that)
          Main.$emit('updateList')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    searchList (val,deliveryStoreCode,storeReceivableStart,storeReceivableEnd) {
      this.orderNo = val
      this.deliveryStoreCode = deliveryStoreCode
      this.storeReceivableStart = storeReceivableStart
      this.storeReceivableEnd = storeReceivableEnd
      if (this.activeTabName === 'detailReport') {
      	this.getThirdBillDetail()
      } else{
      	this.getHistoryBillDetail()
      }
    },
    delectList (list) {
      let deleteType = this.activeTabName === 'detailReport' ? '0' : '1'
      let that = this
      let pathParams = [{
      	name: 'listDetailId',
        value: list
      }, {
      	name: 'id',
        value: this.currentBillId
      }, {
      	name: 'deleteType',
        value: deleteType
      }]
      apidr.delBillDetailList(this.common.joinSearchParam(pathParams),function(res){
        if (res.code === 200) {
          that.showTips('标记成功','success')
          that.orderNo = ''
          Main.$emit('clearOrder')
          if (deleteType == '0') {
            that.getThirdBillDetail()
          } else {
            that.getHistoryBillDetail()
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    updateBalanceStatus () {
      let that = this
      let param = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.updatebalanceStatus(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
        	that.getReportDetail()
        	Main.$emit('updateList')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    cancelDelete (list) {
      let that = this
      let pathParams = [{
      	name: 'listDetailId',
        value: list
      }, {
      	name: 'id',
        value: this.currentBillId
      }, {
      	name: 'deleteType',
        value: this.activeTabName === 'historyReport' ? '2' : '3'
      }]
      apidr.delBillDetailList(this.common.joinSearchParam(pathParams),function(res){
        if (res.code === 200) {
          that.showTips('取消标记成功','success')
          that.orderNo = ''
          Main.$emit('clearOrder')
          if (that.activeTabName === 'detailReport') {
            that.getThirdBillDetail()
          } else {
            that.getHistoryBillDetail()
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    updateAccount () {
      let that = this
      this.$confirm('确定更新结算?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let pathParams = [{
          name: 'id',
          value: this.currentBillId
        }]
        apidr.updateBillAccount(this.common.joinSearchParam(pathParams),function(res){
          if (res.code === 200) {
            that.showTips('更新结算成功','success')
            if(that.activeTabName == 'historyReport' || that.activeTabName == 'detailReport'){
              that.getReportDetail();
            }else{
              that.getBillSalesAmount();
            }
          } else if (res.code != 404) {
            that.showTips(res.msg,'warning')
          }
        })
      }).catch(() => {
        // that.common.infoMessage('已取消标记')
      })

    },
    getReportDetail () {
      let that = this
      let params = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.getReportDetail(this.common.joinSearchParam(params), function(res){
        if (res.code === 200) {
          that.reportInfo = res.data
          if (that.isHaveDetail == 1 && that.reportInfo.balanceStatus == 1) {
          	that.activeTabName = 'detailReport'
            that.simpleTableKey = that.defaultHeader.concat();
            // that.$set(that.simpleTableKey[9],'name','订单金额')
          }
          that.$nextTick(function () {
            that.currentRequest()
            that.getBillSalesAmount()
          })
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getThirdBillDetail () {
      let that = this
      let pathParam = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'promotionId',
        value: this.currentBillId
      }, {
      	name: 'orderNo',
        value: this.orderNo
      }, {
      	name: 'searchType',
        value: '0'
      }, {
        name: 'deliveryStoreCode',
        value: this.deliveryStoreCode || null
      }, {
      	name: 'storeReceivableStart',
        value: this.storeReceivableStart || null
      }, {
      	name: 'storeReceivableEnd',
        value: this.storeReceivableEnd || null
      }]
      apidr.getThirdBillDetail(this.common.joinSearchParam(pathParam), function(res){
        that.simpleTableData = []
        that.totalRecords = 0
        if (res.code === 200) {
          that.simpleTableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getHistoryBillDetail () {
      let that = this
      let pathParam = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'promotionId',
        value: this.currentBillId
      }, {
      	name: 'orderNo',
        value: this.orderNo
      }, {
      	name: 'searchType',
        value: '1'
      }, {
        name: 'deliveryStoreCode',
        value: this.deliveryStoreCode || null
      }, {
      	name: 'storeReceivableStart',
        value: this.storeReceivableStart || null
      }, {
      	name: 'storeReceivableEnd',
        value: this.storeReceivableEnd || null
      }]
      apidr.getThirdBillDetail(this.common.joinSearchParam(pathParam), function(res){
        that.simpleTableData = []
        that.totalRecords = 0
        if (res.code === 200) {
          that.simpleTableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getStoreBillDetail () {
      let that = this
      let pathParam = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'promotionId',
        value: this.currentBillId
      }]
      apidr.getStoreBillDetail(this.common.joinSearchParam(pathParam), function(res){
        that.simpleTableData = []
        that.totalRecords = 0
        if (res.code === 200) {
          that.simpleTableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCompanyBillDetail () {
      let that = this
      let pathParam = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'promotionId',
        value: this.currentBillId
      }]
      apidr.getCompanyBillDetail(this.common.joinSearchParam(pathParam), function(res){
        that.simpleTableData = []
        that.totalRecords = 0
        if (res.code === 200) {
          that.simpleTableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getUnitBillDetail () {
      let that = this
      let pathParam = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'promotionId',
        value: this.currentBillId
      }]
      apidr.getUnitBillDetail(this.common.joinSearchParam(pathParam), function(res){
        that.simpleTableData = []
        that.totalRecords = 0
        if (res.code === 200) {
          that.simpleTableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getThirdEmailDetail () {
      let that = this
      let pathParam = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.getThirdEmailDetail(this.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          that.sendEmailForm = res.data
          that.notNeedPassword = !res.data.needPassword
        }else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
        that.isShow = true
      }, function(err) {
        that.showTips('连接超时，请稍后再试！','warning')
      })
    },
    getBillSalesAmount () {
      let that = this
      let pathParam = [{
      	name: 'promotionId',
        value: this.currentBillId
      }]
      apidr.getBillSalesAmount(this.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          that.saleAmount = res.data
          if (that.activeTabName === 'detailReport') {
            that.checkSalesValue('orderThirdBillAmount')
          } else if (that.activeTabName === 'historyReport') {
            that.checkSalesValue('historyThirdBillAmount')
            console.log(that.total_account)
          } else if (that.activeTabName === 'restaurantReport') {
            that.checkSalesValue('storeThirdBillAmount')
          } else if (that.activeTabName === 'companyReport') {
            that.checkSalesValue('unitThirdBillAmount')
          } else {
          	that.checkSalesValue('companyThirdBillAmount')
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    checkSalesValue (key) {
      if (this.saleAmount[key] == null || this.saleAmount[key] == '') {
      	this.total_account = '--'
      } else{
      	this.total_account = this.saleAmount[key]
      }
    },
    handleSwitch (tab, event) {
    	this.pageSize = 10
      this.currentPage = 1
      this.orderNo = ''
      if(tab.name === 'detailReport'){
        this.simpleTableKey = this.defaultHeader.concat()
        // this.$set(this.simpleTableKey[9],'name','订单金额')
        this.searchShow = true
        this.getThirdBillDetail()
        this.checkSalesValue('orderThirdBillAmount')
      } else if (tab.name === 'historyReport') {
        this.simpleTableKey = this.defaultHeader.concat()
        // this.$set(this.simpleTableKey[9],'name','结算金额')
        this.searchShow = true
        this.getHistoryBillDetail()
        this.checkSalesValue('historyThirdBillAmount')
      }else if (tab.name === 'restaurantReport') {
        this.simpleTableKey = [{name: '交易日期', value: 'tradeDate', special: true}, {name: '消费餐厅编号', value: 'deliveryStoreCode', width: '100'}, {name: '消费餐厅名称', value: 'deliveryStoreName', width: '100'},
        {name: '笔数', value: 'deliveryStoreCount'}, {name: '交易金额', value: 'tradeAmount'}, {name: '百胜折扣', value: 'bsSubsidy'}, {name: '与第三方结算金额', value: 'storeReceivable', width: '120'},
        {name: '第三方补贴', value: 'thirdSubsidy', width: '100'}, {name: '消费者支付金额', value: 'acturalAmount', width: '120'}, {name: '手续费', value: 'handingCharge'}, {name: '服务费', value: 'serviceCharge'},
        {name: '配送费（百胜）', value: 'bsShippingFee', width: '120'}, {name: '配送费（第三方）', value: 'thirdShippingFee', width: '150'}, {name: '券名称', value: 'couponName'}, {name: '法人公司CODE', value: 'companyCode', width: '120'},
        {name: '法人公司名称', value: 'companyName', width: '120'}, {name: '开票单位CODE', value: 'billingUnit', width: '120'}, {name: '开票单位', value: 'billingUnitName'}, {name: '营运市场', value: 'operateMarket'}, {name: '财务市场', value: 'financialMarket'}, {name: '品牌', value: 'brandName'}]
        this.searchShow = false
        this.getStoreBillDetail()
        this.checkSalesValue('storeThirdBillAmount')
      } else if (tab.name === 'companyReport') {
        this.simpleTableKey = [{name: '开票单位CODE', value: 'billingUnit', width: '120'}, {name: '开票单位', value: 'billingUnitName'}, {name: '笔数', value: 'deliveryStoreCount'}, {name: '交易金额', value: 'tradeAmount'},
        {name: '百胜折扣', value: 'bsSubsidy'}, {name: '与第三方结算金额', value: 'storeReceivable', width: '120'}, {name: '第三方补贴', value: 'thirdSubsidy', width: '100'}, {name: '消费者支付金额', value: 'acturalAmount', width: '120'}, {name: '手续费', value: 'handingCharge'},
        {name: '服务费', value: 'serviceCharge'}, {name: '配送费（百胜）', value: 'bsShippingFee', width: '120'}, {name: '配送费（第三方补贴）', value: 'thirdShippingFee', width: '150'}, {name: '券名称', value: 'couponName'}, {name: '品牌', value: 'brandName'}]
        this.searchShow = false
        this.getUnitBillDetail()
        this.checkSalesValue('unitThirdBillAmount')
      } else if (tab.name === 'legalReport') {
        this.simpleTableKey = [{name: '法人公司CODE', value: 'companyCode', width: '120'}, {name: '法人公司名称', value: 'companyName', width: '100'}, {name: '笔数', value: 'deliveryStoreCount'}, {name: '交易金额', value: 'tradeAmount'},
        {name: '百胜折扣', value: 'bsSubsidy'}, {name: '与第三方结算金额', value: 'storeReceivable', width: '120'}, {name: '第三方补贴', value: 'thirdSubsidy', width: '100'}, {name: '消费者支付金额', value: 'acturalAmount', width: '120'}, {name: '手续费', value: 'handingCharge'},
        {name: '服务费', value: 'serviceCharge'}, {name: '配送费（百胜）', value: 'bsShippingFee', width: '120'}, {name: '配送费（第三方补贴）', value: 'thirdShippingFee', width: '150'}, {name: '券名称', value: 'couponName'}, {name: '品牌', value: 'brandName'}]
        this.searchShow = false
        this.getCompanyBillDetail()
        this.checkSalesValue('companyThirdBillAmount')
      }
    },
    currentRequest () {
      if (this.activeTabName === 'detailReport') {
        this.getThirdBillDetail()
      } else if (this.activeTabName === 'historyReport') {
        this.getHistoryBillDetail()
      }else if (this.activeTabName === 'restaurantReport') {
      	this.getStoreBillDetail()
      } else if (this.activeTabName === 'companyReport') {
        this.getUnitBillDetail()
      } else {
      	this.getCompanyBillDetail()
      }
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.defaultHeader = this.simpleTableKey
    this.currentBillId = parseInt(this.$route.query.id)
    this.isHaveDetail = this.$route.query.isHaveDetail
    this.getReportDetail()
    if (this.isHaveDetail != 1) {
      this.activeTabName = 'restaurantReport'
      this.simpleTableKey = [{name: '交易日期', value: 'tradeDate', special: true}, {name: '消费餐厅编号', value: 'deliveryStoreCode', width: '100'}, {name: '消费餐厅名称', value: 'deliveryStoreName', width: '100'},
        {name: '笔数', value: 'deliveryStoreCount'}, {name: '百胜折扣', value: 'bsSubsidy'}, {name: '与第三方结算金额', value: 'storeReceivable', width: '120'},
        {name: '第三方补贴', value: 'systemThirdSubsidy', width: '100'}, {name: '消费者支付金额', value: 'acturalAmount', width: '120'}, {name: '手续费', value: 'handingCharge'}, {name: '服务费', value: 'serviceCharge'},
        {name: '配送费（百胜）', value: 'bsShippingFee', width: '120'}, {name: '配送费（第三方补贴）', value: 'thirdShippingFee', width: '150'}, {name: '券名称', value: 'couponName'}, {name: '法人公司CODE', value: 'companyCode', width: '120'},
        {name: '法人公司名称', value: 'companyName', width: '120'}, {name: '开票单位CODE', value: 'billingUnit', width: '120'}, {name: '开票单位', value: 'billingUnitName'}, {name: '营运市场', value: 'operateMarket'},
        {name: '财务市场', value: 'financialMarket'}, {name: '品牌', value: 'brandName'}]
      this.searchShow = false
    }
  },
  filters: {
    checkBizDate (val) {
      if (val == null) return ''
  	  return val.split(' ')[0]
    }
  }
}
</script>

<style lang="scss" scoped>
#thirdBillRepo /deep/{
  .update-account-btn{
    position: absolute;
    z-index: 1000;
    right: 20px;
    top: 18px;
  }
}
</style>
