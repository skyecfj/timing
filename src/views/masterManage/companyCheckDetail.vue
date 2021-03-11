<template>
    <companyDetail v-bind:isDisabled="isDisabled"  v-bind:isEdit="isEdit"></companyDetail>
</template>
<script>
    import companyDetail from './companyDetail'
    export default {
        name:'companyCheckDetail',
        components:{
            companyDetail
        },
        data(){
            return {
                isDisabled:true,
                isEdit:false
            }
        }
    }

</script>
