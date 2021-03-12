<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">核销日期</div>
        <el-date-picker v-model="searchData.startTransTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endTransTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">法人公司</div>
        <remoteSelect
          placeholder="请选择法人公司"
          :remoteFn="'getAllCompanyIdNamess'"
          :optLabel="'companyName'"
          :optValue="'jdeCode'"
          @getChangeData="getCompany"
          :type="2"
          :customLabel="true"
          :customType="1"
          ref="companyRef">
        </remoteSelect>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
      <el-button size="small" type="success"  @click="checkMail">发送邮件</el-button>
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
import remoteSelect from '@/components/common/remoteSelect'

export default {
  name: 'cardTransDetail',
  data () {
    return {
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.endTransTime) {
          	let curDate = (new Date(this.searchData.endTransTime)).getTime()
            let six = 30 * 24 * 3600 * 1000
            let sixMonths = curDate - six
            return time.getTime() < sixMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerEnd: {
        disabledDate: (time) => {
          if (this.searchData.startTransTime) {
          	let curDate = (new Date(this.searchData.startTransTime)).getTime()
            let six = 30 * 24 * 3600 * 1000
            let sixMonths = curDate + six
            return time.getTime() > sixMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      searchData: {
      	startTransTime: '',
      	endTransTime: '',
      	resEntityName: '',
      },
      simpleTableData: [],
      simpleTableKey: [{
        name: '法人公司名称',
        value: 'resEntityName'
      }, {
        name: '餐厅',
        value: 'resName'
      }, {
        name: '日期',
        value: 'operationDate'
      }, {
        name: '金额',
        value: 'transAmount',
        classname: 'sumClass'
      }, {
        name: '时间',
        value: 'settleTransTime'
      }, {
        name: '备注',
        value: 'cardNO'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      // cardTransSearchData: {}
    }
  },
  components: {
    reportTableCom,
    remoteSelect
  },
  methods: {
  	getCompany (res) {
        this.searchData.resEntityName = res
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getCardTransDetail()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCardTransDetail()
    },
    searchList () {
      // this.cardTransSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getCardTransDetail()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.companyRef.modelValue = ''
    },
    exportFile () {
      let that = this
      api.exportCardTransDetail(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '卡核销明细报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    sendMail () {
      this.$prompt('请输入邮箱密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPattern:  /\w/,
        inputErrorMessage: '邮箱密码不能为空且不为汉字'
      }).then(({ value }) => {
        this.sendMailDetail(value)
      }).catch(() => {
        this.showTips('已取消','warning')
      })
    },
    getCardTransDetail () {
      let that = this
    	let param = [{
        name:'pageIndex',
        value: this.currentPage
      }, {
        name:'pageSize',
        value:this.pageSize
      }, {
  	    name:'startTransTime',
        value:this.searchData.startTransTime
      }, {
        name:'endTransTime',
        value:this.searchData.endTransTime
      }, {
        name:'resEntityName',
        value:this.searchData.resEntityName
      }]
      api.getCardTransDetail(this.common.joinSearchParam(param),function(res){
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
    checkMail () {
      let that = this
      api.checkCardTransMail(this.cardTransSearchData, function(res){
        if (res.code === 200) {
          let entityName = res.data
          that.confirmTips('<span>该报表有</span><strong>'+entityName.length+'</strong>家法人公司的内部往来/加盟商结算联系人没有配置邮箱，确认发送邮件？</span>')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        } else {
          that.sendMail()
        }
      })
    },
    sendMailDetail (val) {
      let that = this
      let params = Object.assign(this.cardTransSearchData, { password: val })
      api.sendMailDetail(params, function(res){
        if (res.code === 200) {
        	that.showTips('邮件发送成功','success')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    confirmTips (context) {
      let that= this
      this.$confirm(context, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
//      customClass: 'mail-class'
      }).then(() => {
        that.sendMail()
      }).catch(() => {
        //that.common.infoMessage('已取消')
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

  }
}
</script>

<style>
</style>
