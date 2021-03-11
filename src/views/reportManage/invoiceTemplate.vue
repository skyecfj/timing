<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">开票月份</div>
        <el-date-picker v-model="searchData.summaryDate" type="month"
          value-format="yyyy-MM" placeholder="选择月份"></el-date-picker>
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
  name: 'invoiceTemplate',
  data () {
    return {
      searchData: {
        summaryDate: ''
      },
      simpleTableData: [],
      simpleTableKey: [{
        name: '订单号',
        value: 'orderNo',
        width: '210'
      }, {
        name: '订单时间',
        value: 'orderTime',
        width: '120'
      }, {
        name: '销方税号',
        value: 'taxNumber',
        width: '180'
      }, {
        name: '开票类型',
        value: 'invoiceType'
      }, {
        name: '客户类型',
        value: 'customerType'
      }, {
        name: '客户名称',
        value: 'customerName',
        width: '200'
      }, {
        name: '客户税号',
        value: 'customerTaxNumber',
        width: '180'
      }, {
        name: '客户地址、电话',
        value: 'customerAddress',
        width: '280'
      }, {
        name: '客户银行、账号',
        value: 'bank',
        width: '180'
      }, {
        name: '客户邮箱',
        value: 'mail',
        width: '200'
      }, {
        name: '客户手机号',
        value: 'phone',
        width: '120'
      }, {
        name: '备注',
        value: 'notes',
        width: '210'
      }, {
        name: '原发票代码',
        value: 'oldInvoiceCodeA',
        width: '180'
      }, {
        name: '原发票号码',
        value: 'oldInvoiceCodeB',
        width: '180'
      }, {
        name: '商品名称',
        value: 'commodityName'
      }, {
        name: '商品编号',
        value: 'commodityNumber'
      }, {
        name: '计量单位',
        value: 'measurementUnit'
      }, {
        name: '规格型号',
        value: 'standard'
      }, {
        name: '数量',
        value: 'number'
      }, {
        name: '单价',
        value: 'price',
        classname: 'sumClass'
      }, {
        name: '金额（含税）',
        value: 'amount',
        width: '100',
        classname: 'sumClass'
      }, {
        name: '税率',
        value: 'tax',
        classname: 'sumClass'
      }, {
        name: '税额',
        value: 'taxAmount',
        classname: 'sumClass'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // invoiceSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getInvoiceTemplate()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getInvoiceTemplate()
    },
    searchList () {
      // this.invoiceSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getInvoiceTemplate()
    },
    reset () {
      this.searchData.summaryDate = ''
    },
    exportFile () {
      let that = this;

      api.exportInvoiceTemplate(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '电子发票开票模板报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getInvoiceTemplate () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'summaryDate',
        value: this.searchData.summaryDate
      }]
      api.getInvoiceTemplate(this.common.joinSearchParam(pathParams),function(res){
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
  }
}
</script>

<style>
</style>
