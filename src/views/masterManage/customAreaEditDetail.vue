<template>
    <customAreaDetail v-bind:isDisabled="isDisabled" v-bind:isEdit="isEdit"></customAreaDetail>
</template>
<script>
    import customAreaDetail from './customAreaDetail'
    export default {
        name:'customAreaEditDetail',
        components:{
            customAreaDetail
        },
        data(){
            return {
                isDisabled:false,
                isEdit:true
            }
        }
    }

</script>
