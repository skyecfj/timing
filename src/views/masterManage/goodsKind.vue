<template>
    <div class="mainContent">
        <div class="searchContent">
        <div class="selectContent">
          <div class="selectTitle">商品类别名称</div>
          <el-select size="small"  v-model="commodityTypeName" placeholder="请选择"  filterable>
            <el-option v-for="item in kindTypeOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
         </el-select>
        </div>
        <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
        <el-button size="small"   @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
              <el-button size="small"   @click="newAdd" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableDataGkind"  style="width: 100%" border>
                <el-table-column prop="commodityTypeNumber" label="商品类别编号" min-width="80px">
                </el-table-column>
                <el-table-column prop="commodityTypeName" label="商品类别名称" min-width="80px" sortable>
                </el-table-column>
                <el-table-column prop="fscModifiedTime" label="更新时间" min-width="50px" sortable>
                </el-table-column>
                <el-table-column prop="fscModifiedUser" label="更新人" width="80px">
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.commodityTypeId ,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.commodityTypeId,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteGoodsKind(scope.row.commodityTypeId)"><i class="fa fa-trash-alt"></i></el-button>
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
        <!--新增-->
          <el-dialog  :visible.sync="goodsKindOpreDialog" class="dialogContent" width="70%">
              <div slot="title">
                  {{goodsKindDialogTitle}}
              </div>
            <el-form :model="goodsKindForm"  label-width="110px" ref="goodsKindForm" :rules="rules">
                <el-form-item label="商品类别编号"  prop="commodityTypeNumber">
                    <el-input size="small"  v-model.trim="goodsKindForm.commodityTypeNumber"  :placeholder="isDisabled?'':'请输入'" clearable :disabled="isDisabled" :maxlength="2"></el-input>
                </el-form-item>
                <el-form-item label="商品类别名称"  prop="commodityTypeName">
                    <el-input size="small"  v-model.trim="goodsKindForm.commodityTypeName" :placeholder="isDisabled?'':'请输入'" clearable :disabled="isDisabled" :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="更新时间" v-if="!isAdd">
                    <el-date-picker v-model="goodsKindForm.fscModifiedTime" type="datetime" placeholder="" clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人" v-if="!isAdd">
                    <el-input size="small"  v-model.trim="goodsKindForm.fscModifiedUser" clearable disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="goodsKindOpreDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  @click="submitForm()" class="c-button c-button--primary">保存</el-button>
            </div>
          </el-dialog>
        <!--新增-->
    </div>
