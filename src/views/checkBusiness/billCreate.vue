<template>
  <div class="cbContainer">
        <div class="cbTabs">
        <div class="cbSelects">
          <div class="cbSelectRow">
            <span class="cbSelect">
              <div class="selectTitle">业务类型</div>
                <el-select size="small"  v-model="billBTValue" placeholder="请选择">
                  <el-option v-for="item in billBTOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
            </span>
            <span class="cbSelect">
              <div class="selectTitle">业务子类型</div>
                <el-select size="small"  v-model="billSubTValue" placeholder="请选择">
                  <el-option v-for="item in billSubTOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
            </span>
            <span class="cbSelect">
              <div class="selectTitle">售卖渠道</div>
                <el-select size="small"  v-model="billSaleValue" placeholder="请选择">
                  <el-option v-for="item in billSaleOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
            </span>
            <span class="cbSelect">
              <div class="selectTitle">品牌</div>
                <el-select size="small"  v-model="billBrandValue" placeholder="请选择">
                  <el-option v-for="item in billBrandOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
               </el-select>
            </span>
            <span class="cbSelect">
              <div class="selectTitle">法人</div>
                <el-select size="small"  v-model="billLpValue" placeholder="请选择">
                  <el-option v-for="item in billLpOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
               </el-select>
            </span>
          </div>
          <div class="cbSelectRow">
            <span class="cbSelect">
              <div class="selectTitle">总账日期</div>
                <el-date-picker v-model="billMonStart" type="date" placeholder="选择日期"></el-date-picker>
                <span>-</span>
                <el-date-picker v-model="billMonEnd" type="date" placeholder="选择日期"></el-date-picker>
            </span>
            <el-button size="small"  type="success" @click="createNewBill">生成单据</el-button>
          </div>
        </div>
    </div>
  </div>
  </div>
</template>
<script>
    import billDetail from "./billDetail.vue"
    import billParticulars from "./billParticulars.vue"
    export default{
      name:'billCreate',
      data() {
	   return {
        billBTOption:[{value:'请选择'},{value: 'BOC1',label: 'BOC1'},{value: 'BOC2',label: 'BOC2'}],
		billSubTOption:[{value:'请选择'},{value: '订单账务1',label: '订单账务1'},{value: '订单账务2',label: '订单账务2'}],
		billSaleOption:[{value:'请选择'},{value: '天猫商城1',label: '天猫商城1'},{value: '天猫商城2',label: '天猫商城2'}],
		billBrandOption:[{value:'请选择'},{value: '肯德基1',label: '肯德基1'},{value: '肯德基2',label: '肯德基2'}],
		billLpOption:[{value:'请选择'},{value: '环胜电子商务1',label: '环胜电子商务1'},{value: '环胜电子商务2',label: '环胜电子商务2'}],
		billMonStart:'',
        billMonEnd:'',
        billBTValue:'全部',
		billSubTValue:'全部',
		billSaleValue:'全部',
		billBrandValue:'全部',
		billLpValue:'全部'
	    }
      },
      methods: {
       createNewBill(){
        alert('生成新的单据')
       }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../assets/scss/checkBusiness.scss';
  .cbTabs {
      .cbSelects
      {
        padding: 0px;
      }
  }
</style>