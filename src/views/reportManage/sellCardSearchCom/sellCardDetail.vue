<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">卡种类</div>
          <el-select size="small"  v-model="searchData.productType" @change="typeChange" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in productTypeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡产品</div>
          <el-select size="small"  v-model="searchData.productCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in productCodeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡面额</div>
        <el-input size="small" v-model="searchData.initBalance"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">售卡订单号</div>
        <el-input size="small" v-model="searchData.orderNo"></el-input>
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
        <div class="selectTitle">售卖渠道</div>
          <el-select size="small"  v-model="searchData.salesChannel" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in salesChannelSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">订单平台</div>
          <el-select size="small"  v-model="searchData.platformCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in platformCodeSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否付款</div>
          <el-select size="small"  v-model="searchData.ifPaid" >
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifInvoiceSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否开票</div>
          <el-select size="small"  v-model="searchData.ifInvoice">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifInvoiceSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">折扣类型</div>
          <el-select size="small"  v-model="searchData.discountType" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in discountTypeSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">售卖日期</div>
        <el-date-picker v-model="searchData.startOrderTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOrderStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endOrderTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOrderEnd"></el-date-picker>
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
import reportTableCom from '../reportTableCom.vue'
import api from '@/model/api'

export default {
  name: 'sellCardDetail',
  data () {
    return {
    	pickerOrderStart: {
        disabledDate: (time) => {
          if (this.searchData.endOrderTime) {
          	let curDate = (new Date(this.searchData.endOrderTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerOrderEnd: {
        disabledDate: (time) => {
          if (this.searchData.startOrderTime) {
          	let curDate = (new Date(this.searchData.startOrderTime)).getTime()
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
      	productType: '',
      	productCode: '',
      	initBalance: '',
      	orderNo: '',
      	orderStatus: '',
      	salesChannel: '',
      	platformCode: '',
      	ifPaid:　'',
      	ifInvoice:　'',
      	discountType: '',
      	startOrderTime: '',
      	endOrderTime: '',
        startActiveTime: '',
        endActiveTime: '',
        payeeCode: '',
        invoiceEntityCode: '',
        sumWay: ''
      },
      productTypeSelect: [],
      productCodeSelect: [],
      orderStatusSelect: [],
      salesChannelSelect: [],
      platformCodeSelect: [{
        dictionaryCode: "ZHX",
        dictionaryName: "ZHX"
      }, {
        dictionaryCode: "UNP",
        dictionaryName: "UNP"
      }],
      ifPaidSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      ifInvoiceSelect:　[{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      discountTypeSelect: [],
      payeeCodeSelect: [],
      invoiceEntityCodeSelect: [],
      sumWaySelect: [{
        id: 1,
        name: '开票单位'
      }, {
        id: 2,
        name: '开票单位+收款单位'
      }],
      cardCode: {},
      simpleTableData: [],
      simpleTableKey: [{
        name: '订单平台',
        value: 'platformCode'
      }, {
        name: '售卖渠道',
        value: 'salesChannelName'
      }, {
        name: '子订单渠道',
        value: 'subSalesChannel',
        width: '90'
      }, {
        name: '订单号',
        value: 'orderNo'
      }, {
        name: '订单状态',
        value: 'orderStatusName'
      }, {
        name: '订单日期',
        value: 'orderTime'
      }, {
        name: '订单激活日期',
        value: 'activeTime',
        width: '100'
      }, {
        name: '开票单位',
        value: 'invoiceEntityName'
      }, {
        name: '收款单位',
        value: 'payeeName'
      }, {
        name: '卡种类',
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
        name: '赠品面额',
        value: 'presentAmount',
        classname: 'sumClass'
      }, {
        name: '赠券金额',
        value: 'pntCouponAmount',
        classname: 'sumClass'
      }, {
        name: '无价赠品',
        value: 'noValuePntAmount',
        classname: 'sumClass'
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
        width: '110',
        classname: 'sumClass'
      }, {
        name: '订单来源',
        value: 'orderFrom'
      }, {
        name: '销售员代码',
        value: 'salesMan',
        width: '90'
      }, {
        name: '下单人',
        value: 'giver'
      }, {
        name: '付款银行户名',
        value: 'payerBankAccname',
        width: '100'
      }, {
        name: '付款银行账号',
        value: 'payerBankAcccode',
        width: '100'
      }, {
        name: '购买人类型',
        value: 'customerTypeName',
        width: '90'
      }, {
        name: '购买人名称',
        value: 'buyer',
        width: '90'
      }, {
      	name: '身份证号',
        value: 'buyerIdNo'
      }, {
        name: '联系电话',
        value: 'buyerCellphoneNo'
      }, {
        name: '退单时间',
        value: 'refundOrderTime'
      }, {
        name: '退款金额',
        value: 'refundAmount',
        classname: 'sumClass'
      }, {
        name: '退款手续费',
        value: 'refundServiceCharge',
        width: '90',
        classname: 'sumClass'
      }],
      defaultTableKey: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // rscSumSearchData: {},
      // sellRscSearchData: {},
    }
  },
  props: ['cardNo'],
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      if (this.searchData.sumWay) {
      	this.getSellRscSum()
      } else{
      	this.getSellRscDetail()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if (this.searchData.sumWay) {
      	this.getSellRscSum()
      } else{
      	this.getSellRscDetail()
      }
    },
    typeChange (val) {
      this.productCodeSelect = this.cardCode[val]
    },
    searchList () {
      if (this.searchData.sumWay === 1) {
        // this.rscSumSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.simpleTableKey = [{name: '开票单位', value: 'invoiceEntityName'},{name: '订单金额', value: 'orderAmount'},{name: '现金折扣', value: 'discountRate'},
        {name: '赠卡面额', value: 'initBalance'},{name: '赠品面额', value: 'presentAmount'},{name: '赠券金额', value: 'pntCouponAmount'},{name: '无价赠品', value: 'noValuePntAmount'},
        {name: '折扣金额', value: 'discountAmount'},{name: '卡面额含赠卡', value: 'cardFaceAmount', width: '100'},{name: '卡外收费', value: 'cardOutAmount'},{name: '应收金额', value: 'arAmount'},
        {name: '折扣率（入卡）', value: 'disRate', width: '110'},{name: '退款金额', value: 'refundAmount'},{name: '退款手续费', value: 'refundServiceCharge', width: '90'}]
        this.getSellRscSum()
      } else if (this.searchData.sumWay === 2) {
        // this.rscSumSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.simpleTableKey = [{name: '开票单位', value: 'invoiceEntityName'},{name: '收款单位', value: 'payeeName'},{name: '订单金额', value: 'orderAmount'},
        {name: '现金折扣', value: 'discountRate'},{name: '赠卡面额', value: 'initBalance'},{name: '赠品面额', value: 'presentAmount'},{name: '赠券金额', value: 'pntCouponAmount'},
        {name: '无价赠品', value: 'noValuePntAmount'},{name: '折扣金额', value: 'discountAmount'},{name: '卡面额含赠卡', value: 'cardFaceAmount', width: '100'},{name: '卡外收费', value: 'cardOutAmount'},
        {name: '应收金额', value: 'arAmount'},{name: '折扣率（入卡）', value: 'disRate', width: '110'},{name: '退款金额', value: 'refundAmount'},{name: '退款手续费', value: 'refundServiceCharge', width: '90'}]
        this.getSellRscSum()
      } else {
        // this.sellRscSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.simpleTableKey = JSON.parse(JSON.stringify(this.defaultTableKey))
        this.getSellRscDetail()
      }
    },
    reset () {
      for (let i in this.searchData) {
        this.searchData[i] = ''
      }
    },
    exportFile () {
      let that = this
      if (this.searchData.sumWay) {
      	api.exportSellRscSum(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '实体卡售卖查询报表-订单售卖.xlsx'
            link.target = '_blank';link.click()
          }
        })
      } else{
      	api.exportSellRscDetail(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '实体卡售卖查询报表-订单售卖.xlsx'
            link.target = '_blank';link.click()
          }
        })
      }
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
    getDiscountType () {
      let that = this
      api.getDiscountType(function(res){
        if (res.code === 200) {
          that.discountTypeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
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
    getCardTypes () {
      let that = this
      api.getCardTypes(function(res){
        if (res.code === 200) {
          that.productTypeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCardCode () {
      let that = this
      api.getCardCode(function(res){
        if (res.code === 200) {
          that.cardCode = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getSellRscDetail () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'cardNo',
        value: this.cardNo
      }, {
      	name: 'orderNo',
        value: this.searchData.orderNo
      }, {
      	name: 'orderStatus',
        value: this.searchData.orderStatus
      }, {
      	name: 'salesChannel',
        value: this.searchData.salesChannel
      }, {
      	name: 'platformCode',
        value: this.searchData.platformCode
      }, {
      	name: 'ifPaid',
        value: this.searchData.ifPaid
      }, {
        name: 'ifInvoice',
        value: this.searchData.ifInvoice
      }, {
        name: 'productType',
        value: this.searchData.productType
      }, {
        name: 'productCode',
        value: this.searchData.productCode
      }, {
        name: 'initBalance',
        value: this.searchData.initBalance
      }, {
        name: 'discountType',
        value: this.searchData.discountType
      }, {
        name: 'startOrderTime',
        value: this.searchData.startOrderTime
      }, {
        name: 'endOrderTime',
        value: this.searchData.endOrderTime
      }, {
        name: 'payeeCode',
        value: this.searchData.payeeCode
      }, {
        name: 'startActiveTime',
        value: this.searchData.startActiveTime
      }, {
        name: 'endActiveTime',
        value: this.searchData.endActiveTime
      }, {
        name: 'invoiceEntityCode',
        value: this.searchData.invoiceEntityCode
      }]
      api.getSellRscDetail(this.common.joinSearchParam(pathParams), function(res){
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
    getSellRscSum () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'cardNo',
        value: this.cardNo
      }, {
      	name: 'orderNo',
        value: this.searchData.orderNo
      }, {
      	name: 'orderStatus',
        value: this.searchData.orderStatus
      }, {
      	name: 'salesChannel',
        value: this.searchData.salesChannel
      }, {
      	name: 'platformCode',
        value: this.searchData.platformCode
      }, {
      	name: 'ifPaid',
        value: this.searchData.ifPaid
      }, {
        name: 'ifInvoice',
        value: this.searchData.ifInvoice
      }, {
        name: 'productType',
        value: this.searchData.productType
      }, {
        name: 'productCode',
        value: this.searchData.productCode
      }, {
        name: 'initBalance',
        value: this.searchData.initBalance
      }, {
        name: 'discountType',
        value: this.searchData.discountType
      }, {
        name: 'startOrderTime',
        value: this.searchData.startOrderTime
      }, {
        name: 'endOrderTime',
        value: this.searchData.endOrderTime
      }, {
        name: 'payeeCode',
        value: this.searchData.payeeCode
      }, {
        name: 'startActiveTime',
        value: this.searchData.startActiveTime
      }, {
        name: 'endActiveTime',
        value: this.searchData.endActiveTime
      }, {
        name: 'invoiceEntityCode',
        value: this.searchData.invoiceEntityCode
      }, {
        name: 'sumWay',
        value: this.searchData.sumWay
      }]
      api.getSellRscSum(this.common.joinSearchParam(pathParams), function(res){
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
    this.getDiscountType()
    this.getOrderStatus()
    this.getPayeeUnit()
    this.getSalesChannel()
    this.getCardTypes()
    this.getCardCode()
    this.defaultTableKey = JSON.parse(JSON.stringify(this.simpleTableKey))
  }
}
</script>

<style lang="scss" scoped>
.mainContent {
  .searchContent {
    margin-bottom: 0px;
  }
  .dataContent {
    padding: 0 0 20px;
  }
}
</style>
