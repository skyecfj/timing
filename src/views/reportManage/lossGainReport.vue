<template>
    <div class="lossGainReportTable">
        <div class="search-content">
            <searchHeader
             :showStoreCode="true"
             :showCompany="true"
             :showFinancialMarket="true"
             :showDate="true"
             v-on:getStoreCode1="getStoreCode"
             v-on:getCompany1="getCompany"
             v-on:getFinancial1="getFinancial"
             v-on:getBillingUnits1="getBillingUnits"
             v-on:getOperateMarkets1="getOperateMarkets"
             v-on:getBookDate="getBookDate"
             @reset="reset"
             ref="lossGainReport"
            >
                <div class="selectContent">
                    <div class="selectTitle">餐厅名称</div>
                    <el-input size="small" v-model.trim="storeName" clearable></el-input>
                </div>
            </searchHeader>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="lossGainReportTable"
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
        name: "lossGainReport",
        components: {
            tableOrigin,
            searchHeader
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label:'法人',
                        prop:'companyName'
                    },
                    {
                        label:'餐厅BU',
                        prop:'storeBU'
                    },
                    {
                        label:'餐厅编号',
                        prop:'storeCode'
                    },
                    {
                        label:'餐厅名称',
                        prop:'storeName'
                    },
                    {
                        label:'营业款所属日期',
                        prop:'bizDateStr'
                    },
                    {
                        label:'BOH报送值(现金盈亏)',
                        prop:'cashOverShort'
                    },
                    {
                        label:'BOH报送值(非现金盈亏)',
                        prop:'noCashProfitLoss'
                    },
                    {
                        label:'BOH报送值(平衡调整)',
                        prop:'balanceAdjust'
                    },
                    {
                        label:'预付卡(百胜卡短溢)',
                        prop:'prepayCard'
                    },
                    {
                        label:'餐券(餐券短溢)',
                        prop:'mealVoucher'
                    },
                    {
                       label:'财务调整',
                       prop:'financialAdjust'
                    },
                    {
                        label:'合计',
                        prop:'toatal'
                    },
                    {
                        label:'C1 无BOH手工补录',
                        prop:'manualSupplement'
                    },
                    {
                        label:'C2 BOH数据缺失',
                        prop:'dataMissing'
                    },
                    {
                        label:'C3 BOH不平',
                        prop:'unEven'
                    },
                    {
                        label:'C4 第三方账单缺失',
                        prop:'thirdBillsMissing'
                    },
                    {
                        label:'C5 餐厅存回应存未存的营业款',
                        prop:'businessPayment'
                    },
                    {
                        label:'C6 POS端数据整理',
                        prop:'dataReduction'
                    },
                    {
                        label:'C7 串户',
                        prop:'missortAmount'
                    },
                    {
                        label:'C8 数据录入错误',
                        prop:'errorDataEntry'
                    },
                    {
                        label:'C9 依据第三方直连账单调整',
                        prop:'thirdBillsAdjust'
                    },
                    {
                        label:'C10 账单与上账差异调整',
                        prop:'differenceAdjust'
                    },
                    {
                        label:'C11 以现金补存非现金',
                        prop:'depositNonCash'
                    },

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
                api.getLossGainList(this.getParam(),function(res){
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
                        value:this.financialMarket,
                        name:'financialMarket'
                    },
                    {
                        value:this.legalCompany,
                        name:'companyCode'
                    },
                    {
                        value:this.storeCode,
                        name:'storeCode'
                    },
                    {
                        value:this.storeName,
                        name:'storeName'
                    },
                    {
                        value:this.bookDate?this.bookDate[1]:null,
                        name:'bizDateEnd'
                    },
                    {
                        value:this.bookDate?this.bookDate[0]:null,
                        name:'bizDateBegin'
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
                this.storeName = '';
                this.$refs.lossGainReport.reset();
            },
            download(){
                let that = this;
                api.downloadLossGain(this.getParam(),'application/vnd.ms-excel',function(res,header){
                    let name = header['content-disposition'];
                    that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
            getBookDate(res){
              this.bookDate = res;
            },
            getStoreCode(res){
                this.storeCode = res;
            },
            getCompany(res){
                this.legalCompany = res;
            },
            getFinancial(res){
                this.financialMarket = res;
            },
            getBillingUnits(res){
                this.billingUnit = res;
            },
            getOperateMarkets(res){
                this.operateMarket = res;
            },
        },
    }
</script>

<style scoped>

</style>
