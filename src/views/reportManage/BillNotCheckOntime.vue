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
    import apiStore from '../../model/apidr'
    import api from '../../model/api'
    import scroll from '@/directives/index'
    //查询form组件
    import searchHeader from '../restaurant/dataCheck/dataCheckComponent/searchHeader'
    //查询form配置
    import pageUtil from '../../utils/restaurant/report/billNotCheckOntime'
    import tableOrigin from '../restaurant/BOHDataMg/originalTable'
    export default {
        name: "BillNotCheckOntime",
        components: {
            tableOrigin,
            searchHeader
        },
        directives: { scroll },
        computed: {},
        beforeMount(){
            //法人公司查询配置
            this.getSearchOpts();
            this.setSearchCompanyConfig();
            this.setSearchDateConfig();
            this.search();
        },
        data() { 
            return {
                dynamicData: [],
                adjustTypeOpts: [],
                tableHead: [
                    {
                        label : '法人公司',
                        prop  : 'companyCode'
                    },
                    {
                        label : '活动名称',
                        prop  : 'activityName'
                    },
                    {
                        label : '账单金额',
                        prop  : 'amount'
                    },
                    {
                        label : '营业日期',
                        prop  : 'operateDate'
                    },
                    {
                        label : '银行实际入账日期',
                        prop  : 'actualBookDate'
                    },
                    {
                        label : '应上账日期',
                        prop  : 'ShouldBookDate'
                    },
                    {
                        label : '应核对日期',
                        prop  : 'ShouldCheckDate'
                    },
                    {
                        label : '实际核对日期',
                        prop  : 'actualCheckDate'
                    },
                    {
                        label : '核对延迟天数',
                        prop  : 'delayDay'
                    },
                    {
                        label : '活动负责人',
                        prop  : 'userName'
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
                            return time.getTime() <= _self.startTimeVal-31*24*60*60*1000 || time.getTime() >= _self.startTimeVal + 31*24*60*60*1000
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
            getSearchOpts(){
                api.getActiveList('?pageSize='+999999,result=>{
                    if(result.data.list){
                        pageUtil.searchConfig.searchConditions[2].otherConfig.opts = result.data.list.concat();
                    }else{
                        pageUtil.searchConfig.searchConditions[2].otherConfig.opts = [];
                    }
                })
            },
            //法人公司查询配置
            setSearchCompanyConfig(){
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
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
                this.searchCompanyRemote('');
            },
            setSearchDateConfig(){
                let searchDateConfig = pageUtil.searchConfig.searchConditions[0];
                searchDateConfig.pickOptions = this.onRangeDatePick;
            },
            //法人公司下拉查询和远程查询
            searchCompanyScrollMethod(param,object){
                let _self = this;
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
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
                let searchCompanyConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
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
                //若时间为空啧默认查询最近31天的数据
                let defaultStartTime = this.common.formatDate(new Date(new Date().getTime() - 31*24*60*60*1000),'yyyy-MM-dd');
                let defaultEndTime = this.common.formatDate(new Date(),'yyyy-MM-dd');
                searchObj.preActualCheckDate = searchObj.preActualCheckDate? searchObj.preActualCheckDate + ' 00:00:00' : defaultStartTime + ' 00:00:00';
                searchObj.finalActualCheckDate = searchObj.finalActualCheckDate? searchObj.finalActualCheckDate + ' 23:59:59' : defaultEndTime + ' 23:59:59';

                let param = this.common.formatPathParam(searchObj);
                apiStore.getBillNotCheckOntimeData(param,function(result){
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
                //若时间为空啧默认查询最近31天的数据
                let defaultStartTime = this.common.formatDate(new Date(new Date().getTime() - 31*24*60*60*1000),'yyyy-MM-dd');
                let defaultEndTime = this.common.formatDate(new Date(),'yyyy-MM-dd');
                searchObj.preActualCheckDate = searchObj.preActualCheckDate? searchObj.preActualCheckDate + ' 00:00:00' : defaultStartTime + ' 00:00:00';
                searchObj.finalActualCheckDate = searchObj.finalActualCheckDate? searchObj.finalActualCheckDate + ' 23:59:59' : defaultEndTime + ' 23:59:59';

                apiStore.downLoadBillNotCheckOntimeData(searchObj,'application/vnd.ms-excel',function(res){
                    if(res.code){
                        _self.common.messageUtil({
                            message: res.msg,
                            type: 'warning'
                        });
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = '账单未及时核对统计报告.xlsx';
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