</template>
<script>
import api from '../../model/api'
const defaultGoodsKindForm = {
          commodityTypeNumber:'',
          commodityTypeName:'',
          fscModifiedTime:'',
          fscModifiedUser:''
    }
 export default {
     name:'goodsKind',
     data(){
         var validName = (rule, value, callback) => {
            if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)) {
                callback(new Error('只能输入数字、字母和汉字'));
            }
            else{
                callback()
            }
        };

        var validNumber = (rule, value, callback) => {
            if (!/^[0-9]+$/.test(value)) {
                callback(new Error('只能输入数字'));
            }
            else{
                callback()
            }
        };
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         commodityTypeName:'',
         kindType:'',
         isAdd:false,
         isEdit:false,
         isDisabled:false,
         goodsKindOpreDialog:false,
         goodsKindDialogTitle:'',
         goodsKindForm: Object.assign({},defaultGoodsKindForm),
         tableDataGkind:[],
         kindTypeOption:[],
         brandId:'',
         brandOptions:[],
         remotecommodityTypeData:Object.assign({},defaultGoodsKindForm),
         rules:{
             commodityTypeNumber:[{required: true, message: '商品类别编号不能为空', trigger: 'blur'},
             { validator: validNumber, trigger: 'blur'}],
             commodityTypeName:[{required: true, message: '商品类别名称不能为空', trigger: 'blur'},
             { validator: validName, trigger: 'blur'}]
         }
       }
    },
    beforeMount(){
       this.getCommodityTypeList()
       this.getCommodityTypeNames()
       this.getBrandByIdNames()
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getCommodityTypeList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getCommodityTypeList()
         },
         search(){
           this.currentPage = 1
           this.getCommodityTypeList()
         },
         reset(){
           this.commodityTypeName = ''
        //    this.getCommodityTypeList()
         },
         checkDetail(commodityId,isEdit){
           var that = this
           this.isAdd = false
           this.isEdit = isEdit
           this.isDisabled = !isEdit
           this.goodsKindDialogTitle = isEdit ? '商品类别-编辑':'商品类别-详情';
           this.goodsKindOpreDialog = true
           if(this.$refs.goodsKindForm){
               this.$refs.goodsKindForm.clearValidate()
           }
           api.getCommodityTypeById(commodityId,function(res){
                  that.remotecommodityTypeData = Object.assign({},res.data)
                  that.goodsKindForm = res.data
                  that.goodsForm.brandId = parseInt(res.data.brandId)
           })
         },
         deleteGoodsKind(commodityId){
             var that = this
             this.$confirm('相关商品表里的数据也会被相应删除,确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                 api.deleteCommodityType(commodityId,function(res){
                     if(res.code == 200)
                     {
                         that.showTips(res.data,'success')
                         that.getCommodityTypeList()
                         that.getCommodityTypeNames()
                     }
                     else{
                         that.showTips(res.msg,'warning')
                     }
                 })
        }).catch(() => {
            that.showTips('已取消删除','info')
           })
         },
         newAdd(){
             this.isAdd = true
             this.isEdit = false
             this.isDisabled = false
             this.goodsKindDialogTitle = '商品类别-新增'
             this.goodsKindOpreDialog = true
             if(this.$refs.goodsKindForm){
               this.$refs.goodsKindForm.clearValidate()
             }
             this.remotecommodityTypeData = {}
             this.goodsKindForm = Object.assign({},defaultGoodsKindForm)
         },
         submitForm(){
             var that = this
             this.$refs.goodsKindForm.validate((valid) => {
                    if (valid) {
                        var param = {
                                commodityTypeId:that.goodsKindForm.commodityTypeId,
                                commodityTypeName:that.goodsKindForm.commodityTypeName,
                                commodityTypeNumber:that.goodsKindForm.commodityTypeNumber,
                        }
                        api.checkNumber(that.goodsKindForm.commodityTypeNumber,function(res){
                            that.goodsKindForm.commodityTypeNumber == that.remotecommodityTypeData.commodityTypeNumber ? res.data = true : ''
                            if(res.data)
                            {
                                 api.checkName(that.goodsKindForm.commodityTypeName,function(res){
                                    that.goodsKindForm.commodityTypeName == that.remotecommodityTypeData.commodityTypeName ? res.data = true : ''
                                    if(res.data)
                                    {
                                        if(that.isAdd)
                                        {
                                            api.addCommodityType(param,function(res){
                                                res.code === 200 ? (that.showTips(res.data,'success') ,that.getCommodityTypeList(),that.getCommodityTypeNames()): that.showTips(res.msg,'warning')
                                            })
                                        }
                                        else{
                                            api.updateCommodityTypeById(param,function(res){
                                                res.code === 200 ? (that.showTips(res.data,'success') ,that.getCommodityTypeList()): that.showTips(res.msg,'warning')
                                            })
                                        }
                                            that.$refs.goodsKindForm.clearValidate()
                                            that.goodsKindOpreDialog = false
                                    }
                                    else{
                                        that.showTips('商品类别名称不能重复','warning')
                                    }
                                })
                            }
                            else{
                                that.showTips('商品类别编码不能重复','warning')
                            }
                        })
                    } else {
                        return false;
                    }
            });
         },
         getBrandByIdNames(){
            var that = this
            api.getBrandByIdNames(function(res){
                that.brandOptions = []
                res.data.forEach(function(item,index){
                    that.brandOptions.push({value:item.id,label:item.name})
                })
            })
          },
         getCommodityTypeNames(){
           var that = this
           api.getCommodityTypeNames(function(res){
               that.kindTypeOption = []
                that.kindTypeOption.push({
                    value:'',
                    label:'请选择'
                })
                for(let index of res.data)
                {
                    that.kindTypeOption.push({
                        value:index,
                        label:res.data[index]
                    })
                }
           })
         },
         getCommodityTypeList(){
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
                   name:'commodityTypeName',
                   value:this.commodityTypeName
               }]
             api.getCommodityTypeList(this.common.joinSearchParam(param),function(res){
                 that.tableDataGkind = []
                 if(res.code === 200)
                 {
                    that.tableDataGkind = res.data.list
                    that.totalRecords= res.data.totalRecords
                 }
                 else if(res.code != 404)
                 {
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
<style scoped  lang="scss" >
  .topContent {
    padding: 20px;
    background-color: white;
    margin-bottom: 20px;
  }
  .pagination {
    text-align: right;
    padding: 20px;
  }
  .deleteColor {
    color: #F56C6C;
  }
  .bottomContent{
    background-color: white;
    .cbBContentRight {
        float: right;
        text-align: right;
        margin-top: 20px;
        margin-right: 30px;
        margin-bottom: 20px;
    }
  }
  .el-dialog .el-form .paramItem{
         .el-form-item {
             width: 96%
         }
     }

</style>
