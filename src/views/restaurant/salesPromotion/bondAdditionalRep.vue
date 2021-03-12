<template>
  <div class="mainContent">
    <div class="info">
      <div class="info-item">
        <span class="info-item-name">报告生成时间</span>
        <span>{{ reportData.createTime }}</span>
      </div>
      <div class="info-item">
        <span class="info-item-name">报告生成人</span>
        <span>{{ reportData.createUser }}</span>
        <!-- <span>韩锴华</span> -->
      </div>
    </div>
      <div class="searchContent">
      	<div class="selectContent">
          <div class="selectTitle">品牌</div>
          <el-select size="small" v-model="brandId">
            <el-option value="" label="请选择"></el-option>
            <el-option v-for="item in brandSelect" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandId">
            </el-option>
          </el-select>
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
          <div class="selectTitle">活动形式</div>
          <el-select size="small" v-model="activityMode" placeholder="请选择" clearable filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in activityModeSelect" :key="item.value" :label="item.name" :value="item.value">
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
        <el-button size="small" @click="save" class="c-button c-button--primary">保存</el-button>
        <el-button size="small" class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
      </div>
      <div class="dataContent">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="contractStatus" label="活动状态"></el-table-column>
          <el-table-column prop="brandName" label="品牌" > </el-table-column>
          <el-table-column prop="activityType" label="活动类型"></el-table-column>
          <el-table-column prop="activityMode" label="活动形式" ></el-table-column>
          <el-table-column prop="activityName" label="活动名称" ></el-table-column>
          <el-table-column prop="activityMechanism" label="活动机制" ></el-table-column>
          <el-table-column prop="conventionDate" label="合同活动期间" width="180"></el-table-column>
          <el-table-column prop="guarantyAmount" label="已有保证金额" width="100"></el-table-column>
          <el-table-column prop="guarantyType" label="已有保证方式"></el-table-column>
          <el-table-column prop="addGuarantySum" label="合同中是否已有相关长假前保证金额追加条款（Y/N)" width="200"></el-table-column>
          <el-table-column prop="arAmount" label="截止目前的AR" width=""></el-table-column>
          <el-table-column prop="dayPeakAmount" label="日结算金额峰值" width="110">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.dayPeakAmount" ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="sumAdvanceDays" label="长假前保证金额追加天数" width="120">
          	<template slot-scope="scope">
              <el-input size="small" v-model="scope.row.sumAdvanceDays" maxlength="3" ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="isAddGuarantySum" label="长假保证金额是否追加（Y/N)" width="140"></el-table-column>
          <el-table-column prop="needGuarantySum" label="需追加保证金额" width="110"></el-table-column>
          <el-table-column prop="confirmGuarantySum" label="已追加金额" width="110">
            <!-- <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.confirmGuarantySum" :disabled="scope.row.id != currentId && currentId != ''" @change="(value) => tblDataChange('confirmGuarantySum',value, scope.row)"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="confirmGuarantyType" label="已追加保证方式" width="110">
            <!-- <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.confirmGuarantyType" :disabled="scope.row.id != currentId && currentId != ''" @change="(value) => tblDataChange('confirmGuarantyType',value, scope.row)"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="110">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.remark" ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="billStatus" label="长假期间的账单提供情况" width="110">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.billStatus" ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="financialManagerId" label="财务负责人" width="90"></el-table-column>
          <el-table-column prop="activityManagerId" label="活动负责人" width="90"></el-table-column>
          <el-table-column prop="updateUser" label="更新人"></el-table-column>
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
import scroll from '@/directives/index'

