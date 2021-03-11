<template>
    <div class="cashaDifferResultReportTable">
        <div class="search-content">
            <searchHeader
                    :showDate="true"
                    :showOperateMarket="true"
                    v-on:getBookDate="getBookDate"
                    v-on:getOperateMarkets1="getOperateMarkets"
                    @reset="reset"
                    ref="cashaDifferHeader"
            >
                <div class="selectContent">
                    <div class="selectTitle">活动简称</div>
                    <!--<el-input size="small" v-model.trim="fscActivityCode" clearable></el-input>-->
                    <el-select size="small" filterable v-model.trim="fscActivityCode" >
                        <el-option value="" label="请选择"></el-option>
                        <el-option v-for="(item,index) in activityList" :value="item.abbr" :label="item.abbr" :key="index"></el-option>
                    </el-select>
                </div>
                <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
                <el-button size="small" type="success" class="findButt" @click="download">下载</el-button>
                <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
            </searchHeader>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="cashaDifferResultReportTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import apidr from '@/model/apidr'
    import api from '@/model/api'
    import searchHeader from '@/components/common/searchHeader'

    export default {
        name: 'cashaDifferResult',
        components: {
            tableOrigin,
            searchHeader
        },
        data () {
            return {
                dynamicData: [],
                tableHead: [
                    {
                       label:'法人公司',
                       prop:'companyName'
                    },
                    {
                        label:'营运市场',
                        prop:'operateCode'
                    },
                    {
                        label:'餐厅',
                        prop:'storeCode'
                    },
                    {
                        label:'活动简称',
                        prop:'fscActivityCode'
                    },
                    {
                        label:'营业日期',
                        prop:'bizDate'
                    },
                    {
                        label:'差异产生日期',
                        prop:'checkTime'
                    },
                    {
                        label:'差异定位完成日期',
                        prop:'completeTime'
                    },
                    {
                        label:'持续天数',
                        prop:'completeDays'
                    },
                ],
                align: 'center',
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                bookDate: [],
                operateMarket: '',
                fscActivityCode: '',
                activityList:[]
            }
        },
        methods: {
            handleSizeChange (size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange (currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getData (num) {
                if(num === 1){
                    this.currentPage = 1;
                }
                apidr.getCashaDifferResult(this.common.joinSearchParam([
                    {
                        value:this.operateMarket,
                        name:'operateCode'
                    },
                    {
                        value:this.fscActivityCode,
                        name:'fscActivityCode'
                    },
                    {
                        value:this.bookDate?this.bookDate[0]:null,
                        name:'bizDateBegin'
                    },
                    {
                        value:this.bookDate?this.bookDate[1]:null,
                        name:'bizDateEnd'
                    },
                    {
                        value:this.pageSize,
                        name:'pageSize'
                    },
                    {
                        value:this.currentPage,
                        name:'pageIndex'
                    }
                ]),res=>{
                    this.dynamicData =  res.code === 200? res.data.list:[];
                    this.totalRecords =  res.code === 200? res.data.totalRecords:0
                })
            },
            reset () {
               this.fscActivityCode = '';
                this.$refs.cashaDifferHeader.reset();
            },
            download () {
                apidr.downloadCashaDifferResult({
                    "bizDateBegin": this.bookDate?this.bookDate[0]:null,
                    "bizDateEnd": this.bookDate?this.bookDate[1]:null,
                    "fscActivityCode": this.fscActivityCode,
                    "operateCode": this.operateMarket,
                },'application/vnd.ms-excel',(res,header)=>{
                    let name = header['content-disposition'];
                    this.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
            getBookDate (res) {
                this.bookDate = res;
            },
            getOperateMarkets (res) {
                this.operateMarket = res;
            },
            getList(){
                api.getActiveList('?pageSize=0',res=>{
                    if(res.code === 200){
                        this.activityList = res.data.list.map(item=>{
                            return {
                                abbr:item.activityAbbreviation
                            }
                        })
                    }
                })
            }
        },
        beforeMount(){
            this.getData();
            this.getList();
        }
    }
</script>
