<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">核对截止日期</div>
        <el-date-picker
          v-model="searchData.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <div class="tab-content" >
        <el-tabs v-model="activeName" @tab-click="handleSwitch">
          <el-tab-pane label="天猫商城订单有" name="tmHaveOrder">
            <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey">
            </report-table-com>
          </el-tab-pane>
          <el-tab-pane label="天猫商城订单无" name="tmNoOrder">
            <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
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
  </div>
</template>

<script>
import reportTableCom from './reportTableCom.vue'
import api from '@/model/api'

export default {
  name: 'vdmCouponConsume',
  data () {
    return {
      searchData: {
        date: ''
      },
      activeName: 'tmHaveOrder',
      simpleTableData: [],
      simpleTableKey: [{
        name: '商户订单号',
        value: 'orderId',
        width: '100'
      }, {
        name: '支付宝交易号',
        value: 'transactionNo',
        width: '110'
      }, {
        name: '对方账户',
        value: 'buyerAccount'
      }, {
        name: '对方名称',
        value: 'buyerName'
      }, {
        name: '订单创建时间',
        value: 'createTime',
        width: '110'
      }, {
        name: '退款金额',
        value: 'refundAmount',
        classname: 'sumClass'
      }, {
        name: '订单金额',
        value: 'orderAmount',
        classname: 'sumClass'
      }, {
        name: '服务费',
        value: 'serviceFee',
        classname: 'sumClass'
      }, {
        name: '退服务费',
        value: 'rechargeFee',
        classname: 'sumClass'
      }, {
        name: '订单状态',
        value: 'orderStatus'
      }, {
        name: '最后更新时间',
        value: 'lastUpdateTime',
        width: '110'
      }, {
        name: '商品名称',
        value: 'productName',
        width: '100'
      }, {
        name: '银行订单号',
        value: 'bankOrderId',
        width: '100'
      }, {
        name: '分公司',
        value: 'branchCompany'
      }, {
        name: '交易分类',
        value: 'transCategory'
      }, {
        name: '交易方式',
        value: 'transType'
      }, {
        name: '门店',
        value: 'store'
      }, {
        name: '品牌',
        value: 'brand'
      }],
      defaultHeader: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      isHave: false,
      ifNo: false,
      // haveSearchData: {},
      // noSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
  	  this.pageSize = val
  	  if (this.activeName === 'tmHaveOrder' && this.ifHave) {
        this.getHaveOrder()
      } else if (this.activeName === 'tmNoOrder' && this.ifNo) {
        this.getNoOrder()
      }
  	},
  	handleCurrentChange (val) {
  	  this.currentPage = val
  	  if (this.activeName === 'tmHaveOrder' && this.ifHave) {
        this.getHaveOrder()
      } else if (this.activeName === 'tmNoOrder' && this.ifNo) {
        this.getNoOrder()
      }
  	},
    handleSwitch (tab) {
      this.pageSize = 10
      this.currentPage = 1
      this.simpleTableData = []
      this.totalRecords = 0
      this.reset()
      if(tab.name === 'tmHaveOrder'){
        this.simpleTableKey = this.defaultHeader
        if (this.ifHave) {
          // this.searchData = JSON.parse(JSON.stringify(this.haveSearchData))
          this.getHaveOrder()
        }
      } else {
      	this.simpleTableKey = [{name: '订单时间', value: 'ordertime'},{name: '订单号', value: 'orderid'},{name: '退款日期', value: 'deltime'},
        {name: '发货日期', value: 'deliverytime'},{name: '券码金额', value: 'price'},{name: '订单金额', value: 'orderamount'},
        {name: '退款金额', value: 'refundamount'},{name: '券码号', value: 'coupon'}]
        if (this.ifNo) {
          // this.searchData = JSON.parse(JSON.stringify(this.noSearchData))
          this.getNoOrder()
        }
      }
    },
    searchList () {
      this.searchData.date = this.searchData.date + ' 23:59:59'
    	if (this.activeName === 'tmHaveOrder') {
        // this.haveSearchData = JSON.parse(JSON.stringify(this.searchData))
      	this.getHaveOrder()
      	this.ifHave = true
      } else {
      	// this.noSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.getNoOrder()
        this.ifNo = true
      }
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      if (this.activeName === 'tmHaveOrder') {
        api.exportHaveOrder(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '天猫商城订单有对接平台订单报表.xlsx'
            link.target = '_blank';link.click()
          }
        })
      } else {
        api.exportNoOrder(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '天猫商城订单无对接平台订单报表.xlsx'
            link.target = '_blank';link.click()
          }
        })
      }
    },
    getHaveOrder () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'date',
        value: this.searchData.date
      }]
      api.getHaveOrder(this.common.joinSearchParam(pathParams),function(res){
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
    getNoOrder () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'date',
        value: this.searchData.date
      }]
      api.getNoOrder(this.common.joinSearchParam(pathParams),function(res){
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
    this.defaultHeader = JSON.parse(JSON.stringify(this.simpleTableKey))
  }
}
</script>

<style>
</style>
