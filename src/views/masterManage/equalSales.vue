<template>
    <div class="mainContent">
         <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">项目名称</div>
                <el-input clearable v-model.trim="itemName" placeholder="请输入项目名称"></el-input>
            </div>
            <el-button size="small"  class="c-button c-button--primary" @click="search">查询</el-button>
            <el-button size="small"  class="c-button c-button--plain" @click="reset" plain>重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreLeft">
                <el-button size="small"  @click="exportFile" class="c-button c-button--primary"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                <el-button size="small"  @click="importFile" class="c-button c-button--primary"><i class="fa fa-upload c-button-icon--left"></i>上传</el-button>
            </div>
           <el-table :data="tableData" style="width: 100%" border>
                <el-table-column  prop="itemCode" label="项目编号" width="80px">
                </el-table-column>
                <el-table-column prop="itemName" label="项目名称" min-width="60px">
                </el-table-column>
                <el-table-column prop="lendSubjectNum" label="借方科目" min-width="50px">
                </el-table-column>
                <el-table-column prop="loanSubjectNum" label="贷方科目" min-width="50px">
                </el-table-column>
                <el-table-column prop="price" label="单价(元)" min-width="50px">
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.itemCode)"><i class="fa fa-trash-alt"></i></el-button>
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
        <el-dialog :visible.sync="importOpreDialog" class="dialogContent" width="40%"   :title="fileDialogTitle" :close-on-click-modal='closeModal'
            >
            <!--<el-checkbox-group v-model="equalSalesGroup" size="small" @change="selectUploadType">
                <el-checkbox  @change="selectType" label="视同销售项目"></el-checkbox>
                <el-checkbox  @change="selectType" label="视同销售主档"></el-checkbox>
            </el-checkbox-group>-->
            <div  class="loadFileContent" v-loading="loadFile"
            element-loading-text="上传中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="transparent" v-if="!isExportTemplate">
             <el-upload :action="importUrl"  ref="importequalSales"
                :file-list="fileList"
                :on-change="handleChange"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
                :on-remove="removeFile"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                accept=".xlsx"
               >
                 <el-button size="small" class="c-button c-button--primary">上传文件</el-button>
                 <div slot="tip" class="el-upload__tip">只能上传xlsx格式文件,且不超过20M</div>
             </el-upload>
             <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="cancelUpload" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="importequalSales" class="c-button c-button--primary" :disabled="uploadDisabled">上传</el-button>
            </div>
            </div>
            <div slot="footer" class="dialog-footer" v-if="isExportTemplate">
                <el-button size="small"  @click="cancelUpload" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="exportTemplate" class="c-button c-button--primary" :disabled="uploadDisabled">下载</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from '../../model/api'
