<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">月份</div>
        <el-date-picker
          v-model="searchData.month"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月份">
        </el-date-picker>
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
  name: 'giftCardShare',
  data () {
    return {
      searchData: {
        month: ''
      },
      simpleTableData: [],
      simpleTableKey: [{
        name: 'BU',
        value: 'subject'
      }, {
        name: 'Object acc',
        value: 'name'
      }, {
        name: '金额',
        value: 'amount',
        classname: 'sumClass'
      }, {
        name: '子账类型',
        value: 'sublegerType'
      }, {
        name: '子账',
        value: 'subleger',
        classname: 'sumClass'
      }, {
        name: '说明',
        value: 'sublegerDesc'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // shareSearchData: {},
      searchDate: ''
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getDiscountDivide()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getDiscountDivide()
    },
    searchList () {
      if (this.searchData.month) {
        this.searchDate = this.searchData.month + '-01'
      } else {
        this.searchDate = this.searchData.month
      }
      // this.shareSearchData = { month: this.searchDate }
      this.getDiscountDivide()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      let that = this;
      if (this.searchData.month) {
          this.searchDate = this.searchData.month + '-01'
      } else {
          this.searchDate = this.searchData.month
      }
      api.exportDiscountDivide({ month: this.searchDate }, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '礼品卡折扣及手续费分摊报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getDiscountDivide () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'month',
        value: this.searchDate
      }]
      api.getDiscountDivide(this.common.joinSearchParam(pathParams),function(res){
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
  }
}
</script>

<style>
</style>
