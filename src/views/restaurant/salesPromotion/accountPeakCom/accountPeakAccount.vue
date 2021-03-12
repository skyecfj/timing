<template>
  <div class="coupon-account">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">交易日期</div>
        <el-date-picker v-model="startDate" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="endDate"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
          <el-select size="small"  v-model="brandName">
            <el-option v-for="item in brandNameSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动类型</div>
          <el-select size="small"  v-model="activeType">
            <el-option v-for="item in activeTypeSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">第三方</div>
          <el-select size="small"  v-model="thirdParty">
            <el-option v-for="item in thirdSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动名称</div>
          <el-select size="small"  v-model="activeName">
            <el-option v-for="item in activeNameSelect" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
      </div>

      <el-button size="small" type="success"  @click="searchData">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small"  class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent" >
      <el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%" border>
      	<el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="activeType" label="活动类型" align="center"></el-table-column>
        <el-table-column prop="activeName" label="活动名称" align="center"></el-table-column>
        <el-table-column prop="thirdParty" label="第三方" align="center"></el-table-column>
        <el-table-column prop="activeDate" label="活动日期" align="center"></el-table-column>
        <el-table-column prop="Dailymoney" label="日结算金额（餐厅应收金额）" align="center"></el-table-column>
      </el-table>
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
export default {
  name: 'accountPeak',
  data () {
    return {
      startDate: '',
      endDate: '',
      brandName: 1,
      brandNameSelect: [{
        id: 1,
        name: '品牌1'
      }, {
        id: 2,
        name: '品牌2'
      }],
      activeType: 1,
      activeTypeSelect: [{
        id: 1,
        name: '活动1'
      }, {
        id: 2,
        name: '活动2'
      }, {
        id: 3,
        name: '活动3'
      }],
      thirdParty: 1,
      thirdSelect: [{
        id: 1,
        name: '全部'
      }, {
        id: 2,
        name: '支付宝'
      }, {
        id: 3,
        name: '威能'
      }, {
        id: 4,
        name: '微信'
      }],
      activeName: 1,
      activeNameSelect: [{
        id: 1,
        name: '全部'
      }, {
        id: 2,
        name: '活动1'
      }, {
        id: 3,
        name: '活动2'
      }, {
        id: 4,
        name: '活动3'
      }],
      tableData: [{
        id: 1,
        brandName: '活动1',
        activeType: 'KFC1',
        activeName: '活动类型1',
        thirdParty: '第三方1',
        activeDate: '活动1',
        Dailymoney: '订单数量1'
      }, {
        id: 2,
        brandName: '活动2',
        activeType: 'KFC2',
        activeName: '活动类型2',
        thirdParty: '第三方2',
        activeDate: '活动2',
        Dailymoney: '订单数量2'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0
    }
  },
  methods: {
    searchData () {

    },
    reset () {

    },
    getReportDayObj () {

    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    downloadList () {

    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    exportReport () {

    }
  },
  filters: {
    checkStats (val) {
      return val == 1 ? '已确认结算' : '未确认结算'
    }
  }
}
</script>

<style>
</style>
