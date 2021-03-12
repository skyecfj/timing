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
      	<div class="info-title">开票时间</div>
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
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column v-for="(item,key) in tableKey"
      :width="item.value === 'id' ? '100' : ''"
      v-if="!item.special"
      :key="key"
      :prop="item.value"
      :label="item.name"
      align="center">
      </el-table-column>
      <el-table-column
      v-else
      :label="item.name"
      align="center"
      :show-overflow-tooltip="true"
      :width="item.value === 'storeType' ? '100' : ''">
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
      orderCode: ''
    }
  },
  props: ['reportInfo', 'tableData', 'tableKey'],
  watch: {
    
  },
  computed: {
    accountPriod () {
      if (this.reportInfo.balanceStartDate == null) return ''
      let balanceStartDate = this.reportInfo.balanceStartDate
  	  let balanceEndDate = this.reportInfo.balanceEndDate
  	  balanceStartDate = balanceStartDate.split(' ')[0]
  	  balanceEndDate = balanceEndDate.split(' ')[0]
  	  return balanceStartDate + '至' + balanceEndDate
    },
    createDate () {
      if (this.reportInfo.createTime == null) return ''
      return this.reportInfo.createTime.split(' ')[0]
    },
    confirmDate () {
      if (this.reportInfo.confirmTime == null) return ''
      return this.reportInfo.confirmTime.split(' ')[0]
    }
  },
  methods: {
    handleSelectionChange (val) {
    }
  }
}
</script>

<style lang="scss" scoped>
  .report-info {
    margin-bottom: 25px;
    padding: 0;
  }
</style>