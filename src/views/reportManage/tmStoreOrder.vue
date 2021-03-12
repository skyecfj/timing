<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">月份</div>
                <el-date-picker
                        v-model="searchData.startMonth"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月份">
                </el-date-picker>
                <span>-</span>
                <el-date-picker
                        v-model="searchData.endMonth"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月份">
                </el-date-picker>
                <div class="selectContent">
                    <div class="selectTitle">品牌</div>
                    <el-select size="small" v-model="searchData.brand" placeholder="请选择品牌" filterable>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="item in brandOptions" :key="item.brandId" :label="item.brandEnglishName"
                                   :value="item.brandEnglishName">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <el-button size="small" type="success" @click="searchList">查询</el-button>
            <el-button size="small" type="success" @click="reset" plain class="reSet">重置</el-button>
            <el-button size="small" type="success" @click="exportFile"><i
                    class="fa fa-download c-button-icon--left"></i>下载
            </el-button>
        </div>
        <div class="dataContent">
            <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
            <div class="pagination">
                <el-pagination background
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page.sync="currentPage"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="totalRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import reportTableCom from './reportTableCom.vue'
    import api from '@/model/api'

    export default {
        name: 'tmStoreOrder',
        data () {
            return {
                searchData: {
                    startMonth: '',
                    endMonth: '',
                    brand: ''
                },
                simpleTableData: [],
                simpleTableKey: [{
                    name: '截止月份',
                    value: 'month'
                }, {
                    name: '订单号',
                    value: 'orderId'
                }, {
                    name: '订单创建日期',
                    value: 'transDatetime'
                }, {
                    name: '商品种类',
                    value: 'productCategory'
                },{
                    name: '品牌',
                    value: 'brand'
                }, {
                    name: '订单金额',
                    value: 'transAmount',
                    classname: 'sumClass'
                }, {
                    name: '订单状态',
                    value: 'transStatus'
                }],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                //orderSearchData: {},
                brandOptions: []
            }
        },
        components: {
            reportTableCom
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
                this.getTmStoreOrder()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getTmStoreOrder()
            },
            searchList () {
                // this.orderSearchData = JSON.parse(JSON.stringify(this.searchData))
                this.getTmStoreOrder()
            },
            reset () {
                for (let key in this.searchData) {
                    this.searchData[key] = ''
                }
            },
            exportFile () {
                let that = this
                api.exportTmStoreOrder(this.searchData, 'application/vnd.ms-excel', function (res) {
                    if (res.code) {
                        that.common.warningMessage(res.msg)
                    } else {
                        let link = document.createElement('a')
                        link.href = res
                        link.id = 'attachmentLink'
                        link.download = '天猫待确认收货订单报表.xlsx'
                        link.target = '_blank';
                        link.click()
                    }
                })
            },
            getTmStoreOrder () {
                let that = this
                let pathParams = [{
                    name: 'pageIndex',
                    value: this.currentPage
                }, {
                    name: 'pageSize',
                    value: this.pageSize
                }, {
                    name: 'startMonth',
                    value: this.searchData.startMonth
                }, {
                    name: 'endMonth',
                    value: this.searchData.endMonth
                }, {
                    name: 'brand',
                    value: this.searchData.brand
                }]
                api.getTmStoreOrder(this.common.joinSearchParam(pathParams), function (res) {
                    that.simpleTableData = []
                    that.totalRecords = 0
                    if (res.code === 200) {
                        that.simpleTableData = res.data.list
                        that.totalRecords = res.data.totalRecords
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            showTips (text, type) {
                this.common.messageUtil({
                    message: text,
                    type: type
                })
            },
            getSearchOptioins() {
                api.getBrandList(this.common.formatPathParam({
                    pageIndex: 1,
                    pageSize: 99999999,
                    flag: 2
                }), (result)=> {
                    if (result.code === 200) {
                        this.brandOptions = result.data.list;
                    } else {
                        this.brandOptions = [];
                    }
                })
            }
        },
        beforeMount(){
            this.getSearchOptioins();
        }
    }
</script>

<style>
</style>
