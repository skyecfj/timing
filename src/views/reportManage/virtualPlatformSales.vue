<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">付款日期</div>
        <el-date-picker v-model="searchData.startPaidDate" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerPaidStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endPaidDate"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerPaidEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">收款单位</div>
          <el-select size="small"  v-model="searchData.payeeCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in payeeCodeSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">开票单位</div>
          <el-select size="small"  v-model="searchData.invoiceEntityCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in invoiceEntityCodeSelect" :key="item.billingUnitId" :label="item.billingUnitName" :value="item.jdeCode">
              <span>[{{ item.jdeCode }}]</span>
              <span>{{ item.billingUnitName }}</span>
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">激活日期</div>
        <el-date-picker v-model="searchData.startActiveTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerActiveStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endActiveTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerActiveEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">订单状态</div>
          <el-select size="small"  v-model="searchData.orderStatus" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in orderStatusSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">订单渠道</div>
          <el-select size="small"  v-model="searchData.salesChannel" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in salesChannelSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">子订单渠道</div>
          <el-select size="small"  v-model="searchData.subSalesChannel" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in subSalesChannelSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">汇总方式</div>
          <el-select size="small"  v-model="searchData.sumWay">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in sumWaySelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
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
  </div>
</template>

<script>
import reportTableCom from './reportTableCom.vue'
import api from '@/model/api'

