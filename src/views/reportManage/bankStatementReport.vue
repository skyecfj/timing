<template>
    <div class="bankStatementReportTable">
        <div class="search-content" >
            <div class="selectContent">
                <div class="selectTitle">上账日期</div>
                <el-date-picker
                        type="daterange"
                        v-model="bookDate"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        size="small"
                >
                </el-date-picker>
            </div>
            <el-button size="small"  type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content" >
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="bankStatementReportTable"
                    @handleSizeChange ="handleSizeChange"
                    @handleCurrentChange = "handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import api from '@/model/apidr'
    export default {
        name: "bankStatementReport",
        components:{
            tableOrigin
        },
        data(){
            return {
                dynamicData:[],
                tableHead:[
                    {
                        label:'上账日期',
                        prop:'bookDate'
                    },
                    {
                        label:'应导入流水的银行数量',
                        prop:'isImportStatusCount'
                    },
                    {
                        label:'未导入流水的银行数量',
                        prop:'isNotImportStatusCount'
                    },
                    {
                        label:'H2H无的银行数量',
                        prop:'noGetDataBankCount'
                    },
                    {
                        label:'待接入流水余额不一致的银行数量',
                        prop:'invalidImportBankCount'
                    },

                ],
                align:'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords:0,
                bookDate:[]
            }
        },
        methods:{
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData();
            },
            getData(param){
                let that = this;
                if(param){
                    this.currentPage = 1;
                }
                api.bankStatementReportList({
                    endDate:this.bookDate?this.bookDate[1]:'',
                    startDate:this.bookDate?this.bookDate[0]:'',
                    pageSize:this.pageSize,
                    pageIndex:this.currentPage
                },function(res){
                    if(res.code === 200){
                        that.totalRecords = res.data.totalRecords;
                        that.dynamicData = res.data.list;
                    }else{
                        that.totalRecords = 0;
                        that.dynamicData = [];
                    }
                })
            },
            download(){
                let that = this;
                api.bankStatementReportDownload({
                    endDate:this.bookDate?this.bookDate[1]:'',
                    startDate:this.bookDate?this.bookDate[0]:'',},'application/vnd.ms-excel',function(res){
                    that.common.exportTemplate('银行流水导入月报告.xlsx',res);
                })
            },
            reset(){
                this.bookDate = [];
            }
        },
        mounted(){
            this.getData();
        }
    }
</script>

<style scoped>

</style>
