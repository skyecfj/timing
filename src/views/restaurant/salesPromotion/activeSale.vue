<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">交易日期</div>
        <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
        </el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动类型</div>
        <el-select size="small" v-model="activityType">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in activityTypeSelect" :key="item.activityTypeId" :label="item.activityTypeName" :value="item.activityTypeId">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动名称</div>
        <el-select size="small" v-model="activityId" @change="activeChange" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in activitySelect" :key="item.activityId" :label="item.activityName" :value="item.activityId">
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
      <el-button size="small" type="success"  @click="searchData">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" @click="handleReport" class="c-button c-button--primary">手动生成报告</el-button>
    </div>
    <div class="dataContent" >
      <el-table :data="tableData" style="width: 100%" border>
      	<el-table-column prop="activityName" label="活动名称" ></el-table-column>
        <el-table-column label="交易日期" >
          <template slot-scope="scope" >
            <span>{{scope.row.tradeStartTime}}</span> 至 <span>{{scope.row.tradeEndTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="thirdName" label="第三方" ></el-table-column>
        <el-table-column prop="activityTypeName" label="活动类型" ></el-table-column>
        <el-table-column prop="statisticTypeName" label="法人公司/开票单位" ></el-table-column>
        <el-table-column prop="orderAmount" label="交易金额" ></el-table-column>
        <!-- <el-table-column label="操作状态" >
          <template slot-scope="scope">
            <span>{{handleStatusMap[scope.row.handleStatus]}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip" key="viewDetailBtnContent">
              <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"
                          @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip content="下载" placement="top" effect="light" popper-class="table-cell-toolTip" key="downloadBtnContent">
              <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"
                          @click="exportReport(scope.row)"><i class="fa fa-download c-button-icon--left"></i></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip" key="deleteBtnContent">
              <el-button  size="small" class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteData(scope.row)" key="deleteBtn" >
                  <i  class="fa fa-trash-alt"></i>
              </el-button>
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
      :type='type'
      :source="source"
      @submitForm="submits"
      @close="close"
      :activtyTypeOption="activityTypeOption"
      :companyCodeOption="companyCodeOption"
      :billingUnitCodeOption="billingUnitCodeOption"></handle-rep-com>
  </div>
</template>

<script>
import apidr from '@/model/apidr'
import handleRepCom from './handleRepCom'
import scroll from '@/directives/index'

export default {
  name: 'activeSale',
  watch:{
    tradeStartTimeVal(val,oldVal){
        this.onRangeDatePick = Object.assign({},{
            onPick:(dateRange)=>{
              this.tradeStartTimeVal =  new Date(dateRange.minDate).getTime();
              this.tradeEndTimeVal =  new Date(dateRange.maxDate).getTime();
            },
            disabledDate: (time) => {
              if(val){
                return time.getTime() <= this.tradeStartTimeVal-365*24*60*60*1000 || time.getTime() >= this.tradeStartTimeVal + 365*24*60*60*1000
              }else{
                return false;
              }
            }
      });
    }
  },
  data () {
    return {
      source: 'activeSale',
      handleStatusMap:['已提交','进行中','已完成','执行失败'],
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
      companyCode: '',
      billingUnitCode: '',
      thirdId: '',
      thirdSelect: [],
      activityId: '',
      activitySelect: [],
      activityType: '',
      activityTypeSelect: [],
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      handleRepDialog: false,
      handleRepForm: {
        tradeStartTime: '',
        tradeEndTime: '',
        companyCode: '',
        billingUnitCode: '',
        activityType: '',
        thirdId: '',
        activityId: ''
      },
      rules: {
        tradeStartTime: [{ required: true, message: '请选择交易开始日期', trigger: 'change' }],
        tradeEndTime: [{ required: true, message: '请选择交易结束日期', trigger: 'change' }],
        activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        thirdId: [{ required: true, message: '请选择第三方名称', trigger: 'change' }],
        activityId: [{ required: true, message: '请选择活动名称', trigger: 'change' }],
      },
      companyCodeOption: [],
      billingUnitCodeOption: [],
      activityOption: [],
      thirdNameOption: [],
      activityTypeOption: [],
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId: '',
      isShow: false,
      type: '0',
      disabled: true,
    }
  },
  directives: {
    scroll
  },
  components: {
    handleRepCom
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
  	  this.curActiveId = val
  	  this.getThirdSelect()
  	},
  	thirdChange (val) {
  	  this.curThirdId = val
  	  this.getActivitySelect()
  	},
  	handleSizeChange (val) {
      this.pageSize = val
      this.getSaleList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSaleList()
    },
    searchData () {
      this.currentPage = 1;
      this.getSaleList()
      // if (!this.tradeStartTime || !this.tradeEndTime) {
      //   this.showTips('请选择交易日期','warning')
      // } else if (!this.activityId) {
      //   this.showTips('请选择活动名称','warning')
      // } else {
      //   this.getSaleList()
      // }
    },
    reset () {
      this.tradeStartTime = ''
      this.tradeEndTime = ''
      this.activityType = ''
      this.thirdId = ''
      this.activityId = ''
      this.rangeDate = []
      this.tradeStartTimeVal = '';
      this.tradeEndTimeVal = '';
    },
    handleReport () {
      this.isShow = true
    },
    exportReport (rowObject) {
      let that = this
      let filePath = rowObject.filePath
      let nameArr = filePath.split('/')
      let name = nameArr[nameArr.length - 1]
      nameArr.splice(nameArr.length - 1, 1)
      let path = nameArr.join('/')
      let fileInfo = {
        fileName: name,
        filePath: path
      }
      apidr.downBalanceList(fileInfo, 'application/vnd.ms-excel', function(res){
        if(res.code){
          that.common.warningMessage(res.msg)
        }else{
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = fileInfo.fileName
          link.target = '_blank';link.click()
        }
      })
    },
    deleteData (rowObject) {
      let _self = this;
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = this.common.formatPathParam({
          id : rowObject.id
        });
        apidr.deleteSaleData(param,function(result){
          if(result.code == 200){
            _self.common.messageUtil({
              message: result.data,
              type: 'success'
            });
            _self.searchData()
          }else{
            _self.common.messageUtil({
              message: result.msg,
              type: 'warning'
            });
          }
        })
      }).catch(() => {

      });
    },
    submits (formData) {
      let that = this
      let param = [{
        name: 'activityId',
        value: formData.activityId
      }, {
        name: 'thirdId',
        value: formData.thirdId
      }, {
        name: 'tradeStartTime',
        value: formData.tradeStartTime
      }, {
        name: 'tradeEndTime',
        value: formData.tradeEndTime
      },{
        name: 'statisticType',
        value: formData.statisticType
      }]
      apidr.handleSaleReport(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
        	that.isShow = false
          that.showTips('手动生成报告成功', 'success')
          that.getSaleList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    close () {
      this.isShow = false
    },
    checkDetail(rowObject) {
      sessionStorage.setItem('pageInfo',JSON.stringify({
        id : rowObject.id
      }));
      this.$router.push({
        name: 'activeSaleDetail',
        query: {
          id : rowObject.id,
          statisticTypeName : rowObject.statisticTypeName
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
          that.activitySelect = res.data
          that.activityOption = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getActivityType () {
      let that = this
      apidr.getActivityType(function(res){
        if (res.code === 200) {
          that.activityTypeSelect = res.data
          that.activityTypeOption = res.data
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
          if (that.handleRepDialog) {
            that.thirdNameOption = res.data
          } else{
          	that.thirdSelect = res.data
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getSaleList () {
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
      	name: 'activityType',
        value: this.activityType
      }, {
        name: 'thirdId',
        value: this.thirdId
      }, {
        name: 'activityId',
        value: this.activityId
      }]
      apidr.getSaleList(this.common.joinSearchParam(pathParams), function(res){
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
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
  	this.getActivityType()
    this.getActivitySelect()
    this.getThirdSelect()
  },
}
</script>

<style>
</style>
