    <template>
    <div class="notUploadTable">
        <tableOrigin
                :tableHead="tableHead"
                :selection="selection"
                :align="align"
                :dynamicData="dynamicData"
                ref="notUploadTable"
                @handleSizeChange ="handleSizeChange"
                :totalRecords="totalRecords"
                @handleCurrentChange = "handleCurrentChange"
                @handleSelectionChange="handleSelectionChange"
                :pageIndex="pageIndex"
        >
        </tableOrigin>
        <el-dialog title="银行流水" :visible.sync="bankVisible"  width="800px" >
            <div class="search-content" >
                <div class="selectContent">
                    <div class="selectTitle">银行JDE号</div>
                    <el-input size="small" style="width:120px;" v-model.trim="bankJdeCode" @input="openBankList" clearable></el-input>
                </div>
                <div class="selectContent">
                    <div class="selectTitle">上账日期</div>
                    <el-date-picker
                            type="daterange"
                            v-model="bookDate"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            size="small"
                            @change="openBankList"
                    >
                    </el-date-picker>
                </div>
                <div class="selectContent">
                    <div class="selectTitle">金额</div>
                    <el-input size="small" style="width:80px;" v-model.trim="minAmount"   @change="openBankList"></el-input>
                    <span>-</span>
                    <el-input size="small" style="width:80px;" v-model.trim="maxAmount"  @change="openBankList"></el-input>
                </div>
            </div>
            <el-table :data="dialogBank" :cell-style="rowStyle"
                      border min-width="600px"
                      max-height="500"
                      v-loading
                      highlight-current-row
                      @current-change="dialogSelectChange"
                      style="padding: 10px 0 14px 0;"
                      :row-style="{cursor:'pointer'}"
            >
                <el-table-column type="index" width="60" header-align="center" label="序号"></el-table-column>
                <el-table-column property="bankJdeCode" label="银行JDE" width="250" header-align="center" ></el-table-column>
                <el-table-column property="bookDate" label="上账日期" width="200" header-align="center" ></el-table-column>
                <el-table-column property="amount" label="金额"  header-align="center" ></el-table-column>
            </el-table>
            <p class="btn-area">
                <el-button size="small"  type="success" class="findButt" @click="relevantCash">确认</el-button>
                <el-button size="small"  type="success" plain class="reSet" @click="bankVisible=false">取消</el-button>
            </p>
        </el-dialog>
        <el-dialog title="" :visible.sync="remarkVisible"  width="600px">
            <el-row>
                <el-col :span="4">备注</el-col>
                <el-col :span="20">
                    <textarea v-model="remark" class="textarea-remark"></textarea>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="btn-area">
                    <el-button size="small"  type="success" class="findButt" @click="updateRemark">确认</el-button>
                    <el-button size="small"  type="success" plain class="reSet" @click="remarkVisible=false">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="修改未上传原因" :visible.sync="reasonForNotUploadVisible"  width="400px">
            <el-row>
                <el-col :span="6">未上传原因</el-col>
                <el-col :span="18">
                    <el-select v-model="changeNotUploadReasonDto.reason">
                        <el-option value="">请选择</el-option>
                        <el-option v-for="item in modifiedReason" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <strong class="warn-word">*临时停业和系统故障需TL审核</strong>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="btn-area">
                    <el-button size="small" type="primary" @click="isAttachView = false;showAttachDialog(tempRowObj)">上传附件</el-button>
                    <el-button size="small"  type="success" class="findButt" @click="saveReason">确认</el-button>
                    <el-button size="small"  type="success" plain class="reSet" @click="reasonForNotUploadVisible=false">取消</el-button>
                </el-col>
            </el-row>

        </el-dialog>
        <el-dialog  title="附件" :visible.sync="attatchDialogVisible" width="30%" :close-on-click-modal="false" @close="attachDialogClosed"
                    :custom-class="isAttachView ? 'view-file-dialog' : 'upload-file-dialog'" >
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
                    <el-button v-if="!isAttachView"  size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
                <!--<el-button size="small" type="primary" @click="attatchDialogVisible=false" v-if="showSureBtn" style="margin:0 auto;display: block">确定</el-button>-->
            </div>
        </el-dialog>
        <el-dialog title="查看原因" :visible.sync="viewSupplement"  width="600px">
            <el-row :gutter="20">
                <el-col :span="6" :offset="6">未上传原因</el-col>
                <el-col :span="6" >
                   <span >{{viewReason}}</span>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6" :offset="6">状态</el-col>
                <el-col :span="6" >
                    <span>{{status}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="btn-area">
                    <el-button size="small"  type="success" class="findButt" @click="updateStatus()" v-if="rejectBtn">撤回</el-button>
                    <el-button size="small"  type="success" plain class="reSet" @click="viewSupplement=false">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="通过/退回" :visible.sync="reasonForVisible"  width="600px">
            <el-row>
                <el-col :span="4">退回理由</el-col>
                <el-col :span="20">
                    <textarea v-model="rejectReason" class="textarea-remark"></textarea>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-radio v-model="radio" :label="1">通过</el-radio>
                    <el-radio v-model="radio" :label="2">退回</el-radio>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="btn-area">
                    <el-button size="small"  type="success" class="findButt" @click="updateStatus(radio)" v-if="radio">确认</el-button>
                    <el-button size="small"  type="success" plain class="reSet" @click="reasonForVisible=false">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
    import tableOrigin from '../../originalTable'
    import api from '../../../../../model/apidr'
    export default {
        name: "notUploadTable",
        components:{
            tableOrigin
        },
        props:['dynamicData','totalRecords','pageIndex'],
        data(){
            return {
                tableHead:[
                    {
                        label:'餐厅编号',
                        prop:'storeCode'
                    },
                    {
                        label:'营业日期',
                        prop:'bizDate'
                    },
                    {
                        label:'BOH滞后天数',
                        prop:'bohDelayedSavingDate'
                    },
                    {
                        label:'非现金账单金额',
                        prop:'unCashAmount'
                    },
                    {
                        label:'现金存行金额',
                        prop:'cashAmount'
                    },
                    {
                        label:'应存行日期',
                        prop:'savingDate'
                    },
                    {
                        label:'实存行日期',
                        prop:'savingConfirmDate'
                    },
                    {
                        label:'滞后存行天数',
                        prop:'delayedSavingDate'
                    },
                    {
                        label:'未上传原因',
                        prop:'nodataResult'
                    },
                    {
                        label:'备注',
                        edit:true,
                        prop:'remark',
                        formatter:(row)=>{
                            return row.remark?row.remark.length>8?row.remark.slice(0,8)+'...':row.remark:`编辑`
                        },
                        method:(key,row,prop)=>{
                            this.remark = prop;
                            this.cashMainId = row.id;
                            this.openDRemark();
                        }
                    },
                    {
                        label:'应报备层级',
                        prop:'notifyDepartmentName'
                    },
                    {
                        label:'状态',
                        prop:'reportStateMsg'
                    },
                    {
                        // level:2,
                        multiple:true,
                        label:'操作',
                        prop:'',
                        columns:[
                            {
                                label:'关联现金',
                                prop:'relatedBank',
                                edit:true,
                                formatter:(row)=>{
                                    if(row.relatedBank){
                                        return `撤销关联`;
                                    }else{
                                        return `关联现金`;
                                    }
                                },
                                method:(key,row,formattered)=>{
                                    if(formattered === '关联现金'){
                                        this.openDBank(row.id);
                                    }else if(formattered === '撤销关联'){
                                        this.withdrawDialog(row.id);
                                    }
                                }
                            },
                            {
                                label:'附件',
                                edit:true,
                                formatter:(row)=>{
                                    if (row.attachmentCount && row.attachmentCount>0){
                                        // this.showSureBtn = false;
                                        return `附件`;
                                    }else{
                                        return `暂无附件`;
                                    }
                                },
                                method:(key,row,formattered)=>{
                                    this.isAttachView = true;
                                    this.showAttachDialog(row);
                                }
                            },
                            {
                                label:'补录BOH',
                                edit:true,
                                type:'multiple',
                                list:[
                                    {
                                        label:'补录',
                                        // showItem:'supplementMain',
                                        // showFlag:false,
                                        showFn:(row)=>{
                                            return ! row.supplementMain;
                                        },
                                        method:(key,row)=>{
                                            this.linkTo({
                                                id: row.id,
                                                cashaSupplementMainId: row.draftMain ? row.draftMain.id : '',
                                                storeCode: row.storeCode,
                                                bizDate: row.bizDate,
                                                storeName: row.storeName,
                                                edit:'true',
                                                type:'notUploadSupplement'
                                            });
                                        }
                                    },
                                    {
                                        label:'查看',
                                        // showItem:'supplementMain',
                                        // showFlag:true,
                                        showFn:(row)=>{
                                            return !! row.supplementMain;
                                        },
                                        method:(key,row)=>{
                                            this.linkTo({
                                                status: '2',
                                                id: row.supplementMain.id,
                                                foreignId:row.id,
                                                storeCode: row.storeCode,
                                                bizDate: row.bizDate,
                                                userName: row.userName,
                                                storeName:row.storeName,
                                                edit:'false',
                                                type:'notUploadSupplement'
                                            });
                                        }
                                    },
                                    {
                                        label:'审核',
                                        showFn:(row)=>{
                                          return !!(this.bohSupplement && row.supplementMain);
                                        },
                                        method:(key,row)=>{
                                            this.linkTo({
                                                status: '1',
                                                id: row.supplementMain.id,
                                                foreignId:row.id,
                                                storeCode: row.storeCode,
                                                bizDate: row.bizDate,
                                                userName: row.userName,
                                                storeName:row.storeName,
                                                edit:'false',
                                                type:'notUploadSupplement'
                                            });
                                        }
                                    },
                                ],
                            },
                            {
                                label:'修改原因',
                                prop:'nodataResult',
                                edit:true,
                                type:'multiple',
                                list:[
                                    {
                                        label:'编辑',
                                        // showItem:'nodataMain',
                                        showFn:(row)=>{
                                            return !!(row.nodataResult !== '手工删除' && !row.nodataMain);
                                        },
                                        method:(key,row)=>{
                                            this.openReasonModify(row);
                                        }
                                    },
                                    {
                                        label:'查看',
                                        // showItem:'nodataMain',
                                        // showFlag:true,
                                        showFn:(row)=>{
                                            return !!row.nodataMain;
                                        },
                                        method:(key,row)=>{
                                            this.viewReason = row.nodataMain.description;
                                            this.viewSupplement = true;
                                            this.status = '审核中';
                                            if(row.nodataMain){
                                                this.rejectBtn = true;
                                                this.auditId = row.nodataMain.id;
                                            }else if(row.nodataMain){
                                                this.rejectBtn = false;
                                            }
                                        }
                                    },
                                    {
                                        label:'审核',
                                        showFn:(row)=>{
                                            return !!(this.reasonAudit && row.nodataMain);
                                        },
                                        method:(key,row)=>{
                                            this.auditId = row.nodataMain.id;
                                            this.radio = null;
                                            this.reasonForVisible = true;
                                        }
                                }],
                            },
                        ]
                    },
                    {
                        label:'操作人',
                        prop:'userName'
                    },

                ],
                selection:true,
                align:'center',
                bankVisible:false,
                dialogBank:[],
                multipleSelect:[],
                // dialogMultipleSelect:[],
                remarkVisible:false,
                remark:'',
                reasonForNotUploadVisible:false,
                modifiedReason:[
                    '临时停业',
                    '系统故障',
                    // '主档未更新',
                    '主档未更新-已关店',
                    '主档未更新-未开店',
                    '主档未更新-IE期间停业&problem store停业'
                ],
                reason:'',
                loadFile:false,
                uploadUrl:'',
                fileObjTemp:{
                    files:[],
                    foreignId:'',
                    source:'notUpload'
                },
                attatchDialogVisible:false,
                fileCount:0,
                bankJdeCode:'',
                bookDate:[],
                minAmount:null,
                maxAmount:null,
                bankStatementId:'',
                relatedBankDto:{
                    bankStatementId:'',
                    cashaMainId:''
                },
                viewSupplement:false,
                viewReason:'2122',
                status:'32323',
                changeNotUploadReasonDto:{
                    reason:'',
                    cashaMainId:''
                },
                auditId:'',
                cashMainId:'',
                // showSureBtn:false,
                reasonForVisible:false,
                radio:null,
                rejectReason:'',
                rejectBtn:false,
                reasonAudit:false,
                bohSupplement:false,
                tempRowObj:{},
                isAttachView:false
            }
        },
        methods:{
            handleSizeChange(size){
                this.$emit('pageSize',size)
            },
            handleCurrentChange(currentPage){
                this.$emit('currentPage',currentPage)
            },
            handleSelectionChange(res){
                this.$emit('multipleDataSelected',res)
            },
            withdrawDialog(id) {
                let title = '',sureToDo;
                // if(type === '撤销关联'){
                //     title = '确认撤销关联吗?';
                    sureToDo = this.recallBank;
                // }else if(type === '撤回'){
                //     title = '确认撤回提交的补录审核吗';
                //     sureToDo = this.recallAddition
                // }
                this.$confirm('确认撤销关联吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sureToDo(id);
                    // this.common.messageUtil({
                    //     type: 'success',
                    //     message: '撤回成功!'
                    // });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消撤回'
                    });
                });
            },
            linkTo(param){
                this.$router.push({name:'additionalRecording',query:param})
            },
            openDBank(id){
                this.relatedBankDto.cashaMainId = id;
                this.openBankList();
                this.bankJdeCode = '';
                this.bookDate = [];
                this.minAmount = '';
                this.maxAmount = '';
                this.bankVisible = true;
                this.relatedBankDto.bankStatementId = '';
            },
            rowStyle(){
                return {
                    'text-align':'center'
                }
            },
            // searchBankD(){
            //
            // },
            recallAddition(){
                console.log('确认撤回补录')
            },
            recallBank(id){
                let that = this;
                api.cancelRelatedCash({cashaMainId:id},function(res){
                    that.$emit('refreshList')
                })
                console.log('确认撤销现金')
            },
            relevantCash(){
                let that = this;
                if(this.relatedBankDto.bankStatementId){
                    api.relatedCash(this.relatedBankDto,function(res){
                        that.$emit('refreshList')
                    })
                    this.bankVisible = false;
                }else{
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择现金金额'
                    })
                }
            },
            dialogSelectChange(val){
                if(val){
                    this.relatedBankDto.bankStatementId = val.id;
                }
            },
            openDRemark(){
                this.remarkVisible = true;
            },
            updateRemark(){
                this.remarkVisible = false;
                let that = this;
                api.modifyRemark('?cashaMainId='+this.cashMainId+'&remark='+this.remark,function(res){
                    that.$emit('refreshList')
                })
            },
            openReasonModify(rowObj){
                this.reasonForNotUploadVisible = true;
                this.changeNotUploadReasonDto.cashaMainId = rowObj.id;
                this.tempRowObj = Object.assign({},rowObj);
            },
            saveReason(id){
                let that = this;
                api.modifyReason(this.changeNotUploadReasonDto,function(res){
                    that.$emit('refreshList')
                    that.changeNotUploadReasonDto.reason = '';
                    that.reasonForNotUploadVisible = false;
                })
            },
            beforeUpload(file) {
                let _self = this;
                this.loadFile = true;
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        _self.uploadUrl =  '/fsc/store/file-upload/attachment?source=notUpload&foreignId=' + _self.fileObjTemp.foreignId
                        resolve()
                    })
                })
            },
            handlePreview(file) {
                let link = document.createElement('a');
                if(file.response && file.response.code === 200){
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
                api.deleteCheckAttachMent(param,function(res){
                    _self.fileCount  = fileList.length;
                });
            },
            //上传成功
            uploadSucceed(response, file, fileList) {
                // this.fileCount++;
                // if(fileList.length === this.fileCount){
                //     this.loadFile = false;
                // }
                let that = this;
                this.fileCount++;
                if(response.code === 200){
                    if(fileList.length === this.fileCount){
                        this.loadFile = false;
                        that.$emit('refreshList')
                        // this.showSureBtn = true;
                    }
                }else{
                    this.loadFile = false;
                    this.common.messageUtil({
                        type:'error',
                        message:response.msg
                    })
                }
            },
            //附件弹框
            showAttachDialog(rowObj) {
                if(this.isAttachView && !rowObj.attachmentCount){
                    return false;
                }
                let _self  = this;
                _self.loadFile = false;
                this.fileObjTemp = Object.assign(this.fileObjTemp,{
                    foreignId    : rowObj.id,
                    files : [],
                });
                let param = this.common.formatPathParam({
                    foreignId : rowObj.id,
                    source    : 'notUpload'
                });
                api.selectFiles(param,function(res){
                    if(res.code === 200){
                        _self.fileObjTemp.files = [];
                        _self.fileObjTemp.files = res.data.concat();
                        _self.attatchDialogVisible = true;
                        _self.fileCount = _self.fileObjTemp.files.length;
                    }else {
                        _self.fileObjTemp.files = [];
                        _self.attatchDialogVisible = true;
                        _self.fileCount = 0;
                    }
                })
            },
            attachDialogClosed(){
                this.fileObjTemp.files = [];
            },

            openBankList(){
                let that = this;
                if(isNaN(this.minAmount) || isNaN(this.maxAmount)){
                    this.common.messageUtil(
                        {
                            type:'warning',
                            message:'请输入正确的数字！'
                        }
                    )
                    return;
                }
                if(this.minAmount &&this.maxAmount && Number(this.minAmount)>Number(this.maxAmount)){
                    this.common.messageUtil(
                        {
                            type:'warning',
                            message:'请输入正确的数字区间！'
                        }
                    )
                    return;
                }
                let param = this.common.joinSearchParam([
                    {
                        value:this.bankJdeCode,
                        name:'bankJdeCode'
                    },
                    {
                        value:1,
                        name:'pageIndex'
                    },
                    {
                        value:50,
                        name:'pageSize'
                    },
                    {
                        value:this.bookDate?this.bookDate[0]:'',
                        name:'bookDateBegin',
                    },
                    {
                        name:'bookDateEnd',
                        value:this.bookDate?this.bookDate[0]:'',
                    },
                    {
                        value:this.minAmount,
                        name:'minAmount',
                    },
                    {
                        name:'maxAmount',
                        value:this.maxAmount,
                    },
                    {
                        name:'cashaMainId',
                        value:this.relatedBankDto.cashaMainId
                    }
                ]);
                that.dialogBank = [];
                api.getBankStatementDetailNoLoading(param,true,function(res){
                    if(res.code === 200){
                        that.dialogBank = res.data.list;
                    }
                })
            },
            updateStatus(param){
                let that = this;
                if(!param){
                    this.$confirm('确认撤回吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        api.auditInNotUpload({
                            auditState:2,
                            id:that.auditId,
                        },function(){
                            that.$emit('refreshList');
                            that.auditState = null;
                            that.rejectReason = '';
                            that.viewSupplement = false;
                        })
                    }).catch(() => {
                        this.common.messageUtil({
                            type: 'info',
                            message: '已取消撤回'
                        });
                    });
                }else{
                    api.auditInNotUpload({
                        auditState:param,
                        id:that.auditId,
                        remark:this.rejectReason
                    },function(){
                        that.reasonForVisible = false;
                        that.auditState = null;
                        that.rejectReason = '';
                        that.$emit('refreshList');
                    })
                }
            },
        },
        mounted(){
            let arr = localStorage.getItem('permissionBtns');
            let that = this;
            if(arr && arr.length>0){
                arr.split(',').forEach(function (item,index) {
                    if(item === '2'){
                        that.reasonAudit = true;
                    }
                    if(item === '3'){
                        that.bohSupplement = true;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .textarea-remark{
        min-height:100px;
        width:90%;
        padding:8px;
    }
    .warn-word{
        color:orange;
        display: block;
        margin:5px 0;
    }
    .el-row {
        margin-bottom: 20px;
    }
    .btn-area{
        /*margin:10px 0 0;*/
        margin-top:10px;
        text-align: center;
    }
</style>
