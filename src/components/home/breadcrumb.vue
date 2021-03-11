<!--<template>-->
  <!--<div>-->
  <!--<el-breadcrumb class="app-breadcrumb" separator="/">-->
    <!--<transition-group name="breadcrumb">-->
      <!--<el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta'>-->
        <!--<span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.meta.title}}</span>-->
        <!--<span v-else :to="item.redirect||item.path">{{item.meta.title}}</span>-->
        <!--&lt;!&ndash;<router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>&ndash;&gt;-->
      <!--</el-breadcrumb-item>-->
    <!--</transition-group>-->
  <!--</el-breadcrumb>-->
  <!--</div>-->
<!--</template>-->
<!--<script>-->
<!--import api from '../../model/api'-->
<!--export default {-->
  <!--created() {-->
    <!--this.getBreadcrumb()-->
    <!--console.log('levelListlevelList111111',this.levelList)-->
  <!--},-->
  <!--data() {-->
    <!--return {-->
      <!--levelList: null-->
    <!--}-->
  <!--},-->
  <!--watch: {-->
    <!--$route() {-->
      <!--this.getBreadcrumb()-->
      <!--console.log('levelListlevelList22222',this.levelList,this.$route)-->
    <!--}-->
  <!--},-->
  <!--methods: {-->
    <!--getBreadcrumb() {-->
      <!--let matched = this.$route.matched.filter(item => item.meta)-->
      <!--const first = matched[0]-->
      <!--// if (first && first.name !== '首页') {-->
      <!--//   matched = [{ path: '/Home', meta:{title:'首页'}}].concat(matched)-->
      <!--// }-->
      <!--this.levelList = matched;-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->
<!--<style rel="stylesheet/scss" lang="scss" scoped>-->
  <!--.app-breadcrumb.el-breadcrumb {-->
    <!--/*display: inline-block;*/-->
    <!--font-size: 14px;-->
    <!--line-height: 40px;-->
    <!--margin-left: 10px;-->
    <!--.no-redirect {-->
      <!--/*color: #97a8be;*/-->
      <!--cursor: text;-->
    <!--}-->
  <!--}-->

<!--.el-breadcrumb__item {-->
  <!--.el-breadcrumb__inner {-->
    <!--span{-->
      <!--color:#000000-->
    <!--}-->
  <!--}-->
<!--}-->

  <!--.el-breadcrumb__item:last-child .el-breadcrumb__separator {-->
    <!--display:none;-->
  <!--}-->
  <!--.el-breadcrumb__inner a:hover, .el-breadcrumb__inner.is-link:hover {-->
    <!--color:#56CD74-->
  <!--}-->
<!--</style>-->
