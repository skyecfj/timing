<template>
  <div class="coupon-account">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">报告日期</div>
        <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
        </el-date-picker>
        <!-- <el-date-picker v-model="balanceStartDate" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="balanceEndDate"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker> -->
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
          <el-select size="small"  v-model="brandId" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in brandSelect" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">第三方</div>
          <el-select size="small"  v-model="thirdId" @change="thirdChange" remote :remote-method="remoteMethod" v-scroll="scrollLoading" :loading="loading" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in thirdSelect" :key="item.thirdId" :label="item.thirdName" :value="item.thirdId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动名称</div>
          <el-select size="small"  v-model="activityId" @change="activeChange" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in activeSelect" :key="item.activityId" :label="item.activityName" :value="item.activityId">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">餐厅类型</div>
          <el-select size="small"  v-model="storeType">
          	<el-option value="ALL" label="请选择"></el-option>
            <el-option v-for="item in restaurantTypeSelect" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">报告状态</div>
          <el-select size="small"  v-model="confirmStatus">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in reportSelect" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchData">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="handleReport">手动生成报告</el-button>
    </div>
    <div class="dataContent" >
      <el-table :data="shouldDatas" style="width: 100%" border>
        <el-table-column prop="activityName" label="活动名称"></el-table-column>
        <el-table-column prop="brandName" label="品牌" ></el-table-column>
        <el-table-column prop="thirdName" label="第三方"></el-table-column>
        <el-table-column prop="balanceCycle" label="开票期间" width="170px">
          <template slot-scope="scope">
            <span>{{ scope.row | checkBalanceCycle }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeType" label="餐厅类型" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.storeType | checkRestaurantType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dcdmCode" label="DCDM编号" width="150px"></el-table-column>
        <el-table-column prop="balanceAmount" label="开票总额（单位：元）" width="150px"></el-table-column>
        <el-table-column prop="handleStatus" label="执行情况" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.handleStatus | checkActiveStats }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="confirmStatus" label="报告状态" width="85px">
          <template slot-scope="scope">
            <span>{{ scope.row.confirmStatus | checkReportStats }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175">
          <template slot-scope="scope">
          	<el-tooltip content="下载" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="downloadList(scope.row.filePath)" :disabled="scope.row.handleStatus != 2"><i class="fa fa-download"></i></el-button>
            </el-tooltip>
          	<el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="deleteList(scope.row.id)"
                        :disabled="scope.row.confirmStatus !== '0'"><i class="fa fa-trash-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="detailList(scope.row.id,scope.row.storeType)" :disabled="scope.row.handleStatus != 2"><i class="fa fa-file-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip content="发送开票报告" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="sendEmail(scope.row)" ><i class="fa fa-envelope"></i></el-button>
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
      :storeTypeNotLimit="true"
      :isShow="isShow"
      :type="type"
      :storeTypeParam="storeTypeParam"
      @submitForm="submits"
      @close="close"></handle-rep-com>
    <send-email-com :isShow="isSendEmailShow" :sendEmailForm="sendEmailForm" :notNeedPassword="notNeedPassword" @close="isSendEmailShow = false"></send-email-com>
  </div>
</template>

<script>
import api from '@/model/api'
import Main from '@/main'
import apidr from '@/model/apidr'
import handleRepCom from '../handleRepCom'
import sendEmailCom from '../sendEmailCom.vue'
import scroll from '@/directives/index'

export default {
  name: 'shouldInvoiceAccount',
  watch:{
    balanceStartDateVal(val,oldVal){
        this.onRangeDatePick = Object.assign({},{
            onPick:(dateRange)=>{
              this.balanceStartDateVal =  new Date(dateRange.minDate).getTime();
              this.balanceEndDateVal =  new Date(dateRange.maxDate).getTime();
            },
            disabledDate: (time) => {
              if(val){
                return time.getTime() <= this.balanceStartDateVal-180*24*60*60*1000 || time.getTime() >= this.balanceStartDateVal + 180*24*60*60*1000
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
          this.balanceStartDateVal =  new Date(dateRange.minDate).getTime();
          this.balanceEndDateVal =  new Date(dateRange.maxDate).getTime();
        }
      },
      rangeDate: [],
      balanceStartDateVal: '',
      balanceEndDateVal: '',
      balanceStartDate: '',
      balanceEndDate: '',
      brandId: '',
      brandSelect: [],
      storeType: 'ALL',
      restaurantTypeSelect: [{
        name: '加盟',
        value: 'FR'
      }, {
        name: '直营',
        value: '!FR'
      }],
      thirdId: '',
      thirdSelect: [],
      activityId: '',
      activeSelect: [],
      confirmStatus: 0,
      reportSelect: [{
        id: 0,
        value: '未处理'
      }, {
        id: 1,
        value: '待开票'
      }, {
        id: 2,
        value: '已开票'
      }, {
        id: 3,
        value: '已完成'
      }],
      shouldDatas: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      activityNameOption: [],
      thirdNameOption: [],
      isShow: false,
      type: '2',
      storeTypeParam: '1',
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId: '',
      isSendEmailShow: false,
      sendEmailForm: {
        receiveUserMail: '',
        ccUserMail: '',
        financialManagerUser: '',
        activityManagerUser: '',
        emailTitle: '',
        emailContext: '',
        emailAttachmentDTOList: [],
      },
      notNeedPassword: false
    }
  },
  components: {
    handleRepCom,
    sendEmailCom
  },
  directives: {
    scroll
  },
  methods: {
    rangeDateChange(){
      if(this.rangeDate){
        this.balanceStartDate = this.rangeDate[0];
        this.balanceEndDate = this.rangeDate[1];
      }else{
        this.balanceStartDate = '';
        this.balanceEndDate = '';
        this.balanceStartDateVal = '';
        this.balanceEndDateVal = '';
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
      this.brandId = ''
  	  this.getThirdSelect()
      this.getBrandSelect(val)
  	},
  	thirdChange (val) {
  	  this.curThirdId = val
  	  this.getActivitySelect()
  	},
    handleSizeChange (val) {
      this.pageSize = val
      this.getInvoiceList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getInvoiceList()
    },
    searchData () {
    	this.getInvoiceList()
    },
    reset () {
      this.balanceStartDate = ''
      this.balanceEndDate = ''
      this.brandId = ''
      this.storeType = 'ALL'
      this.thirdId = ''
      this.activityId = ''
      this.confirmStatus = ''
      this.rangeDate = []
      this.balanceStartDateVal = '';
      this.balanceEndDateVal = '';
    },
    handleReport () {
      this.isShow = true
    },
    downloadList (filePath) {
      this.downBalanceList (filePath)
    },
    deleteList (id) {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delInvoiceList(id)
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    detailList (id, type) {
      this.$router.push({name: 'shouldInvoiceRep', query: {id: id, storeType: type}, params: {parentRoute:this.$route.fullPath}})
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
        name: 'storeType',
        value: formData.storeType
      }]
      apidr.handleInvoiceReport(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
        	that.isShow = false
          that.showTips('手动生成报告成功', 'success')
          that.getInvoiceList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    sendEmail (rowObj) {
      this.isSendEmailShow = true
      this.getInvoiceMailDetail(rowObj.id)
    },
    getInvoiceMailDetail (id) {
      let that = this
      let pathParams = [{
        name: 'id',
        value: id
      }]
      apidr.getInvoiceMailDetail(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.sendEmailForm = res.data
          that.notNeedPassword = !res.data.needPassword
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    close () {
      this.isShow = false
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
    getInvoiceList () {
      let that = this
      let pathParams = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
        name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'balanceStartDate',
        value: this.balanceStartDate
      }, {
      	name: 'balanceEndDate',
        value: this.balanceEndDate
      }, {
      	name: 'brandId',
        value: this.brandId
      }, {
      	name: 'thirdId',
        value: this.thirdId
      }, {
      	name: 'activityId',
        value: this.activityId
      }, {
        name: 'storeType',
        value: this.storeType
      }, {
        name: 'confirmStatus',
        value: this.confirmStatus
      }]
      apidr.getInvoiceList(this.common.joinSearchParam(pathParams), function(res){
      	that.shouldDatas = []
      	that.totalRecords = 0
        if (res.code === 200) {
          that.shouldDatas = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    downBalanceList (filePath) {
      let that = this
      this.common.checkFilePath(filePath).forEach(function(value, index) {
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
    delInvoiceList (id) {
      let that = this
      let param = [{
        name: 'id',
        value: id
      }]
      apidr.delInvoiceList(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.showTips('删除成功','success')
          that.getInvoiceList()
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
  },
  beforeMount () {
  	this.getInvoiceList()
    this.getBrandSelect()
    this.getThirdSelect()
    this.getActivitySelect()
    Main.$off('updateList')
    Main.$on('updateList', () => {
      this.getInvoiceList()
    })
  },
  filters: {
  	checkBalanceCycle (val) {
  		if (!val.balanceStartDate) return ''
  	  let balanceStartDate = val.balanceStartDate
  	  let balanceEndDate = val.balanceEndDate
  	  balanceStartDate = balanceStartDate.split(' ')[0]
  	  balanceEndDate = balanceEndDate.split(' ')[0]
  	  return balanceStartDate + '至' + balanceEndDate
  	},
    checkReportStats: function (value) {
      if (!value) return ''
      if (value == 0) {
        return '未处理'
      } else if (value == 1) {
        return '待开票'
      } else if (value == 2) {
        return '已开票'
      } else {
        return '已完成'
      }
    },
    checkRestaurantType: function (val) {
      if (!val) return ''
      return val === 'FR' ? '加盟' : '直营'
    },
    checkActiveStats: function (val) {
      if (!val) return ''
      if (val == 0) {
        return '已提交'
      } else if (val == 1) {
        return '进行中'
      } else if (val == 2) {
        return '已完成'
      } else {
        return '失败'
      }
    }
  }
}
</script>

<style scoped>

</style>
