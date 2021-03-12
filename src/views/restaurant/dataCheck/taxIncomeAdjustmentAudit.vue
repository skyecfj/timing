<template>
    <div class="taxIncomeAdjustmentAudit">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">营业日期</div>
                <el-date-picker v-model="searchDateRange" type="daterange" range-separator="-" :clearable="true" value-format="yyyy-MM-dd"
                                size="small" @change="dateRangeChange" start-placeholder="开始日期" end-placeholder="结束日期" >
                </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">营运市场</div>
                <el-select size="small" v-model="operateMarket" placeholder="请选择营运市场" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in operateMarkets" :key="item.marketNumber" :label="item.marketNumber" :value="item.marketNumber">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">餐厅编号</div>
                <!--<el-input size="small" v-model.trim="storeCode" clearable></el-input>-->
                <el-select size="small" v-model="storeCode" placeholder="请选择" remote :remote-method="remoteStoreHypId"
                           :loading="loadingStoreHypId" filterable v-scroll="bindScroll" @visible-change="visibleChange" @keyup.native="focusFn">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in storeHypIdOpt" :key="item.storeHypId" :label="item.storeHypId"
                               :value="item.storeHypId"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">状态</div>
                <el-select v-model="auditStatus">
                    <el-option value="">请选择</el-option>
                    <el-option v-for="item in status" :value="item.value" :label="item.name"
                               :key="item.value"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">调整类型</div>
                <el-select size="small"  v-model="resultCode" filterable placeholder="请选择" >
                    <el-option label="请选择" value="" ></el-option>
                    <el-option v-for="item in adjustTypeOpt" :key="item.adjustType" :label="item.adjustType" :value="item.adjustType" >
                    </el-option>
                </el-select>
            </div>
            <el-button size="small" type="success" class="findButt" @click="getData">查询</el-button>
            <el-button size="small" type="success" @click="dealMulti('pass')" >通过</el-button>
            <el-button size="small" type="danger"  @click="dealMulti('reject')" >退回</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    :selection="true"
                    ref="taxIncomeAdjustmentAudit"
                    :operates="operates"
                    :pageSizesList="pageSizesList"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    @handleSelectionChange="handleSelectionChange"
                    :randerSelectableFn="(row) => {if(row.auditState === 0 || row.auditState === 4){return true;}else{return false;}}"
                    :totalRecords="totalRecords"
            >
            </tableOrigin>
        </div>

        <!-- 附件弹框 -->
        <el-dialog title="附件" :visible.sync="attachmentDialogVisible" width="30%" :close-on-click-modal="false"  custom-class="view-file-dialog" >
            <el-upload  class="view-file" :file-list="fileObjTemp.files" action="" :on-preview ="handlePreview" > </el-upload>
        </el-dialog>

        <!-- 退回dialog -->
        <el-dialog  title="审核退回" :visible.sync="rejectDialogVisible" width="40%" :close-on-click-modal="false"
                    custom-class="reject-dialog" @close="rejectForm.remark = ''" >
            <el-form :model="rejectForm" label-width="80px" ref="rejectForm">
                <el-form-item label="退回原因">
                    <el-input type="textarea" v-model="rejectForm.remark" :autosize="{ minRows: 3}"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="c-button c-button--plain" @click="rejectDialogVisible = false">取 消</el-button>
                <el-button size="small" class="c-button c-button--primary" @click="reject">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import tableOrigin from '../BOHDataMg/originalTable'
    import api from '../../../model/apidr'
    import ip from '../../../model/api'
    import scroll from '@/directives/index'

    export default {
        name: "cashNotSavedIntoBank",
        components: {
            tableOrigin
        },
        directives: {scroll},
        data() {
            return {
                operateMarkets: [],
                operateMarket:'',
                dynamicData: [],
                searchDateRange : [],
                tableHead: [
                    {
                        label: '营业日期',
                        prop: 'bizDate'
                    },
                    {
                        label: '营运市场',
                        prop: 'operateMarket'
                    },
                    {
                        label: '餐厅编号',
                        prop: 'storeCode'
                    },
                    {
                        label: '餐厅名称',
                        prop: 'storeName'
                    },
                    {
                        label: '调整金额',
                        prop: 'amount',
                        formatter: (row) => {
                            return row.fscActivityCode + ' ' + row.amount + ' ' +row.negativeFscCode + ' ' + row.negativeAmount;
                        }
                    },
                    // {
                    //     label: '负向调整金额',
                    //     prop: 'negativeAmount',
                    //     formatter: (row) => {
                    //         return row.negativeFscCode + ' ' + row.negativeAmount;
                    //     }
                    // },
                    {
                        label: '调整类型',
                        prop: 'resultCode'
                    },
                    {
                        label: '备注',
                        prop:  'cashaRemark'
                    },
                    {
                        label: '状态',
                        prop: 'auditState',
                        fixed: true,
                        formatter: (row) => {
                            switch (row.auditState) {
                                case 0:
                                    return '待审核 ';
                                case 1:
                                    return '通过 ';
                                case 2:
                                    return '退回 ';
                                // case 3:
                                //     return '撤回 ';
                                case 4:
                                    return '取消核对待审核';
                                case 5:
                                    return '取消核对通过 ';
                                case 6:
                                    return '取消核对退回 ';
                                default:
                                    return;
                            }
                        }
                    },
                    {
                        label: '审核备注',
                        prop: 'remark',
                        title:true,
                        formatter: (row) => {
                            return (row.remark && row.remark.length > 8) ? row.remark.substring(0,8) + '...' : row.remark;
                        }
                    }
                ],
                tableHeadDetail: [
                    {
                        label: '数据项',
                        prop: 'item'
                    },
                    {
                        label: '调整值',
                        prop: 'amount'
                    }

                ],
                align: 'center',
                pageSizesList: [25, 50, 75, 100, 125, 150, 175, 200],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                remarkVisible: false,
                rejectDialogVisible: false,
                rejectForm:{
                    remark : ''
                },
                reason: '',
                // financialMarket: '',
                storeCode: '',
                startDate: '',
                endDate: '',
                auditStatus: '',
                resultCode: null,
                operates: {
                    width: 150,
                    fixed: 'right',
                    list: [
                        {
                            label: '通过',
                            showFn:(row)=>{
                                return (row.auditState === 0 || row.auditState === 4);
                            },
                            class: 'c-button-icon--primary--opacity c-button-icon-circle',
                            iClass: 'fa fa-check',
                            linkClass: 'linkClass',
                            method: (index, row) => {
                                this.dealType = 'single';
                                this.auditPass(row);
                            }
                        },
                        {
                            label: '退回',
                            showFn:(row)=>{
                                return (row.auditState === 0 || row.auditState === 4);
                            },
                            class: 'c-button-icon--danger--opacity c-button-icon-circle',
                            iClass: 'fa fa-reply',
                            linkClass: 'linkClass',
                            method: (index, row) => {
                                this.dealType = 'single';
                                this.auditObj = row;
                                this.detailId = row.id;
                                this.rejectDialogVisible = true;
                            }
                        },
                        {
                            label: '下载附件',
                            show: true,
                            class: 'c-button-icon--primary--opacity c-button-icon-circle',
                            iClass: 'fa fa-download',
                            linkClass: 'linkClass',
                            method: (index, row) => {
                                this.showAttachmentDg(row);
                            }
                        }
                    ]
                },
                status: [{value: 0, name: '待审核'}, {value: 1, name: '通过'}, {value: 2, name: '退回'},{value: 4, name: '取消核对待审核'},
                         {value: 5, name: '取消核对通过'},{value: 6, name: '取消核对退回'}],
                adjustTypeOpt:[],
                dynamicDataDetail: [],
                radio: 1,
                auditObj: {},
                detailId: '',
                disableDownload: false,
                auditState: null,
                storeHypIdOpt: [],
                loadingStoreHypId: false,
                scrollFlag: true,
                listPageIndex: 1,
                selectObj: {},
                temString: '',
                attachmentDialogVisible  : false,
                //暂存文件对象
                fileObjTemp : {
                    id : '',
                    files : []
                },
                attachment:[],
                selectedData:[],
                dealType: 'single'
            }
        },
        methods: {
            getOperateMarket () {
                let that = this
                ip.getOperateMarketIdNames('&judgePermission=true&pageSize=9999999',function(res){
                    if (res.code === 200) {
                        that.operateMarkets = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            //获取调整类型下拉框数据
            getAdjustType(){
                let _self = this;
                let param = this.common.formatPathParam({
                    itemCode : '营业总额,折扣,产品促销'
                });
                api.getAdjustTypeByBohKeyworld(param,function(res){
                    if(res.code === 200){
                        _self.adjustTypeOpt = res.data;
                    }else{
                        _self.adjustTypeOpt = [];
                    }
                })
            },
            dateRangeChange(dateRange){
                this.startDate = dateRange[0];
                this.endDate   = dateRange[1];
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData();
            },
            handleSelectionChange(selectedDatas){
                let _self = this;
                this.$nextTick(function(){
                    _self.selectedData = selectedDatas.concat();
                })
            },
            dealMulti(auditType){
                if(this.selectedData.length < 1){
                    this.common.warningMessage('请选择要批量操作的数据');
                    return false;
                }
                this.dealType = 'multi';
                if(auditType == 'pass'){
                    this.auditPass();
                }else if(auditType == 'reject'){
                    this.rejectDialogVisible = true;
                }
            },
            showAttachmentDg(row){
                let that = this;
                api.getAttachment('?id='+row.id,function (res) {
                    if(res.code === 200){
                        that.fileObjTemp.files = [];
                        that.fileObjTemp.files = res.data.concat();
                        that.attachmentDialogVisible = true;
                    }else if(res.code === 404){
                        that.common.messageUtil({
                            message: '暂无附件',
                            type: 'warning'
                        });
                    }else{
                        that.common.errorMessage(res.msg);
                    }
                })
            },
            handlePreview(file) {
                console.log(file);
                let link = document.createElement('a');
                if(file.response && file.response.code == 200){
                    link.href = file.response.data.url;
                    link.download = file.response.data.name;
                }else if(file.url){
                    link.href = file.url;
                    link.download = file.name;
                }
                link.target = '_blank';link.click();
            },
            auditPass(row){
                let that = this;
                this.$confirm('确认审核通过?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let requestPath =  '/adjust_verify/pass';
                    let param = [];
                    if(that.dealType == 'single'){
                        param.push({
                            id: row.id,
                            auditState: row.auditState === 0? 1 : 5
                        })
                    }else if(that.dealType == 'multi'){
                        that.selectedData.forEach(function(item,index){
                            param.push({
                                id: item.id,
                                auditState: item.auditState === 0? 1 : 5
                            })
                        })
                    }
                    //console.log(param);
                    api.passAdjustVerify(requestPath,{dtos:param}, function () {
                        that.getData();
                    })

                }).catch(() => {});
            },
            getData() {
                let that = this;
                if ((this.startDate && !this.endDate) || (!this.startDate && this.endDate)) {
                    this.common.messageUtil({
                        type: 'warning',
                        message: '请选择完整的日期区间！'
                    })
                    return;
                }
                api.getAdjustVerifyList({
                    auditState: this.auditStatus,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    pageIndex: this.currentPage,
                    pageSiZe: this.pageSize,
                    storeCode: this.storeCode,
                    operateMarket: this.operateMarket,
                    resultCode:this.resultCode
                }, function (res) {
                    that.dynamicData = [];
                    that.totalRecords = 0;
                    if (res.code === 200) {
                        that.totalRecords = res.data.totalRecords;
                        that.dynamicData = res.data.list;
                    }
                })
            },
            reject() {
                let that = this;
                let requestPath =  '/adjust_verify/reject';
                let param = [];
                if(that.dealType == 'single'){
                    param.push({
                        id: this.detailId,
                        auditState: this.auditObj.auditState === 0? 2 : 6,
                        remark: this.rejectForm.remark
                    })
                }else if(that.dealType == 'multi'){
                    that.selectedData.forEach(function(item,index){
                        param.push({
                            id: item.id,
                            auditState: item.auditState === 0? 2 : 6,
                            remark: that.rejectForm.remark
                        })
                    })
                }
                //console.log(param);
                api.rejectAdjustVerify(requestPath,{dtos:param}, function () {
                    that.rejectDialogVisible = false;
                    that.getData();
                })
            },
            bindScroll(param, object) {
                if (param) {
                    var that = this;
                    this.selectObj = object;
                    if (this.scrollFlag) {
                        this.listPageIndex++;
                        ip.getSelectSearchCondition({
                            storeHypId: this.temString,
                            pageSize: 20,
                            pageIndex: this.listPageIndex,
                            judgePermission:true
                        }, function (res) {
                            if (res.code === 200) {
                                that.storeHypIdOpt = that.storeHypIdOpt.concat(res.data);
                            } else if (res.code === 404) {
                                that.scrollFlag = false;
                            }
                        })
                    }
                }
            },
            remoteStoreHypId(val) {
                let that = this;
                // this.storeCode = val;
                this.temString = val;
                this.listPageIndex = 1;
                if (JSON.stringify(this.selectObj) !== '{}') {
                    this.selectObj.scrollTop = 0;
                }
                ip.getSelectSearchCondition({
                    storeHypId: this.temString,
                    pageIndex: this.listPageIndex,
                    pageSize: 20,
                    judgePermission:true
                }, function (res) {
                    that.storeHypIdOpt = res.data
                })
            },
            visibleChange(param) {
                if (!param && !this.storeCode) {
                    this.remoteStoreHypId();
                    this.temString = '';
                } else {
                    this.remoteStoreHypId(this.storeCode);
                }
            },
            focusFn(param) {
                console.log(param);
                if (!param.target.value) {
                    this.temString = '';
                    this.remoteStoreHypId();
                }
            }
        },
        mounted() {
            this.remoteStoreHypId();
            this.getOperateMarket();
            this.getAdjustType();
            this.getData();
        }
    }

</script>

<style scoped>
    .remark {
        box-shadow: 0 1px 5px #bdbdbd;
        padding: 10px;
        word-break: break-word;
    }
    .textarea-remark {
        min-height: 100px;
        width: 90%;
        padding: 8px;
    }
    .dialog-footer {
        text-align: center;
    }
    hr {
        height: 20px;
        background: transparent;
        border: none;
    }
    .link{
        color: -webkit-link;
        cursor: pointer;
        text-decoration: underline;
        display: block;
        margin-bottom: 10px;
    }
</style>