export default {
  name: 'virtualPlatformSales',
  data () {
    return {
      pickerPaidStart: {
        disabledDate: (time) => {
          if (this.searchData.endPaidDate) {
          	let curDate = (new Date(this.searchData.endPaidDate)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerPaidEnd: {
        disabledDate: (time) => {
          if (this.searchData.startPaidDate) {
          	let curDate = (new Date(this.searchData.startPaidDate)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      pickerActiveStart: {
        disabledDate: (time) => {
          if (this.searchData.endActiveTime) {
          	let curDate = (new Date(this.searchData.endActiveTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerActiveEnd: {
        disabledDate: (time) => {
          if (this.searchData.startActiveTime) {
          	let curDate = (new Date(this.searchData.startActiveTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      searchData: {
      	startPaidDate: '',
      	endPaidDate: '',
        startActiveTime: '',
        endActiveTime: '',
        payeeCode: '',
        invoiceEntityCode:'',
        orderStatus: '',
        salesChannel: '',
        subSalesChannel: '',
        sumWay: ''
      },
      payeeCodeSelect: [],
      invoiceEntityCodeSelect: [],
      orderStatusSelect: [],
      salesChannelSelect: [],
      subSalesChannelSelect: [],
      sumWaySelect: [{
        id: 1,
        name: '按售卖渠道'
      }, {
        id: 2,
        name: '按子订单渠道'
      }, {
        id: 3,
        name: '按开票单位'
      }, {
        id: 4,
        name: '按收款单位'
      }, {
        id: 5,
        name: '按支付渠道'
      }, {
        id: 6,
        name: '按开票单位+收款单位'
      }, ],
      simpleTableData: [],
      simpleTableKey: [{
        name: '售卖渠道',
        value: 'salesChannelName'
      }, {
        name: '子订单渠道',
        value: 'subSalesChannel',
        width: '100'
      }, {
        name: '订单号',
        value: 'orderNo'
      }, {
        name: '订单日期',
        value: 'orderTime'
      }, {
        name: '付款日期',
        value: 'paidDate'
      }, {
        name: '订单激活日期',
        value: 'activeTime',
        width: '120'
      }, {
        name: '订单状态',
        value: 'orderStatusName'
      }, {
        name: '开票单位',
        value: 'invoiceEntityName'
      }, {
        name: '收款单位',
        value: 'payeeName'
      }, {
        name: '售卖员',
        value: 'giver'
      }, {
        name: '售卖机构',
        value: 'branchCode'
      }, {
        name: '卡供应商',
        value: 'cardSupplier'
      }, {
        name: '支付渠道',
        value: 'paidTypeName'
      }, {
        name: '卡片类型',
        value: 'productTypeName'
      }, {
        name: '订单金额',
        value: 'orderAmount',
        classname: 'sumClass'
      }, {
        name: '折扣类型',
        value: 'discountTypeName'
      }, {
        name: '现金折扣',
        value: 'discountRate',
        classname: 'sumClass'
      }, {
        name: '赠卡面额',
        value: 'initBalance',
        classname: 'sumClass'
      }, {
        name: '赠品金额',
        value: 'presentAmount',
        classname: 'sumClass'
      }, {
        name: '赠券金额',
        value: 'pntCouponAmount',
        classname: 'sumClass'
      }, {
        name: '无价赠品',
        value: 'noValuePntAmount'
      }, {
        name: '折扣金额',
        value: 'discountAmount',
        classname: 'sumClass'
      }, {
        name: '卡面额（含赠卡）',
        value: 'cardFaceAmount',
        width: '120',
        classname: 'sumClass'
      }, {
        name: '卡外收费',
        value: 'cardOutAmount',
        classname: 'sumClass'
      }, {
        name: '应收金额',
        value: 'arAmount',
        classname: 'sumClass'
      }, {
        name: '折扣率（入卡）',
        value: 'disRate',
        width: '120',
        classname: 'sumClass'
      }, {
        name: '退单日期',
        value: 'refundOrderTime'
      }, {
        name: '退款金额',
        value: 'refundAmount',
        classname: 'sumClass'
      }, {
        name: '退款手续费',
        value: 'refundServiceCharge',
        width: '100',
        classname: 'sumClass'
      }, {
        name: '是否已退发票',
        value: 'ifInvoiceReturn',
        width: '120'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      defaultTableKey: [],
      salesSearchData: {},
      tableHeaders: [{
        name: '售卖渠道',
        field: 'salesChannelName'
      }, {
        name: '子订单渠道',
        field: 'subSalesChannel'
      }, {
        name: '开票单位',
        field: 'invoiceEntityName'
      }, {
        name: '收款单位',
        field: 'payeeName'
      }, {
        name: '支付渠道',
        field: 'paidTypeName'
      }]
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getVirtualPlatformSales()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getVirtualPlatformSales()
    },
    searchList () {
      if (this.searchData.sumWay) {
        let index = this.searchData.sumWay
        if (this.searchData.sumWay == 6) {
          this.simpleTableKey = [{name: '开票单位', value: 'invoiceEntityName'},{name: '收款单位', value: 'payeeName'},{name: '订单金额', value: 'orderAmount'},{name: '现金折扣', value: 'discountRate'},
          {name: '赠卡面额', value: 'initBalance'},{name: '赠品金额', value: 'presentAmount'},{name: '赠券金额', value: 'pntCouponAmount'},{name: '无价赠品', value: 'noValuePntAmount'},
          {name: '折扣金额', value: 'discountAmount'},{name: '卡面额含赠卡', value: 'cardFaceAmount', width: '120'},{name: '卡外收费', value: 'cardOutAmount'},{name: '应收金额', value: 'arAmount'},
          {name: '退款金额', value: 'refundAmount'},{name: '退款手续费', value: 'refundServiceCharge', width: '100'}]
        } else{
        	this.simpleTableKey = [{name: this.tableHeaders[index-1].name, value: this.tableHeaders[index-1].field, width: '100'},{name: '订单金额', value: 'orderAmount'},{name: '现金折扣', value: 'discountRate'},
          {name: '赠卡面额', value: 'initBalance'},{name: '赠品金额', value: 'presentAmount'},{name: '赠券金额', value: 'pntCouponAmount'},{name: '无价赠品', value: 'noValuePntAmount'},
          {name: '折扣金额', value: 'discountAmount'},{name: '卡面额含赠卡', value: 'cardFaceAmount', width: '120'},{name: '卡外收费', value: 'cardOutAmount'},{name: '应收金额', value: 'arAmount'},
          {name: '退款金额', value: 'refundAmount'},{name: '退款手续费', value: 'refundServiceCharge', width: '100'}]
        }
      } else {
        this.simpleTableKey = JSON.parse(JSON.stringify(this.defaultTableKey))
      }
      // this.salesSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getVirtualPlatformSales()
    },
    reset () {
      for (let i in this.searchData) {
        this.searchData[i] = ''
      }
    },
    exportFile () {
      let that = this
      api.exportVirtualPlatformSales(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '虚拟平台零售查询报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getOrderStatus () {
      let that = this
      api.getOrderStatus(function(res){
        if (res.code === 200) {
          that.orderStatusSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getPayeeUnit () {
      let that = this
      api.getPayeeUnit(function(res){
        if (res.code === 200) {
          that.payeeCodeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getAllBillingUnit () {
      let that = this
      api.getAllBillingUnit(function(res){
        if (res.code === 200) {
          that.invoiceEntityCodeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getSalesChannel () {
      let that = this
      api.getSalesChannel(function(res){
        if (res.code === 200) {
          that.salesChannelSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getSubSaleChannel () {
      let that = this
      api.getSubSaleChannel(function(res){
        if (res.code === 200) {
          that.subSalesChannelSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getVirtualPlatformSales () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'startPaidDate',
        value: this.searchData.startPaidDate
      }, {
      	name: 'endPaidDate',
        value: this.searchData.endPaidDate
      }, {
      	name: 'salesChannel',
        value: this.searchData.salesChannel
      }, {
      	name: 'subSalesChannel',
        value: this.searchData.subSalesChannel
      }, {
      	name: 'startActiveTime',
        value: this.searchData.startActiveTime
      }, {
        name: 'endActiveTime',
        value: this.searchData.endActiveTime
      }, {
        name: 'payeeCode',
        value: this.searchData.payeeCode
      }, {
        name: 'invoiceEntityCode',
        value: this.searchData.invoiceEntityCode
      }, {
        name: 'orderStatus',
        value: this.searchData.orderStatus
      }, {
        name: 'sumWay',
        value: this.searchData.sumWay
      }]
      api.getVirtualPlatformSales(this.common.joinSearchParam(pathParams), function(res){
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
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.getAllBillingUnit()
    this.getOrderStatus()
    this.getPayeeUnit()
    this.getSalesChannel()
    this.getSubSaleChannel()
    this.defaultTableKey = JSON.parse(JSON.stringify(this.simpleTableKey))
  }
}
</script>

<style>
</style>
