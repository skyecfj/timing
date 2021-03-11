<template>
    <div class="nonchasBOHandThirdPart">
        <div class="search-content" >
            <searchHeader v-bind:searchConfig="pageUtil.searchConfig"
                          v-on:rangeDatechange="rangeDatechange" ></searchHeader>
            <el-button size="small"  type="success" class="findButt" @click="search">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="importData">上传</el-button>
            <el-button size="small"  type="success" class="findButt" @click="exportDetail('download')">下载</el-button>
            <el-button size="small"  type="success" class="findButt" @click="exportDetail('export')">导出</el-button>
            <el-button size="small"  type="success" class="findButt" @click="reprocessRefund">差异定位</el-button>
            <el-button size="small"  type="success" class="findButt" @click="billtozero">置为0</el-button>
        </div>
        <div class="content" >
            <tableOrigin :tableHead="tableHead"
                         :align="align"
                         :dynamicData="dynamicData"
                         ref="nonchasBOHandThirdPart"
                         @handleSizeChange ="handleSizeChange"
                         @handleCurrentChange = "handleCurrentChange"
                         :totalRecords="totalRecords"
                         :pageIndex="currentPage" >
            </tableOrigin>
        </div>
        <el-dialog title="原因备注" :visible.sync="remarkVisible"  width="600px" @closed="remarkDialogClosed" >
            <el-form ref="remarkForm" :model="remarkObj" label-width="80px">
                <el-form-item label="原因备注">
                    <el-input type="textarea" v-model="remarkObj.remark" :rows="5" placeholder="请输入原因备注" maxlength="500" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small"  type="success" class="findButt" @click="saveRemark()">保存</el-button>
                    <el-button size="small"  type="success" plain class="reSet" @click="remarkVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :visible.sync="dialogTableVisible" center width="600px">
            <p style="margin-bottom:10px;" >{{differTitle}}</p>
            <el-table :data="gridData"  size="small" border :header-row-style="headerFn" :header-cell-style="thFn">
                <el-table-column property="resultCode" label="差异原因" ></el-table-column>
                <el-table-column property="amount" label="差异金额"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  type="info" plain class="reSet" @click="dialogTableVisible=false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog title="上传" :visible.sync="uploadDialogVisible" width="30%" @closed="attachDialogClosed" :close-on-click-modal="false"  >
            <div  v-loading="loadFile"
                    element-loading-text = "导入中..."
                    element-loading-spinner = "el-icon-loading"
                    element-loading-background = "transparent">
                <el-upload  class="data-upload"
                            ref="dataUploadForm"
                            :action="uploadUrl"
                            :on-preview ="handlePreview"
                            :on-success ="dataUploadSucceed"
                            :on-error ="dataUploadError"
                            :before-upload="beforeUpload"
                            :file-list="fileObjTemp.files"
                            :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">点击选择文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="doDataUpload">确定</el-button>
                <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
            </div>
        </el-dialog>
        <el-dialog title="附件" :visible.sync="attatchDialogVisible" width="30%" @closed="attachDialogClosed" :close-on-click-modal="false"  >
            <div  v-loading="loadFile"
                    element-loading-text = "上传中..."
                    element-loading-spinner = "el-icon-loading"
                    element-loading-background = "transparent">
                <el-upload  class="upload-demo"
                            :action="uploadUrl"
                            :on-preview ="handlePreview"
                            :on-success ="uploadSucceed"
                            :on-remove  ="handleRemove"
                            multiple :before-upload="beforeUpload"
                            :before-remove="beforeRemove"
                            :file-list="fileObjTemp.files">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import apiStore from '../../../model/apidr'
    import api from '../../../model/api'
    import ip from '../../../model/tempIp'
    import scroll from '@/directives/index'
    //查询form组件
    import searchHeader from './dataCheckComponent/searchHeader'
    //查询form配置
    import pageUtil from '../../../utils/restaurant/dataCheck/nonchasBOHandThirdPart'
    import tableOrigin from '../BOHDataMg/originalTable'
    export default {
        name: "NonCashBOHandThirdPart",
        components: {
            tableOrigin,
            searchHeader
        },
        directives: { scroll },
        watch : {
            uploadUrlChanged(val,oldVal){
                this.uploadUrl = val;
            },
        },
        computed: {
            uploadUrlChanged() {
                return ip.store + '/boh-bill-result/upload?ignoreNoCode='+ this.ignoreNoCode;
            }
        },
        beforeMount(){
            //console.log(pageUtil.searchConfig.searchObj);
            this.getSearchOptioins();
            //营运市场查询配置
            this.setSearchOperateMarketConfig();
            //法人公司查询配置
            //this.setSearchCompanyConfig()
            //餐厅编号查询配置
            this.setSearchStoreConfig();
        },
        data() {
            return {
                attatchDialogVisible : false,
                uploadDialogVisible : false,
                //暂存文件对象
                fileObjTemp: {
                    id : '',
                    files : []
                },
                loadFile:false,
                fileCount:0,
                dynamicData: [],
                adjustTypeOpts: [],
                uploadUrl: '',
                tableHead: [
                    {
                        label : '餐厅编号',
                        prop  : 'storeCode'
                    },
                    {
                        label : '法人公司',
                        prop  : 'companyName'
                    },
                    {
                        label : '营运市场',
                        prop  : 'financialMarket'
                    },
                    {
                        label : '品牌',
                        prop  : 'brand'
                    },
                    {
                        label : '营业日期',
                        prop  : 'bizDate'
                    },
                    {
                        label : '活动名称',
                        prop  : 'fscActivityCode'
                    },
                    {
                        label : 'BOH应收金额',
                        prop  : 'bohSysAmount',
                    },
                    {
                        label : 'BOH实收金额',
                        prop  : 'bohConfirmAmount'
                    },
                    {
                        label : '账单金额',
                        prop  : 'billAmount'
                    },
                    {
                        label : '差异金额',
                        prop  : 'allOrAmount',
                        width : '110px',
                        labelComments: '（账单-实收）',
                        commentColor: '#000'
                    },
                    {
                        label : '已定位差异金额',
                        prop  : 'adjust',
                    },
                    {
                        label : '差异原因',
                        prop  : ' ',
                        width : '130px',
                        edit  : true,
                        formatter : (row) =>{
                            let tempAdjustDetail = ''
                            row.cashaResults.forEach(function(item,index){
                                tempAdjustDetail += item.resultCode +';'
                            });
                            if(tempAdjustDetail.length > 8){
                                return tempAdjustDetail.substring(0,7) + '...'
                            }else{
                                return tempAdjustDetail;
                            }
                        },
                        method : (headerIndex,row,tblProp,index) => {
                            console.log(row);
                            this.showDifferReason(row,index);
                        }
                    },
                    {
                        label: '原因备注',
                        prop: '编辑',
                        edit: true,
                        //emptyText: '编辑',
                        formatter : (row) =>{
                            if(!row.remark || row.remark.length == 0){
                                return '编辑';
                            }else if(row.remark.length <9){
                                return row.remark;
                            }else{
                                return row.remark.substring(0,8) + '...';
                            }
                        },
                        method: (headerIndex,row,tblProp,index) => {
                            console.log(row);
                            this.openRemarkEditDg(row,index);
                        }
                    },
                    {
                        label: '附件',
                        //prop: '编辑',
                        edit: true,
                        //emptyText: '编辑',
                        formatter : (row) =>{
                            if(!row.files.length){
                                return '上传';
                            }else if(row.files.length > 0){
                                return '附件';
                            }
                        },
                        method: (headerIndex,row,tblProp,index) => {
                            console.log(row);
                            this.showAttachDialog(row);
                        }
                    }
                ],
                pageUtil : pageUtil,
                branNameDefaultOpts : [{
                    brandName : '请选择',
                    brandEnglishName : ''
                }],
                activityNameDefaultOpt: [{
                    activityName : '请选择'
                }],
                selection: false,
                align: 'center',
                currentPage  : 1,
                pageSizeOpt  : [25,50,75,100,125],
                pageSize     : 25,
                totalRecords : 0,
                remarkVisible: false,
                tempDataIndex : '',
                remarkObj     : {
                    id     : '',
                    remark : ''
                },
                gridData: [],
                dialogTableVisible:false,
                differTitle:'',
                searchCompanyScrollPageIndex : 1,
                searchCompanyScrollFlag      : true,
                searchCompanySelectObj       : {},
                tempSearchCompanyKeyWord     : '',
                searchStoreScrollPageIndex : 1,
                searchStoreScrollFlag      : true,
                searchStoreSelectObj       : {},
                tempSearchStoreKeyWord     : '',
                ignoreNoCode : 'false'
            }
        },
        methods: {
            //search组件 范围变量变化
            rangeDatechange(emitObj){
                let _self = this;
                for(let searchKey in pageUtil.searchConfig.searchObj){
                for(let emitObjKey in emitObj){
                    if(searchKey == emitObjKey){
                    pageUtil.searchConfig.searchObj[searchKey] = emitObj[emitObjKey];
                    }
                }
                }
            },
            //获查询头部选项
            getSearchOptioins(){
                let _self = this;
                let searchParam = this.common.formatPathParam({
                    pageIndex : 1,
                    pageSize  : 99999999,
                    flag      : 1
                });
                api.getBrandList(searchParam,function(result){
                    //console.log(result);
                    if(result.data.list){
                        pageUtil.searchConfig.searchConditions[4].otherConfig.opts = result.data.list.concat();
                    }else{
                        pageUtil.searchConfig.searchConditions[4].otherConfig.opts = [];
                    }
                });
                api.getActiveList('?pageSize='+999999,result=>{
                    if(result.data.list){
                        pageUtil.searchConfig.searchConditions[1].otherConfig.opts = result.data.list.concat();
                    }else{
                        pageUtil.searchConfig.searchConditions[1].otherConfig.opts = [];
                    }
                })
                let param = this.common.formatPathParam({
                    itemCode : '当前活动'
                });
                this.adjustTypeOpts = [ {adjustType : 'C4'},
                                        {adjustType : '串户'},
                                        {adjustType : '时间性差异'},
                                        {adjustType : 'SPF手工账务'},
                                        {adjustType : '非SPF手工账务'},
                                        {adjustType : '退款'},
                                        {adjustType : '预约单下单'},
                                        {adjustType : '预约单取餐'}];
                apiStore.getAdjustTypeByBohKeyworld(param,function(res){
                    if(res.code === 200){
                        _self.adjustTypeOpts = _self.adjustTypeOpts.concat(res.data);
                    }
                    pageUtil.searchConfig.searchConditions[5].otherConfig.opts = _self.adjustTypeOpts.concat();
                });
            },
            //设置营运市场
            setSearchOperateMarketConfig(){
                let searchOperateMarketConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                searchOperateMarketConfig.changeMethod = () => {
                    pageUtil.searchConfig.searchObj.storeCode = null;
                    searchStoreConfig.opts = [];
                    this.searchStoreRemote('');
                }
                searchOperateMarketConfig.opts = [];
                api.getOperateMarketIdNames('&judgePermission=true', res=> {
                    if(res.code == 200){
                        searchOperateMarketConfig.opts = res.data.concat();
                    }
                })
            },
            //法人公司查询配置
            // setSearchCompanyConfig(){
            //     let searchCompanyConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
            //     let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
            //     searchCompanyConfig.remoteMethod = (query) => {
            //         //console.log(query);
            //         this.searchCompanyRemote(query);
            //     };
            //     searchCompanyConfig.scrollMethod = (param,object) => {
            //         this.searchCompanyScrollMethod(param,object);
            //     };
            //     searchCompanyConfig.visibleChange = (isVisible) => {
            //         if(!isVisible && !pageUtil.searchConfig.searchObj.companyName){
            //             searchCompanyConfig.opts = [];
            //             this.searchCompanyRemote('');
            //         }else{
            //             //this.searchCompanyRemote(pageUtil.searchConfig.searchObj.companyName);
            //         }
            //     };
            //     // searchStoreConfig.keyupFn = (event) => {
            //     //   if(!event.target.value){
            //     //     this.searchCompanyRemote('');
            //     //   }
            //     // }
            //     searchCompanyConfig.changeMethod = () => {
            //         pageUtil.searchConfig.searchObj.storeCode = '';
            //         searchStoreConfig.opts = [];
            //         this.searchStoreRemote('');
            //     }
            //     this.searchCompanyRemote('');
            // },
            //餐厅编号查询配置
            setSearchStoreConfig(){
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                searchStoreConfig.remoteMethod = (query) => {
                    this.searchStoreRemote(query);
                };
                searchStoreConfig.scrollMethod = (param,object) => {
                    this.searchStoreScrollMethod(param,object);
                };
                searchStoreConfig.visibleChange = (isVisible) => {
                    if(!isVisible && !pageUtil.searchConfig.searchObj.storeCode){
                        searchStoreConfig.opts = [];
                        this.searchStoreRemote('');
                    }
                };
                this.searchStoreRemote('');
            },
            //法人公司下拉查询和远程查询
            // searchCompanyScrollMethod(param,object){
            //     let _self = this;
            //     let searchCompanyConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
            //     if(param){
            //         this.searchCompanySelectObj = object;
            //         if(this.searchCompanyScrollFlag){
            //             this.searchCompanyScrollPageIndex++;
            //             let param = this.common.formatPathParam({
            //                 //companyName  : this.tempSearchCompanyKeyWord,
            //                 //marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
            //                 pageIndex    : this.searchCompanyScrollPageIndex,
            //                 pageSize     : 20
            //             });
            //             api.getCompanyByFMarket(param,function(res){
            //                 if(res.code === 200){
            //                     searchCompanyConfig.opts = searchCompanyConfig.opts.concat(res.data);
            //                 }else{
            //                     _self.searchCompanyScrollFlag = false;
            //                 }
            //             })
            //         }
            //     }
            // },
            // searchCompanyRemote(query){
            //     let _self = this;
            //     let searchCompanyConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
            //     searchCompanyConfig.remoteLoading = true;
            //     this.searchCompanyScrollPageIndex = 1;
            //     this.tempSearchCompanyKeyWord = query;
            //     this.searchCompanyScrollFlag = true;
            //     if(JSON.stringify(this.searchCompanySelectObj) !== '{}'){
            //         this.searchCompanySelectObj.scrollTop = 0;
            //     }
            //     let param = this.common.formatPathParam({
            //         companyName  : query,
            //         //marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
            //         pageIndex    : this.searchCompanyScrollPageIndex,
            //         pageSize     : 20
            //     });
            //     api.getCompanyByFMarket(param,function(result){
            //         searchCompanyConfig.remoteLoading = false;
            //         if(result.code == 200){
            //             searchCompanyConfig.opts = [];
            //             searchCompanyConfig.opts = searchCompanyConfig.opts.concat(result.data);
            //         }else if(result.code == 404){
            //             searchCompanyConfig.opts = [];
            //             pageUtil.searchConfig.searchObj.companyName = '';
            //         }
            //     })
            // },
            //餐厅下拉查询和远程查询
            searchStoreScrollMethod(param,object){
                let _self = this;
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                if(param){
                    this.searchStoreSelectObj = object;
                    if(this.searchStoreScrollFlag){
                        this.searchStoreScrollPageIndex++;
                        let param = {
                            //companyCode     : pageUtil.searchConfig.searchObj.companyName? pageUtil.searchConfig.searchObj.companyName : null,
                            //financialMarket : pageUtil.searchConfig.searchObj.financialMarket? pageUtil.searchConfig.searchObj.financialMarket : null,
                            operateMarket : pageUtil.searchConfig.searchObj.operateCode? pageUtil.searchConfig.searchObj.operateCode : null,
                            storeHypId    : this.tempSearchStoreKeyWord? this.tempSearchStoreKeyWord : null,
                            pageIndex     : this.searchStoreScrollPageIndex,
                            pageSize      : 20,
                            judgePermission : true
                        };
                        api.getSelectSearchCondition(param,function(res){
                            if(res.code === 200){
                                searchStoreConfig.opts = searchStoreConfig.opts.concat(res.data);
                            }else{
                                _self.searchStoreScrollFlag = false;
                            }
                        })
                    }
                }
            },
            searchStoreRemote(query){
                let _self = this;
                let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
                searchStoreConfig.remoteLoading = true;
                this.searchStoreScrollPageIndex = 1;
                this.tempSearchStoreKeyWord = query;
                this.searchStoreScrollFlag = true;
                if(JSON.stringify(this.searchStoreSelectObj) !== '{}'){
                    this.searchStoreSelectObj.scrollTop = 0;
                }
                let param = {
                    //companyCode     : pageUtil.searchConfig.searchObj.companyName? pageUtil.searchConfig.searchObj.companyName : null,
                    //financialMarket : pageUtil.searchConfig.searchObj.financialMarket? pageUtil.searchConfig.searchObj.financialMarket : null,
                    operateMarket : pageUtil.searchConfig.searchObj.operateCode? pageUtil.searchConfig.searchObj.operateCode : null,
                    storeHypId    : query,
                    pageIndex     : this.searchStoreScrollPageIndex,
                    pageSize      : 20,
                    judgePermission : true
                };
                api.getSelectSearchCondition(param,function(result){
                    searchStoreConfig.remoteLoading = false;
                    if(result.code == 200){
                        searchStoreConfig.opts = [];
                        searchStoreConfig.opts = searchStoreConfig.opts.concat(result.data);
                    }else if(result.code == 404){
                        searchStoreConfig.opts = [];
                        pageUtil.searchConfig.searchObj.storeCode = '';
                    }
                })
            },
            beforeUpload(file) {
                let _self = this;
                this.loadFile = true;
                let dataUploadUrl = _self.fileObjTemp.id == 'dataUpload'? ip.store + '/boh-bill-result/upload?ignoreNoCode='+_self.ignoreNoCode : ip.store + '/file-upload/attachment?source=cashadetail&foreignId=' + _self.fileObjTemp.id;
                let Xls = file.name.split('.');
                const isLt50M = file.size / 1024 / 1024 <= 50;
                if(_self.fileObjTemp.id == 'dataUpload' && (Xls[Xls.length - 1] != 'xls'&& Xls[Xls.length - 1] != 'xlsx')){
                    this.common.messageUtil({
                        message: '上传文件只能是 xls/xlsx 格式!',
                        type: 'warning'
                    });
                    this.resetDataUploadForm();
                    return false;
                }
                if(_self.fileObjTemp.id == 'dataUpload' &&  !isLt50M){
                    this.common.messageUtil({
                        message: '不能超过50M',
                        type: 'warning'
                    });
                    this.resetDataUploadForm();
                    return false
                }
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        _self.uploadUrl = dataUploadUrl
                        resolve()
                    })
                })
            },
            handlePreview(file) {
                console.log(file);
                let link = document.createElement('a');
                if(file.response && file.response.code == 200){
                    link.href = file.response.data.url;
                    link.download = file.response.data.name;
                }else if(file.url){
                    link.href = file.url;
                    link.download = file.name;
                }
                link.target = '_blank';link.click();
            },
            beforeRemove(file, fileList){
                return  this.$confirm(`确定移除 ${ file.name }？`);
            },
            //删除file
            handleRemove(file, fileList) {
                let _self = this;
                let param = this.common.formatPathParam({
                id : file.id
                })
                apiStore.deleteCheckAttachMent(param,function(res){
                _self.uploadDown = true;
                _self.fileCount  = fileList.length;
                //   _self.common.messageUtil({
                //   message: 'y',
                //   type: 'success'
                // });
                });
            },
            //上传成功
            uploadSucceed(response, file, fileList) {
                let _self = this;
                this.fileCount++;
                if(fileList.length == this.fileCount){
                this.loadFile = false;
                }
                this.uploadDown = true;
            },
            doDataUpload(){
                this.$refs.dataUploadForm.submit();
            },
            dataUploadSucceed(response, file, fileList) {
                let _self = this;
                if(response.code == 500){
                    if(response.msg.substring(0,4) == '数据异常'){
                        let tempFile = Object.assign({},file);
                        this.$confirm(response.msg + ',是否仍然导入?', '提示', {
                            confirmButtonText: '仍然导入',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.ignoreNoCode = 'true';
                            this.$nextTick(function (res) {
                                _self.$refs.dataUploadForm.$children[0].post(file.raw);
                            })
                        }).catch(() => {
                            this.resetDataUploadForm();
                            this.loadFile = false;
                        });
                    }else{
                        this.common.errorMessage(response.msg);
                        this.resetDataUploadForm();
                        this.loadFile = false;
                    }
                }else{
                    this.common.messageUtil({
                        message : '导入成功',
                        type    : 'success'
                    });
                    this.ignoreNoCode = 'false';
                    this.uploadDialogVisible = false;
                }
                //this.search();
            },
            dataUploadError(err, file, fileList) {
                if(err.msg.substring(0,4) == '数据异常'){
                    this.$confirm(response.msg + ',是否仍然导入?', '提示', {
                        confirmButtonText: '仍然导入',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.ignoreNoCode = 'true';
                        this.doDataUpload()
                    }).catch(() => {
                        // this.$message({
                        //     type: 'info',
                        //     message: '已取消删除'
                        // });
                    });
                }else{
                    this.common.errorMessage(err.msg);
                    this.loadFile = false;
                    this.$refs.dataUploadForm.clearFiles();
                }

            },
            resetDataUploadForm(){
                this.loadFile = false;
                this.$refs.dataUploadForm.clearFiles();
            },
            //附件弹框
            showAttachDialog(rowObj) {
                let _self = this;
                let param = this.common.formatPathParam({
                    foreignId : rowObj.id,
                    source    : 'cashadetail'
                });
                _self.fileObjTemp.id = rowObj.id;
                // apiStore.selectCurrentAttachments(param,function(res){
                //     _self.fileObjTemp.files = [];
                //     if(res.code === 200){
                //         _self.fileObjTemp.files = res.data.concat();
                //         _self.fileCount = res.data.length;
                //     }else{
                //         _self.fileCount = 0;
                //     }
                //     _self.attatchDialogVisible = true;
                // })
                this.fileObjTemp = Object.assign({},{
                    id    : rowObj.id,
                    files : []
                });
                this.fileObjTemp.files = rowObj.files.concat();
                this.fileCount = this.fileObjTemp.files.length;
                this.attatchDialogVisible = true;
            },
            attachDialogClosed(){
                this.fileObjTemp = Object.assign({},{
                    id    : '',
                    files : []
                });
                this.loadFile = false;
                // this.fileCount = 0;
                // if(this.uploadDown){
                //     this.uploadDown = false;
                //     this.getData();
                // }
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData();
                console.log(size);
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData();
                console.log(currentPage);
            },
            openRemarkEditDg(row,index) {
                this.remarkObj.id = row.id;
                this.remarkObj.remark = row.remark;
                this.tempDataIndex = index;
                this.remarkVisible = true;
            },
            sureIsRight() {
                this.$alert('确认审核通过吗？', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    center:true,
                    callback: action => {
                        // this.common.messageUtil({
                        //     type: 'info',
                        //     message: `action: ${ action }`
                        // });
                    }
                });
            },
            search(){
                this.currentPage = 1
                this.getData()
            },
            getData(){
                let _self = this;
                let pageParam = {
                    pageIndex : this.currentPage,
                    pageSize  : this.pageSize
                };
                let searchObj = Object.assign({},pageParam,pageUtil.searchConfig.searchObj);
                if(!searchObj.bizDateBegin || !searchObj.bizDateEnd){
                    this.common.messageUtil({
                        message: '请选营业日期',
                        type: 'warning'
                    });
                    return false;
                }
                if(!searchObj.fscActivityCode && !searchObj.operateCode && !searchObj.storeCode){
                    this.common.messageUtil({
                        message: '请至少输入要查询的活动名称或选择一个营运市场或餐厅编号',
                        type: 'warning'
                    });
                    return false;
                }
                let param = this.common.formatPathParam(searchObj);
                apiStore.getNoncashBohandBillList(param,function(result){
                    if(result.code == 200){
                        _self.dynamicData = result.data.list;
                        _self.totalRecords = result.data.totalRecords;
                    }else if(result.code === 404){
                        _self.dynamicData  = [];
                        _self.totalRecords = 0;
                    }else{
                        _self.dynamicData  = [];
                        _self.totalRecords = 0;
                        _self.common.errorMessage(result.msg);
                    }
                })
            },
            reprocessRefund(){
                let _self = this;
                let searchObj = Object.assign({},pageUtil.searchConfig.searchObj);
                if(!searchObj.bizDateBegin || !searchObj.bizDateEnd){
                    this.common.messageUtil({
                        message: '请选营业日期',
                        type: 'warning'
                    });
                    return false;
                }
                // if(!searchObj.storeCode){
                //     this.common.messageUtil({
                //         message: '请选餐厅',
                //         type: 'warning'
                //     });
                //     return false;
                // }
                let param = this.common.formatPathParam({
                    bizDateBegin : searchObj.bizDateBegin,
                    bizDateEnd   : searchObj.bizDateEnd,
                    storeCode    : searchObj.storeCode
                });
                apiStore.reprocessRefund(param,function(result){
                    if(result.code == 200){
                        _self.common.successMessage(result.data);
                    }else{
                        _self.common.errorMessage(result.msg);
                    }
                })
            },
            billtozero(){
                let _self = this;
                this.$confirm('认定置为0?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let pageParam = {
                        pageIndex : _self.currentPage,
                        pageSize  : _self.pageSize
                    };
                    let searchObj = Object.assign({},pageParam,pageUtil.searchConfig.searchObj);
                    apiStore.billtozero(_self.common.formatPathParam(searchObj),function (res) {
                        if(res.code === 200){
                            _self.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            _self.getData();
                        }else{
                            _self.common.messageUtil({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                }).catch(() => {
                });
            },
            //保存编辑
            saveRemark(){
                let _self = this;
                // if(!this.remarkObj.remark){
                //     _self.remarkVisible = false;
                //     return false;
                // }
                let param = this.common.formatPathParam(this.remarkObj);
                apiStore.saveNoncashBohandBillAdjustRemark(param,function(res){
                    if(res.code === 200){
                        _self.common.messageUtil({
                            message: '保存成功',
                            type: 'success'
                        });
                        _self.$set(_self.dynamicData[_self.tempDataIndex],'remark',_self.remarkObj.remark);
                        _self.remarkVisible = false;
                    }else{
                        _self.common.errorMessage(res.msg);
                    }
                })
            },
            remarkDialogClosed(){
                this.remarkObj = {
                    id     : '',
                    remark : ''
                };
            },
            //下载数据
            exportDetail(actType){
                let _self = this;
                let searchObj = Object.assign({},pageUtil.searchConfig.searchObj);
                if(!searchObj.bizDateBegin || !searchObj.bizDateEnd){
                    this.common.messageUtil({
                        message: '请选营业日期',
                        type: 'warning'
                    });
                    return false;
                }
                if(!searchObj.fscActivityCode && !searchObj.operateCode && !searchObj.storeCode){
                    this.common.messageUtil({
                        message: '请至少输入要查询的活动名称或选择一个营运市场或餐厅编号',
                        type: 'warning'
                    });
                    return false;
                }
                let requestPath = actType == 'download'? '/boh-bill-result/export' : '/boh-bill-result/download';
                let fileName    = actType == 'download'? '非现金活动BOH与第三方账单核对结果.xlsx' : 'BOH与账单核对结果差异.xlsx';
                apiStore.exportOrDownloadNoncashBohandBillCheckDetail(requestPath,searchObj,'application/vnd.ms-excel',function(res){
                    if(res.code){
                        _self.common.messageUtil({
                        message: res.msg,
                        type: 'warning'
                        });
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = fileName;
                        link.target = '_blank';link.click();
                    }
                })
            },
            importData(){
                this.fileObjTemp.id = 'dataUpload';
                this.uploadDialogVisible = true;
            },
            showDifferReason(row,index){
                this.differTitle = '营业日期：'+ row.bizDate +' 餐厅编号：'+ row.storeCode +' 活动名称：'+ row.fscActivityCode;
                this.gridData    = [];
                this.gridData    = row.cashaResults.concat();
                this.dialogTableVisible = true;
            },
            headerFn(row, rowIndex){
                return {
                    background:'#eae9e9'
                }
            },
            thFn(row, column, rowIndex, columnIndex){
                return {
                    background:'#eae9e9'
                }
            }
        }
    }

</script>

<style scoped>
  .textarea-remark{
    min-height:100px;
    width:90%;
    padding:8px;
  }
  .dialog-footer{
    text-align: center;
  }
  hr{
    height:20px;
    background:transparent;
    border:none;
  }
  h1{
    font-size:14px;
  }
  .el-table th, .el-table tr{
    background:transparent;
  }
</style>
