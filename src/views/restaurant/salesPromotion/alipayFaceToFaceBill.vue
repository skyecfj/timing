<!--<template>-->
    <!--<div class="alipayFaceToFaceBillTable">-->
        <!--<div class="search-content">-->
            <!--<searchHeader-->
             <!--:showCompany="true"-->
             <!--:showFinancialMarket="true"-->
             <!--:dataLabel="'交易日期'"-->
             <!--:showDate="true"-->
             <!--v-on:getCompany1="getCompany"-->
             <!--v-on:getFinancial1="getFinancial"-->
             <!--v-on:getBookDate="getBookDate"-->
             <!--@reset="reset"-->
             <!--ref="alipayFaceToFaceBillReport"-->
            <!--&gt;-->
                <!--<div class="selectContent">-->
                    <!--<div class="selectTitle">活动名称</div>-->
                    <!--<el-select filterable v-model="activityName">-->
                        <!--<el-option value="">请选择</el-option>-->
                        <!--<el-option v-for="(item,index) in activityNameOpt" :key="index" :value="item.id" :label="item.activityName"></el-option>-->
                    <!--</el-select>-->
                <!--</div>-->
            <!--</searchHeader>-->
            <!--<el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>-->
            <!--<el-button size="small" type="success" class="findButt" @click="customActivity(true)" plain>自定义活动</el-button>-->
            <!--&lt;!&ndash;<el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>&ndash;&gt;-->
            <!--<el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>-->
        <!--</div>-->
        <!--<div class="content">-->
            <!--<tableOrigin-->
                    <!--:tableHead="tableHead"-->
                    <!--:align="align"-->
                    <!--:dynamicData="dynamicData"-->
                    <!--ref="alipayFaceToFaceBillTable"-->
                    <!--@handleSizeChange="handleSizeChange"-->
                    <!--@handleCurrentChange="handleCurrentChange"-->
                    <!--:totalRecords="totalRecords"-->
                    <!--:pageIndex="currentPage"-->
            <!--&gt;</tableOrigin>-->

        <!--</div>-->
        <!--<el-dialog :visible.sync="showCustomActivity" center>-->
            <!--<el-button type="success" icon="el-icon-circle-plus-outline" circle  @click="addCustom(dialogCustom.length-1)" ></el-button>-->
            <!--<el-table :data="dialogCustom">-->
                <!--<el-table-column prop="activeName" label="活动名称">-->
                    <!--<template slot-scope="scoped">-->
                        <!--<el-input v-model="scoped.row.couponActivityName" :disabled="!!scoped.row.exist"></el-input>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="操作">-->
                    <!--<template slot-scope="scoped">-->
                        <!--<template  v-if="!!scoped.row.exist">-->
                            <!--<el-button type="warning" icon="el-icon-download" circle size="small" @click="downloadFile(scoped.row.couponActivityName)"></el-button>-->
                            <!--<el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteAttachment(scoped.row.couponActivityName)"></el-button>-->
                        <!--</template>-->
                        <!--<template  v-else>-->
                            <!--<el-button type="primary" icon="el-icon-upload2" circle size="small" @click="importData(scoped.row.couponActivityName)">-->
                            <!--</el-button>-->
                        <!--</template>-->
                        <!--<el-button type="primary" icon="el-icon-remove-outline" plain circle size="small" @click="removeLine(scoped.$index)"-->
                                   <!--v-if="dialogCustom.length>1 && !scoped.row.exist">-->
                        <!--</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            <!--</el-table>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button type="primary"  size="small" @click="showCustomActivity = false">关闭</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
        <!--<el-dialog title="附件" :visible.sync="dialogVisible" width="30%">-->
            <!--<el-upload-->
                    <!--ref="landlordBill"-->
                    <!--class="upload-demo"-->
                    <!--:action="action"-->
                    <!--:on-success="uploadSucceed"-->
                    <!--:on-remove="handleRemove"-->
                    <!--:auto-upload="false"-->
                    <!--:limit="1"-->
                    <!--:file-list="fileObjTemp.files">-->
                <!--<el-button size="small" type="primary">点击上传</el-button>-->
                <!--<div slot="tip" class="el-upload__tip"></div>-->
            <!--</el-upload>-->
            <!--<el-button class="file-upload-save" size="small" type="success" @click="saveAttach">保存</el-button>-->
        <!--</el-dialog>-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'-->
    <!--import api from '@/model/apidr'-->
    <!--import ip from '@/model/api'-->
    <!--import searchHeader from '@/components/common/searchHeader'-->
    <!--const dialogCustomConst = {-->
        <!--exist:false,-->
        <!--couponActivityName:'',-->
        <!--filePath:null-->
    <!--}-->
    <!--export default {-->
        <!--name: "lossGainReport",-->
        <!--components: {-->
            <!--tableOrigin,-->
            <!--searchHeader-->
        <!--},-->
        <!--computed: {-->
            <!--action() {-->
                <!--return this.actions + this.activityNameAttachment;-->
            <!--}-->
        <!--},-->
        <!--data() {-->
            <!--return {-->
                <!--dynamicData: [],-->
                <!--tableHead: [-->
                    <!--{-->
                        <!--label:'财务市场',-->
                        <!--prop:'financialMarket'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'法人公司',-->
                        <!--prop:'companyName'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'客户名称',-->
                        <!--prop:'clientName'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'活动名称',-->
                        <!--prop:'activityName'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'品牌',-->
                        <!--prop:'brand'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'交易日期',-->
                        <!--prop:'tradeDate'-->
                    <!--},-->
                    <!--{-->
                        <!--label:'账单与银行流水核对状态',-->
                        <!--prop:'checkStatus',-->
                        <!--fixed:true,-->
                        <!--formatter:(row)=>{-->
                            <!--return !!row.checkStatus?'已核对':'未核对'-->
                        <!--},-->
                    <!--},-->
                    <!--{-->
                        <!--label:'金额',-->
                        <!--prop:'storeReceivable'-->
                    <!--},-->
                <!--],-->
                <!--dialogCustom:[JSON.parse(JSON.stringify(dialogCustomConst))],-->
                <!--align: 'center',-->
                <!--// pageSizesList: [5, 10, 15, 20, 25],-->
                <!--pageSize: 25,-->
                <!--currentPage: 1,-->
                <!--totalRecords: 0,-->
                <!--financialMarket:'',-->
                <!--bookDate:[],-->
                <!--clientName:'',-->
                <!--activityName:'',-->
                <!--checkStatus:'',-->
                <!--clientNameOpt:[],-->
                <!--activityNameOpt:[],-->
                <!--checkStatusOpt:[],-->
                <!--showCustomActivity:false,-->
                <!--dialogVisible:false,-->
                <!--fileObjTemp: {-->
                    <!--files: []-->
                <!--},-->
                <!--actions:'fsc/store/alipay-bill/upload-face-pay-coupon-activity?couponActivityName=',-->
                <!--activityNameAttachment:''-->
                <!--// activityNames:[]-->
            <!--}-->
        <!--},-->
        <!--methods: {-->
            <!--handleSizeChange(size) {-->
                <!--this.pageSize = size;-->
                <!--this.getData()-->
            <!--},-->
            <!--handleCurrentChange(currentPage) {-->
                <!--this.currentPage = currentPage;-->
                <!--this.getData()-->
            <!--},-->
            <!--getData(pageIndex) {-->
                <!--if(pageIndex){-->
                    <!--this.currentPage = 1;-->
                <!--}-->
                <!--let that = this;-->
                <!--api.alipayBillReport(this.getParam(),function(res){-->
                    <!--if(res.code === 200){-->
                        <!--that.dynamicData = res.data.list;-->
                        <!--that.totalRecords = res.data.totalRecords;-->
                    <!--}else{-->
                        <!--that.dynamicData = [];-->
                        <!--that.totalRecords = 0;-->
                    <!--}-->
                <!--})-->
            <!--},-->
            <!--getParam(num){-->
                <!--if(num){-->
                    <!--this.currentPage = num;-->
                <!--}-->
                <!--return this.common.joinSearchParam([-->
                    <!--{-->
                        <!--value:this.financialMarket,-->
                        <!--name:'financialMarket'-->
                    <!--},-->
                    <!--{-->
                        <!--value:this.legalCompany,-->
                        <!--name:'companyCode'-->
                    <!--},-->
                    <!--{-->
                        <!--value:this.storeCode,-->
                        <!--name:'storeCode'-->
                    <!--},-->
                    <!--{-->
                        <!--value:this.storeName,-->
                        <!--name:'storeName'-->
                    <!--},-->
                    <!--{-->
                        <!--value:this.bookDate?this.bookDate[1]:null,-->
                        <!--name:'tradeDateEnd'-->
                    <!--},-->
                    <!--{-->
                        <!--value:this.bookDate?this.bookDate[0]:null,-->
                        <!--name:'tradeDateStart'-->
                    <!--},-->
                    <!--{-->
                        <!--value:this.currentPage,-->
                        <!--name:'pageIndex'-->
                    <!--},-->
                    <!--{-->
                        <!--value:this.pageSize,-->
                        <!--name:'pageSize'-->
                    <!--},-->
                <!--])-->
            <!--},-->
            <!--reset() {-->
                <!--this.bookDate = [];-->
                <!--this.activityName = '';-->
                <!--this.$refs.alipayFaceToFaceBillReport.reset();-->
            <!--},-->
            <!--getBookDate(res){-->
              <!--this.bookDate = res;-->
            <!--},-->
            <!--getCompany(res){-->
                <!--this.legalCompany = res;-->
            <!--},-->
            <!--getFinancial(res){-->
                <!--this.financialMarket = res;-->
            <!--},-->
            <!--customActivity(flag){-->
                    <!--let that = this;-->
                    <!--api.alipayBillList('',res=>{-->
                        <!--if(res.code === 200){-->
                            <!--that.dialogCustom = res.data.list;-->
                            <!--if(that.dialogCustom && that.dialogCustom.length>0){-->
                                <!--that.dialogCustom.map(x=>{-->
                                    <!--x['exist'] = true-->
                                <!--})-->
                            <!--}-->
                        <!--}else{-->
                            <!--that.dialogCustom = [JSON.parse(JSON.stringify(dialogCustomConst))];-->
                        <!--}-->
                        <!--if(flag){-->
                            <!--that.showCustomActivity = true;-->
                        <!--}-->
                    <!--})-->
            <!--},-->
            <!--addCustom(index){-->

                <!--// if(this.dialogCustom[index].activityName){-->
                    <!--this.dialogCustom.push(JSON.parse(JSON.stringify(dialogCustomConst)))  ;-->
                <!--// }-->
            <!--},-->
            <!--downloadFile(fileName){-->
                <!--let that = this;-->
                <!--api.downloadAlipayBill('?couponActivityName='+fileName,'application/vnd.ms-excel',function(res,header){-->
                    <!--let name = header['content-disposition'];-->
                    <!--that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);-->
                <!--})-->
            <!--},-->
            <!--removeLine(index){-->
                <!--console.log(index)-->
                <!--this.dialogCustom.splice(index,1)-->
            <!--},-->
            <!--importData(rowObj) {-->
                <!--if(rowObj){-->
                    <!--this.activityNameAttachment  = rowObj;-->
                    <!--this.dialogVisible = true;-->
                <!--}else{-->
                    <!--this.common.messageUtil({-->
                        <!--type:'warning',-->
                        <!--message:'请填写活动名称后选择上传文件!'-->
                    <!--})-->
                <!--}-->
            <!--},-->
            <!--//删除file-->
            <!--handleRemove(file, fileList) {-->
            <!--},-->
            <!--//上传成功-->
            <!--uploadSucceed(res, file, fileList) {-->
                <!--let that = this;-->
                <!--that.fileObjTemp = {-->
                    <!--files: []-->
                <!--};-->
                <!--if(res.code !== 200){-->
                    <!--this.common.messageUtil({-->
                        <!--type:'warning',-->
                        <!--message:res.msg-->
                    <!--})-->
                <!--}else{-->
                    <!--that.customActivity();-->
                    <!--this.dialogVisible = false;-->
                <!--}-->
            <!--},-->
            <!--updateFileObjForSubmit(fileList) {-->
            <!--},-->
            <!--//保存已上传的fileList-->
            <!--saveAttach() {-->
                <!--let that = this;-->
                <!--this.$nextTick(function (res) {-->
                    <!--this.$refs.landlordBill.submit();-->
                <!--})-->
            <!--},-->
            <!--deleteAttachment(name){-->
                <!--let that = this;-->
                <!--this.$confirm('确定删除?', '提示', {-->
                    <!--confirmButtonText: '确定',-->
                    <!--cancelButtonText: '取消',-->
                    <!--type: 'warning'-->
                <!--}).then(() => {-->
                    <!--api.alipayBillDelete('?couponActivityName='+encodeURIComponent(name),function (res) {-->
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
                        <!--}-->
                    <!--});-->
                <!--}).catch(() => {-->
                    <!--this.common.messageUtil({-->
                        <!--type: 'info',-->
                        <!--message: '已取消删除'-->
                    <!--});-->
                <!--});-->
            <!--},-->
            <!--download(){-->

            <!--}-->
        <!--},-->
        <!--beforeMount(){-->
            <!--let that = this;-->
            <!--ip.getActiveList('?pageSize='+999999,res=>{-->
                <!--if(res.code === 200){-->
                    <!--that.activityNameOpt = res.data.list;-->
                <!--}else{-->
                    <!--that.activityNameOpt = [];-->
                <!--}-->
            <!--})-->
        <!--}-->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
