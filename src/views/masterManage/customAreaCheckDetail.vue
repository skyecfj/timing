<template>
    <customAreaDetail v-bind:isDisabled="isDisabled"></customAreaDetail>
</template>
<script>
    import customAreaDetail from './customAreaDetail'
    export default {
        name:'customAreaCheckDetail',
        components:{
            customAreaDetail
        },
        data(){
            return {
                isDisabled:true
            }
        }
    }

</script>
