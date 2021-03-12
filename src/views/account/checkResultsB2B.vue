<template>
  <checkResults  v-bind:businessTypeFromCom="businessType"
                 v-on:routeLeave = "routeLeave" ></checkResults>
</template>
<script>
  //核对结果
  import checkResults from './checkResults.vue'
	export default {
    name:'checkResultsB2B',
    components:{
      checkResults
    },
		data() {
			return {
        businessType : 'B2B',
        tblObj : {}
			}
    },
    methods:{
      routeLeave(tblObj){
        let _self = this;
        this.tblObj = tblObj;
      }
    }
	}
</script>









