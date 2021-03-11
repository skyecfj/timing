<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" v-if="activeName === 'restaurantSearch'">
        <div class="selectTitle">品牌</div>
        <el-select size="small"  v-model="resBrand" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in brandSelect" :key="item.brandEnglishName" :label="item.brandEnglishName" :value="item.brandEnglishName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="activeName === 'restaurantSearch'">
        <div class="selectTitle">卡供应商</div>
        <el-select size="small"  v-model="cardSupplier">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in cardSupplierSelect" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="activeName === 'restaurantSearch'">
        <div class="selectTitle">餐厅</div>
        <el-select size="small"  v-model="resCode" ref="storeName" filterable remote :remote-method="remoteStoreName" v-scroll="scrollStoreName" :loading="loading">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in resCodeSelect" :key="item.storeHypId" :label="item.storeName" :value="item.storeHypId">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="activeName === 'restaurantSearch'">
        <div class="selectTitle">城市</div>
        <el-input size="small" v-model="city" placeholder="请输入"></el-input>
      </div>
      <div class="selectContent" v-if="activeName === 'restaurantSearch'">
        <div class="selectTitle">营运市场</div>
        <el-select size="small"  v-model="oprMarket" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in oprMarketSelect" :key="item.id" :label="item.marketNumber" :value="item.marketNumber">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="activeName === 'restaurantSearch'">
        <div class="selectTitle">财务市场</div>
        <el-select size="small"  v-model="finMarket" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in finMarketSelect" :key="item.id" :label="item.marketNumber" :value="item.marketNumber">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="activeName === 'restaurantSearch'">
        <div class="selectTitle">法人公司</div>
        <el-select size="small"  v-model="company" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in companySelect" :key="item.jdeCode" :label="item.companyName" :value="item.jdeCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="activeName === 'restaurantSearch'">
        <div class="selectTitle">分配状态</div>
        <el-select size="small"  v-model="ifDistributed">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in ifDistributedSelect" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="activeName === 'pushTimeSearch'">
        <div class="selectTitle">推送日期</div>
        <el-date-picker v-model="startPushTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerPushStart"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="endPushTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerPushEnd"></el-date-picker>
      </div>
      <el-button size="small" type="success" @click="search">查询</el-button>
      <el-button size="small" type="success" @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success" @click="batchModifier" v-show="activeName === 'restaurantSearch'" :disabled="batchShow">批量修改</el-button>
      <el-button size="small" type="success" @click="exportFile" v-show="activeName === 'restaurantSearch'"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
    </div>
    <div class="dataContent" >
      <div class="tab-content" >
        <el-tabs v-model="activeName" @tab-click="handleSwitch">
          <el-tab-pane label="餐厅查询" name="restaurantSearch">
            <el-table :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="platformCode" label="分配卡供应商" width="100"> </el-table-column>
              <el-table-column prop="resCode" label="餐厅编号" width="100"></el-table-column>
              <el-table-column prop="resName" label="餐厅名称" width="120"></el-table-column>
              <el-table-column prop="address" label="地址" width="380"></el-table-column>
              <el-table-column prop="contactNumber" label="电话" width="130"> </el-table-column>
              <el-table-column prop="resBrand" label="品牌" ></el-table-column>
              <el-table-column prop="oprMarket" label="营运市场" width="150"></el-table-column>
              <el-table-column prop="finMarket" label="财务市场" width="150"></el-table-column>
              <el-table-column prop="city" label="城市" ></el-table-column>
              <el-table-column prop="province" label="省份"></el-table-column>
              <el-table-column prop="company" label="法人公司"  width="120"></el-table-column>
              <el-table-column label="操作" width='140' fixed="right">
                <template slot-scope="scope">
                  <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                    <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row, '1')"><i class="fa fa-file-alt"></i></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                    <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row, '2')"><i class="fa fa-edit"></i></el-button>
                  </el-tooltip>
                  <el-tooltip content="重推卡平台" placement="top" effect="light" popper-class="table-cell-toolTip">
                    <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="restart(scope.row.resJdeCode)"><i class="fa fa-history"></i></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="按推送时间查询" name="pushTimeSearch">
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="resCode" label="餐厅编号"></el-table-column>
              <el-table-column prop="resName" label="餐厅名称"></el-table-column>
              <el-table-column prop="pushTime" label="推送时间"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
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
    <el-dialog  :visible.sync="hallConfigDialog" class="dialogContent" width="40%">
      <div slot="title">{{hallConfigDialogTitle}}</div>
      <el-form :model="hallConfigForm"  label-width="110px" ref="hallConfigForm" :rules="rules">
        <el-form-item label="分配卡供应商"  prop="platformCode" class="formItemBlock">
          <el-select size="small"  v-model="hallConfigForm.platformCode" filterable :disabled="disabled">
            <el-option v-for="item in cardSupplierOpt" :key="item.dictionaryCode" :label="item.dictionaryName" :value="item.dictionaryCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新时间"  prop="modifiedTime" v-if="isShow" class="formItemBlock">
          <el-input size="small"  v-model.trim="hallConfigForm.modifiedTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="更新人"  prop="modifiedUser" v-if="isShow" class="formItemBlock">
          <el-input size="small"  v-model.trim="hallConfigForm.modifiedUser" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled">
        <el-button size="small"  @click="hallConfigDialog = false" class="c-button c-button--plain">取 消</el-button>
        <el-button size="small"  @click="submitForm('hallConfigForm')" class="c-button c-button--primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/model/api'
