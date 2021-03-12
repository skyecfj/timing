<template>
    <div class="rebackedByMasterReport">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectContent" >
                    <div class="selectTitle">营运市场</div>
                    <el-select size="small"  v-model="searchData.operateMarket" placeholder="请选择营运市场"  filterable >
                        <el-option value="" label="请选择"></el-option>
                        <el-option v-for="(item,index) in operateMarkets" :key="index" :label="item.marketNumber" :value="item.marketNumber"></el-option>
                    </el-select>
                </div>
                <div class="selectContent" >
                    <div class="selectTitle">提交人</div>
                    <el-input size="small" clearable v-model="searchData.userName"></el-input>
                </div>
            </div>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="rebackedByMasterReport"
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
    export default {
        name: "rebackedByMaster",
        components: {
            tableOrigin
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [{
                        label: '法人公司',
                        prop: 'companyCode',
                    },
                    {
                        label: '营运市场',
                        prop: 'operateMarket',
                    },
                    {
                        label: '餐厅',
                        prop: 'storeCode',
                    },
                    {
                        label: '营业日期',
                        prop: 'bizDate',
                    },
                    {
                        label: '调整类型',
                        prop: 'resultCode',
                    },
                    {
                        label: '提交人',
                        prop: 'userName',
                    },
                    {
                        label: '退回原因',
                        prop: 'auditRemark',
                    }
                ],
                align: 'center',
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                searchData:{
                    operateMarket:'',
                    userName:''
                },
                operateMarkets:[]
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getData(num) {
                if(num === 1){
                    this.currentPage = 1;
                }
                apidr.getRebackedByMaster(this.common.joinSearchParam([{
                    name:'operateMarket',
                    value:this.searchData.operateMarket
                },
                {
                    name:'userName',
                    value:this.searchData.userName
                },
                {
                    name:'pageSize',
                    value:this.pageSize
                },
                {
                    name:'pageIndex',
                    value:this.currentPage
                }
                ]),res=>{
                    res.code === 200?this.dynamicData = res.data.list:[]
                    res.code === 200?this.totalRecords = res.data.totalRecords:0
                })
            },
            reset() {
                this.searchData.operateMarket = '';
                this.searchData.userName = '';
            },
            download(){
                apidr.downloadRebackedByMaster(this.common.joinSearchParam([
                    {
                        value:this.searchData.userName,
                        name:'userName'
                    },
                    {
                        value:this.searchData.operateMarket,
                        name:'operateMarket'
                    }
                ]), 'application/vnd.ms-excel', res=> {
                    this.common.exportTemplate('被主管退回报告.xlsx',res)
                })
            },
            getOperateMarkets(){
                api.getOperateMarketIdNames('&pageSize=9999999', res=> {
                    this.operateMarkets = res.data || []
                })
            },
        },
        beforeMount(){
            this.getOperateMarkets();
        }
    }
</script>

<style scoped>

</style>
