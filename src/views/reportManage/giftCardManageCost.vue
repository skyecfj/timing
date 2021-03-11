<template>
  <div class="mainContent" style="height: 100%;">
    <div class="searchContent" v-if="activeName === 'cardDetail'">
      <div class="selectContent">
        <div class="selectTitle">日期</div>
        <el-date-picker v-model="searchData.startOperaTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOperaStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endOperaTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOperaEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡号</div>
        <el-input size="small" v-model.trim="searchData.transNo"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">发卡平台</div>
          <el-select size="small"  v-model="searchData.platformCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in platformCodeSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
      </div>
      <!--<div class="selectContent">-->
        <!--<div class="selectTitle">售卖渠道</div>-->
          <!--<el-select size="small"  v-model="searchData.subSalesChannel" filterable>-->
          	<!--<el-option value="" label="请选择"></el-option>-->
            <!--<el-option v-for="(item, index) in channelSelect" :key="index" :label="item" :value="item">-->
            <!--</el-option>-->
          <!--</el-select>-->
      <!--</div>-->
      <br>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent " style="height:100%;">
      <div class="tab-content" :class="{'defaultTab': activeName == 'cardDetail'}">
        <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey">
        </report-table-com>
        <!--<el-tabs class="card-manage" v-model="activeName" @tab-click="handleSwitch">-->
          <!--<el-tab-pane label="卡明细" name="cardDetail">-->
            <!--<report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey">-->
            <!--</report-table-com>-->
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="月度汇总" name="monthSummary" class="ebiTab">-->
            <!--<iframe src="/Viewer/Router.aspx?key=lTo97vSGA/N6nM1ZK2NKhZXGzefh2e1dV6LcXFOLHYrJCTl2BY03q0q93WLIDqlUAJzc7bCYThcGsQp4TzqFPd8Hk57PKErmP8ZBlTe6ubNqZfrEgk1XrPxZpFTfGmgYdY9enMQYTMqedE8TeHHCSpye8PxR/KdNOcJhIf/zNPNjcd5V2U+kJSCvU29n4L9YMH+gwyixGrg0g0JhvWswktvcSaUybdY7hT7xOJ4ZmMCpNLwaga4X/L/m70WSg0sz&Source=Normal">-->
            <!--</iframe>-->
          <!--</el-tab-pane>-->
        <!--</el-tabs>-->
      </div>
      <div class="pagination" v-if="activeName === 'cardDetail'">
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
  name: 'giftCardManageCost',
  data () {
    return {
      pickerOperaStart: {
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
      pickerOperaEnd: {
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
        // subSalesChannel: ''
      },
      channelSelect: [],
      platformCodeSelect: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
      activeName: 'cardDetail',
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
        name: '扣费原因',
        value: 'reason'
      }, {
        name: '备注',
        value: 'notes'
      }, ],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // cardSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      this.getCardRechargeDetail()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCardRechargeDetail()
    },
    searchList () {
      // this.cardSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getCardRechargeDetail()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      let that = this
      api.exportCardRechargeDetail(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '礼品卡管理费报表-卡明细.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    handleSwitch () {

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
    getCardRechargeDetail () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'startOperaTime',
        value: this.searchData.startOperaTime
      }, {
      	name: 'endOperaTime',
        value: this.searchData.endOperaTime
      }, {
      	name: 'transNo',
        value: this.searchData.transNo
      }, {
      	name: 'platformCode',
        value: this.searchData.platformCode
      }
      // , {
      // 	name: 'subSalesChannel',
      //   value: this.searchData.subSalesChannel
      // }
      ]
      api.getCardRechargeDetail(this.common.joinSearchParam(pathParams), function(res){
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
.card-manage .el-tabs__content {
  height: calc(100% - 55px);
}
.card-manage .el-tabs__content .el-tab-pane {
  height: 100%;
}
</style>

<style lang="scss" scoped>
.tab-content {
  height: 90%;
  .el-tabs {
    height: 100%;
  }
}
.defaultTab.tab-content {
  height: auto;
}
</style>
