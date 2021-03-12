<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">营业日期</div>
        <el-date-picker v-model="operationStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOpeStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="operationEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOpeEnd"></el-date-picker>
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
        <div class="selectTitle">法人公司</div>
        <el-select size="small" v-model="resEntity" filterable>
        	<el-option value="" label="请选择"></el-option>
          <el-option v-for="item in resEntityOptions" :key="item.companyCode" :label="item.companyName" :value="item.companyCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">餐厅</div>
        <el-input size="small" v-model.trim="resName" placeholder="请输入"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
        <el-select size="small" v-model="resBrand" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in brandOptions" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandEnglishName">
          </el-option>
        </el-select>
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
        <div class="selectTitle">卡号</div>
        <el-input size="small" v-model.trim="cardNo" placeholder="请输入"></el-input>
      </div>
      <el-button size="small" @click="search" class="c-button c-button--primary">查询</el-button>
      <el-button size="small" @click="resetSerchParam" class="c-button c-button--plain">重置</el-button>
      <el-button size="small" class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column  prop="resCode" label="餐厅编号" width=""></el-table-column>
        <el-table-column  prop="resName" label="餐厅名称" width=""></el-table-column>
        <el-table-column  prop="operationDate" label="营业日期" width=""></el-table-column>
        <el-table-column  prop="resBrand" label="餐厅品牌" width=""></el-table-column>
        <el-table-column  prop="resEntity" label="餐厅法人公司" width="100"></el-table-column>
        <el-table-column  prop="resOprMarket" label="餐厅营运市场" width="100"></el-table-column>
        <el-table-column  prop="resFinMarket" label="餐厅财务市场" width="100"></el-table-column>
        <el-table-column  prop="yumPosNo" label="百胜收银机号" width="100"></el-table-column>
        <el-table-column  prop="yumTransNo" label="百胜交易流水号" width="110"></el-table-column>
        <el-table-column  prop="yumTransTime" label="百胜交易时间" width="100"></el-table-column>
        <el-table-column  prop="settleCode" label="受理机构（卡系统）" width="130"></el-table-column>
        <el-table-column  prop="settleOrderNo" label="卡系统订单号" width="100"></el-table-column>
        <el-table-column  prop="settleTransNo" label="卡系统交易流水号" width="120"></el-table-column>
        <el-table-column  prop="settleTransTime" label="卡系统交易时间" width="110"></el-table-column>
        <el-table-column  prop="cardNo" label="卡号" width=""></el-table-column>
        <el-table-column  prop="cardBin" label="卡BIN" width=""></el-table-column>
        <el-table-column  prop="productType" label="卡种类" width=""></el-table-column>
        <el-table-column  prop="productCode" label="卡产品"></el-table-column>
        <el-table-column  prop="initBalance" label="卡面额"></el-table-column>
        <el-table-column  prop="dueDate" label="卡有效期"></el-table-column>
        <el-table-column  prop="operator" label="收银员" width=""></el-table-column>
        <el-table-column  prop="ownType" label="直营/加盟"></el-table-column>
        <el-table-column  prop="settleOrderAmount" label="交易金额"></el-table-column>
        <el-table-column  prop="platformCode" label="卡平台编码" width="100"></el-table-column>
        <el-table-column  prop="resJdeCode" label="餐厅JDE编号" width="100"></el-table-column>
        <el-table-column  prop="cardDiscount" label="卡折扣" width=""></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizeList"
        :total="totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import apidr from '@/model/apidr'

export default {
  name: 'storeCardSell',
  data () {
    return {
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
      resFinMarket: '',
      resEntity: '',
      resName: '',
      operationStartDate: '',
      operationEndDate: '',
      resBrand: '',
      resOprMarket: '',
      cardNo: '',
      resFinMarketOptions: [],
      resEntityOptions: [],
      brandOptions: [],
      resOprMarketOptions: [],
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      totalRecords: 0,
      currentPage: 1,
      pageSize: 25,
      storeSellData: {}
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getStoreSales()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getStoreSales()
    },
    search () {
//    if (this.transStartTime && this.transEndTime) {
        this.storeSellData = {
          operationStartDate: this.operationStartDate,
          operationEndDate: this.operationEndDate,
          resFinMarket: this.resFinMarket,
          resName: this.resName,
          resEntity: this.resEntity,
          resBrand: this.resBrand,
          resOprMarket: this.resOprMarket,
          cardNo: this.cardNo
        }
        this.currentPage = 1
        this.pageSize = 10
        this.getStoreSales()
//    } else {
//      this.showTips('请选择交易日期进行查询','warning')
//    }
    },
    resetSerchParam () {
      this.resFinMarket = ''
      this.resEntity = ''
      this.resOprMarket = ''
      this.resName = ''
      this.resBrand = ''
      this.cardNo = ''
      this.operationStartDate = ''
      this.operationEndDate = ''
    },
    exportReport () {
      let that = this
      apidr.exportStoreSales(this.storeSellData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '餐厅百胜卡售卖报表.xlsx'
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
    getStoreSales () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'resFinMarket',
        value: this.resFinMarket
      }, {
      	name: 'resEntity',
        value: this.resEntity
      }, {
      	name: 'resOprMarket',
        value: this.resOprMarket
      }, {
      	name: 'resName',
        value: this.resName
      }, {
      	name: 'resBrand',
        value: this.resBrand
      }, {
        name: 'cardNo',
        value: this.cardNo
      }, {
        name: 'operationStartDate',
        value: this.operationStartDate
      }, {
      	name: 'operationEndDate',
        value: this.operationEndDate
      }]
      apidr.getStoreSales(this.common.joinSearchParam(pathParams), function(res){
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
    this.getBusinessMarket()
    this.getFinanceMarket()
  }
}
</script>

<style>
</style>
