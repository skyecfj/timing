<template>
  <div class="table-compontent">
    <div class="report-info">
      <div class="info-content">
      	<div class="info-title">活动名称</div>
        <div class="info-value">{{ reportInfo.activityName }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">第三方</div>
        <div class="info-value">{{ reportInfo.thirdName }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">结算期间</div>
        <div class="info-value">{{ accountPriod }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">报告生成日期</div>
        <div class="info-value">{{ createDate }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">报告生成人</div>
        <div class="info-value">{{ reportInfo.createUser }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">报告确认日期</div>
        <div class="info-value">{{ confirmDate }}</div>
      </div>
      <div class="info-content">
      	<div class="info-title">报告确认人</div>
      	<div class="info-value">{{ reportInfo.confirmUser }}</div>
      </div>
    </div>
    <div class="total-account" >结算金额：{{chargeAmount}}</div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column v-for="(item,key) in tableKey" :width="item.value === 'id' ? '100' : ''"
      v-if="!item.special"
      :key="key"
      :prop="item.value"
      :label="item.name"></el-table-column>
      <el-table-column v-else
      :label="item.name"
      :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <slot :name="item.value" :$index="scope.$index" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default{
  name: 'table-list',
  data () {
    return {
    }
  },
  props: {
  	reportInfo: {
  	  type: Object
  	},
    tableData: {
      type: Array
    },
    tableKey: {
      type: Array
    },
    chargeAmount: {
      type: String
    }
  },
  computed: {
    accountPriod () {
      if (!this.reportInfo.balanceStartDate) return ''   	
      let balanceStartDate = this.reportInfo.balanceStartDate
  	  let balanceEndDate = this.reportInfo.balanceEndDate
  	  balanceStartDate = balanceStartDate.split(' ')[0]
  	  balanceEndDate = balanceEndDate.split(' ')[0]
  	  return balanceStartDate + '至' + balanceEndDate
    },
    createDate () {
    	if (!this.reportInfo.createTime) return ''
    	return this.reportInfo.createTime.split(' ')[0]   
    },
    confirmDate () {
    	if (!this.reportInfo.confirmTime) return ''
      return this.reportInfo.confirmTime.split(' ')[0]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.table-compontent {
  .report-info {
    padding: 0 0 20px 0;
  }
}
</style>