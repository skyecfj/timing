<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">POS交易号</div>
        <el-input size="small" v-model="searchData.yumTransNo"></el-input>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">营业日期</div>
        <el-date-picker v-model="searchData.startOperationDate" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOperationStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endOperationDate"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOperationEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
          <el-select size="small"  v-model="searchData.resBrand" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in resBrandSelect" :key="item.id" :label="item.englishName" :value="item.englishName">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">交易日期</div>
        <el-date-picker v-model="searchData.startSettleTransTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerTransStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endSettleTransTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerTransEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡供应商</div>
          <el-select size="small"  v-model="searchData.platFormCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in platFormCodeSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人公司</div>
          <el-select size="small"  v-model="searchData.resEntity" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in resEntitySelect" :key="item.jdeCode" :label="`[${item.jdeCode}]${item.companyName}`" :value="item.jdeCode">
              <!--<span>[{{ item.jdeCode }}]</span>-->
              <!--<span>{{ item.companyName }}</span>-->
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">营运市场</div>
          <el-select size="small"  v-model="searchData.resOprMarket" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in resOprMarketSelect" :key="item.id" :label="item.name" :value="item.marketNumber">
              <span>[{{ item.marketNumber }}]</span>
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">财务市场</div>
          <el-select size="small"  v-model="searchData.resFinMarket" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in resFinMarketSelect" :key="item.id" :label="item.name" :value="item.marketNumber">
              <span>[{{ item.marketNumber }}]</span>
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
      </div>
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
        <div class="selectTitle">是否有赠品</div>
          <el-select size="small"  v-model="searchData.ifGift">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifGiftSelect" :key="item.id" :label="item.name" :value="item.id">
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
  name: 'sellCardRestaurant',
  data () {
    return {
    	pickerOperationStart: {
        disabledDate: (time) => {
          if (this.searchData.endOperationDate) {
          	let curDate = (new Date(this.searchData.endOperationDate)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerOperationEnd: {
        disabledDate: (time) => {
          if (this.searchData.startOperationDate) {
          	let curDate = (new Date(this.searchData.startOperationDate)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      pickerTransStart: {
        disabledDate: (time) => {
          if (this.searchData.endSettleTransTime) {
          	let curDate = (new Date(this.searchData.endSettleTransTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerTransEnd: {
        disabledDate: (time) => {
          if (this.searchData.startSettleTransTime) {
          	let curDate = (new Date(this.searchData.startSettleTransTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      searchData: {
      	yumTransNo: '',
      	startOperationDate: '',
      	endOperationDate: '',
      	resBrand: '',
      	startSettleTransTime: '',
      	endSettleTransTime: '',
      	platFormCode: '',
      	resEntity: '',
      	resOprMarket: '',
      	resFinMarket: '',
      	productType: '',
      	productCode: '',
      	ifGift: ''
      },
      resBrandSelect: [],
      platFormCodeSelect: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
      resEntitySelect: [],
      resOprMarketSelect: [],
      resFinMarketSelect: [],
      productTypeSelect: [],
      cardCode: [],
      productCodeSelect: [],
      ifGiftSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      simpleTableData: [],
      simpleTableKey: [{
        name: '卡号',
        value: 'cardNo'
      }, {
        name: 'POS交易号',
        value: 'yumTransNo',
        width: '90'
      }, {
        name: '售卡餐厅JDE代码',
        value: 'resJdeCode',
        width: '120'
      }, {
        name: '售卡餐厅名称',
        value: 'resName',
        width: '100'
      }, {
        name: '营业日期',
        value: 'operationDate'
      }, {
        name: '交易日期',
        value: 'settleTransTime'
      }, {
        name: '售卡金额',
        value: 'settleOrderAmount',
        classname: 'sumClass'
      }, {
        name: '卡种类',
        value: 'productType'
      }, {
        name: '卡产品',
        value: 'productCode'
      }, {
        name: '卡面额',
        value: 'initBalance',
        classname: 'sumClass'
      }, {
        name: '卡折扣率',
        value: 'cardDiscount',
        classname: 'sumClass'
      }, {
        name: '卡供应商',
        value: 'platFormCode'
      }, {
        name: '品牌',
        value: 'resBrand'
      }, {
        name: '营运市场',
        value: 'resOprMarket'
      }, {
        name: '财务市场',
        value: 'resFinMarket'
      }, {
        name: '法人公司',
        value: 'resEntity'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
    }
  },
  props: ['cardNo'],
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getSellRes()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSellRes()
    },
    typeChange (val) {
      this.productCodeSelect = this.cardCode[val]
    },
    searchList () {
      // this.sellResSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getSellRes()
    },
    reset () {
      for (let i in this.searchData) {
        this.searchData[i] = ''
      }
    },
    exportFile () {
      let that = this
      api.exportSellRes(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '售卡查询报表-餐厅售卖.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getAllCompany () {
      let that = this
      api.getAllCompany(function(res){
        if (res.code === 200) {
          that.resEntitySelect = res.data.list
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getBrandEnglishNames () {
      let that = this
      let pathParams = [{
        name: 'flag',
        value: '2'
      }]
      api.getBrandEnglishNames(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.resBrandSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getAllFinanceMarket () {
      let that = this
      api.getAllFinanceMarket(function(res){
        if (res.code === 200) {
          that.resFinMarketSelect = res.data
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
    getAllOperateMarket () {
      let that = this
      api.getAllOperateMarket(function(res){
        if (res.code === 200) {
          that.resOprMarketSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getSellRes () {
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
      	name: 'yumTransNo',
        value: this.searchData.yumTransNo
      }, {
      	name: 'startOperationDate',
        value: this.searchData.startOperationDate
      }, {
      	name: 'endOperationDate',
        value: this.searchData.endOperationDate
      }, {
      	name: 'resBrand',
        value: this.searchData.resBrand
      }, {
        name: 'startSettleTransTime',
        value: this.searchData.startSettleTransTime
      }, {
        name: 'endSettleTransTime',
        value: this.searchData.endSettleTransTime
      }, {
        name: 'platFormCode',
        value: this.searchData.platFormCode
      }, {
        name: 'resEntity',
        value: this.searchData.resEntity
      }, {
        name: 'resOprMarket',
        value: this.searchData.resOprMarket
      }, {
        name: 'resFinMarket',
        value: this.searchData.resFinMarket
      }, {
        name: 'productType',
        value: this.searchData.productType
      }, {
        name: 'productCode',
        value: this.searchData.productCode
      }, {
        name: 'ifGift',
        value: this.searchData.ifGift
      }]
      api.getSellRes(this.common.joinSearchParam(pathParams), function(res){
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
    this.getAllCompany()
    this.getBrandEnglishNames()
    this.getAllFinanceMarket()
    this.getAllOperateMarket()
    this.getCardTypes()
    this.getCardCode()
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
