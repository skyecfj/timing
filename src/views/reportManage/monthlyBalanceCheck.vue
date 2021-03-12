<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">月份</div>
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
  name: 'monthlyBalanceCheck',
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
        name: '券ID',
        value: 'activityId'
      }, {
        name: '上月余额',
        value: 'initBalance',
        classname: 'sumClass'
      }, {
        name: '当月售卖余额',
        value: 'salesAmount',
        classname: 'sumClass'
      }, {
        name: '当月核销金额',
        value: 'usedAmount',
        classname: 'sumClass'
      }, {
        name: '当月余额',
        value: 'finalBalance',
        classname: 'sumClass'
      }, {
        name: '差异金额',
        value: 'diffAmount',
        classname: 'sumClass'
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
      this.getMonthlyBalance()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getMonthlyBalance()
    },
    searchList () {
      if (!this.searchData.summaryDate || this.searchData.summaryDate == null) {
        this.showTips('请选择月份','warning');
        return false;
      }
      // this.salesSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getMonthlyBalance()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    getMonthlyBalance () {
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
      api.getMonthlyBalance(this.common.joinSearchParam(pathParams),function(res){
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
      let that = this;
        if (!this.searchData.summaryDate || this.searchData.summaryDate == null) {
            this.showTips('请选择月份','warning');
            return false;
        }
      api.exportMonthlyBalance(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '券平衡报告按券名称报表.xlsx'
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
