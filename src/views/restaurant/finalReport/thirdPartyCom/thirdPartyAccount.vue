<template>
  <div class="coupon-account">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">交易日期</div>
        <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
        </el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
          <el-select size="small"  v-model="brandType" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in brandSelect" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">第三方</div>
          <el-select size="small"  v-model="thirdParty" @change="thirdChange" filterable remote :remote-method="remoteMethod" v-scroll="scrollLoading" :loading="loading">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in thirdSelect" :key="item.thirdId" :label="item.thirdName" :value="item.thirdId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动名称</div>
          <el-select size="small"  v-model="activeName" @change="activeChange" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in activeSelect" :key="item.activityId" :label="item.activityName" :value="item.activityId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">结算状态</div>
          <el-select size="small"  v-model="accountState">
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="item in accountSelect" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchData">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="handleReport">手动生成报告</el-button>
      <!--<el-button size="small" type="success"  @click="autoReport">测试自动生成报告</el-button>-->
    </div>
    <div class="dataContent" >
      <div class="opreRight">
        <span class="unit">单位：元</span>
      </div>
      <el-table :data="thirdPartyDate" style="width: 100%" border>
        <el-table-column prop="activityName" label="活动名称"></el-table-column>
        <el-table-column prop="brandName" label="品牌" ></el-table-column>
        <el-table-column prop="thirdName" label="第三方" ></el-table-column>
        <el-table-column prop="balanceCycle" label="结算周期" width="170px">
          <template slot-scope="scope">
            <span>{{ scope.row | checkBalanceCycle }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balanceAmount" label="结算金额" width="150px"></el-table-column>
        <el-table-column prop="handleStatus" label="执行情况" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.handleStatus | checkHandleStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balanceStatus" label="结算状态" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.balanceStatus | checkBalanceStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
          	<el-tooltip content="下载" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="downloadList(scope.row.id)" :disabled="scope.row.handleStatus != 2"><i class="fa fa-download"></i></el-button>
           </el-tooltip>
            <el-tooltip content="确认结算" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="affirmBalance(scope.row.id)" :disabled="scope.row.balanceStatus == 1 || scope.row.handleStatus != 2"><i class="fas fa-check-circle"></i></el-button>
            </el-tooltip>
          	<el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="deleteList(scope.row.id)" :disabled="scope.row.balanceStatus == 1"><i class="fa fa-trash-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="detailList(scope.row)" :disabled="scope.row.handleStatus != 2"><i class="fa fa-file-alt"></i></el-button>
            </el-tooltip>
          </template>
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
    <handle-rep-com
      :isShow="isShow"
      :type="type"
      @submitForm="submits"
      @close="close"></handle-rep-com>
  </div>
</template>

<script>
import api from '@/model/api'
import Main from '@/main'
import apidr from '@/model/apidr'
import handleRepCom from '../handleRepCom'
import scroll from '@/directives/index'

export default {
  name: 'thirdPartyAccount',
  watch:{
    startTimeVal(val,oldVal){
      this.onRangeDatePick = Object.assign({},{
        onPick:(dateRange)=>{
          this.startTimeVal =  new Date(dateRange.minDate).getTime();
          this.endTimeVal =  new Date(dateRange.maxDate).getTime();
        },
        disabledDate: (time) => {
          if(val){
            return time.getTime() <= this.startTimeVal-180*24*60*60*1000 || time.getTime() >= this.startTimeVal + 180*24*60*60*1000
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
          this.startTimeVal =  new Date(dateRange.minDate).getTime();
          this.endTimeVal =  new Date(dateRange.maxDate).getTime();
        }
      },
      rangeDate: [],
      startTimeVal: '',
      endTimeVal: '',
      startDate: '',
      endDate: '',
      brandType: '',
      brandSelect: [],
      thirdParty: '',
      thirdSelect: [],
      activeName: '',
      activeSelect: [],
      accountState: 0,
      accountSelect: [{
        id: 1,
        value: '已结算'
      }, {
        id: 0,
        value: '未结算'
      }],
      thirdPartyDate: [],
      fileArr: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      activityNameOption: [],
      thirdNameOption: [],
      isShow: false,
      type: '1',
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId:''
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
        this.startDate = this.rangeDate[0];
        this.endDate = this.rangeDate[1];
      }else{
        this.startDate = '';
        this.endDate = '';
        this.startTimeVal = '';
        this.endTimeVal = '';
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
  	  this.curActiveId = val
      this.brandType = ''
  	  this.getThirdSelect()
      this.getBrandSelect(val)
  	},
  	thirdChange (val) {
  	  this.curThirdId = val
  	  this.getActivitySelect()
  	},
  	handleSizeChange (val) {
      this.pageSize = val
      this.getBalanceList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getBalanceList()
    },
    getBrandSelect (activityId) {
      let that = this
      this.brandSelect = [];
      let param = activityId? this.common.formatPathParam({
        activityId : activityId
      }) : ''
      apidr.getBrandSelect(param,function(res){
        if (res.code === 200) {
          that.brandSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
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
      }, {
      	name: 'businessType',
        value: '1'
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
    getBalanceList () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'balanceStartDate',
        value: this.startDate
      }, {
      	name: 'balanceEndDate',
        value: this.endDate
      }, {
      	name: 'brandId',
        value: this.brandType
      }, {
      	name: 'thirdId',
        value: this.thirdParty
      }, {
      	name: 'activityId',
        value: this.activeName
      }, {
        name: 'balanceStatus',
        value: this.accountState
      }, {
        name: 'businessType',
        value: '1'
      }]
      apidr.getBalanceList(this.common.joinSearchParam(pathParams), function(res){
      	that.thirdPartyDate = []
      	that.totalRecords = 0
        if (res.code === 200) {
          that.thirdPartyDate = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    delThirdBillList (id) {
      let that = this
      let param = [{
        name: 'id',
        value: id
      }]
      apidr.delThirdBillList(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.showTips('删除成功','success')
          that.getBalanceList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    downBalanceList (filePath) {
      let that = this
      filePath.forEach(function(value, index) {
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
    updateBalanceStatus (id) {
      let that = this
      let param = [{
        name: 'id',
        value: id
      }]
      apidr.updatebalanceStatus(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.getBalanceList()
          that.showTips('结算成功','success')
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
      }]
      apidr.handleThirdReport(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
        	that.isShow = false
          that.showTips('手动生成报告成功', 'success')
          setTimeout(() => {
            that.getBalanceList()
          }, 1000)
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    close () {
      this.isShow = false
    },
    searchData () {
      this.getBalanceList()
    },
    reset () {
      this.startDate = ''
      this.endDate = ''
      this.brandType = ''
      this.thirdParty = ''
      this.activeName = ''
      this.accountState = ''
      this.rangeDate = []
      this.startTimeVal = '';
      this.endTimeVal = '';
    },
    handleReport () {
      this.isShow = true
    },
    autoReport () {
      let that = this
      apidr.testThirdReport(function(res){
        if (res.code === 200) {
          that.getBalanceList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    downloadList (id) {
      let that = this
      let params = [{
        name: 'promotionId',
        value: id
      }]
      apidr.getGenerateFile(this.common.joinSearchParam(params), function(res){
        if (res.code === 200) {
          that.downBalanceList(res.data)
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    affirmBalance (id) {
      let that = this
    	this.$confirm('确认结算后无法取消，是否确认结算?', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.updateBalanceStatus(id)
      }).catch(() => {
        //that.common.infoMessage('已取消')
      })
    },
    deleteList (id) {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delThirdBillList(id)
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    detailList (row) {
      this.$router.push({name: 'thirdPartyBillRep', query: {id: row.id, isHaveDetail: row.isHaveDetail}, params: {parentRoute:this.$route.fullPath}})
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.getBalanceList()
    this.getBrandSelect()
    this.getThirdSelect()
    this.getActivitySelect()
    Main.$off('updateList')
    Main.$on('updateList', () => {
      this.getBalanceList()
    })
  },
  filters: {
  	checkBalanceCycle (val) {
  	  let balanceStartDate = val.balanceStartDate
  	  let balanceEndDate = val.balanceEndDate
  	  balanceStartDate = balanceStartDate.split(' ')[0]
  	  balanceEndDate = balanceEndDate.split(' ')[0]
  	  return balanceStartDate + '至' + balanceEndDate
  	},
    checkHandleStatus (val) {
      return val == 0 ? '已提交' : val == 1 ? '进行中' : val === '2' ? '已完成' : '失败'
    },
    checkBalanceStatus (val) {
      return val == 0 ? '未结算' : '已结算'
    }
  }
}
</script>

<style>
</style>
