<template>
    <div class="thirdBillHadImportedDataMg">
        <div class="search-content" v-if="first">
            <div class="selectContent" >
                <div class="selectTitle">交易日期</div>
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
            <div class="selectContent" >
                <div class="selectTitle">账单名称</div>
                <el-input v-model.trim="configName" size="small" clearable></el-input>
            </div>
            <div class="selectContent" v-if="first">
                <el-checkbox v-model="MyFollows" class="selectTitle" >我关注的</el-checkbox>
            </div>
            <br>
            <div class="selectContent offset-top" v-if="first">
                <el-button size="small" @click="searchData1(1)" class="c-button c-button--primary" >查询
                </el-button>
                <el-button size="small" @click="exportData1" class="c-button c-button--primary" >下载
                </el-button>
                <el-button size="small" @click="deleteSet" class="c-button c-button--primary" >批量删除
                </el-button>
                <el-button size="small" @click="openBatchDl" class="c-button c-button--primary" >批量获取
                </el-button>
                <el-button size="small" @click="importInCrement('increment')" class="c-button c-button--primary"
                           >excel增量导入
                </el-button>
                <el-button size="small" @click="importFull('full')" class="c-button c-button--primary" >
                    excel全量导入
                </el-button>
                <el-button size="small" @click="reset(1)" class="c-button c-button--primary">重置
                </el-button>
            </div>
        </div>
        <searchHeader
                v-show="second"
                :showCompany="true"
                :showFinancialMarket="true"
                :showDate="true"
                :showStoreCode="true"
                :showOperateMarket="true"
                :showBillingUnit="true"
                v-on:getCompany1="getCompany"
                v-on:getFinancial1="getFinancial"
                v-on:getBookDate="getBookDate"
                v-on:getStoreCode1="getStore"
                v-on:getOperateMarkets1="getOperateMarkets"
                v-on:getBillingUnits1="getBillingUnits"
                @reset="reset"
                ref="hadImportedStoreDay"
        >
            <div class="selectContent">
            <div class="selectTitle">活动名称</div>
            <el-input v-model.trim="activityName" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">品牌</div>
                <el-select size="small"  placeholder="品牌"  v-model="brand" filterable >
                    <el-option value="">请选择</el-option>
                    <el-option v-for="item in brandSelect" :key="item.brandId" :value="item.brandEnglishName" :label="item.brandEnglishName"></el-option>
                </el-select>
            </div>
            <br>
            <el-button size="small" @click="searchData2(1)" class="c-button c-button--primary" >查询
            </el-button>
            <el-button size="small" @click="exportData2" class="c-button c-button--primary" >下载
            </el-button>
            <el-button size="small" @click="deleteSet2" class="c-button c-button--primary" >批量删除
            </el-button>
            <el-button size="small" @click="reset(2)" class="c-button c-button--primary">重置
            </el-button>
        </searchHeader>
        <div class="content">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="已导入账单（账单维度）" name="not-upload">
                    <leftTable :dynamicData="search1Data" v-on:multipleSelection="getMultipleSelection1($event)"
                               v-on:currentPage="getPageIndex1($event)" v-on:pageSize="getPageSize1($event)"
                               :totalRecords="totalRecords1" @refresh-list="refreshList($event)" :pageIndex="pageIndex1"></leftTable>
                </el-tab-pane>
                <el-tab-pane label="已导入账单（餐厅店天）" name="not-upload-legal">
                    <rightTable :dynamicData="search2Data" v-on:multipleSelection="getMultipleSelection2($event)"
                                v-on:currentPage="getPageIndex2($event)" v-on:pageSize="getPageSize2($event)"
                                :totalRecords="totalRecords2" @refresh-list="refreshList($event)" :pageIndex="pageIndex2"></rightTable>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!---批量获取弹框-->
        <el-dialog :visible.sync="batchAcquireDl" width="900px">
            <el-row :gutter="24">
                <el-col :span="3">账单名称</el-col>
                <el-col :span="8">
                    <el-select size="small" v-model="batchSearchBill" placeholder="请选择"
                               filterable>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="item in  billNameOpt" :key="item.id" :label="item.configName"
                                   :value="item.id+','+item.configName"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">交易日期</el-col>
                <el-col :span="6">
                    <el-date-picker
                            v-model="tradeDateDl"
                            value-format="yyyy-MM-dd"
                            size="small"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="btn-area">
                    <el-button size="small" type="success" class="findButt" @click="importSet">批量获取</el-button>
                    <el-button size="small" type="success" plain class="reSet" @click="batchAcquireDl=false">取消
                    </el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <!---excel增量导入-->
        <el-dialog title="附件" :visible.sync="uploadDialogVisible" width="800px">
            <el-row :gutter="24">
                <el-col :span="3">账单名称</el-col>
                <el-col :span="8">
                    <el-select size="small" v-model="batchSearchBillUpload" placeholder="请选择"
                               filterable>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="item in  billNameOpt" :key="item.id" :label="item.configName"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-upload
                    ref="notUploadTab"
                    class="upload-demo"
                    :action="action"
                    :on-success="uploadSucceed"
                    :auto-upload="false"
                    :data="uploadParam"
                    :limit="1"
                    :file-list="fileObjTemp.file">
                <el-button size="small" type="primary">选择文件</el-button>
                <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
            <el-button class="file-upload-save" size="small" type="success" @click="saveAttach">保存</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import leftTable from './2ndTables/hadImportedBill'
    import rightTable from './2ndTables/hadImportedStoreDay'
    import IP from '../../../../model/apidr.js'
    import api from '@/model/api'
    import searchHeader from '@/components/common/searchHeader'
    export default {
        name: "thirdBillHadImportedDataMg",
        components: {
            leftTable,
            rightTable,
            searchHeader
        },
        data() {
            return {
                activeName: 'not-upload',
                bookDate:[],
                bookDate2:[],
                activityName: '',
                first: true,
                second: false,
                financialMarket: '',
                serviceMarket: '',
                legalCompany: '',
                invoiceUnit: '',
                MyFollows: '',
                search1Data: [],
                search2Data: [],
                pageSize1: 25,
                pageIndex1: 1,
                pageSize2: 25,
                pageIndex2: 1,
                totalRecords1: 0,
                totalRecords2: 0,
                configName: '',
                multipleSelection1: [],
                multipleSelection2: [],
                batchAcquireDl: false,
                tradeDateDl: '',
                batchSearchBill: '',
                billNameOpt: [],
                temString: '',
                listPageIndex: 1,
                uploadDialogVisible: false,
                fileObjTemp: {
                    file: [],
                },
                uploadParam: {},
                batchSearchBillUpload: '',
                action: '',
                brandSelect:[],
                brand:'',
                storeCode:''
            }
        },

        methods: {
            handleClick(tab, event) {
                var that = this;
                if (tab.index === "0") {
                    this.btnImport = true;
                    this.index1 = true;
                    this.index2 = false;
                    that.first = true;
                    that.second = false;
                    //this.searchData1();  切换tab不执行查询
                } else if (tab.index === "1") {
                    this.btnImport = false;
                    this.index1 = false;
                    this.index2 = true;
                    that.first = false;
                    that.second = true;
                    //this.searchData2();  切换tab不执行查询
                }
            },
            searchData1(param) {
                var that = this;
                that.search1Data = [];
                IP.getThirdBillListBill(this.getParam(true,param), function (res) {
                    if (res.code === 200) {
                        that.search1Data = res.data.list;
                        that.totalRecords1 = res.data.totalRecords;
                    } else if (res.code !== 200 && res.code !== 404) {
                        that.totalRecords1 = 0;
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                    } else {
                        that.totalRecords1 = 0;
                    }
                })
            },
            refreshList(res) {
                if (res === 'left') {
                    this.searchData1();
                } else {
                    this.searchData2();
                }
            },
            exportData1() {
                var that = this;
                IP.exportThirdBill(this.getParam(true), 'application/vnd.ms-excel', function (res) {
                    if (res && res.code) {
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                    } else {
                        let html = document.createElement('a');
                        html.download = '第三方账单已导入数据管理(账单维度).xlsx';
                        html.href = res;
                        html.click();
                    }
                })
            },
            importSet() {
                let that = this;
                let param = {}
                if (this.batchSearchBill) {
                    param.id = Number(this.batchSearchBill.split(',')[0]);
                    param.configName = this.batchSearchBill.split(',')[1]
                } else {
                    this.common.messageUtil({
                        type: 'warning',
                        message: '请选择账单名称！'
                    });
                    return false
                }
                if (this.tradeDateDl) {
                    param.startTime = this.tradeDateDl;
                } else {
                    this.common.messageUtil({
                        type: 'warning',
                        message: '请选择正确时间段！'
                    });
                    return false
                }
                IP.batchAcquire(param, function () {
                    that.batchAcquireDl = false;
                    that.searchData1();
                })
            },
            deleteSet() {
                var that = this;
                if (this.multipleSelection1 && this.multipleSelection1.length === 0) {
                    that.common.messageUtil({
                        type: 'warning',
                        message: '请勾选数据后再批量删除！'
                    });
                    return;
                }
                this.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    IP.deleteThirdBill(this.multipleSelection1, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.searchData1();
                            that.multipleSelection1 = [];
                        } else {
                            that.common.messageUtil({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            importInCrement(type) {
                this.action = '/fsc/store/third_bill_data_process/incrementImport';
                this.uploadDialogVisible = true;
            },
            importFull() {
                this.action = '/fsc/store/third_bill_data_process/allImport';
                this.uploadDialogVisible = true;
            },
            getPageSize1(res) {
                this.pageSize1 = res;
                this.searchData1();
            },
            getPageSize2(res) {
                this.pageSize2 = res;
                this.searchData2();
            },
            getPageIndex1(res) {
                this.pageIndex1 = res;
                this.searchData1();
            },
            getPageIndex2(res) {
                this.pageIndex2 = res;
                this.searchData2();
            },
            getParam(param,pageIndex) {
                if (param) {
                    if(pageIndex){
                        this.pageIndex1 = 1;
                    }
                    return {
                        // "activityId": 0,
                        "configName": this.configName,
                        "pageIndex": this.pageIndex1,
                        "pageSize": this.pageSize1,
                        "tradeEndDate": this.bookDate?this.bookDate[1]:'',
                        "tradeStartDate": this.bookDate?this.bookDate[0]:'',
                        "contactActivity": this.MyFollows? true : false
                    }
                } else {//店天
                    if(pageIndex){
                        this.pageIndex2 = 1;
                    }
                    return {
                        // "activityId": 0,
                        "activityName": this.activityName,
                        "billingUnit": this.invoiceUnit,
                        "companyName": this.legalCompany,
                        "deliveryStoreCode": this.storeCode,
                         "brand":this.brand,
                        "financialMarket": this.financialMarket,
                        "operateMarket": this.serviceMarket,
                        "pageIndex": this.pageIndex2,
                        "pageSize": this.pageSize2,
                        "tradeEndDate": this.bookDate2?this.bookDate2[1]:'',
                        "tradeStartDate": this.bookDate2?this.bookDate2[0]:''
                    }
                }
            },
            searchData2(param) {
                var that = this;
                that.search2Data = [];
                IP.getThirdBillListStoreDay(this.getParam(false,param), function (res) {
                    if (res.code === 200) {
                        that.search2Data = res.data.list;
                        that.totalRecords2 = res.data.totalRecords;
                    } else if (res.code !== 200 && res.code !== 404) {
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                        that.totalRecords2 = 0;
                    } else {
                        that.totalRecords2 = 0;
                    }
                })
            },
            exportData2() {
                var that = this;
                IP.exportThirdBillStoreDay(this.getParam(), 'application/vnd.ms-excel', function (res) {
                    if (res && res.code) {
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                    } else {
                        let html = document.createElement('a');
                        html.download = '第三方账单已导入数据管理(店天).xlsx';
                        html.href = res;
                        html.click();
                    }
                })
            },
            deleteSet2() {
                var that = this;
                if (this.multipleSelection2 && this.multipleSelection2.length === 0) {
                    that.common.messageUtil({
                        type: 'warning',
                        message: '请勾选数据后再批量删除！'
                    });
                    return;
                }
                this.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    IP.deleteThirdBillStoreDay(this.multipleSelection2, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.searchData2();
                            that.multipleSelection2 = [];
                        } else {
                            that.common.messageUtil({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
            getMultipleSelection1(param) {
                if (param && param.length > 0) {
                    this.multipleSelection1 = param;
                } else {
                    this.multipleSelection1 = [];
                }
            },
            getMultipleSelection2(param) {
                if (param && param.length > 0) {
                    this.multipleSelection2 = param;
                } else {
                    this.multipleSelection2 = [];
                }
            },
            openBatchDl() {
                this.batchAcquireDl = true;
            },
            getConfigNameAndId(val) {
                let that = this;
                IP.getConfigNameAndId(function (res) {
                    that.billNameOpt = res.data
                })
            },
            uploadSucceed(res, file, fileList) {
                let that = this;
                if (res.code === 200) {
                    that.common.messageUtil({
                        type: 'success',
                        message: res.data
                    })
                    this.searchData1();
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
                this.uploadDialogVisible = false;
                this.fileObjTemp.file = [];
                this.fileObjTemp.billId = '';
                this.batchSearchBillUpload = '';
            },
            saveAttach() {
                if (!this.batchSearchBillUpload) {
                    this.common.messageUtil({
                        type: 'warning',
                        message: '请选择一个账单后再上传'
                    });
                    return;
                }
                this.uploadParam.billId = this.batchSearchBillUpload;
                this.$refs.notUploadTab.submit();
            },
            getBrandList(){
                var that = this;
                api.getBrandList('?pageSiZe=99999&flag=1',res=>{
                    if(res.code !== 404 && res.code !== 200){
                        that.common.messageUtil({
                            type:'error',
                            message:res.msg
                        })
                    }
                    if(res.data && res.data.list.length>0){
                        that.brandSelect = res.data.list;
                    }
                })
            },
            reset(type){
                if(type === 1){
                    this.bookDate = [];
                    this.configName = '';
                    this.MyFollows = null;
                }else{
                    this.$refs.hadImportedStoreDay.reset();
                    this.activityName = '';
                    this.brand = '';
                }
                // this.bookDate = [];
            },
            getFinancial(res){
                this.financialMarket = res;
            },
            getBookDate(res){
                this.bookDate2 = res;
            },
            getStore(res){
                this.storeCode = res;
            },
            getOperateMarkets(res){
                this.serviceMarket = res;
            },
            getBillingUnits(res){
                this.invoiceUnit = res;
            },
            getCompany(res){
                this.legalCompany = res;
            }
        },
        beforeMount(){
            this.getBrandList();
        },
        mounted() {
            //this.searchData1(); 不默认查询
            this.getConfigNameAndId()

        }
    }
</script>

<style scoped lang="scss">
    .offset-top {
        margin-top: 10px;
    }

    .btn-area {
        margin-top: 40px;
        text-align: center;
    }

    .file-upload-save {
        position: static;
        margin: 20px 0 15px 0;
    }

    .upload-demo {
        margin-top: 15px;
    }

</style>
