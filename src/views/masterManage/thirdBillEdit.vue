<template>
    <thirdBillAdd></thirdBillAdd>
</template>

<script>
    import thirdBillAdd from './thirdBillAdd'
    export default {
        name: "thirdBillEdit",
        components:{
            thirdBillAdd
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'thirdBill';
            next();
        },
    }
</script>