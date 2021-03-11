<template>
  <div class="mainContent">
    <div class="tab-content" >
      <el-tabs v-model="activeName" @tab-click="handleSwitch">
        <el-tab-pane label="结算报告列表" name="commissionAccount">
          <commission-account></commission-account>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import commissionAccount from './commissionCom/commissionAccount.vue'
  
  export default {
    name: 'commissionCharge',
    data () {
      return {
        activeName: 'commissionAccount'
      }
    },
    computed: {
  
    },
    methods: {
      handleSwitch () {
  
      }
    },
    components: {
      commissionAccount
    }
  }
</script>

<style lang="sass" scoped>

</style>
