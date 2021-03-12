<template>
  <div class="mainContent">
  	<div class="searchContent">
      <div class="selectContent" v-if="activeName === 'yearAccount'">
        <div class="selectTitle">年份</div>
        <el-date-picker
          v-model="searchData.date"
          type="year"
          value-format="yyyy"
          placeholder="选择年份">
        </el-date-picker>
      </div>
      <div class="selectContent" v-else>
        <div class="selectTitle">月份</div>
        <el-date-picker
          v-model="searchData.date"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月份">
        </el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人公司类型</div>
          <el-select size="small"  v-model="searchData.corpType" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in corpTypeSelect" :key="index" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡种类</div>
          <el-select size="small"  v-model="searchData.productTypeName" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in productTypeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
  	<div class="dataContent">
      <div class="tab-content">
        <el-tabs class="gift-card" v-model="activeName" @tab-click="handleSwitch">
          <el-tab-pane label="年结算报表" name="yearAccount">
            <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey">
            </report-table-com>
          </el-tab-pane>
          <el-tab-pane label="月结算报表" name="monthAccount">
            <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey">
            </report-table-com>
          </el-tab-pane>
          <el-tab-pane label="月结算报表-按开票单位" name="monthStoreAccount">
            <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey">
            </report-table-com>
          </el-tab-pane>
        </el-tabs>
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
  </div>
</template>

<script>
import reportTableCom from './reportTableCom.vue'
import api from '@/model/api'

