<template>
    <div class="mainContent">
        <div class="dataContent">
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="businessType" label="业务类型" min-width=70px ></el-table-column>
                <el-table-column label="子业务类型" min-width=85px >
                    <template slot-scope='scope'>
                        {{scope.row.instruction}}
                    </template>
                </el-table-column>
                <el-table-column label="凭证说明" min-width=70px >
                    <template slot-scope='scope'>
                        {{scope.row.voucherDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="totalDrAmount" label="凭证金额" min-width=70px ></el-table-column>
                <el-table-column prop="companyName" label="法人公司" min-width=85px ></el-table-column>
                <el-table-column prop="generalDate" label="制单日期" sortable min-width=95px></el-table-column>
                <el-table-column prop="jdeBatchNo" label="JDE批号" min-width=70px></el-table-column>
                <el-table-column prop="jdeInvoiceNumber" label="JDE单据号" min-width=80px></el-table-column>
                <el-table-column prop="paymentDay" label="账期" sortable min-width=70px></el-table-column>
                <el-table-column prop="accountMode" label="账套" width=50px></el-table-column>
                <el-table-column prop="createUser" label="制单人" width=60px></el-table-column>
                <el-table-column prop="jdeFlag" label="JDE导入状态" min-width=65px>
                    <template slot-scope="scope">
                        <span v-if="scope.row.reversalStatusFlag == 1">反转成功</span>
                        <span v-else >{{jdeStatusMap[scope.row.jdeFlag]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="auditingFlag" label="审核状态" width=70px>
                    <template slot-scope="scope">
                        <span v-if="scope.row.accountVoucherName == 'STORE_0000'" >{{auditStatusMap[scope.row.auditingFlag]}}</span>
                        <span v-else >-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isManualRecording" label="手工分录" width=50px>
                    <template slot-scope="scope">
                        <span v-if="scope.row.isManualRecording">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="flag" label="成功与否" width=50px></el-table-column>
                <el-table-column prop="code" label="错误编号" min-width=70px></el-table-column>
                <el-table-column prop="message" label="错误描述" min-width=70px></el-table-column>
                <el-table-column label="操作" width=180px>
                    <template slot-scope="scope">
                        <el-tooltip content="查看" placement="top" effect="light" popper-class="table-cell-toolTip" key="viewDetailBtnContent">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"
                                       @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="单据" placement="top" effect="light" popper-class="table-cell-toolTip"
                                    v-if="showBill(scope.row.accountVoucherName) && !scope.row.isManualRecording" key="billDetailBtnContent" >
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"
                                       @click="getBillDetail(scope.row)" type="text"><i class="fa fa-sticky-note"></i>
                            </el-button>
                        </el-tooltip>
                        <!-- <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip" key="editBtnContent"
                                    v-if="getBtnVisible(scope.row,'edit')" >
                            <el-button  size="small" @click="editManualAccounting(scope.row)" key="editBtn" 
                                        class="c-button-icon--primary--opacity c-button-icon-circle">
                                <i class="fa fa-edit"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip" key="deleteBtnContent"
                                    v-if="getBtnVisible(scope.row,'delete') && $route.query.source != 'groupVoucher'" >
                            <el-button  size="small" class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row)" key="deleteBtn" >
                                <i  class="fa fa-trash-alt"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="推送JDE" placement="top" effect="light" popper-class="table-cell-toolTip" key="uploadBtnContent"
                                    v-if="getBtnVisible(scope.row,'sendJde') && $route.query.source != 'groupVoucher'" >
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" type="text" key="uploadBtn1"
                                        @click="sendJde(scope.row)"><i class="fa fa-arrow-circle-down"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="反转" placement="top" effect="light" popper-class="table-cell-toolTip" key="backBtnContent"
                                    v-if="getBtnVisible(scope.row,'revert')" >
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" key="backBtn" type="text" 
                                       @click="reversalStatus(scope.row)"><i class="fa fa-reply"></i>
                            </el-button>
                        </el-tooltip>

                        <el-tooltip content="审核" placement="top" effect="light" popper-class="table-cell-toolTip" key="auditBtnContent"
                                    v-if="getBtnVisible(scope.row,'audit')" >
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" key="auditBtn" type="text" 
                                       @click="checkFlag(scope.row)"><i class="fa fa-check"></i>
                            </el-button>
                        </el-tooltip> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="currentPage"
                               :page-size="pageSize" :page-sizes="pageSizeList"
                               layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
                </el-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="checkFlagDialog" class="dialogContent" width="50%" title="审核" @closed="checkRadio = ''" >
            <el-radio-group v-model="checkRadio">
                <el-radio label="1">通过</el-radio>
                <el-radio label="2">退回</el-radio>
            </el-radio-group>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="checkFlagDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small" type="primary" @click="requestCheckFlag()" class="c-button c-button--primary">
                    保存
                </el-button>
            </div>
            <!--</el-form>-->
        </el-dialog>
    </div>
</template>
<script>
    import billDetailContent from './billDetailContent.vue'
    import api from '../../model/api'

    export default {
        name: 'GroupVoucherDetail',
        data() {
            return {
                tempBusinessFlowNum: '',
                jdeStatusMap:['未导入','导入成功','导入中','导入失败'],
                auditStatusMap:['待审核','已通过','已退回'],
                pageSizeList: [25, 50, 75, 100, 125],
                totalRecords: 0,
                currentPage: 1,
                pageSize: 25,
                tableData: [],
                checkRadio: '0',
                checkFlagDialog: false,
                rowInfo: ''
            }
        },
        activated() {
            if (this.tempBusinessFlowNum != this.$route.query.businessFlowNum) {
                this.getVoucherList();
            }
        },
        beforeRouteLeave(to, from, next) {
            this.tempBusinessFlowNum = this.$route.query.businessFlowNum
            next();
        },
        methods: {
            getBtnVisible(rowObj,btnType){
                //reversalStatus--反转状态，jdeFlag--jde状态，isManualRecording--是否手工分录, auditingFlag--审核状态 businessType--业务类型,accountVoucherName--子业务类型
                //edit--编辑 delete--删除 sendJde--推送jde revert--反转 audit--审核
                switch (btnType) {
                    case 'edit':
                        if((rowObj.auditingFlag == 0 && rowObj.reversalStatus == 0 && rowObj.jdeFlag == 0 && rowObj.accountVoucherName == 'STORE_0000')||
                           (rowObj.reversalStatus == 0 && rowObj.jdeFlag == 0 && rowObj.isManualRecording == 1 && rowObj.businessType != 'STORE')){
                            return true;
                        }else{
                            return false;
                        }
                        break;
                    case 'delete':
                        if(rowObj.jdeFlag == 0 || rowObj.jdeFlag == 3){
                            return true;
                        }else{
                            return false;
                        }
                        break;
                    case 'sendJde':
                        if((rowObj.jdeFlag == 0 && rowObj.reversalStatus == 0 && rowObj.accountVoucherName != 'STORE_0000') ||
                           (rowObj.jdeFlag == 0 && rowObj.reversalStatus == 0 && rowObj.auditingFlag == 1 && rowObj.accountVoucherName == 'STORE_0000')){
                            return true; 
                        }else{
                            return false;
                        }
                        break;
                    case 'revert':
                        if(rowObj.jdeFlag == 1 && (rowObj.reversalStatus != 1)){
                            return true;
                        }else{
                            return false;
                        }
                        break;
                    case 'audit':
                        if(rowObj.auditingFlag == 0 && rowObj.reversalStatus == 0 && rowObj.jdeFlag == 0 && rowObj.accountVoucherName == 'STORE_0000'){
                            return true;
                        }else{
                            return false;
                        }
                        break;
                    default:
                        return false;
                        break;
                }
            },
            showBill(voucherCode) {
                let isShowBill = false
                switch (voucherCode) {
                    case 'STORE_0000':
                    case 'STORE017_01':
                    case 'STORE017_02':
                    case 'STORE017_03':
                    case 'STORE017_04':
                    case 'STORE017_05':
                        isShowBill = false
                        break;
                    default:
                        isShowBill = true
                }
                return isShowBill
            },
            getBillDetail(rowData) {
                if (rowData.businessType == 'STORE') {
                    this.$router.push({
                        name: 'billDetail',
                        query: {voucherCode: rowData.accountVoucherName, id: rowData.id},
                        params: {parentRoute: this.$route.fullPath}
                    })
                } else {
                    this.$router.push({
                        name: 'billDetail',
                        query: {voucherCode: rowData.accountVoucherName, invoiceId: rowData.invoiceId},
                        params: {parentRoute: this.$route.fullPath}
                    })
                }
            },
            //审核
            checkFlag(rowData) {
                this.checkFlagDialog = true
                this.rowInfo = rowData
            },
            editManualAccounting(rowData) {
                if (rowData.businessType == 'STORE') {
                    this.$router.push({
                        name: 'StoreManualAccounting', query: {voucherId: rowData.id, source: 'voucherManual'},
                        params: {parentRoute: this.$route.fullPath}
                    })
                } else {
                    let currentParams = {
                        type: '',
                        detailType: '',
                        selectData: [],
                        businessType: rowData.businessType,
                        voucherId: rowData.id
                    };
                    window.localStorage.setItem('manualAccountingParams', JSON.stringify(currentParams));
                    this.$router.push({
                        name: 'manualAccountingCheck',
                        params: currentParams
                    });
                }

            },
            requestCheckFlag() {
                var that = this
                api.checkJde(this.rowInfo.id, this.checkRadio, function (res) {
                    res.code == 200 ? (that.common.successMessage(res.data), that.getVoucherList()) : (that.common.warningMessage(res.msg), that.getVoucherList())
                    that.checkFlagDialog = false
                })
            },
            getVoucherList() {
                var that = this
                var param = [
                    {
                        name: 'pageIndex',
                        value: this.currentPage
                    },
                    {
                        name: 'pageSize',
                        value: this.pageSize
                    },
                    {
                        name: 'businessFlowNum',
                        value: this.$route.query.businessFlowNum
                    }
                ]
                api.getNotGroupVoucherList(this.common.joinSearchParam(param), function (res) {
                    if (res.code == 200) {
                        that.tableData = res.data.list
                        that.totalRecords = res.data.totalRecords
                    }
                    else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            showTips(text, type) {
                this.common.messageUtil({
                    message: text,
                    type: type
                });
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getVoucherList()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getVoucherList()
            },
            reversalStatus(rowObject) {
                var that = this
                api.reversalVoucher(rowObject.id, function (res) {
                    res.code == 200 ? (that.common.successMessage(res.data), that.getVoucherList()) : that.common.warningMessage(res.msg)
                })
            },
            sendJde(rowObject) {
                var that = this
                api.sendJde(rowObject.id, function (res) {
                    res.code == 200 ? (that.common.successMessage(res.data), that.getVoucherList()) : that.common.warningMessage(res.msg)
                })
            },
            checkDetail(rowObject) {
                let canVoucherDelete = this.getBtnVisible(rowObject,'delete');
                this.$router.push({
                    name: 'voucherDetail',
                    query: {
                        voucherCode: rowObject.accountVoucherName,
                        voucherId: rowObject.id,
                        jdeFlag: rowObject.jdeFlag,
                        canVoucherDelete : canVoucherDelete,
                        source : this.$route.query.source
                    },
                    params: {parentRoute: this.$route.fullPath}
                })
            },
            deleteRow(rowObject) {
                var that = this
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteVoucher(rowObject.accountVoucherName, rowObject.id, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getVoucherList()
                        } else {
                            that.common.messageUtil({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                    })
                }).catch(() => {});
            }
        }
    }
</script>
<style scoped lang="scss">
@import '../../assets/scss/checkBusiness.scss';
</style>
