<template>
  <div class="mainContent">
    <div class="tab-content" >
      <el-tabs v-model="activeName" @tab-click="handleSwitch">
        <el-tab-pane label="结算报告列表" name="accountReport">
          <coupon-account></coupon-account>
        </el-tab-pane>
        <!--<el-tab-pane label="手动生成报告" name="handReport">
          <coupon-hand></coupon-hand>
        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import couponAccount from './couponCodeCom/couponAccount.vue'

export default {
  name: 'couponCode',
  data () {
    return {
      activeName: 'accountReport'
    }
  },
  components: {
    couponAccount
  },
  methods: {
    handleSwitch () {
      
    }
  }
}
</script>

<style>
</style>