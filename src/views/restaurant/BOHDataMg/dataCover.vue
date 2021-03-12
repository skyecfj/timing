<!-- 数据覆盖-->
<template>
    <div class="dataCover">
        <div class="search-content" >
            <searchHeader
                    :showCompany="false"
                    :showFinancialMarket="false"
                    :showDate="true"
                    :showStoreCode="true"
                    :showOperateMarket="true"
                    :dataPermission="true"
                    v-on:getBookDate="getBookDate"
                    v-on:getStoreCode1="getStore"
                    v-on:getOperateMarkets1="getOperateMarkets"
                    @reset="reset"
                    ref="dataCoverReport"
            >
                <el-button size="small"  type="success" class="findButt" @click="getData(1)">查询</el-button>
                <el-button size="small"  type="success" plain class="reSet" @click="batchCover">批量覆盖</el-button>
                <el-button size="small"  type="success" plain class="reSet" @click="batchDelete">批量删除</el-button>
                <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
            </searchHeader>

        </div>
        <div class="content" >
            <tableOrigin
                    :tableHead="tableHead"
                    :selection="selection"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="dataCoverTable"
                    :operates="operates"
                    @handleSizeChange ="handleSizeChange"
                    @handleCurrentChange = "handleCurrentChange"
                    :totalRecords="totalRecords"
                    @handleSelectionChange="handleSelectionChange"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>

</template>

<script>
    import tableOrigin from './originalTable'
    import apidr from '../../../model/apidr'
    import scroll from '@/directives/index'
    import searchHeader from '@/components/common/searchHeader'
    export default {
        name: "dataCover",
        components:{
            tableOrigin,
            searchHeader
        },
        directives: {scroll},
        data(){
            return{
                storeCode:'',
                // financialMarket:'',
                bookDate:[],
                // company:'',
                operateMarket:'',
                dynamicData:[],
                tableHead:[
                    {
                        label:'餐厅编号',
                        prop:'storeCode'
                    },
                    {
                        label:'餐厅名称',
                        prop:'storeName'
                    },
                    {
                        label:'营业日期',
                        prop:'bizDate'
                    },
                    {
                        label:'法人公司',
                        prop:'legalPersonCompany'
                    },
                    {
                        label:'含税收入差异',
                        prop:'taxableSalesDiff'
                    },
                    {
                        label:'差异项数量',
                        prop:'diffNum'
                    },
                    {
                        label:'差异项和',
                        prop:'diffAmount',
                        labelComments: '（本次接入-已接入）',
                        commentColor: '#000'
                    }
                ],
                selection:true,
                align:'center',
                // pageSizesList: [5,10,15,20,25],
                pageSize: 25,
                currentPage: 1,
                totalRecords:0,
                operates:{
                       width: 150,
                       fixed: 'right',
                       list: [
                           {
                               label: '明细',
                               show:true,
                               class:'c-button-icon--primary--opacity c-button-icon-circle',
                               iClass:'fa fa-file-alt',
                               method: (index, row) => {
                                    var dataCoverDetailInfo = {cashaMainId:row.id,storeName:row.storeName,bizDate:row.bizDate,storeCode:row.storeCode}
                                    sessionStorage.setItem('dataCoverDetailInfo',JSON.stringify(dataCoverDetailInfo));
                                    this.$router.push({name:'dataCoverDetail',params:{parentRoute:this.$route.fullPath},query:{id:row.id}})
                               }
                           },
                           {
                               label: '确认覆盖',
                               show:true,
                               class:'c-button-icon--primary--opacity c-button-icon-circle',
                               iClass:'el-icon-check',
                               method: (index, row) => {
                                   this.sureToCover(row.id);

                               }
                           },
                           {
                               label: '删除',
                               show:true,
                               class:'c-button-icon--danger--opacity c-button-icon-circle',
                               iClass:'fa fa-trash-alt',
                               method: (index, row) => {
                                   this.deleteRow(row.id);
                               }
                           }
                    ]
                },
                ids:[],
            }
        },
        mounted(){
            this.getData()
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
            getData(pageIndex){
                var that = this;
                if(pageIndex){
                    this.currentPage = 1;
                }
                apidr.getBOHCashDiffMainList(this.common.joinSearchParam([
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'storeCode',
                        value:this.storeCode
                    },
                    // {
                    //     name:'financialMarket',
                    //     value:this.financialMarket
                    // },
                    // {
                    //     name:'companyCode',
                    //     value:this.company
                    // },
                    {
                        name:'operateMarket',
                        value:this.operateMarket
                    },
                    {
                        name:'bizDateBegin',
                        value:this.bookDate?this.bookDate[0]:''
                    },
                    {
                        name:'bizDateEnd',
                        value:this.bookDate?this.bookDate[1]:''
                    },

                ]),function(res){
                    if(res.code === 200){
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords
                    }else{
                        that.dynamicData = [];
                        that.totalRecords = 0
                    }
                })
            },
            searchData(){
                this.currentPage = 1;
                this.getData()
            },
            reset(){
                this.$refs.dataCoverReport.reset();
            },
            sureToCover(id) {
                let that=this;
                this.$confirm('确认覆盖吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apidr.cashaCover({ids:[id]},function(){
                        that.searchData();
                    });
                })
            },
            deleteRow(id){
                let that = this;
                this.$confirm('是否删除该数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apidr.cashaCoverDelete({ids:[id]},function(){
                        that.searchData();
                    })
                })
            },
            handleSelectionChange(res){
                let that = this;
                that.ids = [];
                if(res && res.length>0){
                    res.forEach(function (item,index) {
                        that.ids.push(item.id);
                    })
                }
            },
            batchCover(){
                if(this.ids && this.ids.length === 0){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请勾选数据后进行操作！'
                    });
                    return false;
                }
               let that = this;
                this.$confirm('是否批量覆盖？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apidr.cashaCover({ids:this.ids},function(){
                        that.searchData();
                        that.ids = [];
                    });
                })

            },
            batchDelete(){
                if(this.ids && this.ids.length === 0){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请勾选数据后进行操作！'
                    });
                    return false;
                }
                let that = this;
                this.$confirm('是否批量删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apidr.cashaCoverDelete({ids:this.ids},function(){
                        that.searchData();
                        that.ids = [];
                    })
                })
            },
            getStore(res){
                this.storeCode = res;
            },
            // getFinancial(res){
            //     this.financialMarket = res;
            // },
            getBookDate(res){
                this.bookDate = res;
            },
            // getCompany(res){
            //     this.company = res;
            // },
            getOperateMarkets(res){
                this.operateMarket = res;
            }
        },
        beforeMount(){
        },
        activated(){
            this.getData();
        }
    }
</script>

<style scoped>

</style>
