<template>
    <billUnitDetail v-bind:isDisabled="isDisabled" v-bind:isEdit="isEdit"></billUnitDetail>
</template>
<script>
    import billUnitDetail from './billUnitDetail'
    export default {
        name:'billUnitCheckDetail',
        components:{
            billUnitDetail
        },
        data(){
            return {
                isDisabled:true,
                isEdit:false
            }
        }
    }

</script>
