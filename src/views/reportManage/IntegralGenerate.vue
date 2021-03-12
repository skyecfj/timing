<template>
    <div class="IntegralGenerateTable">
        <div class="search-content">
            <div class="selectTitle">日期</div>
            <el-date-picker
                    type="month"
                    v-model="bookDateStart"
                    range-separator="-"
                    value-format="yyyyMM"
                    size="small"
                    v-if="tabName === 'first'"
            >
            </el-date-picker>
            <span v-if="tabName === 'first'">-</span>
            <el-date-picker
                    type="month"
                    v-model="bookDateEnd"
                    range-separator="-"
                    value-format="yyyyMM"
                    size="small"
                    v-if="tabName === 'first'"
            >
            </el-date-picker>
            <el-date-picker
                    type="year"
                    v-model="bookDateYear"
                    v-if="tabName === 'second'"
                    range-separator="-"
                    value-format="yyyy"
                    size="small"
            >
            </el-date-picker>
            <el-select v-model="quarter" v-if="tabName === 'second'">
                <el-option value="">请选择</el-option>
                <el-option  value="1" label="第一季度"></el-option>
                <el-option value="2" label="第二季度"></el-option>
                <el-option value="3" label="第三季度"></el-option>
                <el-option value="4" label="第四季度"></el-option>
            </el-select>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <el-tabs v-model="tabName" @tab-click="handleClick">
                <el-tab-pane label="积分生成报表按月度" name="first" >
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
                <el-tab-pane label="积分生成报表按季度" name="second">
                    <tableOrigin
                            :tableHead="tableHead"
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
        name: "IntegralGenerateReport",
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
                        prop:'invoiceUnit'
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
                        label:'New Earned(消费积分)a',
                        prop:'consumptionPoints'
                    },
                    {
                        label:'积分费率b',
                        prop:'integralRate'
                    },
                    {
                        label:'金额 c=a*b',
                        prop:'fFsAmount'
                    },
                    {
                        label:'金额(不含税)d=c-e',
                        prop:'exFFsAmount'
                    },
                    {
                        label:'税额',
                        prop:'taxAmount'
                    }

                ],
                dynamicData2: [],
                // tableHead2: [
                //     {
                //         label:'开票单位99店',
                //         prop:'billingUnitNnCode'
                //     },
                //     {
                //         label:'餐厅编号',
                //         prop:'resCode'
                //     },
                //     {
                //         label:'法人',
                //         prop:'companyCode'
                //     },
                //     {
                //         label:'法人名称',
                //         prop:'companyName'
                //     },
                //     {
                //         label:'产品内部结算价格(含税)',
                //         prop:'internalPrice'
                //     },
                //     {
                //         label:'VAT',
                //         prop:'vatAmount'
                //     },
                //     {
                //         label:'不含税价',
                //         prop:'exTaxAmount'
                //     },

                // ],
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                // currentPage2:1,
                totalRecords: 0,
                // totalRecords2:0,
                bookDate:[],
                tabName:'first',
                bookDateStart:'',
                bookDateEnd:'',
                quarter:'',
                bookDateYear:''
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
                    if((!this.bookDateStart && this.bookDateEnd)||(this.bookDateStart && !this.bookDateEnd)||(this.bookDateStart >this.bookDateEnd)){
                        this.$message({
                            type:'warning',
                            message:'请选择正确的日期区间！'
                        })
                        return;
                    }
                    api.integralGenerateListMonth(this.getParam(1),function(res){
                        that.dynamicData = [];
                        that.totalRecords = 0;
                        if(res.code === 200){
                            that.dynamicData = res.data.list;
                            that.totalRecords = res.data.totalRecords;
                        }
                    })
                }else{
                    api.integralGenerateListSeason(this.getParam(2),function(res){
                        that.dynamicData2 = [];
                        that.totalRecords = 0;
                        if(res.code === 200){
                            that.dynamicData2 = res.data.list;
                            that.totalRecords = res.data.totalRecords;
                        }
                    })
                }
            },
            getParam(type){
                if(type === 1){
                    return this.common.joinSearchParam([
                        {
                            value:this.bookDateStart,
                            name:'startMonth'
                        },
                        {
                            value:this.bookDateEnd,
                            name:'endMonth'
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
                }else{
                    return this.common.joinSearchParam([
                        {
                            value:this.bookDateYear,
                            name:'year'
                        },
                        {
                            value:this.quarter,
                            name:'quarter'
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
                }
            },
            reset() {
                this.bookDateStart = '';
                this.bookDateEnd = '';
                this.quarter = '';
                this.bookDateYear = '';
            },
            download(){
                let that = this;
                if((!this.bookDateStart && this.bookDateEnd)||(this.bookDateStart && !this.bookDateEnd)||(this.bookDateStart >this.bookDateEnd)){
                    this.$message({
                        type:'warning',
                        message:'请选择正确的日期区间！'
                    })
                    return;
                }
                if(this.tabName === 'first'){
                    api.downloadIntegralGenerateMonth({
                        startMonth:this.bookDateStart,
                        endMonth:this.bookDateEnd,
                    },'application/vnd.ms-excel',function(res,header){
                        that.common.exportTemplate('积分生成报表按月度.xlsx',res);
                    })
                }else{
                    api.downloadIntegralGenerateSeason({
                        year:this.bookDateYear,
                        quarter:this.quarter,
                    },'application/vnd.ms-excel',function(res,header){
                        that.common.exportTemplate('积分生成报表按季度.xlsx',res);
                    })
                }

            },
            getBookDate(res){
              this.bookDate = res;
            },
            handleClick(name){
                this.bookDateStart = '';
                this.bookDateEnd = '';
                this.quarter = '';
                this.bookDateYear = '';
                this.pageSize = 10;
                this.currentPage = 1;
                // this.getData();
            }
        },
    }
</script>

<style scoped>

</style>
