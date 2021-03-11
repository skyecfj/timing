<template>
    <div class="reportFrom">
        <div class="viewHeader">
            <el-row :gutter="24">
                <el-col :span="4">
                    <div>订单行号</div>
                </el-col>
                <el-col :span="4">
                    <div>发货日期</div>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="4">
                    <el-input size="small"  placeholder="请输入内容"  v-model="orderItemId" clearable>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                            v-model="dispatchDate"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="-"
                            size="small"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-button size="small"  @click="searchReport()" class="c-button c-button--primary">查询</el-button>
                    <el-button size="small"  @click="reset" plain class="c-button" type="success">重置</el-button>
                    <el-button size="small"  class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <el-table :data="reportForm" border>
                <el-table-column type="index" width="60px" label="序号">
                </el-table-column>
                <el-table-column prop="orderItemId" show-overflow-tooltip label="订单行号" min-width="100px">
                </el-table-column>
                <el-table-column prop="itemStatusId" show-overflow-tooltip label="订单行状态" min-width="80px">
                </el-table-column>
                <el-table-column prop="subTotal" show-overflow-tooltip label="订单行金额" width="100px">
                </el-table-column>
                <el-table-column prop="productId" label="商品编号" min-width="60px">
                </el-table-column>
                <el-table-column prop="productName" label="商品名称" min-width="100px">
                </el-table-column>
                <el-table-column prop="dispatchBillId" label="发货单号" min-width="80px">
                </el-table-column>
                <el-table-column prop="shipStore" label="发货仓库" min-width="120px">
                </el-table-column>
                <el-table-column prop="quantity" label="发货数量" class-name="status-col" min-width="60px">
                </el-table-column>
                <el-table-column prop="dispatchDate" label="发货日期" min-width="100px">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizesList"
                               :page-size="pageSize" class="gross" background layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../model/api'
    export default {
        name: "reportForm",
        data(){
            return {
                orderItemId:'',
                dispatchDate:[],
                reportForm:[{
                    orderItemId:'',
                    subTotal:'',
                    productId:'',
                    productName:'',
                    dispatchBillId:'',
                    shipStore:'',
                    quantity:'',
                    dispatchDate:''
                }],
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords:0,
                endDispatchDate:'',
                startDispatchDate:'',
                localSearchParam:'',
                // downloadObject:{}
            }
        },
        methods:{
            handleSizeChange(size){
                this.pageSize = size;
                this.searchReport();
            },
            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.searchReport(currentPage);
            },
            searchReport(index){
                if(index){
                    this.currentPage = index;
                }else{
                    this.currentPage = 1;
                }
                let searchParam = this.common.joinSearchParam([
                    {name:'orderItemId',value:this.orderItemId.trim()},
                    {name:'startDispatchDate',value:this.dispatchDate?this.dispatchDate[0]:''},
                    {name:'endDispatchDate',value:this.dispatchDate?this.dispatchDate[1]:''},
                    {name:'pageSize',value:this.pageSize},
                    {name:'pageIndex',value:this.currentPage},

                ]);
                // this.downloadObject = {
                //     orderItemId:this.orderItemId.trim(),
                //     startDispatchDate:this.dispatchDate?this.dispatchDate[0]:'',
                //     endDispatchDate:this.dispatchDate?this.dispatchDate[1]:'',
                //     pageSize:this.pageSize,
                //     pageIndex:this.currentPage
                // };
                let that = this;
                this.localSearchParam = searchParam;
                if(searchParam){
                    api.getReportList(searchParam,function (res) {
                        that.reportForm = res.data?res.data.list:[];
                        that.totalRecords = res.data?res.data.totalRecords:0;
                    })
                }else{
                    this.common.messageUtil({
                        type:'info',
                        message:'请选择或者输入查询条件！'
                    })
                }
            },
            reset(){
                this.orderItemId = '';
                this.dispatchDate = '';
                this.localSearchParam = '';
            },
            exportReport(){
                let that = this;
                api.downReportOwn({
                    orderItemId:this.orderItemId.trim(),
                    startDispatchDate:this.dispatchDate?this.dispatchDate[0]:'',
                    endDispatchDate:this.dispatchDate?this.dispatchDate[1]:'',
                    pageSize:this.pageSize,
                    pageIndex:this.currentPage
                },'application/vnd.ms-excel',function(res){
                    if(res && res.code){
                        that.common.errorMessage(res.msg)
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = '自有商城发货明细.xlsx';
                        link.target = '_blank';link.click();
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/reportForm";
    .viewHeader .el-date-editor--daterange.el-input__inner {
        width:auto;
    }
</style>
