<!-- 应付手续费发票管理-->
<template>
    <div class="shouldPayProcedureFee">
        <!---应付手续费合计 查询条件-->
        <div class="search-content" v-show="activeName === 'shouldGetAll'">
            <div class="selectContent">
                <div class="selectTitle">月份</div>
                <el-date-picker v-model="searchData1.invoiceDate" type="month"
                                value-format="yyyyMM" placeholder="选择月份"></el-date-picker>
            </div>

            <div class="selectContent">
                <div class="selectTitle">法人公司</div>
                <remoteSelect
                        placeholder="请选择法人公司"
                        :remoteFn="'getAllCompanyIdNamess'"
                        :optLabel="'companyName'"
                        :optValue="'jdeCode'"
                        @getChangeData="getCompany"
                        :type="2"
                        ref="companyRef1"
                        :customType="1"
                ></remoteSelect>
            </div>
            <div class="selectContent">
                <div class="selectTitle">活动简称</div>
                <el-input v-model.trim="searchData1.activityAbbreviation" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">发票类型</div>
                <el-select size="small" v-model="searchData1.chargeType">
                    <el-option value="" label="全部"></el-option>
                    <el-option :value="1" label="手续费"></el-option>
                    <el-option :value="2" label="服务费"></el-option>
                </el-select>
            </div>
            <br>
            <el-button size="small" @click="searchDataList(1)" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="reset(1)" class="c-button c-button--primary">重置</el-button>
            <el-button size="small" @click="exportDataALL" class="c-button c-button--primary">下载</el-button>
        </div>
        <!---应付手续费明细 查询条件-->
        <div class="search-content" v-show="activeName === 'shouldGetDetail'">
            <div class="selectContent">
                <div class="selectTitle">开票日期</div>
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
            <div class="selectContent">
                <div class="selectTitle">法人公司</div>
                <remoteSelect
                        placeholder="请选择法人公司"
                        :remoteFn="'getAllCompanyIdNamess'"
                        :optLabel="'companyName'"
                        :optValue="'jdeCode'"
                        @getChangeData="getCompany2"
                        :type="2"
                        ref="companyRef2"
                        :customType="1"
                ></remoteSelect>
            </div>
            <div class="selectContent">
                <div class="selectTitle">第三方开票单位</div>
                <el-input v-model.trim="searchData2.thirdBillUnit" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">购货单位编号</div>
                <el-select size="small" v-model="searchData2.billUnit" placeholder="请选择开票单位" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item,index) in billingUnits" :key="index" :label="item.billingUnitName"
                               :value="item.jdeCode"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">发票号码</div>
                <el-input v-model.trim="searchData2.invoiceNumber" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">入账账期</div>
                <el-date-picker v-model="searchData2.accountDate" type="month"
                                value-format="yyyyMM" placeholder="选择月份"></el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">活动简称</div>
                <el-input v-model.trim="searchData2.activityAbbreviation" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">所属发票月份</div>
                <el-date-picker v-model="searchData2.billDate" type="month"
                                value-format="yyyyMM" placeholder="选择月份"></el-date-picker>
            </div>
            <br>
            <el-button size="small" @click="exportTemplate" class="c-button c-button--primary">下载模板</el-button>
            <el-button size="small" @click="exportData" class="c-button c-button--primary">下载</el-button>
            <el-button size="small" @click="importData" class="c-button c-button--primary">上传</el-button>
            <el-button size="small" @click="searchDataList(1)" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="reset(2)" class="c-button c-button--primary">重置</el-button>
            <el-button size="small" @click="deleteData(true)" class="c-button c-button--primary">批量删除</el-button>
        </div>
        <div class="content">
            <el-tabs v-model="activeName" @tab-click="searchDataList()">
                <el-tab-pane label="应收发票合计" name="shouldGetAll">
                    <tableOrigin
                            :tableHead="tableHead"
                            :align="align"
                            :dynamicData="dynamicData1"
                            ref="shouldPayProcedureFeeTable"
                            :totalRecords="totalRecords1"
                            @handleSizeChange="handleSizeChange"
                            @handleCurrentChange="handleCurrentChange"
                    >
                    </tableOrigin>
                </el-tab-pane>
                <el-tab-pane label="应收发票明细" name="shouldGetDetail">
                    <tableOrigin
                            :tableHead="tableHead2"
                            :align="align"
                            :dynamicData="dynamicData2"
                            ref="shouldPayProcedureFeeDetailTable"
                            :totalRecords="totalRecords2"
                            :operates="operates"
                            :selection="true"
                            @handleSizeChange="handleSizeChange2"
                            @handleCurrentChange="handleCurrentChange2"
                            @handleSelectionChange="handleSelectionChange"
                    >
                    </tableOrigin>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="附件" :visible.sync="dialogVisible" width="30%">
            <el-upload
                    ref="shouldPayProcedureFee"
                    class="upload-demo"
                    action="/fsc/store/payable_invoice/upload-detail"
                    :on-preview="handlePreview"
                    :on-success="uploadSucceed"
                    :on-remove="handleRemove"
                    :auto-upload="false"
                    multiple
                    :file-list="fileObjTemp.files">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
            <el-button class="file-upload-save" size="small" type="success" @click="saveAttach">保存</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import tableOrigin from '../BOHDataMg/originalTable'
    import ip from '../../../model/apidr'
    import api from '../../../model/api'
    import remoteSelect from '@/components/common/remoteSelect'

    export default {
        name: 'shouldPayProcedureFee',
        components: {
            tableOrigin,
            remoteSelect
        },
        data () {
            return {
                dynamicData1: [],
                tableHead: [{

                        label: '月份',
                        prop: 'invoiceDate'
                     },
                    {
                        label: '法人公司',
                        prop: 'companyName'
                    },
                    {
                        label: '活动简称',
                        prop: 'activityAbbreviation'
                    },
                    {
                        label: '发票类型',
                        prop: 'chargeType',
                        fixed:true,
                        formatter:(row)=>{
                            return row.chargeType === 1 ?'手续费':'服务费'
                        }
                    },
                    {
                        label: '应收发票金额',
                        prop: 'shouldAmount'
                    },
                    {
                        label: '已收发票金额',
                        prop: 'inAmount'
                    },
                    {
                        label: '未收发票金额',
                        prop: 'notAmount'
                    },
                    {
                        label: '发票进项税额',
                        prop: 'inputAmount'
                    },
                ],
                dynamicData2: [],
                tableHead2: [{
                        label: '开票日期',
                        prop: 'invoiceDate'
                    },
                    {
                        label: '快递信息',
                        prop: 'expressInfo'
                    },
                    {
                        label: '第三方开票单位',
                        prop: 'thirdBillUnit'
                    },
                    {
                        label: '法人代码',
                        prop: 'legalPersonCode'
                    },
                    {
                        label: '法人公司名称',
                        prop: 'companyName'
                    },
                    {
                        label: '开票单位代码',
                        prop: 'purchaseCode'
                    },
                    {
                        label: '开票单位名称',
                        prop: 'purchaseName'
                    },
                    {
                        label: '发票代码',
                        prop: 'invoiceCode'
                    },
                    {
                        label: '发票号码',
                        prop: 'invoiceNumber'
                    },
                    {
                        label: '发票进项税额',
                        prop: 'inputTax'
                    },
                    {
                        label: '发票价税合计',
                        prop: 'totalPriceTax'
                    }, {
                        label: '入账账期',
                        prop: 'accountDate'
                    }, {
                        label: '活动简称',
                        prop: 'activityAbbreviation'
                    }, {
                        label: '发票所属月份',
                        prop: 'billDate'
                    }
                ],
                operates: {
                    width: 150,
                    fixed: 'right',
                    list: [
                        {
                            label: '删除',
                            show: true,
                            class: 'c-button-icon--danger--opacity c-button-icon-circle',
                            iClass: 'fa fa-trash-alt',
                            method: (index, row) => {
                                this.deleteData(row);
                            }
                        }
                    ]
                },
                index: {
                    label: '编号',
                    flag: true
                },
                align: 'center',
                totalRecords1: 0,
                dialogVisible: false,
                fileObjTemp: {
                    files: []
                },
                fileObjForSubmit: {},
                searchData1: {
                    invoiceDate: '',
                    companyCode: '',
                    activityAbbreviation: '',
                    chargeType: '',
                    pageSize:25,
                    pageIndex: 1,
                },
                billingUnits:[],
                billingUnit:'',
                totalRecords2: 0,
                activeName: 'shouldGetAll',

                searchData2: {
                    preBillDate:'',
                    finalBillDate:'',
                    companyCode: '',
                    thirdBillUnit: '',
                    billUnit: '',
                    invoiceNumber: '',
                    accountDate: '',
                    activityAbbreviation: '',
                    billDate: '',
                    pageSize:25,
                    pageIndex: 1,
                },
                bookDate:[],
                ids:[]
            }
        },
        methods: {
            searchDataList (num) {
                let ipName = '',searchNum = 1;
                if (this.activeName === 'shouldGetAll') {
                    ipName = 'getShouldPayFeeAllList';
                    searchNum = 1;
                    if (num === 1) {
                        this.searchData1.pageIndex = 1;
                        this.searchData1.pageSize = 25;
                    }
                } else {
                    ipName = 'getShouldPayFeeDetailList'
                    searchNum = 2;
                    if (num === 1) {
                        this.searchData2.pageIndex = 1;
                        this.searchData2.pageSize = 25;
                    }
                    this.searchData2.preBillDate = this.bookDate?this.bookDate[0]:null;
                    this.searchData2.finalBillDate = this.bookDate?this.bookDate[1]:null;
                }
                ip[ipName](this['searchData' + searchNum], res=> {
                    if (res.code === 200) {
                        this['dynamicData' + searchNum] = res.data.list;
                        this['totalRecords'+ searchNum] = res.data.totalRecords
                    } else if (res.code === 404) {
                        this['dynamicData' + searchNum] = [];
                        this['totalRecords' + searchNum] = 0;
                    }
                })
            },
            exportData () {
                this.searchData2.preBillDate = this.bookDate?this.bookDate[0]:null;
                this.searchData2.finalBillDate = this.bookDate?this.bookDate[1]:null;
                ip.downloadPayFeeDetail(this.searchData2,'application/vnd.ms-excel',(res,header)=>{
                    let name = header['content-disposition'];
                    this.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
            importData (rowObj) {
                this.dialogVisible = true;
            },
            handlePreview (file) {
                window.location.href = file.url;
            },
            //删除file
            handleRemove (file, fileList) {
            },
            //上传成功
            uploadSucceed (res, file, fileList) {
                let that = this;
                if (res.code === 200) {
                    that.common.messageUtil({
                        type: 'success',
                        message: res.data
                    })
                    this.searchDataList();
                } else if (res.code === 404) {
                    that.common.messageUtil({
                        type: 'warning',
                        message: res.msg
                    })
                } else {
                    that.common.messageUtil({
                        type: 'error',
                        message: res.msg
                    })
                }
                this.dialogVisible = false;
                this.fileObjTemp.files = [];
            },
            updateFileObjForSubmit (fileList) {
            },
            //保存已上传的fileList
            saveAttach () {
                this.$refs.shouldPayProcedureFee.submit();
            },
            handleSizeChange (val) {
                this.searchData1.pageSize = val;
                this.searchDataList();
            },
            handleCurrentChange (val) {
                this.searchData1.pageIndex = val;
                this.searchDataList();
            },
            handleSizeChange2 (val) {
                this.searchData2.pageSize = val;
                this.searchDataList();
            },
            handleCurrentChange2 (val) {
                this.searchData2.pageIndex = val;
                this.searchDataList();
            },
            handleSelectionChange(ids){
                this.ids = ids.map(res=>{return res.id});
            },
            getCompany (res) {
                this.searchData1.companyCode = res;
            },
            getCompany2 (res) {
                this.searchData2.companyCode = res;
            },
            getBillingUnits () {
                api.getBillJDECode(this.billingUnit + '&pageSize=9999999', res => {
                    this.billingUnits = res.data || []
                })
            },
            reset (num) {
                let that = this;
                this.$refs['companyRef'+num].reset();
                this.bookDate = [];
                for (let val in this['searchData'+num]) {
                    that['searchData'+num][val] = '';
                }
            },
            exportTemplate(){
                ip.downloadPayFeeHeader('application/vnd.ms-excel',(res,header)=>{
                    let name = header['content-disposition'];
                    this.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
            deleteData(rowObj){
                let confirmMsg = '',id;
                if( typeof rowObj === 'boolean'){
                    confirmMsg = '是否确认批量删除数据？';
                    id = this.ids;
                }else{
                    confirmMsg = rowObj.accountState == 0? '是否删除当前数据？' : '当前数据已生成账务，是否删除？';
                    id = [rowObj.id]
                }
                this.$confirm(confirmMsg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doDelete(id);
                }).catch(() => {});
            },
            doDelete(id){
                ip.deletePayableInvoice({ids:id},()=>{
                    this.searchDataList();
                })
            },
            exportDataALL(){
                ip.downloadPayFeeAll(this.searchData1,'application/vnd.ms-excel',(res,header)=>{
                    let name = header['content-disposition'];
                    this.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            }
        },
        beforeMount(){
            this.getBillingUnits();
        },
        mounted () {

            this.searchDataList();
        }
    }
</script>

<style>
</style>
