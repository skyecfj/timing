<template>
    <div class="lossGainReportTable">
        <!--<div class="search-content">-->
            <searchHeader
             :dataLabel="'营业日期'"
             :showLimitDate="true"
             :limitDays="366"
             :showOperateMarket="true"
             v-on:getOperateMarkets1="getOperateMarkets"
             v-on:getLimitDate="getBookDate"
             @reset="reset"
             :dataPermission="true"
             ref="saveLineFrequencyReport"
            >
                <!--<div class="selectContent">-->
                    <!--<div class="selectTitle">餐厅名称</div>-->
                    <!--<el-input size="small" v-model.trim="storeName" clearable></el-input>-->
                <!--</div>-->
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
            </searchHeader>
        <!--</div>-->
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="saveLineFrequencyTable"
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
    import searchHeader from '@/components/common/searchHeader'
    export default {
        name: "saveLineFrequency",
        components: {
            tableOrigin,
            searchHeader
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label:'餐厅编号',
                        prop:'storeCode'
                    },
                    {
                        label:'营业日期',
                        prop:'tradeDate'
                    },
                    {
                        label:'应存行日期',
                        prop:'depositDate'
                    },
                    {
                        label:'法人公司',
                        prop:'companyName'
                    },
                    {
                        label:'营运市场',
                        prop:'operateMarket'
                    },
                    {
                        label:'财务市场',
                        prop:'financialMarket'
                    },

                ],
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                // financialMarket:'',
                // legalCompany:'',
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
                api.getSaveLineFrequencyList(this.getParam(),function(res){
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
                return this.common.joinSearchParam([
                    {
                        value:this.operateMarket,
                        name:'operateMarket'
                    },
                    {
                        value:this.bookDate?this.bookDate[1]:null,
                        name:'tradeDateEnd'
                    },
                    {
                        value:this.bookDate?this.bookDate[0]:null,
                        name:'tradeDateStart'
                    },
                    {
                        value:this.currentPage,
                        name:'pageIndex'
                    },
                    {
                        value:this.pageSize,
                        name:'pageSize'
                    },
                ])
            },
            reset() {
                this.$refs.saveLineFrequencyReport.reset();
            },
            download(){
                let that = this;
                api.downloadSaveLineFrequency(this.getParam(),'application/vnd.ms-excel',function(res,header){
                    that.common.exportTemplate('存行频率报表.xlsx',res);
                })
            },
            getBookDate(res){
              this.bookDate = res;
            },
            // getCompany(res){
            //     this.legalCompany = res;
            // },
            // getFinancial(res){
            //     this.financialMarket = res;
            // },
            getOperateMarkets(res){
                this.operateMarket = res;
            },
        },
    }
</script>

<style scoped>

</style>
