<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">售卖月份</div>
        <el-date-picker v-model="searchData.summaryDate" type="month"
          value-format="yyyy-MM" placeholder="选择月份"></el-date-picker>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">券活动组</div>
        <el-select size="small"  v-model="searchData.activityGroup" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="(item, index) in activityGroupSelect" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">品牌</div>
        <el-select size="small"  v-model="searchData.brand">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in resBrandSelect" :key="item.id" :label="item.englishName" :value="item.englishName">
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
  name: 'vdmMonActivitySales',
  data () {
    return {
      searchData: {
        summaryDate: '',
        activityGroup: '',
        brand: ''
      },
      activityGroupSelect: [],
      resBrandSelect: [],
      simpleTableData: [],
      simpleTableKey: [{
        name: '售卖月份',
        value: 'summaryDate',
        width: '100'
      }, {
        name: '品牌',
        value: 'brand'
      }, {
        name: '券类型',
        value: 'couponType'
      }, {
        name: '金额类型',
        value: 'amountType'
      },  {
        name: '发放形式',
        value: 'placeStyle'
      }, {
        name: '发放渠道',
        value: 'placeChannelName'
      }, {
        name: '券ID',
        value: 'activityId'
      }, {
        name: '券名称',
        value: 'activity'
      }, {
        name: '金额',
        value: 'amount',
        width: '150',
        classname: 'sumClass'
      }, {
        name: '券数量',
        value: 'couponCount'
      }, {
        name: '交易类型',
        value: 'transType',
        width: '100'
      }, {
        name: '结算平台',
        value: 'payMode'
      }, {
        name: '更新日期',
        value: 'operationDate',
        width: '100'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // salesSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getVdmMonSales()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getVdmMonSales()
    },
    searchList () {
      // this.salesSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getVdmMonSales()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    getVdmMonSales () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'summaryDate',
        value: this.searchData.summaryDate
      }, {
      	name: 'activityGroup',
        value: this.searchData.activityGroup
      }, {
      	name: 'brand',
        value: this.searchData.brand
      }]
      api.getVdmMonSales(this.common.joinSearchParam(pathParams),function(res){
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
    exportFile () {
      let that = this
      api.exportVdmMonSales(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '券当月售卖明细券码查询按券活动组报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getActivityGroup () {
      let that = this
      api.getActivityGroup(function(res){
        if (res.code === 200) {
          that.activityGroupSelect = res.data
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
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.getActivityGroup()
    this.getBrandEnglishNames()
  }
}
</script>

<style>
</style>
