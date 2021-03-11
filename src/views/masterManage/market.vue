<template>
    <div class="mainContent">
        <div class="searchContent">
        <div class="selectContent">
          <div class="selectTitle">市场中文名称</div>
          <el-select size="small"  v-model="marketName" placeholder="请选择" filterable>
            <el-option v-for="item in marketNameOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
         </el-select>
        </div>
        <div class="selectContent">
          <div class="selectTitle">市场类别</div>
          <el-select size="small"  v-model="marketCategory" placeholder="请选择" filterable>
            <el-option v-for="item in marketAllCategoryOption" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
            </el-option>
         </el-select>
        </div>
        <el-button size="small"  @click="search" class="c-button c-button--primary">查询</el-button>
        <el-button size="small"  @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
              <el-button size="small"   @click="newAdd" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableDataMarket"  style="width: 100%" border>
                <el-table-column prop="marketNumber" label="市场编号" min-width="50px">
                </el-table-column>
                <el-table-column prop="marketName" label="市场中文名称" min-width="80px">
                </el-table-column>
                <el-table-column prop="marketEnglishName" label="市场英文名称" min-width="50px">
                </el-table-column>
                <el-table-column prop="marketCategory" label="市场类别" min-width="50px">
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.marketId,true)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                         <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.marketId,false)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
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
         <!--详情-->
          <el-dialog  :visible.sync="marketOpreDialog" class="dialogContent" width="70%">
              <div slot="title">
                  {{marketDialogTitle}}
              </div>
            <el-form :model="marketForm"  label-width="105px" :rules="rules" ref="marketForm">
                <el-form-item label="市场编号" prop="marketNumber">
                    <el-input size="small"  v-model.trim="marketForm.marketNumber"  :placeholder="isDisabled?'':'请输入'" :disabled="isDisabled"></el-input>
                </el-form-item>
                <el-form-item label="市场中文名称" prop="marketName">
                    <el-input size="small"  v-model.trim="marketForm.marketName"  :placeholder="isDisabled?'':'请输入'" :disabled="isDisabled" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="市场英文名称" prop="marketEnglishName">
                    <el-input size="small"  v-model.trim="marketForm.marketEnglishName"  :placeholder="isDisabled?'':'请输入'" :disabled="isDisabled" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="市场类别" prop="marketCategory">
                    <el-select size="small"  v-model="marketForm.marketCategory" placeholder="请选择" filterable :disabled="isDisabled">
                        <el-option v-for="item in marketCategoryOption" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div>
                  <el-form-item label="备注" prop="remark">
                     <el-input size="small"  v-model.trim="marketForm.remark" :disabled="isDisabled"
                      :placeholder="isDisabled?'':'请输入(1-100位)'" type="textarea" :autosize="{minRows:6}" clearable :maxlength="100">
                      </el-input>
                  </el-form-item>
                </div>
                <el-form-item label="更新时间" v-if="!isAdd">
                    <el-date-picker v-model="marketForm.modifiedTime" type="datetime" placeholder="" clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人" v-if="!isAdd">
                    <el-input size="small"  v-model.trim="marketForm.modifiedUser" disabled></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="marketOpreDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="newAddForm()" class="c-button c-button--primary">保存</el-button>
            </div>
          </el-dialog>
        <!--详情-->
    </div>
