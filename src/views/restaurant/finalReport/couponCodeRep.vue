<template>
  <div class="mainContent" id="couponCodeRepMain">
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
      	<el-table-column prop="checkState" label="核对情况" ></el-table-column>
        <el-table-column prop="sum" label="金额（单位：元）" ></el-table-column>
      </el-table>
    </div>-->
    <div class="sec-data-con">
      <div class="tab-content" >
        <el-button size="small" class="update-account-btn" @click="updateAccount" type="success" :disabled="reportInfo.balanceStatus === '1' && isHaveDetail == 1">更新结算</el-button>
        <el-tabs v-model="activeTabName" @tab-click="handleSwitch">
          <el-tab-pane label="历史未结算明细" name="historyReport" v-if="isHaveDetail == 1 && reportInfo.balanceStatus != '1'">
            <coupon-table-com :tableData="simpleTableData" :tableKey="simpleTableKey" :searchShow="searchShow" :showTotalAmount="false" :showDeleteBtn="true"
            :balanceStatus="reportInfo.balanceStatus" :total_account="total_account" :activeTabName="activeTabName" :couponStatusOpt="couponStatusOpt" @deleteRows="deleteHisDetailData"
            @searchList="searchList" @delectList="delectList" @cancelDelete="cancelDelete" @couponCodeChange="couponCodeChange" @couponStatusChange="couponStatusChange" >
              <template slot-scope="scope" slot="businessDate">
                <span>{{ scope.row.businessDate | checkBusinessDate }}</span>
              </template>
            </coupon-table-com>
          </el-tab-pane>
          <el-tab-pane label="订单明细" name="detailReport" v-if="isHaveDetail == 1">
            <coupon-table-com :tableData="simpleTableData" :tableKey="simpleTableKey" :searchShow="searchShow" :showTotalAmount="true"
            :balanceStatus="reportInfo.balanceStatus" :total_account="total_account" :activeTabName="activeTabName" :couponStatusOpt="couponStatusOpt"
            @searchList="searchList" @delectList="delectList" @couponCodeChange="couponCodeChange" @cancelDelete="cancelDelete" @couponStatusChange="couponStatusChange" >
              <template slot-scope="scope" slot="businessDate">
                <span>{{ scope.row.businessDate | checkBusinessDate }}</span>
              </template>
            </coupon-table-com>
          </el-tab-pane>
          <el-tab-pane label="按餐厅" name="restaurantReport">
            <coupon-table-com :tableData="simpleTableData" :tableKey="simpleTableKey" :searchShow="searchShow" :showTotalAmount="true" :total_account="total_account">
              <template slot-scope="scope" slot="usedTime">
                <span>{{ scope.row.usedTime | checkUsedTime }}</span>
              </template>
            </coupon-table-com>
          </el-tab-pane>
          <el-tab-pane label="按开票单位" name="companyReport">
            <coupon-table-com :tableData="simpleTableData" :tableKey="simpleTableKey" :searchShow="searchShow" :showTotalAmount="true" :total_account="total_account">
            </coupon-table-com>
          </el-tab-pane>
          <el-tab-pane label="按法人公司" name="legalReport">
            <coupon-table-com :tableData="simpleTableData" :tableKey="simpleTableKey" :searchShow="searchShow" :showTotalAmount="true" :total_account="total_account">
            </coupon-table-com>
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
import couponTableCom from './couponCodeCom/couponTableCom.vue'
import sendEmailCom from './sendEmailCom.vue'
import api from '@/model/api'
import apidr from '@/model/apidr'
import Main from '@/main'

