<template>
    <activeAdd></activeAdd>
</template>

<script>
    import activeAdd from './activeAdd'
    export default {
        name: "activeEdit",
        components:{
            activeAdd
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'active';
            next();
        },
    }
</script>