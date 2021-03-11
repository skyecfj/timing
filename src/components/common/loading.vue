<template>
    <div class="loading">
        <img src="static/images/loading.gif" alt="">
    </div>
</template>

<script>
    export default {
        name: 'loading',
        data () {
            return {}
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .loading{
        position: fixed;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;
        z-index:999999999999999999;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        display: table-cell;
        vertical-align: middle;
        text-align: center;
    }
    .loading img{
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;
        position:absolute;
        z-index:999999999999999999;
    }
</style>