<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">账单月份</div>
        <el-date-picker v-model="searchData.startMonth" type="month"
          value-format="yyyy-MM" placeholder="选择月份"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endMonth"  type="month"
          value-format="yyyy-MM" placeholder="选择月份"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人</div>
        <el-select size="small" v-model="searchData.legalPerson" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in legalPersonOptions" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">售卖渠道</div>
        <el-select size="small" v-model="searchData.channel" @change="channelChange" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in channelOptions" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
        <el-select size="small"  v-model="searchData.brand">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in brandSelect" :key="item.id" :label="item.englishName" :value="item.englishName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">账单类型</div>
        <el-select size="small"  v-model="searchData.billType">
          <el-option v-for="item in billTypeOptions" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
    </div>
  </div>
</template>

<script>
import reportTableCom from './reportTableCom.vue'
import api from '@/model/api'

export default {
  name: 'billDetail',
  data () {
    return {
      searchData: {
        startMonth: '',
        endMonth: '',
        legalPerson: '',
        channel: '',
        brand: '',
        billType: 1,
      },
      billTypeOptions: [{
        name: '微信账单',
        value: 1
      }, {
        name: '支付宝账单',
        value: 0
      }],
      legalPersonOptions: [{
        name: 'HEC',
        value: 'HEC'
      }, {
        name: 'CHC',
        value: 'CHC'
      }],
      channelOptions: [{
        name: '自有商城',
        value: '1'
      }, {
        name: '天猫商城',
        value: '2'
      }, {
        name: '微信社交商城',
        value: '3'
      }],
      brandSelect: [],
      simpleTableData: [],
      simpleTableKey: [{
        name: '账单月份',
        value: 'month'
      }, {
        name: '手续费',
        value: 'serviceFee',
        classname: 'sumClass'
      }, {
        name: '收入',
        value: 'transAmount',
        classname: 'sumClass'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      invoiceSearchData: {},
      model: [],
      // billData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    channelChange (val) {
      if (val == '1') {
        this.searchData.billType = 1
      	this.billTypeOptions = [{
          name: '微信账单',
          value: 1
        }, {
          name: '支付宝账单',
          value: 0
        }]
      } else if (val == '2') {
      	this.searchData.billType = 0
      	this.billTypeOptions = [{
          name: '支付宝账单',
          value: 0
        }]
      } else {
        this.searchData.billType = 1
      	this.billTypeOptions = [{
          name: '微信账单',
          value: 1
        }]
      }
    },
    searchList () {
      if (this.searchData.billType === 0) {
        if (!this.searchData.channel || this.searchData.channel == null) {
          this.showTips('请选择售卖渠道','warning')
          return
        }
        this.getPaymentModel()
        this.getAlipayBill()
        // this.billData = JSON.parse(JSON.stringify(this.searchData))
      } else{
      	this.simpleTableKey = [{
          name: '账单月份',
          value: 'month'
        }, {
          name: '手续费',
          value: 'serviceFee',
          classname: 'sumClass'
        }, {
          name: '收入',
          value: 'transAmount',
          classname: 'sumClass'
        }]
      	this.getWechatBill()
      	// this.billData = JSON.parse(JSON.stringify(this.searchData))
      }
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      let that = this
      if (this.searchData.billType == 0) {
        api.exportAlipayBill(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '账单明细汇总报表-支付宝账单.xlsx'
            link.target = '_blank';link.click()
          }
        })
      } else {
        api.exportWechatBill(this.searchData, 'application/vnd.ms-excel', function(res){
          if (res.code) {
            that.common.warningMessage(res.msg)
          } else {
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = '账单明细汇总报表-微信账单.xlsx'
            link.target = '_blank';link.click()
          }
        })
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
    getPaymentModel () {
      let that = this
      let pathParams = [{
        name: 'startMonth',
        value: this.searchData.startMonth
      }, {
        name: 'endMonth',
        value: this.searchData.endMonth
      }, {
        name: 'channel',
        value: this.searchData.channel
      }]
      api.getPaymentModel(this.common.joinSearchParam(pathParams), function(res){
        that.simpleTableKey = []
        if (res.code === 200) {
          that.model = res.data
          that.simpleTableKey = [{
            name: '月份',
            value: '月份'
          }]
          for (let i = 0; i < res.data.length; i++) {
          	let obj = {
          	  name: res.data[i],
              value: res.data[i]
          	}
          	that.simpleTableKey.push(obj)
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getAlipayBill () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'startMonth',
        value: this.searchData.startMonth
      }, {
        name: 'endMonth',
        value: this.searchData.endMonth
      }, {
      	name: 'legalPerson',
        value: this.searchData.legalPerson
      }, {
      	name: 'channel',
        value: this.searchData.channel
      }, {
      	name: 'brand',
        value: this.searchData.brand
      }, {
      	name: 'billType',
        value: this.searchData.billType
      }]
      api.getAlipayBill(this.common.joinSearchParam(pathParams),function(res){
        that.simpleTableData = []
        if (res.code === 200) {
          let resObj = res.data
          for (let key in resObj) {
            let tableData = {}
            for (let i = 0; i < that.model.length; i++) {
          	  for (var j = 0; j < resObj[key].length; j++) {
          	  	if (that.model[i] === resObj[key][j].paymentModel) {
          	  	  let transAmount = resObj[key][j].transAmount
          	  	  that.$set(tableData, that.model[i], transAmount)
          	  	  break;
          	  	} else {
          	  	  that.$set(tableData, that.model[i], '')
          	  	}
          	  }
            }
            that.$set(tableData, '月份', key)
            that.simpleTableData.push(tableData)
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getWechatBill () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'startMonth',
        value: this.searchData.startMonth
      }, {
        name: 'endMonth',
        value: this.searchData.endMonth
      }, {
      	name: 'legalPerson',
        value: this.searchData.legalPerson
      }, {
      	name: 'channel',
        value: this.searchData.channel
      }, {
      	name: 'brand',
        value: this.searchData.brand
      }, {
      	name: 'billType',
        value: this.searchData.billType
      }]
      this.simpleTableData = []
      api.getWechatBill(this.common.joinSearchParam(pathParams),function(res){
        if (res.code === 200) {
          that.simpleTableData = res.data
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
  }
}
</script>

<style>
</style>
