<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">截止月份</div>
                <el-date-picker v-model="summaryDate" type="month"
                                value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
            </div>
            <el-button size="small" type="success" @click="searchList(1)">查询</el-button>
            <el-button size="small" type="success" @click="reset" plain class="reSet">重置</el-button>
            <el-button size="small" type="success" @click="exportFile"><i
                    class="fa fa-download c-button-icon--left"></i>下载
            </el-button>
        </div>
        <div class="dataContent">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="'center'"
                    :dynamicData="dynamicData"
                    ref="pennyCardCheckTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            >
            </tableOrigin>
        </div>
    </div>
</template>

<script>
    import apidr from '@/model/apidr'
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'

    export default {
        name: 'pennyCardCheck',
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label:'月份',
                        prop:'summaryDate'
                    },
                    {
                        label:'制卡时间/审批时间',
                        prop:'transTime'
                    },
                    {
                        label:'订单编号',
                        prop:'orderNo'
                    },
                    {
                        label:'卡面值总额/购买金额',
                        prop:'orderAmount'
                    },
                    {
                        label:'实收金额/实际支付金额',
                        prop:'payAmount'
                    },
                    {
                        label:'折扣(=卡面值总额-实收金额)',
                        prop:'cardDiscount'
                    },
                    {
                        label:'数量/购买数量',
                        prop:'cardCount'
                    },
                    {
                        label:'类型',
                        prop:'type'
                    },
                ],
                summaryDate:'',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,

            }
        },
        components: {
            tableOrigin
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val
                this.searchList()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.searchList()
            },
            searchList(num) {
                if(!this.summaryDate){
                    this.common.messageUtil({
                        type:'warning',
                        message:"请选择月份"
                    })
                    return;
                }
                if(num === 1){
                    this.currentPage = 1;
                }
                apidr.pennyCardCheckList(this.common.joinSearchParam([
                    {
                        name: 'pageIndex',
                        value: this.currentPage
                    }, {
                        name: 'pageSize',
                        value: this.pageSize
                    }, {
                        name: 'summaryDate',
                        value: this.summaryDate
                    },]), res => {
                        if (res.code === 200) {
                            this.dynamicData = res.data.list;
                            this.totalRecords = res.data.totalRecords;
                        }else{
                            this.dynamicData = [];
                            this.totalRecords = 0 ;
                        }
                })
            },
            reset() {
                this.summaryDate = ''
            },
            exportFile() {
                if(!this.summaryDate){
                    this.common.messageUtil({
                        type:'warning',
                        message:"请选择月份"
                    })
                    return;
                }
                apidr.downloadPennyCardCheck({summaryDate:this.summaryDate}, 'application/vnd.ms-excel', res=> {
                   this.common.exportTemplate('小额纸质卡券盘点表.xlsx',res)
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>
