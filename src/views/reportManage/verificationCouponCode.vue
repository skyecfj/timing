<template>
    <div class="verificationCouponCodeTable">
        <div class="search-content">
            <searchHeader
             :showDate="true"
             v-on:getBookDate="getBookDate"
             @reset="reset"
             :dataLabel="'核销日期'"
             ref="lossGainReport"
            >
                <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
                <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
                <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
            </searchHeader>

        </div>
        <div class="content">
            <el-tabs v-model="tabName" >
                <el-tab-pane label="积分券码核销按开票单位" name="first" @tab-click="handleClick">
                    <tableOrigin
                            :tableHead="tableHead"
                            :align="align"
                            :dynamicData="dynamicData"
                            ref="verificationCouponCodeTable"
                            @handleSizeChange="handleSizeChange"
                            @handleCurrentChange="handleCurrentChange"
                            :totalRecords="totalRecords"
                            :pageIndex="currentPage"
                    ></tableOrigin>
                </el-tab-pane>
                <el-tab-pane label="积分券码核销按餐厅" name="second">
                    <tableOrigin
                            :tableHead="tableHead2"
                            :align="align"
                            :dynamicData="dynamicData2"
                            ref="verificationCouponCodeTable2"
                            @handleSizeChange="handleSizeChange"
                            @handleCurrentChange="handleCurrentChange"
                            :totalRecords="totalRecords"
                            :pageIndex="currentPage"
                    ></tableOrigin>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import api from '@/model/apidr'
    import searchHeader from '@/components/common/searchHeader'
    export default {
        name: "verificationCouponCodeReport",
        components: {
            tableOrigin,
            searchHeader
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label:'开票单位99店',
                        prop:'billingUnitNnCode'
                    },
                    {
                        label:'开票单位代码',
                        prop:'billingUnit'
                    },
                    {
                        label:'法人',
                        prop:'companyCode'
                    },
                    {
                        label:'法人名称',
                        prop:'companyName'
                    },
                    {
                        label:'nature',
                        prop:'nature'
                    },
                    {
                        label:'brand',
                        prop:'brand'
                    },
                    {
                        label:'产品内部结算价格(含税)',
                        prop:'internalPrice'
                    },
                    {
                        label:'VAT',
                        prop:'vatAmount'
                    },
                    {
                        label:'不含税价',
                        prop:'exTaxAmount'
                    },

                ],
                dynamicData2: [],
                tableHead2: [
                    {
                        label:'开票单位99店',
                        prop:'billingUnitNnCode'
                    },
                    {
                        label:'餐厅编号',
                        prop:'resCode'
                    },
                    {
                        label:'法人',
                        prop:'companyCode'
                    },
                    {
                        label:'法人名称',
                        prop:'companyName'
                    },
                    {
                        label:'nature',
                        prop:'nature'
                    },
                    {
                        label:'brand',
                        prop:'brand'
                    },
                    {
                        label:'产品内部结算价格(含税)',
                        prop:'internalPrice'
                    },
                    {
                        label:'VAT',
                        prop:'vatAmount'
                    },
                    {
                        label:'不含税价',
                        prop:'exTaxAmount'
                    },

                ],
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                // currentPage2:1,
                totalRecords: 0,
                // totalRecords2:0,
                bookDate:[],
                tabName:'first'
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
                if(this.tabName === 'first'){
                    api.verificationCouponCodeList(this.getParam(),function(res){
                        that.dynamicData = [];
                        that.totalRecords = 0;
                        if(res.code === 200){
                            that.dynamicData = res.data.list;
                            that.totalRecords = res.data.totalRecords;
                        }
                    })
                }else{
                    api.verificationCouponCodeResList(this.getParam(),function(res){
                        that.dynamicData2 = [];
                        that.totalRecords = 0;
                        if(res.code === 200){
                            that.dynamicData2 = res.data.list;
                            that.totalRecords = res.data.totalRecords;
                        }
                    })
                }
            },
            getParam(){
                return this.common.joinSearchParam([
                    {
                        value:this.bookDate?this.bookDate[1]:null,
                        name:'endUsedTime'
                    },
                    {
                        value:this.bookDate?this.bookDate[0]:null,
                        name:'startUsedTime'
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
                this.$refs.lossGainReport.reset();
            },
            download(){
                let that = this;
                if(this.tabName === 'first'){
                    api.downloadVerificationCouponCode({
                        endUsedTime:this.bookDate?this.bookDate[1]:null,
                        startUsedTime:this.bookDate?this.bookDate[0]:null,
                    },'application/vnd.ms-excel',function(res,header){
                        that.common.exportTemplate('积分核销券码报表按开票单位.xlsx',res);
                    })
                }else{
                    api.downloadVerificationCouponCodeRes({
                        endUsedTime:this.bookDate?this.bookDate[1]:null,
                        startUsedTime:this.bookDate?this.bookDate[0]:null,
                    },'application/vnd.ms-excel',function(res,header){
                        that.common.exportTemplate('积分核销券码报表按餐厅.xlsx',res);
                    })
                }

            },
            getBookDate(res){
              this.bookDate = res;
            },
            handleClick(name){
                this.bookDate = [];
                this.pageSize = 10;
                this.currentPage = 1;
                // this.getData();
            }
        },
    }
</script>

<style scoped>

</style>