import  ip from '../../model/tempIp'
const defaultGoodsForm = {
          commodityTypeId:'',
          commodityNumber:'',
          commodityName:'',
          lastModifiedTime:'',
          fscModifiedTime:'',
          // commodityTypeId:''
    }
 export default {
     name:'equalSales',
     data(){
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         importOpreDialog:false,
         tableData:[],
          fileList:[],
          uploadDisabled:true,
          loadFile:false,
          isTimeOut:false,
          deemedSalesItem:'视同销售项目',
          deemedSales:'视同销售主档',
          equalSalesGroup:['视同销售项目'],
          currentTypeSelected:false,
          isExportTemplate:false,
          closeModal:false,
          fileDialogTitle:'',
          itemName:'',
          brandId:'',
          importUrl:'',
          defaultUrl:ip.master_ip + '/deemedSales/',
          importUrlPath:'importDeemedSalesItem',
          exportUrlPath:'exportDeemedSalesItem'
       }
    },
    beforeMount(){
        this.getDeemedSalesList()
        this.importUrl = this.defaultUrl + this.importUrlPath
    },
     methods:{
        getDeemedSalesList(){
             var that = this
             var param = [
                {
                   name:'pageIndex',
                   value:this.currentPage
                },
                {
                    name:'pageSize',
                    value:this.pageSize
                },
                {
                    name:'itemName',
                    value:this.itemName
                }]
             api.getDeemedSalesList(this.common.joinSearchParam(param),function(res){
                        that.tableData = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.tableData = res.data.list;
                             that.totalRecords = res.data.totalRecords;
                        }
                        else if(res.code != 404){
                            that.showTips(res.msg,'warning')
                        }
                })
        },
        selectType(val){
            this.currentTypeSelected = val
        },
        selectUploadType(val){
            if(this.currentTypeSelected){
                this.equalSalesGroup = []
                this.equalSalesGroup.push(val[val.length - 1])
            }
            if(val.length == 0){
                this.uploadDisabled = true
            }else{
                this.uploadDisabled = this.isExportTemplate ? false : (this.fileList.length >0 ? false : true)
            }


            if(val[val.length - 1] == this.deemedSalesItem){
                this.importUrlPath = 'importDeemedSalesItem'
                this.exportUrlPath = 'exportDeemedSalesItem'
            }
            if(val[val.length - 1] == this.deemedSales){
                this.importUrlPath = 'importDeemedSales'
                this.exportUrlPath = 'exportDeemedSales'
            }

            this.importUrl = this.defaultUrl + this.importUrlPath
        },
        importequalSales(){
            this.loadFile = true
            this.$refs.importequalSales.submit();
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
                this.$refs.importequalSales.clearFiles();
                this.importOpreDialog = false
                this.reset()
                this.currentPage = 1
                this.getDeemedSalesList()
                this.showTips(response.data,'success')
            }
            else{
                this.showTips(response.msg,'warning')
            }
        },
        beforeFileUpload(file){
            let Xls = file.name.split('.');
            const isLt20M = file.size / 1024 / 1024 <= 20
            if(Xls[Xls.length - 1] === 'xls'||Xls[Xls.length - 1] === 'xlsx'){
                // Xls[0] == this.equalSalesGroup[0] ? '' : this.showTips('上传文件名必须为'+this.equalSalesGroup[0],'warning')
                // return Xls[0] == this.equalSalesGroup[0] ? file : false
                return file
            }else {
                this.showTips('上传文件只能是xlsx 格式!','warning')
                return false
            }
            if(!isLt20M){
                this.showTips('不能超过20M!','warning')
                return false
            }
        },
        removeFile(file,fileList){
            this.fileList=[]
            this.loadFile = false
            this.uploadDisabled = true
        },
        handleChange(file, fileList) {
           this.fileList = fileList.slice(-1)
           this.uploadDisabled = (this.fileList.length >0 && this.equalSalesGroup.length > 0 )? false:true
           if(file.response || this.isTimeOut){
                this.fileList = []
                this.uploadDisabled = true
                this.loadFile = false
           }
        },
         handleSizeChange(val) {
              this.pageSize = val
              this.getDeemedSalesList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getDeemedSalesList();
         },
         search(){
           this.currentPage = 1
           this.getDeemedSalesList()
         },
         reset(){
           this.itemName = ''
         },
         importFile(){
             this.importOpreDialog = true
             this.fileList =[]
             this.uploadDisabled = true
             this.loadFile = false
             this.isTimeOut = false
            //  this.equalSalesGroup = ['视同销售项目']
             this.importUrl = ip.master_ip + '/deemedSales/importDeemedSales'
             this.isExportTemplate = false
             this.fileDialogTitle = '上传'
             this.closeModal = false
         },
        //  exportFile(){
        //      this.importOpreDialog = true
        //      this.equalSalesGroup = ['视同销售项目'],
        //      this.isExportTemplate = true
        //      this.uploadDisabled = false
        //      this.fileDialogTitle = '模板下载'
        //      this.closeModal = true
        //      this.exportUrlPath = 'exportDeemedSalesItem'
        //  },
         exportFile(){
             var that = this
             api.downloadDeemedSales('','exportDeemedSales','application/x-msdownload',function(res){
                    if(res.code){
                         that.common.warningMessage(res.msg)
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.id = 'attachmentLink';
                        link.download = '视同销售主档.xlsx';
                        link.target = '_blank';link.click();
                        that.importOpreDialog = false
                        that.common.successMessage('下载成功')
                   }
            })
         },
         deleteRow(itemCode){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                 api.deleteDeemedSales(itemCode,function(res){
                     if(res.code == 200){
                        that.common.successMessage(res.data)
                        that.getDeemedSalesList()
                    }else{
                        that.common.warningMessage(res.data)
                    }
                 })
        }).catch(() => {
             this.common.messageUtil({
                type: 'info',
                message: '已取消删除'
               });
            });
         },
         showTips(text,type){
               this.common.messageUtil({
                 message: text,
                 type: type
               });
           }
     }
 }
</script>
<style scoped lang="scss">
    .loadFileContent {
        margin-top:10px;
        .dialog-footer {
            text-align: right;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding-top: 20px;
        }
    }
    .importUpload {
        display:inline-block;
        margin:0 10px;
    }

    .el-dialog .el-form .paramItem {
        .el-form-item {
            width: 96%
        }
    }

</style>
