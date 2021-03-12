<!-- 银行流水数据管理--->
<template>
    <div class="mainContent bankStatementMg">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">上账日期</div>
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
                <div class="selectTitle">银行JDE号</div>
                <el-input v-model.trim="bankJDE" clearable></el-input>
            </div>
            <div class="selectContent">
                <!--<div class="selectTitle">法人公司</div>-->
                <!--<el-select  v-model="leCode" filterable remote placeholder="请选择" size="medium" :remote-method="getCompany"-->
                            <!--:loading="getCompanyLoading" v-scroll="companyScroll" >-->
                    <!--<el-option label="请选择" value=""></el-option>-->
                    <!--<el-option  v-for="item in companyList" :key="item.jdeCode" :label="item.jdeCode" :value="item.jdeCode" ></el-option>-->
                <!--</el-select>-->
                <div class="selectTitle">法人公司</div>
                <remoteSelect
                        placeholder="请选择法人公司"
                        :remoteFn="'getAllCompanyIdNamess'"
                        :optLabel="'companyName'"
                        :optValue="'jdeCode'"
                        @getChangeData="getCompany"
                        :type="2"
                        ref="companyRef"
                        :customType="1"
                        :judgePermission="true"
                ></remoteSelect>
            </div>
            <div class="selectContent">
                <div class="selectTitle">摘要</div>
                <el-input v-model.trim="comment" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">对方收/付款单位</div>
                <el-input v-model.trim="paymentAccountName" clearable></el-input>
            </div>
            <br>
            <br>
            <el-button size="small" @click="searchData(1)" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="exportData" class="c-button c-button--primary">下载</el-button>
            <el-button size="small" @click="importData" class="c-button c-button--primary">手工execl导入</el-button>
            <!--<el-button size="small" @click="batchDelete" class="c-button c-button&#45;&#45;plain">批量删除</el-button>-->
            <el-button size="small" @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="bankStatementDate" @selection-change="handleSelectionChange" style="width: 100%" border>
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="bookDate" label="上账日期" align="center"></el-table-column>
                <el-table-column prop="leCode" label="法人公司" align="center"></el-table-column>
                <el-table-column prop="bankJdeCode" label="银行JDE号" align="center"></el-table-column>
                <el-table-column prop="debitAmount" label="借方金额" align="center"></el-table-column>
                <el-table-column prop="creditAmount" label="贷方金额" align="center"></el-table-column>
                <!--<el-table-column prop="checkAmount" label="已处理金额" align="center"></el-table-column>-->
                <el-table-column label="操作" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle"
                                       @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--danger--opacity c-button-icon-circle"
                                       @click="checkDelete(scope.row)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
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
            <el-dialog title="附件" :visible.sync="dialogVisible" width="30%">
                <el-upload
                        ref="bankStatement"
                        class="upload-demo"
                        action="/fsc/store/bank-statement/upload"
                        :on-preview="handlePreview"
                        :on-success="uploadSucceed"
                        :on-remove="handleRemove"
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
    import api from '../../../model/apidr'
    import ip from '../../../model/api'
    import scroll from '@/directives/index'
    import remoteSelect from '@/components/common/remoteSelect'
    export default {
        name: 'bankStatementMg',
        directives: { scroll },
        components:{
            remoteSelect
        },
        data() {
            return {
                // startDate: '',
                // endDate: '',
                bankJDE: '',
                leCode: '',
                // tempCompany : '',
                // tempComanySearchKeyWord : '',
                // getCompanyLoading : false,
                // companyScrollPageIndex  : 1,
                // companyScrollFlag       : true,
                // companySelectObj        : {},
                bankStatementDate: [],
                // companyList: [],
                pageSizeList:[25, 50, 75, 100, 125],
                currentPage: 1,
                pageSize: 25,
                totalRecords: 0,
                detailDialog: false,
                detailDialogTitle: '已核对明细',
                dialogVisible: false,
                fileObjTemp: {
                    files: []
                },
                multipleSelection:[],
                bookDate:[],
                remoteFlag:true,
                comment: '',
                paymentAccountName:''
            }
        },
        methods: {

            searchData(pageIndex) {
                var that = this;
                if(pageIndex){
                    this.currentPage = pageIndex;
                }
                let param = this.common.joinSearchParam([
                    {
                        name: 'pageSize',
                        value: this.pageSize
                    },
                    {
                        name: 'pageIndex',
                        value: this.currentPage
                    },
                    {
                        name: 'bookDateBegin',
                        value: this.bookDate?this.bookDate[0]:''
                    },
                    {
                        name: 'bookDateEnd',
                        value: this.bookDate?this.bookDate[1]:''
                    },
                    {
                        name: 'leCode',
                        value: this.leCode
                    },
                    {
                        name: 'bankJdeCode',
                        value: this.bankJDE
                    },
                    {
                        name: 'paymentAccountName',
                        value: this.paymentAccountName
                    },
                    {
                        name: 'comment',
                        value: this.comment
                    }
                ]);
                api.getBankStatementList(param, function (res) {
                    if(res.data && res.data.list){
                        that.bankStatementDate = res.data.list ;
                        that.totalRecords = res.data.totalRecords
                    }else{
                        that.bankStatementDate = [] ;
                        that.totalRecords = 0
                    }
                })
            },
            // companyScroll(param,object){
            //     let _self = this;
            //     if(param && this.remoteFlag){
            //         _self.remoteFlag = false;
            //     this.companySelectObj = object;
            //     if(this.companyScrollFlag){
            //         this.companyScrollPageIndex++;
            //         let param = this.common.formatPathParam({
            //             pageSize   : 20,
            //             pageIndex  : this.companyScrollPageIndex,
            //             companyJde : this.tempComanySearchKeyWord
            //         });
            //         ip.getCompanyByFMarket(param,function(res){
            //             _self.remoteFlag = true;
            //             if(res.code === 200){
            //                 _self.companyList = _self.companyList.concat(res.data);
            //             }else{
            //                 _self.companyScrollFlag = false;
            //             }
            //         })
            //     }
            //     }
            // },
            //获取法人公司
            exportData() {
                if(!this.bookDate || this.bookDate.length === 0){
                    this.common.messageUtil({
                        showClose: true,
                        duration: 0,
                        type:'warning',
                        message:'请选择上账日期后导出！'
                    })
                    return;
                }
                api.downloadAll({
                    bookDateBegin: this.bookDate?this.bookDate[0]:'',
                    bookDateEnd: this.bookDate?this.bookDate[1]:'',
                    bankJdeCode: this.bankJDE,
                    leCode:this.leCode,
                    comment:this.comment,
                    paymentAccountName:this.paymentAccountName
                }, 'application/vnd.ms-excel', function (res) {
                    let a = document.createElement('a');
                    a.download = '标准银行流水账单.xlsx';
                    a.href = res;
                    a.click();
                })
            },
            handlePreview(file) {
                window.location.href = file.url;
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
                    this.searchData();
                } else if (res.code === 404) {
                    that.common.messageUtil({
                        showClose: true,
                        duration: 0,
                        type: 'warning',
                        message: res.msg
                    })
                } else {
                    that.common.messageUtil({
                        showClose: true,
                        duration: 0,
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
                this.$refs.bankStatement.submit();
            },
            importData() {
                this.dialogVisible = true;
            },
            batchDelete() {
                var that = this;
                if(this.multipleSelection && that.multipleSelection.length === 0 ){
                    that.common.messageUtil({
                        showClose: true,
                        duration: 0,
                        type:'warning',
                        message:'请勾选数据后再批量删除！'
                    })
                    return ;
                }
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteBankStatement({searchDetailBankStatementDtos:that.multipleSelection},function(res){
                        if(res.code === 200 ){
                            that.common.messageUtil({
                                type:'success',
                                message:res.data
                            })
                            that.searchData();
                            that.multipleSelection = [];
                        }else{
                            that.common.messageUtil({
                                showClose: true,
                                duration: 0,
                                type:'error',
                                message:res.message
                            })
                        }
                    })
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                    that.multipleSelection = [];
                });

            },
            handleSelectionChange(val) {
                this.multipleSelection = [];
                let that = this;
                if(val.length>0){
                    val.forEach(function (item,index) {
                        that.multipleSelection.push({bankJdeCode:item.bankJdeCode,bookDate:item.bookDate});
                    })
                }
            },
            checkDetail(row) {
                this.$router.push({name: 'bankStatementDetail',
                    query: {
                        bankJdeCode: row.bankJdeCode,
                        bookDate: row.bookDate,
                    }
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.searchData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.searchData();
            },
            checkDelete(row){
                var that = this;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteBankStatement({ searchDetailBankStatementDtos:[{bankJdeCode:row.bankJdeCode,bookDate:row.bookDate}]},function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type:'success',
                                message:res.data
                            })
                            that.searchData();
                        }else {
                            that.common.messageUtil({
                                showClose: true,
                                duration: 0,
                                type:'error',
                                message:res.msg
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
                this.bookDate = [];
                this.bankJDE = '';
                this.leCode = '';
                // this.$refs.companyRef.modelValue = '';
                this.$refs.companyRef.reset();
            },
            getCompany(query){
                this.leCode = query;
            },
        },
        beforeMount(){
            this.searchData();
            this.getCompany('');
        }
    }
</script>

<style>
</style>
