<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">商户订单号</div>
                <el-input v-model="orderId" size="small" clearable placeholder="请输入订单号"></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">订单创建时间</div>
                <el-date-picker size="small"
                      v-model="verifyTime"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      clearable
                      value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
            <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="reset"  class="c-button c-button--plain">重置</el-button>
            <el-button size="small"   @click="exportFile" class="c-button c-button--primary">下载</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tmStoreOrderData" style="width: 100%" border>
                <el-table-column prop="bankOrderId" label="银行订单号" >
                </el-table-column>
                <el-table-column prop="brand" label="品牌">
                </el-table-column>
                <el-table-column prop="createTime" label="订单创建时间" >
                </el-table-column>
                <el-table-column prop="no" label="序号"  >
                </el-table-column>
                <el-table-column prop="orderAmount" label="订单金额"  >
                </el-table-column>
                <el-table-column prop="orderId" label="商户订单号"  >
                </el-table-column>
                <el-table-column prop="orderStatus" label="订单状态"  >
                </el-table-column>
                <el-table-column prop="rechargeFee" label="退服务费"  >
                </el-table-column>
                <el-table-column prop="refundAmount" label="退款金额"  >
                </el-table-column>
                <el-table-column prop="serviceFee" label="服务费"  >
                </el-table-column>
                <el-table-column prop="transactionNo" label="支付宝交易号"  >
                </el-table-column>
            </el-table>
             <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../../model/api'
 export default {
     name:'tmStoreOrderData',
     data(){
        return {
         jobId:'',
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         verifyTime:[],
         orderId:'',
         //createTime:'',
         tmStoreOrderData:[]
       }
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getTmStoreOrderDataLits()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getTmStoreOrderDataLits();
         },
        search(){
             this.currentPage = 1
             this.getTmStoreOrderDataLits()
        },
        reset(){
           this.orderId = ''
           this.verifyTime = []
           //this.createTime = ''
         },
         getParam(){
            return this.common.joinSearchParam([
                {
                    name:'pageIndex',
                    value:this.currentPage
                },
                {
                    name:'pageSize',
                    value:this.pageSize
                },{
                    name:'orderId',
                    value:this.orderId
                },
                {
                    name:'createTimeStart',
                    value:this.verifyTime? this.verifyTime[0]:''
                },
                {
                    name:'createTimeEnd',
                    value:this.verifyTime? this.verifyTime[1]:''
                }
            ])
         },
         getTmStoreOrderDataLits(){
             var that = this
             if(this.common.isNullString(this.verifyTime[0]) || this.common.isNullString(this.verifyTime[1])){
                 this.common.warningMessage('请选择完整的核查开始时间和结束时间')
                 return
             }
               api.getTmStoreOrderData( this.getParam(),function(res){
                        if(res.code === 200)
                        {
                            that.tmStoreOrderData = res.data.list
                            that.totalRecords = res.data.totalRecords
                        }
                        else if(res.code == 404){
                            that.tmStoreOrderData = []
                            that.totalRecords = 0
                        }
                        else {
                            that.common.warningMessage(res.msg)
                        }
                })
         },
         exportFile(){
             if(this.common.isNullString(this.verifyTime[0]) || this.common.isNullString(this.verifyTime[1])){
                 this.common.warningMessage('请选择完整的核查开始时间和结束时间');
                 return
             }
             api.downloadTMStoreOrder({
                 "createTimeEnd": this.verifyTime? this.verifyTime[1]:'',
                 "createTimeStart": this.verifyTime? this.verifyTime[0]:'',
                 "orderId": this.orderId,
             },'application/vnd.ms-excel',(res)=>{
                 this.common.exportTemplate('天猫商城订单有对接平台无.xlsx',res);
             })
         }
     }
 }
</script>

