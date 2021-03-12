<template>
    <div class="mainContent bankstatement-detail">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">对方收/付款单位</div>
                <el-input v-model.trim="oppositeUnits" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">摘要</div>
                <el-input v-model.trim="summary" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">卡号</div>
                <el-input v-model.trim="cardNum" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">核对状态</div>
                <el-select size="small" v-model="toleranceState">
                    <el-option v-for="item in stateSelect" :key="item.id" :label="item.value" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent range-amount" >
                <div class="selectTitle">金额</div>
                <el-input v-model.trim="minAmount" clearable></el-input>
                <span>-</span>
                <el-input v-model.trim="maxAmount" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">借贷方向</div>
                <el-select size="small" v-model="paymentType">
                    <el-option label="借方" value="0"></el-option>
                    <el-option label="贷方" value="1"></el-option>
                </el-select>
            </div>
            <br>
            <el-button size="small" @click="searchDetailData(1)" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="exportDetailData" class="c-button c-button--primary">下载</el-button>
            <el-button size="small" @click="importDetailData" class="c-button c-button--primary">手工execl导入</el-button>
            <!--<el-button size="small" @click="batchDetailDelete" class="c-button c-button&#45;&#45;plain">批量删除</el-button>-->
            <el-button size="small" @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="bankStatementDetail" @selection-change="handleSelectionChange" style="width: 100%" border>
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="bookDate" label="上账日期" align="center"></el-table-column>
                <el-table-column prop="leCode" label="法人公司" align="center"></el-table-column>
                <el-table-column prop="bankJdeCode" label="银行JDE号" align="center"></el-table-column>
                <el-table-column prop="debitAmount" label="借方金额" align="center"></el-table-column>
                <el-table-column prop="creditAmount" label="贷方金额" align="center"></el-table-column>
                <el-table-column prop="paymentAccountName" label="对方收/付款单位" align="center"></el-table-column>
                <el-table-column prop="checkAmount" label="已处理金额" align="center"></el-table-column>
                <el-table-column prop="checkStatus" label="核对状态" align="center" :formatter="(row,index)=>{return row.checkStatus === 1?'已核对':'未核对'}">
                </el-table-column>
                <el-table-column prop="comment" label="摘要" align="center"></el-table-column>
                <el-table-column prop="cardNumber" label="卡号" align="center"></el-table-column>
                <el-table-column prop="remark" label="回单个性化" align="center"></el-table-column>
                <el-table-column label="操作" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"
                                       @click="checkDetail(scope.row.id)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--danger--opacity c-button-icon-circle"
                                       @click="checkDelete(scope.row)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page.sync="currentPage"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="totalRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </div>
        <!-- 已核对详情 -->
        <el-dialog :visible.sync="detailDialog" class="dialogContent" width="60%" center>
            <div slot="title">
                {{detailDialogTitle}}
            </div>
            <el-table :data="detailData" style="width: 100%" center border>
                <el-table-column prop="checkData" label="数据" align="center"></el-table-column>
                <el-table-column prop="checkObject" label="对象" align="center"></el-table-column>
                <el-table-column prop="amount" label=       "金额" align="center"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="detailDialog = false" class="c-button c-button--primary">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="附件" :visible.sync="dialogVisible" width="30%">
            <el-upload
                    ref="bankStatementDetail"
                    class="upload-demo"
                    action="/fsc/store/bank-statement/upload"
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
    import api from '../../../model/apidr'

    export default {
        data() {
            return {
                oppositeUnits: '',
                summary: '',
                cardNum: '',
                minAmount: '',
                maxAmount: '',
                toleranceState: null,
                paymentType: '',
                stateSelect: [{
                    id: '',
                    value: '全部'
                }, {
                    id: 1,
                    value: '已核对'
                }, {
                    id: 0,
                    value: '未核对'
                }],
                bankStatementDetail: [],
                pageSizeList:[25, 50, 75, 100, 125],
                currentPage: 1,
                pageSize: 25,
                totalRecords: 0,
                detailDialog: false,
                detailDialogTitle: '明细',
                detailData: [],
                bookDate: '',
                bankJdeCode: '',
                dialogVisible: false,
                fileObjTemp: {
                    files: []
                },
                multipleSelection: []

            }
        },
        methods: {
            getParam(param){
                return this.common.joinSearchParam([
                        {
                            name: 'pageIndex',
                            value: param?param:this.currentPage
                        },
                        {
                            name: 'pageSize',
                            value: this.pageSize
                        },
                        {
                            name: 'bankJdeCode',
                            value: this.bankJdeCode
                        },
                        {
                            name: 'bookDate',
                            value: this.bookDate
                        },
                        {
                            name: 'paymentAccountName',
                            value: this.oppositeUnits
                        },
                        {
                            name: 'comment',
                            value: this.summary
                        },
                        {
                            name: 'cardNumber',
                            value: this.cardNum
                        },
                        {
                            name: 'checkStatus',
                            value: this.toleranceState
                        },
                        {
                            name: 'minAmount',
                            value: this.minAmount
                        },
                        {
                            name: 'maxAmount',
                            value: this.maxAmount
                        },
                        {
                            name: 'paymentType',
                            value: this.paymentType
                        }
                    ])
            },
            searchDetailData(param) {
                let that = this;
                api.getBankStatementDetail(this.getParam(param), function (res) {
                    if (res.data && res.data.list) {
                        that.bankStatementDetail = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    } else {
                        that.bankStatementDetail = [];
                        that.totalRecords = 0;
                    }

                })
            },
            exportDetailData() {
                api.downloadBankStatementTemplate({
                    bookDate: this.$route.query.bookDate,
                    bankJdeCode: this.$route.query.bankJdeCode,
                    cardNumber:this.cardNum,
                    comment:this.summary,
                    paymentAccountName:this.oppositeUnits,
                    checkStatus:this.toleranceState,
                    maxAmount:this.maxAmount,
                    minAmount:this.minAmount,
                    paymentType:this.paymentType
                }, 'application/vnd.ms-excel', function (res) {
                    let a = document.createElement('a');
                    a.download = '银行流水数据管理详情.xlsx';
                    a.href = res;
                    a.click();
                })
            },
            handlePreview(file) {
                console.log(file);
                // window.location.href = file.url;
            },
            //删除file
            handleRemove(file, fileList) {
            },
            //上传成功
            uploadSucceed(res, file, fileList) {
                let that = this;
                if (res.code === 200) {
                    that.common.messageUtil({
                        type: 'success',
                        message: res.data
                    })
                    that.searchDetailData();
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
            updateFileObjForSubmit(fileList) {
            },
            //保存已上传的fileList
            saveAttach() {
                this.$refs.bankStatementDetail.submit();
            },
            importDetailData() {
                this.dialogVisible = true;
            },
            batchDetailDelete() {
                var that = this;
                if (this.multipleSelection && that.multipleSelection.length === 0) {
                    that.common.messageUtil({
                        type: 'warning',
                        message: '请勾选数据后再批量删除！'
                    })
                    return;
                }
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteBankStatementDetail({bankStatementIds: this.multipleSelection}, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            })
                            that.searchDetailData();
                        } else {
                            that.common.messageUtil({
                                type: 'error',
                                message: res.message
                            })
                        }
                    })
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            checkDetail(id) {
                this.detailDialog = true;
                let that = this;
                api.getDetailByBankDetail('?bankStatementId='+id,function(res){
                    that.detailData = res.data||[];
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = [];
                let that = this;
                if (val.length > 0) {
                    val.forEach(function (item, index) {
                        that.multipleSelection.push(item.id);
                    })
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.searchDetailData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.searchDetailData();
            },
            checkDelete(row) {
                var that = this;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteBankStatementDetail({bankStatementIds: [row.id]}, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            })
                            that.searchDetailData();
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
                });
            },
            reset(){
                this.oppositeUnits = null;
                this.summary = null;
                this.cardNum = null;
                this.toleranceState = null;
                this.minAmount = null;
                this.maxAmount = null;
                this.paymentType = null;
            }
        },
        // filters: {
        //     checkState(val) {
        //         return val === 1 ? '已核对' : "未核对"
        //     }
        // },
        beforeMount() {
            this.bookDate = this.$route.query.bookDate;
            this.bankJdeCode = this.$route.query.bankJdeCode;
            this.searchDetailData();
        }
    }
</script>

<style scoped lang="scss" >
.bankstatement-detail /deep/{
    .range-amount{
        .el-input{
            width: 120px;
        }
    }
}
</style>
