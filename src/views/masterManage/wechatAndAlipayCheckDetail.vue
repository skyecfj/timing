<template>
    <wechatAndAlipayDetail v-bind:isDisabled="isDisabled"  v-bind:isEdit="isEdit"></wechatAndAlipayDetail>
</template>
<script>
    import wechatAndAlipayDetail from './wechatAndAlipayDetail'
    export default {
        name:'wechatAndAlipayCheckDetail',
        components:{
            wechatAndAlipayDetail
        },
        data(){
            return {
                isDisabled:true,
                isEdit:false
            }
        }
    }

</script>
