<template>
    <billUnitDetail v-bind:isDisabled="isDisabled" v-bind:isEdit="isEdit"></billUnitDetail>
</template>
<script>
    import billUnitDetail from './billUnitDetail'
    export default {
        name:'billUnitEditDetail',
        components:{
            billUnitDetail
        },
        data(){
            return {
                isDisabled:false,
                isEdit:true
            }
        }
    }

</script>