export default {
  name: 'bondAdditionalRep',
  data () {
    return {
      reportData: {},
      searchId: '', // router query
      brandId: '',
      activityType: '',
      activityMode: '',
      activityId: '',
      brandSelect: [],
      activityTypeSelect: [],
      activityModeSelect: [{
        name: '满减/立减',
        value: 1
      }, {
        name: '第三方积分兑换',
        value: 2
      }, {
        name: '第三方券码',
        value: 3
      }, {
        name: '百胜电子券码',
        value: 4
      }, {
        name: '第三方外卖平台',
        value: 5
      }],
      activitySelect: [],
      pageSizeList: [25, 50, 75, 100, 125],
      totalRecords: 0,
      currentPage: 1,
      pageSize: 25,
      tableData: [],
      curThirdId: '',
      currentId: '',
      amount: '',
      day: '',
      confirmGuarantySum:'',
      confirmGuarantyType:'',
      remark: '',
      billStatus: ''
    }
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      this.getCashDepositList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCashDepositList()
    },
    tblDataChange (key,value,row){
      if (value) {
    		this.currentId = row.id
    	} else{
    		this.currentId = ''
      }
      this[key] = value
    },
    amountChange (value, row) {
    	if (value) {
    		this.currentId = row.id
    	} else{
    		this.currentId = ''
    	}
      this.amount = value
    },
    dayChange (value, row) {
      if (value) {
    		this.currentId = row.id
    	} else{
    		this.currentId = ''
    	}
      this.day = value
    },
    confirmAmountChange (value, row){
      if (value) {
    		this.currentId = row.id
    	} else{
    		this.currentId = ''
    	}
      this.confirmGuarantySum = value
    },
    confirmTypeChange (value, row){
      if (value) {
    		this.currentId = row.id
    	} else{
    		this.currentId = ''
    	}
      this.confirmGuarantyType = value
    },
    search () {
      this.getCashDepositList()
    },
    resetSerchParam () {
      this.brandId = ''
      this.activityType = ''
      this.activityMode = ''
      this.activityId = ''
    },
    validAmount(){
      let _self = this;
      let valid = true;
      this.tableData.forEach(function(item,index){
        let formatAmount = item.dayPeakAmount.toString().replace(/,/g, "");
        if(isNaN(formatAmount) || formatAmount > 9999999.99){
          valid = false;
        }
      });
      return valid;
    },
    validDays(){
      let _self = this;
      let valid = true;
      this.tableData.forEach(function(item,index){
        if(!(/(^[0-9]\d*$)/.test(item.sumAdvanceDays)) || item.sumAdvanceDays > 999){
          valid = false;
        }
      });
      return valid;
    },
    save () {
      let that = this
      let isAmountValid = this.validAmount();
      let isDaysValid   = this.validDays();
      let param = [];
      if(!isAmountValid){
        this.common.warningMessage('请输入正确的日结算金额峰值(0.01-9999999.99的数字)');
        return false;
      }
      if(!isDaysValid){
        this.common.warningMessage('请输入正确的长假保证金额追加天数');
        return false;
      }
      this.tableData.forEach(function(item,index){
        param.push({
          id : item.id,
          dayPeakAmount  : Number(item.dayPeakAmount.toString().replace(/,/g, "")),
          sumAdvanceDays : Number(item.sumAdvanceDays),
          remark : item.remark,
          billStatus : item.billStatus
        })
      })
      console.log(param);
      apidr.updateCashDeposit(param,function(res){
        if (res.code === 200) {
          that.getCashDepositList()
          that.showTips('保存成功','success')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
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
      	name: 'brandId',
        value: this.brandId
      }, {
      	name: 'activityType',
        value: this.activityType
      }, {
      	name: 'activityMode',
        value: this.activityMode
      }, {
      	name: 'activityId',
        value: this.activityId
      }, {
      	name: 'uuidCode',
        value: this.reportData.uuidCode
      }]
      apidr.exoprtBalanceList(this.common.joinSearchParam(pathParams), 'application/vnd.ms-excel', function(res){
        if(res.code){
          that.common.warningMessage(res.msg)
        }else{
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '长假保证金额追加报告.xlsx'
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
      apidr.getdepositActivitySelect(function(res){
        if (res.code === 200) {
          that.activitySelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCashDepositDetail () {
      let that = this
      let params = [{
        name: 'uuidCode',
        value: this.searchId
      }]
      apidr.getCashDepositDetail(this.common.joinSearchParam(params), function(res){
        if (res.code === 200) {
          that.reportData = res.data
          that.$nextTick(function () {
            that.getCashDepositList()
          })
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCashDepositList () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'brandId',
        value: this.brandId
      }, {
      	name: 'activityType',
        value: this.activityType
      }, {
      	name: 'activityMode',
        value: this.activityMode
      }, {
      	name: 'activityId',
        value: this.activityId
      }, {
      	name: 'uuidCode',
        value: this.reportData.uuidCode
      }]
      apidr.getCashDepositList(this.common.joinSearchParam(pathParams), function(res){
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
  	this.getActivityType()
    this.getBrandSelect()
    this.getActivitySelect()
    this.searchId = this.$route.query.id
    this.getCashDepositDetail()
  },
}
</script>


<style lang="scss" scoped>
.info {
  background-color: white;
  font-size: 13px;
  padding: 15px 20px 0;
  .info-item {
    display: inline-block;
    margin-right: 40px;
    .info-item-name {
      margin-right: 10px;
    }
  }
}
</style>
