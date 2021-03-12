<template>
  <div class="mainContent">
  	<div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">年/月</div>
        <el-date-picker
          v-model="searchData.summaryDate"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月份">
        </el-date-picker>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent gift">
      <el-table :data="simpleTableData" :header-cell-style="headerStyle" style="width: 100%;" border >
        <el-table-column width="190">
            <template slot="header" slot-scope="scope">
                <span>{{firstHeader}}</span>
            </template>
            <template slot-scope="scoped">
                <span class="center">{{scoped.row.cardType}}</span>
                <span class="center">{{scoped.row.amountType}}</span>
            </template>
        </el-table-column>
        <el-table-column  prop="balanceAmount" label="期末余额" width=""></el-table-column>
        <el-table-column  prop="expiredAmount" label="已到期" width=""></el-table-column>
        <el-table-column  label="预计到期" width="">
          <el-table-column  prop="thirdExpireAmount" label="3个月" width=""></el-table-column>
          <el-table-column  prop="sixthExpireAmount" label="6个月" width=""></el-table-column>
          <el-table-column  prop="ninthExpireAmount" label="9个月" width=""></el-table-column>
          <el-table-column  prop="twelfthExpireAmount" label="12个月" width=""></el-table-column>
          <el-table-column  prop="otherAmount" label="其他" width=""></el-table-column>
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
      searchData: {
        summaryDate: ''
      },
      simpleTableData: [],
      firstHeader: '报告日:无',
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // cardSearchData: {},
      searchDate: ''
    }
  },
  components: {
    reportTableCom
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getCardAgingDetail()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCardAgingDetail()
    },
    headerStyle ({row, column, rowIndex, columnIndex}) {
        return 'text-align: center'
    },
    searchList () {
        if (this.searchData.summaryDate) {
            let [year,month] = this.searchData.summaryDate.split('-');
            let day = new Date(new Date(year,month,1).getTime()-1000*60*60*24).getDate();
            this.searchDate = this.searchData.summaryDate + '-01'
            this.firstHeader = '报告日:' +this.searchData.summaryDate+'-'+ day;
        } else {
            this.searchDate = this.searchData.summaryDate
            this.firstHeader = '报告日:无';
            this.common.messageUtil({
                type:'warning',
                message:'请输入日期'
            })
            return;
      }
      // this.cardSearchData = { summaryDate: this.searchDate }
      this.getCardAgingDetail()
    },
    reset () {
      this.searchData.summaryDate = ''
    },
    exportFile () {
      let that = this;
        if (this.searchData.summaryDate) {
            let [year,month] = this.searchData.summaryDate.split('-');
            let day = new Date(new Date(year,month,1).getTime()-1000*60*60*24).getDate();
            this.searchDate = this.searchData.summaryDate + '-01'
            this.firstHeader = '报告日:' +this.searchData.summaryDate+'-'+ day;
        } else {
            this.searchDate = this.searchData.summaryDate
            this.firstHeader = '报告日:无';
            this.common.messageUtil({
                type:'warning',
                message:'请输入日期'
            })
            return;
        }

      api.exportCardAgingDetail({ summaryDate: this.searchDate }, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '礼品卡账龄报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getCardAgingDetail () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'summaryDate',
        value: this.searchDate
      }]
      api.getCardAgingDetail(this.common.joinSearchParam(pathParams), function(res){
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

<style scoped lang="scss">
    .center{
        text-align:center;
    }
   .gift /deep/ .el-table table.el-table__body tr.el-table__row td {
        padding: 0 0 !important;
    }
    .el-table td {
        .cell {
            line-height: 40px;
        }
        .cell span {
            border-right: 1px solid #ebeef5;
            padding: 6px;
            width: 48%;
            display:inline-block;
            box-sizing: border-box;
        }
        .cell span:last-child{
            border: none;
        }
    }
</style>
