<template>
    <div class="refundDataReportTable">
        <div class="search-content">
            <searchHeader
                    :showBrand="true"
                    :showStoreCode="true"
                    :showOperateMarket="true"
                    :showFinancialMarket="true"
                    :showCompany="true"
                    :showBookData="true"
                    v-on:getBrand1="getBrand"
                    v-on:getCompany1="getCompany"
                    v-on:getFinancial1="getFinancial"
                    v-on:getStoreCode1="getStore"
                    v-on:getOperateMarkets1="getOperateMarkets"
                    v-on:getBookData1="getBookDate"
                    @reset="reset"
                    ref="refundDataReport"
            >
                <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
                <el-button size="small" type="success" class="findButt" @click="download">下载</el-button>
                <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
            </searchHeader>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="refundDataReportReportTable"
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
    import apidr from '@/model/apidr'
    import searchHeader from '@/components/common/searchHeader'

    export default {
        name: 'refundDataReport',
        components: {
            tableOrigin,
            searchHeader
        },
        data () {
            return {
                dynamicData: [],
                tableHead: [
                    {
                       label:'餐厅编号',
                       prop:'storeCode'
                    },
                    {
                        label:'支付公司',
                        prop:'paymentCompany'
                    },
                    {
                        label:'品牌',
                        prop:'brand'
                    },
                    {
                        label:'活动名称',
                        prop:'fscActivityCode'
                    },
                    {
                        label:'订单号',
                        prop:'onlinePaymentNum'
                    },
                    {
                        label:'订单系统时间',
                        prop:'orderTime'
                    },
                    {
                        label:'餐厅出餐时间',
                        prop:'orderSendTime'
                    },
                    {
                        label:'财务确认退款时间',
                        prop:'financeRefundTime'
                    },
                    {
                        label:'退款金额',
                        prop:'refundAmount'
                    },
                ],
                align: 'center',
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,

                bookDate: [],
                operateMarket: '',
                financialMarket:'',
                storeCode:'',
                brand:'',
                company:''
            }
        },
        methods: {
            handleSizeChange (size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange (currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getData (num) {
                if(num === 1){
                    this.currentPage = 1;
                }
                apidr.getRefundDataList({
                    bizDateBegin: this.bookDate?this.bookDate[0]:null,
                    bizDateEnd: this.bookDate?this.bookDate[1]:null,
                    operateCode: this.operateMarket,
                    financialMarket: this.financialMarket,
                    storeCode: this.storeCode,
                    brand: this.brand,
                    companyName: this.company,
                    pageSize: this.pageSize,
                    pageIndex: this.currentPage
                },res=>{
                    this.dynamicData =  res.code === 200? res.data.list:[];
                    this.totalRecords =  res.code === 200? res.data.totalRecords:0
                })
            },
            reset () {
                this.$refs.refundDataReport.reset();
            },
            download () {
                apidr.downloadRefundDataList({
                    bizDateBegin: this.bookDate?this.bookDate[0]:null,
                    bizDateEnd: this.bookDate?this.bookDate[1]:null,
                    operateCode: this.operateMarket,
                    financialMarket: this.financialMarket,
                    storeCode: this.storeCode,
                    brand: this.brand,
                    companyName: this.company,
                },'application/vnd.ms-excel',(res,header)=>{
                    let name = header['content-disposition'];
                    this.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
            getBookDate (res) {
                this.bookDate = res;
            },
            getOperateMarkets (res) {
                this.operateMarket = res;
            },
            getFinancial(res){
                this.financialMarket = res;
            },
            getStore(res){
                this.storeCode = res;
            },
            getBrand(res){
                this.brand = res;
            },
            getCompany(res){
                this.company = res;
            }
        },
        beforeMount(){
            this.getData();
        }
    }
</script>