export default {
	name: 'couponCodeRep',
  data () {
    return {
      reportInfo: {
        activityName: '',
        thirdName: '',
        balanceStartDate: '',
        balanceEndDate: '',
        balanceAmount: 1278.73,
        createTime: "",
        createUser: "",
        confirmTime: '',
        confirmUser: '',
      },
      couponStatusOpt:[],
      couponStatus: '',
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
        name: '消费餐厅编号',
        value: 'storeId',
        width: '100'
      }, {
        name: '消费餐厅名称',
        value: 'resName',
        width: '100'
      }, {
        name: '券码',
        value: 'couponCode'
      }, {
        name: '券码状态',
        value: 'flag'
      }, {
        name: '券码名称',
        value: 'activity'
      }, {
        name: '活动ID',
        value: 'activityId'
      }, {
        name: '活动名称',
        value: 'activityGroupName'
      }, {
        name: '活动批次',
        value: 'activityGroupRound'
      }, {
        name: 'POS交易号',
        value: 'merchantPostTransId',
        width: '90'
      }, {
        name: '是否线上',
        value: 'merchantPostId_'
      }, {
        name: '订单号',
        value: 'orderId'
      }, {
        name: '营业日期',
        value: 'businessDate',
        special: true
      }, {
        name: '交易日期',
        value: 'usedTime'
      }, {
        name: '券面额',
        value: 'faceAmount'
      }, {
        name: '券净额',
        value: 'sales'
      }, {
        name: '消费者支付名称',
        value: 'paymentNameA',
        width: '110'
      }, {
        name: '消费者支付价格',
        value: 'invoiceAmountA',
        width: '110'
      }, {
        name: '第三方补贴名称',
        value: 'paymentNameB',
        width: '110'
      }, {
        name: '第三方补贴价格',
        value: 'invoiceAmountB',
        width: '110'
      }, {
        name: '积分兑换',
        value: 'couponValue'
      }, {
        name: '手续费',
        value: 'poundage'
      }, {
        name: '售卖渠道',
        value: 'activityGroupName'
      }, {
        name: '品牌',
        value: 'brandName'
      }, {
        name: '营运市场',
        value: 'resOprMarket'
      }, {
        name: '财务市场',
        value: 'resFinMarket'
      }, {
        name: '城市',
        value: 'resCity'
      }, {
        name: '法人公司CODE',
        value: 'resEntity',
        width: '110'
      }, {
        name: '法人公司名称',
        value: 'resEntityName',
        width: '110'
      }, {
        name: '开票公司CODE',
        value: 'issuingUnit',
        width: '110'
      }, {
        name: '开票单位名称',
        value: 'issuingUnitName',
        width: '100'
      }, {
        name: '售券机构',
        value: 'issuerName'
      }, {
        name: '码类型',
        value: 'couponType'
      }, {
        name: '收银机号',
        value: 'merchantPostId'
      }, {
        name: '业务模式',
        value: 'businessModel'
      }, {
        name: '类型',
        value: 'flag'
      }, {
        name: '历史/当期',
        value: 'resourceType',
        special: true
      }],
      defaultHeader: [],
      currentBillId: '',
      currentTab: 'detailReport',
      isHaveDetail: '',
      fileArr: [],
      couponCode: '',
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
      notNeedPassword: false,
      saleAmount: {},
      tempHistroyCoupon : '',
      tempOrderCoupon   : '',
      tempHistroyCouponStatus : '',
      tempOrderCouponStatus : ''
    }
  },
  components: {
    couponTableCom,
    sendEmailCom
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
    couponCodeChange (couponCode){
      if (this.activeTabName === 'detailReport') {
        this.tempOrderCoupon = couponCode;
      } else{
        if(this.activeTabName === 'historyReport') {
          this.tempHistroyCoupon = couponCode;
        }
      }
    },
    couponStatusChange (couponStatus){
      if (this.activeTabName === 'detailReport') {
        this.tempOrderCouponStatus = couponStatus;
      } else{
        if(this.activeTabName === 'historyReport') {
          this.tempHistroyCouponStatus = couponStatus;
        }
      }
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
    affirmBalance () {
      let that = this
    	this.$confirm('确认结算后无法取消，是否确认结算?', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.updateCouponStatus()
      }).catch(() => {
        that.common.infoMessage('已取消')
      })
    },
    deleteList () {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delCouponList()
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    sendEmail () {
      this.getCouponEmailDetail()
    },
    close () {
      this.isShow = false
    },
    delCouponList () {
      let that = this
      let param = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.delCouponList(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.showTips('删除成功','success')
          that.common.deleteTag(that.$route,that)
          Main.$emit('updateList')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    searchList (val,couponStatus) {
      this.couponCode = val
      this.couponStatus = couponStatus
      if (this.activeTabName === 'detailReport') {
        this.tempOrderCoupon = val;
        this.tempOrderCouponStatus = couponStatus;
      	this.getCouponRepDetail()
      } else{
        if(this.activeTabName === 'historyReport') {
          this.tempHistroyCoupon = val;
          this.tempHistroyCouponStatus = couponStatus;
        }
      	this.getHistoryRepDetail()
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
      apidr.delCouponDetailList(this.common.joinSearchParam(pathParams),function(res){
        if (res.code === 200) {
          that.showTips('标记成功','success')
          //that.couponCode = ''
          //Main.$emit('clearCode')
          if (deleteType == '0') {
            that.getCouponRepDetail()
          } else {
            that.getHistoryRepDetail()
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    deleteHisDetailData (list) {
      let that = this
      //console.log(list)
      let pathParams = [{
      	name: 'id',
        value: this.currentBillId
      }];
      list.forEach(function(item,index){
        pathParams.push({
          name: 'listDetailId',
          value: item
        })
      });
      apidr.delCouponHistoryDetailList(this.common.joinSearchParam(pathParams),function(res){
        if (res.code === 200) {
          that.showTips('已删除','success')
          that.couponCode = ''
          Main.$emit('clearCode')
          that.getHistoryRepDetail()
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
      apidr.delCouponDetailList(this.common.joinSearchParam(pathParams),function(res){
        if (res.code === 200) {
          that.showTips('取消标记成功','success')
          //that.couponCode = ''
          //Main.$emit('clearCode')
          if (that.activeTabName === 'detailReport') {
            that.getCouponRepDetail()
          } else {
            that.getHistoryRepDetail()
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
          value: that.currentBillId
        }]
        apidr.updateAccount(that.common.joinSearchParam(pathParams),function(res){
          if (res.code === 200) {
            that.showTips('更新结算成功','success')
            if(that.activeTabName = 'historyReport'){
              that.getCouponDetail()
            }else{
              that.getCouponSalesAmount()
            }
          } else if (res.code != 404) {
            that.showTips(res.msg,'warning')
          }
        })
      }).catch(() => {
        // that.common.infoMessage('已取消标记')
      })

    },
    updateCouponStatus () {
      let that = this
      let param = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.updateCouponStatus(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.getCouponDetail()
          Main.$emit('updateList')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
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
    getCouponDetail () {
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
          	that.simpleTableKey = that.defaultHeader
          }
          that.$nextTick(function () {
            that.currentRequest()
            that.getCouponSalesAmount()
          })
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCouponStatus (){
      let _self = this
      apidr.getCouponStatus(function (res) {
        if (res.code === 200) {
          _self.couponStatusOpt = res.data.concat();
        } else if (res.code != 404) {
          _self.showTips(res.msg, 'warning')
        }
      })
    },
    getCouponRepDetail () {
      let that = this
      let pathParam = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'couponCode',
        value: this.couponCode
      }, {
      	name: 'promotionId',
        value: this.currentBillId
      }, {
      	name: 'searchType',
        value: '0'
      }, {
        name: 'flag',
        value: this.couponStatus
      }]
      apidr.getCouponDetail(this.common.joinSearchParam(pathParam), function(res){
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
    getHistoryRepDetail () {
      let that = this
      let pathParam = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'couponCode',
        value: this.couponCode
      }, {
      	name: 'promotionId',
        value: this.currentBillId
      }, {
      	name: 'searchType',
        value: '1'
      }, {
        name: 'flag',
        value: this.couponStatus
      }]
      apidr.getCouponDetail(this.common.joinSearchParam(pathParam), function(res){
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
    getStoreCouponDetail () {
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
      	name: 'searchType',
        value: '1'
      }]
      apidr.getStoreCouponDetail(this.common.joinSearchParam(pathParam), function(res){
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
    getCompanyCouponDetail () {
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
      	name: 'searchType',
        value: '1'
      }]
      apidr.getCompanyCouponDetail(this.common.joinSearchParam(pathParam), function(res){
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
    getUnitCouponDetail () {
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
      	name: 'searchType',
        value: '1'
      }]
      apidr.getUnitCouponDetail(this.common.joinSearchParam(pathParam), function(res){
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
    getCouponEmailDetail () {
      let that = this
      let pathParam = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.getCouponEmailDetail(this.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          that.sendEmailForm = res.data
          that.notNeedPassword = !res.data.needPassword;
        }else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
        that.isShow = true
      }, function(err) {
        that.showTips('连接超时，请稍后再试！','warning')
      })
    },
    getCouponSalesAmount () {
      let that = this
      let pathParam = [{
      	name: 'promotionId',
        value: this.currentBillId
      }]
      apidr.getCouponSalesAmount(this.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          that.saleAmount = res.data
          if (that.activeTabName === 'detailReport') {
            that.checkSalesValue('orderCouponSales')
          } else if (that.activeTabName === 'historyReport') {
            that.checkSalesValue('historyCouponSales')
          } else if (that.activeTabName === 'restaurantReport') {
            that.checkSalesValue('storeCouponSales')
          } else if (that.activeTabName === 'companyReport') {
            that.checkSalesValue('unitCouponSales')
          } else {
          	that.checkSalesValue('companyCouponSales')
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
    getFSCById (key, id) {
      let that = this
      if (id) {
        api.getFSCById(id, function(res){
          if (res.code === 200) {
            that.$set(that.reportInfo, key, res.data.userName)
          }else if (res.code != 404) {
            that.showTips(res.msg,'warning')
          }
        })
      }
    },
    handleSwitch (tab, event) {
    	this.pageSize = 10
      this.currentPage = 1
      this.couponCode = ''
      if(tab.name === 'detailReport'){
        this.simpleTableKey = this.defaultHeader
        this.searchShow = true
        if(this.tempOrderCoupon || this.tempOrderCouponStatus){
          this.searchList(this.tempOrderCoupon,this.tempOrderCouponStatus);
        }else{
          this.simpleTableData = [];
        }
        //this.getCouponRepDetail()
        this.checkSalesValue('orderCouponSales')
      } else if (tab.name === 'historyReport') {
        this.simpleTableKey = this.defaultHeader
        this.searchShow = true
        if(this.tempHistroyCoupon || this.tempHistroyCouponStatus){
          this.searchList(this.tempHistroyCoupon,this.tempHistroyCouponStatus);
        }else{
          this.simpleTableData = [];
        }
        this.getHistoryRepDetail()
        this.checkSalesValue('historyCouponSales')
      }else if (tab.name === 'restaurantReport') {
        this.simpleTableKey = [{name: '日期', value: 'businessDate'}, {name: '消费餐厅编号', value: 'storeId', width: '100'}, {name: '消费餐厅名称', value: 'resName', width: '100'},
        {name: '券名称', value: 'activity'}, {name: '笔数', value: 'countNumber'}, {name: '券面额', value: 'faceAmount'}, {name: '券真实净额', value: 'sales', width: '90'},
        {name: '与第三方结算金额', value: 'invoiceAmount', width: '120'}, {name: '第三方补贴', value: 'invoiceAmountB', width: '90'}, {name: '用户支付', value: 'invoiceAmountA'}, {name: '法人公司', value: 'resEntityName'},
        {name: '开票单位', value: 'issuingUnitName'}, {name: '营运市场', value: 'resOprMarket'}, {name: '财务市场', value: 'resFinMarket'}, {name: '品牌', value: 'brandName'}]
        this.searchShow = false
        this.getStoreCouponDetail()
        this.checkSalesValue('storeCouponSales')
      } else if (tab.name === 'companyReport') {
        this.simpleTableKey = [{name: '开票单位CODE', value: 'issuingUnit'}, {name: '开票单位', value: 'issuingUnitName'}, {name: '券名称', value: 'activity'},
        {name: '笔数', value: 'countNumber'}, {name: '券面额', value: 'faceAmount'}, {name: '券真实净额', value: 'sales'}, {name: '与第三方结算金额', value: 'invoiceAmount', width: '120'},
        {name: '第三方补贴', value: 'invoiceAmountB'}, {name: '用户支付', value: 'invoiceAmountA'}, {name: '品牌', value: 'brandName'}]
        this.searchShow = false
        this.getUnitCouponDetail()
        this.checkSalesValue('unitCouponSales')
      } else if (tab.name === 'legalReport') {
        this.simpleTableKey = [{name: '法人公司CODE', value: 'resEntity'}, {name: '法人公司', value: 'resEntityName'}, {name: '券名称', value: 'activity'},
        {name: '笔数', value: 'countNumber'}, {name: '券面额', value: 'faceAmount'}, {name: '券真实净额', value: 'sales'}, {name: '与第三方结算金额', value: 'invoiceAmount', width: '120'},
        {name: '第三方补贴', value: 'invoiceAmountB'}, {name: '用户支付', value: 'invoiceAmountA'}, {name: '品牌', value: 'brandName'}]
        this.searchShow = false
        this.getCompanyCouponDetail()
        this.checkSalesValue('companyCouponSales')
      }
    },
    currentRequest () {
      if (this.activeTabName === 'detailReport') {
        this.getCouponRepDetail()
      } else if (this.activeTabName === 'historyReport') {
        this.getHistoryRepDetail()
      } else if (this.activeTabName === 'restaurantReport') {
      	this.getStoreCouponDetail()
      } else if (this.activeTabName === 'companyReport') {
        this.getUnitCouponDetail()
      } else {
      	this.getCompanyCouponDetail()
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
    //this.getCouponSalesAmount()
    this.getCouponDetail()
    this.getCouponStatus()
    if (this.isHaveDetail != 1) {
      this.activeTabName = 'restaurantReport'
      this.simpleTableKey = [{name: '日期', value: 'usedTime', special: true}, {name: '消费餐厅编号', value: 'storeId', width: '100'}, {name: '消费餐厅名称', value: 'resName', width: '100'},
        {name: '券类型', value: 'couponType'}, {name: '笔数', value: 'count'}, {name: '券面额', value: 'faceAmount'}, {name: '券真实净额', value: 'sales', width: '90'},
        {name: '与第三方结算金额', value: 'thirdAccount', width: '120'}, {name: '第三方补贴', value: 'invoiceAmountB', width: '90'}, {name: '用户支付', value: 'invoiceAmountA'},
        {name: '法人公司', value: 'resEntityName'}, {name: '开票单位', value: 'issuingUnitName'}, {name: '营运市场', value: 'resOprMarket'}, {name: '财务市场', value: 'resFinMarket'}, {name: '品牌', value: 'brandName'}]
      this.searchShow = false
    }
  },
  filters: {
    checkBusinessDate (val) {
      if (val == null) return ''
  	  return val.split(' ')[0]
    },
    checkUsedTime (val) {
      if (val == null) return ''
  	  return val.split(' ')[0]
    }
  }
}
</script>

<style lang="scss" scoped>
#couponCodeRepMain /deep/{
  .update-account-btn{
    position: absolute;
    z-index: 1000;
    right: 20px;
    top: 18px;
  }
}
</style>
