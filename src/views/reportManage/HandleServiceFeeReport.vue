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
    import pageUtil from '../../utils/handleServiceFeeReport'
    import tableOrigin from '../restaurant/BOHDataMg/originalTable'
    export default {
        name: "HandleServiceFeeReport",
        components: {
            tableOrigin,
            searchHeader
        },
        directives: { scroll },
        computed: {},
        beforeMount(){
            this.getSearchOpts();
            this.setSearchDateConfig();
        },
        data() { 
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label : '餐厅',
                        prop  : 'deliveryStore'
                    },
                    {
                        label : '品牌',
                        prop  : 'brand'
                    },
                    {
                        label : '营运市场',
                        prop  : 'operateMarket'
                    },
                    {
                        label : '法人',
                        prop  : 'companyName'
                    },
                    {
                        label : '交易日期',
                        prop  : 'tradeDate'
                    },
                    {
                        label : '活动名称',
                        prop  : 'activityName'
                    },
                    {
                        label : '交易金额',
                        prop  : 'tradeAmount'
                    },
                    {
                        label : '活动主档费用条款',
                        multiple : true,
                            columns  : [{
                                label : '手续费',
                                prop  : 'handingChargePercent'
                            },{
                                label : '服务费',
                                prop  : 'serviceChargePercent'
                            }]
                    },
                    {
                        label : '应收费用金额',
                        multiple : true,
                            columns  : [{
                                label : '手续费',
                                prop  : 'receivableHanding'
                            },{
                                label : '服务费',
                                prop  : 'receivableService'
                            }]
                    },
                    {
                        label : '实收费用金额',
                        multiple : true,
                            columns  : [{
                                label : '手续费',
                                prop  : 'actualHanding'
                            },{
                                label : '服务费',
                                prop  : 'actualService'
                            }]
                    },
                    {
                        label : '差异费用金额（实收-应收）',
                        multiple : true,
                            columns  : [{
                                label : '手续费',
                                prop  : 'differenceHanding'
                            },{
                                label : '服务费',
                                prop  : 'differenceService'
                            }]
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
                        pageUtil.searchConfig.searchConditions[1].otherConfig.opts = result.data.list.concat();
                    }else{
                        pageUtil.searchConfig.searchConditions[1].otherConfig.opts = [];
                    }
                })
            },
            setSearchDateConfig(){
                let searchDateConfig = pageUtil.searchConfig.searchConditions[0];
                searchDateConfig.pickOptions = this.onRangeDatePick;
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
                if(!searchObj.tradeDateStart || !searchObj.tradeDateEnd){
                    this.common.messageUtil({
                        message: '请选择交易日期',
                        type: 'warning'
                    });
                    return false;
                }
                apiStore.getHandleServiceFeeData(searchObj,function(result){
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
                if(!searchObj.tradeDateStart || !searchObj.tradeDateEnd){
                    this.common.messageUtil({
                        message: '请选择交易日期',
                        type: 'warning'
                    });
                    return false;
                }
                apiStore.downLoadHandleServiceFeeData(searchObj,'application/vnd.ms-excel',function(res){
                    if(res.code){
                        _self.common.messageUtil({
                            message: res.msg,
                            type: 'warning'
                        });
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = '手续费服务费差异报表.xlsx';
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
