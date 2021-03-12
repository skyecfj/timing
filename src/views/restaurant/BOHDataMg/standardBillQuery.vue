<template>
    <div class="standardBillQueryTable">
        <!--<div class="search-content">-->
            <searchHeader
             :showCompany="true"
             :showFinancialMarket="true"
             :dataLabel="'交易日期'"
             :showDate="true"
             :showClient="true"
             :showStoreCode="true"
             v-on:getCompany1="getCompany"
             v-on:getFinancial1="getFinancial"
             v-on:getBookDate="getBookDate"
             v-on:getClient1="getClient"
             v-on:getStoreCode1="getStoreCode"
             @reset="reset"
             ref="standardBillQueryReport"
            >
                <div class="selectContent">
                    <div class="selectTitle">活动名称</div>
                    <el-select filterable v-model="activityName">
                        <el-option value="">请选择</el-option>
                        <el-option v-for="(item,index) in activityNameOpt" :key="index" :value="item.id" :label="item.activityName"></el-option>
                    </el-select>
                </div>
                <div class="selectContent">
                    <div class="selectTitle">核对状态</div>
                    <el-select filterable v-model="checkStatus">
                        <el-option value="">请选择</el-option>
                        <el-option v-for="(item,index) in checkStatusOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </div>
            <br>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small"  type="success" class="findButt" @click="downloadBill">标准订单下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
            <el-popover
                    placement="right"
                    trigger="click">
                <el-table :data="downloadList"  max-height="300" size="small"
                          v-loading="loadingList"
                >
                    <el-table-column  property="exportType" label="导出类型" min-width="120"></el-table-column>
                    <el-table-column  label="状态" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status ===0">已提交</span>
                            <span v-else-if="scope.row.status ===1 ">执行中</span>
                            <span v-else-if="scope.row.status ===2 ">已完成</span>
                            <span v-else-if="scope.row.status === 3">已失败</span>
                        </template>
                    </el-table-column>
                    <el-table-column  property="createTime" label="创建时间"  width="140"></el-table-column>
                    <!--<el-table-column  property="finishTime" label="结束时间" width="140"></el-table-column>-->
                    <el-table-column width="100" label="地址">
                        <template slot-scope="scope">
                            <a v-if="scope.row.fileUrl" :href="'http://'+scope.row.fileUrl" class="link">下载</a>
                            <a v-else  class="link-disable">下载</a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button slot="reference" size="small" type="success" plain @click="getDownloadList()" class="c-button">查看下载列表</el-button>

                <!--<el-button >click 激活</el-button>-->
            </el-popover>
            </searchHeader>
        <!--</div>-->
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="standardBillQueryTable"
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
    import ip from '@/model/api'
    import searchHeader from '@/components/common/searchHeader'
    export default {
        name: "standardBillQuery",
        components: {
            tableOrigin,
            searchHeader
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label:'餐厅编号',
                        prop:'deliveryStore'
                    },
                    {
                        label:'财务市场',
                        prop:'financialMarket'
                    },
                    {
                        label:'法人公司',
                        prop:'companyName'
                    },
                    {
                        label:'客户名称',
                        prop:'clientName'
                    },
                    {
                        label:'活动名称',
                        prop:'activityName'
                    },
                    {
                        label:'品牌',
                        prop:'brand'
                    },
                    {
                        label: '账单与银行流水核对状态',
                        prop: 'checkStatus',
                        fixed: true,
                        formatter: (row) => {
                            return !!row.checkStatus?'已核对':'未核对'
                        },
                    },
                    {
                        label:'交易日期',
                        prop:'tradeDate'
                    },
                    {
                        label:'营业日期',
                        prop:'bizDate'
                    },
                    {
                        label:'交易金额',
                        prop:'tradeAmount'
                    },
                    {
                        label:'顾客实付',
                        prop:'acturalAmount'
                    },
                    {
                        label:'第三方补贴',
                        prop:'thirdSubsidy'
                    },
                    {
                        label:'随机红包（第三方）',
                        prop:'randomRedBag'
                    },
                    {
                        label:'百胜补贴',
                        prop:'bsSubsidy'
                    },
                    {
                        label:'手续费',
                        prop:'handingCharge'
                    },
                    {
                        label:'服务费（第三方）',
                        prop:'serviceCharge'
                    },
                    {
                        label:'包装费（百胜）',
                        prop:'packagingFee'
                    },
                    {
                        label:'包装费（第三方）',
                        prop:'thirdPackagingFee'
                    },
                    {
                        label:'配送费（第三方）',
                        prop:'thirdShippingFee'
                    },
                    {
                        label:'配送费（百胜）',
                        prop:'bsShippingFee'
                    },
                    {
                        label:'BOH核对金额',
                        prop:'bohCheckAmount'
                    },
                    {
                      label:'开票金额',
                      prop:'invoiceAmount'
                    },
                    {
                        label:'餐厅应收',
                        prop:'storeReceivable'
                    },
                    {
                        label:'券名称',
                        prop:'others'
                    },
                    {
                        label:'其他',
                        prop:'others1'
                    },

                ],
                align: 'center',
                // pageSizesList: [5, 10, 15, 20, 25],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                financialMarket:'',
                bookDate:[],
                clientName:'',
                activityName:'',
                storeCode:'',
                checkStatus:'',
                // clientNameOpt:[],
                activityNameOpt:[],
                checkStatusOpt:['未核对','已核对'],
                downloadList:[],
                loadingList:false
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
                api.selectThirdBillList(this.getParam(),function(res){
                    if(res.code === 200){
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }else{
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }
                })
            },
            getParam(num){
                if(num){
                    this.currentPage = num;
                }
                return this.common.joinSearchParam([
                    {
                        value:this.financialMarket,
                        name:'financialMarket'
                    },
                    {
                        value:this.legalCompany,
                        name:'companyCode'
                    },
                    {
                        value:this.storeCode,
                        name:'deliveryStoreCode'
                    },
                    {
                        value:this.activityName,
                        name:'activityId'
                    },
                    {
                        value:this.clientName,
                        name:'customerName'
                    },
                    {
                        value:this.bookDate?this.bookDate[1]:null,
                        name:'tradeDateEnd'
                    },
                    {
                        value:this.bookDate?this.bookDate[0]:null,
                        name:'tradeDateStart'
                    },
                    {
                        value:this.currentPage,
                        name:'pageIndex'
                    },
                    {
                        value:this.pageSize,
                        name:'pageSize'
                    },
                    {
                        value:this.checkStatus,
                        name:'checkStatus'
                    }
                ])
            },
            reset() {
                this.bookDate = [];
                this.activityName = '';
                this.checkStatus = '';
                this.$refs.standardBillQueryReport.reset();
            },
            download(){
                let that = this;
                api.downloadStandardBill(this.getParam())
            },
            downloadBill(){
                if(!this.activityName){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择活动名称后下载'
                    });
                    return;
                }
                api.downloadStandardOrder(this.getParam())
            },
            getBookDate(res){
              this.bookDate = res;
            },
            getCompany(res){
                this.legalCompany = res;
            },
            getFinancial(res){
                this.financialMarket = res;
            },
            getClient(res){
                this.clientName = res
            },
            getStoreCode(res){
                this.storeCode = res
            },
            getDownloadList(param){
                var that = this;
                this.loadingList = true;
                ip.getDownloadListDr('?pageSize=9999999&exportTypes=标准账单&exportTypes='+'标准订单',function(res){
                    that.downloadList = res.data.list;
                    that.loadingList = false;
                })
            },
        },
        beforeMount(){
            let that = this;
            ip.getActiveList('?pageSize='+999999,res=>{
                if(res.code === 200){
                    that.activityNameOpt = res.data.list;
                }else{
                    that.activityNameOpt = [];
                }
            })
        }
    }
</script>

<style scoped>

</style>
