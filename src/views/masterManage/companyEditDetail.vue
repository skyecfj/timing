<template>
    <companyDetail v-bind:isDisabled="isDisabled"  v-bind:isEdit="isEdit"></companyDetail>
</template>
<script>
    import companyDetail from './companyDetail'
    export default {
        name:'companyEditDetail',
        components:{
            companyDetail
        },
        data(){
            return {
                isDisabled:false,
                isEdit:true
            }
        }
    }

</script>
