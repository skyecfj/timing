<template>
    <div class="mainContent">
        <div class="searchContent">
        <div class="selectContent">
          <div class="selectTitle">业务类型名称</div>
          <el-select size="small"  v-model="businessType" placeholder="请选择" filterable>
            <el-option v-for="item in businessTypeOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
         </el-select>
        </div>
        <div class="selectContent">
          <div class="selectTitle">渠道</div>
          <el-select size="small"  v-model="channel" placeholder="请选择" filterable>
            <el-option v-for="item in channelOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
         </el-select>
        </div>
        <div class="selectContent">
          <div class="selectTitle">关键词</div>
          <el-input size="small"  v-model.trim="keyWords" placeholder="请选择查询关键词" clearable></el-input>
        </div>
        <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
        <el-button size="small"   @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
              <el-button size="small"  @click="newAdd" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableData"  style="width: 100%" border>
                <el-table-column prop="businessType" label="业务类型" min-width="60px">
                </el-table-column>
                <el-table-column prop="channel" label="渠道" min-width="60px">
                </el-table-column>
                <el-table-column prop="downloadMode" label="下载方式" min-width="50px">
                </el-table-column>
                <el-table-column prop="brand" label="品牌" min-width="40px">
                </el-table-column>
                <el-table-column prop="brand" label="法人公司" min-width="80px">
                </el-table-column>
                <el-table-column prop="type" label="类型" min-width="50px">
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.id ,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.id,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
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
          <el-dialog  :visible.sync="alipayDialog" class="dialogContent" width="70%">
              <div slot="title">
                  {{goodsKindDialogTitle}}
              </div>
            <el-form :model="alipayForm"  label-width="100px" :rules="rules" ref="alipayForm">
                <el-form-item label="业务类型" prop="businessType">
                    <el-select size="small"  v-model="alipayForm.businessType" placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled">
                        <el-option v-for="item in addBusinessTypeOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-select size="small"  v-model="alipayForm.channel" placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled">
                        <el-option v-for="item in addChannelOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="网址" prop="website">
                    <el-input size="small"  v-model.trim="alipayForm.website" clearable :disabled="isDisabled" :placeholer="isDisabled?'':'请输入网址地址'">
                        <template slot="prepend">https://</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="下载方式" prop="downloadMode">
                    <el-select size="small"  v-model="alipayForm.downloadMode" placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled">
                        <el-option v-for="item in downloadModeOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input size="small"  v-model.trim="alipayForm.account" clearable :disabled="isDisabled" :placeholer="isDisabled?'':'请输入账号'"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-select size="small"  v-model="alipayForm.brand" placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled">
                        <el-option v-for="item in brandOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="法人公司" prop="company">
                    <el-input size="small"  v-model.trim="alipayForm.company" clearable :disabled="isDisabled" :placeholer="isDisabled?'':'请输入法人公司'"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input size="small"  v-model.trim="alipayForm.type" clearable :disabled="isDisabled" :placeholer="isDisabled?'':'请输入类型'"></el-input>
                </el-form-item>
                <el-form-item label="更新时间" v-if="isDisabled || isEdit">
                    <el-date-picker v-model="alipayForm.modifiedTime" type="datetime" placeholder="" clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人" v-if="isDisabled || isEdit">
                    <el-input size="small"  v-model.trim="alipayForm.modifiedUser" clearable disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="alipayDialog = false" class="c-button--plain">取 消</el-button>
                <el-button size="small"   @click="submitForm()" class="c-button--primary">保存</el-button>
            </div>
          </el-dialog>
        <!--新增-->
    </div>
