<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">理论营业日期</div>
        <el-date-picker v-model="operationStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOpeStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="operationEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOpeEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">交易日期</div>
        <el-date-picker v-model="transStartTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="transEndTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
        <el-select size="small" v-model="brandName" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in  brandOptions" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandEnglishName">
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
        <el-input size="small" v-model.trim="storeName" placeholder="请输入"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">业务类型</div>
        <el-select size="small" v-model="transType">
        	<el-option value="" label="请选择"></el-option>
          <el-option v-for="item in transTypeOptions" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券名称</div>
        <el-input size="small" v-model.trim="discountCouponDes" placeholder="请输入"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡名称</div>
        <el-input size="small" v-model.trim="discountCardDes" placeholder="请输入"></el-input>
      </div>
      <el-button size="small" @click="search" class="c-button c-button--primary">查询</el-button>
      <el-button size="small" @click="resetSerchParam" class="c-button c-button--plain">重置</el-button>
      <el-button size="small" class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column  prop="businessOrderNo" label="商户号" width="140"></el-table-column>
        <el-table-column  prop="lineType" label="交易渠道" width="90"></el-table-column>
        <el-table-column  prop="resCode" label="消费餐厅CODE" width="110"></el-table-column>
        <el-table-column  prop="resName" label="消费餐厅简称" width="95"></el-table-column>
        <el-table-column  prop="resBrand" label="品牌" width="70"></el-table-column>
        <el-table-column  prop="resEntity" label="法人公司CODE" width="110"></el-table-column>
        <el-table-column  prop="issuingName" label="开票单位" width="130"></el-table-column>
        <el-table-column  prop="resOprMarketName" label="营运市场" width="110"></el-table-column>
        <el-table-column  prop="resFinMarketName" label="财务市场" width="110"></el-table-column>
        <el-table-column  prop="posNo" label="终端号" width="270"></el-table-column>
        <el-table-column  prop="cashier" label="收银员" width="60"></el-table-column>
        <el-table-column  prop="transTime" label="消费日期（交易日期)" width="140"></el-table-column>
        <el-table-column  prop="theoryOperationDate" label="理论营业日期" width="100"></el-table-column>
        <el-table-column  prop="operationDate" label="百胜营业日期" width="100"></el-table-column>
        <el-table-column  prop="transNo" label="百胜交易号" width="100"></el-table-column>
        <el-table-column  prop="alipayTransNo" label="支付宝交易号" width="230"></el-table-column>
        <el-table-column  prop="alipayAccount" label="客户Alipay账户" width="140"></el-table-column>
        <el-table-column  prop="orderAmount" label="订单金额"></el-table-column>
        <el-table-column  prop="discountCardDes" label="卡名称"></el-table-column>
        <el-table-column  prop="discountCardPartner" label="卡合作方"></el-table-column>
        <el-table-column  prop="discountCardAmount" label="卡优惠金额" width="100"></el-table-column>
        <el-table-column  prop="discountCouponDes" label="劵名称"></el-table-column>
        <el-table-column  prop="discountCouponPartner" label="劵合作方"></el-table-column>
        <el-table-column  prop="discountCouponAmount" label="劵优惠金额" width="100"></el-table-column>
        <el-table-column  prop="discountRedDes" label="红包名称"></el-table-column>
        <el-table-column  prop="discountRedAmount" label="红包优惠金额" width="100"></el-table-column>
        <el-table-column  prop="discountAmount" label="总优惠金额" width="100"></el-table-column>
        <el-table-column  prop="transAmount" label="实际交易金额" width="100"></el-table-column>
        <el-table-column  prop="transFee" label="手续费"></el-table-column>
        <el-table-column  prop="transAr" label="商户应收（清算金额）" width="150"></el-table-column>
        <el-table-column  prop="transType" label="业务类型"></el-table-column>
        <el-table-column  prop="setPointsPo" label="集分宝抵扣" width="100"></el-table-column>
        <el-table-column  prop="underwriteMark" label="包销标识"></el-table-column>
        <el-table-column  prop="underwriteAmount" label="包销点数"></el-table-column>
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
  name: 'AlipayBill',
  data () {
    return {
      pickerStart: {
        disabledDate: (time) => {
          if (this.transEndTime) {
          	let curDate = (new Date(this.transEndTime)).getTime()
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
          if (this.transStartTime) {
          	let curDate = (new Date(this.transStartTime)).getTime()
            let one = 60 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      pickerOpeStart: {
        disabledDate: (time) => {
          if (this.operationEndDate) {
          	let curDate = (new Date(this.operationEndDate)).getTime()
            let one = 60 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerOpeEnd: {
        disabledDate: (time) => {
          if (this.operationStartDate) {
          	let curDate = (new Date(this.operationStartDate)).getTime()
            let one = 60 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      operationStartDate: '',
      operationEndDate: '',
      transStartTime: '',
      transEndTime: '',
      brandName: '',
      resEntity: '',
      issuingUnit: '',
      storeName: '',
      transType: '',
      discountCouponDes: '',
      discountCardDes: '',
      resEntityOptions: [],
      issuingUnitOptions: [],
      brandOptions: [],
      transTypeOptions: [{
        value: 2,
        name: '退款'
      }, {
        value: 1,
        name: '交易'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      totalRecords: 0,
      currentPage: 1,
      pageSize: 25,
      tableData: [],
      wechatSearchData: {}
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getAliPayReport()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getAliPayReport()
    },
    search () {
      if (this.transStartTime && this.transEndTime) {
        this.wechatSearchData = {
          operationStartDate: this.operationStartDate,
          operationEndDate: this.operationEndDate,
          transStartTime: this.transStartTime,
          transEndTime: this.transEndTime,
          brandName: this.brandName,
          storeName: this.storeName,
          resEntity: this.resEntity,
          issuingUnit: this.issuingUnit,
          transType: this.transType,
          discountCardDes: this.discountCardDes,
          discountCouponDes: this.discountCouponDes
        }
        this.currentPage = 1
        this.pageSize = 10
        this.getAliPayReport()
      } else {
        this.showTips('请选择交易日期进行查询','warning')
      }
    },
    resetSerchParam () {
      this.operationStartDate = ''
      this.operationEndDate = ''
      this.transStartTime = ''
      this.transEndTime = ''
      this.brandName = ''
      this.resEntity = ''
      this.issuingUnit = ''
      this.storeName = ''
      this.transType = ''
      this.discountCardDes = ''
      this.discountCouponDes = ''
    },
    exportReport () {
      let that = this
      apidr.exportAliPayDetail(this.wechatSearchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '支付宝账单报表.xlsx'
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
    getAliPayReport () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'operationStartDate',
        value: this.operationStartDate
      }, {
      	name: 'operationEndDate',
        value: this.operationEndDate
      }, {
      	name: 'transStartTime',
        value: this.transStartTime
      }, {
      	name: 'transEndTime',
        value: this.transEndTime
      }, {
      	name: 'brandName',
        value: this.brandName
      }, {
        name: 'storeName',
        value: this.storeName
      }, {
        name: 'resEntity',
        value: this.resEntity
      }, {
      	name: 'issuingUnit',
        value: this.issuingUnit
      }, {
      	name: 'transType',
        value: this.transType
      }, {
        name: 'discountCardDes',
        value: this.discountCardDes
      }, {
        name: 'discountCouponDes',
        value: this.discountCouponDes
      }]
      apidr.getAliPayReport(this.common.joinSearchParam(pathParams), function(res){
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
  }
}
</script>


<style lang="css" scoped>
.btn-group-right {
  text-align: right;
  margin-top: 20px;
}
@media only screen and (min-width: 1200px) and (max-width: 1400px) {
  .el-col-lg-10 {
    width: 50%;
  }
}
</style>
