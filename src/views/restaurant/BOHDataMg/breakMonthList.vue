<template>
    <div class="mainContent">
        <div class="searchContent">
            <searchHeader
                    :showCompany="true"
                    :showDate="true"
                    :showStoreCode="true"
                    :dataLabel="'破月日期'"
                    v-on:getCompany1="getCompany"
                    v-on:getBookDate="getBookDate"
                    v-on:getStoreCode1="getStore"
                    ref="breakMonthListHeader"
            >
                <div class="selectContent">
                    <div class="selectTitle">租赁号</div>
                    <el-input size="small"  v-model="rentNum" placeholder="请输入租赁号"  clearable></el-input>
                </div>
                <el-button size="small" type="success"  @click="getData(1)">查询</el-button>
                <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
                <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
            </searchHeader>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="breakMonthListTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    import apidr from '@/model/apidr'
    import searchHeader from '@/components/common/searchHeader'
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'

    export default {
        name: 'breakMonthList',
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
                rentNum:'',
                tableHead: [
                    {
                        label: '法人公司',
                        prop: 'companyCode'
                    },
                    {
                        label: '餐厅',
                        prop: 'storeCode'
                    },
                    {
                        label: '租赁号',
                        prop: 'rentNum'
                    },
                    {
                        label: '版本',
                        prop: 'version'
                    },
                    {
                        label: '报告年终月',
                        prop: 'reportMonth'
                    },
                    {
                        label: '年结是否破月',
                        prop: 'monthBreakFlag'
                    },
                    {
                        label: '先收票后付款/先付款后收票',
                        prop: 'invoiceReciveOrder'
                    },
                    {
                        label: '不动产码2',
                        prop: 'realEstateCode'
                    },
                    {
                        label: '结算方式',
                        prop: 'settleAccountsType'
                    },
                    {
                        label: '当前期间是否年结',
                        prop: 'isYearEnd'
                    },
                    {
                        label: '破月日期',
                        prop: 'monthBreakDate'
                    },
                    {
                        label: '是否SOV最后一期',
                        prop: 'isLastSov'
                    },
                    {
                        label: '取数规则',
                        prop: 'fetchRules'
                    },
                    {
                        label: 'L取数规则破月日期前一期',
                        prop: 'lastFetchRules'
                    },
                    {
                        label: '是否L取数规则SOV计提最后第二期',
                        prop: 'beforeLastFetchRules'
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
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange (currentPage) {
                this.currentPage = currentPage
                this.getData()
            },
            reset () {
               this.rentNum = '';
               this.$refs.breakMonthListHeader.reset();
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
                      name: 'preBreakDate',
                      value: this.bookDate?this.bookDate[0]:null,
                  }, {
                      name: 'finalBreakDate',
                      value: this.bookDate?this.bookDate[1]:null,
                  }, {
                      name: 'company',
                      value: this.storeCode
                  }, {
                      name: 'company',
                      value: this.company
                  }, {
                      name: 'rentNum',
                      value: this.rentNum
                  }
              ])
            },
            getData (num) {
                let that = this;
                if(!this.bookDate || this.bookDate.length === 0){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请输入破月日期'
                    });
                    return;
                }
                if(num === 1){
                    this.currentPage = 1;
                }

                apidr.breakMonthList(this.getParam(), function(res){
                    if (res.code === 200) {
                        that.dynamicData = res.data.list
                        that.totalRecords = res.data.totalRecords
                    }else{
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }
                })
            },
            exportFile () {
                let that = this;
                apidr.downLoadbreakMonthList(this.getParam(), 'application/vnd.ms-excel', function(res, header){
                    that.common.exportTemplate('破月清单数据.xlsx', res);
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
        },
    }
</script>

<style>
</style>