import scroll from '@/directives/index'

export default {
  name: 'hallConfig',
  data () {
    return {
      pickerPushStart: {
        disabledDate: (time) => {
          if (this.endPushTime) {
          	let curDate = (new Date(this.endPushTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate - one
            return time.getTime() < oneMonths || time.getTime() >= curDate
          } else {
            return false
          }
        }
      },
      pickerPushEnd: {
        disabledDate: (time) => {
          if (this.startPushTime) {
          	let curDate = (new Date(this.startPushTime)).getTime()
            let one = 30 * 24 * 3600 * 1000
            let oneMonths = curDate + one
            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
          } else {
            return false
          }
        }
      },
      resBrand: '',
      cardSupplier: '',
      resCode: '',
      city: '',
      oprMarket: '',
      finMarket: '',
      company: '',
      ifDistributed: '',
      startPushTime: '',
      endPushTime: '',
      brandSelect: [],
      cardSupplierSelect: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
      resCodeSelect: [],
      oprMarketSelect: [],
      finMarketSelect: [],
      companySelect: [],
      ifDistributedSelect: [{
        name: '已分配',
        value: 'Y'
      }, {
        name: '未分配',
        value: 'N'
      }],
      batchShow: true,
      activeName: 'restaurantSearch',
      multipleSelection: [],
      tableData: [],
      pageSizeList: [25, 50, 75, 100, 125],
      totalRecords: 0,
      currentPage: 1,
      pageSize: 25,
      loading: false,
      selectIndex:1,
      StoreNameSize:10,
      hallConfigDialog: false,
      disabled: false,
      isShow: false,
      isBatch: false,
      hallConfigDialogTitle: '餐厅查询与配置-详情',
      rules: {
        platformCode: [{required: true, message: '请选择卡供应商', trigger: 'change'}]
      },
      hallConfigForm: {
        platformCode: '',
        modifiedTime: '',
        modifiedUser: '',
      },
      cardSupplierOpt: [{
        "dictionaryCode": "ZHX",
        "dictionaryName": "ZHX"
      }, {
        "dictionaryCode": "UNP",
        "dictionaryName": "UNP"
      }],
      currentCode: '',
      codeList: [],
      hallSearchData: {}
    }
  },
  directives: { scroll },
  methods: {
    remoteStoreName(val){
      let that = this
      this.loadingStoreName = true
      api.getSelectSearchCondition({pageIndex: this.selectIndex,pageSize: this.StoreNameSize,storeName: val},res => {
      	this.loadingStoreName = false
        if (res.code === 200) {
          that.resCodeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    scrollStoreName(param){
      let that = this
      if(param){
        this.StoreNameSize += 10
        let currentValue = this.$refs.storeName.$children[0].currentValue === '请选择' ? '' : this.$refs.storeName.$children[0].currentValue
        api.getSelectSearchCondition({pageIndex:this.selectIndex,pageSize:this.StoreNameSize,storeName:currentValue},res => {that.resCodeSelect = res.data})
      }
    },
  	handleSizeChange (val) {
      this.pageSize = val
      if(this.activeName === 'restaurantSearch'){
        this.getStoreSerList()
      } else {
        this.getStorePushList()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      if(this.activeName === 'restaurantSearch'){
        this.getStoreSerList()
      } else {
        this.getStorePushList()
      }
    },
    search () {
      if(this.activeName === 'restaurantSearch'){
      	this.hallSearchData = {
      	  resBrand: this.resBrand,
      	  cardSupplier: this.cardSupplier,
      	  resCode: this.resCode,
      	  city: this.city,
      	  oprMarket: this.oprMarket,
      	  finMarket: this.finMarket,
      	  company: this.company,
      	  ifDistributed: this.ifDistributed,
      	}
        this.getStoreSerList()
      } else {
        this.getStorePushList()
      }
    },
    reset () {
      if (this.activeName === 'restaurantSearch') {
        this.resBrand = ''
        this.cardSupplier = ''
        this.resCode = ''
        this.city = ''
        this.oprMarket = ''
        this.finMarket = ''
        this.company = ''
        this.ifDistributed = ''
      } else {
        this.startPushTime = ''
        this.endPushTime = ''
      }
    },
    batchModifier () {
      this.hallConfigDialogTitle = '餐厅查询与配置-批量编辑'
      this.disabled = false
      this.isShow = false
      this.isBatch = true
      if (this.$refs.hallConfigForm) {
        this.$refs.hallConfigForm.resetFields
      }
      this.hallConfigDialog = true
    },
    exportFile () {
      let that = this
      api.exportStoreSerList(this.hallSearchData, 'application/vnd.ms-excel', function(res){
        if (res.code) {
          that.common.warningMessage(res.msg)
        } else {
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = '餐厅查询.xlsx'
          link.target = '_blank';link.click()
        }
      })
    },
    checkDetail (row, type){
      this.hallConfigDialogTitle = type === '1' ? '餐厅查询与配置-详情' : '餐厅查询与配置-编辑'
      this.disabled = type === '1' ? true : false
      this.isShow = true
      this.isBatch = false
      this.currentCode = row.resCode
      this.getStoreById()
      this.hallConfigDialog = true
    },
    restart (code) {
      let that = this
      this.$confirm('确定重推卡平台?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.deleteStoreList(code)
      }).catch(() => {
        that.common.infoMessage('已取消')
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.getResCode(this.multipleSelection)
      if (this.multipleSelection.length > 0) {
        this.batchShow = false
      } else {
        this.batchShow = true
      }
    },
    handleSwitch (tab) {
      this.pageSize = 10
      this.currentPage = 1
      this.tableData = []
      this.totalRecords = 0
      if(tab.name === 'restaurantSearch'){
        this.getStoreSerList()
      } else {
        this.getStorePushList()
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isBatch) {
            this.updateBatchStore()
          } else {
            this.updateSingleStore()
          }
          this.hallConfigDialog = false
        } else {
          return false
        }
      })
    },
    getBrandEnglishNames () {
      let that = this
      let pathParams = [{
        name: 'flag',
        value: '1'
      },{
          name: 'pageSize',
          value: '999999'
      }
      ]
      api.getBrandList(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.brandSelect = res.data.list
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getAllCompany () {
      let that = this
      api.getAllCompany(function(res){
        if (res.code === 200) {
          that.companySelect = res.data.list
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getStoreName () {
      let that = this
      api.getSelectSearchCondition({pageIndex:1,pageSize:10}, function(res){
        if (res.code === 200) {
          that.resCodeSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getAllOperateMarket () {
      let that = this
      api.getAllOperateMarket(function(res){
        if (res.code === 200) {
          that.oprMarketSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getAllFinanceMarket () {
      let that = this
      api.getAllFinanceMarket(function(res){
        if (res.code === 200) {
          that.finMarketSelect = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getStoreSerList () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'resBrand',
        value: this.resBrand
      }, {
      	name: 'cardSupplier',
        value: this.cardSupplier
      }, {
      	name: 'resCode',
        value: this.resCode
      }, {
      	name: 'city',
        value: this.city
      }, {
      	name: 'oprMarket',
        value: this.oprMarket
      }, {
      	name: 'finMarket',
        value: this.finMarket
      }, {
      	name: 'company',
        value: this.company
      }, {
      	name: 'ifDistributed',
        value: this.ifDistributed
      }]
      api.getStoreSerList(this.common.joinSearchParam(pathParams), function(res){
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
    getStoreById () {
      let that = this
      let pathParams = [{
      	name: 'id',
        value: this.currentCode
      }]
      api.getStoreById(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.hallConfigForm = res.data
          that.$nextTick(function() {
            if (that.$refs.hallConfigForm) {
              that.$refs.hallConfigForm.clearValidate()
            }
          })
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getStorePushList () {
      let that = this
      let pathParams = [{
      	name: 'pageIndex',
        value: this.currentPage
      }, {
      	name: 'pageSize',
        value: this.pageSize
      }, {
      	name: 'startPushTime',
        value: this.startPushTime
      }, {
      	name: 'endPushTime',
        value: this.endPushTime
      }]
      api.getStorePushList(this.common.joinSearchParam(pathParams), function(res){
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
    updateSingleStore () {
      let that = this
      let pathParams = [{
      	name: 'resCode',
        value: this.currentCode
      }, {
      	name: 'cardSupplier',
        value: this.hallConfigForm.platformCode
      }]
      api.updateSingleStore(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.showTips('修改成功','success')
          that.getStoreSerList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    updateBatchStore () {
      let that = this
      let params = {
        cardSupplier: this.hallConfigForm.platformCode,
        resCodeList: this.codeList
      }
      api.updateBatchStore(params, function(res){
        if (res.code === 200) {
          that.showTips('批量修改成功','success')
          that.getStoreSerList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    deleteStoreList (code) {
      let that = this
      let pathParams = [{
      	name: 'storeJdeCode',
        value: code
      }]
      api.deleteStoreList(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.showTips(res.data,'success')
          that.getStoreSerList()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getResCode (arr) {
      let codeList = []
      arr.forEach(function(item, index) {
        codeList.push(item.resCode)
      })
      this.codeList = codeList
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.getAllCompany()
    this.getBrandEnglishNames()
    this.getStoreName()
    this.getAllFinanceMarket()
    this.getAllOperateMarket()
    this.getStoreSerList()
  },
}
</script>

<style lang="scss" scoped>
.dialogContent .el-dialog {
  .el-form {
    .formItemBlock {
      display: block;
      width: 88%;
    }
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
