<template>
  <div class="table-compontent">
    <div class="table-search" v-if="searchShow">
      <span>券码</span>
      <el-input size="small" placeholder="请输入券码号" v-model="couponCode" @change="$emit('couponCodeChange',couponCode)" ></el-input>
      <template v-if="activeTabName === 'historyReport' || activeTabName === 'detailReport' " >
        <span>券码状态</span>
        <el-select v-model="couponStatus" placeholder="请选择" @change="$emit('couponStatusChange',couponStatus)">
          <el-option size="small" v-for="item in couponStatusOpt" :key="item.couponStatusCode" :label="item.couponStatusName" :value="item.couponStatusCode">
          </el-option>
        </el-select>
      </template>
      <el-button size="small"   @click="search" type="success">查询</el-button>
      <el-button size="small"   @click="delectRow" type="warning"  :disabled="balanceStatus === '1' || selectId.length < 1">标记</el-button>
      <el-button size="small"   @click="cancelDelete" type="warning" v-if="activeTabName === 'historyReport' || activeTabName === 'detailReport'" :disabled="balanceStatus === '1' || selectId.length < 1">取消标记</el-button>
      <el-button size="small"   @click="deleteRows" type="danger" v-if="showDeleteBtn" :disabled="balanceStatus === '1' || selectId.length < 1">删除</el-button>
    </div>
    <div class="total-account" v-if="showTotalAmount">结算金额：{{ total_account }}</div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" style="width: 100%" border>
  	  <el-table-column type="selection" width="55" v-if="searchShow"></el-table-column>
      <el-table-column v-for="(item,key) in tableKey"
      v-if="!item.special"
      :key="key"
      :show-overflow-tooltip="true"
      :prop="item.value"
      :label="item.name" :width="item.width"></el-table-column>
      <el-table-column v-else-if="item.value === 'resourceType' && balanceStatus === '1'"
      :prop="item.value"
      :label="item.name"></el-table-column>
      <el-table-column v-else-if="item.value != 'resourceType'"
      :label="item.name" :width="item.width">
        <template slot-scope="scope">
          <slot :name="item.value" :$index="scope.$index" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Main from '@/main'

export default{
  name: 'table-list',
  data () {
    return {
      couponCode: '',
      selectId: [],
      selectedObjs: [],
      isHaveDetail: '',
      couponStatus: ''
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
      this.selectedObjs = val.concat()
      this.selectId = []
      val.forEach(function(value, index) {
        that.selectId.push(value.id)
      })
    },
    search () {
      // if(!this.couponCode && this.activeTabName == 'detailReport' ){
      //   this.common.warningMessage('请输入券码');
      //   return false;
      // }
      this.$emit('searchList', this.couponCode,this.couponStatus)
    },
    delectRow () {
      let that = this
      this.$confirm('确定标记?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$emit('delectList', that.selectId)
        //that.couponCode = ''
      }).catch(() => {
        // that.common.infoMessage('已取消标记')
      })
    },
    deleteRows () {
      let _self = this;
      let hasSign = false;
      this.selectedObjs.forEach(function(item,index){
        if(item.markFlag == '-1'){
          hasSign = true;
        }
      });
      if(hasSign){
        this.common.errorMessage('已标记的数据不可删除，请重新选择');
        return false
      }
      this.$confirm('确定删除?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.$emit('deleteRows',_self.selectId);
        _self.couponCode = ''
      }).catch(() => {})
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
    // updateAccount () {
    //   let that = this;
    //   this.$confirm('确定更新结算?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     that.$emit('updateAccount')
    //   }).catch(() => {
    //     // that.common.infoMessage('已取消标记')
    //   })
      
    // },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      let values = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        values = data.map(item => Number(item[column.property]))
        if (column.property === 'faceAmount' || column.property === 'sales' || 
        column.property === 'invoiceAmountA' || column.property === 'invoiceAmountB') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
  },
  props: ['tableData', 'tableKey', 'searchShow', 'balanceStatus', 'total_account', 'activeTabName','showTotalAmount','couponStatusOpt','showDeleteBtn'],
  beforeMount () {
    Main.$off('clearCode')
    Main.$on('clearCode', () => {
      this.couponCode = ''
    })
    this.isHaveDetail = this.$route.query.isHaveDetail
  }
}
</script>

<style>
.el-table tr.warning-row {
  background: oldlace;
}
</style>