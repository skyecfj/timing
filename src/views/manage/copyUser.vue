<template>
    <editUser v-bind:isCopy="isCopy"></editUser>
</template>

<script>
    import editUser from './editUser'
    export default {
        name: "isCopy",
        components:{
            editUser
        },
        data(){
            return{
                isCopy: true
            }
        }
    }
</script>