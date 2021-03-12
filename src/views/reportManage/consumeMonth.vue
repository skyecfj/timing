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
        <div class="selectTitle">线上/线下</div>
          <el-select size="small"  v-model="searchData.ifOnline">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifOnlineSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" v-if="activeName ==='companyReport'">
        <div class="selectTitle">卡种类</div>
          <el-select size="small"  v-model="searchData.productType" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in productTypeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" v-if="activeName ==='companyReport'">
        <div class="selectTitle">发卡方</div>
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
  name: 'consumeMonth',
  data () {
    return {
      searchData: {
        summaryDate: '',
        resBrand: '',
        resOprMarket: '',
        ifDSales: '',
        ifOnline: '',
        productType: '',
        cardSupplier: ''
      },
      brandSelect: [],
      oprMarketSelect: [],
      ifDSalesSelect: [{
        id : 'Y',
        name: '直营'
      }, {
        id : 'N',
        name: '加盟'
      }],
      ifOnlineSelect: [{
        id : 'Y',
        name: '线上'
      }, {
        id : 'N',
        name: '线下'
      }],
      productTypeSelect: [],
      cardSupplierSelect: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
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
        value: 'resCode'
      }, {
        name: '餐厅名称',
        value: 'resName'
      }, {
        name: '消费金额',
        value: 'transAmount',
        classname: 'sumClass'
      }],
      defaultHeader: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      ifConsumeMonth: false,
      ifConsume: false,
      // consumeMonthSearchData: {},
      // consumeSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      if (this.activeName === 'restaurantReport' && this.ifConsumeMonth) {
        this.getConsumeMonthRes()
      } else if (this.activeName === 'companyReport' && this.ifConsume) {
        this.getConsumeMonth()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if (this.activeName === 'restaurantReport' && this.ifConsumeMonth) {
        this.getConsumeMonthRes()
      } else if (this.activeName === 'companyReport' && this.ifConsume) {
        this.getConsumeMonth()
      }
    },
    searchList () {
      if (this.activeName === 'restaurantReport') {
      	// console.log(this.searchData.summaryDate)
        // this.consumeMonthSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.getConsumeMonthRes()
        this.ifConsumeMonth = true
      } else {
      	// this.consumeSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.getConsumeMonth()
        this.ifConsume = true
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
        api.exportConsumeMonthRes(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '月百胜卡核销报表-按餐厅.xlsx'
            link.target = '_blank';link.click()
          }
        })
      } else {
        let that = this
        api.exportConsumeMonth(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '月百胜卡核销报表-按法人公司.xlsx'
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
        if (this.ifConsumeMonth) {
          // this.searchData = JSON.parse(JSON.stringify(this.consumeMonthSearchData))
          this.getConsumeMonthRes()
        }
      } else {
        this.simpleTableKey = [{name: '日期', value: 'summaryDate'}, {name: '品牌', value: 'resBrand'}, {name: '时段', value: 'transPeriod'},
        {name: '线上/线下', value: 'ifOnline'}, {name: '卡种类', value: 'productType'}, {name: '直营/加盟', value: 'ifDSales'},
        {name: '消费金额', value: 'transAmount', classname: 'sumClass'}, {name: '消费次数', value: 'transTimes'}]
        if (this.ifConsume) {
        	// this.searchData = JSON.parse(JSON.stringify(this.consumeSearchData))
          this.getConsumeMonth()
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
    getConsumeMonthRes () {
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
      api.getConsumeMonthRes(this.common.joinSearchParam(pathParams), function(res){
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
    getConsumeMonth () {
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
      	name: 'ifOnline',
        value: this.searchData.ifOnline
      }, {
      	name: 'productType',
        value: this.searchData.productType
      }, {
      	name: 'cardSupplier',
        value: this.searchData.cardSupplier
      }]
      api.getConsumeMonth(this.common.joinSearchParam(pathParams), function(res){
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
    this.getCardTypes()
    this.defaultHeader = this.simpleTableKey
  }
}
</script>

<style>
</style>
