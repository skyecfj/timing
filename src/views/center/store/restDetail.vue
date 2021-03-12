<!--数据查看-->
<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">餐厅编号</div>
                <el-input size="small" v-model.trim="storeCode" placeholder="请输入" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">营业日期</div>
                <el-date-picker
                        type="daterange"
                        range-separator="-"
                        value-format="yyyy-MM-dd"
                        align="right"
                        unlink-panels
                        v-model="bizDate"
                        clearable
                        size="small"
                        :picker-options="pickerOptions"
                        @blur="cleanDate"
                >
                </el-date-picker>
            </div>
            <div class="selectContent margin-top">
                <div class="selectTitle">结算键位</div>
                <el-input size="small" v-model.trim="cashlessNameString" placeholder="请输入"  @blur="getCashlessNames" @keyup.enter.native="$event.target.blur" clearable></el-input>
            </div>
            <br>
            <div class="selectContent margin-top">
                <div class="selectTitle">结算键位总金额</div>
                <el-input size="small" v-model.trim="totalAmountS" placeholder="请输入" clearable @input="leftFn" class="num-width"></el-input>
                <i>-</i>
                <el-input size="small" v-model.trim="totalAmountE" placeholder="请输入" clearable @input="rightFn" class="num-width"></el-input>
            </div>
            <div class="selectContent margin-top">
                <div class="selectTitle">线下单号/券号</div>
                <el-input size="small" v-model.trim="otherCode" placeholder="请输入" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">线上单号</div>
                <el-input size="small" v-model.trim="orderId" placeholder="请输入" clearable></el-input>
            </div>
            <div class="selectContent margin-top">
                <div class="selectTitle">orderUniqueId</div>
                <el-input size="small" v-model.trim="orderUniqueId" placeholder="请输入" clearable></el-input>
            </div>
            <br>
            <div class="selectContent margin-top">
                <el-button size="small" type="success" class="c-button" @click="search('search',1,false)" :disabled="disabledFlag">查询</el-button>
                <el-button size="small" type="success" plain @click="reset" class="c-button" :disabled="disabledFlag">重置</el-button>
                <el-button size="small" type="success"  @click="search('search',1,true)" class="c-button" :disabled="disabledFlag">下载</el-button>

                <el-popover
                        placement="right"
                        trigger="click">
                    <el-table :data="downloadList" v-loadmore="loadMore"  max-height="300" size="small"
                              v-loading="loadingList"
                              element-loading-text="拼命加载中"
                              element-loading-spinner="el-icon-loading"
                              element-loading-background="rgba(0, 0, 0, 0.8)"
                    >
                        <!--<el-table-column  property="exportType" label="导出类型" min-width="120"></el-table-column>-->
                        <el-table-column  label="状态" width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status ===0">已提交</span>
                                <span v-else-if="scope.row.status ===1 ">执行中</span>
                                <span v-if="scope.row.status ===2 ">已完成</span>
                                <span v-else-if="scope.row.status === 3">已失败</span>
                            </template>
                        </el-table-column>
                        <el-table-column  property="createTime" label="创建时间"  width="140"></el-table-column>
                        <!--<el-table-column  property="finishTime" label="结束时间" width="140"></el-table-column>-->
                        <el-table-column width="100" label="地址">
                            <template slot-scope="scope">
                                <a v-if="scope.row.fileUrl" :href="'http://'+scope.row.fileUrl" class="link">下载</a>
                                <a v-else  class="link-disable">下载</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button slot="reference" size="small" type="success" plain @click="getDownloadList()" class="c-button">查看下载列表</el-button>

                    <!--<el-button >click 激活</el-button>-->
                </el-popover>
            </div>
        </div>
        <div class="dataContent">
            <div class="viewIcon" >
                结算键位金额的合计 : {{totalNum}}
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="viewTable">
                <el-table-column prop="dataSourceType" label="数据来源类型"></el-table-column>
                <el-table-column prop="brand" label="品牌"></el-table-column>
                <el-table-column prop="bizDate" label="营业日期"></el-table-column>
                <el-table-column prop="storeCode" label="餐厅编号" width="90px"></el-table-column>
                <el-table-column prop="storeChineseName" label="餐厅名称"></el-table-column>
                <el-table-column prop="cashlessName" label="结算键位"></el-table-column>
                <el-table-column prop="paymentAmount" label="结算键位金额"></el-table-column>
                <el-table-column prop="totalAmount" label="订单支付总金额"></el-table-column>
                <el-table-column prop="onlinepaymentcode" label="线上单号"></el-table-column>
                <el-table-column prop="otherCode" label="线下单号/券号"></el-table-column>
                <el-table-column prop="posordercode" label="POS订单号"></el-table-column>
                <el-table-column prop="transactionTime" label="交易时间" width="140px"></el-table-column>
                <el-table-column prop="salesType" label="salesType"></el-table-column>
                <el-table-column prop="orderUniqueId" label="orderUniqueId"></el-table-column>
                <!--<el-table-column prop="channel" label="交易渠道"></el-table-column>-->
                <!--<el-table-column prop="businessType" label="业务类型"></el-table-column>-->
                <!--<el-table-column prop="remark" label="备注"></el-table-column>-->
                <!--<el-table-column prop="month" label="订单创建月份"></el-table-column>-->
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
    import ip from '../../../model/api'
    import Vue from 'vue';
    export default {
        name: "restDetail",
        data() {
            return {
                restaurants:[1,2,3],
                storeCode:'',
                bizDate:[],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                totalRecords:0,
                tableData: [],
                orderId:'',
                cashlessName:[],
                cashlessNameString:'',
                maxDate:'',
                minDate:'',
                pickerOptions:{
                    onPick:(dateRange)=>{
                        this.minDate =  new Date(dateRange.minDate).getTime();
                        this.maxDate =  new Date(dateRange.maxDate).getTime();
                    },
                },
                otherCode:'',
                totalAmount:'',
                orderUniqueId:'',
                days:31,
                totalAmountS:null,
                totalAmountE:null,
                totalNum:'--',
                downloadList:[],
                loadSign:true,
                listPageIndex:1,
                listPageSize:10,
                loadingList:false,
                // loading:false,
                disabledFlag:false
            }
        },
        // computed: {
        //     totalAmountE: {
        //
        //     }
        // },
        watch:{
            minDate(val,oldVal){
                var that = this;
                this.pickerOptions = Object.assign({},{
                    onPick:(dateRange)=>{
                        this.minDate =  new Date(dateRange.minDate).getTime();
                        this.maxDate =  new Date(dateRange.maxDate).getTime();
                        if(that.common.isNullString(that.storeCode) && (that.cashlessNameString.indexOf('微信') >= 0 || that.cashlessNameString.indexOf('支付宝') >=0 )){
                            that.days = 1;
                        }else if(that.common.isNullString(that.storeCode) &&( that.cashlessNameString.indexOf('微信')<0 && that.cashlessNameString.indexOf('支付宝')<0)){
                            that.days = 7;
                        }else{
                            that.days = 31;
                        }
                    },
                    disabledDate: (time) => {
                        if(that.minDate){
                            return time.getTime() <= that.minDate-that.days*24*60*60*1000 || time.getTime() >= that.minDate +that.days*24*60*60*1000;
                        }else{
                            return false;
                        }

                    }
                });
            },
            bizDate(val,oldVal){
                if(!val || (val &&val.length === 0)){
                    this.pickerOptions = Object.assign({},{
                        onPick:(dateRange)=>{
                            this.minDate =  new Date(dateRange.minDate).getTime();
                            this.maxDate =  new Date(dateRange.maxDate).getTime();
                        },
                        disabledDate: (time) => {
                            return false;
                        }
                    });
                    this.minDate = '';
                }

            }
        },
        created(){
            Vue.directive('loadmore', {
                bind(el, binding) {
                    const selectWrap = el.querySelector('.el-table__body-wrapper');
                    selectWrap.addEventListener('scroll', function() {
                        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                        if(scrollDistance <= 0){
                            binding.value()
                        }
                    })
                }
            },{passive: true})
        },
        methods: {
            handleSizeChange:function(size) {
                this.pageSize = size;
                // this.search(false,1,'page');
                this.search('page',1);
            },
            handleCurrentChange:function(currentPage) {
                this.currentPage = currentPage;
                // this.search(false,currentPage)
                this.search('page',currentPage)
            },
            reset(){
                this.storeCode = '';
                this.bizDate = [];
                this.orderId = '';
                this.cashlessNameString = '';
                this.cashlessName = [];
                this.otherCode = '';
                this.orderUniqueId = '';
                // this.totalAmount = '';
                this.totalAmountS = null;
                this.totalAmountE = null;
            },
            cleanDate(){
                if(!this.maxDate){
                    this.minDate = '';
                    this.bizDate = [];
                }
            },
            search(type,index,flag){
                if(index){
                    this.currentPage = index;
                }
                var that = this;
                if(this.judgeWhetherCondition()){
                    if((this.bizDate && this.bizDate.length > 0 && that.getFinalDateMinus(this.bizDate[0],this.bizDate[1])>7)&& (this.cashlessNameString &&
                        (this.cashlessNameString.indexOf('微信')<0 && this.cashlessNameString.indexOf('支付宝')<0)) && this.common.isNullString(this.storeCode)){
                        that.common.messageUtil({
                            type:'warning',
                            message:'请缩短查询日期进行查询!'
                        });
                        return;
                    }
                    if((this.bizDate && this.bizDate.length > 0 && that.getFinalDateMinus(this.bizDate[0],this.bizDate[1])>1)&& (this.cashlessNameString &&
                        (this.cashlessNameString.indexOf('微信') !== -1 ||this.cashlessNameString.indexOf('支付宝') !== -1)) && this.common.isNullString(this.storeCode)){
                        that.common.messageUtil({
                            type:'warning',
                            message:'请缩短查询日期进行查询!'
                        });
                        return;
                    }
                    if(this.common.isNullString(this.cashlessNameString) && this.common.isNullString(this.storeCode)){
                        that.common.messageUtil({
                            type:'warning',
                            message:'请填写餐厅编号或者结算键位!'
                        });
                        return;
                    }
                    if( this.common.isNullString(this.storeCode) && !flag){
                        that.common.messageUtil({
                            type:'warning',
                            message:'查询页面显示仅限于输入餐厅的查询，请点击下载查看查询结果!'
                        });
                        return;
                    }
                    // if(isNaN(this.totalAmount)){
                    //     that.common.messageUtil({
                    //         type:'warning',
                    //         message:'请输入正确的金额!'
                    //     });
                    //     return;
                    // }
                    if(!this.bizDate||this.bizDate.length === 0 && (!(this.common.isNullString(this.storeCode) && this.common.isNullString(this.cashlessNameString)))){
                        that.common.messageUtil({
                            type:'warning',
                            message:'请输入营业日期!'
                        });
                        return;
                    }
                    if(this.common.isNullString(this.totalAmountS) && this.common.isNullString(this.totalAmountE) && this.totalAmountS > this.totalAmountE){
                        that.common.messageUtil({
                            type:'warning',
                            message:'请输入正确的金额范围!'
                        });
                        return;
                    }
                }
                if(!this.cashlessNameString){
                    this.cashlessName = [];
                }
                this.param = {
                    pageIndex: this.currentPage,
                    pageSize: this.pageSize,
                    storeCode: this.storeCode.trim(),
                    bizDateBegin: this.bizDate ? this.bizDate[0]+' 00:00:00' : '',
                    bizDateEnd: this.bizDate ? this.bizDate[1]+' 23:59:59' : '',
                    onlinePaymentCode: this.orderId.trim(),
                    cashlessName: this.cashlessName.filter(x=>{return !!x}),
                    otherCode:this.otherCode.trim(),
                    orderUniqueId:this.orderUniqueId.trim(),
                    paymentAmountMax:this.totalAmountE,
                    paymentAmountMin:this.totalAmountS,
                };
                // if(type){
                //
                // }
                if(!flag){
                    if(type === 'search'){
                        // let fn =that.loading =
                        this.getRestaurantList(this.param,function(param){
                            that.disabledFlag = true;
                            ip.getTotalNum(param,function(res){
                                that.totalNum = res.data.paymentAmountCount;
                                // that.loading = false ;
                                that.disabledFlag = false;
                            },function(err){
                                // that.loading = false ;
                                that.common.messageUtil({
                                    type: 'error',
                                    message: err
                                })
                            });
                        })
                    }else{
                        this.RestaurantListNoCheck(this.param)
                    }
                }else{
                    this.download(this.param);
                }
            },
            getRestaurantList(param,fn) {
                var that = this;
                if (fn) {
                    that.totalNum = '--';
                }
                ip.checkCountNumber(param, function (res) {
                    if (res.code === 200) {
                        if(res.data >0){
                            that.totalRecords = res.data;
                            ip.getRestaurantList(param, function (res) {
                                that.tableData = [];
                                if (res.code === 200) {
                                    that.tableData = res.data.list;
                                    if (fn) {
                                        that.loading = true ;
                                        fn(param);
                                    }
                                } else if (res.code !== 404) {
                                    that.common.warningMessage(res.msg);
                                    that.disabledFlag = false;
                                    that.totalRecords = 0;
                                }else if(res.code === 404){
                                    that.totalRecords = 0;
                                }
                            },function(res){
                                that.disabledFlag = false;
                            })
                        }else{
                            that.tableData = [];
                        }
                    } else {
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            },
            RestaurantListNoCheck(param){
                var that = this;
                ip.getRestaurantList(param, function (res) {
                    that.tableData = [];
                    if (res.code === 200) {
                        that.tableData = res.data.list;
                        // that.totalRecords = res.data.totalRecords;

                    } else if (res.code !== 404) {
                        that.common.warningMessage(res.msg);
                    }
                })
            },
            download(param){
                let that = this;
                // ip.checkCountNumber(param,function(res){
                //     if(res.code === 200){
                ip.exportFileFromDrOrder(param,function(res){
                    if(res.code === 404){
                        that.common.messageUtil({
                            type:'warning',
                            message:res.msg
                        })
                    }else if(res.code !== 200 && res.code !== 404){
                        that.common.messageUtil({
                            type:'error',
                            message:res.msg
                        })
                    }else if(res.code === 200){
                        that.common.messageUtil({
                            type:'success',
                            message:res.data+',请查看下载列表！'
                        })
                    }
                })
                // }else{
                //     that.common.messageUtil({
                //         type:'error',
                //         message:res.msg
                //     })
                // }
                // })
            },
            getCashlessNames(event){
                if(!this.common.isNullString(event.target.value.trim())){
                    this.cashlessName = event.target.value.split(/[;|；]|[ | ]/);
                }else{
                    this.cashlessName = [];
                }
            },
            leftFn(e){
                if (e) {
                    this.$nextTick(() => {
                        this.totalAmountS = e.replace(/[^\d|.]/g,'')
                    })
                }
            },
            rightFn(e){
                if (e) {
                    this.$nextTick(() => {
                        this.totalAmountE = e.replace(/[^\d|.]/g,'')
                    })
                }
            },
            getDownloadList(param){
                var that = this;
                this.loadSign = true;
                this.listPageIndex = 1;
                ip.getDownloadListDr('?exportTypes=餐厅订单明细查询',function(res){
                    that.downloadList = res.data.list;
                })
            },
            loadMore () {
                let that = this;
                if (this.loadSign) {
                    this.loadingList = true;
                    this.listPageIndex++;
                    let param = this.common.joinSearchParam([{
                        value:this.listPageSize,
                        name:'pageSize'
                    },{
                        value:this.listPageIndex,
                        name:'pageIndex'
                    }])
                    ip.getDownloadListDr(param+'&exportTypes=餐厅订单明细查询',function (res) {
                        that.loadingList = false;
                        if (res.code ===404 ) {
                            that.loadSign = false;
                            return false;
                        }else{
                            that.loadSign = true;
                            that.downloadList = that.downloadList.concat(res.data.list);
                        }
                    })

                }
            },
            getFinalDateMinus(date1,date2){//date1:小日期   date2:大日期
                return parseInt((new Date(date2).getTime()- new Date(date1).getTime())/ (1000 * 60 * 60 * 24));;
            },
            judgeWhetherCondition(){
                //三个唯一的条件都没填
                return !!(this.common.isNullString(this.orderId) && this.common.isNullString(this.orderUniqueId) && this.common.isNullString(this.otherCode));
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../../assets/scss/center';
    .dayMargin{
        min-width: 50px;
        .el-date-editor--daterange.el-input__inner{
            width: 100%;
        }
    }
    .margin-top{
        margin-top:20px;
    }
    .num-width{
        max-width:100px;
    }
    .viewIcon{
        margin-bottom:15px;
    }
    .link{
        color:-webkit-link;
    }
    .link-disable{
        color:#bdbdbd;
        cursor:not-allowed
    }

</style>
