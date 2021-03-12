<template>
    <div class="mainContent">
        <div class="cbBContentTitle" v-if="!isStore">
            <div class="cbBContentRight">
                <el-button size="small"   @click="deleteDetail" class="c-button c-button--plain--danger" v-if="canVoucherDelete && $route.query.source != 'groupVoucher'">删除</el-button>
                <el-button size="small" @click="exportVoucher" class="c-button c-button--primary">下载</el-button>
                <el-button v-if="voucherInfo.filePath" type="text" @click="downloadAttachmentFile('BBC')"><i
                        class="el-icon-download"></i>下载附件
                </el-button>
                <!--<el-button size="small"   class="c-button c-button--plain" v-else>财务反转</el-button>-->
                <!--<el-button size="small"   @click="edit" class="c-button c-button--primary">编辑</el-button>-->
            </div>
        </div>
        <div class="cbBContentTitle" v-if="isStore">
            <div class="cbBContentRight">
                <el-button size="small" @click="exportVoucherStore" class="c-button c-button--primary">下载</el-button>
                <el-button v-if="voucherInfo.filePath" type="text" @click="downloadAttachmentFile('STORE')"><i
                        class="el-icon-download"></i>下载附件
                </el-button>
            </div>
        </div>
        <div class="bdSection" >
        <template v-for="(value,key,i) in voucherHeaderInfo" >
            <el-row v-if="i%3 == 0" v-bind:key="key+'_'+i" >
                <template v-for="(value,key,f) in voucherHeaderInfo" >
                <el-col v-if="Math.floor(i/3) * 3 <= f && f < (Math.floor(i/3) + 1) * 3" :span="8" :key="key" class="titleContent">
                    <div class="textLeft">
                        <div class="bdSectionTitle">{{value}}</div>
                        <div class="bdSectionContent">{{getName(key)}}</div>
                    </div>
                </el-col>
                </template>
            </el-row>
        </template>
        </div>
        <div class="dataContent">
            <el-table :data="scrollData" style="width: 100%" border max-height="380" v-scrollTable="bindScrollTable" v-loading="scrollLoading">
                <el-table-column :prop="key" :label="value" v-for="(value,key) in tableHeaderInfo" :key="key"
                                 >
                    <template slot-scope="scope">
                        <span v-if="key == 'subjectNumName' && !isStore">{{scope.row.bu}}.{{scope.row.subjectNum}}</span>
                        <el-tooltip class="item" effect="dark" :content="scope.row[key]" placement="right" v-if="scope.row[key] && scope.row[key].length>12">
                            <span>{{scope.row[key]}}</span>
                        </el-tooltip>
                        <span v-else>{{scope.row[key]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import api from '../../model/api'
    import apiStore from '../../model/apidr'
    import ip from '../../model/tempIp'
    import voucherDetailUtil from '../../utils/voucherDetailUtil'
    import scrollTable from '@/directives/scrollTableIndex'

    export default {
        name: 'voucherDetail',
        directives: {scrollTable},
        data () {
            return {
                voucherInfo: {},
                jdeStatus: false,
                canVoucherDelete : false,
                exportUrl: '',
                isShowReason: false,
                isStore: false,
                tableHeaderInfo: {},
                voucherHeaderInfo: {},
                scrollData:[],
                pageIndex:1,
                scrollLength:0,
                scrollFlag:true,
                scrollLoading:false,
                remoteFlag:true,
                totalPageIndex:0,
                flag:true
            }
        },
        beforeMount () {
            this.jdeStatus = this.$route.query.jdeStatus
            this.canVoucherDelete = this.$route.query.canVoucherDelete
            this.getVoucherDetail(this.$route.query.voucherId)
        },
        beforeRouteLeave (to, from, next) {
            to.meta.isBack = (to.name === 'billManage' || to.name === 'voucherManage');
            next();
        },
        methods: {
            getName (key) {
                return this.voucherInfo[key]
            },
            exportVoucher () {
                var that = this
                api.exportVoucher(this.$route.query.voucherId, 'application/vnd.ms-excel', function (res) {
                    if (res.code) {
                        that.common.warningMessage(res.msg)
                    } else {
                        let link = document.createElement('a');
                        link.href = res;
                        link.id = 'attachmentLink';
                        link.download = that.voucherInfo.voucherInstruction+'.xlsx';
                        link.target = '_blank';
                        link.click();
                    }
                })
            },
            exportVoucherStore () {
                var that = this
                api.exportVoucherStore(this.$route.query.voucherId, 'application/vnd.ms-excel', function (res) {
                    if (res.code) {
                        that.common.warningMessage(res.msg)
                    } else {
                        let link = document.createElement('a');
                        link.href = res;
                        link.id = 'attachmentLink';
                        link.download = that.voucherInfo.voucherInstruction+'.xlsx';
                        link.target = '_blank';
                        link.click();
                    }
                })
            },
            getVoucherDetail (voucherId) {
                var that = this
                api.getVoucherDetail(voucherId, function (res) {
                    if (res.code == 200) {
                        that.voucherInfo = res.data;
                        // that.voucherInfo.voucherSubjectDetailDtoList = that.voucherInfo.voucherSubjectDetailDtoList.slice(0,32);
                        // that.voucherInfo.voucherSubjectDetailDtoList.forEach((item,index)=>{
                        //     item.id = index;
                        // });
                        if(that.voucherInfo.voucherSubjectDetailDtoList && that.voucherInfo.voucherSubjectDetailDtoList.length <=30){
                            that.flag = false
                        }
                        that.scrollData =  that.voucherInfo.voucherSubjectDetailDtoList.slice(0,30);
                        that.scrollLength = that.voucherInfo.voucherSubjectDetailDtoList.length;
                        that.totalPageIndex = Math.ceil(that.scrollLength/10);
                        that.voucherInfo.businessType = that.common.isNullString(that.voucherInfo.businessType) ? '-' : that.voucherInfo.businessType
                        that.voucherInfo.voucherInstruction = that.common.isNullString(that.voucherInfo.voucherInstruction) ? '-' : that.voucherInfo.voucherInstruction
                        that.voucherInfo.accountMode = that.common.isNullString(that.voucherInfo.accountMode) ? '-' : that.voucherInfo.accountMode
                        that.voucherInfo.jdeAccountModule = that.common.isNullString(that.voucherInfo.jdeAccountModule) ? '-' : that.voucherInfo.jdeAccountModule
                        that.voucherInfo.jdeInvoiceType = that.common.isNullString(that.voucherInfo.jdeInvoiceType) ? '-' : that.voucherInfo.jdeInvoiceType
                        that.voucherInfo.voucherDate = that.common.isNullString(that.voucherInfo.voucherDate) ? '-' : that.voucherInfo.voucherDate
                        that.voucherInfo.jdeInvoiceNumber = that.common.isNullString(that.voucherInfo.jdeInvoiceNumber) ? '-' : that.voucherInfo.jdeInvoiceNumber
                        that.voucherInfo.jdeBatchNo = that.common.isNullString(that.voucherInfo.jdeBatchNo) ? '-' : that.voucherInfo.jdeBatchNo
                        that.isStore = that.voucherInfo.businessType == 'STORE' ? true : false
                        that.voucherHeaderInfo = voucherDetailUtil.getTitleHeaderConfigData(that.voucherInfo.businessType, that.$route.query.voucherCode)
                        that.tableHeaderInfo = voucherDetailUtil.getTableHeaderData(that.voucherInfo.businessType, that.$route.query.voucherCode)
                    } else {
                        that.common.messageUtil({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                })
            },
            //下载附件
            downloadAttachmentFile (attachmentType) {
                let _self = this;
                let param = this.common.formatPathParam({
                    url: this.voucherInfo.filePath
                })
                if (attachmentType == 'BBC') {
                    api.downLoadBBCManualAccountingAttach(param, 'application/vnd.ms-excel', function (res) {
                        if (res.code) {
                            _self.common.warningMessage(res.msg)
                        } else {
                            let fileName = _self.voucherInfo.filePath.split('/')[_self.voucherInfo.filePath.split('/').length - 1];
                            let link = document.createElement('a');
                            link.href = res;
                            link.download = fileName;
                            link.target = '_blank';
                            link.click();
                        }
                    })
                } else if (attachmentType == 'STORE') {
                    let fileName = this.voucherInfo.filePath.split('/')[_self.voucherInfo.filePath.split('/').length - 1];
                    apiStore.downLoadStoreManualAccountingAttach(param, function (res) {
                        if (res.code === 200) {
                            let link = document.createElement('a');
                            link.href = res.data;
                            link.download = fileName;
                            link.target = '_blank';
                            link.click();
                        } else {
                            _self.common.errorMessage(res.msg)
                        }
                    })
                }

            },
            deleteDetail () {
                var that = this
                this.$confirm('确定删除此条明细?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteVoucher(that.$route.query.voucherCode, that.$route.query.voucherId, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.common.deleteTag(that.$route, that)
                        } else {
                            that.common.messageUtil({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                    })
                }).catch(() => {
                    that.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            bindScrollTable (param, object,type) {  //始终保证只有三屏的数据
                let that = this;
                // let setTimeOut={},setTimeOut2={};
                let scrollTopFlag = false;
                // let flag = false;
                if (((param && this.scrollFlag && that.remoteFlag)||type ) && this.flag) {
                    this.scrollLoading = true;
                    that.remoteFlag = false;
                    if(type){
                        that.pageIndex--;
                    }else{
                        that.pageIndex++;
                    }
                    if(type){  //向上滑动
                        if(that.pageIndex-3 >= 0 ){
                            let num = that.pageIndex-3;
                            that.scrollData = that.voucherInfo.voucherSubjectDetailDtoList.slice(num*10,num*10+10).concat(that.scrollData);//加上三屏以前的数据
                            that.scrollData =  that.scrollData.slice(0, that.scrollData.length-10);//减去三屏以后的数据
                            if(JSON.stringify(object) !== '{}'){
                                if(that.scrollData.length >= 30){
                                    object.scrollTop = object.scrollTop +360; //减去10行数据的高度
                                }else{
                                    object.scrollTop = object.scrollTop + (30 - that.scrollData.length) * 36; //减去10行数据的高度 不足 30，减去实际多出来的高度
                                }
                            }
                            that.scrollLoading = false;
                            that.remoteFlag = true;
                            that.scrollFlag = true;
                        }else {
                            that.pageIndex = 1;
                            that.remoteFlag = true;
                            that.scrollFlag = true;
                            that.scrollLoading = false;
                        }
                    }else{
                        if(that.pageIndex > 3 || that.scrollData.length >= 30){  //向下滑动大于三屏，数组前10减掉
                            that.scrollData =  that.scrollData.slice(10,that.scrollData.length);
                            scrollTopFlag = true;
                            if(that.scrollData.length <= 20 && that.pageIndex <=3){
                                that.pageIndex = 4;
                            }
                        }
                        if(that.totalPageIndex <= that.pageIndex){
                            // setTimeOut = setTimeout(()=>{
                                that.scrollData = that.scrollData.concat(that.voucherInfo.voucherSubjectDetailDtoList.slice((that.pageIndex-1)*10,that.scrollLength));//<=30
                                that.scrollFlag = false;//数据加载完毕
                                that.scrollLoading = false; //loading消失
                                // clearTimeout(setTimeOut);
                                // clearTimeout(setTimeOut2);
                            // },300)
                        }else{
                            // setTimeOut2 = setTimeout(()=>{
                    //         debugger;
                    //         if(!that.remoteFlag){
                                that.scrollData = that.scrollData.concat(that.voucherInfo.voucherSubjectDetailDtoList.slice((that.pageIndex-1)*10,that.pageIndex*10))//每次等差+10
                                that.scrollLoading = false;
                                that.remoteFlag = true;
                                if(scrollTopFlag && JSON.stringify(object) !== '{}'){
                                    object.scrollTop = object.scrollTop -360; //减去10行数据的高度
                                }
                                // }
                            // },300)
                        }
                    }
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '../../assets/scss/home.scss';
    @import '../../assets/scss/checkBusiness.scss';

    .mainContent {
        .cbBContentTitle {
            height: 80px;
            margin-bottom: $section-space;
        }
        .cbSelects {
            .el-row {
                padding: 10px;
            }
            .cbSelect {
                width: 100%;
                .el-select {
                    width: 60%;
                }
                .selectTitle {
                    height: 36px;
                    padding-bottom: 15px;
                }
            }
        }
        .dataContent {
            padding: 20px;
            /deep/ .el-table__row .cell{
                max-height:27px;
            }
        }
        .exportButton {
            margin-left: 10px
        }
    }

    .bdSection {
        &.el-row {
            padding: 20px;
        }
        .textLeft {
            width: 85%;
        }
        .titleContent {
            padding: 5px 0;
        }
    }
</style>
