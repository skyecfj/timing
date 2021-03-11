<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent" >
                <div class="selectTitle">订单时间</div>
                <el-date-picker v-model="createTimeStart" type="date"
                                value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                <span>-</span>
                <el-date-picker v-model="createTimeEnd"  type="date"
                                value-format="yyyy-MM-dd" placeholder="选择日期"> </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">订单号</div>
                <el-input v-model="orderId" size="small" clearable placeholder="请输入订单号"></el-input>
            </div>
            <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="reset"  class="c-button c-button--plain">重置</el-button>
            <el-button size="small"   @click="exportFile" class="c-button c-button--primary">下载</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tmStorePlatformOrderData" style="width: 100%" border>
                <el-table-column prop="coupon" label="券码号">
                </el-table-column>
                <el-table-column prop="ordertime" label="订单创建时间">
                </el-table-column>
                <el-table-column prop="deltime" label="订单退款时间">
                </el-table-column>
                <el-table-column prop="orderamount" label="订单金额">
                </el-table-column>
                <el-table-column prop="orderid" label="订单号">
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="最新更新时间">
                </el-table-column>
                <el-table-column prop="price" label="券码金额">
                </el-table-column>
                <el-table-column prop="refundamount" label="退款金额">
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
     name:'tmStorePlatformOrder',
     data(){
        return {
         jobId:'',
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         orderId:'',
         createTimeStart:null,
         createTimeEnd:null,
         tmStorePlatformOrderData:[]
       }
    },
    beforeMount(){
      this.getTmStorePlatformOrderDataLits()
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getTmStorePlatformOrderDataLits()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getTmStorePlatformOrderDataLits();
         },
        search(){
             this.currentPage = 1
             this.getTmStorePlatformOrderDataLits()
        },
        reset(){
           this.orderId = ''
           this.verifyTime = []
           this.createTime = ''
         },
         getTmStorePlatformOrderDataLits(){
             var that = this
             var param = [
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
               },{
                   name:'createTimeStart',
                   value:this.createTimeStart
               },{
                   name:'createTimeEnd',
                   value:this.createTimeEnd
               }]
             api.getTmStorePlatformOrderData( this.common.joinSearchParam(param),function(res){
                        if(res.code === 200)
                        {
                            that.tmStorePlatformOrderData = res.data.list
                            that.totalRecords = res.data.totalRecords
                        }
                        else if(res.code == 404){
                            that.tmStorePlatformOrderData = []
                            that.totalRecords = 0
                        }
                        else {
                            that.common.warningMessage(res.msg)
                        }
                })
         },
         exportFile(){
             api.downloadTMtmStorePlatformOrder({
                 "orderId": this.orderId,
                 "createTimeStart": this.createTimeStart,
                 "createTimeEnd": this.createTimeEnd
             },'application/vnd.ms-excel',(res)=>{
                 this.common.exportTemplate('天猫对接平台订单有天猫商城无.xlsx',res);
             })
         }
     }
 }
</script>
