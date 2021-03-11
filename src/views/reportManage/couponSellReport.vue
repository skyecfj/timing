<template>
  <div class="mainContent" style="height: 100%;">
    <div class="tab-content">
      <el-tabs class="coupon-sell" v-model="activeName" @tab-click="handleSwitch">
        <!--<el-tab-pane label="全渠道" name="allChannel">-->
          <!--<iframe :src="src1"-->
            <!--style="width: 100%; height: 100%;" >-->
          <!--</iframe>-->
        <!--</el-tab-pane>-->
        <el-tab-pane label="百胜渠道" name="BSChannel" >
          <iframe :src="src2"
            style="width: 100%; height: 100%;">
          </iframe>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'couponSellReport',
  data () {
    return {
      activeName: 'allChannel',
      src1:'',
      src2:''
    }
  },
  mounted(){
    this.$nextTick(()=>{
          this.src1 = '/Viewer/Router.aspx?key=lTo97vSGA/N6nM1ZK2NKhZXGzefh2e1dV6LcXFOLHYrJCTl2BY03q0q93WLIDqlUAJzc7bCYThcGsQp4TzqFPWJx+52iCHI8n3ZBmrSQshukfEblAbR4d74YoodxNEQsvndtSfUjp/aNkIPoNMNckx/x51ay2pbOfQmHwuZN937bVBu7eI/ObR0RMpcrp0WtVwaVh4KpK216XH4q8qC6MrUIOL1sO/Vedsfxr0UIs8o+e7Y2KiWdrA2oUB4zTJ6m&Source=Normal';
          this.src2 = '/Viewer/Router.aspx?key=lTo97vSGA/N6nM1ZK2NKhZXGzefh2e1dV6LcXFOLHYrJCTl2BY03q0q93WLIDqlUAJzc7bCYThcGsQp4TzqFPV65Qpb82qXmqSM7gflAOhYhfUaRly6B/5jc6dTj3meI+w47FUmhOjTUTPvVybotr4HhK0om4FHKaQSO2+B6gdluFpv0OHighJpM2IIik0Fb4Q6Ex6K18gF40G5mqOj6gyQfBI8lOxTvz6LRaTV2R091h8jeku/8N+C5/KcxAnoG&Source=Normal'
      })
  },
  methods: {
    handleSwitch () {

    }
  }
}
</script>

<style>
.coupon-sell .el-tabs__content {
  height: calc(100% - 55px);
}
.coupon-sell .el-tabs__content .el-tab-pane {
  height: 100%;
}
</style>

<style lang="scss" scoped>
.tab-content {
  height: 100%;
  .el-tabs {
    height: 100%;
  }
}
</style>
