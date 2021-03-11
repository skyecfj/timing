<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">凭证组</div>
                <el-select size="small" v-model="groupName" placeholder="请选择" filterable >
                    <el-option label="全部" value="" ></el-option>
                    <el-option v-for="item in groupNames" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">业务流水号</div>
                <el-input size="small" v-model.trim="businessFlowNum" placeholder="请输入" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">活动简称</div>
                <el-select size="small" v-model="activityName" placeholder="请选择" filterable >
                    <el-option label="全部" value="" ></el-option>
                    <el-option v-for="item in activities" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">JDE导入状态</div>
                <el-select size="small" v-model="jdeFlag" placeholder="请选择" >
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in jdeFlagOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">账期</div>
                <el-date-picker size="small" v-model="paymentDay" type="month" value-format="yyyyMM"  placeholder="请选择账期"></el-date-picker>
            </div>
            <el-button size="small" @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="groupName" label="凭证组" ></el-table-column>
                <el-table-column prop="businessFlowNum" label="业务流水号" ></el-table-column>
                <el-table-column prop="activityCode" label="活动简称" ></el-table-column>
                <el-table-column prop="paymentDay" label="账期" ></el-table-column>
                <el-table-column prop="jdeFlag" label="JDE导入状态" min-width=65px>
                    <template slot-scope="scope">
                        <span v-if="scope.row.reversalStatusFlag == 1">翻转成功</span>
                        <span v-else >{{jdeStatusMap[scope.row.jdeFlag]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width=180px>
                    <template slot-scope="scope">
                        <el-tooltip content="查看" placement="top" effect="light" popper-class="table-cell-toolTip" key="viewDetailBtnContent">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"
                                       @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="推送JDE" placement="top" effect="light" popper-class="table-cell-toolTip" key="uploadBtnContent"
                                    v-if="getBtnVisible(scope.row,'sendJde')" >
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
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip" key="deleteBtnContent"
                                    v-if="getBtnVisible(scope.row,'delete')" >
                            <el-button  size="small" class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row)" key="deleteBtn" >
                                <i  class="fa fa-trash-alt"></i>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="currentPage" :page-size="pageSize" :page-sizes="pageSizeList"
                               layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" >
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../model/api'

    export default {
        name: 'GroupVoucherMng',
        data() {
            return {
                pageSizeList: [25, 50, 75, 100, 125],
                totalRecords: 0,
                currentPage: 1,
                pageSize: 25,
                tableData: [],
                groupName: null,
                groupNames: [],
                businessFlowNum: null,
                activityName: null,
                activities: [],
                paymentDay: null,
                jdeFlag: null,
                jdeStatusMap:['未导入','导入成功','导入中','导入失败'],
                jdeFlagOptions: [
                    {
                        value: '0',
                        label: '未导入'
                    },
                    {
                        value: '2',
                        label: '导入中'
                    },
                    {
                        value: '1',
                        label: '导入成功'
                    },
                    {
                        value: '10',
                        label: '反转成功'
                    },
                    {
                        value: '3',
                        label: '导入失败'
                    }
                ]
            }
        },
        created() {
            this.getSearchCondition()
            this.getVoucherList()
        },
        beforeRouteLeave(to, from, next) {
            from.meta.isBack = to.name === 'GroupVoucherDetail';
            next();
        },
        methods: {
            getSearchCondition() {
                var _self = this
                api.getGroupNames((res) => {
                    _self.groupNames = [];
                    if(res.code == 200){
                        _self.groupNames = res.data.concat();
                    }
                })
                api.getActivities((res) => {
                    _self.activities = [];
                    if(res.code == 200){
                        _self.activities = res.data.concat();
                    }
                })
            },
            getBtnVisible(rowObj,btnType){
                //reversalStatus--反转状态，jdeFlag--jde状态
                //edit--编辑 delete--删除 sendJde--推送jde revert--反转 audit--审核
                switch (btnType) {
                    case 'delete':
                        if(rowObj.jdeFlag == 0 || rowObj.jdeFlag == 3){
                            return true;
                        }else{
                            return false;
                        }
                        break;
                    case 'sendJde':
                        // if(rowObj.jdeFlag == 0 && rowObj.reversalStatus == 0){
                        //     return true; 
                        // }else{
                        //     return false;
                        // }
                        return true; 
                        break;
                    case 'revert':
                        if(rowObj.jdeFlag == 1 && (rowObj.reversalStatus != 1)){
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
            getVoucherList() {
                var _self = this
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
                        name: 'groupName',
                        value: this.groupName
                    },
                    {
                        name: 'businessFlowNum',
                        value: this.businessFlowNum
                    },
                    {
                        name: 'activityName',
                        value: this.activityName
                    },
                    {
                        name: 'jdeFlag',
                        value: this.jdeFlag == 10? 1 : this.jdeFlag
                    },
                    {
                        name: 'paymentDay',
                        value: this.paymentDay
                    },
                    {
                        name: 'reversalStatus',
                        value: this.jdeFlag == 10? 1 : null
                    }
                ]
                api.getGroupVoucherList(this.common.joinSearchParam(param), function (res) {
                    _self.tableData = [];
                    if (res.code == 200) {
                        _self.tableData = res.data.list.concat();
                        _self.totalRecords = res.data.totalRecords
                    }else if (res.code != 404) {
                        _self.showTips(res.msg, 'warning')
                    }
                })
            },
            search() {
                this.currentPage = 1
                this.getVoucherList()
            },
            reset() {
                this.groupName = null;
                this.businessFlowNum = null;
                this.activityName = null;
                this.jdeFlag = null;
                this.paymentDay = null;
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
            //凭证组翻转
            reversalStatus(rowObject) {
                var _self = this
                api.reversalGroupVoucher(rowObject.businessFlowNum, function (res) {
                    res.code == 200 ? (_self.common.successMessage(res.data), _self.getVoucherList()) : _self.common.warningMessage(res.msg)
                })
            },
            //凭证组推jde
            sendJde(rowObject) {
                var _self = this
                api.groupSendJde(rowObject.businessFlowNum, function (res) {
                    res.code == 200 ? (_self.common.successMessage(res.data), _self.getVoucherList()) : _self.common.warningMessage(res.msg)
                })
            },
            //查看凭证组详情
            checkDetail(rowObject) {
                this.$router.push({
                    name: 'GroupVoucherDetail',
                    query: {
                        businessFlowNum: rowObject.businessFlowNum,
                        source: 'groupVoucher'
                    }
                })
            },
            //凭证组删除
            deleteRow(rowObject) {
                var _self = this
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteGroupVoucher(rowObject.businessFlowNum, function (res) {
                        if (res.code === 200) {
                            _self.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            _self.getVoucherList()
                        } else {
                            _self.common.messageUtil({
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
