<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">起始卡号</div>
        <el-input size="small" v-model="searchData.startCardNo"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">终止卡号</div>
        <el-input size="small" v-model="searchData.endCardNo"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡种类</div>
          <el-select size="small"  v-model="searchData.productType" @change="typeChange" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in productTypeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡产品</div>
          <el-select size="small"  v-model="searchData.productCode" filterable>
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="(item, index) in productCodeSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡面额</div>
        <el-input size="small" v-model="searchData.initBalance"></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡供应商</div>
        <el-select size="small"  v-model="searchData.cardSupplier" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in cardSupplierSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <!--<div class="selectTitle">库存地</div>-->
          <!--<el-select size="small" ref="storeName" v-model="searchData.branchCode" filterable remote :remote-method="remoteStoreName" v-scroll="scrollStoreName" :loading="loadingStoreName">-->
          	<!--<el-option value="" label="请选择"></el-option>-->
            <!--<el-option v-for="item in storeSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <div class="selectContent" >
          <div class="selectTitle">库存地</div>
          <remoteSelect
                  placeholder="请选择餐厅编号"
                  :remoteFn="'getSelectSearchCondition'"
                  :optLabel="'storeName'"
                  :optValue="'storeHypId'"
                  @getChangeData="getStoreCode"
                  :type="1"
                  :customType="1"
                  ref="storeRef"
          ></remoteSelect>
        </div>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否虚拟卡</div>
          <el-select size="small"  v-model="searchData.ifVCard">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifVCardSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">卡有效期</div>
        <el-date-picker v-model="searchData.startCardDueDate" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerDueStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endCardDueDate"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerDueEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否激活</div>
          <el-select size="small"  v-model="searchData.ifActive">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifActiveSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">激活日期</div>
        <el-date-picker v-model="searchData.startActiveTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerActiveStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endActiveTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerActiveEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否作废</div>
          <el-select size="small"  v-model="searchData.ifInvalid">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifInvalidSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">作废日期</div>
        <el-date-picker v-model="searchData.startInvalidTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerInvalidStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endInvalidTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerInvalidEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否换卡</div>
          <el-select size="small"  v-model="searchData.changeFlag">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in changeFlagSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">换卡日期</div>
        <el-date-picker v-model="searchData.startChangeTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerChangeStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endChangeTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerChangeEnd"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否冻结</div>
          <el-select size="small"  v-model="searchData.ifFrozen">
          	<el-option value="" label="请选择"></el-option>
            <el-option v-for="item in ifFrozenSelect" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">冻结日期</div>
        <el-date-picker v-model="searchData.startFrozenTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerFrozenStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="searchData.endFrozenTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerFrozenEnd"></el-date-picker>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent">
      <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey">
        <template slot-scope="scope" slot="cardNo">
          <el-button size="small" type="text" @click="timeLine(scope.row.cardNo)">{{ scope.row.cardNo }}</el-button>
        </template>
      </report-table-com>
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
    <el-dialog :visible.sync="operatingRecord" width="70%" title="操作记录">
      <el-table :data="recordData" border>
        <el-table-column prop="transTime" label="交易时间"></el-table-column>
        <el-table-column prop="cardStatus" label="操作状态"></el-table-column>
        <el-table-column prop="transDept" label="交易机构"></el-table-column>
        <el-table-column prop="transAmount" label="交易费用"></el-table-column>
        <el-table-column prop="aviableAmount" label="可用余额"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import reportTableCom from './reportTableCom.vue'
