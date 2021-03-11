<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">交易日期</div>
        <el-date-picker v-model="searchData.startSettleTransTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endSettleTransTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">营业日期</div>
        <el-date-picker v-model="searchData.startOperationDate" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOpeStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endOperationDate"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOpeEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡号</div>
        <el-input size="small" v-model="searchData.cardNo"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡面额</div>
        <el-input size="small" v-model="searchData.initBalance"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡种类</div>
          <el-select size="small"  v-model="searchData.productType"　@change="typeChange" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in productTypeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡产品</div>
          <el-select size="small"  v-model="searchData.productCode"　filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in productCodeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡供应商</div>
          <el-select size="small"  v-model="searchData.platformCode">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in platformCodeSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
          <el-select size="small"  v-model="searchData.resBrand"　filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in resBrandSelect" :key="item.id" :label="item.englishName" :value="item.englishName">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">餐厅</div>
          <el-select size="small" ref="storeName" v-model="searchData.resCode" remote :remote-method="remoteStoreName" :loading="loadingStoreName" v-scroll="scrollStoreName" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in storeSelect" :key="item.storeHypId" :label="`[${item.storeHypId}]${item.storeName}`" :value="item.storeHypId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人公司</div>
          <el-select size="small"  v-model="searchData.resEntity"　filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in resEntitySelect" :key="item.jdeCode" :label="`[${item.jdeCode}]${item.companyName}`" :value="item.jdeCode">
              <!--<span>[{{ item.jdeCode }}]</span>-->
              <!--<span>{{ item.companyName }}</span>-->
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">财务市场</div>
          <el-select size="small"  v-model="searchData.resFinMarket"　filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in resFinMarketSelect" :key="item.id" :label="item.name" :value="item.marketNumber">
              <span>[{{ item.marketNumber }}]</span>
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">营运市场</div>
          <el-select size="small"  v-model="searchData.resOprMarket"　filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in resOprMarketSelect" :key="item.id" :label="item.name" :value="item.marketNumber">
              <span>[{{ item.marketNumber }}]</span>
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否虚拟卡</div>
          <el-select size="small"  v-model="searchData.ifVCard">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifVCardSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否线上</div>
          <el-select size="small"  v-model="searchData.ifOnline">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifOnlineSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否撤销核销</div>
        <el-select size="small"  v-model="searchData.ifConsume">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in ifOnlineSelect" :key="item.id" :label="item.name" :value="item.id">
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
import scroll from '@/directives/index'

export default {
  name: 'consumeSearch',
  data () {
    return {
    	pickerStart: {
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
      pickerEnd: {
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
      pickerOpeStart: {
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
      pickerOpeEnd: {
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
      searchData: {
        startSettleTransTime: '',
        endSettleTransTime: '',
        startOperationDate: '',
        endOperationDate: '',
        cardNo: '',
        initBalance: '',
        productType:　'',
        productCode: '',
        resBrand: '',
        resCode: '',
        resEntity: '',
        resFinMarket: '',
        resOprMarket: '',
        ifVCard: '',
        ifOnline: '',
        ifConsume:''
      },
      productTypeSelect:　[],
      cardCode:　[],
      productCodeSelect: [],
      platformCodeSelect: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
      resBrandSelect: [],
      storeSelect: [],
      resEntitySelect: [],
      resFinMarketSelect: [],
      resOprMarketSelect: [],
      ifVCardSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      ifOnlineSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      simpleTableData: [],
      simpleTableKey: [{
        name: '卡号/虚拟卡账号',
        value: 'cardNo',
        width: '120'
      }, {
        name: '消费餐厅编号',
        value: 'resCode',
        width: '110'
      }, {
        name: '消费餐厅名称',
        value: 'resName',
        width: '110'
      }, {
        name: '卡平台交易号',
        value: 'settleOrderNo',
        width: '110'
      }, {
        name: 'POS交易号',
        value: 'yumTransNo',
        width: '100'
      }, {
        name: '是否线上',
        value: 'ifOnline'
      }, {
        name: '网上支付号',
        value: 'olPayNo',
        width: '100'
      }, {
        name: '营业日期',
        value: 'operationDate'
      }, {
        name: '交易日期',
        value: 'settleTransTime'
      }, {
        name: '消费金额',
        value: 'transAmount',
        classname: 'sumClass'
      }, {
        name: '是否虚拟卡',
        value: 'ifVCard',
        width: '100'
      }, {
        name: '卡供应商',
        value: 'platformCode'
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
      }, {
        name: '售卡机构',
        value: 'shoukajigou'
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
      },{
          name: '是否撤销核销',
          value: 'flag',
          classname: 'sumClass'
      }
      ],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      loadingStoreName: false,
      // consumeSearchData: {},
      selectIndex:1,
      StoreNameSize:10,
    }
  },
  components: {
    reportTableCom
  },
  directives: { scroll },
  methods: {
  	remoteStoreName(val){
      let that = this
      this.loadingStoreName = true
      api.getSelectSearchCondition({pageIndex:this.selectIndex,pageSize:this.StoreNameSize,storeName: val},res => {
      	this.loadingStoreName = false
        if (res.code === 200) {
          that.storeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        } else {
          that.storeSelect = []
        }
      })
    },
    scrollStoreName(param){
      let that = this
      if(param){
        this.StoreNameSize += 10
        let currentValue = this.$refs.storeName.$children[0].currentValue === '请选择' ? '' : this.$refs.storeName.$children[0].currentValue
        api.getSelectSearchCondition({pageIndex: this.selectIndex,pageSize: this.StoreNameSize,storeName: currentValue},res => {that.storeSelect = res.data})
      }
    },
    typeChange (val) {
      this.productCodeSelect = this.cardCode[val]
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getConsumeSearch()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getConsumeSearch()
    },
    searchList () {
      // this.consumeSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getConsumeSearch()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      let that = this
      api.exportConsumeSearch(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '卡核销查询报表.xlsx'
          link.target = '_blank';link.click()
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
    getStoreName () {
      let that = this
      api.getSelectSearchCondition({pageIndex:1,pageSize:10}, function(res){
        if (res.code === 200) {
          that.storeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getConsumeSearch () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'cardNo',
        value: this.searchData.cardNo
      }, {
      	name: 'productCode',
        value: this.searchData.productCode
      }, {
      	name: 'initBalance',
        value: this.searchData.initBalance
      }, {
      	name: 'platformCode',
        value: this.searchData.platformCode
      }, {
      	name: 'ifVCard',
        value: this.searchData.ifVCard
      }, {
      	name: 'ifOnline',
        value: this.searchData.ifOnline
      }, {
      	name: 'resCode',
        value: this.searchData.resCode
      }, {
      	name: 'resBrand',
        value: this.searchData.resBrand
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
      	name: 'startSettleTransTime',
        value: this.searchData.startSettleTransTime
      }, {
      	name: 'endSettleTransTime',
        value: this.searchData.endSettleTransTime
      }, {
      	name: 'startOperationDate',
        value: this.searchData.startOperationDate
      }, {
      	name: 'endOperationDate',
        value: this.searchData.endOperationDate
      }, {
      	name: 'productType',
        value: this.searchData.productType
      },{
          name:'ifConsume',
          value:this.searchData.ifConsume
      }
      ]
      api.getConsumeSearch(this.common.joinSearchParam(pathParams), function(res){
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
    this.getCardCode()
    this.getBrandEnglishNames()
    this.getAllCompany()
    this.getAllOperateMarket()
    this.getAllFinanceMarket()
    this.getStoreName()
  }
}
</script>

<style>
</style>
