<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent" >
                <div class="selectTitle">合同日期</div>
                <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                                end-placeholder="结束日期" @change="rangeDateChange" value-format="yyyy-MM-dd" >
                </el-date-picker>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">品牌</div>
                <el-select v-model="brand" size="small">
                    <el-option :value="null" label="请选择"></el-option>
                    <el-option v-for="(item,index) in brandOpt" :key="index" :value="item.brandEnglishName" :label="item.brandEnglishName"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">合同状态</div>
                <el-select v-model="status" size="small">
                    <el-option :value="null" label="请选择"></el-option>
                    <el-option v-for="(item,index) in statusOpt" :key="index" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">活动类型</div>
                <el-select v-model="activityType" size="small" filterable>
                    <el-option :value="null" label="请选择"></el-option>
                    <el-option v-for="(item,index) in activityTypeOpt" :key="index" :value="item.activityTypeId" :label="item.activityTypeName"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">活动名称</div>
                <el-select v-model="activityName" size="small" filterable>
                    <el-option :value="null" label="请选择"></el-option>
                    <el-option v-for="(item,index) in activityNameOpt" :key="index" :value="item.activityName" :label="item.activityName"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">结算键位名</div>
                <el-input v-model.trim="bohSettlementKey" size="small"></el-input>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">RSC合同主体</div>
                <el-select v-model="contractMainBody" size="small" filterable>
                    <el-option :value="null" label="请选择"></el-option>
                    <el-option v-for="(item,index) in contractMainBodyOpt" :key="index" :value="item.jdeCode" :label="item.companyName"></el-option>
                </el-select>
            </div>
            <el-button size="small" type="success"  @click="getNationThirdSalePromList">查询</el-button>
            <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
            <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableData" border>
                <el-table-column prop="status" label="合同状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">草稿</span>
                        <span v-else-if="scope.row.status === 2">未开始</span>
                        <span v-else-if="scope.row.status === 3">进行中</span>
                        <span v-else-if="scope.row.status === 4">已结束</span>
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" label="品牌"></el-table-column>
                <el-table-column prop="activityCode" label="第三方促销活动编码"></el-table-column>
                <el-table-column prop="activityType" label="活动类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.activityType === 1">A-N全国性促销活动</span>
                        <span v-else-if="scope.row.activityType === 2">A-L非全国性促销活动</span>
                        <span v-else-if="scope.row.activityType === 3">房东代收</span>
                    </template>
                </el-table-column>
                <el-table-column prop="activityMode" label="活动形式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.activityMode === 1">满减/立减</span>
                        <span v-else-if="scope.row.activityMode === 2">第三方积分兑换</span>
                        <span v-else-if="scope.row.activityMode === 3">第三方券码</span>
                        <span v-else-if="scope.row.activityMode === 4">百胜电子券码</span>
                        <span v-else-if="scope.row.activityMode === 5">第三方外卖平台</span>
                    </template>
                </el-table-column>
                <el-table-column prop="activityTypeCode" label="SRB Project Code"></el-table-column>
                <el-table-column prop="activityName" label="活动名"></el-table-column>
                <el-table-column prop="activityMechanism" label="活动机制"></el-table-column>
                <el-table-column prop="conventionDate" label="合同活动期间"></el-table-column>
                <el-table-column prop="signDate" label="合同签订日期"></el-table-column>
                <el-table-column prop="storeConfigContact" label="门店配置联系人"></el-table-column>
                <el-table-column prop="billSource" label="获取订单及明细来源"></el-table-column>
                <el-table-column prop="provideDetail" label="订单明细是否导入FSC"></el-table-column>
                <el-table-column prop="sameBillSource" label="账单来源"></el-table-column>
                <el-table-column prop="billSourceDownloadAddr" label="账单下载地址"></el-table-column>
                <el-table-column prop="isImportFSC" label="账单导入FSC">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isImportFSC === 0">否</span>
                        <span v-else-if="scope.row.isImportFSC === 1">是</span>
                    </template>
                </el-table-column>
                <el-table-column prop="bohSettlementKey" label="BOH结算键位名"></el-table-column>
                <el-table-column prop="settingAccount" label="FSC设置科目"></el-table-column>
                <el-table-column prop="vfcActivityName" label="券活动名"></el-table-column>
                <el-table-column prop="bankAccountDate" label="付款周期/条款(上账)"></el-table-column>
                <el-table-column prop="pushExceptionContact" label="账单推送异常联系人"></el-table-column>
                <el-table-column prop="recordedExceptionContact" label="银行上账异常联系人"></el-table-column>
                <el-table-column prop="financialManagerContact" label="财务负责人"></el-table-column>
                <el-table-column prop="creditManagerContact" label="活动负责人"></el-table-column>
                <el-table-column prop="isAdjust" label="是否需要账务调整"></el-table-column>
                <el-table-column prop="orderWayValue" label="机具（是否直联)"></el-table-column>
                <el-table-column prop="franchiseeSettlementType" label="加盟商是否参加">
                    <template slot-scope="scope">
                        <span v-if="scope.row.franchiseeSettlementType === 0">不参加</span>
                        <span v-else-if="scope.row.franchiseeSettlementType === 1 || scope.row.franchiseeSettlementType === 2">参加</span>
                    </template>
                </el-table-column>
                <el-table-column prop="archiveElectronicDocNo" label="DCDM 上传批次号"></el-table-column>
                <el-table-column prop="specialMatters" label="特别事项(如:项目财务指引)"></el-table-column>
                <el-table-column prop="invoiceContact" label="第三方的活动负责人"></el-table-column>
                <el-table-column prop="settlementMode" label="全单/非全单">
                    <template slot-scope="scope">
                        <span v-if="scope.row.settlementMode === 1">全单</span>
                        <span v-else-if="scope.row.settlementMode === 2">非全单单客户</span>
                        <span v-else-if="scope.row.settlementMode === 3">非全单多客户</span>
                    </template>
                </el-table-column>
                <el-table-column prop="settlementPeriodType" label="结算周期"></el-table-column>
                <el-table-column prop="customerName" label="第三方全称"></el-table-column>
                <el-table-column prop="customerAbbre" label="第三方简称"></el-table-column>
                <el-table-column prop="customerId" label="第三方JDECODE"></el-table-column>
                <el-table-column prop="mainBody" label="RSC合同主体"></el-table-column>
                <el-table-column prop="chargeType" label="手续费">
                    <template slot-scope="scope">
                        <span v-if="scope.row.chargeType === 1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="guarantyType" label="保证金/预付款/保函/赊销特批"></el-table-column>
                <el-table-column prop="contractType" label="合同类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.contractType === 0"></span>
                    </template>
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
    import api from '@/model/api'
    export default {
        name: 'nationThirdSaleProm',
        data () {
            return {
                rangeDate: [],
                contractStartDate:null,
                contractEndDate:null,
                brand:null,
                brandOpt:[],
                status:null,
                statusOpt:[{
                    value:3,
                    label:'进行中'
                },{
                    value:4,
                    label:'已结束'
                }],
                activityTypeOpt:[],
                activityNameOpt:[],
                activityType:null,
                activityName:null,
                bohSettlementKey:null,
                contractMainBody:null,
                contractMainBodyOpt:[],
                tableData: [],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
            }
        },
        methods: {
            rangeDateChange(){
                if(this.rangeDate){
                    this.contractStartDate = this.rangeDate[0];
                    this.contractEndDate = this.rangeDate[1];
                }else{
                    this.contractStartDate = null;
                    this.contractEndDate = null;
                }
            },
            handleSizeChange (val) {
                this.pageSize = val;
                this.getNationThirdSalePromList()
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.getNationThirdSalePromList()
            },
            reset () {
                this.contractStartDate = null;
                this.contractEndDate = null;
                this.brand = null;
                this.status = null;
                this.activityName = null;
                this.bohSettlementKey = null;
                this.contractMainBody = null;
                this.activityType = null;
                this.rangeDate = [];
            },
            getNationThirdSalePromList () {
                let that = this;
                let pathParams = {
                    activityType:this.activityType,
                    activityName:this.activityName,
                    bohSettlementKey:this.bohSettlementKey,
                    brand:this.brand,
                    contractEndDate:this.contractEndDate,
                    contractMainBody:this.contractMainBody,
                    contractStartDate:this.contractStartDate,
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    status:this.status
                };
                api.getNationThirdSalePromList(pathParams,res =>{
                    that.tableData = [];
                    that.totalRecords = 0;
                    if (res.code === 200) {
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                        //字段转化
                        that.tableData.forEach((item,index) => {
                            //获取订单及明细来源 账单来源
                            if(item.billSource){
                                let billSource = [];
                                billSource = item.billSource.split(',');
                                billSource.forEach((item1,index1) => {
                                    if(item1 === 'A'){
                                        billSource[index1] = '第三方平台'
                                    }else if(item1 === 'B'){
                                        billSource[index1] = '卡券中心系统'
                                    }else if(item1 === 'C'){
                                        billSource[index1] = 'DSC手工明细'
                                    }else if(item1 === 'D'){
                                        billSource[index1] = '第三方来源'
                                    }
                                });
                                that.tableData[index].billSource = billSource.join(',');
                                that.tableData[index].sameBillSource = that.tableData[index].billSource
                            }
                            //订单明细是否导入FSC
                            if(item.provideDetail){
                                let provideDetail = [];
                                provideDetail = item.provideDetail.split(',');
                                provideDetail.forEach((item1,index1) => {
                                    if(item1 === '0'){
                                        provideDetail[index1] = '否'
                                    }else if(item1 === '1'){
                                        provideDetail[index1] = '是'
                                    }
                                });
                                that.tableData[index].provideDetail = provideDetail.join(',')
                            }
                            //付款周期/条款（上账）
                            if(item.bankAccountDate){
                                let bankAccountDate = [];
                                bankAccountDate = item.bankAccountDate.split(',');
                                bankAccountDate.forEach((item1,index1) => {
                                    bankAccountDate[index1] = item1;
                                });
                                that.tableData[index].bankAccountDate = bankAccountDate.join(',')
                            }
                            //保证金/预付款/保函/赊销特批
                            if(item.guarantyType){
                                let guarantyType = item.guarantyType.split(',');
                                guarantyType.forEach((item1,index1) => {
                                    let guarantys = item1.split('/');
                                    let guaranty = '';
                                    if(guarantys[0] === '1'){
                                        guaranty = '预付款:'
                                    }else if(guarantys[0] === '2'){
                                        guaranty = '保证金:'
                                    }else if(guarantys[0] === '3'){
                                        guaranty = '保函:'
                                    }else if(guarantys[0] === '4'){
                                        guaranty = '银行汇票:'
                                    }else if(guarantys[0] === '5'){
                                        guaranty = '赊销特批:'
                                    }
                                    if(guarantys[2] === '*'){
                                        guaranty = guaranty + guarantys[1]
                                    }else{
                                        guaranty = guaranty + guarantys[1] + '到期日:' + guarantys[2]
                                    }
                                    guarantyType[index1] = guaranty
                                });
                                that.tableData[index].guarantyType = guarantyType.join(',')
                            }
                        })
                    } else if (res.code !== 404) {
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            exportFile () {
                let that = this;
                let pathParams = {
                    activityType:this.activityType,
                    activityName:this.activityName,
                    bohSettlementKey:this.bohSettlementKey,
                    brand:this.brand,
                    contractEndDate:this.contractEndDate,
                    contractMainBody:this.contractMainBody,
                    contractStartDate:this.contractStartDate,
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    status:this.status
                };
                api.exportNationThirdSaleProm(pathParams, 'application/vnd.ms-excel', function(res){
                    if (res.code) {
                        that.showTips(res.msg,'warning')
                    } else {
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = '全国性第三方促销活动清单'+that.common.getNowFormatDate()+'.xlsx';
                        link.target = '_blank';link.click()
                    }
                })
            },
            showTips (text,type) {this.common.messageUtil({message: text, type: type})},
            getSelect(){
                let that = this;
                api.getSmallActivityBrand(res => {that.brandOpt = res.data});
                api.getAllCompany(res => {that.contractMainBodyOpt = res.data.list});
                api.getNationThirdSalePromList({pageSize:0},res => {that.activityNameOpt = res.data.list})
                api.getNationThirdSaleActivityTypeOpt(res => {that.activityTypeOpt = res.data});
            }
        },
        beforeMount(){
            this.getSelect()
        }
    }
</script>

<style>
</style>
