<template>
  <div class="mainContent">
    <div class="sec-data-con">
      <div class="tab-content" >
        <div class="report-info-btns">
          <el-button size="small"   @click="downloadList" type="success"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
          <el-button size="small"   @click="sendEmailInfo" type="success" :disabled="reportInfo.balanceStatus === '1'">发送邮件</el-button>
          <el-button size="small"   @click="affirmBalance" type="success" :disabled="reportInfo.balanceStatus === '1'">确认结算</el-button>
          <el-button size="small"   @click="deleteList" type="danger" :disabled="reportInfo.balanceStatus === '1'">删除</el-button>
        </div>
        <el-tabs v-model="activeTabName" @tab-click="handleSwitch">
          <el-tab-pane v-if="reportInfo.isHaveDetail == 1" label="订单明细" name="orderDetail">
            <commission-com :reportInfo="reportInfo" :tableData="simpleTableData" :tableKey="simpleTableKey" :chargeAmount="chargeAmount"></commission-com>
          </el-tab-pane>
          <el-tab-pane label="按餐厅" name="restaurantReport">
            <commission-com :reportInfo="reportInfo" :tableData="simpleTableData" :tableKey="simpleTableKey" :chargeAmount="chargeAmount" ></commission-com>
          </el-tab-pane>
          <el-tab-pane label="按开票单位" name="unitReport">
            <commission-com :reportInfo="reportInfo" :tableData="simpleTableData" :tableKey="simpleTableKey" :chargeAmount="chargeAmount"></commission-com>
          </el-tab-pane>
          <el-tab-pane label="按法人公司" name="companyReport">
            <commission-com :reportInfo="reportInfo" :tableData="simpleTableData" :tableKey="simpleTableKey" :chargeAmount="chargeAmount"></commission-com>
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
    <send-email-com :isShow="isShow" :sendEmailForm="sendEmailForm" :notNeedPassword="notNeedPassword" @close="close"></send-email-com>
  </div>
</template>

<script>
import commissionCom from './commissionCom/commissionCom.vue'
import sendEmailCom from './sendEmailCom.vue'
import apidr from '@/model/apidr'
import api from '@/model/api'
import Main from '@/main'

