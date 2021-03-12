<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">核销月份</div>
        <el-date-picker v-model="searchData.startUsedTime" type="month"
          value-format="yyyy-MM" placeholder="选择月份"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endUsedTime" type="month"
          value-format="yyyy-MM" placeholder="选择月份"></el-date-picker>
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
      <!--<div class="selectContent">-->
        <!--<div class="selectTitle">券活动名称</div>-->
        <!--<el-select size="small"  v-model="searchData.activityGroup" filterable>-->
          <!--<el-option value="" label="请选择"></el-option>-->
          <!--<el-option v-for="(item, index) in activityGroupSelect" :key="index" :label="item" :value="item">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
      <div class="selectContent" >
        <div class="selectTitle">key 活动</div>
        <el-select size="small" v-model="searchData.activityGroup" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in keyNames" :key="item.activity" :label="item.activityGroup"
                     :value="item.activity">
          </el-option>
        </el-select>
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
  name: 'vdmCouponMonth',
  data () {
    return {
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.endUsedTime) {
          	let curDate = (new Date(this.searchData.endUsedTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() > curDate
          } else {
            return false
          }
        }
      },
      pickerEnd: {
        disabledDate: (time) => {
          if (this.searchData.startUsedTime) {
          	let curDate = (new Date(this.searchData.startUsedTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate
          } else {
            return false
          }
        }
      },
      searchData: {
        startUsedTime: '',
        endUsedTime: '',
        resEntityName: '',
        activityGroup: '',
      },
      // activityGroupSelect: [],
      simpleTableData: [],
      simpleTableKey: [{
        name: '法人公司编号',
        value: 'resEntity'
      }, {
        name: '法人公司名称',
        value: 'resEntityName'
      }, {
        name: 'key 活动',
        value: 'activityGroup'
      }, {
        name: '核销金额',
        value: 'sales',
        classname: 'sumClass'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      keyNames:[]
      // couponMonthSearchData: {}
    }
  },
  components: {
    reportTableCom,
    remoteSelect
  },
  methods: {
  	getCompany(res){
      this.searchData.resEntityName = res;
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getVdmCouponMonthRep()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getVdmCouponMonthRep()
    },
    searchList () {
      // this.couponMonthSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getVdmCouponMonthRep()
    },
    reset () {
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
      this.$refs.companyRef.modelValue = ''
    },
    exportFile () {
      let that = this
      api.exportVdmCouponMonth(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '预售电子券码核销月度报告.xlsx'
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
          this.sendVdmCouponMonthMail(value)
        }).catch(() => {
          this.showTips('已取消','warning')
        })
    },
    // getActivityGroup () {
    //   let that = this
    //   api.getActivityGroup(function(res){
    //     if (res.code === 200) {
    //       that.activityGroupSelect = res.data
    //     } else if (res.code != 404) {
    //       that.showTips(res.msg,'warning')
    //     }
    //   })
    // },
    getVdmCouponMonthRep () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'startUsedTime',
        value: this.searchData.startUsedTime
      }, {
      	name: 'endUsedTime',
        value: this.searchData.endUsedTime
      }, {
      	name: 'resEntityName',
        value: this.searchData.resEntityName
      }, {
      	name: 'activityGroup',
        value: this.searchData.activityGroup
      }]
      api.getVdmCouponMonthRep(this.common.joinSearchParam(pathParams),function(res){
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
      api.checkVdmCouponMonthMail(this.searchData, function(res){
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
    sendVdmCouponMonthMail (val) {
      let that = this
      let params = Object.assign(this.searchData, { password: val })
      api.sendVdmCouponMonthMail(params, function(res){
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
    },
    getKeyNames(){
        api.listActivityName(res=>{
            this.keyNames  = res.data
        })
    },
  },
  beforeMount () {
    // this.getActivityGroup();
    this.getKeyNames();
  }
}
</script>

<style>
</style>
