<!-- BOH数据未上传及异常管理-->
<template>
    <div class="boh-abnormal">
        <div class="search-content" >
            <div class="selectContent">
                <div class="selectTitle">营业日期</div>
                <el-date-picker
                        type="daterange"
                        v-model="bookDate"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        size="small"
                >
                </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">营运市场</div>
                <el-select size="small" v-model="operateMarket" placeholder="请选择营运市场" filterable >
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in resOprMarketOptions" :key="item.marketNumber" :label="item.name" :value="item.marketNumber">
                    </el-option>
                </el-select>
            </div>
            <!-- <div class="selectContent">
                <div class="selectTitle">财务市场</div>
                <el-select size="small" v-model="financialMarket" placeholder="请选择财务市场" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in resFinMarketOptions" :key="item.marketCode" :label="item.marketName" :value="item.marketCode">
                    </el-option>
                </el-select>
            </div> -->
            <div class="selectContent">
                <div class="selectTitle">餐厅编号</div>
                <!--<el-input v-model="storeCode" clearable size="small"></el-input>-->
                <el-select size="small" v-model="storeCode" placeholder="请选择" remote :remote-method="remoteStoreHypId"
                           :loading="loadingStoreHypId" filterable v-scroll="bindScroll" @visible-change="visibleChange"
                           @keyup.native="focusFn">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in storeHypIdOpt" :key="item.storeHypId" :label="item.storeHypId"
                               :value="item.storeHypId"></el-option>
                </el-select>
            </div>
            <div class="selectContent" v-show="index1">
                <div class="selectTitle">未上传原因</div>
                <el-select size="small"  v-model="reasonForNotUpload" placeholder="全部">
                    <el-option v-for="item in NotUploadSelect" :key="item" :label="item" :value="item === '请选择'?'':item">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-show="index2">
                <div class="selectTitle">BOH异常分类</div>
                <el-select size="small"  v-model="bohAbnormal" placeholder="全部">
                    <el-option v-for="item in bohAbnormalSelect" :key="item" :label="item" :value="item === '请选择'?'':item">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-show="index3">
                <div class="selectTitle">原因</div>
                <el-select size="small"  v-model="wrongOperationS" placeholder="全部">
                    <el-option v-for="item in wrongOperationSelect" :key="item" :label="item" :value="item === '请选择'?'':item">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-show="index1||index2">
                <el-checkbox v-model="waitSupplementAuditRadio" :true-label="1">补录待审核</el-checkbox>
            </div>
            <div class="selectContent" v-show="index1">
                <el-checkbox v-model="waitReasonAuditRadio" :true-label="1">原因待审核</el-checkbox>
            </div>
            <el-button size="small"  type="success" class="findButt" @click="getData(1)">查询</el-button>
            <!--<el-button size="small"  type="success" plain class="reSet" @click="reset">下载</el-button>-->
            <el-button size="small"  type="success" plain class="reSet" @click="getCasha" v-show="btnImport">批量获取</el-button>
            <el-button size="small"  type="success" plain class="reSet" @click="batchSendEmail1" v-show="index1">批量发送邮件</el-button>
            <el-button size="small"  type="success" plain class="reSet" @click="batchExportReason" v-show="index1">批量导出退回原因</el-button>
            <!--<el-button size="small"  type="success" plain class="reSet" @click="batchSendEmail2" v-show="index2">批量发送邮件</el-button>-->
            <el-button size="small"  type="success" plain class="reSet" @click="checkData" v-show="index3">同步主档</el-button>
            <el-button size="small"  type="success" plain class="reSet" @click="exportData">下载</el-button>
            <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>

        </div>
        <div class="content" >
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="未上传" name="not-upload">
                    <notUploadTable  :dynamicData="dynamicData" :totalRecords="totalRecords" v-on:pageSize="changePageSize($event)"
                                     v-on:currentPage="changeCurrentPage($event)"
                                    v-on:refreshList="search1($event)"
                                     v-on:multipleDataSelected="getMultiple($event)"
                                     :pageIndex="pageIndex1"
                    ></notUploadTable>
                </el-tab-pane>
                <el-tab-pane label="BOH数据异常" name="boh-abnormal">
                    <BOHAbnormalTable :dynamicData="dynamicData2" :totalRecords="totalRecords2" v-on:pageSize="changePageSize($event)"
                                      v-on:currentPage="changeCurrentPage($event)"
                                      v-on:refreshList="search2($event)"
                                      :pageIndex="pageIndex2"
                    ></BOHAbnormalTable>
                                      <!--v-on:multipleDataSelected="getMultiple2($event)"-->
                </el-tab-pane>
                <el-tab-pane label="不应导入但导入" name="wrong-operation">
                    <wrongOperation :dynamicData="dynamicData3" :totalRecords="totalRecords3" v-on:pageSize="changePageSize($event)"
                                    v-on:currentPage="changeCurrentPage($event)"
                                    v-on:refreshList="search3($event)"
                                    :pageIndex="pageIndex3"
                    ></wrongOperation>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import BOHAbnormalTable from './3TypesTables/BOHAbnormalTable'
    import notUploadTable from './3TypesTables/notUploadTable'
    import wrongOperation from './3TypesTables/wrongOperation'
    import api from '../../../../model/apidr'
    import ip from '../../../../model/api'
    import scroll from '@/directives/index'
    export default {
        name: "abnormalMg",
        components:{
            BOHAbnormalTable,
            notUploadTable,
            wrongOperation
        },
        directives: {scroll},
        data(){
            return {
                activeName:'not-upload',
                btnImport:true,
                reasonForNotUpload:'',
                wrongOperationS:'',
                bohAbnormal:'',
                index1:true,
                index2:false,
                index3:false,
                NotUploadSelect:[
                    '请选择',
                    '临时停业',
                    '系统故障',
                    // '主档未更新',
                    '主档未更新-已关店',
                    'BOH数据有，FSC无',
                    '主档未更新-未开店',
                    '手工删除',
                    '主档未更新-IE期间停业&problem store停业',
                    '已关店',
                    '未开店',
                    'IE期间停业&problem store停业',

                ],
                bohAbnormalSelect:[
                    '请选择',
                    '含税收入项为0/负数' ,
                    '含税收入过高' ,
                    '含税收入过低' ,
                    'BOH数据不平'
                ],
                wrongOperationSelect:[
                    '请选择',
                    '已关店',
                    '未开店',
                    'IE期间停业&problem store停业'
                ],
                btnIndex:0,
                totalRecords:0,
                totalRecords2:0,
                totalRecords3:0,
                pageSize:25,
                currentPage:1,
                pageIndex1:1,
                pageIndex2:1,
                pageIndex3:1,
                bookDate:[],
                storeCode:'',
                operateMarket:'',
                // financialMarket:'',
                dynamicData:[],
                dynamicData2:[],
                dynamicData3:[],
                selectedIds:[],
                searchReason:'',
                waitSupplementAuditRadio:null,
                waitReasonAuditRadio:null,
                selectedIdsSend1:[],
                // selectedIdsSend2:[],
                storeHypIdOpt:[],
                scrollFlag:true,
                loadingStoreHypId:false,
                listPageIndex: 1,
                selectObj: {},
                temString: '',
                resOprMarketOptions: [],
                // resFinMarketOptions: [],
                remoteFlag:true
            }
        },
        methods:{
            getBusinessMarket () {
                let that = this
                ip.getOperateMarketIdNames('&judgePermission=true',res => {that.resOprMarketOptions = res.data});
                // api.getBusinessMarket(function(res){
                //     if (res.code === 200) {
                //         that.resOprMarketOptions = res.data
                //     } else if (res.code != 404) {
                //         that.showTips(res.msg,'warning')
                //     }
                // })
            },
            // getFinanceMarket () {
            //     let that = this
            //     api.getFinanceMarket(function(res){
            //         if (res.code === 200) {
            //             that.resFinMarketOptions = res.data
            //         } else if (res.code != 404) {
            //             that.showTips(res.msg,'warning')
            //         }
            //     })
            // },
            handleClick(tab, event){
                this.bookDate = [];
                this.storeCode = '';
                this.reasonForNotUpload = '';
                this.wrongOperation = '';
                this.bohAbnormal = '';
                if(tab.index === "0"){
                    this.btnImport = true;
                    this.index1 = true;
                    this.index2 = false;
                    this.index3 = false;
                    this.btnIndex = 0;
                    this.search1(1);
                    this.waitSupplementAuditRadio = null;
                    this.waitReasonAuditRadio = null;
                }else  if(tab.index === "1"){
                    this.btnImport = false;
                    this.index1 = false;
                    this.index2 = true;
                    this.index3 = false;
                    this.btnIndex = 1;
                    this.search2(1);
                }else  if(tab.index === "2"){
                    this.btnImport = false;
                    this.index1 = false;
                    this.index2 = false;
                    this.index3 = true;
                    this.btnIndex = 2;
                    this.search3(1);
                    // this.search2();
                }
            },
            getData(){
                switch(this.btnIndex){
                    case 0:this.search1(1);return;
                    case 1:this.search2(1);return;
                    case 2:this.search3(1);return;
                    default:return;
                }
            },
            getParam(param){
                let searchItem;
                //若时间为空啧默认查询最近31天的数据
                let defaultStartTime = this.common.formatDate(new Date(new Date().getTime() - 30*24*60*60*1000),'yyyy-MM-dd');
                let defaultEndTime = this.common.formatDate(new Date(),'yyyy-MM-dd');
                if(this.index1){
                    this.searchReason = this.reasonForNotUpload;
                    searchItem = 'nodataResult';
                    if(param === 1){
                        this.pageIndex1 = this.currentPage = 1;
                    }
                }
                if(this.index2){
                    this.searchReason = this.bohAbnormal;
                    searchItem = 'excpCode';
                    if(param === 1){
                        this.pageIndex2 = this.currentPage = 1;
                    }
                }
                if(this.index3){
                    this.searchReason = this.wrongOperationS;
                    searchItem = 'nodataResult';
                    if(param === 1){
                        this.pageIndex3 = this.currentPage = 1;
                    }
                }
                return  this.common.joinSearchParam([
                    {
                        value:this.pageSize,
                        name:'pageSize'
                    },
                    {
                        value:this.currentPage ,
                        name:'pageIndex'
                    },
                    {
                        value:this.bookDate && this.bookDate.length ?this.bookDate[1]:defaultEndTime,
                        name:'bizDateEnd'
                    },
                    {
                        value:this.bookDate && this.bookDate.length?this.bookDate[0]:defaultStartTime,
                        name:'bizDateBegin'
                    },
                    {
                        value:this.storeCode,
                        name:'storeCode'
                    },
                    {
                        value:this.financialMarket,
                        name:'financialMarket'
                    },
                    {
                        value:this.operateMarket,
                        name:'operateMarket'
                    },
                    {
                        value:this.searchReason,
                        name:searchItem
                    },
                    {
                        value:this.waitSupplementAuditRadio?true:null,
                        name:'waitSupplementAudit'
                    },
                    {
                        value:this.waitReasonAuditRadio?true:null,
                        name:'waitReasonAudit'
                    }
                ])
            },
            search1(param){
                let that = this;
                if(this.waitSupplementAuditRadio && this.waitReasonAuditRadio){
                    this.common.messageUtil(
                        {
                            type:'warning',
                            message:'请只勾选一个待审批条件！'
                        }
                    );
                    return false;
                }
                api.notUploadList(this.getParam(param),function(res){
                    if(res.code === 200){
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }else if(res.code === 404){
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }else{
                        that.totalRecords = 0;
                    }
                })
            },
            search3(param){
                let that = this;
                api.shouldNotButDoList(this.getParam(param),function(res){
                    if(res.code === 200){
                        that.dynamicData3 = res.data.list;
                        that.totalRecords3 = res.data.totalRecords;
                    }else if(res.code === 404){
                        that.dynamicData3 = [];
                        that.totalRecords3 = 0;
                    }
                })
            },
            search2(param){
                let that = this;
                api.bohExceptionList(this.getParam(param),function(res){
                    if(res.code === 200){
                        that.dynamicData2 = res.data.list;
                        that.totalRecords2 = res.data.totalRecords;
                    }else if(res.code === 404){
                        that.dynamicData2 = [];
                        that.totalRecords2 = 0;
                    }
                })
            },
            changePageSize(res){
                this.pageSize = res;
                if(this.index1){
                    this.search1();
                }else  if(this.index2){
                    this.search2();
                }else if(this.index3){
                    this.search3();
                }
            },
            changeCurrentPage(res){
                this.currentPage = res;
                if(this.index1){
                    this.pageIndex1 = res;
                    this.search1();
                }else if(this.index2){
                    this.pageIndex2 = res;
                    this.search2();
                }else if(this.index3){
                    this.pageIndex3 = res;
                    this.search3();
                }
            },
            reset(){
                this.bookDate = [];
                this.storeCode = '';
                this.reasonForNotUpload = '';
                this.waitSupplementAuditRadio = null;
                this.waitReasonAuditRadio = null;
                this.operateMarket = null;
                this.financialMarket = null;
                this.bohAbnormal = '';
                this.wrongOperationS = '';
            },
            getCasha(){
                let that = this;
                let ids = '';
               if( this.selectedIds &&  this.selectedIds.length>0){
                   this.selectedIds.forEach(function (item,index) {
                       if(index === 0){
                           ids +='?ids='+item.id;
                       }else{
                           ids +='&ids='+item.id;
                       }
                   })
               }else{
                   this.common.messageUtil({
                       type:'warning',
                       message:'请勾选数据后再进行操作！'
                   });
                   return;
               }
               this.$confirm('是否提交批量获取?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.getCashaRegetById(ids,function(){
                        that.search1();
                    })
                }).catch(() => {});

            },
            getMultiple(res){
                this.selectedIds = res;
                this.selectedIdsSend1 = res.map(x=>{return x.id})
            },
            // getMultiple2(res){
            //     this.selectedIdsSend2 = res.map(x=>{return x.id})
            // },
            batchSendEmail1(){
                let that = this;
                if(!this.selectedIdsSend1 ||this.selectedIdsSend1.length === 0){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请勾选数据后进行操作！'
                    })
                    return;
                }
                this.$confirm('确认批量发送邮件吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.batchSendEmail({ids:that.selectedIdsSend1},function(res){
                        that.search1();
                    })
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消发送'
                    });
                });

            },
            // batchSendEmail2(){
            //     let that = this;
            //     if(!this.selectedIdsSend2 ||this.selectedIdsSend2.length === 0){
            //         this.common.messageUtil({
            //             type:'warning',
            //             message:'请勾选数据后进行操作！'
            //         })
            //         return;
            //     }
            //     this.$confirm('确认批量发送邮件吗?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         api.bohUploadLow({ids:that.selectedIdsSend2},function(res){
            //             that.search2();
            //         })
            //     }).catch(() => {
            //         this.common.messageUtil({
            //             type: 'info',
            //             message: '已取消发送'
            //         });
            //     });
            //
            // },
            exportData(){
                let that = this;
                if(this.index1){
                    api.downloadNotUpload({
                        "bizDateBegin": this.bookDate?this.bookDate[0]:'',
                        "bizDateEnd": this.bookDate?this.bookDate[1]:'',
                        "operateMarket":this.operateMarket? this.operateMarket : null,
                        "financialMarket":this.financialMarket? this.financialMarket : null,
                        "nodataResult": this.reasonForNotUpload,
                        "storeCode": this.storeCode,
                        "waitReasonAudit": this.waitSupplementAuditRadio === 1,
                        "waitSupplementAudit": this.waitReasonAuditRadio === 1
                    },'application/vnd.ms-excel',function(res){
                        that.common.exportTemplate('BOH未上传.xls' ,res)
                    })
                }else if(this.index2){
                    api.downloadException({
                        "bizDateBegin": this.bookDate?this.bookDate[0]:'',
                        "bizDateEnd": this.bookDate?this.bookDate[1]:'',
                        "operateMarket":this.operateMarket? this.operateMarket : null,
                        "financialMarket":this.financialMarket? this.financialMarket : null,
                        "excpCode": this.bohAbnormal,
                        "storeCode": this.storeCode,
                    },'application/vnd.ms-excel',function(res){
                        that.common.exportTemplate('BOH数据异常.xls' ,res)
                    })
                }else if(this.index3){
                    api.downloadShouldButNot({
                        "bizDateBegin": this.bookDate?this.bookDate[0]:'',
                        "bizDateEnd": this.bookDate?this.bookDate[1]:'',
                        "operateMarket":this.operateMarket? this.operateMarket : null,
                        "financialMarket":this.financialMarket? this.financialMarket : null,
                        "nodataResult": this.wrongOperationS,
                        "storeCode": this.storeCode,
                    },'application/vnd.ms-excel',function(res){
                        that.common.exportTemplate('BOH不应导入但导入.xls' ,res)
                    })
                }
            },
            bindScroll(param, object) {
                if (param && this.remoteFlag) {
                    var that = this;
                    this.remoteFlag = false;
                    this.selectObj = object;
                    if (this.scrollFlag) {
                        this.listPageIndex++;
                        ip.getSelectSearchCondition({
                            storeHypId: this.temString,
                            pageSize: 20,
                            pageIndex: this.listPageIndex,
                            judgePermission: true
                        }, function (res) {
                            that.remoteFlag = true;
                            if (res.code === 200) {
                                that.storeHypIdOpt = that.storeHypIdOpt.concat(res.data);
                            } else if (res.code === 404) {
                                that.scrollFlag = false;
                            }
                        })
                    }
                }
            },
            remoteStoreHypId(val) {
                let that = this;
                // this.storeCode = val;
                this.temString = val;
                this.listPageIndex = 1;
                if (JSON.stringify(this.selectObj) !== '{}') {
                    this.selectObj.scrollTop = 0;
                }
                ip.getSelectSearchCondition({
                    storeHypId: this.temString,
                    pageIndex: this.listPageIndex,
                    pageSize: 20,
                    judgePermission: true
                }, function (res) {
                    that.storeHypIdOpt = res.data
                })
            },
            visibleChange(param) {
                if (!param && !this.storeCode) {
                    this.remoteStoreHypId();
                    this.temString = '';
                } else {
                    this.remoteStoreHypId(this.storeCode);
                }
            },
            focusFn(param) {
                if (!param.target.value) {
                    this.temString = '';
                    this.remoteStoreHypId();
                }
            },
            batchExportReason(){
                let that = this;
                if(!this.bookDate || this.bookDate.length === 0){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择营业日期后再导出！'
                    })
                    return;
                }
                api.downloadRejectReason(this.common.joinSearchParam([{
                    value:this.bookDate?this.bookDate[0]:'',
                    name:'beginDate'
                },{
                    value:this.bookDate?this.bookDate[1]:'',
                    name:'endDate'
                }
                ]),'application/vnd.ms-excel',function(res){
                    that.common.exportTemplate('BOH未上传退回原因.xls' ,res)
                })
            },
            checkData(){
                let that = this;
                if(!this.bookDate || this.bookDate.length === 0){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择营业日期'
                    })
                    return;
                }
                api.checkDataAndUpdate(this.common.joinSearchParam([
                    {
                        name:'bizDateBegin',
                        value:this.bookDate?this.bookDate[0]:null
                    },
                    {
                        name:'bizDateEnd',
                        value:this.bookDate?this.bookDate[1]:null
                    },
                    {
                        name:'pageSize',
                        value:10
                    },
                    {
                        name:'pageIndex',
                        value:1
                    }
                ]),res=>{
                    if(res.code === 200){
                        that.search3(1);
                    }
                })
            }
        },
        // mounted(){
        //     this.remoteStoreHypId();
        //     this.search1();
        // },
        beforeMount(){
            this.remoteStoreHypId();
            this.search1();
            this.getBusinessMarket();
            //this.getFinanceMarket();
        },
        activated(){
            if(this.$route.meta.isBack){
               if(this.index1){
                   this.search1();
               }else  if(this.index2){
                   this.search2();
               }else  if(this.index3){
                   this.search3();
               }
            }
            this.$route.meta.isBack = false;
        }

    }
</script>

<style scoped>

</style>
