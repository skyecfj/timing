<template>
    <customMarketDetail v-bind:isDisabled="isDisabled"></customMarketDetail>
</template>
<script>
    import customMarketDetail from './customMarketDetail'
    export default {
        name:'customMarketAdd',
        components:{
            customMarketDetail
        },
        data(){
            return {
                isDisabled:false
            }
        }
    }

</script>
