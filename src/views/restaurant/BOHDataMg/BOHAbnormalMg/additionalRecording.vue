<!--补录页面--->
<template>
    <div class="additional-recording">
        <div class="content">
            <el-row :gutter="24" class="dynamic-word" >
                <el-col :span="8" class="font14">餐厅编号 : {{$route.query.storeCode}}</el-col>
                <el-col :span="8" class="font14">餐厅名称 : {{$route.query.storeName}}</el-col>
                <el-col :span="8" class="font14">营业日期 : {{$route.query.bizDate}}</el-col>
            </el-row>
            <el-row :gutter="24" class="dynamic-word" v-if="$route.query.edit === 'false'">
                <el-col :span="8" class="font14">当前状态 : 待复核</el-col>
                <el-col :span="8" class="font14">提交人 : {{username}}</el-col>
            </el-row>
            <el-row :gutter="24" class="dynamic-file" v-if="files && files.length>0 && $route.query.edit === 'false'"><!--$route.query.edit === 'false' || -->
                <a class="link-blue" v-for="(item,index) in files" :href="item.url" target="_blank" >{{item.name}}</a>
            </el-row>
            <el-row class="dynamic-word offset-top" :gutter="24">
                <el-button size="small" @click="auditPass" class="c-button c-button--primary" v-if="$route.query.status === '1'">审核通过</el-button>
                <el-button size="small" @click="reject" class="c-button c-button--primary" v-if="$route.query.status === '1'">退回</el-button>
                <el-button size="small" @click="withdrawDialog" class="c-button c-button--primary" v-if="$route.query.status === '2'">撤回</el-button>
                <el-button size="small" @click="submit('save')" class="c-button c-button--primary" v-if="!$route.query.status">保存</el-button>
                <el-button size="small" @click="submit('submit')" class="c-button c-button--primary" v-if="!$route.query.status">提交</el-button>
                <el-button size="small" type="success" plain class="c-button" @click="reset" v-if="!$route.query.status">重置</el-button>
                <el-button size="small" @click="showAttachDialog" class="c-button c-button--primary" v-if="!$route.query.status">上传附件</el-button>
                <el-button size="small" @click="doUploadNonCashBill" class="c-button c-button--primary" v-if="!$route.query.status">导入非现金账单</el-button>
            </el-row>
        </div>
        <!--<tableOrigin-->
                <!--:tableHead="tableHead2"-->
                <!--style="width: 800px;margin: 0 auto;"-->
                <!--:align="align"-->
                <!--:dynamicData="dynamicDataSpaceChange"-->
                <!--ref="change"-->
                <!--size="medium"-->
                <!--:pageination="false"-->
                <!--:headerStyle="headerStyle"-->
                <!--:operates="operates"-->
        <!--&gt;-->
        <!--</tableOrigin>-->
        <el-table :data="dynamicDataSpaceChange" border
                  :header-cell-style="{ background:'#e2e2e2'}"
                  :cell-style="{ 'text-align': 'center'}" size="medium" align="center" ref="change" style="width: 800px;margin: 0 auto;">
            <el-table-column  header-align="center" label="FSC键位名称" >
                <template slot-scope="scoped">
                    <el-input v-if="$route.query.edit === 'false'" disabled v-model="scoped.row.keyInfo" clearable ></el-input>
                    <el-select v-else v-model="scoped.row.keyInfo" filterable >
                        <el-option value="">请选择</el-option>
                        <el-option v-for="(item,index) in options" :key="index" :value="item" :label="item">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="录入值"  header-align="center">
                <template slot-scope="scoped">
                    <el-input v-model.tirm="scoped.row.manualVal" size="small" :disabled="$route.query.edit === 'false'" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center" v-if="!$route.query.status">
                <template slot-scope="scoped">
                    <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="removeRow(scoped.row)">
                        <i class="el-icon-remove font18"></i>
                    </el-button>
                    <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="addRow(scoped.row)">
                        <i class="el-icon-circle-plus font18"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <hr class="separator">
        <tableOrigin
                :tableHead="tableHead"
                style="width: 800px;margin: 0 auto;"
                :align="align"
                :dynamicData="dynamicDataSpaceFix"
                ref="fix"
                size="medium"
                :pageination="false"
                :headerStyle="headerStyle"
        >
        </tableOrigin>
        <el-dialog title="" :visible.sync="rejectVisible"  width="600px">
            <el-row>
                <el-col :span="4">退回理由</el-col>
                <el-col :span="20">
                    <textarea v-model="rejectReason" class="textarea-remark"></textarea>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="btn-area">
                    <el-button size="small"  type="success" class="findButt" @click="updateReject">确认</el-button>
                    <el-button size="small"  type="success" plain class="reSet" @click="rejectVisible=false">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="附件" :visible.sync="attachment" width="30%" :close-on-click-modal="false" @close="attachDialogClosed" >
            <div  v-loading="loadFile"
                  element-loading-text = "上传中..."
                  element-loading-spinner = "el-icon-loading"
                  element-loading-background = "transparent">
                <el-upload  class="upload-demo"
                            :action="uploadUrl"
                            :on-preview ="handlePreview"
                            :on-success ="uploadSucceed"
                            :on-remove  ="handleRemove"
                            :on-error = "handleError"
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
    import tableOrigin from '../originalTable'
    import api from '../../../../model/apidr'
    export default {
        name: "additionalRecording",
        data(){
            return {
                tableHead:[
                    {
                        label:'键位信息',
                        prop:'activityName',
                    },
                    {
                        label:'录入值',
                        prop:'manualVal',
                        type:'input',
                        disabled:this.$route.query.edit === 'false'
                    }
                ],
                align:'center',
                dynamicDataSpaceFix:[],//含有固定数据项
                dynamicDataSpaceChange:[{
                    keyInfo:'',
                    manualVal:'',
                    index:0
                }],
                rejectReason:'',
                zIndex:0,
                rejectVisible:false,
                attachment:false,
                fileObjTemp:{
                    files:[],
                    foreignId:'',
                    source:this.$route.query.type==='cashAException'?'cashAException':'notUploadSupplement'
                },
                uploadUrl:'',
                loadFile:false,
                options:[],
                fileCount:0,
                files:[],
                username:'',
                edit : 'true'
            }
        },
        components:{
            tableOrigin
        },
        methods:{
            auditPass(){
                let that = this;
                this.$confirm('确认审核通过吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.auditOrReject(1)
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消审核'
                    });
                });
            },
            reject(){
                this.rejectVisible = true;
            },
            headerStyle({row, rowIndex}){
                return {
                    background:'#e2e2e2'
                }
            },
            upload(){

            },
            reset(){
                this.dynamicDataSpaceChange = [{
                    keyInfo:'',
                    manualVal:'',
                    index:0
                }],
                this.dynamicDataSpaceFix.forEach(function(item,index){
                    item.manualVal = '';
                });
            },
            submit(type){
                let that = this;
                let down = this.dynamicDataSpaceFix;
                let param = [];
                let up = this.common.arrayUnique(this,this.dynamicDataSpaceChange,'keyInfo');
                try{
                    down.forEach(function (item,index) {
                        item.manualVal = item.manualVal.replace(/,/gi,'');
                        if(isNaN(item.manualVal)){
                            throw new Error(item.activityName+'录入值:'+item.manualVal+'不正确！'+'请输入正确的数字！')
                        }
                        param.push({
                            bohConfirmAmount:item.manualVal||0,
                            cashaDetailType:2,
                            fscActivityCode:item.activityName
                        })
                    });
                } catch(e){
                    that.common.messageUtil({
                        type:'warning',
                        message:e.message
                    });
                    return;
                }

                if(up && up.length>0){
                    try{
                        up.forEach(function (item,index) {
                            item.manualVal = item.manualVal.replace(/,/gi,'');
                            if(isNaN(item.manualVal)){
                                throw new Error(item.keyInfo+'录入值:'+item.manualVal+'不正确！'+'请输入正确的数字！')
                            }
                            // if(type == 'submit' && !item.keyInfo && !item.manualVal){
                            //     throw new Error('输入FSC键位名称!')
                            // }
                            if(type == 'save'){
                                if(item.keyInfo){
                                    param.push({
                                        bohConfirmAmount:item.manualVal||0,
                                        cashaDetailType:1,
                                        fscActivityCode:item.keyInfo
                                    })
                                }
                            }else if(type == 'submit'){
                                param.push({
                                    bohConfirmAmount:item.manualVal||0,
                                    cashaDetailType:1,
                                    fscActivityCode:item.keyInfo
                                })
                            }
                        });
                    } catch(e){
                        that.common.messageUtil({
                            type:'warning',
                            message:e.message
                        });
                        return;
                    }

                }
                api.supplementSubmit({
                    'auditState' : type == 'save' ? -1 : 0,
                    'cashaMainId': this.$route.query.id,
                    'cashaSupplementDetails': param,
                    'source': that.$route.query.type === 'cashAException' ? 'cashaExceptionSup' : 'notUploadSupplement'
                },function(){
                    that.common.deleteTag(that.$route, that,'abnormalMg')
                })
            },
            updateReject(){
                this.auditOrReject(2)
            },
            cancel (param,) {
                this.common.deleteTag(this.$route, this, param);
            },
            withdrawDialog(type) {
                let that= this;
                this.$confirm('确认撤回提交的补录审核吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.auditInNotUpload({
                        auditState:3,
                        id:Number(that.$route.query.id),
                    },function(){
                        that.cancel('abnormalMg');
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消撤回'
                    });
                });
            },
            beforeUpload(file) {
                let _self = this;
                this.loadFile = true;
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        if(_self.$route.query.type === 'cashAException'){
                            _self.uploadUrl =  '/fsc/store/file-upload/attachment?source=cashaExceptionSup&foreignId=' + this.$route.query.id
                        }else{
                            _self.uploadUrl =  '/fsc/store/file-upload/attachment?source=notUploadSupplement&foreignId=' + this.$route.query.id
                        }
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
                api.deleteCheckAttachMent('?id='+file.id,res=>{
                    if(res.code === 200){
                        if(fileList){
                            this.fileCount  = fileList.length;
                        }
                    }
                });
            },
            //上传成功
            uploadSucceed(response, file, fileList) {
                this.fileCount++;
                if(response.code === 200){
                    if(fileList.length === this.fileCount){
                        this.loadFile = false;
                    }
                }else{
                    this.common.messageUtil({
                        type:'error',
                        message:response.msg
                    })
                }
            },
            handleError(err, file, fileList){
            },
            //附件弹框
            showAttachDialog() {
                let _self  = this;
                this.attachment = true;
                this.loadFile = false;
                this.fileObjTemp = Object.assign(this.fileObjTemp,{
                    foreignId    : this.$route.query.id,
                    files : [],
                });
                let param = this.common.formatPathParam({
                    foreignId : this.$route.query.id,
                    source    : this.$route.query.type==='cashAException'?'cashAException':'notUploadSupplement'
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
            doUploadNonCashBill(){
                let _self = this;
                let param = {
                    bizDate   : this.$route.query.bizDate,
                    storeCode : this.$route.query.storeCode
                }
                api.uploadNonCashBill(this.common.formatPathParam(param),function(res){
                    let cashaDetailCount = 0;
                    if(res.code === 200 && res.data && res.data.length>0){
                        _self.common.successMessage('导入成功');
                        let cashaSupplementDetails = res.data;
                        cashaDetailCount = _self.fillActivityDetails(cashaSupplementDetails,true);
                    }else if(res.data.length === 0){
                        _self.common.warningMessage('暂无数据')
                    }
                    // if(cashaDetailCount === 0){
                    //         _self.dynamicDataSpaceChange = [{
                    //         keyInfo:'',
                    //         manualVal:'',
                    //         index:0
                    //         }]
                    // }
                })
            },
            getAllActivityName(event){
                let that = this;
                event = event? '?storeCode='+this.$route.query.storeCode+'&keyValue='+event.target.value : '?storeCode='+this.$route.query.storeCode;
                api.selectKeyName(event,function (res) {
                    that.options = res.data;
                })
            },
            getData(id,foreignId,foreignType){
                let that = this;
                api.selectSupplementList('?cashaSupplementId='+id+'&foreignId='+foreignId+'&foreignType='+foreignType,function(res){
                    let cashaDetailCount = 0;
                    that.dynamicDataSpaceChange = [];
                    if(res.code === 200){
                        that.username = res.data.userName;
                        if ( res.data.cashaSupplementDetails.length > 0) {
                            let cashaSupplementDetails = res.data.cashaSupplementDetails;
                            cashaDetailCount = that.fillActivityDetails(cashaSupplementDetails);
                        }
                        if(res.data.files.length > 0){
                            that.files = res.data.files
                        }else{
                            that.files = [];
                        }
                        if((that.edit === 'true' && cashaDetailCount === 0) || (that.$route.query.type === 'cashAException' && cashaDetailCount === 0)){
                            that.dynamicDataSpaceChange = [{
                                keyInfo:'',
                                manualVal:'',
                                index:0
                            }]
                        }
                    }else{
                        that.dynamicDataSpaceChange = [{
                            keyInfo:'',
                            manualVal:'',
                            index:0
                        }]
                    }
                })
            },
            fillActivityDetails(cashaSupplementDetails,flag){
                let that = this;
                let cashaDetailCount = 0;
                let tempArr = [];
                cashaSupplementDetails.forEach(function (item, index) {
                    if (item.cashaDetailType === 2) {
                        if (item.bohConfirmAmount) {
                            that.dynamicDataSpaceFix.forEach(function (item1, index1) {
                                if (item1.activityName === item.fscActivityCode) {
                                    item1.manualVal = item.bohConfirmAmount;
                                }
                            })
                        }
                    }
                    if (item.cashaDetailType === 1) {
                        cashaDetailCount++;
                        tempArr.push({
                            keyInfo: item.fscActivityCode,
                            manualVal: item.bohConfirmAmount,
                            index:cashaDetailCount-1
                        })
                    }
                });
                if(flag && cashaDetailCount>0){
                    that.dynamicDataSpaceChange = tempArr;
                }else if(cashaDetailCount>0){
                    that.dynamicDataSpaceChange =  that.dynamicDataSpaceChange.concat(tempArr)
                }
                return cashaDetailCount
            },
            addRow(index){
                this.dynamicDataSpaceChange.push({ keyInfo:'', manualVal:''});
                this.dynamicDataSpaceChange[this.dynamicDataSpaceChange.length-1].index = ++this.zIndex;
            },
            removeRow(row){
                if(this.dynamicDataSpaceChange &&this.dynamicDataSpaceChange.length>1){
                    this.dynamicDataSpaceChange = this.dynamicDataSpaceChange.filter(x=>{
                        return x.index !== row.index;
                    })
                }
            },
            auditOrReject(type){
                let that = this;
                api.auditInNotUpload({
                    auditState:type,
                    id:Number(this.$route.query.id),
                    remark:this.rejectReason
                },function(){
                    that.cancel('abnormalMg');
                })
            },
            bohExceptionEdit(id){//boh 异常补录
                let that = this;
                api.bohExceptionEdit('?cashaMainId='+id,(res)=>{
                    if (res.code === 200 && res.data.length > 0) {
                        that.dynamicDataSpaceChange = [];
                        let num = -1;
                        res.data.forEach(function (item, index) {
                            if (item.cashaDetailType === 2) {
                                if (item.bohConfirmAmount) {
                                    that.dynamicDataSpaceFix.forEach(function (item1, index1) {
                                        if (item1.activityName === item.fscActivityCode) {
                                            item1.manualVal = item.bohConfirmAmount;
                                        }
                                    })
                                }
                            }
                            if (item.cashaDetailType === 1) {
                                num++;
                                that.dynamicDataSpaceChange.push({
                                    keyInfo: item.fscActivityCode,
                                    manualVal: item.bohConfirmAmount,
                                    index:num
                                })
                            }
                        });
                        if(that.$route.query.cashaSupplementMainId){
                            that.getData(that.$route.query.cashaSupplementMainId,that.$route.query.foreignId,'cashAException');
                        }else if(!that.$route.query.cashaSupplementMainId && num === -1){
                            that.dynamicDataSpaceChange = [{
                                keyInfo:'',
                                manualVal:'',
                                index:0
                            }]
                        }
                    }
                })
            },
            replaceToNumber(e){
                if (e) {
                    this.$nextTick(() => {
                        this.totalAmountS = e.replace(/[^\d|.]/g,'')
                    })
                }
            }
        },
        created(){
            let that = this;
            // items.items.forEach(function (item,index) {
            //     that.dynamicDataSpaceFix.push({activityName:item,manualVal:''})
            // });
            api.getCashaConfig(function (res) {
                if(res.code === 200){
                    res.data.forEach(function (item,index) {
                        that.dynamicDataSpaceFix.push({activityName:item,manualVal:''})
                    });
                }else{
                    that.dynamicDataSpaceFix = []
                }
            })

        },
        mounted(){
            this.getAllActivityName();
            let cashaSupplementId = '';
            let foreignId = '';
            this.edit = this.$route.query.edit;
            if(this.$route.query.edit === 'false'){
                cashaSupplementId = this.$route.query.id;
                foreignId = this.$route.query.foreignId;
            }else if(this.$route.query.edit === 'true'){
                cashaSupplementId = this.$route.query.cashaSupplementMainId;
                foreignId = this.$route.query.id;
            }
            if(this.$route.query.type === 'notUploadSupplement'){
                this.getData(cashaSupplementId,foreignId,'notUploadSupplement');
            }
            if(this.$route.query.type === 'cashAException'){
                this.getData(cashaSupplementId,foreignId,'cashAException');
            }
            if(this.$route.query.type === 'cashAException'){
                this.bohExceptionEdit(this.$route.query.id);
            }
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'abnormalMg';
            next();
        },
    }
</script>

<style lang="scss" scoped>
.additional-recording /deep/{
    .el-input.is-disabled{
        .el-input__inner {
            color: #000;
        }
    }
    .offset-top{
        margin-top:20px;
    }
    .separator{
        height:20px;
        border:none;
    }
    .textarea-remark{
        min-height:100px;
        width:90%;
        padding:8px;
    }
    .btn-area{
        margin:10px 0 0;
        text-align: center;
    }
    .dynamic-file{
        margin-top:20px;

    }
    .link-blue{
        color:-webkit-link;
        text-decoration: underline;
        display: inline-block;
        margin-left:10px;
        /*&:last-child{*/
            /*margin-right:0;*/
        /*}*/
    }
}
</style>
