<!--<template>-->
    <!--<div class="alipayFaceToPayAccountCheckReportTable">-->
        <!--<div class="search-content">-->
            <!--<searchHeader-->
                    <!--:showCompany="true"-->
                    <!--:showStoreCode = "true"-->
                    <!--:showBillingUnit="true"-->
                    <!--:showLimitDate="true"-->
                    <!--:dataLabel="'交易日期'"-->
                    <!--:limitDays="limitDays"-->
                    <!--v-on:getLimitDate1="getBookDate"-->
                    <!--v-on:getBillingUnits1="getBillingUnits"-->
                    <!--v-on:getCompany1="getCompany"-->
                    <!--v-on:getStoreCode1="getStoreCode"-->
                    <!--@reset="reset"-->
                    <!--ref="alipayFaceToPayAccountCheckReport"-->
            <!--&gt;-->
                <!--<div class="selectContent">-->
                    <!--<div class="selectTitle">品牌</div>-->
                    <!--<el-select v-model="searchData.brand">-->
                        <!--<el-option v-for="item in brandsOpt" :key="item.id" :label="item.englishName" :value="item.englishName"></el-option>-->
                    <!--</el-select>-->
                <!--</div>-->
                <!--<div class="selectContent">-->
                    <!--<div class="selectTitle">业务类型</div>-->
                    <!--<el-select v-model="searchData.busType">-->
                        <!--<el-option value="" label="请选择"></el-option>-->
                        <!--<el-option :value="1" label="交易"></el-option>-->
                        <!--<el-option :value="0" label="退款"></el-option>-->
                    <!--</el-select>-->
                <!--</div>-->
                <!--<div class="selectContent">-->
                    <!--<div class="selectTitle">查询类型</div>-->
                    <!--<el-select v-model="searchData.searchType">-->
                        <!--<el-option v-for="(item,index) in searchTypes" :key="index" :value="item.val" :label="item.label"></el-option>-->
                    <!--</el-select>-->
                <!--</div>-->
                <!--<br>-->
                <!--<br>-->
                <!--<el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>-->
                <!--<el-button size="small" type="success" class="findButt" @click="exportItemsFn">下载</el-button>-->
                <!--<el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>-->
                <!--<el-button size="small" type="success" class="findButt" @click="customActivity">自定义活动</el-button>-->
                <!--<el-popover-->
                        <!--placement="right"-->
                        <!--trigger="click">-->
                    <!--<el-table :data="downloadList" max-height="300" size="small"-->
                    <!--&gt;-->
                        <!--<el-table-column label="导出类型" width="200" property="exportType"></el-table-column>-->
                        <!--<el-table-column label="状态" width="100">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span v-if="scope.row.status === 0">已提交</span>-->
                                <!--<span v-else-if="scope.row.status === 1 ">执行中</span>-->
                                <!--<span v-else-if="scope.row.status === 2 ">已完成</span>-->
                                <!--<span v-else-if="scope.row.status === 3">已失败</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column property="createTime" label="创建时间" width="140"></el-table-column>-->
                        <!--<el-table-column width="100" label="地址">-->
                            <!--<template slot-scope="scope">-->
                                <!--<a v-if="scope.row.fileUrl" :href="'http://'+scope.row.fileUrl" class="link">下载</a>-->
                                <!--<a v-else class="link-disable">下载</a>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    <!--</el-table>-->
                    <!--<el-button slot="reference" size="small" type="success" plain @click="getDownloadList()"-->
                               <!--class="c-button">查看下载列表-->
                    <!--</el-button>-->
                <!--</el-popover>-->
            <!--</searchHeader>-->

        <!--</div>-->
        <!--<div class="content">-->
            <!--<tableOrigin-->
                    <!--:tableHead="tableHead"-->
                    <!--:align="align"-->
                    <!--:dynamicData="dynamicData"-->
                    <!--ref="alipayFaceToPayAccountCheckTable"-->
                    <!--@handleSizeChange="handleSizeChange"-->
                    <!--@handleCurrentChange="handleCurrentChange"-->
                    <!--:totalRecords="totalRecords"-->
                    <!--:pageIndex="currentPage"-->
                    <!--v-if="tblShow"-->
            <!--&gt;</tableOrigin>-->
        <!--</div>-->
        <!--<el-dialog title="自定义活动" :visible.sync="exportItemsDialog">-->
            <!--<div class="selectContent">-->
                <!--<div class="selectTitle">券名称</div>-->
                <!--<el-input placeholder="请输入券名称" size="small" clearable v-model="searchDialogName"></el-input>-->
            <!--</div>-->
            <!--<el-button size="small" type="success" class="findButt" @click="couponNameDialog=true" style="margin-bottom:15px;">新增</el-button>-->
            <!--<el-button size="small" type="success" class="findButt" @click="customActivity" style="margin-bottom:15px;">查询</el-button>-->
            <!--<tableOrigin-->
                    <!--:tableHead="tableHeadD"-->
                    <!--:align="align"-->
                    <!--:dynamicData="dynamicDataD"-->
                    <!--ref="DialogTable"-->
                    <!--@handleSizeChange="(val)=>{handleSizeChange(val,'coupon')}"-->
                    <!--@handleCurrentChange="(val)=>{handleCurrentChange(val,'coupon')}"-->
                    <!--:totalRecords="totalRecordsD"-->
                    <!--:pageIndex="currentPageD"-->
                    <!--:operates="operates"-->
                    <!--:height="500"-->
            <!--&gt;</tableOrigin>-->
            <!--<el-button size="small" type="success" class="findButt" @click="exportItemsDialog=false">关闭</el-button>-->
        <!--</el-dialog>-->
        <!--<el-dialog title="新增券名称" :visible.sync="couponNameDialog" center>-->
            <!--<el-row :gutter="24">-->
                <!--<el-col :span="12">-->
                    <!--<el-input size="small" clearable v-model="couponActivityName"-->
                              <!--v-on:input="(val)=>{!!val?uploadFlag=false:uploadFlag=true}" placeholder="请输入券名称"></el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="12">-->
                    <!--<el-upload-->
                            <!--:action="action"-->
                            <!--:file-list="fileList"-->
                            <!--:on-success="(response,file,fileList) => {return uploadSuccess(response,file,fileList)}"-->
                            <!--:show-file-list="false"-->
                            <!--:disabled="uploadFlag"-->
                    <!--&gt;-->
                        <!--<el-button class="uploadFiles" size="small" type="success" :disabled="uploadFlag"><i class="el-icon-upload2"></i>&nbsp;&nbsp;文件上传</el-button>-->
                    <!--</el-upload>-->
                <!--</el-col>-->
            <!--</el-row>-->
            <!--<div slot="footer">-->
                 <!--<el-button size="small" type="success" class="findButt" @click="couponNameDialog=false" style="margin-bottom:15px;">关闭</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'-->
    <!--import api from '@/model/apidr'-->
    <!--import ip from '@/model/api'-->
    <!--import searchHeader from '@/components/common/searchHeader'-->
    <!--import alipay4headers from '@/utils/alipayFaceToPay4TableH'-->
    <!--export default {-->
        <!--name: "alipayFaceToPayAccountCheck",-->
        <!--components: {-->
            <!--tableOrigin,-->
            <!--searchHeader-->
        <!--},-->
        <!--computed:{-->
            <!--action(){-->
                <!--return this.url+'?couponActivityName='+this.couponActivityName-->
            <!--}-->
        <!--},-->
        <!--data() {-->
            <!--return {-->
                <!--tblShow : true,-->
                <!--exportItemsDialog: false,-->
                <!--dynamicData: [],-->
                <!--tableHead:[],-->
                <!--dynamicDataD:[],-->
                <!--tableHeadD:[-->
                    <!--{-->
                        <!--label: '券活动名称',-->
                        <!--prop: 'couponActivityName'-->
                    <!--},-->
                <!--],-->
                <!--align: 'center',-->
                <!--// pageSizesList: [25, 50, 75, 100, 125],-->
                <!--pageSize: 25,-->
                <!--currentPage: 1,-->
                <!--totalRecords: 0,-->
                <!--currentPageD:1,-->
                <!--totalRecordsD:0,-->
                <!--storeName: '',-->
                <!--billingUnits:[],-->
                <!--brandsOpt:[],-->
                <!--url:'fsc/store/alipay-bill/upload-face-pay-coupon-activity',-->
                <!--fileList:[],-->
                <!--searchData:{-->
                    <!--brand:'',-->
                    <!--legalCompany: '',-->
                    <!--storeCode: '',-->
                    <!--billingUnit: '',-->
                    <!--busType:'',-->
                    <!--searchType:'detail',-->
                    <!--bookDate: [],-->
                    <!--couponName:''-->
                <!--},-->
                <!--operates:{-->
                    <!--width: 150,-->
                    <!--fixed: 'right',-->
                    <!--list: [-->
                        <!--{-->
                            <!--label: '删除',-->
                            <!--show:true,-->
                            <!--class:'c-button-icon&#45;&#45;danger&#45;&#45;opacity c-button-icon-circle',-->
                            <!--iClass:'fa fa-trash-alt',-->
                            <!--method: (index, row) => {-->
                                <!--this.sureToDelete(row);-->
                            <!--}-->
                        <!--},-->
                        <!--{-->
                            <!--label: '下载',-->
                            <!--show:true,-->
                            <!--class:'c-button-icon&#45;&#45;primary&#45;&#45;opacity c-button-icon-circle',-->
                            <!--iClass:'fa fa-download',-->
                            <!--method: (index, row) => {-->
                                <!--this.downloadDialog(row.sourceBillId);-->
                            <!--}-->
                        <!--},-->
                    <!--]-->
                <!--},-->
                <!--couponNameDialog:false,-->
                <!--couponActivityName:'',-->
                <!--uploadFlag:true,-->
                <!--searchTypes:[-->
                    <!--{-->
                        <!--label:'详情',-->
                        <!--val:'detail'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'餐厅数据',-->
                        <!--val:'storeDetail'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'开票单位数据',-->
                        <!--val:'issuingUnitDetail'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'法人公司数据',-->
                        <!--val:'companyDetail'-->
                    <!--},-->
                <!--],-->
                <!--downloadList:[],-->
                <!--pageSizeD:10,-->
                <!--searchDialogName:'',-->
                <!--limitDays:31-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--exportItemsFn() {-->
                <!--api.downloadAlipayFaceToPayAccountCheck(this.getParam());-->
            <!--},-->
            <!--handleSizeChange(size,type) {-->
                <!--if(type){-->
                    <!--this.pageSizeD = size;-->
                    <!--this.customActivity();-->
                <!--}else{-->
                    <!--this.pageSize = size;-->
                    <!--this.getData()-->
                <!--}-->
            <!--},-->
            <!--handleCurrentChange(currentPage,type) {-->
                <!--if(type){-->
                    <!--this.currentPageD = currentPage;-->
                    <!--this.customActivity();-->
                <!--}else{-->
                    <!--this.currentPage = currentPage;-->
                    <!--this.getData()-->
                <!--}-->
            <!--},-->
            <!--getData(pageIndex) {-->
                <!--let that = this;-->

                <!--if(!this.searchData.bookDate || this.searchData.bookDate.length === 0){-->
                    <!--this.common.messageUtil({-->
                        <!--type:'warning',-->
                        <!--message:'请选择交易日期'-->
                    <!--});-->
                    <!--return;-->
                <!--}-->
                <!--if(this.searchData.bookDate && this.searchData.bookDate.length>0){-->
                    <!--let str = ''-->
                        <!--for(let val of Object.entries(this.searchData)){-->
                           <!--if(val[0] === 'searchType' || val[0] === 'bookDate'){-->
                               <!--continue;-->
                           <!--}else{-->
                               <!--str += val[1]-->
                           <!--}-->
                        <!--}-->
                        <!--if(!str && this.searchData.bookDate[1] > this.searchData.bookDate[0]){-->
                            <!--this.common.messageUtil({-->
                                <!--type:'warning',-->
                                <!--message:'当前筛选条件下，只能查询一天的数据，请重新选择日期！'-->
                            <!--});-->
                            <!--return;-->
                        <!--}-->
                <!--}-->
                <!--this.tblShow = false;-->
                <!--if (pageIndex) {-->
                    <!--this.currentPage = 1;-->
                <!--}-->
                <!--that.tableHead = [];-->
                <!--that.dynamicData = [];-->
                <!--that.totalRecords = 0;-->
                <!--switch(that.searchData.searchType){-->
                    <!--case 'detail': that.tableHead = alipay4headers.detail;break;-->
                    <!--case 'companyDetail': that.tableHead = alipay4headers.companyDetail;break;-->
                    <!--case 'issuingUnitDetail': that.tableHead = alipay4headers.issuingUnitDetail;break;-->
                    <!--case 'storeDetail': that.tableHead = alipay4headers.storeDetail;break;-->
                    <!--default:break;-->
                <!--}-->
                <!--api.alipayFaceToPayAccountCheckList(this.getParam(), function (res) {-->
                    <!--that.tblShow = true;-->
                    <!--if (res.code === 200) {-->
                        <!--that.dynamicData = res.data.list;-->
                        <!--that.totalRecords = res.data.totalRecords;-->
                    <!--} else {-->

                    <!--}-->
                <!--})-->
            <!--},-->
            <!--getParam() {-->
                <!--return this.common.joinSearchParam([-->
                    <!--{-->
                        <!--value: this.searchData.brand,-->
                        <!--name: 'resBrand'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.searchData.legalCompany,-->
                        <!--name: 'resEntity'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.searchData.storeCode,-->
                        <!--name: 'resCode'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.searchData.billingUnit,-->
                        <!--name: 'issuingUnit'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.searchData.busType,-->
                        <!--name: 'transType'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.searchData.searchType,-->
                        <!--name: 'searchType'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.searchData.bookDate?this.searchData.bookDate[0]:'',-->
                        <!--name: 'transTimeStart'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.searchData.bookDate?this.searchData.bookDate[1]:'',-->
                        <!--name: 'transTimeEnd'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.searchData.couponName,-->
                        <!--name: 'discountCouponDes'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.currentPage,-->
                        <!--name: 'pageIndex'-->
                    <!--},-->
                    <!--{-->
                        <!--value: this.pageSize,-->
                        <!--name: 'pageSize'-->
                    <!--},-->
                <!--])-->
            <!--},-->
            <!--reset() {-->
                <!--this.$refs.alipayFaceToPayAccountCheckReport.reset();-->
                <!--this.searchData.busType = '';-->
                <!--this.searchData.searchType = '';-->
                <!--this.searchData.brand = '';-->
            <!--},-->
            <!--getBrandList(){-->
                <!--var that = this;-->
                <!--let searchParam = this.common.formatPathParam({-->
                    <!--pageIndex : 1,-->
                    <!--pageSize  : 99999999,-->
                    <!--flag:2-->
                <!--});-->
                <!--ip.getBrandEnglishNames(searchParam,function(res){-->
                    <!--if(res.code !== 404 && res.code !== 200){-->
                        <!--that.common.messageUtil({-->
                            <!--type:'error',-->
                            <!--message:res.msg-->
                        <!--})-->
                    <!--}-->
                    <!--if(res.data && res.data.length>0){-->
                        <!--that.brandsOpt = res.data;-->
                    <!--}-->
                <!--})-->
            <!--},-->
            <!--getStoreCode(res) {-->
                <!--this.searchData.storeCode = res;-->
            <!--},-->
            <!--getCompany(res) {-->
                <!--this.searchData.legalCompany = res;-->
            <!--},-->
            <!--getBillingUnits(res){-->
                <!--this.searchData.billingUnit = res;-->
            <!--},-->
            <!--getBookDate(res){-->
                <!--this.searchData.bookDate = res;-->
            <!--},-->
            <!--customActivity(){-->
                <!--let that = this;-->
                <!--api.alipayFaceToPayCouponList('?pageIndex='+this.currentPageD+'&pageSize='+this.pageSizeD+'&couponActivityName='+this.searchDialogName,res=>{-->
                    <!--if(res.code === 200){-->
                        <!--that.dynamicDataD = res.data.list;-->
                        <!--that.totalRecordsD = res.data.totalRecords;-->
                    <!--}else{-->
                        <!--that.dynamicDataD = [];-->
                        <!--that.totalRecordsD = 0;-->
                    <!--}-->
                    <!--that.exportItemsDialog = true;-->
                <!--})-->
            <!--},-->
            <!--uploadSuccess(response,file,fileList){-->
                <!--if(response.code === 200){-->
                    <!--this.common.messageUtil({-->
                        <!--type:'success',-->
                        <!--message:response.data-->
                    <!--});-->
                <!--}else{-->
                    <!--this.fileList = [];-->
                    <!--this.common.messageUtil({-->
                        <!--type:'warning',-->
                        <!--message:response.msg-->
                    <!--});-->
                <!--}-->
            <!--},-->
            <!--downloadDialog(param){-->
                <!--let that = this;-->
                <!--api.downloadAlipayFaceToPayCoupon('?couponActivityName='+param, 'application/vnd.ms-excel', function (res, header) {-->
                    <!--let name = header['content-disposition'];-->
                    <!--that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);-->
                <!--})-->
            <!--},-->
            <!--sureToDelete(row){-->
                <!--var that = this;-->
                <!--this.$confirm('确定删除?', '提示', {-->
                    <!--confirmButtonText: '确定',-->
                    <!--cancelButtonText: '取消',-->
                    <!--type: 'warning'-->
                <!--}).then(() => {-->
                    <!--api.delAlipayCoupon('?couponActivityName='+row.couponActivityName,function (res) {-->
                        <!--if(res.code === 200){-->
                            <!--that.common.messageUtil({-->
                                <!--type: 'success',-->
                                <!--message: res.data-->
                            <!--});-->
                            <!--that.customActivity();-->
                        <!--}else{-->
                            <!--that.common.messageUtil({-->
                                <!--type: 'warning',-->
                                <!--message: res.msg-->
                            <!--});-->
                            <!--that.customActivity();-->
                        <!--}-->
                    <!--});-->
                <!--}).catch(() => {-->
                <!--});-->
            <!--},-->
            <!--getDownloadList(param){-->
                <!--var that = this;-->
                <!--// let exportType = '';//设置查询下载的参数-->
                <!--// switch(that.searchData.searchType){-->
                <!--//     case 'detail':  exportType = '支付宝当面付对账表-详情数据';break;-->
                <!--//     case 'companyDetail':  exportType = '支付宝当面付对账表-法人公司数据';break;-->
                <!--//     case 'issuingUnitDetail':  exportType = '支付宝当面付对账表-开票单位数据';break;-->
                <!--//     case 'storeDetail':  exportType = '支付宝当面付对账表-餐厅数据';break;-->
                <!--//     default:break;-->
                <!--// }-->
                <!--// ip.getDownloadListDr('?pageSize=9999999&exportTypes='+exportType,function(res){-->
                <!--ip.getDownloadListDr(`?pageSize=9999999-->
                                        <!--&exportTypes=支付宝当面付对账表-详情数据-->
                                        <!--&exportTypes=支付宝当面付对账表-法人公司数据-->
                                        <!--&exportTypes=支付宝当面付对账表-开票单位数据-->
                                        <!--&exportTypes=支付宝当面付对账表-餐厅数据`,function(res){-->
                    <!--if(res.code === 200){-->
                        <!--that.downloadList = res.data.list;-->
                    <!--}else{-->
                        <!--that.downloadList = [];-->
                    <!--}-->
                <!--})-->
            <!--},-->

        <!--},-->
        <!--beforeMount(){-->
          <!--this.getBrandList();-->
        <!--},-->
        <!--mounted() {-->
        <!--}-->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->
    <!--.link{-->
        <!--color:-webkit-link;-->
    <!--}-->
    <!--.link-disable{-->
        <!--color:#bdbdbd;-->
        <!--cursor:not-allowed-->
    <!--}-->
<!--</style>-->
