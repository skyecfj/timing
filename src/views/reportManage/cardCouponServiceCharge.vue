<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">核销日期</div>
        <el-date-picker v-model="searchData.startUsedTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endUsedTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">开票单位</div>
        <el-select size="small"  v-model="searchData.issuingUnit" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in issuingUnitSelect" :key="item.billingUnitId" :label="item.billingUnitName" :value="item.jdeCode">
            <span>[{{ item.jdeCode }}]</span>
            <span>{{ item.billingUnitName }}</span>
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
        <div class="selectTitle">品牌</div>
        <el-select size="small"  v-model="searchData.resBrand" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in resBrandSelect" :key="item.id" :label="item.englishName" :value="item.englishName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人归集</div>
          <el-select size="small"  v-model="searchData.oprMode">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in oprModeSelect" :key="item.id" :label="item.name" :value="item.id">
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

export default {
  name: 'cardCouponServiceCharge',
  data () {
    return {
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.endUsedTime) {
          	let curDate = (new Date(this.searchData.endUsedTime)).getTime()
            let six = 30 * 24 * 3600 * 1000
            let sixMonths = curDate - six
            return time.getTime() < sixMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerEnd: {
        disabledDate: (time) => {
          if (this.searchData.startUsedTime) {
          	let curDate = (new Date(this.searchData.startUsedTime)).getTime()
            let six = 30 * 24 * 3600 * 1000
            let sixMonths = curDate + six
            return time.getTime() > sixMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      searchData: {
      	startUsedTime: '',
      	endUsedTime: '',
      	issuingUnit: '',
      	resEntity: '',
      	// resOprMarket: '',
      	oprMode: '',
      	resBrand: ''
      },
      issuingUnitSelect: [],
      resEntitySelect: [],
      resBrandSelect: [],
      oprModeSelect: [{
        id: 1,
        name: '加盟商'
      }, {
        id: 2,
        name: '市场公司'
      }],
      simpleTableData: [],
      simpleTableKey: [{
        name: '餐厅号',
        value: 'resCode'
      }, {
        name: '券核销金额（a）',
        value: 'salesMoney',
        width: '120',
        classname: 'sumClass'
      }, {
        name: '卡核销金额（b）',
        value: 'transAmount',
        width: '120',
        classname: 'sumClass'
      }, {
        name: '核销总额（c=a+b）',
        value: 'total',
        width: '150',
        classname: 'sumClass'
      }, {
        name: '品牌',
        value: 'resBrand'
      }, {
        name: 'FFS%（d）',
        value: 'ffs',
        width: '90',
        classname: 'sumClass'
      }, {
        name: 'FFS amount（e=c*d 含税）',
        value: 'ffsAmount',
        width: '190',
        classname: 'sumClass'
      }, {
        name: '税率（f）',
        value: 'taxRate',
        classname: 'sumClass'
      }, {
        name: 'FFS amount（g=e/(1+f) 不含税）',
        value: 'ffsAmountEx',
        width: '220',
        classname: 'sumClass'
      }, {
        name: '税额（g*f）',
        value: 'taxAmount',
        width: '100',
        classname: 'sumClass'
      }, {
        name: '法人',
        value: 'resEntity'
      }, {
        name: '是否加盟商',
        value: 'ifDSales',
        width: '90'
      }, {
        name: '开票单位',
        value: 'issuingUnitName'
      }, {
        name: '是否合资公司',
        value: 'ifJoin',
        width: '100'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // CardCouponSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getCardCouponCharge()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCardCouponCharge()
    },
    searchList () {
      // this.CardCouponSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getCardCouponCharge()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      let that = this
      api.exportCardCouponCharge(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '卡/券服务费计算报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getAllBillingUnit () {
      let that = this
      api.getAllBillingUnit(function(res){
        if (res.code === 200) {
          that.issuingUnitSelect = res.data
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
    getCardCouponCharge () {
      let that = this
    	let param = [
      {
        name:'pageIndex',
        value: this.currentPage
      }, {
        name:'pageSize',
        value:this.pageSize
      }, {
  	    name:'startUsedTime',
        value:this.searchData.startUsedTime
      }, {
        name:'endUsedTime',
        value:this.searchData.endUsedTime
      }, {
      	name:'issuingUnit',
        value:this.searchData.issuingUnit
      }, {
      	name:'resEntity',
        value:this.searchData.resEntity
      }, {
      	name:'resBrand',
        value:this.searchData.resBrand
      }, {
      	name:'oprMode',
        value:this.searchData.oprMode
      }]
      api.getCardCouponCharge(this.common.joinSearchParam(param),function(res){
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
  	this.getAllBillingUnit()
    this.getAllCompany()
    this.getBrandEnglishNames()
  }
}
</script>

<style>
</style>
