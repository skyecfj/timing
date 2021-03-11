
<template>
    <manualAccounting v-bind:source="source"></manualAccounting>
</template>

<script>
    import manualAccounting from './manualAccounting'
    export default {
        name: 'manualAccountingCommon',
        components:{
            manualAccounting
        },
        created(){
           this.source = this.$route.query.source; 
        },
        data(){
            return {
                source : ''
            }
        }
    }
</script>