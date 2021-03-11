<template>
    <editUser v-bind:isAdd="isAdd"></editUser>
</template>

<script>
    import editUser from './editUser'
    export default {
        name: "userMgrAdd",
        components:{
            editUser
        },
        data(){
            return{
                isAdd: true
            }
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'userMgr';
            next();
        },
    }
</script>