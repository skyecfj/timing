<template>
    <messageMngDetail v-bind:isEdit="isEdit"></messageMngDetail>
</template>
<script>
    import messageMngDetail from './messageMngDetail'
    export default {
        name:'messageMngCheckD',
        components:{
            messageMngDetail
        },
        data(){
            return {
                isEdit:true
            }
        }
    }

</script>