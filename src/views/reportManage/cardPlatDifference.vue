<template>
  <div class="mainContent">
  	<div class="searchContent">
  	  <div>
  	  	<div class="selectContent">
          <div class="selectTitle">年/月</div>
          <el-date-picker
            v-model="createData.date"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月份">
          </el-date-picker>
        </div>
        <div class="selectContent">
          <div class="selectTitle">平台数据类型</div>
          <el-select size="small"  v-model="createData.checkType" @change="typeChange" filterable>
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in checkTypeSelect" :key="index" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="selectContent">
          <div class="selectTitle">平台类型</div>
          <el-select size="small"  v-model="createData.platformCode" filterable>
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in platformCodeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
        <el-button size="small" type="success"  @click="createDiffData">差异数据生成</el-button>
  	  </div>
      <div class="selectContent">
        <div class="selectTitle">年/月</div>
        <el-date-picker
          v-model="searchData.date"
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
      <el-table :data="simpleTableData" :header-cell-style="headerStyle" style="width: 100%;" border>
        <el-table-column  prop="dataDate" label="日期" width="100"></el-table-column>
        <el-table-column label="银行卡">
          <el-table-column label="银联卡">
            <el-table-column  prop="bankCardUCCAtomData" label="原子层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="bankCardUCCAggData" label="报告层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="bankCardUCCCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
          <el-table-column label="工行卡">
            <el-table-column  prop="bankCardSDCAtomData" label="原子层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="bankCardSDCAggData" label="报告层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="bankCardSDCCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="百胜卡_餐厅售卡（订单金额）">
          <el-table-column label="银联">
            <el-table-column  prop="yumResSaleUnpAtomData" label="原子层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResSaleUnpAggData" label="报告层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResSaleUnpCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
          <el-table-column label="资和信">
            <el-table-column  prop="yumResSaleZhxAtomData" label="原子层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResSaleZhxAggData" label="报告层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResSaleZhxCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="百胜卡_大额订单">
          <el-table-column label="银联">
            <el-table-column  prop="yumRscSaleUnpAtomData1" label="订单" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumRscSaleUnpAtomData2" label="赠卡" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumRscSaleUnpAtomData" label="原子层_面额" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumRscSaleUnpAggData" label="报告层_面额" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumRscSaleUnpCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
          <el-table-column label="资和信">
            <el-table-column  prop="yumRscSaleZhxAtomData1" label="订单" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumRscSaleZhxAtomData2" label="赠卡" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumRscSaleZhxAtomData" label="原子层_面额" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumRscSaleZhxAggData" label="报告层_面额" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumRscSaleZhxCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="百胜卡_卡消费">
          <el-table-column label="银联">
          	<el-table-column  prop="yumResTransUnpAtomData1" label="交易" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResTransUnpAtomData2" label="退款" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResTransUnpAtomData" label="原子层_消费" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResTransUnpAggData" label="报告层_消费" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResTransUnpCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
          <el-table-column label="资和信">
            <el-table-column  prop="yumResTransZhxAtomData1" label="交易" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResTransZhxAtomData2" label="退款" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResTransZhxAtomData" label="原子层_消费" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResTransZhxAggData" label="报告层_消费" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumResTransZhxCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>

          </el-table-column>
        </el-table-column>
        <el-table-column label="百胜卡_销卡退费">
          <el-table-column label="银联">
            <el-table-column  prop="yumCardRechargeUnpAtomData" label="原子层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumCardRechargeUnpAggData" label="报告层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumCardRechargeUnpCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
          <el-table-column label="资和信">
            <el-table-column  prop="yumCardRechargeZhxAtomData" label="原子层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumCardRechargeZhxAggData" label="报告层" width="130" class-name="sumClass"></el-table-column>
            <el-table-column  prop="yumCardRechargeZhxCheckData" label="差异" width="130" class-name="sumClass"></el-table-column>
          </el-table-column>
        </el-table-column>
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
import reportTableCom from './reportTableCom.vue'
import api from '@/model/api'

export default {
  name: 'cardSearch',
  data () {
    return {
      createData: {
        date: '',
        checkType: '',
        platformCode: ''
      },
      checkTypeSelect: [{
        name: '银行卡',
        value: 'bank_card'
      }, {
        name: '餐厅售卡',
        value: 'yum_res_sale'
      }, {
        name: '卡消费',
        value: 'yum_res_trans'
      }, {
        name: '销卡退费',
        value: 'yum_card_recharge'
      }, {
        name: '大额订单',
        value: 'yum_rsc_sale'
      }],
      platformCodeSelect: [],
      searchData: {
        date: ''
      },
      simpleTableData: [],
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
      this.getCardPlatDiff()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCardPlatDiff()
    },
    headerStyle ({row, rowIndex}) {
      return 'text-align: center'
    },
    typeChange (val) {
          if(val === 'bank_card'){
              this.platformCodeSelect = ['UCC','SDC']
          }else{
              this.platformCodeSelect = ['ZHX','UNP']
          }
    },
    searchList () {
      if (this.searchData.date == '' || this.searchData.date == null) {
        this.showTips('请选择月份','warning')
      } else {
        // this.cardSearchData = JSON.parse(JSON.stringify(this.searchData))
        this.getCardPlatDiff()
      }
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
      for (let key in this.createData) {
        this.createData[key] = ''
      }
    },
    exportFile () {
      let that = this
      api.exportCardPlatDiff(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '卡平台差异分析报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getCardPlatDiff () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'date',
        value: this.searchData.date
      }]
      api.getCardPlatDiff(this.common.joinSearchParam(pathParams), function(res){
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
    createDiffData () {
      if (this.createData.date == '' || this.createData.date == null) {
        this.showTips('请选择月份','warning')
      }
      let that = this
      let pathParams = [{
      	name: 'platformCode',
        value: this.createData.platformCode
      }, {
      	name: 'checkType',
        value: this.createData.checkType
      }, {
      	name: 'date',
        value: this.createData.date
      }]
      api.createDiffData(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.showTips(res.data,'success')
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

<style lang="scss" scoped>

</style>
