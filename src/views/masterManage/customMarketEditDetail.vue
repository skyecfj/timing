<template>
    <customMarketDetail v-bind:isDisabled="isDisabled" v-bind:isEdit="isEdit"></customMarketDetail>
</template>
<script>
    import customMarketDetail from './customMarketDetail'
    export default {
        name:'customMarketEditDetail',
        components:{
            customMarketDetail
        },
        data(){
            return {
                isDisabled:false,
                isEdit:true
            }
        }
    }

</script>
