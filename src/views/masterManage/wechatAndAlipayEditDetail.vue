<template>
    <wechatAndAlipayDetail v-bind:isDisabled="isDisabled"  v-bind:isEdit="isEdit"></wechatAndAlipayDetail>
</template>
<script>
    import wechatAndAlipayDetail from './wechatAndAlipayDetail'
    export default {
        name:'wechatAndAlipayEditDetail',
        components:{
            wechatAndAlipayDetail
        },
        data(){
            return {
                isDisabled:false,
                isEdit:true
            }
        }
    }

</script>
