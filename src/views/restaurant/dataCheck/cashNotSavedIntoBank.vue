<template>
    <div class="cashNotSavedIntoBank">
        <div class="search-content" >
            <searchHeader v-bind:searchConfig="pageUtil.searchConfig"
                          v-on:rangeDatechange="rangeDatechange"  ></searchHeader>
            <br>
            <hr>
            <el-button size="small"  type="success" class="findButt" @click="search">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="exportData">下载</el-button>
            <!-- <el-button size="small"  type="success" plain class="reSet" @click="sendMail">发送邮件</el-button> -->
            <el-button size="small"  type="success" plain class="reSet" @click="updateReasonMulti">批量设置异常原因类别</el-button>
            <!-- <el-button size="small"  type="success" plain class="reSet" @click="executeReport">运行报表</el-button> -->
        </div>
        <div class="content" >
            <tableOrigin :tableHead="tableHead"
                         :selection="selection"
                         :align="align"
                         :dynamicData="dynamicData"
                         ref="cashNotSavedIntoBank"
                         @handleSelectionChange = "handleSelectionChange"
                         @handleSizeChange ="handleSizeChange"
                         @handleCurrentChange = "handleCurrentChange"
                         :totalRecords="totalRecords"
                         :pageIndex="currentPage"
                         :tblHeight="tblHeight">
            </tableOrigin>
        </div>
        <el-dialog title="" :visible.sync="remarkVisible"  width="600px">
            <el-row>
                <el-col :span="4">异常原因</el-col>
                <el-col :span="20">
                    <textarea v-model="reason" class="textarea-remark"></textarea>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  type="success" class="findButt" @click="updateRemark()">确定</el-button>
                <el-button size="small"  type="success" plain class="reSet" @click="remarkVisible=false">取消</el-button>
            </div>
        </el-dialog>

        <!-- 批量设置原因dialog -->
        <el-dialog  title="设置异常原因类别" :visible.sync="setReasonDialogVisible" width="30%" :close-on-click-modal="false"
                    custom-class="reasonset-dialog" @close="setReasonForm.reason = '';$refs['setReasonForm'].resetFields()" >
            <el-form :model="setReasonForm" label-width="150px" ref="setReasonForm">
                <el-form-item label="异常原因类别" prop="reason" :rules="[{ required: true, message: '请选择异常原因类别', trigger: 'change' }]">
                    <el-select size="samll" v-model="setReasonForm.reason" placeholder="请选择" :filterable="true" >
                        <el-option  v-for="(item,index) in reasonOpts" :key="index"
                                    :label="item.entryName" :value="item.entryCode" ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="c-button c-button--plain" @click="setReasonDialogVisible = false">取 消</el-button>
                <el-button size="small" class="c-button c-button--primary" @click="doUpdateReasonMulti">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import api from '../../../model/api'
    import apiStore from '../../../model/apidr'
    import scroll from '@/directives/index'
    //查询form组件
    import searchHeader from './dataCheckComponent/searchHeader'
    //表格
    import tableOrigin from '../BOHDataMg/originalTable'
    //查询form配置
    import pageUtil from '../../../utils/restaurant/dataCheck/cashNotSavedIntoBank'
    export default {
        name: "cashNotSavedIntoBank",
        components: {
            searchHeader,
            tableOrigin
        },
        directives: { scroll },
        beforeMount(){
            let windowHeight = window.innerHeight;
            this.tblHeight = windowHeight * 0.6;
            this.getExceptionCategorys();
            this.getAllMarkets();
            //财务市场查询配置
            this.setSearchMarketConfig();
            //法人公司查询配置
            this.setSearchCompanyConfig()
            //餐厅编号查询配置
            this.setSearchStoreConfig();
        },
        data() {
            return {
                tblHeight: 0,
                pageUtil : pageUtil,
                dynamicData: [],
                tempDataIndex: '',
                tempResonCategorys: [],//list暂存数据
                tableHead: [
                    {
                        label:'标识',
                        prop:'cashaDetailId'
                    },
                    {
                        label : '法人JDE号',
                        prop  : 'companyCode'
                    },
                    {
                        label : '餐厅编号',
                        prop  : 'storeCode'
                    },
                    {
                        label : '餐厅名称',
                        prop  : 'storeName'
                    },
                    {
                        label : '银行JDE号',
                        prop  : 'bankJdeCode'
                    },
                    {
                        label : 'BOH应存行金额',
                        prop  : 'confirmAmount'
                    },
                    // {
                    //     label : '银行金额',
                    //     prop  : 'bankAmount'
                    // },
                    // {
                    //     label : '存行差异',
                    //     prop  : 'differAmount',
                    // },
                    {
                        label : '营业款所属日期',
                        prop  : 'bizDateStr',
                    },
                    {
                        label : '应存行日期',
                        prop  : 'savingDateStr',
                    },
                    {
                        label : '实际存行日期',
                        prop  : 'confirmDateStr',
                    },
                    {
                        label : '存行滞后天数',
                        prop  : 'dayNums',
                    },
                    {
                        label : '下一存行日日期',
                        prop  : 'nextSavingDateStr',
                    },
                    // {
                    //     label : '应报备层级',
                    //     prop  : 'recordLevel',
                    // },
                    {
                        label : '异常原因类别',
                        prop  : 'resonCategory',
                        width : '130px',
                        edit  : true,
                        type  : 'select',
                        selectLabelKey : 'entryName',
                        selectValueKey : 'entryCode',
                        options :[],
                        method  : (index,row) => {
                            // console.log(row);
                            // console.log(index);
                            this.updateLineReason(index,row);
                        }
                    },
                    {
                        label : '异常原因备注',
                        prop  : 'exceptionRemark',
                        edit  : true,
                        emptyText   : '编辑',
                        columnClass : 'remark-column',
                        method: (index, row, self, rowIndex) => {
                            console.log(index);
                            this.tempDataIndex = rowIndex;
                            this.openDRemark(row,self);
                        }
                    },

                ],
                selection: true,
                tblSelectedData : [],
                align: 'center',
                // pageSizesList: [5, 10, 15, 20, 25,30],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                remarkVisible: false,
                financialMarket:'',
                companyName:'',
                storeCode:'',
                moreFlag:false,
                reason:'',
                reasonOpts:[],
                reasonForMulti : '',
                tempCashaMainId:'',
                searchCompanyScrollPageIndex : 1,
                searchCompanyScrollFlag      : true,
                searchCompanySelectObj       : {},
                tempSearchCompanyKeyWord     : '',
                searchStoreScrollPageIndex : 1,
                searchStoreScrollFlag      : true,
                searchStoreSelectObj       : {},
                tempSearchStoreKeyWord     : '',
                setReasonDialogVisible     : false,
                setReasonForm : {
                    reason : ''
                }
            }
        },
        methods: {
            //search组件 范围变量变化
            rangeDatechange(emitObj){
                let _self = this;
                for(let searchKey in pageUtil.searchConfig.searchObj){
                for(let emitObjKey in emitObj){
                    if(searchKey == emitObjKey){
                    pageUtil.searchConfig.searchObj[searchKey] = emitObj[emitObjKey];
                    }
                }
                }
            },
            handleSelectionChange(selectedData){
                console.log(selectedData);
                this.tblSelectedData = selectedData.concat();
            },
            getExceptionCategorys(){
                let _self = this;
                apiStore.getExceptionCategory('',function(res){
                    if(res.code === 200){
                        _self.tableHead.forEach(function(item,index){
                            if(item.label == '异常原因类别'){
                                item.options = res.data;
                                _self.reasonOpts = res.data;
                                pageUtil.searchConfig.searchConditions[4].otherConfig.opts = res.data.concat();
                            }
                        });
                    }else{
                        _self.reasonOpts = [];
                        pageUtil.searchConfig.searchConditions[4].otherConfig.opts = [];
                        _self.tableHead.forEach(function(item,index){
                            if(item.label == '异常原因类别'){
                                item.options = [];
                            }
                        });
                    }
                })
            },
            getAllMarkets(){
                let _self = this;
                //获取所有财务市场
                api.getDictionaryByNumber('MARKETTYPE',function(res){
                    if(res.code == 200){
                        let tempMarketCategory = '';
                        res.data.forEach(function(item,index){
                            if(item.dictionaryEntryName == '财务市场'){
                                tempMarketCategory = item.id;
                            }
                        });
                        let marketSearchParam = _self.common.formatPathParam({
                            pageIndex : 1,
                            pageSize  : 999999,
                            marketCategory : tempMarketCategory
                        });
                        api.getMarketList(marketSearchParam,function(result){
                            let searchMarketConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
                            if(result.code == 200){
                                searchMarketConfig.opts = searchMarketConfig.opts.concat(result.data.list);
                            }else{
                                searchMarketConfig.opts = [];
                            }
                        });
                    }
                });
            },
            //财务市场查询配置
            setSearchMarketConfig(){
                let searchMarketConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                searchMarketConfig.changeMethod = () => {
                    pageUtil.searchConfig.searchObj.companyName = '';
                    searchCompanyConfig.opts = [];
                    this.searchCompanyRemote('');
                    pageUtil.searchConfig.searchObj.storeCode = '';
                    searchStoreConfig.opts = [];
                    this.searchStoreRemote('');
                };
            },
            //法人公司查询配置
            setSearchCompanyConfig(){
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                searchCompanyConfig.remoteMethod = (query) => {
                    //console.log(query);
                    this.searchCompanyRemote(query);
                };
                searchCompanyConfig.scrollMethod = (param,object) => {
                    this.searchCompanyScrollMethod(param,object);
                };
                searchCompanyConfig.visibleChange = (isVisible) => {
                if(!isVisible && !pageUtil.searchConfig.searchObj.companyName){
                    searchCompanyConfig.opts = [];
                    this.searchCompanyRemote('');
                }else{
                    //this.searchCompanyRemote(pageUtil.searchConfig.searchObj.companyName);
                }
                };
                searchCompanyConfig.changeMethod = () => {
                    pageUtil.searchConfig.searchObj.storeCode = '';
                    searchStoreConfig.opts = [];
                    this.searchStoreRemote('');
                }
                this.searchCompanyRemote('');
            },
            //餐厅编号查询配置
            setSearchStoreConfig(){
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                searchStoreConfig.remoteMethod = (query) => {
                    this.searchStoreRemote(query);
                };
                searchStoreConfig.scrollMethod = (param,object) => {
                    this.searchStoreScrollMethod(param,object);
                };
                searchStoreConfig.visibleChange = (isVisible) => {
                    if(!isVisible && !pageUtil.searchConfig.searchObj.storeCode){
                        searchStoreConfig.opts = [];
                        this.searchStoreRemote('');
                    }
                };
                this.searchStoreRemote('');
            },
            //法人公司下拉查询和远程查询
            searchCompanyScrollMethod(param,object){
                let _self = this;
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
                if(param){
                    this.searchCompanySelectObj = object;
                    if(this.searchCompanyScrollFlag){
                        this.searchCompanyScrollPageIndex++;
                        let param = this.common.formatPathParam({
                        companyName  : this.tempSearchCompanyKeyWord,
                        marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
                        pageIndex    : this.searchCompanyScrollPageIndex,
                        pageSize     : 20
                        });
                        api.getCompanyByFMarket(param,function(res){
                        if(res.code === 200){
                            searchCompanyConfig.opts = searchCompanyConfig.opts.concat(res.data);
                        }else{
                            _self.searchCompanyScrollFlag = false;
                        }
                        })
                    }
                }
            },
            searchCompanyRemote(query){
                let _self = this;
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
                searchCompanyConfig.remoteLoading = true;
                this.searchCompanyScrollPageIndex = 1;
                this.tempSearchCompanyKeyWord = query;
                this.searchCompanyScrollFlag = true;
                if(JSON.stringify(this.searchCompanySelectObj) !== '{}'){
                    this.searchCompanySelectObj.scrollTop = 0;
                }
                let param = this.common.formatPathParam({
                    companyName  : query,
                    marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
                    pageIndex    : this.searchCompanyScrollPageIndex,
                    pageSize     : 20
                });
                api.getCompanyByFMarket(param,function(result){
                    searchCompanyConfig.remoteLoading = false;
                    if(result.code == 200){
                        searchCompanyConfig.opts = [];
                        searchCompanyConfig.opts = searchCompanyConfig.opts.concat(result.data);
                    }else if(result.code == 404){
                        searchCompanyConfig.opts = [];
                        pageUtil.searchConfig.searchObj.companyName = '';
                    }
                })
            },
            //餐厅下拉查询和远程查询
            searchStoreScrollMethod(param,object){
                let _self = this;
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                if(param){
                    this.searchStoreSelectObj = object;
                    if(this.searchStoreScrollFlag){
                        this.searchStoreScrollPageIndex++;
                        let param = {
                            companyCode     : pageUtil.searchConfig.searchObj.companyName? pageUtil.searchConfig.searchObj.companyName : null,
                            financialMarket : pageUtil.searchConfig.searchObj.financialMarket? pageUtil.searchConfig.searchObj.financialMarket : null,
                            storeHypId   : this.tempSearchStoreKeyWord? this.tempSearchStoreKeyWord : null,
                            pageIndex    : this.searchStoreScrollPageIndex,
                            pageSize     : 20
                        };
                        api.getSelectSearchCondition(param,function(res){
                            if(res.code === 200){
                                searchStoreConfig.opts = searchStoreConfig.opts.concat(res.data);
                            }else{
                                _self.searchStoreScrollFlag = false;
                            }
                        })
                    }
                }
            },
            searchStoreRemote(query){
                let _self = this;
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                searchStoreConfig.remoteLoading = true;
                this.searchStoreScrollPageIndex = 1;
                this.tempSearchStoreKeyWord = query;
                this.searchStoreScrollFlag = true;
                if(JSON.stringify(this.searchStoreSelectObj) !== '{}'){
                    this.searchStoreSelectObj.scrollTop = 0;
                }
                let param = {
                    companyCode     : pageUtil.searchConfig.searchObj.companyName? pageUtil.searchConfig.searchObj.companyName : null,
                    financialMarket : pageUtil.searchConfig.searchObj.financialMarket? pageUtil.searchConfig.searchObj.financialMarket : null,
                    storeHypId   : query,
                    pageIndex    : this.searchStoreScrollPageIndex,
                    pageSize     : 20
                };
                api.getSelectSearchCondition(param,function(result){
                    searchStoreConfig.remoteLoading = false;
                    if(result.code == 200){
                        searchStoreConfig.opts = [];
                        searchStoreConfig.opts = searchStoreConfig.opts.concat(result.data);
                    }else if(result.code == 404){
                        searchStoreConfig.opts = [];
                        pageUtil.searchConfig.searchObj.storeCode = '';
                    }
                })
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData();
            },
            openDRemark(row) {
                this.remarkVisible = true;
                this.reason = row.exceptionRemark;
                this.tempCashaMainId = row.cashaMainId;
            },
            sureIsRight(title) {
                this.$alert(title, {
                    confirmButtonText: '确定',
                    center:true,
                    callback: action => {
                        // this.common.messageUtil({
                        //     type: 'info',
                        //     message: `action: ${ action }`
                        // });
                    }
                });
            },
            search(){
                this.currentPage = 1
                this.getData()
            },
            getData(){
                let _self = this;
                let pageParam = {
                    pageIndex : this.currentPage,
                    pageSize  : this.pageSize
                };
                let searchParam = Object.assign({},pageParam,pageUtil.searchConfig.searchObj);
                searchParam.moreFlag = searchParam.moreFlag? 'true' : 'false';
                if(!searchParam.financialMarket && !searchParam.companyName && !searchParam.storeCode){
                    this.common.messageUtil({
                        message : '请至少选择一个财务市场法人公司或餐厅编号',
                        type    : 'warning'
                    })
                    return false;
                };
                let param = this.common.formatPathParam(searchParam);
                apiStore.getMatchData(param,function(res){
                    _self.tempResonCategorys = [];
                    if(res.code === 200){
                        _self.dynamicData  = res.data.list;
                        _self.dynamicData.forEach(function(item,index){
                            _self.tempResonCategorys.push(item.resonCategory);
                        });
                        _self.totalRecords = res.data.totalRecords;
                    }else if(res.code === 404){
                        _self.dynamicData  = [];
                        _self.totalRecords = 0;
                    }else{
                        _self.dynamicData  = [];
                        _self.totalRecords = 0;
                        _self.common.errorMessage(res.msg);
                    }
                })
            },
            exportData(){
                let _self = this;
                let exportParam = Object.assign({},pageUtil.searchConfig.searchObj);
                exportParam.moreFlag = exportParam.moreFlag? 'true' : 'false';
                if(!exportParam.financialMarket && !exportParam.companyName && !exportParam.storeCode){
                    this.common.messageUtil({
                        message : '请至少选择一个财务市场法人公司或餐厅编号',
                        type    : 'warning'
                    })
                    return false;
                };
                let param = this.common.formatPathParam(exportParam);
                apiStore.exportMatchData(param,'application/vnd.ms-excel',function(res){
                    if(res.code){
                        _self.common.messageUtil({
                            message: res.msg,
                            type: 'warning'
                        });
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.id = 'downloadRepo';
                        link.download = '现金未存行或少存行.xlsx';
                        //window.location.href = res;
                        // document.getElementById('downloadRepo').click();
                        link.target = '_blank';link.click();
                    }
                })
            },
            sendMail(){
                let _self = this;
                let param = {
                    mainId : []
                }
                if(this.tblSelectedData.length < 1){
                    this.common.messageUtil({
                        message : '请选择要发送邮件的数据',
                        type    : 'warning'
                    });
                    return false;
                }
                this.tblSelectedData.forEach(function(item,index){
                    param.mainId.push(item.cashaMainId)
                });
                apiStore.cashNotSavedIntoBankWarnMailSend(param,function(res){
                    if(res.code === 200){
                        _self.common.messageUtil({
                            message : '发送成功',
                            type    : 'success'
                        });
                    }else{
                        _self.$meaasge.error(res.msg);
                    }
                })
            },
            updateReasonMulti(){
                if(this.tblSelectedData.length < 1){
                    this.common.messageUtil({
                        message : '请选择要设置异常原因类别的数据',
                        type    : 'warning'
                    });
                    return false;
                }
                this.setReasonDialogVisible = true;
            },
            doUpdateReasonMulti(){
                let _self = this;
                this.$refs['setReasonForm'].validate((valid) => {
                    if (valid) {
                        let param = {
                            list : []
                        }
                        _self.tblSelectedData.forEach(function(item,index){
                            param.list.push({
                                cashaMianId : item.cashaMainId,
                                exceptionCategory : _self.setReasonForm.reason
                            })
                        });
                        apiStore.cashNotSavedIntoBankUpdateReasonMulti(param,function(res){
                            if(res.code === 200){
                                _self.common.messageUtil({
                                    message : res.data,
                                    type    : 'success'
                                });
                                _self.setReasonDialogVisible = false;
                                _self.getData();
                            }else{
                                _self.common.errorMessage(res.msg);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });


            },
            updateRemark(){
                let _self = this;
                let param = this.common.formatPathParam({
                    cashaMianId : this.tempCashaMainId,
                    exceptionRemark : this.reason
                });
                apiStore.updateMatchDataRemark(param,function(res){
                    if(res.code === 200){
                        _self.remarkVisible = false;
                        _self.common.messageUtil({
                            message : res.data,
                            type    : 'success'
                        });
                        _self.$set(_self.dynamicData[_self.tempDataIndex],'exceptionRemark',_self.reason);
                        //_self.getData();
                    }else{
                        _self.common.errorMessage(res.msg);
                    }
                })
            },
            updateLineReason(index,row){
                let _self = this;
                this.$confirm('是否更新异常原因类别?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = _self.common.formatPathParam({
                        cashaMianId : row.cashaMainId,
                        exceptionCategory : row.resonCategory
                    });
                    apiStore.updateMatchDataCategory(param,function(res){
                        if(res.code === 200){
                            _self.common.messageUtil({
                                message : res.data,
                                type    : 'success'
                            });
                           // _self.getData();
                        }else{
                            _self.common.errorMessage(res.msg);
                        }
                    })
                }).catch(() => {
                    _self.dynamicData[index].resonCategory = _self.tempResonCategorys[index];
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
.cashNotSavedIntoBank /deep/{
    .textarea-remark{
        min-height:100px;
        width:90%;
        padding:8px;
    }
    .dialog-footer{
        text-align: center;
    }
    hr{
        height:20px;
        background:transparent;
        border:none;
    }
    td.remark-column .cell{
        width: 100%;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
    }
    .reasonset-dialog{
        .el-dialog__body{
            padding: 15px 0 0 0;
            .el-form-item{
                margin-bottom: 15px;
            }
        }
    }
}
</style>
