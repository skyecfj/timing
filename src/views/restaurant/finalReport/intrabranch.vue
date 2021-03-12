<template>
  <div class="mainContent">
    <div class="tab-content" >
      <el-tabs v-model="activeName" @tab-click="handleSwitch">
        <el-tab-pane label="结算报告列表" name="accountReport">
          <intrabranch-account></intrabranch-account>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import intrabranchAccount from './intrabranchCom/intrabranchAccount.vue'

export default {
  name: 'intrabranch',
  data () {
    return {
      activeName: 'accountReport'
    }
  },
  components: {
    intrabranchAccount
  },
  methods: {
    handleSwitch () {
      
    }
  }
}
</script>

<style>
</style>