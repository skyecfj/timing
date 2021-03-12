<!--券码sales变更-->
<template>
    <div class="salesUpdate">
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="3"><div class="font13">券码号</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="3">
                    <el-input size="small" v-model.trim="couponCode" placeholder="请输入"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button size="small" type="success" class="c-button" @click="getDataViewList">查询</el-button>
                    <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
                    <el-button size="small" type="success" @click="importFile" class="c-button"><i class="fa fa-upload c-button-icon--left"></i>上传</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <el-table :data="tableData" border class="viewTable">
                    <el-table-column prop="couponCode" label="券码号" sortable width="120"></el-table-column>
                    <el-table-column prop="operateDate" label="券码最后更新时间" sortable></el-table-column>
                    <el-table-column prop="sales" label="券码真实净值" width="100"></el-table-column>
                    <el-table-column prop="issuingUnit" label="发行单位"></el-table-column>
                    <el-table-column prop="reusableCount" label="可使用次数" width="80"></el-table-column>
                    <el-table-column prop="usedseqid" label="已使用次数" width="80"></el-table-column>
                    <el-table-column prop="orderId" label="订单号" width="120"></el-table-column>
                    <el-table-column prop="activityGroup" label="活动组"></el-table-column>
                    <el-table-column prop="brandName" label="品牌" sortable width="80"></el-table-column>
                    <el-table-column prop="incomeAmount" label="发券金额（净值）" width="80"></el-table-column>
                    <el-table-column prop="payoutAmount" label="退券金额（净值）" width="80"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
                    <el-table-column prop="createUser" label="创建人" sortable width="100"></el-table-column>
                <el-table-column width="80" prop="operate" label="操作" align="center" >
                    <template slot-scope="scope">
                            <el-button size="small"   @click="deleteRow(scope.row.id)" class="c-button-icon--danger--opacity c-button-icon-circle"><i class="fa fa-trash-alt"></i></el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizesList"
                        :page-size="pageSize"
                        class="gross"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="上传文件" :visible.sync="dialogFormVisible" :close-on-click-modal = 'false' class="uploadB2C">
            <div v-loading="loadFile"
                element-loading-text = "上传中..."
                element-loading-spinner = "el-icon-loading"
                element-loading-background = "transparent">
                <el-upload :action="importUrl" ref="importCommodity"
                    :file-list="fileList"
                    :on-change="handleChange"
                    :auto-upload="false"
                    :before-upload="beforeFileUpload"
                    :on-remove="removeFile"
                    :on-error="uploadError"
                    :on-success="uploadSuccess"
                    >
                    <el-button class="c-button c-button--primary">上传文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传xls|xlsx格式文件，且不超过20M</div>
                </el-upload>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelUpload" class="c-button c-button--plain">取 消</el-button>
                <el-button type="primary" @click="importCommodity('uploadFileForm')" class="c-button c-button--primary" :disabled="uploadDisabled">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ip from '../../../model/api'
    import tempIp from '../../../model/tempIp'
    export default {
        name: "salesUpdate",
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                totalRecords:0,
                couponCode:'',
                dialogFormVisible: false,
                loadFile:false,
                importUrl:'/fsc/data-center/coupon-change-detail/upload',
                fileList:[],
                uploadDisabled:true,
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getDataViewList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getDataViewList();
            },
            getDataRange(val){
                if(val){
                    this.preTransDatetime = val[0];
                    this.finalTransDatetime = val[1];
                }else{
                    this.preTransDatetime = '';
                    this.finalTransDatetime = '';
                }
            },
            getDataViewList(param){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'couponCode',
                        value:this.couponCode
                    },
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getCouponList(tem,res => {
                    if(res.code === 200){
                        // that.resultName = res.data.resultName;
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }else if(res.code === 404){
                        that.tableData = [];
                        that.totalRecords = 0;
                        that.showTips(res.msg,'warning');
                    }else{
                        that.tableData = [];
                        that.totalRecords = 0;
                        that.showTips(res.msg,'error');
                    }
                })
            },
            reset(){
                // this.tableData = [];
                // this.totalRecords = 0;
                this.couponCode = '';
            },
            showTips(text,type){
               this.common.messageUtil({
                 message: text,
                 type: type
               });
           },
           importCommodity(formName){
               var that = this;
               that.loadFile = true;
               that.$refs.importCommodity.submit();
               that.uploadDisabled = true;
           },
           cancelUpload(){
               this.dialogFormVisible = false;
           },
           importFile(){
               this.dialogFormVisible = true;
               this.fileList = [];
               this.uploadDisabled = true;
               this.loadFile = false;
               this.isTimeOut = false;
           },
           handleChange(file,fileList){
               this.fileList = fileList.slice(-1);
               this.uploadDisabled = this.fileList.length > 0 ? false : true;
               if(file.response || this.isTimeOut){
                   this.fileList = [];
                   this.uploadDisabled = true;
                   this.loadFile = false;
               }
           },
           beforeFileUpload(file){
               let csv = file.name.split('.');
               const isLt20M = file.size / 1024 / 1024 <= 20;
               if(csv[csv.length - 1] === 'xls' || csv[csv.length - 1] === 'xlsx'){
                   return file
               }else{
                   this.showTips('上传文件只能是 xls|xlsx 格式!','warning');
                   return false
               }
               if(!isLt20M){
                   this.showTips('不能超过20M!','warning');
                   return false
               }
           },
           removeFile(file,fileList){
               this.fileList = [];
               this.loadFile = false;
               this.uploadDisabled = true
           },
           uploadError(err, file, fileList){
               this.loadFile = false;
               this.isTimeOut = true;
               this.showTips('请求超时','warning')
           },
           uploadSuccess(response, file, fileList){
               if(response.code === 200){
                   this.$refs.importCommodity.clearFiles();
                   this.dialogFormVisible = false;
                   this.currentPage = 1;
                   this.pageSize = 10;
                   this.getDataViewList();
                   this.showTips(response.data,'success');
               }else{
                   if(!response.msg){
                       this.showTips('文件内容格式不正确','warning')
                   }else{
                       this.showTips(response.msg,'warning')
                   }
               }
           },
            deleteRow(id){
                var that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteCouponRow(id,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getDataViewList();
                        }else{
                            that.common.messageUtil({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
        beforeMount(){
            this.getDataViewList();
        }
    }
</script>
<style lang="scss">
    @import "../../../assets/scss/center";
    .font13{
        font-size:13px;
        margin-bottom:6px;
    }
</style>
