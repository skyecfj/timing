<template>
    <div class="bankStatementReportTable">
        <searchHeader
                :showBrand="true"
                :showStoreCode="true"
                :showOperateMarket="true"
                :showFinancialMarket="true"
                :showCompany="true"
                :showBillingUnit="true"
                v-on:getBrand1="getBrand"
                v-on:getCompany1="getCompany"
                v-on:getFinancial1="getFinancial"
                v-on:getStoreCode1="getStore"
                v-on:getOperateMarkets1="getOperateMarkets"
                v-on:getBillingUnits1="getBillingUnits"
                @reset="reset"
                ref="ChinaUnionPayReport"
        >
            <div class="selectContent" slot="up">
                <div class="selectTitle">交易日期</div>
                <limitDateRange
                        @changeDate="getLimitTradeDate"
                        :limitDays="180"
                        ref="limitTradeDate"
                ></limitDateRange>
            </div>
            <div class="selectContent" slot="up">
                <div class="selectTitle">营业日期</div>
                <limitDateRange
                        @changeDate="getLimitBusinessDate"
                        :limitDays="180"
                        ref="limitBusinessDate"
                ></limitDateRange>
            </div>
            <div class="selectContent">
                <div class="selectTitle">交易类型</div>
                <el-select size="small" v-model="searchData.transType">
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item,index) in tradeTypes" :key="index" :value="item.dictionaryEntryCode" :label="item.dictionaryEntryName"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">发卡行</div>
                <el-input v-model.trim="searchData.bank" size="small" clearable ></el-input>
                <!--<el-select size="small" v-model="searchData.bank">-->
                    <!--<el-option value="" label="请选择发卡行"></el-option>-->
                    <!--<el-option v-for="(item,index) in cardOwners" :key="index" :value="item" :label="item"></el-option>-->
                <!--</el-select>-->
            </div>
            <div class="selectContent">
                <div class="selectTitle">收单机构名称</div>
                <el-input v-model.trim="searchData.acqInsName" size="small" clearable ></el-input>
                <!--<el-select size="small" v-model="searchData.acqInsName">-->
                    <!--<el-option value="" label="请选择收单机构名称"></el-option>-->
                    <!--<el-option v-for="(item,index) in acquireInstitutionNms" :key="index" :value="item"-->
                               <!--:label="item"></el-option>-->
                <!--</el-select>-->
            </div>
            <br>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small" type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
            <el-popover
                    placement="right"
                    trigger="click">
                <el-table :data="downloadList" max-height="300" size="small"  v-loading="loadingList"
                >
                    <el-table-column label="导出类型" width="200" property="exportType"></el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status === 0">已提交</span>
                            <span v-else-if="scope.row.status === 1 ">执行中</span>
                            <span v-else-if="scope.row.status === 2 ">已完成</span>
                            <span v-else-if="scope.row.status === 3">已失败</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="createTime" label="创建时间" width="140"></el-table-column>
                    <el-table-column width="100" label="地址">
                        <template slot-scope="scope">
                            <a v-if="scope.row.fileUrl" :href="'http://'+scope.row.fileUrl" class="link">下载</a>
                            <a v-else class="link-disable">下载</a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button slot="reference" size="small" type="success" plain @click="getDownloadList()"
                           class="c-button">查看下载列表
                </el-button>
            </el-popover>
        </searchHeader>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="ChinaUnionPayReportTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="searchData.pageIndex"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import api from '@/model/api'
    import apidr from '@/model/apidr'
    import searchHeader from '@/components/common/searchHeader'
    import limitDateRange from '@/components/common/limitDateRange'

    export default {
        name: 'ChinaUnionPay',
        components: {
            tableOrigin,
            searchHeader,
            limitDateRange
        },
        data () {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label:'餐厅编号',
                        prop:'resCode'
                    },
                    {
                        label:'餐厅名称',
                        prop:'resName'
                    },
                    {
                        label:'营业日期',
                        prop:'operationDate'
                    },{
                        label:'营业日期是否异常',
                        prop:'ifUnusualDate'
                    },{
                        label:'交易类型',
                        prop:'transType'
                    },
                    {
                        label:'是否正向',
                        prop:'ifPlus'
                    },
                    {
                        label:'商户编号',
                        prop:'merchantCode'
                    },{
                        label:'收银机编号',
                        prop:'posNo'
                    },{
                        label:'交易流水号',
                        prop:'transNo'
                    },{
                        label:'交易时间',
                        prop:'transTime'
                    },{
                        label:'卡组织',
                        prop:'cardMemo'
                    },
                    {
                        label:'发卡行',
                        prop:'bank'
                    },
                    {
                        label:'卡类别',
                        prop:'cardType'
                    },{
                        label:'交易介质',
                        prop:'transMedium'
                    },
                    {
                        label:'卡号',
                        prop:'cardNo'
                    },
                    {
                        label:'交易总金额',
                        prop:'transAmount'
                    },
                    {
                        label:'活动优惠金额',
                        prop:'transDiscountAmount'
                    },
                    {
                        label:'实际交易金额',
                        prop:'transActualAmount'
                    },{
                        label:'手续费',
                        prop:'transPoundage'
                    },
                    {
                        label:'积分兑换金额',
                        prop:'redeemPointsAmount'
                    },
                    {
                        label:'商户应收金额',
                        prop:'transReceivable'
                    },
                    {
                        label:'合作方',
                        prop:'partner'
                    },{
                        label:'活动名称',
                        prop:'activityName'
                    },
                    {
                        label:'移动支付标志',
                        prop:'ifNfc'
                    },
                    {
                        label:'备注',
                        prop:'memo'
                    },
                    {
                        label:'理论营业日期',
                        prop:'theoryOperationDate'
                    },
                    {
                        label:'平台编码',
                        prop:'platformCode'
                    },{
                        label:'品牌',
                        prop:'resBrand'
                    },
                    {
                        label:'法人公司编码',
                        prop:'resEntity'
                    },
                    {
                        label:'营运市场编码',
                        prop:'resOprMarket'
                    },
                    {
                        label:'财务市场编码',
                        prop:'resFinMarket'
                    },
                    {
                        label:'法人公司名称',
                        prop:'resEntityName'
                    },{
                        label:'营运公司名称',
                        prop:'resOprMarketName'
                    },
                    {
                        label:'财务市场名称',
                        prop:'resFinMarketName'
                    },
                    {
                        label:'品牌中文名',
                        prop:'resBrandName'
                    },
                    {
                        label:'商户让利金额',
                        prop:'transDiscountAmountMerchant'
                    },
                    {
                        label:'T+1清算金额',
                        prop:'transSettlementAmount'
                    },
                    {
                        label:'发卡行编码',
                        prop:'issuingCode'
                    },
                    {
                        label:'发卡行名称',
                        prop:'issuingName'
                    },
                    {
                        label:'清算日期',
                        prop:'settleDt'
                    },
                    {
                        label:'银行卡受理方式',
                        prop:'cardTransType'
                    },
                    {
                        label:'免密交易标识',
                        prop:'ifNopass'
                    },
                    {
                        label:'第三方活动金额2',
                        prop:'transDiscountAmount2'
                    },
                    {
                        label:'活动名称2',
                        prop:'activityName2'
                    },
                    {
                        label:'收单机构代码',
                        prop:'acqInsIdCd'
                    },
                    {
                        label:'收单机构名称',
                        prop:'acqInsNm'
                    },
                    {
                        label:'银联二维码商户订单号',
                        prop:'qrBusinessNo'
                    },
                    {
                        label:'银联二维码银联交易流水号',
                        prop:'qrUccTransNo'
                    },
                ],
                downloadList: [],
                align: 'center',
                totalRecords: 0,
                tradeDate: [],
                businessDate: [],
                searchData: {
                    preTransDate:'',
                    finalTransDate:'',
                    preBizDate:'',
                    finalBizDate:'',
                    brand: '',
                    storeCode: '',
                    operateMarket: '',
                    financeMarket: '',
                    companyCode: '',
                    billUnit: '',
                    transType: '',
                    bank: '',
                    acqInsName: '',
                    pageSize:25,
                    pageIndex:1
                },
                tradeTypes: [],
                // cardOwners: [],
                // acquireInstitutionNms: [],
                loadingList:false
            }
        },
        methods: {
            handleSizeChange (size) {
                this.searchData.pageSize = size;
                this.getData()
            },
            handleCurrentChange (currentPage) {
                this.searchData.pageIndex = currentPage;
                this.getData()
            },
            getLimitTradeDate (res) {
                this.tradeDate = res;
            },
            getLimitBusinessDate (res) {
                this.businessDate = res;
            },
            getCompany (res) {
                this.searchData.companyCode = res;
            },
            getFinancial (res) {
                this.searchData.financeMarket = res;
            },
            getStore (res) {
                this.searchData.storeCode = res;
            },
            getOperateMarkets (res) {
                this.searchData.operateMarket = res;
            },
            getBrand (res) {
                this.searchData.brand = res;
            },
            getBillingUnits (res) {
                this.searchData.billUnit = res;
            },
            getData (num) {
                if(num === 1){
                    this.searchData.pageIndex = 1;
                    this.searchData.pageSize = 25;
                }
               apidr.getChinaUnionPayList(this.transParam(),res=>{
                   this.dynamicData = res.code === 200?res.data.list:[];
                   this.totalRecords = res.code === 200?res.data.totalRecords:0
               })
            },
            reset () {
                this.$refs.ChinaUnionPayReport.reset();
                this.$refs.limitTradeDate.reset();
                this.$refs.limitBusinessDate.reset();
                this.tradeDate = [];
                this.businessDate = [];
                let that = this;
                for (let val in this.searchData) {
                    that.searchData[val] = '';
                }
            },
            transParam(){
                this.searchData.preTransDate = this.tradeDate && this.tradeDate.length>0 ?this.tradeDate[0]+' 00:00:00':null
                this.searchData.finalTransDate = this.tradeDate && this.tradeDate.length>0?this.tradeDate[1]+' 23:59:59':null
                this.searchData.preBizDate = this.businessDate && this.businessDate.length>0?this.businessDate[0]:null
                this.searchData.finalBizDate = this.businessDate && this.businessDate.length>0?this.businessDate[1]:null
                return this.searchData
            },
            download () {
                apidr.downChinaUnionPay(this.transParam())
            },
            getTradTypes(){
                api.getDictionaryByNumber('AGG-BANK-CARD-RES-TRANS-TYPE',res=>{
                    this.tradeTypes = res.data;
                })
            },
            getDownloadList () {
                this.loadingList = true;
                api.getDownloadListDr('?pageSize=9999999&exportTypes=银联卡',res =>{
                    this.downloadList = res.data.list;
                    this.loadingList = false;
                })
            }
        },
        beforeMount(){
            this.getTradTypes();
        }
    }
</script>

<style scoped>
    .link {
        color: -webkit-link;
    }

    .link-disable {
        color: #bdbdbd;
        cursor: not-allowed
    }
</style>
