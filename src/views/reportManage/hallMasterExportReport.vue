<template>
    <div class="hallMasterExportReportTable">
        <div class="search-content">
            <searchHeader
                    :showOperateMarket="true"
                    :showStoreCode = "true"
                    v-on:getOperateMarkets1="getOperateMarkets"
                    v-on:getStoreCode1="getStoreCode"
                    @reset="reset"
                    ref="hallMasterExportReport"
                    :dataPermission="true"
            >
                <!--<div class="selectContent">-->
                <!--<div class="selectTitle">餐厅名称</div>-->
                <!--<el-input size="small" v-model.trim="storeName" clearable></el-input>-->
                <!--</div>-->
            </searchHeader>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small" type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="hallMasterExportTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
        <el-dialog title="餐厅导出项选择" :visible.sync="exportItemsDialog">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox-group v-model="checkList" @change="handleCheckedItemsChange" class="margin-top">
                <el-checkbox v-for="(item,index) in exportItems"
                             :key="index" :label="item[1]"
                >{{item[0]}}
                </el-checkbox>
            </el-checkbox-group>
            <el-row class="margin-top" type="flex" justify="center">
                <el-button size="small" type="success" class="findButt" @click="exportItemsFn">下载</el-button>
                <el-button size="small" type="success" class="findButt" @click="exportItemsDialog=false">关闭
                </el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import api from '@/model/apidr'
    import searchHeader from '@/components/common/searchHeader'


    export default {
        name: "hallMasterExportReport",
        components: {
            tableOrigin,
            searchHeader
        },
        data() {
            return {
                exportItemsDialog: false,
                checkAll: false,
                isIndeterminate: false,
                checkList: [],
                exportItems: [],
                allItems: [],
                dynamicData: [],
                tableHead: [
                    {
                        label: 'Hyp Code',
                        prop: 'storeHypId'
                    },
                    {
                        label: 'JDE code',
                        prop: 'storeJdeCode'
                    },
                    {
                        label: '餐厅中文简称',
                        prop: 'storeChineseName'
                    },
                    {
                        label: '品牌',
                        prop: 'brand'
                    },
                    {
                        label: '财务市场',
                        prop: 'financialMarket'
                    },
                    {
                        label: '法人公司',
                        prop: 'companyName'
                    },
                    {
                        label: '开票单位',
                        prop: 'billingUnitName'
                    },
                    {
                        label: '营运市场',
                        prop: 'operateMarket'
                    },
                    {
                        label: '开店日期',
                        prop: 'startDate'
                    },
                    {
                        label: '关店日期',
                        prop: 'endDate'
                    },
                    {
                        label: '临时停业开始日',
                        prop: 'stopStartDate'
                    },
                    {
                        label: '临时停业结束日',
                        prop: 'stopEndDate'
                    },
                    {
                        label: '临时停业原因',
                        prop: 'stopReason'
                    },

                    {
                        label: '存行频率',
                        prop: 'storageFrequency'
                    },
                    {
                        label: '存行类型',
                        prop: 'storageType'
                    },
                    {
                        label: '周末是否存行',
                        prop: 'weekendStorage'
                    },
                    {
                        label: '节假日是否存行',
                        prop: 'holidayStorage'
                    },
                    {
                        label: 'RGM',
                        prop: 'rgm'
                    },
                    {
                        label: 'RGM电话',
                        prop: 'rgmMobile'
                    },
                    {
                        label: 'RGM邮箱',
                        prop: 'rgmEmail'
                    },
                    {
                        label: 'AM',
                        prop: 'am'
                    },
                    {
                        label: 'AM电话',
                        prop: 'amMobile'
                    },
                    {
                        label: 'AM邮箱',
                        prop: 'amEmail'
                    },
                    {
                        label: 'DM',
                        prop: 'dm'
                    },
                    {
                        label: 'DM电话',
                        prop: 'dmMobile'
                    },
                    {
                        label: 'DM邮箱',
                        prop: 'dmEmail'
                    },
                    {
                        label: 'MM',
                        prop: 'mm'
                    },
                    {
                        label: 'MM电话',
                        prop: 'mmMobile'
                    },
                    {
                        label: 'MM邮箱',
                        prop: 'mmEmail'
                    },
                    {
                        label: 'FM',
                        prop: 'fm'
                    },
                    {
                        label: 'FM电话',
                        prop: 'fmMobile'
                    },
                    {
                        label: 'FM邮箱',
                        prop: 'fmEmail'
                    },
                    {
                        label: 'FBC',
                        prop: 'fbc'
                    },
                    {
                        label: 'FBC电话',
                        prop: 'fbcMobile'
                    },
                    {
                        label: 'FBC邮箱',
                        prop: 'fbcEmail'
                    },

                ],
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                financialMarket: '',
                legalCompany: '',
                operateMarket: '',
                storeCode: '',
                billingUnit: '',
                bookDate: [],
                storeName: ''
            }
        },
        methods: {
            handleCheckedItemsChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.allItems.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allItems.length;
            },
            handleCheckAllChange(val) {
                this.checkList = val ? this.allItems : [];
                this.isIndeterminate = false;
            },
            getExportItems() {
                let that = this;
                api.getHallMasterExportItems((res) => {
                    // that.exportItems = _.toPairs(res.data);
                    that.allItems = Object.values(res.data);
                    that.$set(that, 'exportItems', _.toPairs(res.data))
                })
            },
            exportItemsFn() {
                let that = this;
                api.downloadHallMasterExport({
                    "companyCode": that.legalCompany,
                    "exportAllField": that.checkAll,
                    "exportFields": that.checkList,
                    "financialMarket": that.financialMarket,
                    "operateMarket": that.operateMarket,
                    "storeHypId": that.storeCode,
                }, 'application/vnd.ms-excel', function (res, header) {
                    that.common.exportTemplate('餐厅主档导出.xlsx', res);
                })
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getData(pageIndex) {
                if (pageIndex) {
                    this.currentPage = 1;
                }
                let that = this;
                api.getHallMasterExportList(this.getParam(), function (res) {
                    if (res.code === 200) {
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    } else {
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }
                })
            },
            getParam() {
                return this.common.joinSearchParam([
                    {
                        value: this.financialMarket,
                        name: 'financialMarket'
                    },
                    {
                        value: this.legalCompany,
                        name: 'companyCode'
                    },
                    {
                        value: this.operateMarket,
                        name: 'operateMarket'
                    },
                    {
                        value:this.storeCode,
                        name:'storeHypId'
                    },
                    {
                        value: this.currentPage,
                        name: 'pageIndex'
                    },
                    {
                        value: this.pageSize,
                        name: 'pageSize'
                    },
                ])
            },
            reset() {
                this.$refs.hallMasterExportReport.reset();
            },
            download() {
                this.checkList = [];
                this.isIndeterminate = false;
                this.exportItemsDialog = true;
                let that = this;
                this.exportItems.forEach(item=>{
                    that.checkList.push(item[1])
                })
                this.checkAll = true;
            },
            getStoreCode(res) {
                this.storeCode = res;
            },
            getCompany(res) {
                this.legalCompany = res;
            },
            getFinancial(res) {
                this.financialMarket = res;
            },
            getOperateMarkets(res) {
                this.operateMarket = res;
            },
        },
        mounted() {
            this.getExportItems();
        }
    }
</script>

<style scoped>

    .margin-top {
        margin-top: 15px;
    }

    .margin-top /deep/ .el-checkbox {
        margin-right: 20px;
        margin-left: 0;
        width: 30%;
        box-sizing: border-box;
    }

    .margin-top /deep/ .el-checkbox:nth-of-type(3n) {
        margin-right: 0;
    }

</style>
