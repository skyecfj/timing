<template>
    <div class="BOHAbnormalTable">
        <tableOrigin
                :tableHead="tableHead"
                :selection="selection"
                :align="align"
                :dynamicData="dynamicData"
                ref="BOHAbnormalTable"
                :option="option"
                :operates="operates"
                @handleSizeChange ="handleSizeChange"
                @handleCurrentChange = "handleCurrentChange"
                @handleSelectionChange = "handleSelectionChange"
                :totalRecords="totalRecords"
                :pageIndex="pageIndex"
        >
        </tableOrigin>
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
        <el-dialog title="附件" :visible.sync="attatchDialogVisible" width="30%" :close-on-click-modal="false" @close="attachDialogClosed" >
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
                <!--<el-button size="small" type="primary" @click="attatchDialogVisible=false" v-if="showSureBtn" style="margin:0 auto;display: block">确定</el-button>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import tableOrigin from '../../originalTable'
    import api from '@/model/apidr'
    export default {
        name: "BOHAbnormalTable",
        components:{
            tableOrigin
        },
        props:['dynamicData','totalRecords','pageIndex'],
        data(){
            return {
                tableHead:[
                    {
                        label:'BOH异常分类',
                        prop:'excpCode'
                    },
                    {
                        label:'餐厅编号',
                        prop:'storeCode'
                    },
                    {
                        label:'营业日期',
                        prop:'bizDate'
                    },
                    {
                        label:'异常金额',
                        prop:'excpAmount'
                    },
                    {
                        label:'非现金金额',
                        prop:'actAmount'
                    },
                    {
                        label:'应存行金额',
                        prop:'savingAmount'
                    },
                    {
                        label:'备注',
                        prop:'remark',
                        edit:true,
                        formatter:(row)=>{
                            return row.remark?row.remark.length>8?row.remark.slice(0,8)+'...':row.remark:`编辑`
                        },
                        method:(key,row)=>{
                            this.remark = row.remark;
                            this.openDRemark(row.id);
                        }
                    },
                    // {
                    //     label:'状态',
                    //     prop:'excpStateStr',
                    // },
                    {
                        label:'确认无误',
                        edit:true,
                        emptyText:'确认',
                        method:(key,row)=>{
                            this.sureIsRight(row.id);
                        }
                    },
                    {
                        label:'附件',
                        edit:true,
                        formatter:(row)=>{
                            if(row.attachmentCount && row.attachmentCount.length>0 ){
                                // this.showSureBtn = false;
                                return '更改'
                            }else{
                                return '附件'
                            }
                        },
                        method:(key,row)=>{
                            this.showAttachDialog(row);
                        }
                    },
                    {
                        label:'操作',
                        edit:true,
                        singleMultiple:true,
                        list:[
                            {
                                label:'补录',
                                showItem:'cashaSupplementMain',
                                showFlag:false,
                                method:(key,row)=>{
                                    this.linkTo({
                                        id: row.cashaMainId,
                                        cashaSupplementMainId: row.draftMain ? row.draftMain.id : '',
                                        foreignId:row.id,
                                        storeCode: row.storeCode,
                                        bizDate: row.bizDate,
                                        storeName: row.storeName,
                                        // type:'cashAException'
                                    })
                                }
                            },
                            {
                                label:'查看',
                                showItem:'cashaSupplementMain',
                                showFlag:true,
                                method:(key,row)=>{
                                    this.linkTo({
                                        status: '2',
                                        id: row.cashaSupplementMain.id,
                                        foreignId:row.id,
                                        storeCode: row.storeCode,
                                        bizDate: row.bizDate,
                                        userName: row.userName,
                                        storeName:row.storeName,
                                        edit:'false',
                                        type:'cashAException'
                                    });
                                }
                            },
                            {
                                label:'审核',
                                showFn:(row)=>{
                                    return !!(this.bohSupplement && row.cashaSupplementMain);
                                },
                                method:(key,row)=>{
                                    this.linkTo({
                                        status: '1',
                                        id: row.cashaSupplementMain.id,
                                        foreignId:row.id,
                                        storeCode: row.storeCode,
                                        bizDate: row.bizDate,
                                        userName: row.userName,
                                        storeName:row.storeName,
                                        edit:'false',
                                        type:'cashAException'
                                    });
                                }
                            },
                        ],
                    },
                    {
                        label:'操作人',
                        prop:'userName'
                    },

                ],
                selection:true,
                align:'center',
                pageSizesList: [5,10,15,20,25],
                pageSize: 10,
                currentPage: 1,
                operates:{
                },
                option:{

                },
                remarkVisible:false,
                remark:'',
                loadFile:false,
                uploadUrl:'',
                fileObjTemp:{
                    files:[],
                    foreignId:'',
                    source:'cashaException'
                },
                attatchDialogVisible:false,
                fileCount:0,
                bohExceptionId:'',
                bohSupplement:false,
                // showSureBtn:false
            }
        },
        methods:{
            linkTo(param){
                this.$router.push({name:'additionalRecording',query:param})
            },
            handleSizeChange(size){
                this.pageSize = size;
                this.$emit('pageSize',size);
            },
            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.$emit('currentPage',currentPage);
            },
            handleSelectionChange(res){
                this.$emit('multipleDataSelected',res)
            },
            openDRemark(id){
                this.remarkVisible = true;
                this.bohExceptionId = id;
            },
            updateRemark(){
                let that = this;
                api.bohExceptionChangeRemark('?bohExceptionId='+this.bohExceptionId+'&remark='+this.remark,function(){
                    that.remarkVisible = false;
                    that.$emit('refreshList')
                })
            },
            sureIsRight(row) {
                let title = '',that = this;
                this.$confirm('确认该店天数据无误吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.validateRightData(row);
                }).catch(()=>{
                    this.common.messageUtil({
                        type: 'info',
                        message: '取消成功!'
                    });
                })
            },
            validateRightData(row){
                let that = this;
                api.bohExceptionConfirm({id:row},function(){
                    // that.searchData2();
                    that.$emit('refreshList')
                })
            },
            beforeUpload(file) {
                let _self = this;
                this.loadFile = true;
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        _self.uploadUrl =  '/fsc/store/file-upload/attachment?source=cashaException&foreignId=' + _self.fileObjTemp.foreignId
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
                this.fileCount++;
                if(response.code === 200){
                    if(fileList.length === this.fileCount){
                        this.loadFile = false;
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
                let _self  = this;
                this.loadFile = false;
                this.fileObjTemp = Object.assign(this.fileObjTemp,{
                    foreignId    : rowObj.id,
                    files : [],
                });
                let param = this.common.formatPathParam({
                    foreignId : rowObj.id,
                    source    : 'cashaException'
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
                        _self.fileCount = 0 ;
                    }
                })
            },
            attachDialogClosed(){
                this.fileObjTemp.files = [];
            },
        }
        ,
        mounted(){
            let arr = localStorage.getItem('permissionBtns');
            let that = this;
            if(arr && arr.length>0){
                arr.split(',').forEach(function (item,index) {
                    if(item === '3'){
                        that.bohSupplement = true;
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .btn-area{
        margin:10px 0 0;
        text-align: center;
    }
    .textarea-remark{
        min-height:100px;
        width:90%;
        padding:8px;
    }
</style>
