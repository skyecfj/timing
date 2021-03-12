<template>
    <div class="thirdBillAbnormalMg">
        <div class="search-content" v-if="first" >
            <div class="selectContent" >
                <!-- 根据不同的tab显示不同的字段名 -->
                <div class="selectTitle" >交易日期</div>
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
                <div class="selectTitle" >活动名称</div>
                <el-input v-model.trim="activityName" size="small" clearable ></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle" >账单名称</div>
                <el-input v-model.trim="billName" size="small" clearable ></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle" >法人公司</div>
                <remoteSelect
                        placeholder="请选择法人公司"
                        :remoteFn="'getAllCompanyIdNamess'"
                        :optLabel="'companyName'"
                        :optValue="'jdeCode'"
                        @getChangeData="getCompany"
                        :type="2"
                        :customLabel="true"
                        :customType="1"
                        ref="companyRef">
                </remoteSelect>
            </div>
            <div class="selectContent">
                <el-checkbox v-model="noneOfBusz" true-label="1" false-label="0"  class="selectTitle">确认无交易</el-checkbox>
            </div>
            <div class="selectContent">
                <el-checkbox v-model="MyFollows" true-label="1" false-label="0" class="selectTitle">我关注的</el-checkbox>
            </div>
            <br>
            <div class="selectContent offset-top">
                <el-button size="small" @click="searchData1(1)" class="c-button c-button--primary" >查询
                </el-button>
                <el-button size="small" @click="exportData1" class="c-button c-button--primary" >下载
                </el-button>
                <el-button size="small" @click="importSet" class="c-button c-button--primary" >批量获取
                </el-button>
                <el-button size="small" @click="importInCrement" class="c-button c-button--primary" >
                    excel增量导入
                </el-button>
                <el-button size="small" @click="importFull" class="c-button c-button--primary" >excel全量导入
                </el-button>
                <el-button size="small" @click="updateReExport" class="c-button c-button--primary" >更新补导
                </el-button>
                <el-button size="small" @click="reset(1)" class="c-button c-button--primary">重置
                </el-button>
            </div>
        </div>
        <div class="search-content" v-if="second">
            <div class="selectContent">
                <div class="selectTitle">营业日期</div>
                <el-date-picker
                    type="daterange"
                    v-model="bookDate2"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    size="small"
                >
                </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle" >账单名称</div>
                <el-input v-model.trim="activityName2" size="small" clearable ></el-input>
            </div>
            <!--<div class="selectContent">-->
                <!--<div class="selectTitle">错误提示</div>-->
                <!--<el-select v-model="errorTip" >-->
                    <!--<el-option value="">请选择</el-option>-->
                    <!--<el-option :value="index+1" :label="item" v-for="(item,index) in errorTipSelect" :key="index"></el-option>-->
                <!--</el-select>-->
            <!--</div>-->
            <!--<div class="selectContent">-->
                <!--<el-checkbox v-model="MyFollows2" true-label="1" false-label="0" class="selectTitle">我关注的</el-checkbox>-->
            <!--</div>-->
            <div class="selectContent offset-top">
                <el-button size="small" @click="searchData2(1)" class="c-button c-button--primary" v-if="second">查询
                </el-button>
                <!--<el-button size="small" @click="exportData2" class="c-button c-button&#45;&#45;primary" v-if="second">下载-->
                <!--</el-button>-->
                <el-button size="small" @click="updateException" class="c-button c-button--primary" v-if="second">更新异常
                </el-button>
                <el-button size="small" @click="reset(2)" class="c-button c-button--primary">重置
                </el-button>
            </div>
        </div>
        <div class="search-content" v-if="third">
            <div class="selectContent">
                <div class="selectTitle" >交易日期</div>
                <el-date-picker
                        type="daterange"
                        v-model="bookDate3"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        size="small"
                >
                </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle" >活动名称</div>
                <el-input v-model.trim="activityName3" size="small" clearable ></el-input>
            </div>
            <div class="selectContent">
                <el-checkbox v-model="MyFollows3" true-label="1" false-label="0" class="selectTitle">我关注的</el-checkbox>
            </div>
            <div class="selectContent offset-top">
                <el-button size="small" @click="searchData3(1)" class="c-button c-button--primary" v-if="third">查询
                </el-button>
                <el-button size="small" @click="reset(3)" class="c-button c-button--primary">重置
                </el-button>
            </div>
        </div>
        <div class="content">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="账单应导入未导入" name="not-upload">
                    <leftTable :dynamicData="dynamicData1" :totalRecords="totalRecords1"
                               v-on:refreshList="searchData1($event)"
                               v-on:pageSize="getPageSize($event)"
                               v-on:pageIndex="getPageIndex1($event)"
                               :pageIndex="pageIndex1"
                    ></leftTable>
                </el-tab-pane>
                <el-tab-pane label="导入数据异常" name="boh-abnormal">
                    <centerTable :dynamicData="dynamicData2" :totalRecords="totalRecords2"
                                 v-on:refreshList2="searchData2"
                                 v-on:pageSize="getPageSize($event)"
                                 v-on:pageIndex="getPageIndex2($event)"
                                 :pageIndex="pageIndex2"
                    ></centerTable>
                </el-tab-pane>
                <el-tab-pane label="有效验证不通过" name="fail">
                    <rightTable :dynamicData="dynamicData3"
                                v-on:pageSize="getPageSize($event)" :totalRecords="totalRecords3" :pageIndex="pageIndex3"
                                v-on:pageIndex="getPageIndex3($event)"
                                @refresh-list="searchData3()"></rightTable>
                </el-tab-pane>
                <!--<el-tab-pane label="应导入未导入（法人维度）" name="not-upload-legal">-->
                <!--<rightTable></rightTable>-->
                <!--</el-tab-pane>-->
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
                    <el-button size="small" type="success" class="findButt" @click="importSetSure">批量获取</el-button>
                    <el-button size="small" type="success" plain class="reSet" @click="batchAcquireDl=false">取消
                    </el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <!---excel增量导入or excel全量导入-->
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
                    multiple
                    :file-list="fileObjTemp.file">
                <el-button size="small" type="primary">选择文件</el-button>
                <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
            <el-button class="file-upload-save" size="small" type="success" @click="saveAttach">保存</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import leftTable from './3rdTables/billShouldButNot'
    import centerTable from './3rdTables/billImportAbnormal'
    import remoteSelect from '@/components/common/remoteSelect.vue'
    // import rightTable from './3rdTables/billShouldButNotLegalPersonrestaurant\BOHDataMg\thirdBillCoverMg\2ndTables\efficientValidateFail.vue
    import api from '../../../../model/apidr'
    import rightTable from './3rdTables/efficientValidateFail'
    export default {
        name: "thirdBillAbnormalMg",
        components: {
            leftTable,
            centerTable,
            rightTable,
            remoteSelect
        },
        data() {
            return {
                activeName: 'not-upload',
                noneOfBusz: "0",
                MyFollows: "0",
                bookDate:[],
                activityName: '',
                first: true,
                second: false,
                third: false,
                // errorTip: '',
                // errorTipSelect: ['餐厅未维护指定活动','未设置活动主档','未找到对应餐厅','餐厅编号为空'],
                dynamicData1:[],
                dynamicData2:[],
                dynamicData3:[],
                pageIndex1:1,
                pageIndex2:1,
                pageIndex3:1,
                pageSize:25,
                totalRecords1:0,
                totalRecords2:0,
                batchAcquireDl:false,
                billNameOpt:[],
                batchSearchBill:'',
                tradeDateDl:'',
                uploadDialogVisible:false,
                batchSearchBillUpload:'',
                action:'',
                fileObjTemp: {
                    file: [],
                },
                uploadParam:{},
                totalRecords3:0,
                bookDate2:[],
                activityName2:'',
                // MyFollows2:'0',
                bookDate3:[],
                activityName3:'',
                MyFollows3:'0',
                billName:'',
                company:''

            }
        },

        methods: {
            handleClick(tab, event) {
                var that = this;
                if (tab.index === "0") {
                    this.index1 = true;
                    this.index2 = false;
                    this.index3 = false;
                    that.first = true;
                    that.second = false;
                    that.third = false;
                    // this.searchData1();
                } else if (tab.index === "1") {
                    this.index1 = false;
                    this.index2 = true;
                    this.index3 = false;
                    that.first = false;
                    that.second = true;
                    that.third = false;
                    // this.searchData2();
                }else if (tab.index === "2") {
                    this.index1 = false;
                    this.index2 = false;
                    this.index3 = true;
                    that.first = false;
                    that.second = false;
                    that.third = true;
                    // this.searchData3();
                }
            },
            getParam(type,pageIndex){
                if(type === 1){
                    if(pageIndex){
                        this.pageIndex1 = 1;
                    }
                    return {
                        "billConfigItemName": this.billName,
                        "activityName": this.activityName,
                        "endDate": this.bookDate?this.bookDate[1]:'',
                        "isNotTrade": this.noneOfBusz,
                        "pageIndex": this.pageIndex1,
                        "pageSize": this.pageSize,
                        "startDate": this.bookDate?this.bookDate[0]:'',
                        'myFollow':this.MyFollows,
                        'company':this.company
                    };
                }else if (type === 2){
                    if(pageIndex){
                        this.pageIndex2 = 1;
                    }
                    return {
                        "activityName": this.activityName2,
                        "endDate": this.bookDate2?this.bookDate2[1]:'',
                        // "errorTip": this.errorTip,
                        "pageIndex": this.pageIndex2,
                        "pageSize": this.pageSize,
                        "startDate": this.bookDate2?this.bookDate2[0]:'',
                        // 'myFollow':this.MyFollows2
                    }
                } else{
                    if(pageIndex){
                        this.pageIndex3 = 1;
                    }
                    return {
                        pageIndex:this.pageIndex3,
                        pageSize: this.pageSize3,
                        thirdBillName: this.activityName3,
                        'myFollow':this.MyFollows3,
                        tradeEndDate: this.bookDate3?this.bookDate3[1]:'',
                        tradeStartDate: this.bookDate3?this.bookDate3[0]:''
                    }
                }
            },
            searchData1(pageIndex) {
                let that = this;
                api.shouldImportedButNotList(this.getParam(1,pageIndex),function(res){
                    that.dynamicData1 = res.data?res.data.list:[]
                    that.totalRecords1 = res.data?res.data.totalRecords:0;
                })
            },
            exportData1() {
                let that = this;
                api.shouldImportedExport(this.getParam(1),'application/vnd.ms-excel',function(res){
                    that.common.exportTemplate('第三方账单应导入而未导入.xlsx',res)
                })
            },
            importSet() {
                this.batchAcquireDl = true;
            },
            importInCrement() {
                this.action = '/fsc/store/third_bill_data_process/incrementImport';
                this.uploadDialogVisible = true;
            },
            importFull() {
                this.action = '/fsc/store/third_bill_data_process/allImport';
                this.uploadDialogVisible = true;
            },
            searchData2(pageIndex) {
                let that = this;
                api.shouldImportedErrorList(this.getParam(2,pageIndex),function(res){
                    that.dynamicData2 = res.data ? res.data.list:[];
                    that.totalRecords2 = res.data ? res.data.totalRecords:0;
                })
            },
            searchData3(pageIndex) {
                let that = this;
                api.getEfficientValidateList(this.getParam(3,pageIndex),function(res){
                    that.dynamicData3 = res.data ? res.data.list:[];
                    that.totalRecords3 = res.data ? res.data.totalRecords:0;
                })
            },
            exportData2() {
                let that = this;
                api.shouldImportedErrorExport(this.getParam(2),'application/vnd.ms-excel',function(res){
                    that.common.exportTemplate('第三方账单导入异常模板.xlsx',res)
                })
            },
            getPageSize(res){
                this.pageSize = res.size;
                if(res.type === 1){
                    this.searchData1();
                }else{
                    this.searchData2();
                }
            },
            getPageIndex1(res){
                this.pageIndex1 = res.currentPage;
                this.searchData1();
            },
            getPageIndex2(res){
                this.pageIndex2 = res.currentPage;
                this.searchData2();
            },
            getPageIndex3(res){
                this.pageIndex3 = res.currentPage;
                this.searchData3();
            },
            getConfigNameAndId(val) {
                let that = this;
                api.getConfigNameAndId(function (res) {
                    that.billNameOpt = res.data
                })
            },
            importSetSure(){
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
                api.batchAcquire(param, function () {
                    that.batchAcquireDl = false;
                    that.searchData1();
                })
            },
            uploadSucceed(res, file, fileList){
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
                this.fileObjTemp.billId = ''
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
            updateException(){
                api.tempToStandard();
            },
            updateReExport(){
                api.updateReexport(()=>{
                    this.searchData1(1)
                })
            },
            reset(type){
                if(type === 3){
                    this.bookDate3 = [];
                    this.activityName3 = '';
                } else if(type === 2){
                    this.bookDate2 = [];
                    this.activityName2 = '';
                } else {
                    this.bookDate = [];
                    this.activityName = '';
                    this.billName = '';
                    this.noneOfBusz = "0";
                    this.MyFollows = "0";
                    this.$refs.companyRef.reset();
                }
            },
            getCompany(res){
                this.company = res;
            }

        },
        mounted(){
            this.getConfigNameAndId();
            this.searchData1();
        }
    }
</script>

<style scoped>
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
</style>
