<template>
  <checkResults  v-bind:businessTypeFromCom="businessType"
                 v-on:routeLeave = "routeLeave" ></checkResults>
</template>
<script>
  //核对结果
  import checkResults from './checkResults.vue'
	export default {
    name:'checkResultsB2C',
    components:{
      checkResults
    },
		data() {
			return {
        businessType : 'B2C',
        tblObj : {}
			}
		},
    methods:{
      routeLeave(tblObj){
        let _self = this;
        this.tblObj = tblObj;
      },
    }
	}
</script>









