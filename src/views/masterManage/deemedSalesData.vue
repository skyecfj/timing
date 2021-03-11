<template>
    <div class="mainContent">
         <div class="searchContent">
             <div class="selectContent">
                <div class="selectTitle">餐厅编号</div>
                <el-input size="small"  v-model.trim="storeCode" clearable placeholder="请输入"></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">营业日期</div>
                <el-date-picker size="small"
                      v-model="bizDate"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      clearable
                      value-format="yyyy-MM-dd">
                  </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">项目中文名称</div>
                <el-input size="small"  v-model.trim="itemName" clearable placeholder="请输入"></el-input>
            </div>
            <el-button size="small"  class="c-button c-button--primary" @click="search">查询</el-button>
            <el-button size="small"  class="c-button c-button--plain" @click="reset" plain>重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
                <el-button size="small"  @click="exportFileModel" class="c-button c-button--primary"><i class="fa fa-download c-button-icon--left"></i>模板下载</el-button>
                <el-button size="small"  @click="exportFile" class="c-button c-button--primary"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                <el-button size="small"  @click="importFile" class="c-button c-button--primary"><i class="fa fa-upload c-button-icon--left"></i>上传</el-button>
                <el-button size="small"  @click="batchDelete" class="c-button c-button--primary"><i class="fa fa-trash c-button-icon--left"></i>批量删除</el-button>
            </div>
           <el-table :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
               <el-table-column type="selection" width="55">
               </el-table-column>
               <el-table-column label="营业日期" prop="bizDate" min-width="60px">
                </el-table-column>
                <el-table-column prop="storeCode" label="餐厅编号" min-width="60px">
                </el-table-column>
                <el-table-column prop="itemCode" label="项目编号" min-width="60px">
                </el-table-column>
                <el-table-column prop="itemName" label="项目名称" min-width="120px">
                </el-table-column>
                <el-table-column prop="bizStatus" label="营业状态" min-width="120px">
                </el-table-column>
                <el-table-column prop="price" label="单价(元)" min-width="60px">
                </el-table-column>
                <el-table-column prop="quantity" label="数量" min-width="60px">
                </el-table-column>
                <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
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
        <el-dialog :visible.sync="importOpreDialog" class="dialogContent" width="40%"   :title="fileDialogTitle" :close-on-click-modal='closeModal'>
            <div  class="loadFileContent" v-loading="loadFile"
            element-loading-text="上传中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="transparent">
             <el-upload :action="importUrlPath"  ref="importDeemedSales"
                :file-list="fileList"
                :on-change="handleChange"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
                :on-remove="removeFile"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                accept=".xlsx"
                >
                 <el-button class="c-button c-button--primary" size="small">上传文件</el-button>
                 <div slot="tip" class="el-upload__tip">只能上传xlsx格式文件,且不超过20M</div>
             </el-upload>
             <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="cancelUpload" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="importDeemedSales" class="c-button c-button--primary" :disabled="uploadDisabled">上传</el-button>
            </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from '../../model/api'
import  ip from '../../model/tempIp'
 export default {
     name:'deemedSalesData',
     data(){
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         importOpreDialog:false,
         tableData:[],
         storeCode:'',
         itemName:'',
         className:'',
         brandOption:[],
          brandId:'',
          commodityAttrValue:'',
          fileList:[],
          uploadDisabled:true,
          loadFile:false,
          isTimeOut:false,
          currentTypeSelected:false,
          fileDialogTitle:'',
          closeModal:false,
          classId:'',
          itemCode:'',
          categoryClassOption:[],
          categoryItemOption:[],
          importUrlPath:ip.store + '/deemed-sales-data/importDeemedSales',
          bizDate:[],
          ids:[]
       }
    },
    beforeMount(){
      this.getDeemedSalesDataList()
    },
     methods:{
        exportFileModel(){
            var that = this
            api.downloadDeemedSalesDataModel('application/vnd.ms-excel',function(res){
                    if(res.code){
                         that.common.warningMessage(res.msg)
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.id = 'attachmentLink';
                        link.download = '视同销售数据管理模板.xlsx';
                        link.target = '_blank';link.click();
                        that.importOpreDialog = false
                        that.common.successMessage('下载成功')
                   }
            })
        },
        removeRow(rowId){
            var that = this
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    api.deleteDeemedSalesData(rowId,function(res){
                        if(res.code == 200){
                            that.common.successMessage(res.data)
                            that.getDeemedSalesDataList()
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
        importDeemedSales(){
            this.loadFile = true
            this.$refs.importDeemedSales.submit();
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
                this.$refs.importDeemedSales.clearFiles();
                this.importOpreDialog = false
                this.reset()
                this.currentPage = 1
                this.getDeemedSalesDataList()
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
           this.uploadDisabled = (this.fileList.length >0 ) ? false:true
           if(file.response || this.isTimeOut){
                this.fileList = []
                this.uploadDisabled = true
                this.loadFile = false
           }
        },
         handleSizeChange(val) {
              this.pageSize = val
              this.getDeemedSalesDataList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getDeemedSalesDataList();
         },
         search(){
           this.currentPage = 1
           this.getDeemedSalesDataList()
         },
         reset(){
           this.storeCode = ''
           this.itemName = ''
           this.bizDate = []
         },
         importFile(){
             this.importOpreDialog = true
             this.fileList =[]
             this.uploadDisabled = true
             this.loadFile = false
             this.isTimeOut = false
             this.fileDialogTitle = '上传'
             this.closeModal = false
         },
         exportFile(){
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
                   name:'storeCode',
                   value:this.storeCode
               },
               {
                   name:'itemName',
                   value:this.itemName
               },
               {
                   name:'bizDateBegin',
                   value:this.bizDate[0]
               },
               {
                   name:'bizDateEnd',
                   value:this.bizDate[1]
               }]
             api.downloadDeemedSalesData(this.common.joinSearchParam(param),'application/vnd.ms-excel',function(res){
                    if(res.code){
                         that.common.warningMessage(res.msg)
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.id = 'attachmentLink';
                        link.download = '视同销售数据管理.xlsx';
                        link.target = '_blank';link.click();
                        that.importOpreDialog = false
                        that.common.successMessage('下载成功')
                   }
                })
         },
         getDeemedSalesDataList(){
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
                   name:'storeCode',
                   value:this.storeCode
               },
               {
                   name:'className',
                   value:this.className
               },
               {
                   name:'itemName',
                   value:this.itemName
               },
              {
                   name:'bizDateBegin',
                   value:this.bizDate ? this.bizDate[0] :''
               },
               {
                   name:'bizDateEnd',
                   value:this.bizDate ?this.bizDate[1] :''
               }]
             api.getDeemedSalesDataList(this.common.joinSearchParam(param),function(res){
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
         showTips(text,type){
               this.common.messageUtil({
                 message: text,
                 type: type
               });
           },
         handleSelectionChange(row){
            this.ids = row.map(row=>{return row.id})
         },
         batchDelete(){
            if(this.ids && this.ids.length>0){
                this.$confirm('确定批量删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.batchDeleteDeemedSales({ids:this.ids},()=>{
                        this.getDeemedSalesDataList()
                    })
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }else{
                this.common.messageUtil({
                    type:'warning',
                    message:'请选择数据后进行删除！'
                })
            }
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
