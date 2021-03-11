<template>
    <div class="mainContent">
        <div class="dataContent">
            <div class="opreRight">
                 <el-button size="small"  @click="exportTemplateFile" class="c-button c-button--primary"><i class="fa fa-download c-button-icon--left"></i>模板下载</el-button>
                 <el-button size="small"  @click="importFile" class="c-button c-button--primary"><i class="fa fa-upload c-button-icon--left"></i>上传</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="accountingSubject" label="BOH数据项" min-width="80">
                </el-table-column>
                <el-table-column prop="bohDataItem" label="会计科目" min-width="100">
                </el-table-column>
                <el-table-column prop="modifiedUser" label="更新人" width="80px">
                </el-table-column>
                <el-table-column prop="modifiedTime" label="更新日期" sortable width="140">
                </el-table-column>
                <el-table-column label="操作" width="60px">
                    <template slot-scope="scope">
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </div>
         <!--上传文件-->
        <el-dialog :visible.sync="importOpreDialog" class="dialogContent" width="40%"   title="上传文件" :close-on-click-modal='false'
            >
            <div  class="loadFileContent" v-loading="loadFile"
            element-loading-text="上传中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="transparent">
             <el-upload :action="importUrl"  ref="uploadFile"
                :file-list="fileList"
                :on-change="handleChange"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
                :on-remove="removeFile"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                accept=".xlsx"
               >
                 <el-button class="c-button c-button--primary">上传文件</el-button>
                 <div slot="tip" class="el-upload__tip">只能上传xls/xlsx格式文件,且不超过50M</div>
             </el-upload>
             <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="cancelUpload" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  type="primary" @click="confirm" class="c-button c-button--primary" :disabled="uploadDisabled">确定</el-button>
            </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
	import ip from '@/model/tempIp'
	import api from '@/model/api'
    export default{
        name:'bohData',
        data(){
            return{
                importOpreDialog:false,
                importUrl:`${ip.master_ip}/boh-data_item/import`,
                uploadDisabled:true,
                loadFile:false,
                isTimeOut:false,
                fileList:[],
                tableData:[{
                    accountingSubject:'卖废纸/废品',
                    bohDataItem:'1152.005  其他应收款-餐厅零用金拨补预收账款-订餐款',
                    modifiedUser:'1',
                    modifiedTime:'2018-09-02 11:22:33'
                },
                {
                    accountingSubject:'卖废设备及设施',
                    bohDataItem:'2746.039  营业外收入-废品（除废油）收入（16%）',
                    modifiedUser:'1',
                    modifiedTime:'2018-09-02 11:22:33'
                },
                {
                    accountingSubject:'捡拾款',
                    bohDataItem:'7501.035  营业外收入-资产处置（3%）',
                    modifiedUser:'1',
                    modifiedTime:'2018-09-02 11:22:33'
                }],
                pageSizeList:[25, 50, 75, 100, 125],
                totalRecords:0,
                currentPage: 1,
                pageSize:25,

            }
        },
        beforeMount(){
          this.getBOHDataList()
        },
        methods:{
            handleSizeChange(val){
                this.pageSize = val
                this.getBOHDataList()
            },
            handleCurrentChange(val){
                this.currentPage = val
                this.getBOHDataList()
            },
            getBOHDataList () {
              let that = this
              let param = [{
                name: 'pageIndex',
                value: this.currentPage
              }, {
                name: 'pageSize',
                value: this.pageSize
              }]
              api.getBOHDataList(this.common.joinSearchParam(param),function(res){
                if (res.code === 200) {
                  that.tableData = res.data.list
                  that.totalRecords = res.data.totalRecords
                } else if (res.code != 404) {
                  that.showTips(res.msg,'warning')
                }
              })
            },
            confirm(){
                this.loadFile = true
                this.$refs.uploadFile.submit()
                this.uploadDisabled = true
            },
            cancelUpload(){
                this.importOpreDialog = false
            },
            uploadError(err, file, fileList){
                this.loadFile = false
                this.isTimeOut = true
                this.showTips('请求超时','warning')
            },
            uploadSuccess(response, file, fileList){
                if(response.code === 200)
                {
                    this.$refs.uploadFile.clearFiles()
                    this.importOpreDialog = false
                    this.showTips(response.data,'success')
                    this.getBOHDataList()
                }
                else{
//              	this.$refs.uploadFile.clearFiles()
//                  this.importOpreDialog = false
                    this.showTips(response.msg,'warning')
                }
            },
            beforeFileUpload(file){
                let Xls = file.name.split('.');
                const isLt50M = file.size / 1024 / 1024 <= 50
                if(Xls[Xls.length - 1] === 'xls'||Xls[Xls.length - 1] === 'xlsx'){
                    return file
                }else {
                    this.showTips('上传文件只能是 xls/xlsx 格式!','warning')
                    return false
                }
                if(!isLt50M){
                    this.showTips('不能超过50M!','warning')
                    return false
                }
            },
            removeFile(file,fileList){
                this.fileList=[]
                this.loadFile = false
                this.uploadDisabled = true
            },
            handleChange(file, fileList) {
              // console.log(file)
              this.fileList = fileList.slice(-1)
              this.uploadDisabled = this.fileList.length >0 ? false:true
              if (file.response || this.isTimeOut) {
                this.fileList = []
                this.uploadDisabled = true
                this.loadFile = false
              }
            },
            importFile(){
             this.importOpreDialog = true
             this.fileList =[]
             this.uploadDisabled = true
             this.loadFile = false
             this.isTimeOut = false
            },
            exportTemplateFile(){
              window.location.href = ip.master_ip + '/boh-data_item/export'
            },
            deleteRow(row){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
              let param = [{
                name:'id',
                value: row.id
              }]
              api.delBOHDataById(that.common.joinSearchParam(param),function(res){
                if (res.code === 200) {
                  that.showTips(res.data,'success')
                  that.getBOHDataList()
                } else if (res.code !== 404) {
                  that.showTips(res.msg,'warning')
                }
              })
            }).catch(() => {
                that.common.infoMessage('已取消删除')
            });
          },
          showTips (text,type) {
            this.common.messageUtil({
              message: text,
             type: type
            })
          }
        }
    }
</script>
<style lang="scss" scoped>
    .loadFileContent {
        .dialog-footer {
            text-align: right;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding-top: 20px;
        }
    }
</style>
