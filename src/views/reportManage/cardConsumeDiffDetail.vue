<template>
    <div class="cardConsumeDiffDetailTable">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">差异日期</div>
                <el-date-picker size="small" v-model="searchData.rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                                end-placeholder="结束日期"  value-format="yyyy-MM-dd" >
                </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">差异平台</div>
                <el-select v-model="searchData.platformCode">
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="UNP" value="UNP"></el-option>
                    <el-option label="ZHX" value="ZHX"></el-option>
                </el-select>
            </div>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small" type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="cardConsumeDiffDetailTable"
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
        name: 'cardConsumeDiffDetail',
        components: {
            tableOrigin,
            searchHeader
        },
        data () {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label: '交易日期',
                        prop: 'transDate'
                    },
                    {
                        label: '卡号',
                        prop: 'cardNo'
                    },
                    {
                        label: '原子层餐厅编号',
                        prop: 'atomResCode'
                    },
                    {
                        label: '报告层餐厅编号',
                        prop: 'aggResCode'
                    },
                    {
                        label: '原子层核销金额',
                        prop: 'atomTransAmount'
                    },
                    {
                        label: '报告层核销金额',
                        prop: 'aggTransAmount'
                    },

                    {
                        label: '差异金额',
                        prop: 'diff'
                    },


                ],
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                searchData: {
                    platformCode:'',
                    rangeDate:[]
                }
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
            getData (pageIndex) {
                if (pageIndex) {
                    this.currentPage = 1;
                }
                let that = this;
                api.cardConsumeDiffDetailList(this.getParam(), function (res) {
                    if (res.code === 200) {
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    } else {
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }
                })
            },
            getParam () {
                return this.common.joinSearchParam([
                    {
                        value: this.searchData.rangeDate?this.searchData.rangeDate[1] : null,
                        name: 'endUsedTime'
                    },
                    {
                        value: this.searchData.rangeDate?this.searchData.rangeDate[0] : null,
                        name: 'startUsedTime'
                    },
                    {
                        value: this.searchData.platformCode,
                        name: 'platformCode'
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
            reset () {
                this.searchData.platformCode = '';
                this.searchData.rangeDate = [];
            },
            download () {
                let that = this;
                if(this.searchData.rangeDate && this.searchData.rangeDate.length>1){
                    this.searchData.startUsedTime = this.searchData.rangeDate[0];
                    this.searchData.endUsedTime = this.searchData.rangeDate[1];
                }
                api.downloadCardConsumeDiffDetail(this.searchData, 'application/vnd.ms-excel', function (res, header) {
                    that.common.exportTemplate(decodeURIComponent('核销报告差异明细.xlsx'), res);
                })
            },
        },
    }
</script>

<style scoped>

</style>
