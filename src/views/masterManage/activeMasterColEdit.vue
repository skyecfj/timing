<template>
    <activeMasterColAdd></activeMasterColAdd>
</template>

<script>
    import activeMasterColAdd from './activeMasterColAdd'
    export default {
        name: "activeMasterColEdit",
        components:{activeMasterColAdd},
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'active';
            next();
        },
    }
</script>