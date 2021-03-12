<!--<template>-->
    <!--<div class="billShouldButNotLegalPerson">-->
        <!--<tableOrigin-->
                <!--:tableHead="tableHead"-->
                <!--:selection="selection"-->
                <!--:align="align"-->
                <!--:dynamicData="dynamicData"-->
                <!--ref="billShouldButNotLegalPerson"-->
                <!--@handleSizeChange ="handleSizeChange"-->
                <!--@handleCurrentChange = "handleCurrentChange"-->
        <!--&gt;-->
        <!--</tableOrigin>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--import tableOrigin from '../../originalTable'-->
    <!--export default {-->
        <!--name: "billShouldButNotLegalPerson",-->
        <!--components: {-->
            <!--tableOrigin-->
        <!--},-->
        <!--data() {-->
            <!--return {-->
                <!--dynamicData: [-->
                    <!--{-->
                        <!--test1: '111',-->
                        <!--test2: '',-->
                        <!--test3: '22',-->
                        <!--test4: '',-->
                    <!--},-->
                    <!--{-->
                        <!--test1: '111',-->
                        <!--test2: '',-->
                        <!--test3: '22',-->
                        <!--test4: '',-->
                    <!--}-->
                <!--],-->
                <!--tableHead: [-->
                    <!--{-->
                        <!--label: '活动名称',-->
                        <!--prop: 'test1'-->
                    <!--},-->
                    <!--{-->
                        <!--label: '营业日期',-->
                        <!--prop: 'test2'-->
                    <!--},-->
                    <!--{-->
                        <!--label: '法人',-->
                        <!--prop: 'test3'-->
                    <!--},-->
                    <!--{-->
                        <!--label: 'BOH金额',-->
                        <!--prop: 'test4'-->
                    <!--},-->

                <!--],-->
                <!--selection: true,-->
                <!--align: 'center',-->
                <!--pageSizesList: [5, 10, 15, 20, 25],-->
                <!--pageSize: 10,-->
                <!--currentPage: 1,-->
                <!--totalRecords: 0,-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--handleSizeChange(size) {-->
                <!--this.pageSize = size;-->
                <!--console.log(size);-->
            <!--},-->
            <!--handleCurrentChange(currentPage) {-->
                <!--this.currentPage = currentPage;-->
                <!--console.log(currentPage);-->
            <!--},-->
        <!--}-->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->