<template>
  <div class="table-compontent">
    <div class="table-search" v-if="searchShow">
      <span>第三方交易订单号</span>
      <el-input  size="small" placeholder="请输入第三方交易订单号" v-model="orderCode"></el-input>
      <!-- <template v-if="ishistory"> -->
      <span>餐厅编号</span>
      <el-select  size="small" v-model="deliveryStoreCode" filterable remote placeholder="请输入餐厅编号进行查询" reserve-keyword  v-scroll="storeScroll"
                  :remote-method="getStore" :loading="getStoreLoading" @visible-change="toogleStoreDropDown"  @change="storeChange" clearable >
        <el-option v-for="(item,index) in storeList" :key="item" :label="item" :value="item" ></el-option>
      </el-select>
      <span>结算金额</span>
      <el-input style="width:85px"  size="small" v-model="storeReceivableStart"></el-input>
      <span>-</span>
      <el-input style="width:85px"  size="small" v-model="storeReceivableEnd"></el-input>
      <!-- </template> -->
      <el-button size="small"   @click="search" type="success">查询</el-button>
      <el-button size="small"   @click="delectRow" type="warning" :disabled="balanceStatus === '1' || selectId.length < 1">标记</el-button>
      <el-button size="small"   @click="cancelDelete" type="warning" v-if="activeTabName === 'historyReport' || activeTabName === 'detailReport' " :disabled="balanceStatus === '1' || selectId.length < 1">取消标记</el-button>
      <!-- <el-button size="small"   @click="updateAccount" type="success" :disabled="balanceStatus === '1'">更新结算</el-button> -->
    </div>
    <div class="total-account" v-if="isHaveDetail == 1"><span v-if="showComment" style="float:left;">请选择标记不参与结算的订单\券码</span> 结算金额：{{ total_account }}</div>
    <el-table :data="tableData" :show-summary="show_summary" @selection-change="handleSelectionChange"
    	:row-class-name="tableRowClassName" :summary-method="getSummaries" style="width: 100%" border>
  	  <el-table-column type="selection" width="55" v-if="searchShow"></el-table-column>
      <el-table-column v-for="(item,key) in tableKey"
      v-if="!item.special"
      :key="key"
      :prop="item.value"
      :label="item.name" :width="item.width"></el-table-column>
      <el-table-column v-else-if="item.value === 'resourceType' && balanceStatus === '1'"
      :prop="item.value"
      :label="item.name"></el-table-column>
      <el-table-column v-else-if="item.value != 'resourceType'"
      :label="item.name"
      :show-overflow-tooltip="true" :width="item.width">
        <template slot-scope="scope">
          <slot :name="item.value" :$index="scope.$index" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Main from '@/main'
import scroll from '@/directives/index'
import apidr from '@/model/apidr'

