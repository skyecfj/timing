<template>
    <customAreaDetail v-bind:isDisabled="isDisabled"></customAreaDetail>
</template>
<script>
    import customAreaDetail from './customAreaDetail'
    export default {
        name:'customAreaAdd',
        components:{
            customAreaDetail
        },
        data(){
            return {
                isDisabled:false
            }
        }
    }

</script>
