<template>
    <div class="billShouldButNot">
        <tableOrigin
                :tableHead="tableHead"
                :align="align"
                :dynamicData="dynamicData"
                ref="billShouldButNot"
                :operates="operates"
                @handleSizeChange ="handleSizeChange"
                @handleCurrentChange = "handleCurrentChange"
                :totalRecords="totalRecords"
                :pageIndex="pageIndex"
        >
        </tableOrigin>
        <el-dialog title="" :visible.sync="remarkVisible"  width="600px">
            <el-form :model="dialogForm" ref="dialogForm" >
                <el-form-item label="原因" >
                    <textarea v-model="dialogForm.reason"
                              class="textarea-remark"
                              autocomplete="off"
                              :disabled="dialogForm.isNotTrade===1"></textarea>
                </el-form-item>
                <el-form-item label="附件" >
                    <el-upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-preview ="handlePreview"
                            :on-success ="uploadSucceed"
                            :on-remove ="handleRemove"
                            :before-upload="beforeUpload"
                            :before-remove="beforeRemove"
                            :file-list="fileObjTemp.files"
                            v-if="dialogForm.isNotTrade ===0"
                           >
                        <el-button size="small" type="primary" plain>上传</el-button>
                        <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                    </el-upload>
                    <el-button size="small" type="primary" plain v-if="dialogForm.isNotTrade ===1 && attachment" @click="download">下载</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  type="success" class="findButt" @click="updateRemark('dialogForm')">确认</el-button>
                <el-button size="small"  type="success" plain class="reSet" @click="remarkVisible=false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" :visible.sync="remarkVisible2"  width="600px">
            <el-row>
                <el-col :span="4">备注</el-col>
                <el-col :span="20">
                    <textarea v-model="remarkObj.remark" class="textarea-remark"></textarea>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="btn-area">
                    <el-button size="small"  type="success" class="findButt" @click="updateRemark2">确认</el-button>
                    <el-button size="small"  type="success" plain class="reSet" @click="remarkVisible2=false">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <!--<el-dialog title="" :visible.sync="reImport"  width="600px">-->
                    <!--<el-upload-->
                            <!--class="upload-demo"-->
                            <!--:action="uploadUrl"-->
                            <!--:on-preview ="handlePreview"-->
                            <!--:on-success ="uploadSucceed"-->
                            <!--:on-remove  ="handleRemove"-->
                            <!--multiple :before-upload="beforeUpload"-->
                            <!--:before-remove="beforeRemove"-->
                            <!--:file-list="fileObjTemp.files"-->
                    <!--&gt;-->
                        <!--<el-button size="small" type="primary" plain>上传</el-button>-->
                        <!--&lt;!&ndash;<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>&ndash;&gt;-->
                    <!--</el-upload>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button size="small"  type="success" class="findButt" @click="updateRemark('dialogForm')">确认</el-button>-->
                <!--<el-button size="small"  type="success" plain class="reSet" @click="reImport=false">取消</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    import tableOrigin from '../../originalTable'
    import api from '@/model/apidr'
    export default {
        name: "billShouldButNot",
        components: {
            tableOrigin
        },
        props:['dynamicData','totalRecords','pageIndex'],
        data() {
            return {
                tableHead: [
                    {
                        label: '账单名称',
                        prop: 'billConfigItemName'
                    },
                    {
                        label: '活动名称',
                        prop: 'activityName',
                    },
                    {
                        label: '法人公司',
                        prop: 'companyName'
                    },
                    {
                        label: '品牌',
                        prop: 'brand'
                    },
                    {
                        label: '交易日期',
                        prop: 'tradeDate'
                    },
                    {
                        label: '频率',
                        prop: 'frequency'
                    },
                    {
                        label: '账单获取方式',
                        prop: 'getWay'
                    },
                    {
                        label: '活动机制',
                        prop: 'activityMechanism',
                        edit: true,
                        showTooltip:true,
                        formatter:(row)=>{
                          return  row['activityMechanism'].length>6? row['activityMechanism'].slice(0,6)+'...':row['activityMechanism']
                        },
                        method: (key, row) => {
                            this.sureIsRight(row.activityMechanism);
                        }
                    },
                    {
                        label:'备注',
                        edit:true,
                        prop:'memo',
                        formatter:(row)=>{
                            return row.memo?row.memo.length>8?row.memo.slice(0,8)+'...':row.memo:`编辑`
                        },
                        method:(key,row,prop)=>{
                            this.remarkVisible2 = true;
                            this.remarkObj.id = row.id
                            this.remarkObj.remark = row.memo
                        }
                    },
                    {
                        label: '确认有无交易',
                        edit: true,
                        formatter:(row)=>{
                           switch(row.isNotTrade){
                               case 0:return '确认';
                               case 1:return '查看';
                               default:return;
                           }
                        },
                        method: (index, row) => {
                            this.dialogForm.reason = row.reason;
                            this.dialogForm.id = row.id;
                            this.dialogForm.isNotTrade = row.isNotTrade;
                            this.billConfigName = row.billConfigItemName;
                            this.attachment = row.attachment;
                            this.openDRemark(row);
                        }
                    },

                ],
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                // currentPage: 1,
                option: {},
                remarkVisible: false,
                remarkObj:{
                    remark: '',
                    id:''
                },
                operates:{
                    width: 150,
                    fixed: 'right',
                    list: [
                        {
                            label: '补导',
                            show:true,
                            link:true,
                            showFn:(row)=>{
                                return row.supplemented === 0
                            },
                            linkClass:'linkClass',
                            method: (index, row) => {
                                this.openReimportDg(row);
                            }
                        },
                    ]
                },
                fileList:[],
                dialogForm:{
                    reason:'',
                },
                reImport:false,
                loadFile:false,
                uploadUrl:'',
                fileObjTemp:{
                    files:[],
                    foreignId:'',
                    source:'notUpload'
                },
                fileCount:0,
                attachment:'',
                billConfigName:'',
                remarkVisible2:false

            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.$emit('pageSize',{size:size,type:1});
            },
            handleCurrentChange(currentPage) {
                // this.currentPage = currentPage;
                this.$emit('pageIndex',{'currentPage':currentPage,'type':1});
            },
            openDRemark(row) {
                this.remarkVisible = true;
            },
            openReimportDg(row){
                let that = this;
                this.$confirm('确认补导吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.batchAcquire({
                        "billName": row.billConfigItemName,
                        "id": row.billActivityMasterId,
                        "startTime": row.tradeDate
                    },function(res){
                        that.$emit('refreshList')
                    })
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消补导'
                    });
                });
            },
            updateRemark(dialogForm) {
                let that = this;
                this.remarkVisible = false;
                this.dialogForm.attachment = this.attachment;
                this.dialogForm.isNotTrade = 1;
                api.sureIsOrNotTrade(this.dialogForm,function(){
                    that.$emit('refreshList')
                })
            },
            sureIsRight(title) {
                this.$alert(title, {
                    confirmButtonText: '确定',
                    center:true,
                    callback: action => {
                        // this.common.messageUtil({
                        //     type: 'info',
                        //     message: `action: ${ action }`
                        // });
                    }
                });
            },
            // handleRemove(file, fileList) {
            //     console.log(file, fileList);
            // },
            // handlePreview(file) {
            //     console.log(file);
            // },
            handleRemoveImport(file, fileList) {
            },
            handlePreviewImport(file) {
            },
            validateRightData(title) {
                this.common.messageUtil({
                    type: 'success',
                    message: '确认成功!'
                });
            },
            beforeUpload(file) {
                let _self = this;
                this.loadFile = true;
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        _self.uploadUrl =  '/fsc/store/should-improted-but-not/upload'
                        resolve()
                    })
                })
            },
            handlePreview(file) {
                // let link = document.createElement('a');
                // if(file.response && file.response.code === 200){
                //     link.href = file.response.data.url;
                //     link.download = file.response.data.name;
                // }else if(file.url){
                //     link.href = file.url;
                //     link.download = file.name;
                // }
                // link.target = '_blank';link.click();
            },
            beforeRemove(file, fileList){
                return  this.$confirm(`确定移除 ${ file.name }？`);
            },
            //删除file
            handleRemove(file, fileList) {
                // let _self = this;
                // let param = this.common.formatPathParam({
                //     id : file.id
                // })
                // api.deleteCheckAttachMent(param,function(res){
                //     _self.fileCount  = fileList.length;
                // });
            },
            //上传成功
            uploadSucceed(response, file, fileList) {
                if(response.code !== 200){
                    this.common.messageUtil({
                        type:'error',
                        message:response.msg
                    })
                }
                this.attachment = response.data;
            },
            //附件弹框
            showAttachDialog(rowObj) {
                // let _self  = this;
                // this.fileObjTemp = Object.assign(this.fileObjTemp,{
                //     foreignId    : rowObj.id,
                //     files : [],
                // });
                // let param = this.common.formatPathParam({
                //     foreignId : rowObj.id,
                //     source    : 'notUpload'
                // });
                // api.selectCurrentAttachments(param,function(res){
                //     if(res.code === 200){
                //         _self.fileObjTemp.files = [];
                //         _self.fileObjTemp.files = res.data.concat();
                //         _self.attatchDialogVisible = true;
                //         _self.fileCount = this.fileObjTemp.files.length;
                //     }else {
                //         _self.fileObjTemp.files = [];
                //         _self.attatchDialogVisible = true;
                //     }
                // })
            },
            attachDialogClosed(){
                this.fileObjTemp.files = [];
            },
            download(){
                let that = this;
                api.downloadShouldImportedButNot('?url='+this.attachment+'&fileName='+this.billConfigName,
                    'application/vnd.ms-excel',function (res) {
                    that.common.exportTemplate('第三方账单应导入而未导入.xlsx',res);
                })
            },
            updateRemark2(){
                api.updateMemo('?id='+this.remarkObj.id+'&memo='+encodeURIComponent(this.remarkObj.remark),()=>{
                    this.remarkVisible2 = false;
                    this.$emit('refreshList');
                });
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
    .offsetTop{
        margin-top:15px;
    }
    .btn-area{
        margin:10px 0 0;
        text-align: center;
    }
    .center-word{
        text-align:center;
        font-size:16px;
    }
</style>
