<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">截止月份</div>
        <el-date-picker v-model="searchData.dueEndMonth" type="month"
          value-format="yyyy-MM" placeholder="选择月份"></el-date-picker>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">券活动名称</div>
        <el-select size="small"  v-model="searchData.activityGroup" multiple filterable>
          <el-option v-for="(item, index) in activityGroupSelect" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">品牌</div>
        <el-select size="small"  v-model="searchData.brand">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in brandSelect" :key="item.id" :label="item.englishName" :value="item.englishName">
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
  name: 'vdmCouponAging',
  data () {
    return {
      searchData: {
        dueStartMonth: '',
        dueEndMonth: '',
        activityGroup: [],
        brand: ''
      },
      activityGroupSelect: [],
      brandSelect: [],
      simpleTableData: [],
      simpleTableKey: [{
        name: '到期日',
        value: 'validEndTime'
      }, {
        name: '售卖日期',
        value: 'placeTime'
      }, {
        name: '活动名',
        value: 'activityGroup'
      }, {
        name: '券名',
        value: 'activity'
      }, {
        name: 'Activity ID',
        value: 'activityId'
      }, {
        name: '品牌',
        value: 'brandName'
      }, {
        name: '过期金额',
        value: 'dueSales',
        classname: 'sumClass'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // agingSearchData: {}
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getVdmCouponAging()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getVdmCouponAging()
    },
    searchList () {
      // this.agingSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getVdmCouponAging()
    },
    reset () {
      this.searchData.dueEndMonth = '';
      this.searchData.activityGroup = [];
      this.searchData.brand = '';
    },
    getVdmCouponAging () {
      let that = this;
      api.getVdmCouponAging({
          pageIndex:this.currentPage,
          pageSize:this.pageSize,
          dueEndMonth:this.searchData.dueEndMonth,
          activityGroup:this.searchData.activityGroup,
          brand:this.searchData.brand
      },function(res){
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
      api.exportVdmCouponAging(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '电子券码账龄报表.xlsx'
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
          that.brandSelect = res.data
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
