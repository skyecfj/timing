<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">日期</div>
        <el-date-picker v-model="searchData.startOperaTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endOperaTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">销卡订单号</div>
          <el-input size="small" v-model="searchData.transNo"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">发卡平台</div>
        <el-select size="small"  v-model="searchData.platformCode">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in platformCodeSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">售卖渠道</div>
        <el-select size="small"  v-model="searchData.subSalesChannel" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="(item, index) in channelSelect" :key="index" :label="item" :value="item">
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
  name: 'backCardDetail',
  data () {
    return {
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.endOperaTime) {
          	let curDate = (new Date(this.searchData.endOperaTime)).getTime()
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
          if (this.searchData.startOperaTime) {
          	let curDate = (new Date(this.searchData.startOperaTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      searchData: {
        startOperaTime: '',
        endOperaTime: '',
        transNo: '',
        platformCode: '',
        subSalesChannel: '',
      },
      platformCodeSelect: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
      channelSelect: [],
      simpleTableData: [],
      simpleTableKey: [{
        name: '日期',
        value: 'operaTime'
      }, {
        name: '卡号',
        value: 'cardNo'
      }, {
        name: '卡片面值',
        value: 'transAmount',
        classname: 'sumClass'
      }, {
        name: '卡片净值',
        value: 'transNetAmount',
        classname: 'sumClass'
      }, {
        name: '卡种类',
        value: 'productTypeName'
      }, {
        name: '售卖渠道',
        value: 'subSalesChannel'
      }, {
        name: '售卡订单号',
        value: 'transNo'
      },
      {
          name: '餐厅号',
          value: 'resCode'
       },
        {
        name: '备注',
        value: 'notes'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // backCardSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getBackCardDetail()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getBackCardDetail()
    },
    searchList () {
      // this.backCardSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getBackCardDetail()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      let that = this
      api.exportBackCardDetail(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '退卡明细查询报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getSubSaleChannel () {
      let that = this
      api.getSubSaleChannel(function(res){
        if (res.code === 200) {
          that.channelSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getBackCardDetail () {
      let that = this
    	let param = [
      {
        name:'pageIndex',
        value: this.currentPage
      }, {
        name:'pageSize',
        value:this.pageSize
      }, {
  	    name:'startOperaTime',
        value:this.searchData.startOperaTime
      }, {
        name:'endOperaTime',
        value:this.searchData.endOperaTime
      }, {
      	name:'transNo',
        value:this.searchData.transNo
      }, {
      	name:'platformCode',
        value:this.searchData.platformCode
      }, {
      	name:'subSalesChannel',
        value:this.searchData.subSalesChannel
      }]
      api.getBackCardDetail(this.common.joinSearchParam(param),function(res){
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
    this.getSubSaleChannel()
  }
}
</script>

<style>
</style>
