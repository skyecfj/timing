<template>
    <div class="couponSale">
        <div class="viewHeader">
            <el-row :gutter="24" class="offset">
                <el-col :span="4">
                    <div class="word">券码</div>
                </el-col>
                <el-col :span="4">
                    <div class="word">券活动组</div>
                </el-col>
                <el-col :span="4">
                    <div class="word">券名称</div>
                </el-col>
            </el-row>
            <el-row :gutter="24" class="offset">
                <el-col :span="4">
                    <el-input size="small"  placeholder="券码"  v-model.trim="couponCodeString" clearable @blur="getCoupons">
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-select size="small"  placeholder="券活动组"  v-model="activityGroup"  @change="selectGroup" filterable >
                        <el-option v-for="item in activityGroupSelect" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select size="small"  placeholder="券名称"  v-model="activity"  filterable>
                        <el-option v-for="item in activitySelect" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="24" class="offset">
                <el-col :span="4">
                    <div class="word">品牌</div>
                </el-col>
                <el-col :span="6">
                    <div class="word">激活时间</div>
                </el-col>
                <el-col :span="6" :offset="1">
                    <div class="word">退款时间</div>
                </el-col>
            </el-row>
            <el-row :gutter="24" class="offset">
                <el-col :span="4">
                    <el-select size="small"  placeholder="品牌"  v-model="brand" filterable >
                        <el-option value="">请选择</el-option>
                        <el-option v-for="item in brandSelect" :key="item.brandId" :value="item.brandEnglishName" :label="item.brandEnglishName"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6" >
                    <el-date-picker
                            type="daterange"
                            range-separator="-"
                            v-model="activatedTime"
                            value-format="yyyy-MM-dd"
                            size="small"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-col>
                <el-col :span="6" :offset="1">
                    <el-date-picker
                            v-model="backDate"
                            size="small"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions2"
                    >
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row >
                <el-col >
                    <el-button size="small"  @click="searchReport" class="c-button c-button--primary">查询</el-button>
                    <el-button size="small"  @click="reset" plain class="c-button" type="success">重置</el-button>
                    <el-button size="small"  class="c-button c-button--primary" @click="exportReport"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <el-table :data="reportForm" border>
                <el-table-column type="index" width="60px" label="序号">
                </el-table-column>
                <el-table-column prop="couponCode" show-overflow-tooltip label="券码" min-width="100px">
                </el-table-column>
                <el-table-column prop="activityId" show-overflow-tooltip label="券ID" width="100px">
                </el-table-column>
                <el-table-column prop="activity" label="券名称" min-width="120px">
                </el-table-column>
                <el-table-column prop="brandName" label="品牌" min-width="60px">
                </el-table-column>
                <el-table-column prop="activityGroup" label="券活动组" min-width="80px">
                </el-table-column>
                <el-table-column prop="activityGroupId" label="券活动组ID" min-width="120px">
                </el-table-column>
                <el-table-column prop="activatedTime" label="激活时间" class-name="status-col" min-width="120px">
                </el-table-column>
                <el-table-column prop="backDate" label="退款时间" min-width="120px">
                </el-table-column>
                <el-table-column prop="reusableCount" label="可用次数" min-width="100px">
                </el-table-column>
                <el-table-column prop="usedseqid" label="已使用次数" min-width="100px">
                </el-table-column>
                <el-table-column prop="useStatus" label="使用状态" min-width="100px">
                </el-table-column>
                <el-table-column prop="sales" label="券金额" min-width="100px">
                </el-table-column>
                <el-table-column prop="internalCouponPrice" label="内部结算价" min-width="100px">
                </el-table-column>
                <el-table-column prop="invoiceAmountA" label="顾客支付" min-width="100px">
                </el-table-column>
                <el-table-column prop="invoiceAmountB" label="第三方补贴" min-width="100px">
                </el-table-column>
                <el-table-column prop="operateDate" label="券码最后更新时间" min-width="100px">
                </el-table-column>
                <el-table-column prop="timeMark" label="券码上传时间" min-width="100px">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizesList"
                               :page-size="pageSize" class="gross" background layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../../model/api'
    export default {
        name: "couponSale",
        data(){
            return {
                couponCode:[],
                activity:'',
                activityGroup:'',
                activatedTime:[],
                backDate:[],
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords:0,
                endDispatchDate:'',
                startDispatchDate:'',
                localSearchParam:'',
                reportForm:[],
                activitySelect:[{value:'',label:'请选择'}],
                activityGroupSelect:[{value:null,label:'请选择'}],
                couponCodeString:'',
                brand:'',
                brandSelect:[],
                maxDate:'',
                minDate:'',
                pickerOptions:{
                    onPick:(dateRange)=>{
                        this.minDate =  new Date(dateRange.minDate).getTime();
                        this.maxDate =  new Date(dateRange.maxDate).getTime();
                    },
                },
                backMinDate:'',
                backMaxDate:'',
                pickerOptions2:{
                    onPick:(dateRange)=>{
                        this.backMinDate =  new Date(dateRange.minDate).getTime();
                        this.backMaxDate =  new Date(dateRange.maxDate).getTime();
                    },
                },
                groupAndCoupon:{},
                downloadObject:{}
            }
        },
        watch:{
            minDate(val,oldVal){
                this.pickerOptions = Object.assign({},{
                    onPick:(dateRange)=>{
                        this.minDate =  new Date(dateRange.minDate).getTime();
                        this.maxDate =  new Date(dateRange.maxDate).getTime();
                    },
                    disabledDate: (time) => {
                        if(this.common.isNullString(this.couponCodeString) && this.minDate){
                            return time.getTime() <= this.minDate-31*24*60*60*1000 || time.getTime() >= this.minDate + 31*24*60*60*1000;
                        }else{
                            return false;
                        }

                    }
                });
            },
            backMinDate(val,oldVal){
                this.pickerOptions2 = Object.assign({},{
                    onPick:(dateRange)=>{
                        this.backMinDate =  new Date(dateRange.minDate).getTime();
                        this.backMaxDate =  new Date(dateRange.maxDate).getTime();
                    },
                    disabledDate: (time) => {
                        if(this.common.isNullString(this.couponCodeString) && this.backMinDate){
                            return time.getTime() <= this.backMinDate-31*24*60*60*1000 || time.getTime() >= this.backMinDate + 31*24*60*60*1000;
                        }else{
                            return false;
                        }

                    }
                });
            },
            activatedTime(val,oldVal){
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
            },
            backDate(val,oldVal){
                if(!val || (val &&val.length === 0)){
                    this.pickerOptions = Object.assign({},{
                        onPick:(dateRange)=>{
                            this.backMinDate =  new Date(dateRange.minDate).getTime();
                            this.backMaxDate =  new Date(dateRange.maxDate).getTime();
                        },
                        disabledDate: (time) => {
                            return false;
                        }
                    });
                    this.backMinDate = '';
                }
            }
        },
        methods:{
            handleSizeChange(size){
                this.pageSize = size;
                this.searchReport();
            },
            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.searchReport();
            },
            searchReport(){
                let that = this;
                if(this.common.isNullString(this.couponCodeString) && _.isEmpty(this.activatedTime) &&  _.isEmpty(this.backDate))
                {
                    this.common.warningMessage('请选择激活时间或者退款时间');
                    return
                }
                api.getCouponReportList(this.searchParam(),function (res) {
                    that.reportForm = res.data?res.data.list:[];
                    that.totalRecords = res.data?res.data.totalRecords:0;
                    if(res.code !== 200){
                        that.message({
                            type:'error',
                            message:res.msg
                        })
                    }
                })
            },
            searchParam(){
                this.pageIndex = 1;let that  = this;
                let searchParam = this.common.joinSearchParam([
                    {name:'activity',value:this.activity},
                    {name:'brandName',value:this.brand},
                    {name:'activityGroup',value:this.activityGroup},
                    {name:'startActivatedTime',value:this.activatedTime?this.activatedTime[0]:''},
                    {name:'endActivatedTime',value:this.activatedTime?this.activatedTime[1]:''},
                    {name:'startBackDate',value:this.backDate?this.backDate[0]:''},
                    {name:'endBackDate',value:this.backDate?this.backDate[1]:''},
                    {name:'pageSize',value:this.pageSize},
                    {name:'pageIndex',value:this.currentPage},

                ]);
                this.downloadObject = {
                    activity:this.activity,
                    brandName:this.brand,
                    activityGroup:this.activityGroup,
                    startActivatedTime:this.activatedTime?this.activatedTime[0]:'',
                    endActivatedTime:this.activatedTime?this.activatedTime[1]:'',
                    startBackDate:this.backDate?this.backDate[0]:'',
                    endBackDate:this.backDate?this.backDate[1]:'',
                    couponCodes:this.couponCode,
                    pageSize:this.pageSize,
                    pageIndex:this.currentPage
                };
                // {name:'couponCode',value:this.couponCode},
                let param = '';
                this.couponCode = this.couponCode.filter(x=>{return !!x});
                if(this.couponCode && this.couponCode.length>0){
                    this.couponCode.forEach(function (item,index) {
                        if(index !== (that.couponCode.length-1)){
                            param += 'couponCodes='+item+'&'
                        }else {
                            param += 'couponCodes='+item
                        }
                    });
                }
                if(!searchParam){
                    searchParam +=  '?'+param
                }else{
                    searchParam +=  '&'+param
                }
                this.localSearchParam = searchParam;
                return searchParam;
            },
            reset(){
                this.couponCode = [];
                this.activity='';
                this.activityGroup='';
                this.activatedTime='';
                this.backDate='';
                this.couponCodeString = '';
                this.brand = '';
                this.localSearchParam = '';
                this.activitySelect = [];
            },
            getActivityGroup(){
                var that = this;
                api.getActivityGroupFromCoupon(function(res){
                    if(res.code === 404){
                        that.common.messageUtil({
                            type:'warning',
                            message:res.msg

                        })
                    }else if(res.code !== 404 && res.code !== 200){
                        that.common.messageUtil({
                            type:'error',
                            message:res.msg
                        })
                    }
                    res.data.forEach(item => {
                        that.activityGroupSelect.push({
                            value:item,
                            label:item
                        })
                    })
                })
            },
            selectGroup(val){
                var that = this;
                that.activity = '';
                this.activitySelect = [];
                if(val){
                    Object.keys(this.groupAndCoupon).forEach(function (item,index) {
                        if(item === val){
                            that.groupAndCoupon[item].forEach(item => {
                                that.activitySelect.push({
                                    value:item,
                                    label:item
                                })
                            })
                        }
                    })
                }
            },
            exportReport(){
                this.searchParam();
                let that = this;
                api.downloadCouponReport(this.downloadObject,'application/vnd.ms-excel',function(res){
                    if(res && res.code){
                        that.common.errorMessage(res.msg)
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = '券码售卖信息.xlsx';
                        link.target = '_blank';link.click();
                    }
                })
            },
            getCoupons(event){
                if(!this.common.isNullString(event.target.value.trim())){
                    this.couponCode = event.target.value.split(/[;|；]|[ | ]/);
                }else{
                    this.couponCode = [];
                }
            },
            getBrandList(){
                var that = this;
                let searchParam = this.common.formatPathParam({
                    pageIndex : 1,
                    pageSize  : 99999999,
                    flag:2
                });
                api.getBrandList(searchParam,function(res){
                     if(res.code !== 404 && res.code !== 200){
                        that.common.messageUtil({
                            type:'error',
                            message:res.msg
                        })
                    }
                    if(res.data && res.data.list.length>0){
                        that.brandSelect = res.data.list;
                    }
                })
            }
        },
        beforeMount(){
            var that = this;
            api.getActivityGroupAndCoupons(function(res){
                if(res.code !== 404 && res.code !== 200){
                    that.common.messageUtil({
                        type:'error',
                        message:res.message
                    })
                }
                if(res.code === 200 && res.data ){
                    that.groupAndCoupon = res.data
                }
            });
            this.getBrandList();
        },
        mounted(){
            this.getActivityGroup();
            this.getBrandList();
        }

    }
</script>

<style scoped lang="scss">
    @import "../../../assets/scss/reportForm";
    .viewHeader .el-date-editor--daterange.el-input__inner {
        width:auto;
    }
    .word{
        font-size:13px;
        /*margin-bottom: 10px;*/
    }
    .el-row.offset {
        margin-bottom: 10px;
    }
    .minWidth {
        min-width: 100px;
    }
    .el-date-editor .el-range__icon {
        line-height: 25px;
    }
</style>
