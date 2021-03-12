<!-- 手工退款数据管理-->
<template>
    <div class="refundOrderData">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">退款日期</div>
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
                <div class="selectTitle">餐厅编号</div>
                <el-input v-model.trim="storeCode" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">定位状态</div>
                <el-select size="small" v-model="checkFlag">
                    <el-option value="" label="请选择"></el-option>
                    <el-option :value="1" label="已定位"></el-option>
                    <el-option :value="0" label="未定位"></el-option>
                </el-select>
            </div>
            <el-button size="small" @click="searchData(1)" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="importData" class="c-button c-button--primary">上传</el-button>
            <el-button size="small" @click="exportData" class="c-button c-button--primary">模板下载</el-button>
            <el-button size="small" @click="batchDelete" class="c-button c-button--plain">批量删除</el-button>
            <el-button size="small" @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :selection="selection"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="refundOrderTable"
                    :operates="operates"
                    :totalRecords="totalRecords"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    @handleSelectionChange="handleSelectionChange"
                    :pageIndex="currentPage"
            >
            </tableOrigin>
            <el-dialog title="附件" :visible.sync="dialogVisible" width="30%">
                <el-upload
                        ref="refundOrderData"
                        class="upload-demo"
                        :action="action"
                        :on-preview="handlePreview"
                        :on-success="uploadSucceed"
                        :auto-upload="false"
                        :limit="1"
                        :file-list="fileObjTemp.files">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
                <el-button class="file-upload-save" size="small" type="success" @click="saveAttach">保存</el-button>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import tableOrigin from './originalTable'
    import api from '../../../model/apidr'

    export default {
        name: 'refundOrderData',
        components: {
            tableOrigin
        },
        data() {
            return {
                storeCode: '',
                dynamicData: [],
                tableHead: [
                    {

                        label: '活动名称',
                        prop: 'activityName'
                    },
                    {
                        label: '账单订单编号',
                        prop: 'orderNo'
                    },
                    {
                        label: '餐厅编号',
                        prop: 'storeCode'
                    },
                    {
                        label: '交易日期',
                        prop: 'tradeDate'
                    },
                    {
                        label: '营业日期',
                        prop: 'bizDate'
                    },
                    {
                        label: '退款成功日期',
                        prop: 'refundDate'
                    },
                    {
                        label: '退款金额',
                        prop: 'refundAmount'
                    },
                    {
                        label: '定位状态',
                        prop: 'checkTime',
                        fixed: true,
                        formatter: (row, column, cellValue, index) => {
                            return row.checkTime?'已定位':'未定位'
                        }
                    },
                    // {
                    //     label: '申请状态',
                    //     prop: 'applyStatus',
                    //     fixed: true,
                    //     formatter: (row, column, cellValue, index) => {
                    //         switch (row.applyStatus) {
                    //             case 0:
                    //                 return '已申请';
                    //             case 1:
                    //                 return '已匹配';
                    //             default:
                    //                 return;
                    //         }
                    //     }
                    // },
                ],
                selection: true,
                align: 'center',
                // pageSizesList: [5, 10, 15, 20, 25],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
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
                                this.deleteRow(row);
                            }
                        }
                    ]
                },
                dialogVisible: false,
                fileObjTemp: {
                    files: []
                },
                fileObjForSubmit: {},
                multipleSelection: [],
                dataEnum: 'NORMAL',
                actions: '/fsc/store/manual_refund_data_management/importData',
                bookDate:[],
                checkFlag:''
            }
        },
        computed: {
            action() {
                return this.actions + '?dataEnum=' + this.dataEnum;
            }
        },
        methods: {
            searchData(pageIndex) {
                let that = this;
                if ((!this.startDate && this.endDate) || (this.startDate && !this.endDate)) {
                    that.common.messageUtil({
                        type: 'warning',
                        message: '请选择正确的日期区间！'
                    });
                    return;
                }
                if(pageIndex){
                    this.currentPage = 1;
                }
                let param = {
                    pageIndex: this.currentPage,
                    pageSize: this.pageSize,
                    storeHypId: this.storeCode,
                    tradeStartDate: this.bookDate?this.bookDate[0]:'',
                    tradeEndDate: this.bookDate?this.bookDate[1]:'',
                    checkFlag:this.checkFlag
                };
                api.getManualRefundList(param, (res) => {
                    that.dynamicData = [];
                    that.totalRecords = 0;
                    if (res.code === 200) {
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    } else if(res.code != 404){
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        });
                    }
                })
            },
            exportData() {
                let that = this;
                api.downloadManualRefundTemplate('application/vnd.ms-excel', function (res) {
                    that.common.exportTemplate('手工退款模板.xlsx', res)
                })
            },
            importData() {
                this.dialogVisible = true;
            },
            deleteRow(row) {
                let that = this;
                if (typeof row !== 'boolean') {
                    this.multipleSelection = [row.id];
                } else {
                    if (this.multipleSelection && this.multipleSelection.length === 0) {
                        that.common.messageUtil({
                            type: 'warning',
                            message: '请勾选数据后再批量删除！'
                        });
                        return;
                    }
                }
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteManualRefund(this.multipleSelection, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            })
                            that.searchData();
                            that.multipleSelection = [];
                        } else {
                            that.common.messageUtil({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                    // that.multipleSelection = [];
                });
            },
            batchDelete() {
                this.deleteRow(true);
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.searchData();
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.searchData();
            },
            handlePreview(file) {
                // console.log(file);
                // window.location.href = file.url;
                // this.getAction();
            },
            //上传成功
            uploadSucceed(res, file, fileList) {
                let that = this;
                if (res.code === 200) {
                    that.common.messageUtil({
                        type: 'success',
                        message: res.msg
                    })
                    this.searchData();
                    this.dialogVisible = false;
                    this.fileObjTemp.files = [];
                    that.dataEnum = 'NORMAL';
                } else if (res.code === 404) {
                    that.common.messageUtil({
                        type: 'warning',
                        message: res.msg
                    })
                    this.dialogVisible = false;
                    this.fileObjTemp.files = [];
                    that.dataEnum = 'NORMAL';
                } else {
                    if (res.data === 'IS_COVER') {
                        that.$confirm(res.msg, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            that.dataEnum = res.data;
                            that.$nextTick(function (res) {
                                that.$refs.refundOrderData.$children[0].post(file.raw)
                            })
                        }).catch(() => {
                            this.dialogVisible = false;
                            this.fileObjTemp.files = [];
                        })
                    } else {
                        that.common.messageUtil({
                            type: 'warning',
                            message: res.msg
                        });
                        this.dialogVisible = false;
                        this.fileObjTemp.files = [];
                        that.dataEnum = 'NORMAL';
                    }
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = [];
                let that = this;
                if (val.length > 0) {
                    val.forEach(function (item, index) {
                        that.multipleSelection.push(item.id)
                    })
                }
            },
            //保存已上传的fileList
            saveAttach() {
                this.$refs.refundOrderData.submit();
            },
            reset(){
                this.bookDate = [];
                this.storeCode = '';
                this.checkFlag = '';
            }
        },
        mounted() {
            this.searchData();
        }
    }
</script>

<style>
</style>