export default {
  name: 'commissionRep',
  data () {
    return {
      reportInfo: {},
      activeTabName: 'orderDetail',
      simpleTableData: [],
      simpleTableKey: [{name: '开票单位编号', value: 'billingUnit'},
                        {name: '开票单位名称', value: 'billingUnitName'},
                        {name: '营业日期', value: 'bizDate' },
                        {name: '品牌', value: 'brandName'},
                        {name: '法人公司编号', value: 'companyCode'},
                        {name: '法人公司名称', value: 'companyName'},
                        {name: '消费餐厅编号', value: 'deliveryStoreCode'},
                        {name: '消费餐厅名称', value: 'deliveryStoreName'},
                        {name: '财务市场', value: 'financialMarket'},
                        {name: this.chargeType == 1 ? '手续费' : '服务费', value: 'handingCharge'},
                        {name: '营运市场', value: 'operateMarket'},
                        {name: '交易日期', value: 'tradeDate'}],
      defaultHeader: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      currentBillId: '',
      chargeType: '',
      chargeAmount: '',
      isShow: false,
      sendEmailForm: {},
      notNeedPassword : false,
      type: '1',
      userName: ''
    }
  },
  components: {
    commissionCom,
    sendEmailCom
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      if(this.activeTabName != 'orderDetail'){
        this.getChargeDetail()
      }else{
        this.getOrderDetail()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if(this.activeTabName != 'orderDetail'){
        this.getChargeDetail()
      }else{
        this.getOrderDetail()
      }
    },
    handleSwitch (tab, event) {
      this.pageSize = 10
      this.currentPage = 1
      if (tab.name === 'restaurantReport') {
        this.simpleTableKey = [{name: '序号',value: 'id'},
                               {name: '餐厅编号',value: 'storeCode'},
                               {name: '餐厅名称',value: 'storeName'},
                               {name: '结算金额（单位：元）',value: 'balanceAmount'}]
        this.type = '1'
        this.getChargeDetail()
      } else if (tab.name === 'unitReport') {
        this.simpleTableKey = [{name: '序号', value: 'id'}, {name: '开票单位CODE', value: 'billingUnitCode'},
        {name: '开票单位', value: 'billingUnitName' }, {name: '结算金额（单位：元）', value: 'balanceAmount'}]
        this.type = '2'
        this.getChargeDetail()
      } else if (tab.name === 'companyReport') {
        this.simpleTableKey = [{name: '序号', value: 'id'}, {name: '法人公司CODE', value: 'companyCode'},
        {name: '法人公司', value: 'companyName' }, {name: '结算金额（单位：元）', value: 'balanceAmount'}]
        this.type = '3'
        this.getChargeDetail()
      }else if(tab.name === 'orderDetail'){
        this.simpleTableKey = this.defaultHeader;
        this.type = '0'
        this.getOrderDetail()
      }
    },
    downloadList () {
      this.downBalanceList()
    },
    sendEmailInfo () {
      this.isShow = true
      this.getChargeEmailDetail()
    },
    affirmBalance () {
      let that = this
    	this.$confirm('确认结算后无法取消，是否确认结算?', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.updateChargeStatus()
      }).catch(() => {
        //that.common.infoMessage('已取消')
      })
    },
    deleteList () {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delChargeList()
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    close () {
      this.isShow = false
    },
    getChargeAmount(){
      let _self = this;
      let param = this.common.formatPathParam({
        promotionId : this.currentBillId
      });
      apidr.getChargeAmount(param,function(res){
        if(res.code === 200){
          _self.chargeAmount = _self.common.formatterAmount(res.data);
        }else{
          _self.common.errorMessage(res.msg);
        }
      })
    },
    getCommissionDetail () {
      let that = this
      let params = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.getReportDetail(this.common.joinSearchParam(params), function(res){
        if (res.code === 200) {
          that.reportInfo = res.data;
          if(that.reportInfo.isHaveDetail != 1){
            that.simpleTableKey = [{name: '序号',value: 'id'},
                                  {name: '餐厅编号',value: 'storeCode'},
                                  {name: '餐厅名称',value: 'storeName'},
                                  {name: '结算金额（单位：元）',value: 'balanceAmount'}];

            that.activeTabName = 'restaurantReport';
          }
          that.defaultHeader = that.simpleTableKey.concat()
          that.$nextTick(function () {
            //that.getChargeDetail()
            if(that.activeTabName != 'orderDetail'){
              that.getChargeDetail()
            }else{
              that.getOrderDetail()
            }
          })
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getChargeDetail () {
      let that = this
      let pathParam = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'uuidCode',
        value: this.reportInfo.uuidCode
      }, {
        name: 'type',
        value: this.type
      }]
      apidr.getChargeDetail(this.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          that.simpleTableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        } else {
          that.simpleTableData = []
          that.totalRecords = 0
        }
      })
    },
    getOrderDetail(){
      let that = this
      let pathParam = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'uuidCode',
        value: this.reportInfo.uuidCode
      }, {
        name: 'type',
        value: this.type
      }]
      apidr.getOrderDetailThird(this.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          that.simpleTableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        } else {
          that.simpleTableData = []
          that.totalRecords = 0
        }
      })
    },
    delChargeList () {
      let that = this
      let param = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.delChargeList(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.showTips('删除成功','success')
          that.common.deleteTag(that.$route,that)
          Main.$emit('updateList')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    downBalanceList () {
      let that = this
      this.common.checkFilePath(this.reportInfo.filePath).forEach(function(value, index) {
        apidr.downBalanceList(value, 'application/vnd.ms-excel', function(res){
          if(res.code){
            that.common.warningMessage(res.msg)
          }else{
            let link = document.createElement('a')
            link.href = res
            link.id = 'attachmentLink'
            link.download = value.fileName
            link.target = '_blank';link.click()
          }
        })
      })
    },
    updateChargeStatus () {
      let that = this
      let param = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.updateChargeStatus(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.getCommissionDetail()
          Main.$emit('updateList')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getChargeEmailDetail () {
      let that = this
      let pathParam = [{
        name: 'id',
        value: this.currentBillId
      }]
      apidr.getChargeEmailDetail(this.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          that.sendEmailForm = res.data
          that.notNeedPassword = !res.data.needPassword;
        }else if (res.code != 404) {
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
    this.currentBillId = parseInt(this.$route.query.id)
    this.chargeType = this.$route.query.chargeType
    this.getCommissionDetail()
    this.getChargeAmount()
  }
}
</script>

<style lang="scss" scoped>
.report-info-btns {
    position: absolute;
    top: 17px;
    right: 20px;
    z-index: 300;
}
</style>