export default {
  name: 'giftCardAccount',
  data () {
    return {
      searchData: {
        date: '',
//      month: '',
        corpType: '',
        productTypeName: ''
      },
      corpTypeSelect: [{
        name: 'CHC',
        value: '0'
      }, {
        name: '自营',
        value: '1'
      }, {
        name: '加盟商',
        value: '2'
      }],
      productTypeSelect: [],
      activeName: 'yearAccount',
      simpleTableData: [],
      simpleTableKey: [{
        name: '法人公司',
        value: 'legalEntityName'
      }, {
        name: '法人公司代码',
        value: 'legalEntityCode',
        width: '120'
      }, {
        name: '应收总额',
        value: 'arAmount',
        classname: 'sumClass'
      }, {
        name: '当年累计售卡面额',
        value: 'salesDenomination',
        classname: 'sumClass'
      }, {
        name: '减：当年累计售卡面额-现金折扣',
        value: 'cashRate',
        width: '120',
        classname: 'sumClass'
      }, {
        name: '卡外收费',
        value: 'cardOutsideCharge',
        classname: 'sumClass'
      }, {
        name: '其他',
        value: 'other'
      }, {
        name: '应付总额',
        value: 'payableAmount',
        classname: 'sumClass'
      }, {
        name: '当年累计刷卡面额',
        value: 'swingCardAmount',
        classname: 'sumClass'
      }, {
        name: '减：当年累计分摊折扣',
        value: 'shareDiscount',
        classname: 'sumClass'
      }, {
        name: '免费产品',
        value: 'presentAmount',
        classname: 'sumClass'
      }, {
        name: '当年累计分摊手续费',
        value: 'sharePoundage',
        classname: 'sumClass'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      ifYear: false,
      ifMonth: false,
      ifStore: false,
      // yearSearchData: {},
      // monSearchData: {},
      // storeSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
  	handleSizeChange (val) {
  	  this.pageSize = val
  	  if (this.activeName === 'yearAccount' && this.ifYear) {
        this.getGiftCardYearAccount()
      } else if (this.activeName === 'monthAccount' && this.ifMonth) {
        this.getGiftCardMonAccount()
      } else if (this.activeName === 'monthStoreAccount' && this.ifStore) {
        this.getGiftCardIssuingAccount()
      }
  	},
  	handleCurrentChange (val) {
  	  this.currentPage = val
  	  if (this.activeName === 'yearAccount' && this.ifYear) {
        this.getGiftCardYearAccount()
      } else if (this.activeName === 'monthAccount' && this.ifMonth) {
        this.getGiftCardMonAccount()
      } else if (this.activeName === 'monthStoreAccount' && this.ifStore) {
        this.getGiftCardIssuingAccount()
      }
  	},
    handleSwitch (tab) {
      this.pageSize = 10
      this.currentPage = 1
      this.simpleTableData = []
      this.totalRecords = 0
      this.reset()
      if(tab.name === 'yearAccount'){
        this.simpleTableKey = this.defaultHeader
        if (this.ifYear) {
          // this.searchData = JSON.parse(JSON.stringify(this.yearSearchData))
          this.getGiftCardYearAccount()
        }
      } else if (tab.name === 'monthAccount') {
        this.simpleTableKey = [{name: '法人公司', value: 'legalEntityName'},{name: '法人公司代码', value: 'legalEntityCode', width: '120'},{name: '应收总额（=a-b-c+d）', value: 'arAmount', width: '120', classname: 'sumClass'},
        {name: '当月售卡面额-当月销卡面额(=a-c)', value: 'arSalesAmount', width: '120', classname: 'sumClass'},{name: '当月售卡折扣-当月销卡折扣(=b-d)', value: 'arDiscount', width: '130', classname: 'sumClass'},{name: 'a当月售卡面额', value: 'salesDenomination', classname: 'sumClass'},
        {name: 'b当月售卡现金折扣', value: 'cashRate', classname: 'sumClass'},{name: 'c当月销卡面额', value: 'backAmount', classname: 'sumClass'},{name: 'd当月销卡现金折扣', value: 'cardDiscount', classname: 'sumClass'},
        {name: '卡外收费', value: 'cardOutsideCharge', classname: 'sumClass'},{name: '其他', value: 'other'},{name: '应付总额', value: 'payableAmount', classname: 'sumClass'},{name: '当月刷卡面额', value: 'swingCardAmount', classname: 'sumClass'},
        {name: '减：当月分摊折扣', value: 'shareDiscount', classname: 'sumClass'},{name: '免费产品', value: 'presentAmount', classname: 'sumClass'},{name: '当月分摊手续费', value: 'sharePoundage', classname: 'sumClass'},{name: '减：上月分摊折扣', value: 'lastShareDiscount', classname: 'sumClass'}]
        if (this.ifMonth) {
          // this.searchData = JSON.parse(JSON.stringify(this.monSearchData))
          this.getGiftCardMonAccount()
        }
      } else {
      	this.simpleTableKey = [{name: '开票单位', value: 'issuingOffName'},{name: '开票单位代码', value: 'issuingOff', width: '120'},{name: '应收总额', value: 'arAmount', classname: 'sumClass'},
        {name: '当月售卡面额', value: 'salesDenomination', classname: 'sumClass'},{name: '减：当月售卡现金折扣', value: 'cashRate', classname: 'sumClass'},{name: '卡外收费', value: 'cardOutsideCharge', classname: 'sumClass'},
        {name: '其他', value: 'other'},{name: '应付总额', value: 'payableAmount', classname: 'sumClass'},{name: '当月刷卡面额', value: 'swingCardAmount', classname: 'sumClass'},
        {name: '减：当月分摊折扣', value: 'shareDiscount', classname: 'sumClass'},{name: '免费产品', value: 'presentAmount', classname: 'sumClass'},{name: '当月分摊手续费', value: 'sharePoundage', classname: 'sumClass'},{name: '减：上月分摊折扣', value: 'lastShareDiscount', classname: 'sumClass'}]
        if (this.ifStore) {
          // this.searchData = JSON.parse(JSON.stringify(this.storeSearchData))
          this.getGiftCardIssuingAccount()
        }
      }
    },
    searchList () {
      if (this.activeName === 'yearAccount') {
        // this.yearSearchData = JSON.parse(JSON.stringify(this.searchData))
      	this.getGiftCardYearAccount()
      	this.ifYear = true
      } else if (this.activeName === 'monthAccount') {
        // this.monSearchData = JSON.parse(JSON.stringify(this.searchData))
      	this.getGiftCardMonAccount()
      	this.ifMonth = true
      } else {
      	// this.storeSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.getGiftCardIssuingAccount()
        this.ifStore = true
      }
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      if (this.activeName === 'yearAccount') {
        api.exportGiftCardYearAccount(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '礼品卡结算报表-年结算.xlsx'
            link.target = '_blank';link.click()
          }
        })
      } else if (this.activeName === 'monthAccount') {
        api.exportGiftCardMonAccount(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '礼品卡结算报表-月结算.xlsx'
            link.target = '_blank';link.click()
          }
        })
      } else {
        api.exportGiftCardIssuingAccount(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '礼品卡结算报表-按开票单位.xlsx'
            link.target = '_blank';link.click()
          }
        })
      }
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
    getGiftCardYearAccount () {
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
      }, {
      	name: 'corpType',
        value: this.searchData.corpType
      }, {
      	name: 'productTypeName',
        value: this.searchData.productTypeName
      }]
      api.getGiftCardYearAccount(this.common.joinSearchParam(pathParams),function(res){
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
    getGiftCardMonAccount () {
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
      }, {
      	name: 'corpType',
        value: this.searchData.corpType
      }, {
      	name: 'productTypeName',
        value: this.searchData.productTypeName
      }]
      api.getGiftCardMonAccount(this.common.joinSearchParam(pathParams),function(res){
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
    getGiftCardIssuingAccount () {
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
      }, {
      	name: 'corpType',
        value: this.searchData.corpType
      }, {
      	name: 'productTypeName',
        value: this.searchData.productTypeName
      }]
      api.getGiftCardIssuingAccount(this.common.joinSearchParam(pathParams),function(res){
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
    this.getCardTypes()
    this.defaultHeader = JSON.parse(JSON.stringify(this.simpleTableKey))
  }
}
</script>

<style>
.gift-card .el-tabs__content {
  height: calc(100% - 55px);
  background-color: white;
}
.gift-card .el-tabs__content .el-tab-pane {
  height: 100%;
}
</style>

<style lang="scss" scoped>
.tab-content {
  height: 100%;
  .el-tabs {
    height: 100%;
  }
}
</style>
