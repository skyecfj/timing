<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">日期</div>
        <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
        </el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
        <el-select size="small" v-model="brandId" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in brandSelect" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandEnglishName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动类型</div>
        <el-select size="small" v-model="activityType">
          <el-option  value="" label="请选择"></el-option>
          <el-option  v-for="item in activityTypeSelect" :key="item.activityTypeId" v-if="item.activityTypeName != '房东代收'"
                      :label="item.activityTypeName" :value="item.activityTypeName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动名称</div>
        <el-select size="small" v-model="activityId" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in activitySelect" :key="item.activityId" :label="item.activityName" :value="item.activityId">
          </el-option>
        </el-select>
      </div>
      <el-button size="small" @click="search" class="c-button c-button--primary">查询</el-button>
      <el-button size="small" @click="resetSerchParam" class="c-button c-button--plain">重置</el-button>
      <el-button size="small" class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column prop="activityType" label="活动类型"></el-table-column>
        <el-table-column prop="activityName" label="活动名称"></el-table-column>
        <el-table-column prop="thirdName" label="第三方名称" width="100"></el-table-column>
        <el-table-column prop="activityMode" label="活动形式"></el-table-column>
        <el-table-column prop="conventionDate" label="活动合同期间" width="100"></el-table-column>
        <el-table-column prop="guarantyType" label="保证方式"></el-table-column>
        <el-table-column prop="guarantySum" label="保证金额"></el-table-column>
        <el-table-column prop="dueDate" label="到期日"></el-table-column>
        <el-table-column prop="expirationReminder" label="提前多久提醒" width="100"></el-table-column>
        <el-table-column prop="expirationDate" label="提醒时间"></el-table-column>
        <el-table-column prop="financialManager" label="财务负责人" width="90"></el-table-column>
        <el-table-column prop="activityManager" label="活动负责人" width="90"></el-table-column>
        <el-table-column prop="creditManager" label="信用控制负责人" width="110"></el-table-column>
        <el-table-column prop="thirdManager" label="第三方活动负责人" width="120"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizeList" :total="totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import apidr from '@/model/apidr'

export default {
  name: 'amountWarning',
  watch:{
    startTimeVal(val,oldVal){
      this.onRangeDatePick = Object.assign({},{
        onPick:(dateRange)=>{
          this.startTimeVal =  new Date(dateRange.minDate).getTime();
          this.endTimeVal =  new Date(dateRange.maxDate).getTime();
        },
        disabledDate: (time) => {
          if(val){
            return time.getTime() <= this.startTimeVal-62*24*60*60*1000 || time.getTime() >= this.startTimeVal + 62*24*60*60*1000
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
      startTime: '',
      endTime: '',
      brandId:'',
      activityType:'',
      activityId:'',
      brandSelect: [],
      activityTypeSelect:[],
      activitySelect: [],
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      totalRecords: 0,
      currentPage: 1,
      pageSize: 25,
      searchData: {}
    }
  },
  methods: {
    rangeDateChange(){
      if(this.rangeDate){
        this.startTime = this.rangeDate[0];
        this.endTime = this.rangeDate[1];
      }else{
        this.startTime = '';
        this.endTime = '';
        this.startTimeVal = '';
        this.endTimeVal = '';
      }
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
    getActivityType () {
      let that = this
      apidr.getActivityType(function(res){
        if (res.code === 200) {
          that.activityTypeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getActivitySelect () {
      let that = this
      apidr.getActivitySelect('', function(res){
        if (res.code === 200) {
          that.activitySelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getEffectiveWarning()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getEffectiveWarning()
    },
    search () {
      this.searchData = {
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.getEffectiveWarning()
    },
    resetSerchParam () {
      this.startTime = ''
      this.endTime = ''
      this.rangeDate = []
      this.brandId = ''
      this.activityType = ''
      this.activityId = ''
      this.startTimeVal = '';
      this.endTimeVal = '';
    },
    exportReport () {
      let that = this
      let pathParams = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
        name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'startTime',
        value: this.startTime
      }, {
        name: 'endTime',
        value: this.endTime
      },{
        name: 'brandId',
        value: this.brandId
      },{
        name: 'activityType',
        value: this.activityType
      },{
        name: 'activityId',
        value: this.activityId
      }]
      apidr.exportEffectiveWarning(this.common.joinSearchParam(pathParams), 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '活动预警报告-效期预警.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    getEffectiveWarning () {
      let that = this
      let pathParams = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
        name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'startTime',
        value: this.startTime
      }, {
        name: 'endTime',
        value: this.endTime
      },{
        name: 'brandId',
        value: this.brandId
      },{
        name: 'activityType',
        value: this.activityType
      },{
        name: 'activityId',
        value: this.activityId
      }]
      apidr.getEffectiveWarning(this.common.joinSearchParam(pathParams), function(res){
        that.tableData = []
     	that.totalRecords = 0
        if (res.code === 200) {
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
    this.getEffectiveWarning()
    this.getActivityType()
    this.getBrandSelect()
    this.getActivitySelect()
  }
}
</script>

<style>
</style>