import api from '@/model/api'
import scroll from '@/directives/index'
import remoteSelect from '@/components/common/remoteSelect'
export default {
  name: 'cardSearch',
  data () {
    return {
      pickerDueStart: {
        disabledDate: (time) => {
          if (this.searchData.endCardDueDate) {
          	let curDate = (new Date(this.searchData.endCardDueDate)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerDueEnd: {
        disabledDate: (time) => {
          if (this.searchData.startCardDueDate) {
          	let curDate = (new Date(this.searchData.startCardDueDate)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      pickerActiveStart: {
        disabledDate: (time) => {
          if (this.searchData.endActiveTime) {
          	let curDate = (new Date(this.searchData.endActiveTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerActiveEnd: {
        disabledDate: (time) => {
          if (this.searchData.startActiveTime) {
          	let curDate = (new Date(this.searchData.startActiveTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      pickerInvalidStart: {
        disabledDate: (time) => {
          if (this.searchData.endInvalidTime) {
          	let curDate = (new Date(this.searchData.endInvalidTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerInvalidEnd: {
        disabledDate: (time) => {
          if (this.searchData.startInvalidTime) {
          	let curDate = (new Date(this.searchData.startInvalidTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      pickerChangeStart: {
        disabledDate: (time) => {
          if (this.searchData.endChangeTime) {
          	let curDate = (new Date(this.searchData.endChangeTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerChangeEnd: {
        disabledDate: (time) => {
          if (this.searchData.startChangeTime) {
          	let curDate = (new Date(this.searchData.startChangeTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      pickerFrozenStart: {
        disabledDate: (time) => {
          if (this.searchData.endFrozenTime) {
          	let curDate = (new Date(this.searchData.endFrozenTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerFrozenEnd: {
        disabledDate: (time) => {
          if (this.searchData.startFrozenTime) {
          	let curDate = (new Date(this.searchData.startFrozenTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      searchData: {
      	startCardNo: '',
      	endCardNo: '',
      	productType: '',
      	productCode: '',
      	initBalance: '',
      	cardSupplier: '',
      	branchCode: '',
      	ifVCard: '',
        startCardDueDate: '',
        endCardDueDate: '',
        ifActive: '',
        startActiveTime: '',
        endActiveTime: '',
        ifInvalid: '',
        startInvalidTime: '',
        endInvalidTime: '',
        changeFlag: '',
        startChangeTime: '',
        endChangeTime: '',
        ifFrozen: '',
        startFrozenTime: '',
        endFrozenTime: '',
        resEntityName: '',
        activityGroup: '',
      },
      productTypeSelect: [],
      cardCode: [],
      productCodeSelect: [],
      cardSupplierSelect: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
      // storeSelect: [],
      ifVCardSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      ifActiveSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      ifInvalidSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      changeFlagSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      ifFrozenSelect: [{
        id: 'Y',
        name: '是'
      }, {
        id: 'N',
        name: '否'
      }],
      simpleTableData: [],
      simpleTableKey: [{
        name: '卡号',
        value: 'cardNo',
        special: true
      }, {
        name: '卡种类',
        value: 'productType'
      }, {
        name: '卡产品',
        value: 'productCode'
      }, {
        name: '卡面额',
        value: 'initBalance',
        classname: 'sumClass'
      }, {
        name: '卡供应商',
        value: 'cardSupplier'
      }, {
        name: '库存地',
        value: 'branchCode'
      }, {
        name: '是否虚拟卡',
        value: 'ifVCard',
        width: '90'
      }, {
        name: '是否激活',
        value: 'ifActive'
      }, {
        name: '是否冻结',
        value: 'ifFrozen'
      }, {
        name: '是否作废',
        value: 'ifInvalid'
      }, {
        name: '卡有效期',
        value: 'cardDueDate'
      }, {
        name: '卡片余额',
        value: 'cardBalance',
        classname: 'sumClass'
      }, {
        name: '卡折扣率',
        value: 'cardDiscount',
        classname: 'sumClass'
      }, {
        name: '可用余额',
        value: 'availableAmount',
        classname: 'sumClass'
      }, {
        name: '累计消费金额',
        value: 'totalTransAmount',
        width: '100',
        classname: 'sumClass'
      }, {
        name: '超有效期管理费',
        value: 'overheadExpense',
        width: '110',
        classname: 'sumClass'
      }, {
        name: '是否换卡',
        value: 'changeFlag'
      }, {
        name: '换卡手续费',
        value: 'changeServiceCharge',
        width: '90',
        classname: 'sumClass'
      }, {
        name: '换卡工本费',
        value: 'changeIssueFee',
        width: '90',
        classname: 'sumClass'
      }, {
        name: '换卡快递费',
        value: 'changeExpressFee',
        width: '90',
        classname: 'sumClass'
      }, {
        name: '老卡卡号',
        value: 'oriCardNo'
      }],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      loadingStoreName: false,
      selectIndex:1,
      StoreNameSize:10,
      query: '',
      // cardSearchData: {},
      operatingRecord: false,
      recordData: []
    }
  },
  components: {
    reportTableCom,
    remoteSelect
  },
  directives: { scroll },
  methods: {
  	remoteStoreName(query){
  	  this.selectIndex = 1
      this.loadingStoreName = true
      if (query !== '' && query !== '请选择') {
        this.query = query
      } else {
        this.query = ''
      }
      this.getAllInventory()
    },
    scrollStoreName(param){
      if(param){
        this.selectIndex += 1
        this.getAllInventory()
      }
    },
  	typeChange (val) {
      this.productCodeSelect = this.cardCode[val]
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getCardSearch()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCardSearch()
    },
    searchList () {
      // this.cardSearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getCardSearch()
    },
    reset () {
  	    this.$refs.storeRef.reset();
      for (let key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    exportFile () {
      let that = this
      api.exportCardSearch(this.searchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '卡片查询报表.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    timeLine (cardNo) {
      let that = this
      this.recordData = []
      let pathParams = [{
      	name: 'cardNo',
        value: cardNo
      }]
      api.getCardStatus(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.recordData = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
      this.operatingRecord = true
    },
    getCardTypes () {
      let that = this
      api.getCardTypes(function(res){
        if (res.code === 200) {
          that.productTypeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getCardCode () {
      let that = this
      api.getCardCode(function(res){
        if (res.code === 200) {
          that.cardCode = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    // getStoreName () {
    //   let that = this
    //   api.getSelectSearchCondition({pageIndex:1,pageSize:10}, function(res){
    //     if (res.code === 200) {
    //       that.storeSelect = res.data
    //     } else if (res.code != 404) {
    //       that.showTips(res.msg,'warning')
    //     }
    //   })
    // },
    // getAllInventory () {
    //   let that = this
    //   let pathParams = [{
    //   	name: 'pageSize',
    //     value: this.selectIndex
    //   }, {
    //   	name: 'branchCode',
    //     value: this.query
    //   }]
    //   api.getAllInventory(this.common.joinSearchParam(pathParams),function(res){
    //     that.loadingStoreName = false
    //     if (res.code === 200) {
    //       that.storeSelect = res.data
    //     } else if (res.code != 404) {
    //       that.showTips(res.msg,'warning')
    //     }
    //   })
    // },
    getCardSearch () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'startCardNo',
        value: this.searchData.startCardNo
      }, {
      	name: 'endCardNo',
        value: this.searchData.endCardNo
      }, {
      	name: 'productType',
        value: this.searchData.productType
      }, {
      	name: 'productCode',
        value: this.searchData.productCode
      }, {
      	name: 'initBalance',
        value: this.searchData.initBalance
      }, {
      	name: 'cardSupplier',
        value: this.searchData.cardSupplier
      }, {
      	name: 'branchCode',
        value: this.searchData.branchCode
      }, {
      	name: 'ifVCard',
        value: this.searchData.ifVCard
      }, {
      	name: 'startCardDueDate',
        value: this.searchData.startCardDueDate
      }, {
      	name: 'endCardDueDate',
        value: this.searchData.endCardDueDate
      }, {
      	name: 'ifInvalid',
        value: this.searchData.ifInvalid
      }, {
      	name: 'startInvalidTime',
        value: this.searchData.startInvalidTime
      }, {
      	name: 'endInvalidTime',
        value: this.searchData.endInvalidTime
      }, {
      	name: 'ifActive',
        value: this.searchData.ifActive
      }, {
      	name: 'startActiveTime',
        value: this.searchData.startActiveTime
      }, {
      	name: 'endActiveTime',
        value: this.searchData.endActiveTime
      }, {
      	name: 'changeFlag',
        value: this.searchData.changeFlag
      }, {
      	name: 'startChangeTime',
        value: this.searchData.startChangeTime
      }, {
      	name: 'endChangeTime',
        value: this.searchData.endChangeTime
      }, {
      	name: 'ifFrozen',
        value: this.searchData.ifFrozen
      }, {
      	name: 'startFrozenTime',
        value: this.searchData.startFrozenTime
      }, {
      	name: 'endFrozenTime',
        value: this.searchData.endFrozenTime
      }]
      api.getCardSearch(this.common.joinSearchParam(pathParams), function(res){
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
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    },
    getStoreCode(res){
      this.searchData.branchCode = res;
    }
  },
  beforeMount () {
    this.getCardTypes()
    this.getCardCode()
    // this.getAllInventory()
  }
}
</script>

<style>
</style>
