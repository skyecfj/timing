<template>
  <div class="mainContent">
    <div class="cbTabs">
      <div class="searchContent">
        <div class="selectContent">
          <div class="selectTitle">年度</div>
          <el-select size="small" v-model="year" filterable @change="yearChange" >
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,index) in yearOpts" :key="item.yearId + '_' +index" :label="item.year" :value="item.yearId">
            </el-option>
          </el-select>
        </div>
        <div class="selectContent">
          <div class="selectTitle">节假日</div>
          <el-select size="small" v-model="holidayName" filterable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,index) in yearHolidayOpts" :key="item.holidayId + '_' +index" :label="item.holidayName" :value="item.holidayId">
            </el-option>
          </el-select>
        </div>
        <!-- <div class="selectContent">
          <div class="selectTitle">提交报告日期</div>
          <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                          end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
          </el-date-picker>
        </div> -->
        <!-- <div class="selectContent">
          <div class="selectTitle">活动名称</div>
          <el-select size="small" v-model="activityId" multiple filterable>
            <el-option v-for="item in activitySelect" :key="item.activityId" :label="item.activityName" :value="item.activityId">
            </el-option>
          </el-select>
        </div>
        <div class="selectContent">
          <div class="selectTitle">报告生成方式</div>
          <el-select size="small" v-model="createUserId" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in userNameOptions" :key="item.id" :label="item.instruction" :value="item.code">
            </el-option>
          </el-select>
        </div> -->
        <el-button size="small" @click="search" class="c-button c-button--primary">查询</el-button>
        <el-button size="small" @click="resetSerchParam" class="c-button c-button--plain">重置</el-button>
        <el-button size="small" @click="handleBondReport" class="c-button c-button--primary">手动生成报告</el-button>
      </div>
      <div class="dataContent">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="createTime" label="提交报告时间"></el-table-column>
          <el-table-column prop="year" label="报告生年度"></el-table-column>
          <el-table-column prop="holidayName" label="节假日"></el-table-column>
          <!-- <el-table-column prop="activityType" label="活动类型"></el-table-column>
          <el-table-column prop="brandName" label="品牌"></el-table-column> -->
          <!-- <el-table-column prop="activityName" label="活动名称">
            <template slot-scope="scope">
              <span>{{ scope.row.activityName | checkActivityName }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="createUser" label="报告生成人"></el-table-column>
          <el-table-column label="操作" width=150px>
            <template slot-scope="scope">
              <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
              </el-tooltip>
              <el-tooltip content="下载" placement="top" effect="light" popper-class="table-cell-toolTip">
                <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDownload(scope.row)"><i class="fa fa-download"></i></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip" key="deleteBtnContent" >
                  <el-button  size="small" class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row)" key="deleteBtn" >
                      <i  class="fa fa-trash-alt"></i>
                  </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizeList" :total="totalRecords">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apidr from '@/model/apidr'

export default {
  name: 'bondAdditional',
  watch:{
    startTimeVal(val,oldVal){
        this.onRangeDatePick = Object.assign({},{
            onPick:(dateRange)=>{
              this.startTimeVal =  new Date(dateRange.minDate).getTime();
              this.eEndTimeVal =  new Date(dateRange.maxDate).getTime();
            },
            disabledDate: (time) => {
              if(val){
                return time.getTime() <= this.startTimeVal-31*24*60*60*1000 || time.getTime() >= this.startTimeVal + 31*24*60*60*1000
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
      startDate: '', // search data
      endDate: '',
      activityId: '',
      createUserId: '',
      year:null,
      yearOpts: [],
      yearHolidayOpts: [],
      holidayName: null,
      activitySelect: [],
      userNameOptions: [{
        id: '0',
        instruction: '系统'
      }, {
      	id: '1',
        instruction: '手动'
      }],
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      totalRecords: 0,
      currentPage: 1,
      pageSize: 25
    }
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
  	handleSizeChange (val) {
      this.pageSize = val
      this.getCashDeposit()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCashDeposit()
    },
    search () {
      this.getCashDeposit()
    },
    resetSerchParam () {
      this.activityId = ''
      this.userName = ''
      this.year = null
      this.holidayName = null
      this.yearHolidayOpts = []
      this.startDate = ''
      this.endDate = ''
      this.rangeDate = []
    },
    yearChange(){
      let _self = this;
      if(!this.year){
        this.yearHolidayOpts = [];
        return false;
      }
      let param = this.common.formatPathParam({
        year : this.year
      });
      apidr.getCashHoliday(param,(res) => {
        _self.yearHolidayOpts = res.data.concat();
      })
    },
    checkDetail (rowObject) {
      this.$router.push({name: 'bondAdditionalRep', query: { id: rowObject.uuidCode }, params: {parentRoute: this.$route.fullPath}})
    },
    checkDownload (rowObject) {
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
    deleteRow (rowObject) {
      let _self = this;
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = _self.common.formatPathParam({
          uuidCode : rowObject.uuidCode
        })
        apidr.deleteBondAdditionalRep(param, function (res) {
          if (res.code === 200) {
            _self.common.messageUtil({
              type: 'success',
              message: res.data
            });
            _self.getCashDeposit()
          } else {
              _self.common.messageUtil({
                type: 'warning',
                message: res.msg
              });
          }
        })
      }).catch(() => {});
    },
    getCashDeposit () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      },{
        name: 'year',
        value: this.year
      },{
        name: 'holidayName',
        value: this.holidayName
      }]
      apidr.getCashDeposit(this.common.joinSearchParam(pathParams), function(res){
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
    handleBondReport () {
      let that = this
      if(!this.year){
        this.common.warningMessage('请选择生成年度');
        return false;
      }
      if(!this.holidayName){
        this.common.warningMessage('请选择节假日');
        return false
      }
      let param = this.common.formatPathParam({
        year : this.year,
        holidayName : this.holidayName
      })
      apidr.handleBondReport(param,function(res){
        if (res.code === 200) {
          that.getCashDeposit()
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
    apidr.getCashHolidayYear((res) => { this.yearOpts = res.data.concat() })
    this.getCashDeposit()
  },
  filters: {
    checkActivityName (val) {
      let activityArr = val.split('、')
      let arr = activityArr.slice(0, 3)
      return arr.join('、') + '等'
    }
  }
}
</script>


<style>
</style>
