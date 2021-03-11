<template>
    <div class="mainContent">
         <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">品牌</div>
                 <el-select size="small"  v-model="brandId" placeholder="请选择品牌" filterable>
                    <el-option v-for="item in brandOption" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandId">
                    </el-option>
                </el-select>
            </div>
             <div class="selectContent">
                <div class="selectTitle">类别名称</div>
                 <el-select size="small" v-model="className" placeholder="请选择类别名称" filterable>
                     <el-option value="" label="请选择"></el-option>
                     <el-option :value="-1" label="空"></el-option>
                    <el-option v-for="item in categoryClassOption" :key="item.classId" :label="item.className" :value="item.className">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">项目名称</div>
                 <el-select size="small" v-model="itemCode"  placeholder="请选择项目名称" filterable>
                    <el-option v-for="item in categoryItemOption" :key="item.itemCode" :label="item.itemName" :value="item.itemCode">
                    </el-option>
                </el-select>
            </div>
            <el-button size="small"  class="c-button c-button--primary" @click="search">查询</el-button>
            <el-button size="small"  class="c-button c-button--plain" @click="reset" plain>重置</el-button>
             <el-button size="small"  class="c-button c-button--plain" @click="downloadData" >下载</el-button>
        </div>
        <div class="dataContent">
            <div class="opreLeft">
                <el-button size="small"  @click="exportFile" class="c-button c-button--primary"><i class="fa fa-download c-button-icon--left"></i>模板下载</el-button>
                <el-button size="small"  @click="importFile" class="c-button c-button--primary"><i class="fa fa-upload c-button-icon--left"></i>上传</el-button>
            </div>
           <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="classId" label="类别编码" width="80px">
                </el-table-column>
                <el-table-column prop="className" label="类别名称" min-width="50px">
                </el-table-column>
                <el-table-column prop="itemCode" label="品相编码" min-width="50px">
                </el-table-column>
                <el-table-column prop="itemName" label="品项名称" min-width="50px">
                </el-table-column>
                <el-table-column prop="brandName" label="指定品牌" width="80px">
                </el-table-column>
                <el-table-column prop="loanSubjectNum" label="贷方科目" min-width="50px">
                </el-table-column>
                 <el-table-column prop="lendSubjectNum" label="借方科目" min-width="50px">
                </el-table-column>
                <el-table-column prop="tax" label="税率(%)" min-width="50px">
                </el-table-column>
                <el-table-column prop="cargoLaborPrice" label="单价" min-width="50px">
                </el-table-column>
                <el-table-column label="操作" width="100px">
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
             <el-checkbox-group v-model="categoryGroup" size="small" @change="selectUploadType">
                <el-checkbox  @change="selectType" label="货劳分类类别"></el-checkbox>
                <el-checkbox  @change="selectType" label="品项主档"></el-checkbox>
                <el-checkbox  @change="selectType" label="货劳映射关系主档"></el-checkbox>
            </el-checkbox-group>
            <div  class="loadFileContent" v-loading="loadFile"
            element-loading-text="上传中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="transparent" v-if="!isExportTemplate">
             <el-upload :action="importUrl"  ref="importgsCategory"
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
                <el-button size="small"  type="primary" @click="importgsCategory" class="c-button c-button--primary" :disabled="uploadDisabled">上传</el-button>
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
 export default {
     name:'gsCategory',
     data(){
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         importOpreDialog:false,
         tableData:[],
         brandOption:[],
          brandId:'',
          commodityAttrValue:'',
          fileList:[],
          uploadDisabled:true,
          loadFile:false,
          isTimeOut:false,
          categoryType:'货劳分类类别',
          categoryPro:'品项主档',
          categoryMd:'货劳映射关系主档',
          categoryGroup:['货劳分类类别'],
          currentTypeSelected:false,
          isExportTemplate:false,
          fileDialogTitle:'',
          closeModal:false,
          className:'',
          itemCode:'',
          categoryClassOption:[],
          categoryItemOption:[],
          defaultUrl:ip.master_ip + '/cargoLaborTaxonomy/',
          importUrl:'',
          importUrlPath:'importCargoLaborClass',
          exportUrlPath:'exportCargoLaborClass',

       }
    },
    beforeMount(){
      this.getCargoLaborTaxonomyList()
      this.getSearchOption()
      this.importUrl = this.defaultUrl + this.importUrlPath
    },
     methods:{
        getSearchOption(){
            var that = this
            this.categoryClassOption = []
            this.categoryItemOption = []
            this.brandOption = []
            api.getCargoLaborClass(function(res){
                that.categoryClassOption = res.data
            })

            api.getCargoLaborItem(function(res){
                res.data.unshift({itemCode:'',itemName:'请选择'})
                that.categoryItemOption = res.data
            })

            api.getBrandList('?pageSize=0',function(res){
                res.data.list.unshift({brandId:-1,brandEnglishName:'空'})
                res.data.list.unshift({brandId:'',brandEnglishName:'请选择'})
                that.brandOption = res.data.list
            })

        },
        removeRow(rowId){
            var that = this
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    api.deleteCargoLaborTaxonomy(rowId,function(res){
                        if(res.code == 200){
                            that.common.successMessage(res.data)
                            that.getCargoLaborTaxonomyList()
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
        selectType(val){
            this.currentTypeSelected = val
        },
        selectUploadType(val){
            if(this.currentTypeSelected){
                this.categoryGroup = []
                this.categoryGroup.push(val[val.length - 1])
            }
            if(val.length == 0){
                this.uploadDisabled = true
            }else{
                this.uploadDisabled = this.isExportTemplate ? false : (this.fileList.length >0 ? false : true)
            }
            if(val[val.length - 1] == this.categoryType){
                this.importUrlPath = 'importCargoLaborClass'
                this.exportUrlPath = 'exportCargoLaborClass'
            }
            if(val[val.length - 1] == this.categoryPro){
                this.importUrlPath = 'importCargoLaborItem'
                this.exportUrlPath = 'exportCargoLaborItem'
            }
            if(val[val.length - 1] == this.categoryMd){
                this.importUrlPath = 'importCargoLabor'
                this.exportUrlPath = 'exportCargoLabor'
            }
            this.importUrl = this.defaultUrl + this.importUrlPath
        },
        importgsCategory(){
            this.loadFile = true
            this.$refs.importgsCategory.submit();
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
                this.$refs.importgsCategory.clearFiles();
                this.importOpreDialog = false
                this.reset()
                this.currentPage = 1
                this.getCargoLaborTaxonomyList()
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
                Xls[0] == this.categoryGroup[0] ? '' : this.showTips('上传文件名必须为'+this.categoryGroup[0],'warning')
                return Xls[0] == this.categoryGroup[0] ? file : false
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
           this.uploadDisabled = (this.fileList.length >0 && this.categoryGroup.length > 0) ? false:true
           if(file.response || this.isTimeOut){
                this.fileList = []
                this.uploadDisabled = true
                this.loadFile = false
           }
        },
         handleSizeChange(val) {
              this.pageSize = val
              this.getCargoLaborTaxonomyList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getCargoLaborTaxonomyList();
         },
         search(){
           this.getCargoLaborTaxonomyList()
         },
         reset(){
           this.itemCode = ''
           this.className = ''
           this.brandId = ''
           this.bookDate = [];
         },
         importFile(){
             this.importOpreDialog = true
             this.fileList =[]
             this.uploadDisabled = true
             this.loadFile = false
             this.isTimeOut = false
             this.categoryGroup = ['货劳分类类别']
             this.importUrl = ip.master_ip + '/cargoLaborTaxonomy/importCargoLaborClass'
             this.isExportTemplate = false
             this.fileDialogTitle = '上传'
             this.closeModal = false
         },
         exportFile(){
             this.importOpreDialog = true
             this.categoryGroup = ['货劳分类类别'],
             this.isExportTemplate = true
             this.uploadDisabled = false
             this.fileDialogTitle = '模板下载'
             this.closeModal = true
             this.exportUrlPath = 'exportCargoLaborClass'
         },
         exportTemplate(){
             var that = this
             api.downloadCargoLaborTaxonomy('',this.exportUrlPath,'application/x-msdownload',function(res){
                    if(res.code){
                         that.common.warningMessage(res.msg)
                    }else{
                        let link = document.createElement('a');
                        link.href = res;
                        link.id = 'attachmentLink';
                        link.download = that.categoryGroup[0]+'.xlsx';
                        link.target = '_blank';link.click();
                        that.importOpreDialog = false
                        that.common.successMessage('下载成功')
                   }
                })
         },
         getSearchParam(){
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
                   name:'itemCode',
                   value:this.itemCode
               },
               {
                   name:'brandId',
                   value:this.brandId
               },
             ]
             return this.common.joinSearchParam(param)+'&className='+encodeURIComponent(this.className)
         },
         getCargoLaborTaxonomyList(){
             var that = this
             api.getCargoLaborTaxonomyList(this.getSearchParam(),function(res){
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
         downloadData(){
             api.downloadCargoLaborTaxonomyData({
                 brandId: this.brandId,
                 className: this.className,
                 itemCode: this.itemCode,
             },'application/vnd.ms-excel',(res,header)=>{
                 let name = header['content-disposition'];
                 this.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
             })
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
