<template>
    <div class="mainContent">
        <div class="searchContent">
            <searchHeader
                    :showCompany="true"
                    :showLimitDate="true"
                    :showStoreCode="true"
                    :showOperateMarket="true"
                    v-on:getCompany1="getCompany"
                    v-on:getLimitDate1="getBookDate"
                    v-on:getStoreCode1="getStore"
                    v-on:getOperateMarkets1="getOperateMarkets"
                    :dataLabel="'营业日期'"
                    ref="fscCardSaleCheckHeader"
            > <el-button size="small" type="success"  @click="fscCardsSaleCheckList(1)">查询</el-button>
                <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
                <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
            </searchHeader>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="fscCardSaleCheckTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    // import api from '@/model/api'
    import apidr from '@/model/apidr'
    import searchHeader from '@/components/common/searchHeader'
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'

    export default {
        name: 'fscCardSaleCheck',
        components: {
            tableOrigin,
            searchHeader
        },
        data () {
            return {
                align:'center',
                dynamicData:[],
                storeCode: '',
                bookDate: '',
                company: '',
                operateMarket: '',
                tableHead: [
                    {
                        label: '餐厅编号',
                        prop: 'resCode'
                    },
                    {
                        label: '餐厅简称',
                        prop: 'resName'
                    },
                    {
                        label: '营运市场',
                        prop: 'resOprMarket'
                    },
                    {
                        label: '法人公司',
                        prop: 'resEntity'
                    },
                    {
                        label: '营业日期',
                        prop: 'operationDate'
                    },
                    {
                        label: '交易金额',
                        prop: 'tradeAmount'
                    },
                    {
                        label: 'BOH报送值',
                        prop: 'bohAmount'
                    },
                    {
                        label: '差异金额',
                        prop: 'diffAmount'
                    },
                ],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
            }
        },
        methods: {
            handleSizeChange (size) {
                this.pageSize = size
                this.fscCardsSaleCheckList()
            },
            handleCurrentChange (currentPage) {
                this.currentPage = currentPage
                this.fscCardsSaleCheckList()
            },
            reset () {
               this.$refs.fscCardSaleCheckHeader.reset();
            },
            exportFile () {
                let that = this;
                apidr.downloadFscCardsSaleCheck(this.getParam(), 'application/vnd.ms-excel', function(res, header){
                    that.common.exportTemplate('百胜卡售卖核对报.xlsx', res);
                })
            },
            getParam(){
              return this.common.joinSearchParam([
                  {
                      name: 'pageIndex',
                      value: this.currentPage
                  }, {
                      name: 'pageSize',
                      value: this.pageSize
                  }, {
                      name: 'operationDateStart',
                      value: this.bookDate?this.bookDate[0]:null,
                  }, {
                      name: 'operationDateEnd',
                      value: this.bookDate?this.bookDate[1]:null,
                  }, {
                      name: 'resCode',
                      value: this.storeCode
                  }, {
                      name: 'resEntity',
                      value: this.company
                  }, {
                      name: 'resOprMarket',
                      value: this.operateMarket
                  }
              ])
            },
            fscCardsSaleCheckList (num) {
                let that = this;
                if(num === 1){
                    this.currentPage = 1;
                }
                apidr.fscCardsSaleCheckList(this.getParam(), function(res){
                    if (res.code === 200) {
                        that.dynamicData = res.data.list
                        that.totalRecords = res.data.totalRecords
                    } else if (res.code === 404) {
                        that.dynamicData = [];
                        that.totalRecords = 0
                    }
                })
            },
            getStore(res){
                this.storeCode = res;
            },
            getBookDate(res){
                this.bookDate = res;
            },
            getCompany(res){
                this.company = res;
            },
            getOperateMarkets(res){
                this.operateMarket = res;
            }
        },
    }
</script>

<style>
</style>
