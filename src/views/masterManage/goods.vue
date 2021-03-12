<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">商品名称</div>
                <el-input v-model.trim="commodityName" placeholder="请输入" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">商品编号</div>
                <el-input v-model.trim="commodityNumber" placeholder="请输入" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">商品类别</div>
                <el-select size="small"  v-model="commodityTypeId" placeholder="请选择" filterable>
                    <el-option v-for="item in commodityAllTypeOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">品牌</div>
                <el-select size="small"  v-model="brandId" placeholder="请选择" filterable>
                    <el-option v-for="item in brandAllOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button size="small"  @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"  @click="reset" class="c-button c-button--plain">重置</el-button>
            <el-button size="small"  @click="importFile" class="c-button c-button--primary"><i class="fa fa-upload c-button-icon--left"></i>上传</el-button>
            <el-button size="small"  @click="exportFile" class="c-button c-button--primary"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableDataGoods" style="width: 100%" border>
                <el-table-column prop="commodityNumber" label="商品编号" min-width="60px">
                </el-table-column>
                <el-table-column prop="commodityName" label="商品名称" min-width="60px" sortable>
                </el-table-column>
                <el-table-column prop="commodityTypeId" label="商品类别" min-width="50px">
                </el-table-column>
                <el-table-column prop="attrValue" label="attr_value" min-width="30px">
                </el-table-column>
                <el-table-column prop="brandId" label="品牌" min-width="30px">
                </el-table-column>
                <el-table-column prop="taxRate" label="税率(%)" min-width="30px">
                </el-table-column>
                <el-table-column prop="royalty" label="Royalty" min-width="30px">
                </el-table-column>
                <el-table-column prop="lastModifiedTime" label="自有商城同步时间" min-width="50px" sortable>
                </el-table-column>
                <el-table-column prop="fscModifiedTime" label="更新时间" min-width="50px" sortable>
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.commodityId,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.commodityId,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.commodityId)"><i class="fa fa-trash-alt"></i></el-button>
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
             <el-upload :action="importUrl"  ref="importCommodity"
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
                 <div slot="tip" class="el-upload__tip">只能上传xls/xlsx格式文件,且不超过20M</div>
             </el-upload>
             <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="cancelUpload" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  type="primary" @click="importCommodity" class="c-button c-button--primary" :disabled="uploadDisabled">确定</el-button>
            </div>
            </div>
        </el-dialog>
        <!--新增-->
        <el-dialog :visible.sync="goodsOpreDialog" class="dialogContent" width="70%">
            <div slot="title">
                {{goodsDialogTitle}}
            </div>
            <el-form :model="goodsForm" label-width="120px" ref="goodsForm">
                <el-form-item label="商品编号">
                    <el-input size="small"  v-model.trim="goodsForm.commodityNumber" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input size="small"  v-model.trim="goodsForm.commodityName" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="商品类别">
                    <el-select size="small"  v-model="goodsForm.commodityTypeId" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled">
                        <el-option v-for="item in commodityTypeOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="attr_value">
                   <el-input size="small"  v-model.trim="goodsForm.attrValue" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select size="small"  v-model="goodsForm.brandId" placeholder="" clearable filterable disabled>
                        <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="税率(%)" prop="taxRate">
                    <el-select size="small"  v-model="goodsForm.taxRate" :placeholder="isDisabled?'':'请选择'" :disabled="isDisabled">
                        <el-option v-for="item in taxRateOptions" :key="item.id" :label="item.taxRateValue" :value="item.taxRateValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Royalty">
                    <el-select size="small"  v-model="goodsForm.royalty" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled">
                        <el-option v-for="item in royaltyOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自有商城同步时间">
                    <el-date-picker v-model="goodsForm.lastModifiedTime" type="datetime" placeholder="" clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-date-picker v-model="goodsForm.fscModifiedTime" type="datetime" placeholder="" clearable disabled>
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="goodsOpreDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="newAddForm('goodsForm')" class="c-button c-button--primary">保存</el-button>
            </div>
        </el-dialog>
        <!--新增-->
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
          // commodityTypeId:'',
    }
 export default {
     name:'goods',
     data(){
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         brandType:'',
         isEdit:false,
         isDisabled:false,
         goodsOpreDialog:false,
         importOpreDialog:false,
         goodsDialogTitle:'',
         goodsForm: Object.assign({},defaultGoodsForm) ,
         tableDataGoods:[],
         commodityName:"",
         commodityTypeId:'',
         commodityTypeOption:[],
         commodityAllTypeOption:[],
         goodsTypeOption:[],
         brandName:'',
         brandOptions:[],
         brandAllOptions:[],
         royalty:'',
         royaltyOptions:[],
         commodityNumber:'',
          brandId:'',
          barndOption:[],
          commodityAttrValue:'',
          fileList:[],
          importUrl:ip.master_ip + '/commodity/import',
          uploadDisabled:true,
          loadFile:false,
          isTimeOut:false,
          taxRateOptions:[]
       }
    },
    beforeMount(){
      this.getCommodityList()
      this.getCommodityNames()
      this.getBrandByIdNames()
      this.getCommodityTypeIdNames()
      this.getRoyalty()
    },
     methods:{
        importCommodity(){
            this.loadFile = true
            this.$refs.importCommodity.submit();
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
                this.$refs.importCommodity.clearFiles();
                this.importOpreDialog = false
                this.reset()
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
                this.showTips('上传文件只能是 xls/xlsx 格式!','warning')
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
           this.uploadDisabled = this.fileList.length >0 ? false:true
           if(file.response || this.isTimeOut){
                this.fileList = []
                this.uploadDisabled = true
                this.loadFile = false
           }
        },
         handleSizeChange(val) {
              this.pageSize = val
              this.getCommodityList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getCommodityList();
         },
         search(){
           this.currentPage = 1
           this.getCommodityList()
         },
         reset(){
           this.commodityName = ''
           this.commodityNumber = ''
           this.commodityTypeId = ''
           this.brandId = ''
        //    this.getCommodityList()
         },
         importFile(){
             this.importOpreDialog = true
             this.fileList =[]
             this.uploadDisabled = true
             this.loadFile = false
             this.isTimeOut = false
         },
         exportFile(){
             window.location.href = ip.master_ip + '/commodity/export'+ this.getSearchParam()
         },
         checkDetail(commodityId,isEdit){
           var that = this
           this.isEdit = isEdit
           this.goodsDialogTitle = isEdit ? '商品-编辑':'商品-详情';
           this.isDisabled = !isEdit
           this.goodsOpreDialog = true
           if(this.$refs.goodsForm){
               this.$refs.goodsForm.resetFields()
           }
           this.getTaxRateValueList()
           api.getCommodityById(commodityId,function(res){
              that.goodsForm = res.data
              that.goodsForm.brandId = that.common.isNullString(res.data.brandId) ?'' : parseInt(res.data.brandId)
              that.goodsForm.commodityTypeId = that.common.isNullString(res.data.commodityTypeId) ?'' :parseInt(res.data.commodityTypeId)
              that.goodsForm.royalty = that.common.isNullString(res.data.royalty) ?'' :parseInt(res.data.royalty)
              that.goodsForm.taxRate = that.common.isNullString(res.data.taxRate) ?'' :parseInt(res.data.taxRate)
          })
         },
         deleteRow(commodityId){
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                this.deleteGoods(commodityId)
        }).catch(() => {
             this.common.messageUtil({
                type: 'info',
                message: '已取消删除'
               });
            });
         },
         deleteGoods(commodityId){
             var that = this
             api.deleteCommodity(commodityId,function(res){
                 res.code == 200 ? (that.showTips(res.data,'success'), that.getCommodityList()): that.showTips(res.msg,'warning')
             })
         },
         newAdd(){
             this.isEdit = true
             this.isDisabled = false
             this.goodsDialogTitle = '商品-新增'
             this.goodsOpreDialog = true
             if(this.$refs.goodsForm){
               this.$refs.goodsForm.resetFields()
             }
             this.goodsForm = Object.assign({},defaultGoodsForm)
         },
         newAddForm(goodsForm){
             var that = this
             this.$refs[goodsForm].validate((valid) => {
                    if (valid) {
                          var param = {
                            commodityId:this.goodsForm.commodityId,
                            commodityTypeId:this.goodsForm.commodityTypeId,
                            royalty:this.goodsForm.royalty,
                            taxRate:this.goodsForm.taxRate,
                            brandId:this.goodsForm.brandId
                          }
                         api.updateCommodityById(param,function(res){
                         res.code === 200 ? (that.showTips(res.data,'success') ,that.getCommodityList()): that.showTips(res.msg,'warning')
                         })
                         that.$refs.goodsForm.resetFields()
                         that.goodsOpreDialog = false
                    } else {
                        return false;
                    }
            });
         },
         getBrandByIdNames(){
             var that = this;
             api.getBrandList('?pageSize=0&flag=2',function(res){
                that.brandOptions = [];
                that.brandAllOptions = [];
                that.brandAllOptions.push({
                    value:'',
                    label:'请选择'
                });
                res.data.list.forEach(function(item,index){
                    that.brandOptions.push({value:item.brandId,label:item.brandEnglishName})
                    that.brandAllOptions.push({value:item.brandId,label:item.brandEnglishName})
                })
             })
          },
         getCommodityNames(){
             var that = this
             api.getCommodityNames(function(res){
                that.goodsTypeOption.push({
                    value:'',
                    label:'请选择'
                })
                for(let index of res.data)
                    {
                        that.goodsTypeOption.push({
                            value:index,
                            label:res.data[index]
                        })
                    }
             })
         },
         getCommodityTypeIdNames(){
           var that = this;
           api.getCommodityTypeIdNames(function(res){
               that.commodityTypeOption = [];
               that.commodityAllTypeOption = [];
               that.commodityAllTypeOption.push({
                   value:'',
                   label:'请选择'
               });
               that.commodityTypeOption.push({
                   value:'',
                   label:'请选择'
               });
               res.data.forEach(function(item,index){
                   that.commodityTypeOption.push(
                   {
                        value:item.commodityTypeId,
                        label:item.commodityTypeName
                  });
                  that.commodityAllTypeOption.push(
                   {
                        value:item.commodityTypeId,
                        label:item.commodityTypeName
                  })
               });
                that.commodityAllTypeOption.push({
                    value:'0',
                    label:'无类别'
                })
           })
         },
         getRoyalty(){
             var that = this;
             api.getDictionaryByNumber('ROYALTY',function(res){
                that.royaltyOptions = [];
                 that.royaltyOptions.push({
                     value:'',
                     label:'请选择'
                 });
                res.data.forEach(function(item,index){
                    that.royaltyOptions.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        }
                    )
                })
            });
         },
         getTaxRateValueList(){
             var that = this
             api.getTaxRateList('?pageSize=0',function(res){
                if(res.code === 200)
                {
                        res.data.list.unshift({id:'',taxRateValue:'请选择'})
                        that.taxRateOptions = res.data.list;
                }
                else if(res.code == 404){
                        that.taxRateOptions = [];
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
               },{
                   name:'commodityName',
                   value:this.commodityName
               },
               {
                   name:'commodityNumber',
                   value:this.commodityNumber
               },
               {
                   name:'commodityTypeId',
                   value:this.commodityTypeId
               },
               {
                   name:'brandId',
                   value:this.brandId
               }]
             return this.common.joinSearchParam(param)
         },
         getCommodityList(){
             var that = this
             api.getCommodityList(this.getSearchParam(),function(res){
                        that.tableDataGoods = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.tableDataGoods = res.data.list;
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
           }
     }
 }
</script>
<style scoped lang="scss">
    .loadFileContent {
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
