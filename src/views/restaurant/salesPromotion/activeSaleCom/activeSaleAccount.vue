<template>
  <div class="coupon-account">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">报告期间</div>
        <el-date-picker
          v-model="reportDay"
          type="month"
          placeholder="请输入报告日期"
          @change="getReportDayObj"
          value-format="yyyyMM"
          format="yyyyMM">
        </el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人公司</div>
          <el-select size="small"  v-model="frCompany">
            <el-option v-for="item in frCompanySelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">开票单位</div>
          <el-select size="small"  v-model="kpGroup">
            <el-option v-for="item in kpGroupSelect" :key="item.id" :label="item.name" :value="item.id">
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
      <div class="selectContent">
        <div class="selectTitle">活动类型</div>
          <el-select size="small"  v-model="activeType">
            <el-option v-for="item in activeTypeSelect" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
      </div>

      <el-button size="small" type="success"  @click="searchData">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
    </div>
    <div class="dataContent" >
      <el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%" border>
      	<el-table-column prop="dwNum" label="法人公司/开票单位编号" align="center"></el-table-column>
        <el-table-column prop="brandType" label="法人公司/开票单位" align="center"></el-table-column>
        <el-table-column prop="activeType" label="活动类型" align="center"></el-table-column>
        <el-table-column prop="thirdParty" label="第三方" align="center"></el-table-column>
        <el-table-column prop="activeName" label="活动名称" align="center"></el-table-column>
        <el-table-column prop="orderCount" label="订单金额" align="center"></el-table-column>
        <el-table-column prop="bsDiscount" label="百胜折扣" align="center"></el-table-column>
        <el-table-column prop="bayNum" label="交易金额" align="center"></el-table-column>
        <el-table-column prop="payNum" label="实付金额" align="center"></el-table-column>
        <el-table-column prop="thirdPay" label="第三方补贴" align="center"></el-table-column>
        <el-table-column prop="feeHand" label="手续费" align="center"></el-table-column>
        <el-table-column prop="feeServer" label="服务费" align="center"></el-table-column>
        <el-table-column prop="feeBs" label="配送费（百胜）" align="center"></el-table-column>
        <el-table-column prop="feeThird" label="配送费（第三方）" align="center"></el-table-column>
        <el-table-column prop="counts" label="笔数" align="center"></el-table-column>
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
  name: 'activeSale',
  data () {
    return {
      reportDay: '',
      frCompany: 1,
      frCompanySelect: [{
        id: 1,
        name: '法人公司1'
      }, {
        id: 2,
        name: '法人公司2'
      }],
      kpGroup: 1,
      kpGroupSelect: [{
        id: 1,
        name: '开票单位1'
      }, {
        id: 2,
        name: '开票单位2'
      }, {
        id: 3,
        name: '开票单位3'
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
      activeType: 1,
      activeTypeSelect: [{
        id: 1,
        value: 'A-N'
      }, {
        id: 2,
        value: 'A-L'
      }],
      tableData: [{
        id: 1,
        dwNum: '活动1',
        brandType: 'KFC1',
        activeType: '活动类型1',
        thirdParty: '第三方1',
        activeName: '活动1',
        orderCount: '订单数量1',
        bsDiscount: '百胜账号1',
        bayNum: 'bay数量1',
        payNum: '支付金额1',
        thirdPay: '三方金额1',
        feeHand: '处理费用1',
        feeServer: '服务费用1',
        feeBs: '百胜费用1',
        feeThird: '三方费用1',
        counts: 'KFC1'
      }, {
        id: 2,
        dwNum: '活动12',
        brandType: 'KFC12',
        activeType: '活动类型12',
        thirdParty: '第三方12',
        activeName: '活动12',
        orderCount: '订单数量12',
        bsDiscount: '百胜账号12',
        bayNum: 'bay数量12',
        payNum: '支付金额12',
        thirdPay: '三方金额12',
        feeHand: '处理费用12',
        feeServer: '服务费用12',
        feeBs: '百胜费用12',
        feeThird: '三方费用12',
        counts: 'KFC12'
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
    deleteList () {

    },
    detailList (id) {
      this.$router.push({name: 'thirdPartyBillRep', params: {id: id}})
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
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
