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
        <el-input size="small"  v-model.trim="storeName" placeholder="请输入"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">营运市场</div>
        <el-select size="small" v-model="resOprMarket" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in resOprMarketOptions" :key="item.marketCode" :label="item.marketName" :value="item.marketCode">
          </el-option>
        </el-select>
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
        <div class="selectTitle">券码类型</div>
        <el-select size="small" v-model="couponType" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="(item, index) in couponTypeOptions" :key="index" :label="item.couponTypeName" :value="item.couponType">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券码名称</div>
        <el-input size="small"  v-model.trim="activity" placeholder="请输入"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券码</div>
        <el-input size="small"  v-model.trim="couponCode" placeholder="请输入"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券活动名称</div>
        <el-input size="small"  v-model.trim="activityGroup" placeholder="请输入"></el-input>
      </div>
      <el-button size="small" @click="search" class="c-button c-button--primary">查询</el-button>
      <el-button size="small" @click="resetSerchParam" class="c-button c-button--plain">重置</el-button>
      <el-button size="small" class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <el-table :data="tableData" border>
        <el-table-column prop="storeId" label="消费餐厅编码" width="100"></el-table-column>
        <el-table-column prop="resName" label="消费餐厅名称" width="100"></el-table-column>
        <el-table-column prop="couponCode" label="券码"></el-table-column>
        <el-table-column prop="useStatus" label="交易状态">
          <template slot-scope="scope">
            <span>{{ scope.row.useStatus | checkUseStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="activity" label="券码名称"></el-table-column>
        <el-table-column prop="activityId" label="活动ID"></el-table-column>
        <el-table-column prop="activityGroupName" label="活动名称"></el-table-column>
        <el-table-column prop="activityGroupRound" label="活动批次"></el-table-column>
        <el-table-column prop="merchantPostTransId" label="POS交易号" width="100"></el-table-column>
        <el-table-column prop="merchantPostId_" label="是否线上"></el-table-column>
        <el-table-column prop="orderId" label="订单号"></el-table-column>
        <el-table-column prop="businessDate" label="营业日期"></el-table-column>
        <el-table-column prop="usedTime" label="交易日期"></el-table-column>
        <el-table-column prop="faceAmount" label="券面额"></el-table-column>
        <el-table-column prop="sales" label="券净额"></el-table-column>
        <el-table-column prop="paymentNameA" label="消费者支付名称" width="110"></el-table-column>
        <el-table-column prop="invoiceAmountA" label="消费者支付价格" width="110"></el-table-column>
        <el-table-column prop="invoiceAmountB" label="第三方补贴价格" width="110"></el-table-column>
        <el-table-column prop="couponValue" label="积分兑换"></el-table-column>
        <el-table-column prop="poundage" label="手续费"></el-table-column>
        <el-table-column prop="activityGroup" label="售卖渠道"></el-table-column>
        <el-table-column prop="brandName" label="发券品牌"></el-table-column>
        <el-table-column prop="resOprMarket" label="营运市场"></el-table-column>
        <el-table-column prop="resFinMarket" label="财务市场"></el-table-column>
        <el-table-column prop="resCity" label="城市"></el-table-column>
        <el-table-column prop="resEntity" label="法人公司CODE" width="110"></el-table-column>
        <el-table-column prop="resEntityName" label="法人公司名称" width="110"></el-table-column>
        <el-table-column prop="issuingUnit" label="开票单位CODE" width="110"></el-table-column>
        <el-table-column prop="issuingUnitName" label="开票单位名称" width="110"></el-table-column>
        <el-table-column prop="issuerName" label="售券机构"></el-table-column>
        <el-table-column prop="couponType" label="券码类型"></el-table-column>
        <el-table-column prop="merchantPostId" label="收银机号"></el-table-column>
        <el-table-column prop="businessModel" label="业务模式"></el-table-column>
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
  name: 'BsCouponBill',
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
      storeType: 'ALL',
      brandName: '',
      companyType: '',
      resEntity: '',
      issuingUnit: '',
      storeName: '',
      resOprMarket: '',
      resFinMarket: '',
      couponType: '',
      activity: '',
      couponCode: '',
      activityGroup: '',
      brandOptions: [],
      storeTypeOptions: [{
        name: '直营',
        value: '!FR'
      }, {
        name: '加盟商',
        value: 'FR'
      }],
      resEntityOptions: [],
      issuingUnitOptions: [],
      storeOptions: [],
      resOprMarketOptions: [],
      resFinMarketOptions: [],
      couponTypeOptions: [],
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125], // 分页数据
      totalRecords: 0,
      currentPage: 1,
      pageSize: 25,
      couponBillSearchData: {}
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getCouponDetailReport()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCouponDetailReport()
    },
    search () {
      if (this.tradeStartTime && this.tradeEndTime) {
        this.couponBillSearchData = {
          tradeStartTime: this.tradeStartTime,
          tradeEndTime: this.tradeEndTime,
          brandName: this.brandName,
          storeType: this.storeType,
          resEntity: this.resEntity,
          issuingUnit: this.issuingUnit,
          storeName: this.storeName,
          resOprMarket: this.resOprMarket,
          resFinMarket: this.resFinMarket,
          couponType: this.couponType,
          activity: this.activity,
          couponCode: this.couponCode,
          activityGroup: this.activityGroup
        }
        this.currentPage = 1
        this.pageSize = 10
        this.getCouponDetailReport()
      } else {
        this.showTips('请选择交易日期进行查询','warning')
      }
    },
    resetSerchParam () {
      this.tradeStartTime = ''
      this.tradeEndTime = ''
      this.brandName = ''
      this.storeType = 'ALL'
      this.resEntity = ''
      this.issuingUnit = ''
      this.storeName = ''
      this.resOprMarket = ''
      this.resFinMarket = ''
      this.couponType = ''
      this.activity = ''
      this.couponCode = ''
      this.activityGroup = ''
    },
    exportReport () {
      let that = this
      apidr.exportCouponDetail(this.couponBillSearchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '百胜电子券码报告.xlsx'
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
    getStore () {
      let that = this
      apidr.getStore(function(res){
        if (res.code === 200) {
          that.storeOptions = res.data
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
    getCouponType () {
      let that = this
      apidr.getCouponType(function(res){
        if (res.code === 200) {
          that.couponTypeOptions = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCouponDetailReport () {
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
      apidr.getCouponDetailReport(this.common.joinSearchParam(pathParams), function(res){
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
  filters: {
  	checkUseStatus (val) {
  	  if (val === null) return ''
  	  return val == 0 ? '撤销核销' : val == 1 ? '核销' : '销毁'
  	}
  },
  beforeMount () {
  	this.getBrandSelect()
    this.getCompany()
    this.getBillingUnit()
    this.getBusinessMarket()
    this.getFinanceMarket()
    this.getCouponType()
  },
}
</script>


<style lang="scss" scoped>
</style>
