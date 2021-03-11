<template>
  <div class="mainContent">
    <div class="dataContent" >
      <el-table :data="tableData" style="width: 100%" border>
      	<el-table-column prop="companyCodeAndBillingUnitCode" width="150px">
          <template slot="header" slot-scope="scope">
            <span v-if="$route.query.statisticTypeName == '法人公司'">法人公司编号</span>
            <span v-else-if="$route.query.statisticTypeName == '开票单位'">开票单位编号</span>
            <span v-else>法人公司/开票单位编号</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyNameAndBillingUnitName" width="130px">
          <template slot="header" slot-scope="scope">
            <span v-if="$route.query.statisticTypeName == '法人公司'">法人公司名称</span>
            <span v-else-if="$route.query.statisticTypeName == '开票单位'">开票单位名称</span>
            <span v-else>法人公司/开票单位</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityType" label="活动类型" ></el-table-column>
        <el-table-column prop="thirdName" label="第三方" min-width="85px" ></el-table-column>
        <el-table-column prop="activityName" label="活动名称" ></el-table-column>
        <!-- <el-table-column prop="orderAmount" label="订单金额" ></el-table-column> -->
        <el-table-column prop="bsSubsidy" label="百胜折扣" ></el-table-column>
        <el-table-column prop="tradeAmount" label="交易金额" ></el-table-column>
        <el-table-column prop="acturalAmount" label="顾客实付" ></el-table-column>
        <el-table-column prop="thirdSubsidy" label="第三方补贴" min-width="85px"></el-table-column>
        <el-table-column prop="handingCharge" label="手续费" ></el-table-column>
        <el-table-column prop="serviceCharge" label="服务费"></el-table-column>
        <el-table-column prop="bsShippingFee" label="百胜配送费" width="120px"></el-table-column>
        <el-table-column prop="thirdShippingFee" label="第三方配送费" width="120px"></el-table-column>
        <el-table-column prop="tradeCount" label="交易笔数" ></el-table-column>
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
import apidr from '@/model/apidr'

export default {
  name: 'activeSaleDetail',
  activated(){
    this.pageInfo = sessionStorage.getItem('pageInfo');
    if(this.lastPageInfo !== this.pageInfo && !this.common.isNullString(this.lastPageInfo)){
      JSON.parse(this.pageInfo)
      this.getSaleList()
    }
  },
  deactivated(){
    this.lastPageInfo = this.pageInfo;
  },
  beforeMount () {
  	this.getSaleList()
  },
  data () {
    return {
      pageInfo: '',
      lastPageInfo: '',
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0
    }
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      this.getSaleList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSaleList()
    },
    getSaleList () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'id',
        value: this.$route.query.id
      }]
      apidr.getSaleListDetail(this.common.joinSearchParam(pathParams), function(res){
      	that.tableData = []
      	that.totalRecords = 0
        if (res.code === 200) {
        	that.disabled = false
          that.tableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    }
  }
}
</script>

<style>
</style>
