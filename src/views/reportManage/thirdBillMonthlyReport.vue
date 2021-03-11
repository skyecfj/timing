<template>
    <div class="thirdBillMonthlyReportTable">
        <div class="search-content">
            <el-date-picker
                    type="daterange"
                    v-model="bookDate"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    size="small"
            >
            </el-date-picker>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="thirdBillMonthlyReportTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import api from '@/model/apidr'
    // import searchHeader from '@/components/common/searchHeader'
    export default {
        name: "thirdBillMonthlyReport",
        components: {
            tableOrigin,
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label:'交易日期',
                        prop:'tradeDate'
                    },
                    {
                        label:'应接入法人数量',
                        prop:'shouldImportCompany'
                    },
                    {
                        label:'已接入法人数量',
                        prop:'importedCompany'
                    },
                    {
                        label:'未接入法人数量',
                        prop:'unImportedCompany'
                    },
                    {
                        label:'活动名称',
                        prop:'activityName'
                    }
                ],
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                financialMarket:'',
                legalCompany:'',
                operateMarket:'',
                storeCode:'',
                billingUnit:'',
                bookDate:[],
                storeName:''
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getData(pageIndex) {
                if(pageIndex){
                    this.currentPage = 1;
                }
                let that = this;
                api.getThirdBillReportMonth(this.getParam(),function(res){
                    if(res.code === 200){
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }else{
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }
                })
            },
            getParam(){
                return {
                    startDate:this.bookDate?this.bookDate[0]:null,
                    endDate:this.bookDate?this.bookDate[1]:null,
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize
                }
            },
            reset() {
                this.bookDate = [];
            },
            download(){
                let that = this;
                api.downloadThirdBillReportMonth(this.getParam(),'application/vnd.ms-excel',function(res,header){
                    // let name = header['content-disposition'];
                    // that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                    that.common.exportTemplate('账单导入月报告.xlsx',res)
                })
            },
        },
    }
</script>

<style scoped>

</style>
