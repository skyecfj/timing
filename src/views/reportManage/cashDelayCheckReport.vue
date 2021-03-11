<template>
    <div class="cashDelayCheckReportTable">
        <div class="search-content">
            <searchHeader
             :dataPermission="true"
             :showStoreCode="true"
             :showCompany="true"
             :showOperateMarket="true"
             :showBillingUnit="true"
             :showDate="true"
             v-on:getStoreCode1="getStoreCode"
             v-on:getCompany1="getCompany"
             v-on:getBillingUnits1="getBillingUnits"
             v-on:getOperateMarkets1="getOperateMarkets"
             v-on:getBookDate="getBookDate"
             @reset="reset"
             ref="cashDelayCheckReport"
            >
                <div class="selectContent">
                    <div class="selectTitle">餐厅名称</div>
                    <el-input size="small" v-model.trim="storeName" clearable></el-input>
                </div>
            </searchHeader>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="notSaveButDoReportTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
        <el-dialog title="" :visible.sync="remarkVisible"  width="600px">
            <el-row>
                <el-col :span="4">备注</el-col>
                <el-col :span="20">
                    <textarea v-model="remarkObj.exceptionRemark" class="textarea-remark"></textarea>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="btn-area">
                    <el-button size="small"  type="success" class="findButt" @click="updateRemark">确认</el-button>
                    <el-button size="small"  type="success" plain class="reSet" @click="remarkVisible=false">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import api from '@/model/apidr'
    import searchHeader from '@/components/common/searchHeader'
    export default {
        name: "cashDelayCheckReport",
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
                        prop:'storeCode'
                    },
                    {
                        label:'餐厅名称',
                        prop:'storeName'
                    },
                    {
                        label:'营业款所属日期',
                        prop:'bizDateStr'
                    },
                    {
                        label:'营业款应入账日期',
                        prop:'savingDateStr'
                    },
                    {
                        label:'理论应核对日期',
                        prop:'savingCheckDateStr'
                    },
                    {
                        label:'营业款实际入账日期',
                        prop:'savingShouldDateStr'
                    },
                    {
                        label:'营业款实际应核对日期',
                        prop:'confirmShouldDateStr'
                    },
                    {
                        label:'营业款实际核对日期',
                        prop:'confirmDateStr'
                    },
                    {
                        label:'财务核对延迟天数',
                        prop:'dayNums'
                    },
                    {
                        label:'核对的营业款金额',
                        prop:'confirmAmount'
                    },
                    {
                        label:'原因备注',
                        edit:true,
                        prop:'remark',
                        formatter:(row)=>{
                            return row.remark?row.remark.length>8?row.remark.slice(0,8)+'...':row.remark:`编辑`
                        },
                        method:(key,row,prop)=>{
                            this.remarkObj.cashaMianId = row.cashaMainId;
                            this.remarkObj.exceptionRemark = row.remark;
                            this.remarkVisible = true;
                        }
                    },
                ],
                align: 'center',
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                // financialMarket:'',
                legalCompany:'',
                operateMarket:'',
                storeCode:'',
                billingUnit:'',
                bookDate:[],
                storeName:'',
                remarkVisible:false,
                remarkObj:{
                    cashaMianId:'',
                    exceptionRemark:''
                }
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
                api.getDelayList(this.getParam(),function(res){
                    if(res.code === 200){
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }else{
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }
                })
            },
            getParam(){
                return this.common.joinSearchParam([
                    {
                        value:this.legalCompany,
                        name:'companyCode'
                    },
                    {
                        value:this.billingUnit,
                        name:'billingUnit'
                    },
                    {
                        value:this.operateMarket,
                        name:'operateMarket'
                    },
                    {
                        value:this.storeCode,
                        name:'storeCode'
                    },
                    {
                        value:this.storeName,
                        name:'storeName'
                    },
                    {
                        value:this.bookDate?this.bookDate[1]:null,
                        name:'bizDateEnd'
                    },
                    {
                        value:this.bookDate?this.bookDate[0]:null,
                        name:'bizDateBegin'
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
            },
            reset() {
                this.storeName = '';
                this.$refs.cashDelayCheckReport.reset();
            },
            download(){
                let that = this;
                api.downloadDelay(this.getParam(),'application/vnd.ms-excel',function(res,header){
                    let name = header['content-disposition'];
                    that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
            getStoreCode(res){
                this.storeCode = res;
            },
            getCompany(res){
                this.legalCompany = res;
            },
            // getFinancial(res){
            //     this.financialMarket = res;
            // },
            getBillingUnits(res){
                this.billingUnit = res;
            },
            getOperateMarkets(res){
                this.operateMarket = res;
            },
            getBookDate(res){
                this.bookDate = res;
            },
            updateRemark(){
                api.updateRemarkCashDelay('?cashaMianId='+this.remarkObj.cashaMianId+'&exceptionRemark='+this.remarkObj.exceptionRemark,res=>{
                    this.getData();
                    this.remarkVisible = false;
                })
            }
        },
    }
</script>

<style scoped>
    .textarea-remark{
        min-height:100px;
        width:90%;
        padding:8px;
    }
    .btn-area{
        /*margin:10px 0 0;*/
        margin-top:10px;
        text-align: center;
    }
</style>
