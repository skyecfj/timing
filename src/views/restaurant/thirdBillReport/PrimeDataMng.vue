<template>
    <div class="nonchasBOHandThirdPart">
        <div class="search-content" >
            <searchHeader v-bind:searchConfig="pageUtil.searchConfig"
                          v-on:rangeDatechange="rangeDatechange"
                          v-on:clearDateRange="clearDateRange" ></searchHeader>
            <el-button size="small"  type="success" class="findButt" @click="search">查询</el-button>
            <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
            <el-button size="small"  type="success" class="findButt" @click="exportDetail('download')">下载</el-button>
        </div>
        <div class="content" >
            <tableOrigin :tableHead="tableHead"
                         :align="align"
                         :dynamicData="dynamicData"
                         ref="nonchasBOHandThirdPart"
                         @handleSizeChange ="handleSizeChange"
                         @handleCurrentChange = "handleCurrentChange"
                         :totalRecords="totalRecords"
                         :pageIndex="currentPage" >
            </tableOrigin>
        </div>
    </div>
</template>

<script>
    import apiStore from '../../../model/apidr'
    import api from '../../../model/api'
    import scroll from '@/directives/index'
    //查询form组件
    import searchHeader from '../dataCheck/dataCheckComponent/searchHeader'
    //查询form配置
    import pageUtil from '../../../utils/primeDataMng'
    import tableOrigin from '../BOHDataMg/originalTable'
    export default {
        name: "PrimeDataMng",
        components: {
            tableOrigin,
            searchHeader
        },
        directives: { scroll },
        computed: {},
        beforeMount(){
            this.getSearchOptioins();
            //法人公司查询配置
            this.setSearchCompanyConfig();
            //餐厅编号查询配置
            this.setSearchStoreConfig();
            this.setSearchDateConfig();
        },
        data() { 
            return {
                dynamicData: [],
                adjustTypeOpts: [],
                tableHead: [
                    {
                        label : '品牌',
                        prop  : 'useBrand'
                    },
                    {
                        label : '餐厅',
                        prop  : 'storeId'
                    },
                    {
                        label : '法人JDE',
                        prop  : 'companyCode'
                    },
                    {
                        label : '法人公司',
                        prop  : 'companyName'
                    },
                    {
                        label : '核销金额',
                        prop  : 'couponPrice'
                    },
                    {
                        label : '核销日期',
                        prop  : 'usedTime'
                    },
                    {
                        label : '卡号',
                        prop  : 'couponCode',
                    },
                    {
                        label : '交易日期',
                        prop  : 'transTime'
                    },
                    {
                        label : '交易状态',
                        prop  : 'flag'
                    }
                ],
                startTimeVal : '',
                endTimeVal   : '',
                pageUtil : pageUtil,
                selection: false,
                align: 'center',
                currentPage  : 1,
                pageSizeOpt  : [25,50,75,100,125],
                pageSize     : 25,
                totalRecords : 0,
                searchCompanyScrollPageIndex : 1,
                searchCompanyScrollFlag      : true,
                searchCompanySelectObj       : {},
                tempSearchCompanyKeyWord     : '',
                searchStoreScrollPageIndex : 1,
                searchStoreScrollFlag      : true,
                searchStoreSelectObj       : {},
                tempSearchStoreKeyWord     : ''
            }
        },
        computed: {
            onRangeDatePick() {
                let _self = this;
                return {
                    onPick:(dateRange) =>{
                        _self.startTimeVal =  new Date(dateRange.minDate).getTime();
                    },
                    disabledDate:(time) =>{
                        if(_self.startTimeVal){
                            return time.getTime() <= _self.startTimeVal-62*24*60*60*1000 || time.getTime() >= _self.startTimeVal + 62*24*60*60*1000
                        }else{
                            return false;
                        }
                        
                    }
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
            clearDateRange(valueKey){
                this[valueKey] = '';
            },
            //获查询头部选项
            getSearchOptioins(){
                let _self = this;
                apiStore.getBrandSelect('',function(res){
                    pageUtil.searchConfig.searchConditions[2].otherConfig.opts = [];
                    if (res.code === 200) {
                        pageUtil.searchConfig.searchConditions[2].otherConfig.opts = res.data.concat();
                    }
                })
            },
            //法人公司查询配置
            setSearchCompanyConfig(){
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                //let searchStoreConfig = pageUtil.searchConfig.searchConditions[4].otherConfig;
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
                // searchCompanyConfig.changeMethod = () => {
                //     pageUtil.searchConfig.searchObj.storeCode = '';
                //     searchStoreConfig.opts = [];
                //     this.searchStoreRemote('');
                // }
                this.searchCompanyRemote('');
            },
            //餐厅编号查询配置
            setSearchStoreConfig(){
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[4].otherConfig;
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
            setSearchDateConfig(){
                let searchDateConfig = pageUtil.searchConfig.searchConditions[0];
                searchDateConfig.pickOptions = this.onRangeDatePick;
            },
            //法人公司下拉查询和远程查询
            searchCompanyScrollMethod(param,object){
                let _self = this;
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                if(param){
                    this.searchCompanySelectObj = object;
                    if(this.searchCompanyScrollFlag){
                        this.searchCompanyScrollPageIndex++;
                        let param = this.common.formatPathParam({
                            companyName  : this.tempSearchCompanyKeyWord,
                            //marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
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
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                searchCompanyConfig.remoteLoading = true;
                this.searchCompanyScrollPageIndex = 1;
                this.tempSearchCompanyKeyWord = query;
                this.searchCompanyScrollFlag = true;
                if(JSON.stringify(this.searchCompanySelectObj) !== '{}'){
                    this.searchCompanySelectObj.scrollTop = 0;
                }
                let param = this.common.formatPathParam({
                    companyName  : query,
                    //marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
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
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[4].otherConfig;
                if(param){
                    this.searchStoreSelectObj = object;
                    if(this.searchStoreScrollFlag){
                        this.searchStoreScrollPageIndex++;
                        let param = {
                            //companyCode     : pageUtil.searchConfig.searchObj.companyName? pageUtil.searchConfig.searchObj.companyName : null,
                            //financialMarket : pageUtil.searchConfig.searchObj.financialMarket? pageUtil.searchConfig.searchObj.financialMarket : null,
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
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[4].otherConfig;
                searchStoreConfig.remoteLoading = true;
                this.searchStoreScrollPageIndex = 1;
                this.tempSearchStoreKeyWord = query;
                this.searchStoreScrollFlag = true;
                if(JSON.stringify(this.searchStoreSelectObj) !== '{}'){
                    this.searchStoreSelectObj.scrollTop = 0;
                }
                let param = {
                    //companyCode     : pageUtil.searchConfig.searchObj.companyName? pageUtil.searchConfig.searchObj.companyName : null,
                    //financialMarket : pageUtil.searchConfig.searchObj.financialMarket? pageUtil.searchConfig.searchObj.financialMarket : null,
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
                let searchObj = Object.assign({},pageParam,pageUtil.searchConfig.searchObj);
                if(!searchObj.transStartTime || !searchObj.transEndTime){
                    this.common.messageUtil({
                        message: '请选择核销日期',
                        type: 'warning'
                    });
                    return false;
                }
                let param = this.common.formatPathParam(searchObj);
                apiStore.getPrimeDataList(param,function(result){
                    _self.dynamicData  = [];
                    _self.totalRecords = 0;
                    if(result.code == 200){
                        _self.dynamicData = result.data.list;
                        _self.totalRecords = result.data.totalRecords;
                    }else if(result.code != 404){
                        _self.common.errorMessage(result.msg);
                    }
                })
            },
            //下载数据
            exportDetail(actType){
                let _self = this;
                let searchObj = Object.assign({},pageUtil.searchConfig.searchObj);
                if(!searchObj.transStartTime || !searchObj.transEndTime){
                    this.common.messageUtil({
                        message: '请选择核销日期',
                        type: 'warning'
                    });
                    return false;
                }
                apiStore.downLoadPrimeData(searchObj,'application/vnd.ms-excel',function(res){
                    if(res.code){
                        _self.common.messageUtil({
                            message: res.msg,
                            type: 'warning'
                        });
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = 'Prime数据.xlsx';
                        link.target = '_blank';link.click();
                    }
                })
            },
            reset(){
                pageUtil.searchConfig.searchObj.reset = true;
                //this.getData();
            }
        }
    }

</script>

<style scoped>
</style>
