<template>
    <editUser v-bind:isCheckEd="isCheckEd"></editUser>
</template>

<script>
    import editUser from './editUser'
    export default {
        name: "checkUser",
        components:{
            editUser
        },
        data(){
            return{
                isCheckEd: true
            }
        }
    }
</script>

<style scoped>

</style>