<template>
    <manualAccounting v-bind:source="source"></manualAccounting>
</template>

<script>
    import manualAccounting from './manualAccounting'
    export default {
        name: 'manualAccountingCheck',
        components:{
            manualAccounting
        },
        created(){
           console.log(this.source)
        },
        data(){
            return {
                source : 'check'
            }
        }
    }
</script>