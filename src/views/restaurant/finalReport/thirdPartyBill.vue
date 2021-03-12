<template>
  <div class="mainContent">
    <div class="tab-content" >
      <el-tabs v-model="activeName" @tab-click="handleSwitch">
        <el-tab-pane label="结算报告列表" name="accountReport">
          <third-party-account></third-party-account>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import thirdPartyAccount from './thirdPartyCom/thirdPartyAccount.vue'

export default {
  name: 'thirdPartyBill',
  data () {
    return {
      activeName: 'accountReport'
    }
  },
  components: {
    thirdPartyAccount
  },
  methods: {
    handleSwitch () {
      
    }
  }
}
</script>

<style>
</style>