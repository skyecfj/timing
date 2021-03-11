<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

  export default {
      name: 'app',
      components:{
      }
  };
</script>

<style lang="scss">
    @import './assets/scss/_generic.reset.scss';
    @import './assets/scss/_variable.scss';
    @import "./assets/scss/common.scss";
</style>
