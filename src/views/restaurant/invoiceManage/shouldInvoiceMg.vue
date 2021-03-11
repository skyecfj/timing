<template>
  <div class="mainContent">
    <div class="tab-content" >
      <el-tabs v-model="activeName" @tab-click="handleSwitch">
        <el-tab-pane label="开票报告列表" name="shouldInvoiceMg">
          <shouldInvoiceMg-account></shouldInvoiceMg-account>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import shouldInvoiceMgAccount from './shouldInvoiceCom/shouldInvoiceAccount.vue';
  export default {
    name: 'shouldInvoiceMg',
    data () {
      return {
        activeName: 'shouldInvoiceMg'
      }
    },
    methods: {
      handleSwitch () {
  
      }
    },
    components: {
      shouldInvoiceMgAccount
    }
  
  }
</script>