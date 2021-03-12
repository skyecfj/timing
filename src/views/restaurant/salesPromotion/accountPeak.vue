<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">交易日期</div>
        <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
        </el-date-picker>
        <!-- <el-date-picker v-model="tradeStartTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="tradeEndTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker> -->
        </div>
      <!--<div class="selectContent">
        <div class="selectTitle">品牌</div>
        <el-select size="small"  v-model="brandId" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in brandSelect" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandId">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动类型</div>
        <el-select size="small"  v-model="activityType">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in activtyTypeSelect" :key="item.activityTypeId" :label="item.activityTypeName" :value="item.activityTypeId">
          </el-option>
        </el-select>
      </div>-->
      <div class="selectContent">
        <div class="selectTitle">活动名称</div>
        <el-select size="small"  v-model="activityId" @change="activeChange" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in activeSelect" :key="item.activityId" :label="item.activityName" :value="item.activityId">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">第三方</div>
        <el-select size="small"  v-model="thirdId" @change="thirdChange" filterable remote :remote-method="remoteMethod" v-scroll="scrollLoading" :loading="loading">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in thirdSelect" :key="item.thirdId" :label="item.thirdName" :value="item.thirdId">
          </el-option>
        </el-select>
      </div>
      <el-button size="small" type="success" @click="searchData">查询</el-button>
      <el-button size="small" type="success" @click="reset" plain class="reSet">重置</el-button>
      <!--<el-button size="small" type="success" @click="handleReport">手动生成报告</el-button>-->
      <el-button size="small" type="success" @click="exportReport" :disabled="disabled"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent" >
      <el-table :data="tableData" style="width: 100%" border :cell-style="setAmountBigiest" :height="tblHeight" >
      	<el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column prop="activityType" label="活动类型"></el-table-column>
        <el-table-column prop="activityName" label="活动名称"></el-table-column>
        <el-table-column prop="thirdName" label="第三方"></el-table-column>
        <el-table-column prop="tradeTime" label="交易日期">
          <template slot-scope="scope">
            <span>{{ scope.row.tradeTime | checkTradeTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balanceAmount" label="日结算金额（餐厅应收金额）" width="185"></el-table-column>
      </el-table>
      <!-- <div class="pagination">
        <el-pagination background
    	  @size-change="handleSizeChange"
    	  @current-change="handleCurrentChange"
    	  :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords" :page-sizes="pageSizeList">
        </el-pagination>
      </div> -->
    </div>
    <handle-rep-com
      :isShow="isShow"
      :type="type"
      @submitForm="submits"
      @close="close"
      :activtyTypeOption="activtyTypeOption"></handle-rep-com>
  </div>
</template>

<script>
import apidr from '@/model/apidr'
import handleRepCom from './handleRepCom'
import scroll from '@/directives/index'

export default {
  name: 'accountPeak',
  watch:{
    tradeStartTimeVal(val,oldVal){
        this.onRangeDatePick = Object.assign({},{
            onPick:(dateRange)=>{
              this.tradeStartTimeVal =  new Date(dateRange.minDate).getTime();
              this.tradeEndTimeVal =  new Date(dateRange.maxDate).getTime();
            },
            disabledDate: (time) => {
              if(val){
                return time.getTime() <= this.tradeStartTimeVal-62*24*60*60*1000 || time.getTime() >= this.tradeStartTimeVal + 62*24*60*60*1000
              }else{
                return false;
              }
            }
      });
    }
  },
  data () {
    return {
    	onRangeDatePick: {
        onPick:(dateRange)=>{
          this.tradeStartTimeVal =  new Date(dateRange.minDate).getTime();
          this.tradeEndTimeVal =  new Date(dateRange.maxDate).getTime();
        }
      },
      rangeDate: [],
      tradeStartTimeVal: '',
      tradeEndTimeVal: '',
      tradeStartTime: '',
      tradeEndTime: '',
      brandId: '',
      brandSelect: [],
      activityType: '',
      activtyTypeSelect: [],
      thirdId: '',
      thirdSelect: [],
      activityId: '',
      activeSelect: [],
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      isShow: false,
      type: '1',
      activityNameOption: [],
      thirdNameOption: [],
      activtyTypeOption: [],
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId: '',
      curActiveName: '',
      curThirdName: '',
      disabled: true,
      tblHeight : 0
    }
  },
  components: {
    handleRepCom
  },
  directives: {
    scroll
  },
  methods: {
    rangeDateChange(){
      if(this.rangeDate){
        this.tradeStartTime = this.rangeDate[0];
        this.tradeEndTime = this.rangeDate[1];
      }else{
        this.tradeStartTime = '';
        this.tradeEndTime = '';
        this.tradeStartTimeVal = '';
        this.tradeEndTimeVal = '';
      }
    },
    remoteMethod (query) {
  	  this.pageNumber = 1
  	  this.loading = true
  	  if (query !== '' && query !== '请选择') {
        this.query = query
      } else {
        this.query = ''
      }
      this.getThirdSelect()
  	},
  	scrollLoading (param) {
  	  if (param) {
  	    this.pageNumber +=1
  	    this.getThirdSelect()
  	  }
  	},
  	activeChange (val) {
  		let obj = []
      obj = this.activeSelect.filter((item)=>{
          return item.activityId == val
      })
      this.curActiveName = obj[0].activityName
  	  this.curActiveId = val
  	  this.getThirdSelect()
  	},
  	thirdChange (val) {
  		let obj = []
      obj = this.thirdSelect.filter((item)=>{
          return item.thirdId == val
      })
      this.curThirdName = obj[0].thirdName
  	  this.curThirdId = val
  	  this.getActivitySelect()
  	},
  	handleSizeChange (val) {
      this.pageSize = val
      this.getDayPeakStatistics()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getDayPeakStatistics()
    },
    searchData () {
      if (!this.tradeStartTime || !this.tradeEndTime) {
        this.showTips('请选择交易日期','warning')
      } else if (!this.activityId) {
        this.showTips('请选择活动名称','warning')
      } else {
        this.currentPage = 1
        this.getDayPeakStatistics()
        // let formData = {
        //   tradeStartTime: this.tradeStartTime,
        //   tradeEndTime: this.tradeEndTime,
        //   activityId: this.activityId,
        //   activityName: this.curActiveName,
        //   thirdId: this.thirdId,
        //   thirdName: this.curThirdName
        // }
        // this.getDayPeakStatistics()
        // this.submits(formData)
//      this.getDayPeakStatistics()
      }
    },
    reset () {
      this.tradeStartTime = ''
      this.tradeEndTime = ''
      this.brandId = ''
      this.activityType = ''
      this.activityId = ''
      this.thirdId = ''
      this.rangeDate = []
      this.tradeStartTimeVal = '';
      this.tradeEndTimeVal = '';
    },
    handleReport () {
      this.isShow = true
    },
    exportReport () {
      let that = this
      let param = {
        pageIndex : this.currentPage,
        pageSize  : this.pageSize,
        tradeStartTime : this.tradeStartTime,
        tradeEndTime : this.tradeEndTime,
        activityId : this.activityId,
        thirdId : this.thirdId
      }
      apidr.downDayPeakReport(param, 'application/vnd.ms-excel', function(res){
        if(res.code){
          that.common.warningMessage(res.msg)
        }else{
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '活动日峰值结算报告.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getBrandSelect () {
      let that = this
      apidr.getBrandSelect('',function(res){
        if (res.code === 200) {
          that.brandSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    setAmountBigiest({row, column, rowIndex, columnIndex}){
      if(columnIndex == 5 && row.maxFlag == '1'){
        return {
          background: 'red'
        }
      }
    },
    getThirdSelect () {
      let that = this
      let pathParams = [{
      	name: 'thirdName',
        value: this.query
      }, {
      	name: 'pageNumber',
        value: this.pageNumber
      }, {
      	name: 'activityId',
        value: this.curActiveId
      }]
      apidr.getThirdSelect(this.common.joinSearchParam(pathParams), function(res){
        that.loading = false
        if (res.code === 200) {
          that.thirdSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getActivitySelect () {
      let that = this
      let pathParams = [{
      	name: 'thirdId',
        value: this.curThirdId
      }]
      apidr.getActivitySelect(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.activeSelect = res.data
          that.activityNameOption = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getActivityType () {
      let that = this
      apidr.getActivityType(function(res){
        if (res.code === 200) {
          that.activtyTypeSelect = res.data
          that.activtyTypeOption = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getDayPeakStatistics () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'tradeStartTime',
        value: this.tradeStartTime
      }, {
      	name: 'tradeEndTime',
        value: this.tradeEndTime
      }, {
      	name: 'brandId',
        value: this.brandId
      }, {
      	name: 'activityType',
        value: this.activityType
      }, {
      	name: 'activityId',
        value: this.activityId
      }, {
        name: 'thirdId',
        value: this.thirdId
      }]
      apidr.getDayPeakStatistics(this.common.joinSearchParam(pathParams), function(res){
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
    },
    submits (formData) {
      let that = this
      let param = [{
        name: 'activityId',
        value: formData.activityId
      }, {
        name: 'activityName',
        value: formData.activityName
      }, {
        name: 'thirdId',
        value: formData.thirdId
      }, {
        name: 'thirdName',
        value: formData.thirdName
      }, {
        name: 'tradeStartTime',
        value: formData.tradeStartTime
      }, {
        name: 'tradeEndTime',
        value: formData.tradeEndTime
      }, {
        name: 'activityType',
        value: formData.activityType
      }]
      apidr.handleDayPeakReport(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
        	that.isShow = false
          that.showTips('手动生成报告成功', 'success')
          that.getDayPeakStatistics()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    close () {
      this.isShow = false
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    let windowHeight = window.innerHeight;
    this.tblHeight = windowHeight * 0.65;
  	this.getActivityType()
    this.getBrandSelect()
    this.getThirdSelect()
    this.getActivitySelect()
  },
  filters: {
    checkTradeTime (val) {
      let dates = val.split(' ')
      return dates[0]
    }
  }
}
</script>

<style>
</style>
