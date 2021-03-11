<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">商品类别</div>
                <el-input size="small"  v-model.trim="productCategory" placeholder="请输入商品类别" clearable></el-input>
            </div>
            <el-button size="small"   @click="searchBrand" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
                <el-button size="small"   @click="newAdd" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="productCategory" label="商品类别">
                </el-table-column>
                <el-table-column prop="productNameKey" label="关键词">
                </el-table-column>
                <el-table-column prop="recommendIndex" label="推荐顺序">
                </el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间" width="150px">
                </el-table-column>
                <el-table-column prop="modifiedUser" label="更新人" width="100px">
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.id,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   @click="checkDetail(scope.row.id,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
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
        <el-dialog :visible.sync="tmProductCategoryDialog" class="dialogContent" width="70%">
            <div slot="title">
                {{tmProductCategoryTitle}}
            </div>
            <el-form :model="tmProductCategoryForm" label-width="110px" ref="tmProductCategoryForm" :rules="rules">
                <el-form-item label="商品类别" prop="productCategory">
                    <el-input size="small"  v-model.trim="tmProductCategoryForm.productCategory" clearable :disabled="isDisabled" :maxlength="10" :placeholder="isDisabled?'':'请输入商品类别'"></el-input>
                </el-form-item>
                <el-form-item label="关键词" prop="productNameKey">
                    <el-input size="small"  v-model.trim="tmProductCategoryForm.productNameKey" clearable :disabled="isDisabled" :maxlength="10" :placeholder="isDisabled?'':'请输入关键词'"></el-input>
                </el-form-item>
                <el-form-item label="推荐顺序" prop="recommendIndex">
                    <el-input size="small"  v-model.trim="tmProductCategoryForm.recommendIndex" clearable :disabled="isDisabled" :maxlength="10" :placeholder="isDisabled?'':'请输入推荐顺序'"></el-input>
                </el-form-item>
                <el-form-item label="更新时间" v-if="!isAdd">
                    <el-date-picker v-model="tmProductCategoryForm.modifiedTime" type="datetime" placeholder="" clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人" v-if="!isAdd">
                    <el-input size="small"  v-model.trim="tmProductCategoryForm.modifiedUser" disabled></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="tmProductCategoryDialog = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  @click="submitForm('tmProductCategoryForm')" class="c-button c-button--primary">保 存</el-button>
            </div>
        </el-dialog>
        <!--新增-->
    </div>
</template>
<script>
 import api from '../../model/api'
 export default {
     name:'tmProduct',
     data(){
        return {
         productCategory:'',
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         brandType:'',
         isAdd:false,
         isDisabled:false,
         tmProductCategoryDialog:false,
         tmProductCategoryTitle:'',
         tmProductCategoryForm:{},
         tableData:[],
         orinaltmProductCategoryForm:{},
         brandNamesOption:[],
         orinalBrandNamesOption:[],
         rules:{
             productCategory:[
                 {required: true, message: '请输入商品类别', trigger: 'blur'}
             ],
             productNameKey:[
                 {required: true, message: '请输入关键词', trigger: 'blur'}
             ],
             recommendIndex:[
                 {required: true, message: '请输入推荐顺序', trigger: 'blur'}
             ]
         }
       }
    },
    beforeMount(){
        this.getTmProductCategoryList()
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getTmProductCategoryList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getTmProductCategoryList()
         },
         searchBrand(){
           this.currentPage = 1
           this.getTmProductCategoryList()
         },
         reset(){
           this.productCategory = ''
         },
         checkDetail(rowId,isEdit){
           var that = this
           this.isAdd = false
           this.isDisabled = !isEdit
           this.tmProductCategoryDialog = true
           if(this.$refs.tmProductCategoryForm){
               this.$refs.tmProductCategoryForm.resetFields()
           }
           this.tmProductCategoryTitle = isEdit ? '天猫商城类别-编辑':'天猫商城类别-详情'
           api.getTmProductCategoryById(rowId,function(res){
                that.tmProductCategoryForm = res.data
           })
         },
         deleteBrand(brandId){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                 api.deleteBrand(brandId,function(res){
                     if(res.code == 200)
                     {
                        that.showTips(res.data,'success')
                        that.getTmProductCategoryList()
                     }
                     else{
                         that.showTips(res.msg,'info')
                     }
                 })
        }).catch(() => {
            this.showTips('已取消删除','info')
           })
         },
         newAdd(){
            this.isAdd = true
            this.isDisabled = false
            this.tmProductCategoryForm = {}
            this.orinaltmProductCategoryForm = {}
            this.tmProductCategoryTitle = '天猫商城类别-新增'
            this.tmProductCategoryDialog = true
            if(this.$refs.tmProductCategoryForm){
               this.$refs.tmProductCategoryForm.resetFields()
           }
         },
         submitForm(tmProductCategoryForm){
             var that = this
             delete that.tmProductCategoryForm.modifiedTime
             delete that.tmProductCategoryForm.modifiedUser
             this.$refs[tmProductCategoryForm].validate((valid) => {
                    if (valid) {
                        if(that.isAdd){
                            api.insertTmProductCategory(that.tmProductCategoryForm,function(res){
                            res.code === 200 ? (that.showTips(res.data,'success') ,that.getTmProductCategoryList(),that.tmProductCategoryDialog = false): that.showTips(res.msg,'warning')
                            })
                        }
                        else{
                            api.updateTmProductCategory(that.tmProductCategoryForm,function(res){
                            res.code === 200 ? (that.showTips(res.data,'success') ,that.getTmProductCategoryList(),that.tmProductCategoryDialog = false): that.showTips(res.msg,'warning')
                            })
                        }
                    } else {
                        return false;
                    }
            });
         },
         getTmProductCategoryList(){
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
                   name:'productCategory',
                   value:this.productCategory
               }]
               api.getTmProductCategoryList(this.common.joinSearchParam(param),function(res){
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
           }
    }
 }
</script>
<style scoped lang="scss">
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

    .bottomContent {
        background-color: white;
        .cbBContentRight {
            float: right;
            text-align: right;
            margin-top: 20px;
            margin-right: 30px;
            margin-bottom: 20px;
        }
    }
</style>