</template>
<script>
import api from '../../model/api'
const defaultMarketForm = {
          marketNumber:'',
          marketName:'',
          marketEnglishName:'',
          marketCategory:''
    }
 export default {
     name:'market',
     data(){
         var validRemark = (rule, value, callback) => {
            if (!this.common.validSpecificSym(value)) {
                    callback(new Error('不能输入特殊字符'));
            }else{
                    callback()
            }
         };
        var validName = (rule, value, callback) => {
            if (/^[\u4e00-\u9fa5]+$/.test(value)) {
                callback(new Error('只能输入数字、字母和特殊字符'));
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
         brandType:'',
         marketOpreDialog:false,
         marketDialogTitle:'',
         marketForm: Object.assign({},defaultMarketForm) ,
         originalMarketForm:{},
         tableDataMarket:[],
         marketName:"",
         marketNameOption:[],
         marketCategory:"",
         marketAllCategoryOption:[],
         marketCategoryOption:[],
         rules:{
             remark:[{validator:validRemark,tigger:'bulr'}],
             marketNumber:[{required: true, message: '市场编号不能为空', trigger: 'blur'}],
             marketName:[{required: true, message: '市场中文名称不能为空', trigger: 'blur'}],
             marketEnglishName:[{required: true, message: '市场英文名称不能为空', trigger: 'blur'},
             { validator: validName, trigger: 'blur'}],
             marketCategory:[{required: true, message: '请选择市场类别', trigger: ['blur','change']},
             { validator: validName, trigger: 'blur'}]
         },
         isDisabled:false,
         isAdd:false
       }
    },
    beforeMount(){
        this.getMarketList()
        this.getCondtion()
        this.getMarketName()
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getMarketList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getMarketList()
         },
         search(){
             this.currentPage = 1
             this.getMarketList()
         },
         reset(){
           this.marketName = ''
           this.marketCategory = ''
           this
         },
         newAdd(){
           var that = this
           this.isDisabled = false
           this.isAdd = true
           this.marketDialogTitle = '市场-新增'
           this.marketOpreDialog = true
           this.marketForm = {}
           this.originalMarketForm = {}
           if(this.$refs.marketForm){
               this.$refs.marketForm.resetFields()
           }

         },
         newAddForm(){
            delete this.marketForm.modifiedUser
            delete this.marketForm.modifiedTime
            var that = this
            var isSubmit = false
            this.$refs.marketForm.validate((valid) => {
                if (valid) {
                    api.checkMarketNumber(that.marketForm.marketNumber,function(res){
                        if(res.code == 200){
                            isSubmit = (that.marketForm.marketId && that.originalMarketForm.marketNumber == that.marketForm.marketNumber) ?  true : res.data
                            if(isSubmit){
                                if(that.marketForm.marketId){
                                    api.updateMarketById(that.marketForm,function(res){
                                        res.code === 200 ? (that.common.successMessage(res.data) ,
                                        that.getMarketList(),
                                        that.getMarketName(),
                                        that.marketOpreDialog = false
                                        ): that.common.warningMessage(res.msg)
                                    })
                                }else{
                                    api.insertMarket(that.marketForm,function(res){
                                        res.code === 200 ? (that.common.successMessage(res.data) ,
                                        that.getMarketList(),
                                        that.getMarketName(),
                                        that.marketOpreDialog = false
                                        ): that.common.warningMessage(res.msg)
                                    })
                                }
                            }else{
                                that.common.warningMessage('该市场编号已经存在')
                            }
                        }else{
                            that.common.warningMessage(res.msg)
                        }
                    })

                }else{
                    return false
                }
            })
         },
         checkDetail(marketId,isDisabled){
           var that = this
           this.isDisabled = isDisabled
           this.isAdd = false
           this.marketDialogTitle = isDisabled ? '市场-详情' :'市场-编辑'
           this.marketOpreDialog = true
           if(this.$refs.marketForm){
               this.$refs.marketForm.resetFields()
           }
           api.getMarketById(marketId,function(res){
              that.marketForm = res.data
              that.originalMarketForm = Object.assign({},res.data) ,
              that.marketForm.marketCategory = that.common.isNullString(that.marketForm.marketCategory) ?
              that.marketForm.marketCategory: parseInt(that.marketForm.marketCategory)
          })
         },
         getMarketName(){
             var that = this
             that.marketNameOption = []
             api.getMarketNames(function(res){
                that.marketNameOption.push({
                    value:'',
                    label:'请选择'
                })
                for(let index of res.data)
                {
                    that.marketNameOption.push({
                        value:index,
                        label:index
                    })
                }
             })
         },
         getCondtion(){
             var that = this
             api.getDictionaryByNumber('MARKETTYPE',function(res){
                   if(res.code == 200){
                      that.marketCategoryOption = Object.assign({},res.data)
                      res.data.unshift({id:'',dictionaryEntryName:'请选择',dictionaryEntryCode:''})
                      that.marketAllCategoryOption = res.data
                   }
            })
         },
         getMarketList(){
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
                    name:'marketCategory',
                    value:this.marketCategory
               },
               {
                    name:'marketName',
                    value:this.marketName
               }]
             api.getMarketList(this.common.joinSearchParam(param),function(res){
                    that.tableDataMarket = [];
                    that.totalRecords = 0
                    if(res.code == 200)
                    {
                        that.tableDataMarket = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                    else if(res.code != 404){
                        that.common.messageUtil({
                            message: text,
                            type: type
                        });
                    }
             })
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
