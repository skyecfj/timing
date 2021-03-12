<template>
    <customMarketDetail v-bind:isDisabled="isDisabled"></customMarketDetail>
</template>
<script>
    import customMarketDetail from './customMarketDetail'
    export default {
        name:'customMarketCheckD',
        components:{
            customMarketDetail
        },
        data(){
            return {
                isDisabled:true
            }
        }
    }

</script>
