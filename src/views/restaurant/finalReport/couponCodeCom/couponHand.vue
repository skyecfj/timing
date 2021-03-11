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
          <el-select size="small"  v-model="brandType">
            <el-option v-for="item in brandSelect" :key="item.id" :label="item.name" :value="item.id">
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
            <el-option v-for="item in activeSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchData">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
    </div>
    <div class="dataContent" >
      <div class="opreRight">
        <el-button size="small"   @click="" type="success"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        <el-button size="small"   @click="" type="success">确认结算</el-button>
        <el-button size="small"   @click="" type="danger">删除</el-button>
      </div>
      <el-table :data="totalDate" show-summary :sum-text="sum_text" style="width: 100%" border>
      	<el-table-column prop="checkState" label="核对情况" align="center"></el-table-column>
        <el-table-column prop="sum" label="金额" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small"  type="text" @click="">
              <span>明细</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sec-data-con">
      <div class="tab-content" >
        <el-tabs v-model="activeTabName" @tab-click="handleSwitch">
          <el-tab-pane label="结算明细报告" name="detailReport">
            <coupon-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></coupon-table-com>
          </el-tab-pane>
          <el-tab-pane label="按餐厅结算报告" name="restaurantReport">
            <coupon-table-com></coupon-table-com>
          </el-tab-pane>
          <el-tab-pane label="按开票单位结算报告" name="companyReport">
            <coupon-table-com></coupon-table-com>
          </el-tab-pane>
          <el-tab-pane label="按法人公司结算报告" name="legalReport">
            <coupon-table-com></coupon-table-com>
          </el-tab-pane>
        </el-tabs>
      </div>
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
import couponTableCom from './couponTableCom.vue'

export default {
  name: 'couponHand',
  data () {
    return {
      startDate: '',
      endDate: '',
      brandType: 1,
      brandSelect: [{
        id: 1,
        name: '全部'
      }, {
      	id: 2,
      	name: 'KFC肯德基'
      }, {
        id: 3,
        name: 'PH必胜客'
      }, {
        id: 4,
        name: 'PHHS必胜客宅急送'
      }, {
        id: 5,
        name: 'ED东方既白'
      }, {
        id: 6,
        name: 'LS小肥羊'
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
      activeSelect: [{
        id: 1,
        name: '全部'
      }, {
        id: 2,
        name: '支付宝当面付'
      }, {
        id: 3,
        name: '威能活动'
      }, {
        id: 4,
        name: '微信活动'
      }],
      sum_text: '总金额',
      totalDate: [{
        id: 1,
        checkState: '核对无差异',
        sum: '72829500'
      }, {
        id: 2,
        checkState: '核对有差异',
        sum: '10000000'
      }],
      activeTabName: 'detailReport',
      simpleTableData: [],
      simpleTableKey: [{
        name: '消费餐厅编号',
        value: 'a'
      }, {
        name: '消费餐厅名称',
        value: 'b'
      }, {
        name: '券码',
        value: 'c'
      }, {
        name: '交易状态',
        value: 'd'
      }, {
        name: '券码名称',
        value: 'e'
      }, {
        name: '活动名称',
        value: 'f'
      }, {
        name: '活动名称',
        value: 'g'
      }, {
        name: '活动批次',
        value: 'h'
      }, {
        name: 'POS交易号',
        value: 'i'
      }, {
        name: '是否上线',
        value: 'j'
      }, {
        name: '网上支付号',
        value: 'k'
      }, {
        name: '营业日期',
        value: 'l'
      }, {
        name: '交易日期',
        value: 'm'
      }, {
        name: '券面额',
        value: 'n'
      }, {
        name: '券净额',
        value: 'o'
      }, {
        name: '消费者支付名称',
        value: 'p'
      }, {
        name: '消费者支付价格',
        value: 'q'
      }, {
        name: '第三方补贴名称',
        value: 'r'
      }, {
        name: '第三方补贴价格',
        value: 's'
      }, {
        name: '积分兑换',
        value: 't'
      }, {
        name: '手续费',
        value: 'u'
      }, {
        name: '售卖渠道',
        value: 'v'
      }, {
        name: '发券品牌',
        value: 'w'
      }, {
        name: '营运市场',
        value: 'x'
      }, {
        name: '财务市场',
        value: 'y'
      }, {
        name: '城市',
        value: 'z'
      }, {
        name: '法人公司CODE',
        value: 'A'
      }, {
        name: '法人公司名称',
        value: 'B'
      }, {
        name: '开票公司CODE',
        value: 'C'
      }, {
        name: '开票单位名称',
        value: 'D'
      }, {
        name: '售券机构',
        value: 'E'
      }, {
        name: '码类型',
        value: 'F'
      }, {
        name: '收银机号',
        value: 'G'
      }, {
        name: '业务模式',
        value: 'H'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
    }
  },
  components: {
    couponTableCom
  },
  methods: {
    searchData () {

    },
    reset () {

    },
    handleSwitch () {

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
