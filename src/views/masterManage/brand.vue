<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">品牌英文名称</div>
                <el-input size="small"  v-model.trim="brandName" placeholder="请输入品牌英文名称" clearable></el-input>
            </div>
            <el-button size="small"   @click="searchBrand" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="resetBrand" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
                <el-button size="small"   @click="newAdd" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableDataBrand" style="width: 100%" border>
                <el-table-column prop="brandName" label="品牌名称" sortable>
                </el-table-column>
                <el-table-column prop="brandEnglishName" label="品牌英文名称" sortable>
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.brandId,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   @click="checkDetail(scope.row.brandId,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteBrand(scope.row.brandId)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip> -->
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
        <el-dialog :visible.sync="brandOpreDialog" class="dialogContent" width="70%">
            <div slot="title">
                {{brandDialogTitle}}
            </div>
            <el-form :model="brandForm" label-width="110px" ref="brandForm" :rules="rules">
                <el-form-item label="品牌名称" prop="brandName">
                    <el-input size="small"  v-model.trim="brandForm.brandName" clearable :disabled="isDisabled" :maxlength="30" :placeholder="isDisabled?'':'请输入品牌名称'"></el-input>
                </el-form-item>
                <el-form-item label="品牌英文名称"  prop="brandEnglishName">
                    <el-input size="small"  v-model.trim="brandForm.brandEnglishName" clearable :disabled="isDisabled || !isAdd" :maxlength="30" :placeholder="isDisabled?'':'请输入品牌英文名称'"></el-input>
                </el-form-item>
                <el-form-item label="归入品牌" prop="includeBrand">
                    <el-select v-model="brandForm.includeBrand" :placeholder="(isIncluedBrand || isDisabled)?'':'请选择归入品牌'" size="small" :disabled="isIncluedBrand || isDisabled" filterable>
                      <el-option v-for="item in brandNamesOption"  :key="item.id" :label="item.brandEnglishName" :value="item.brandId">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="brandForm.state"  size="small" :disabled="isDisabled" @change="changeState">
                        <el-radio :label="0">启用</el-radio>
                        <el-radio :label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="类型" prop="flag">
                     <el-select size="small"  v-model="brandForm.flag" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="备注" prop="remark">
                        <el-input size="small"  type="textarea" :autosize="{minRows:6,maxRows:10}" v-model="brandForm.remark"
                        :placeholder="isDisabled?'':'请输入(1-100位)'"
                        clearable :disabled="isDisabled" :maxlength="100"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="更新时间" v-if="!isAdd">
                    <el-date-picker v-model="brandForm.modifiedTime" type="datetime" placeholder="" clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人" v-if="!isAdd">
                    <el-input size="small"  v-model="brandForm.modifiedUser" disabled></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="brandOpreDialog = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  @click="submitForm('brandForm')" class="c-button c-button--primary">保 存</el-button>
            </div>
        </el-dialog>
        <!--新增-->
    </div>
