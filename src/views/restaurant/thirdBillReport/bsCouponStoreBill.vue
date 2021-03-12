<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">交易日期</div>
        <el-date-picker v-model="tradeStartTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="tradeEndTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">财务市场</div>
        <el-select size="small" v-model="resFinMarket" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in resFinMarketOptions" :key="item.marketCode" :label="item.marketName" :value="item.marketCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
        <el-select size="small" v-model="brandName" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in brandOptions" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandEnglishName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人公司归集</div>
        <el-select size="small" v-model="storeType">
          <el-option value="ALL" label="请选择"></el-option>
          <el-option v-for="item in storeTypeOptions" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人公司</div>
        <el-select size="small" v-model="resEntity" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in resEntityOptions" :key="item.companyCode" :label="item.companyName" :value="item.companyCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">开票单位</div>
        <el-select size="small" v-model="issuingUnit" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in issuingUnitOptions" :key="item.billingUnitCode" :label="item.billingUnitName" :value="item.billingUnitCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">餐厅</div>
        <el-input size="small" v-model.trim="storeName" placeholder="请输入" clearable></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">营运市场</div>
        <el-select size="small" v-model="resOprMarket" placeholder="请选择营运市场">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in resOprMarketOptions" :key="item.marketCode" :label="item.marketName" :value="item.marketCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券码名称</div>
        <el-input size="small" v-model.trim="activity" placeholder="请输入"></el-input>
      </div>
      <el-button size="small" @click="search" class="c-button c-button--primary">查询</el-button>
      <el-button size="small" @click="resetSerchParam" class="c-button c-button--plain">重置</el-button>
      <el-button size="small" class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <el-table :data="tableData" border>
        <el-table-column prop="storeId" label="消费餐厅CODE" width="110"></el-table-column>
        <el-table-column prop="resName" label="消费餐厅名称" width="95"></el-table-column>
        <el-table-column prop="brandName" label="品牌" width=""></el-table-column>
        <el-table-column prop="resEntityName" label="法人公司"  width=""></el-table-column>
        <el-table-column prop="issuingUnitName" label="开票单位" width=""></el-table-column>
        <el-table-column prop="resOprMarket" label="营运市场" width=""></el-table-column>
        <el-table-column prop="resFinMarket" label="财务市场"></el-table-column>
        <el-table-column prop="activity" label="券码名称" width=""> </el-table-column>
        <el-table-column prop="count" label="笔数" width=""></el-table-column>
        <el-table-column prop="faceAmount" label="券面额" width=""></el-table-column>
        <el-table-column prop="sales" label="券净额" width=""></el-table-column>
        <el-table-column prop="invoiceAmount" label="与第三方结算价格" width="120"></el-table-column>
        <el-table-column prop="invoiceAmountA" label="消费者支付价格" width="110"></el-table-column>
        <el-table-column prop="invoiceAmountB" label="第三方补贴价格" width="110"></el-table-column>
        <el-table-column prop="usedTime" label="交易日期" width="140"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizeList" :total="totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import apidr from '@/model/apidr'

export default {
  name: '',
  data () {
    return {
      pickerStart: {
        disabledDate: (time) => {
          if (this.tradeEndTime) {
          	let curDate = (new Date(this.tradeEndTime)).getTime()
            let one = 60 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerEnd: {
        disabledDate: (time) => {
          if (this.tradeStartTime) {
          	let curDate = (new Date(this.tradeStartTime)).getTime()
            let one = 60 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      tradeStartTime: '',
      tradeEndTime: '',
      thirdParty: '',
      resFinMarket: '',
      brandName: '',
      storeType: 'ALL',
      resEntity: '',
      issuingUnit: '',
      storeName: '',
      resOprMarket: '',
      activity: '',
      activityGroup: '',
      thirdPartyOptions: [],
      resFinMarketOptions: [],
      brandOptions: [],
      storeTypeOptions: [{
        value: '!FR',
        name: '直营'
      }, {
        value: 'FR',
        name: '加盟商'
      }],
      resEntityOptions: [],
      issuingUnitOptions: [],
      resOprMarketOptions: [],
      pageSizeList: [25, 50, 75, 100, 125],
      totalRecords: 0,
      currentPage: 1,
      pageSize: 25,
      tableData: [],
      storeBillSearchData: {}
    }
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      this.getStoreCouponReport()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getStoreCouponReport()
    },
    search () {
      if (this.tradeStartTime && this.tradeEndTime) {
        this.storeBillSearchData = {
          tradeStartTime: this.tradeStartTime,
          tradeEndTime: this.tradeEndTime,
          brandName: this.brandName,
          storeName: this.storeName,
          resEntity: this.resEntity,
          issuingUnit: this.resFinMarket,
          resFinMarket: this.transType,
          storeType: this.storeType,
          resOprMarket: this.resOprMarket,
          activity: this.activity,
          activityGroup: this.activityGroup,
        }
        this.currentPage = 1
        this.pageSize = 10
        this.getStoreCouponReport()
      } else {
        this.showTips('请选择交易日期进行查询','warning')
      }
    },
    resetSerchParam () {
      this.tradeStartTime = ''
      this.tradeEndTime = ''
      this.thirdParty = ''
      this.resFinMarket = ''
      this.brandName = ''
      this.storeType = ''
      this.resEntity = ''
      this.issuingUnit = ''
      this.storeName = ''
      this.resOprMarket = ''
      this.activity = ''
      this.activityGroup = ''
    },
    exportReport () {
      let that = this
      apidr.exportStoreCouponDetail(this.storeBillSearchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '百胜电子券码-餐厅报告.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getBrandSelect () {
      let that = this
      apidr.getBrandSelect('',function(res){
        if (res.code === 200) {
          that.brandOptions = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCompany () {
      let that = this
      apidr.getCompany(function(res){
        if (res.code === 200) {
          that.resEntityOptions = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getBillingUnit () {
      let that = this
      apidr.getBillingUnit(function(res){
        if (res.code === 200) {
          that.issuingUnitOptions = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getBusinessMarket () {
      let that = this
      apidr.getBusinessMarket(function(res){
        if (res.code === 200) {
          that.resOprMarketOptions = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getFinanceMarket () {
      let that = this
      apidr.getFinanceMarket(function(res){
        if (res.code === 200) {
          that.resFinMarketOptions = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getStoreCouponReport () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'tradeStartTime',
        value: this.tradeStartTime
      }, {
      	name: 'tradeEndTime',
        value: this.tradeEndTime
      }, {
      	name: 'couponCode',
        value: this.couponCode
      }, {
      	name: 'couponType',
        value: this.couponType
      }, {
      	name: 'brandName',
        value: this.brandName
      }, {
        name: 'storeName',
        value: this.storeName
      }, {
        name: 'resOprMarket',
        value: this.resOprMarket
      }, {
      	name: 'resFinMarket',
        value: this.resFinMarket
      }, {
      	name: 'resEntity',
        value: this.resEntity
      }, {
        name: 'issuingUnit',
        value: this.issuingUnit
      }, {
        name: 'activity',
        value: this.activity
      }, {
        name: 'activityGroup',
        value: this.activityGroup
      }, {
        name: 'storeType',
        value: this.storeType
      }]
      apidr.getStoreCouponReport(this.common.joinSearchParam(pathParams), function(res){
      	that.tableData = []
      	that.totalRecords = 0
        if (res.code === 200) {
          that.tableData = res.data.list
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
  	this.getBrandSelect()
    this.getCompany()
    this.getBillingUnit()
    this.getBusinessMarket()
    this.getFinanceMarket()
  },
}
</script>

<style>
</style>