export default{
  name: 'table-list',
  directives: { scroll },
  data () {
    return {
      storeReceivableStart: '',
      storeReceivableEnd: '',
      storeList : [],
      getStoreLoading: false,
      storeScrollPageIndex    : 1,
      storeScrollFlag         : true,
      storeSelectObj          : {},
      tempStoreSearchKeyword  : '',
      orderCode: '',
      deliveryStoreCode: '',
      show_summary: true,
      sum_text: '合计',
      selectId: [],
      sumColumns : ['orderAmount','bsSubsidy','tradeAmount','storeReceivable','acturalAmount',
                    'thirdSubsidy','handingCharge','serviceCharge','bsShippingFee','thirdShippingFee','tradeAmount1']
    }
  },
  props: {
    tableData: {
      type: Array
    },
    tableKey: {
      type: Array
    },
    searchShow: {
      type: Boolean
    },
    isHaveDetail:  [String, Number],
    balanceStatus: [String, Number],
    total_account: [String, Number],
    activeTabName: {
      type: String
    },
    promotionId:[String, Number],
    ishistory:{
      type: Boolean
    },
    storeCodeSearchType:[String, Number],
    showComment:{
      type: Boolean
    }
  },
  watch: {
    searchShow (val) {
      // console.log(val)
      if (val) {
        this.show_summary = true
      } else {
        this.show_summary = false
      }
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.markFlag == '-1' && this.balanceStatus !='1') {
        return 'warning-row'
      }
      return ''
    },
    handleSelectionChange (val) {
    	let that = this
    	this.selectId = []
      val.forEach(function(value, index) {
        that.selectId.push(value.id)
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      let _self = this
      let values = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        values = data.map(item => Number(item[column.property]? item[column.property].toString().replace(/,/g, "") : null))
        if (_self.sumColumns.indexOf(column.property) != -1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = _self.common.formatterAmount(sums[index].toFixed(2))
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    storeScroll(param,object){
      let _self = this;
      if(param){
        this.storeSelectObj = object;
        if(this.storeScrollFlag){
          this.storeScrollPageIndex++;
          let param = _self.common.formatPathParam({
            pageSize    : 20,
            pageIndex   : this.storeScrollPageIndex,
            promotionId : this.promotionId,
            searchType  : this.storeCodeSearchType,
            deliveryStoreCode : this.deliveryStoreCode
          })
          apidr.getDeliveryStoreCode(param,function(res){
            if(res.code === 200){
              _self.storeList = _self.storeList.concat(res.data);
            }else{
              _self.storeScrollFlag = false;
            }
          })
        }
      }
    },
    //获取餐厅
    getStore(query){
      let _self = this;
      this.storeScrollPageIndex = 1;
      if(JSON.stringify(this.storeSelectObj) !== '{}'){
        this.storeSelectObj.scrollTop = 0;
      }
      this.tempStoreSearchKeyword = query;
      let param = _self.common.formatPathParam({
        pageSize    : 20,
        pageIndex   : this.storeScrollPageIndex,
        promotionId : this.promotionId,
        deliveryStoreCode : query,
        searchType  : this.storeCodeSearchType
      });
      apidr.getDeliveryStoreCode(param,function(result){
        _self.getStoreLoading = false;
        if(result.code == 200){
          _self.storeList = result.data;
        }else if(result.code == 404){
          _self.storeList = [];
        }
      })
      // if(query !== '') {

      // }else {
      //   this.storeList = [];
      // }
    },
    toogleStoreDropDown(isVisible){
      this.getStore('');
      if(!isVisible){
        if(!this.deliveryStoreCode){
          this.storeList = [];
        }
      }
    },
    storeChange(val){
      if(!this.deliveryStoreCode){
        this.storeList = [];
        this.getStore('');
      }
    },
    search () {
      if( (this.storeReceivableStart && isNaN(Number(this.storeReceivableStart))) ||
          (this.storeReceivableEnd && isNaN(Number(this.storeReceivableEnd)))){
        this.common.warningMessage('请输入正确的金额');
        return false;
      }
      this.$emit('searchList', this.orderCode,this.deliveryStoreCode,this.storeReceivableStart,this.storeReceivableEnd)
    },
    delectRow () {
      let that = this
      this.$confirm('确定标记?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$emit('delectList', that.selectId)
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    cancelDelete () {
      let that = this
      this.$confirm('确定取消标记?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$emit('cancelDelete', that.selectId)
      }).catch(() => {
        // that.common.infoMessage('已取消标记')
      })
    },
    updateAccount () {
      let that = this;
      this.$confirm('确定更新结算?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$emit('updateAccount')
      }).catch(() => {
        // that.common.infoMessage('已取消标记')
      })
    },
  },
  beforeMount () {
    Main.$off('clearOrder')
    Main.$on('clearOrder', () => {
      this.orderCode = ''
    })
    //this.getStore('');
  }
}
</script>

<style>
.el-table tr.warning-row {
  background: oldlace;
}
</style>
