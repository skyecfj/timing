<template>
    <companyDetail v-bind:isDisabled="isDisabled"  v-bind:isEdit="isEdit"></companyDetail>
</template>
<script>
    import companyDetail from './companyDetail'
    export default {
        name:'companyAddDetail',
        components:{
            companyDetail
        },
        data(){
            return {
                isDisabled:false,
                isEdit:false
            }
        }
    }

</script>