</template>
<script>
import api from '../../model/api'
const defaultalipayForm = {

    }
 export default {
     name:'alipay',
     data(){
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         businessType:'',
         channel:'',
         keyWords:'',
         isAdd:false,
         isEdit:false,
         isDisabled:false,
         alipayDialog:false,
         goodsKindDialogTitle:'',
         alipayForm: {},
         tableData:[],
         channelOption:[],
         addChannelOption:[],
         businessTypeOption:[],
         addBusinessTypeOption:[],
         brandOption:[],
         brand:'',
         downloadModeOption:[],
         downloadMode:'',
         rules:{
            businessType:[{required: true, message: '业务类型不能为空', trigger: 'blur'}],
            channel:[{required: true, message: '渠道不能为空', trigger: 'blur'}],
            downloadMode:[{required: true, message: '下载方式不能为空', trigger: 'blur'}],
            account:[{required: true, message: '账号不能为空', trigger: 'blur'}],
            brand:[{required: true, message: '品牌不能为空', trigger: 'blur'}],
            company:[{required: true, message: '法人公司不能为空', trigger: 'blur'}],
            type:[{required: true, message: '类型不能为空', trigger: 'blur'}],
            // website:[]
         }
       }
    },
    beforeMount(){
        this.getAlipayAccountRsList()
        this.getSearchOption()
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getAlipayAccountRsList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getAlipayAccountRsList()
         },
         search(){
           this.getAlipayAccountRsList()
         },
         reset(){
           this.channel = ''
           this.businessType = ''
           this.keyWords = ''
        //    this.getAlipayAccountRsList()
         },
         checkDetail(alipayId,isEdit){
           var that = this
           this.isAdd = false
           this.isEdit = isEdit
           this.isDisabled = !isEdit
           this.goodsKindDialogTitle = isEdit ? '支付宝账号与品牌渠道法人映射-编辑':'支付宝账号与品牌渠道法人映射-详情';
           this.alipayDialog = true
           if(this.$refs.alipayForm){
               this.$refs.alipayForm.clearValidate()
           }
           api.getAlipayAccountRsById(alipayId,function(res){
                  that.alipayForm = res.data
                  that.alipayForm.brand = that.common.isNullString(res.data.brand) ? '' : parseInt(res.data.brand)
                  that.alipayForm.channel = that.common.isNullString(res.data.channel)  ? '' : parseInt(res.data.channel)
                  that.alipayForm.downloadMode = that.common.isNullString(res.data.downloadMode)  ? '' : parseInt(res.data.downloadMode)
                  that.alipayForm.businessType = that.common.isNullString(res.data.businessType)  ? '' : parseInt(res.data.businessType)
           })
         },
         deleteRow(alipayId){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                 api.deleteAlipayAccountRs(alipayId,function(res){
                     if(res.code == 200)
                     {
                         that.showTips(res.data,'success')
                         that.getAlipayAccountRsList()
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
             this.goodsKindDialogTitle = '支付宝账号与品牌渠道法人映射-新增'
             this.alipayDialog = true
             if(this.$refs.alipayForm){
               this.$refs.alipayForm.clearValidate()
             }
             this.alipayForm = {}
         },
         submitForm(){
             var that = this
             this.$refs.alipayForm.validate((valid) => {
                    if (valid) {
                        var param = {
                            id:that.alipayForm.id,
                            account:that.alipayForm.account,
                            brand:that.alipayForm.brand,
                            businessType:that.alipayForm.businessType,
                            channel:that.alipayForm.channel,
                            company:that.alipayForm.company,
                            downloadMode:that.alipayForm.downloadMode,
                            type:that.alipayForm.type,
                            website:that.alipayForm.website
                        }
                        if(this.isAdd)
                        {
                            api.addAlipayAccountRs(param,function(res){
                                res.code === 200 ? (that.showTips(res.data,'success') ,that.getAlipayAccountRsList()): that.showTips(res.msg,'warning')
                            })
                        }
                        else{
                            api.updateAlipayAccountRs(param,function(res){
                                res.code === 200 ? (that.showTips(res.data,'success') ,that.getAlipayAccountRsList()): that.showTips(res.msg,'warning')
                            })
                        }
                        that.alipayDialog = false
                    }
                    else{
                        return false
                    }
             })
         },
         getSearchOption(){
           var that = this
           api.getDictionaryByNumber('BUSINESSTYPE',function(res){
                that.businessTypeOption = []
                that.addBusinessTypeOption = []
                that.businessTypeOption.push(
                        {
                            value:'',
                            label:'请选择'
                        })
                res.data.forEach(function(item,index){
                    that.businessTypeOption.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        })
                    that.addBusinessTypeOption.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        })
                })
            })

            api.getDictionaryByNumber('CHANNEL',function(res){
                that.channelOption = []
                that.addChannelOption = []
                that.channelOption.push(
                        {
                            value:'',
                            label:'请选择'
                        })
                res.data.forEach(function(item,index){
                    that.channelOption.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        })
                    that.addChannelOption.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        })
                })
            })

            api.getDictionaryByNumber('DOWNLOADWAY',function(res){
                that.downloadModeOption = []
                res.data.forEach(function(item,index){
                    that.downloadModeOption.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        })
                })
            })

             api.getBrandByIdNames(function(res){
                that.brandOption = []
                res.data.forEach(function(item,index){
                    that.brandOption.push(
                        {
                            value:item.id,
                            label:item.name
                        })
                })
             })
         },
         getAlipayAccountRsList(){
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
                   name:'businessType',
                   value:this.businessType
               },
               {
                   name:'channel',
                   value:this.channel
               },
               {
                   name:'keyWords',
                   value:this.keyWords
               }]
              api.getAlipayAccountRsList(this.common.joinSearchParam(param),function(res){
                 that.tableData = []
                 if(res.code === 200)
                 {
                    that.tableData = res.data.list
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


</style>