</template>
<script>
 import api from '../../model/api'
 const  defaultBrandForm = {
     brandName:'',
     brandEnglishName:'',
     remark:'',
     includeBrand:'',
     state:0 // 0 启用  1禁用
 }
 export default {
     name:'brand',
     data(){
        var validBrandName = (rule, value, callback) => {
            if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)) {
                callback(new Error('只能输入数字、字母和汉字'));
            }
            else{
                callback()
            }
        };

        var validBrandEngLishName = (rule, value, callback) => {
            if (!/^[^\u4e00-\u9fa5]+$/.test(value)) {
                callback(new Error('不能输入汉字'));
            }
            else{
                callback()
            }
        };

        var validRemark = (rule, value, callback) => {
            if (!this.common.validSpecificSym(value)) {
                callback(new Error('不能输入特殊字符'));
            }else{
                callback()
            }
        };

        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         brandType:'',
         isAdd:false,
         isDisabled:false,
         brandOpreDialog:false,
         brandDialogTitle:'',
         brandForm:Object.assign({},defaultBrandForm),
         tableDataBrand:[],
         brandTypeOption:[],
         addbrandTypeOption:[],
         brandName:'',
         orinalBrandForm:{},
         brandNamesOption:[],
         orinalBrandNamesOption:[],
         isIncluedBrand:false,
         rules:{
             brandName:[
                 {required: true, message: '请输入品牌名称', trigger: 'blur'}
             ],
             brandEnglishName:[
                 {required: true, message: '请输入品牌英文名称', trigger: 'blur'},
                 { validator: validBrandEngLishName, trigger: 'blur'}
             ],
             remark:[
                 { validator: validRemark, trigger: 'blur'}
             ],
             state:[
                 {required: true, message: '请选择状态', trigger: 'blur'}
            ],
            flag:[
                 {required: true, message: '请选择类型', trigger: 'blur'}
            ]
         },
         typeOptions:[
                {
                    label:'餐厅业务',
                    value:1
                },
                {
                    label:'E-Com业务',
                    value:2
                },
                {
                    label:'餐厅业务及E-Com业务',
                    value:3
                },
            ],
       }
    },
    beforeMount(){
        this.getBrandList()
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getBrandList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getBrandList()
         },
         searchBrand(){
           this.currentPage = 1
           this.getBrandList()
         },
         resetBrand(){
           this.brandName = ''
         },
         changeState(val){
             this.brandNamesOption = val ? Object.assign({},this.orinalBrandNamesOption) :  []
             this.isIncluedBrand = val ? false : true
             if(!val){
                 this.brandForm.includeBrand = ''
             }
         },
         getBrandIdNames(){
             var that = this
             api.primeBrandList(function(res){
                 if(res.code == 200){
                     that.orinalBrandNamesOption = Object.assign({},res.data)
                     that.brandNamesOption = res.data
                 }else{
                     that.brandNamesOption  = []
                     that.orinalBrandNamesOption = []
                 }
             })
         },
         checkDetail(brandId,isEdit){
           var that = this
           this.isAdd = false
           this.isDisabled = !isEdit
           this.brandOpreDialog = true
           if(this.$refs.brandForm){
               this.$refs.brandForm.resetFields()
           }
           this.brandDialogTitle = isEdit ? '品牌-编辑':'品牌-详情'
           this.getBrandIdNames()
           api.getBrandById(brandId,function(res){
                that.brandForm = res.data
                that.orinalBrandForm = Object.assign({},res.data)
                that.isIncluedBrand = res.data.state ? false:true
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
                        that.getBrandList()
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
            this.brandForm = Object.assign({},defaultBrandForm)
            this.orinalBrandForm = {}
            this.brandDialogTitle = '品牌-新增'
            this.brandOpreDialog = true
            this.getBrandIdNames()
            this.isIncluedBrand = true
            if(this.$refs.brandForm){
               this.$refs.brandForm.resetFields()
           }
         },
         submitForm(brandForm){
             var that = this
             delete that.brandForm.modifiedTime
             delete that.brandForm.modifiedUser
             this.$refs[brandForm].validate((valid) => {
                    if (valid) {
                        var isSubmit = true
                        api.checkBrandEnglishName(that.brandForm.brandEnglishName,function(res){
                            if(res.code == 200){
                                isSubmit = res.data ? true :
                                (that.brandForm.brandId && that.orinalBrandForm.brandEnglishName == that.brandForm.brandEnglishName ? true :false)
                                if(!isSubmit) {
                                    that.showTips('品牌英文名称已存在,请检查','warning')
                                    return
                                }
                                    if(that.isAdd){
                                    api.addBrand(that.brandForm,function(res){
                                    res.code === 200 ? (that.showTips(res.data,'success') ,that.getBrandList()): that.showTips(res.msg,'warning')
                                    })
                                }
                                else{
                                    api.updateBrandById(that.brandForm,function(res){
                                    res.code === 200 ? (that.showTips(res.data,'success') ,that.getBrandList()): that.showTips(res.msg,'warning')
                                    })
                                }
                                that.$refs[brandForm].resetFields()
                                that.brandOpreDialog = false
                            }else{
                                that.common.warningMessage(res.msg)
                            }
                        })

                    } else {
                        return false;
                    }
            });
         },
         getBrandType(){
            var that = this
            api.getDictionaryByNumber('BRANDTYPE',function(res){
                that.brandTypeOption = []
                that.addbrandTypeOption = []
                res.data.forEach(function(item,index){
                    that.brandTypeOption.push(
                    {
                            value:that.common.isNullString(item.id) ?'' : parseInt(item.id),
                            label:item.dictionaryEntryName
                    }
                )
            })
            that.brandTypeOption.push({
                    value:'',
                    label:'全部'
                })
            res.data.forEach(function(item,index){
                    that.addbrandTypeOption.push(
                    {
                            value:that.common.isNullString(item.id) ?'' : parseInt(item.id),
                            label:item.dictionaryEntryName
                    }
                  )
               })
           })
         },
         getBrandList(){
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
                   name:'brandName',
                   value:this.brandName
               }]
               api.getAllBrandInfo(this.common.joinSearchParam(param),function(res){
                        that.tableDataBrand = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.tableDataBrand = res.data.list;
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
