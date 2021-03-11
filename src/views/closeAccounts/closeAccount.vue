<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="3" class="dayMargin"><div>账期</div></el-col>
                <el-col :span="3"><div>财务市场名称</div></el-col>
                <el-col :span="3"><div>法人公司</div></el-col>
                <el-col :span="3"><div>预关账状态</div></el-col>
                <el-col :span="3"><div>关账状态</div></el-col>
                <el-col :span="6"><div></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="3" class="dayMargin">
                    <el-date-picker
                            v-model="paymentDay"
                            type="month"
                            placeholder="请输入账期"
                            @change="getPaymentDayObj"
                            value-format="yyyyMM"
                            format="yyyyMM">
                    </el-date-picker>
                </el-col>
                <el-col :span="3">
                    <el-select size="small" v-model="financialMarketId" placeholder="请选择" @change="getMarketObj" filterable>
                        <el-option
                                v-for="item in market"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select  v-model="companyId" filterable remote placeholder="请选择" size="medium" :remote-method="getCompany"
                                :loading="getCompanyLoading" v-scroll="companyScroll" >
                        <el-option label="请选择" value=""></el-option>
                        <el-option  v-for="item in companyList" :key="item.jdeCode" :label="item.companyName" :value="item.companyId" ></el-option>
                    </el-select>
                    <!-- <el-select size="small" ref="company" v-model="companyId" placeholder="请选择" filterable>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="item in company" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select> -->
                </el-col>
                <el-col :span="3">
                    <el-select size="small" v-model="preCloseStatus" placeholder="请选择" @change="getPreCloseObj" filterable>
                        <el-option
                                v-for="item in preClose"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select size="small" v-model="closeStatus" placeholder="请选择" @change="getCloseObj" filterable>
                        <el-option
                                v-for="item in close"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-button size="small" type="success" @click="getCloseAccountList" class="c-button">查询</el-button>
                    <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewIcon">
                <el-button size="small" type="success" @click="closeAccount('ready')" class="c-button">预关账</el-button>
                <el-button size="small" type="success" @click="closeAccount('cancel')" class="c-button">取消预关账</el-button>
                <el-button size="small" type="success" @click="closeAccount('close')" class="c-button">关账</el-button>
            </div>
            <el-table
                    :data="tableData"
                    tooltip-effect="dark"
                    border
                    class="viewTable"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="financialMarket" label="财务市场名称"></el-table-column>
                <el-table-column prop="company" label="法人公司"></el-table-column>
                <el-table-column prop="paymentDay" label="账期"></el-table-column>
                <el-table-column prop="preCloseStatus" label="预关账状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.preCloseStatus === 1" class="complete">已预关账</span>
                        <span v-else-if="scope.row.preCloseStatus === 0">未预关账</span>
                    </template>
                </el-table-column>
                <el-table-column prop="closeStatus" label="关账状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.closeStatus === 1" class="complete">已关账</span>
                        <span v-else-if="scope.row.closeStatus === 0">未关账</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizesList"
                        :page-size="pageSize"
                        class="gross"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    import scroll from '@/directives/index'
    export default {
        name: "closeAccount",
        directives: { scroll },
        data(){
            return{
                paymentDay:'',
                companyId:'',
                remoteFlag:true,
                tempComanySearchKeyWord : '',
                getCompanyLoading : false,
                companyScrollPageIndex  : 1,
                companyScrollFlag       : true,
                companySelectObj        : {},
                financialMarketId:'',
                preCloseStatus:'',
                closeStatus:'',
                companyList: [],
                market: [{value:'',label:'请选择'}],
                preClose:[{
                    value:'',
                    label:'请选择'
                },{
                    value:0,
                    label:'未预关账'
                },{
                    value:1,
                    label:'已预关账'
                }],
                close:[{
                    value:'',
                    label:'请选择'
                },{
                    value:0,
                    label:'未关账'
                },{
                    value:1,
                    label:'已关账'
                }],
                multipleSelection: [],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                loading:false
            }
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getCloseAccountList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getCloseAccountList();
            },
            getPaymentDayObj(obj){
                this.paymentDay = obj;
            },
            getMarketObj(obj){
                this.financialMarketId = obj;
            },
            getPreCloseObj(obj){
                this.preCloseStatus = obj;
            },
            getCloseObj(obj){
                this.closeStatus = obj;
            },
            companyScroll(param,object){
                let _self = this;
                if(param && this.remoteFlag){
                    _self.remoteFlag = false;
                this.companySelectObj = object;
                if(this.companyScrollFlag){
                    this.companyScrollPageIndex++;
                    let param = this.common.formatPathParam({
                        pageSize   : 20,
                        pageIndex  : this.companyScrollPageIndex,
                        companyName : this.tempComanySearchKeyWord,
                        judgePermission : true
                    });
                    ip.getAllCompanyIdNamess(param,function(res){
                        _self.remoteFlag = true;
                        if(res.code === 200){
                            _self.companyList = _self.companyList.concat(res.data.list);
                        }else{
                            _self.companyScrollFlag = false;
                        }
                    })
                }
                }
            },
            //获取法人公司
            getCompany(query){
                let _self = this;
                this.getCompanyLoading = true;
                this.companyScrollPageIndex = 1;
                this.tempComanySearchKeyWord = query;
                if(JSON.stringify(this.companySelectObj) !== '{}'){
                    this.companySelectObj.scrollTop = 0;
                }
                let param = this.common.formatPathParam({
                    pageIndex   : this.companyScrollPageIndex,
                    pageSize    : 20,
                    companyName  : query,
                    judgePermission : true
                });
                ip.getAllCompanyIdNamess(param,function(result){
                    _self.getCompanyLoading = false;
                    if(result.code == 200){
                        _self.companyList = result.data.list;
                    }else if(result.code == 404){
                        _self.companyList = [];
                    }
                })
            },
            getSearchCondition(){
                var that = this;
                ip.getFinanceMarketIdNames('&judgePermission=true',res => {
                    res.data.forEach(item => {
                        that.market.push({
                            value:item.id,
                            label:item.name
                        })
                    })
                });
                //ip.getCompanyIdNamesWithParams('',res => {that.company = res.data})
            },
            getCloseAccountList(param){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'paymentDay',
                        value:this.paymentDay
                    }
                ];
                this.companyId||this.companyId === 0?condition.push({name:'companyId',value:this.companyId}):[];
                this.financialMarketId||this.financialMarketId === 0?condition.push({name:'financialMarketId',value:this.financialMarketId}):[];
                this.preCloseStatus||this.preCloseStatus === 0?condition.push({name:'preCloseStatus',value:this.preCloseStatus}):[];
                this.closeStatus||this.closeStatus === 0?condition.push({name:'closeStatus',value:this.closeStatus}):[];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getCloseAccountList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            reset(){
                this.paymentDay = '';
                this.companyId = '';
                this.financialMarketId = '';
                this.preCloseStatus = '';
                this.closeStatus = '';
                // this.getCloseAccountList();
            },
            closeAccount(status){
                var that = this;
                var selectedItems = {ids:[]};
                this.multipleSelection.forEach((item,index) => {
                    selectedItems.ids.push(item.id);
                });
                if(status === 'ready'){
                    ip.preCloseAccount(selectedItems,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getCloseAccountList();
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                        }
                    })
                }else if(status === 'cancel'){
                    ip.cancelPreClose(selectedItems,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getCloseAccountList();
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                        }
                    })
                }else if(status === 'close'){
                    ip.closeAccount(selectedItems,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getCloseAccountList();
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                        }
                    })
                }
            },
            // fuzzySearch(){
            //     var that = this;
            //     var currentValue = this.$refs.company.$children[0].currentValue;
            //     ip.getCompanyIdNamesWithParams(currentValue,res => {that.company = res.data});
            // },
            // remoteMethod(query){
            //     if(query !== ''){
            //         this.loading = true;
            //         var that = this;
            //         var currentValue = query;
            //         ip.getCompanyIdNamesWithParams(currentValue,res => {that.company = res.data;that.loading=false});
            //         }else{
            //         this.company = [{value:'',label:'请选择'}];
            //     }
            // }
        },
        beforeMount(){
            this.getSearchCondition();
            this.getCompany('');
        },
        mounted(){
            this.getCloseAccountList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/manage';
    .complete{
        color:#85ce61;
    }
    .dayMargin{
        min-width: 50px;
        .el-date-editor.el-input{
            width: 100%;
        }
    }
</style>
