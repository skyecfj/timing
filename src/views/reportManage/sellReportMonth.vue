<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">年/月</div>
        <el-date-picker v-model="searchData.summaryDate" type="month" value-format="yyyy-MM" placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
          <el-select size="small"  v-model="searchData.resBrand" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in brandSelect" :key="item.id" :label="item.englishName" :value="item.englishName">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" v-if="activeName ==='restaurantReport'">
        <div class="selectTitle">营运市场</div>
          <el-select size="small"  v-model="searchData.resOprMarket" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in oprMarketSelect" :key="item.id" :label="item.name" :value="item.marketNumber">
              <span>[{{ item.marketNumber }}]</span>
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" v-if="activeName ==='companyReport'">
        <div class="selectTitle">直营/加盟</div>
          <el-select size="small"  v-model="searchData.ifDSales">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifDSalesSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" v-if="activeName ==='companyReport'">
        <div class="selectTitle">虚拟卡/实体卡</div>
          <el-select size="small"  v-model="searchData.ifVCard">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifVCardSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" v-if="activeName ==='companyReport'">
        <div class="selectTitle">卡供应商</div>
          <el-select size="small"  v-model="searchData.cardSupplier">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in cardSupplierSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <div class="tab-content" >
        <el-tabs v-model="activeName" @tab-click="handleSwitch">
          <el-tab-pane label="按餐厅" name="restaurantReport">
            <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
          </el-tab-pane>
          <el-tab-pane label="按法人公司" name="companyReport">
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
        summaryDate: '',
        resBrand: '',
        resOprMarket: '',
        ifDSales: '',
        ifVCard: '',
        cardSupplier: ''
      },
      brandSelect: [],
      oprMarketSelect: [],
      ifDSalesSelect: [{
        id : 'y',
        name: '直营'
      }, {
        id : 'n',
        name: '加盟'
      }],
      ifVCardSelect: [{
        id : 'y',
        name: '虚拟卡'
      }, {
        id : 'n',
        name: '实体卡'
      }],
      cardSupplierSelect: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
      EntitySelect: [],
      issuingUnitSelect: [],
      CodeSelect: [],
      BrandSelect: [],
      activeName: 'restaurantReport',
      simpleTableData: [],
      simpleTableKey: [{
        name: '日期',
        value: 'summaryDate'
      }, {
        name: '品牌',
        value: 'resBrand'
      }, {
        name: '营运市场',
        value: 'resOprMarket'
      }, {
        name: '餐厅代码',
        value: 'branchCode'
      }, {
        name: '餐厅名称',
        value: 'resName'
      }, {
        name: '订单金额',
        value: 'orderAmount',
        classname: 'sumClass'
      }, {
        name: '卡面额（含赠卡）',
        value: 'cardTotalAmount',
        width: '130',
        classname: 'sumClass'
      }, {
        name: '折扣金额',
        value: 'discountAmount',
        classname: 'sumClass'
      }, {
        name: '张数',
        value: 'cardCount'
      }, {
        name: '应收金额',
        value: 'arAmount',
        classname: 'sumClass'
      }],
      defaultHeader: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      ifSellMonth: false,
      ifSell: false,
      // sellMonthSearchData: {},
      // sellSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      if (this.activeName === 'restaurantReport' && this.ifSellMonth) {
        this.getSellReportMonth()
      } else if (this.activeName === 'companyReport' && this.ifSell) {
        this.getSellReport()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if (this.activeName === 'restaurantReport' && this.ifSellMonth) {
        this.getSellReportMonth()
      } else if (this.activeName === 'companyReport' && this.ifSell) {
        this.getSellReport()
      }
    },
    searchList () {
      if (this.activeName === 'restaurantReport') {
        // this.sellMonthSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.getSellReportMonth()
        this.ifSellMonth = true
      } else {
      	// this.sellSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.getSellReport()
        this.ifSell = true
      }
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      if (this.activeName === 'restaurantReport') {
        let that = this
        api.exportSellMonth(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '月百胜卡售卖报表-按餐厅.xlsx'
            link.target = '_blank';link.click()
          }
        })
      } else {
        let that = this
        api.exportSell(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '月百胜卡售卖报表-按法人公司.xlsx'
            link.target = '_blank';link.click()
          }
        })
      }
    },
    handleSwitch (tab) {
      this.pageSize = 10
      this.currentPage = 1
      this.simpleTableData = []
      this.totalRecords = 0
      this.reset()
      if(tab.name === 'restaurantReport'){
        this.simpleTableKey = this.defaultHeader
        if (this.ifSellMonth) {
          // this.searchData = JSON.parse(JSON.stringify(this.sellMonthSearchData))
          this.getSellReportMonth()
        }
      } else {
        this.simpleTableKey = [{name: '日期', value: 'summaryDate', width: '100'}, {name: '售卖卡种类', value: 'productType', width: '100'}, {name: '售卡方', value: 'sellCard'},
        {name: '直营/加盟', value: 'ifDSales', width: '100'}, {name: '实体/虚拟', value: 'ifVCard', width: '100'},{name: '发卡方', value: 'cardIssuer'},
        {name: '订单金额', value: 'orderAmount', classname: 'sumClass'}, {name: '卡面额(含赠卡)', value: 'cardBalance', width: '130', classname: 'sumClass'},{name: '折扣金额', value: 'discountAmount', classname: 'sumClass'},
        {name: '卡数量', value: 'cardCount'}, {name: '现金', value: 'cash', classname: 'sumClass'}, {name: '转账', value: 'transferAccounts', classname: 'sumClass'}, {name: '第三方支付平台', value: 'tposPaymentPlatform', width: '120'}]
        if (this.ifSell) {
        	// this.searchData = JSON.parse(JSON.stringify(this.sellSearchData))
          this.getSellReport()
        }
      }
    },
    getBrandEnglishNames () {
      let that = this
      let pathParams = [{
        name: 'flag',
        value: '2'
      }]
      api.getBrandEnglishNames(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.brandSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getAllOperateMarket () {
      let that = this
      api.getAllOperateMarket(function(res){
        if (res.code === 200) {
          that.oprMarketSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getSellReportMonth () {
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
      }, {
      	name: 'resBrand',
        value: this.searchData.resBrand
      }, {
      	name: 'resOprMarket',
        value: this.searchData.resOprMarket
      }]
      api.getSellReportMonth(this.common.joinSearchParam(pathParams),function(res){
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
    getSellReport () {
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
      }, {
      	name: 'resBrand',
        value: this.searchData.resBrand
      }, {
      	name: 'ifDSales',
        value: this.searchData.ifDSales
      }, {
      	name: 'ifVCard',
        value: this.searchData.ifVCard
      }, {
      	name: 'cardSupplier',
        value: this.searchData.cardSupplier
      }]
      api.getSellReport(this.common.joinSearchParam(pathParams),function(res){
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
    this.getBrandEnglishNames()
    this.getAllOperateMarket()
    this.defaultHeader = this.simpleTableKey
  }
}
</script>

<style>
</style>
