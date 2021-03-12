<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
            <div class="selectTitle">第三方活动名称</div>
            <el-input size="small"  v-model.trim="activityName" clearable placeholder="请输入活动名称"></el-input>
            </div>
            <el-button size="small"  type="success" @click="search">查询</el-button>
            <el-button size="small"  type="success" @click="reset" plain>重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
              <el-button size="small"  type="success" @click="newAdd">新增</el-button>
            </div>
            <el-table :data="tableData"  style="width: 100%" border>
                <el-table-column prop="activityName" label="第三方活动名称" min-width="80px" sortable>
                </el-table-column>
                <el-table-column prop="bcPayCompany" label="BC付款公司" min-width="80px" sortable>
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.activityId,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.activityId,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.activityId)"><i class="fa fa-trash-alt"></i></el-button>
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
          <el-dialog  :visible.sync="reservationDialog" class="dialogContent" width="70%">
              <div slot="title">
                  {{reservationDialogTitle}}
              </div>
            <el-form :model="reservationForm"  label-width="110px" ref="reservationForm">
                <el-form-item label="活动名称" :rules="[{required: true, message: '请选择活动名称', trigger: 'blur'}]" prop="activityName">
                    <el-select size="small"  v-model="reservationForm.activityName" placeholder="品牌名称" clearable filterable :disabled="isDisabled">
                        <el-option v-for="item in activityNameOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="BC付款公司" :rules="[{required: true, message: '请选择BC付款公司', trigger: 'blur'}]" prop="bcPayCompany">
                   <el-select size="small"  v-model="reservationForm.bcPayCompany" placeholder="品牌名称" clearable filterable :disabled="isDisabled">
                        <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="FSC更新时间">
                    <el-date-picker v-model="reservationForm.modifiedTime" type="datetime" placeholder="请选择更新时间" clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人">
                    <el-input size="small"  v-model.trim="reservationForm.modifiedUser" clearable disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="reservationDialog = false"  class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  type="primary" @click="submitForm()"  class="c-button c-button--primary">保存</el-button>
            </div>
          </el-dialog>
        <!--新增-->
    </div>
</template>
<script>
 import api from '../../model/api'
 export default {
     name:'reservationList',
     data(){
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         activityName:'',
         isDisabled:false,
         reservationDialog:false,
         reservationDialogTitle:'',
         reservationForm: {},
         tableData:[],
         companyOptions:[],
         activityNameOptions:[]
       }
    },
    beforeMount(){
       this.getReservationList()
       this.getReservationOption()
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getReservationList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getReservationList()
         },
         search(){
           this.getReservationList()
         },
         reset(){
           this.activityName = ''
        //    this.getReservationList()
         },
         checkDetail(activityId,isEdit){
           var that = this
           this.isDisabled = !isEdit
           this.reservationDialogTitle = isEdit ? '预约单配置-编辑':'预约单配置-详情';
           this.reservationDialog = true
           if(this.$refs.reservationForm){
               this.$refs.reservationForm.clearValidate()
           }
           api.getReservationById(activityId,function(res){
                  that.reservationForm = res.data
           })
         },
         deleteRow(activityId){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                 api.deleteReservation(activityId,function(res){
                     if(res.code == 200)
                     {
                         that.showTips(res.data,'success')
                         that.getReservationList()
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
             this.isDisabled = false
             this.reservationDialogTitle = '预约单配置-新增'
             this.reservationDialog = true
             if(this.$refs.reservationForm){
               this.$refs.reservationForm.clearValidate()
             }
             this.reservationForm = {}
         },
         submitForm(){
             var that = this
             this.$refs.reservationForm.validate((valid) => {
                    if (valid) {
                        // console.log('that.reservationForm' + that.reservationForm)
                        // that.reservationForm.modifiedUser = 'one'
                        if(that.reservationForm.activityId)
                        {
                            api.updateReservation(that.reservationForm,function(res){
                                res.code === 200 ? (that.showTips(res.data,'success') ,that.getReservationList()): that.showTips(res.msg,'warning')
                            })

                        }
                        else{
                            api.addReservation(that.reservationForm,function(res){
                                res.code === 200 ? (that.showTips(res.data,'success') ,that.getReservationList()): that.showTips(res.msg,'warning')
                            })
                        }
                            that.$refs.reservationForm.clearValidate()
                            that.reservationDialog = false
                    } else {
                        return false;
                    }
            });
         },
         getReservationOption(){
            var that = this
            api.getReservationListbc(function(res){
                that.companyOptions = []
                res.data.forEach(function(item,index){
                    that.companyOptions.push({
                        value:item,
                        label:item
                    })
                })
           })
           api.getReservationListName(function(res){
               that.activityNameOptions = []
               res.data.forEach(function(item,index){
                    that.activityNameOptions.push({
                        value:item,
                        label:item
                    })
                })
           })
          },
         getReservationList(){
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
                   name:'activityName',
                   value:this.activityName
               }]
             api.getReservationList(this.common.joinSearchParam(param),function(res){
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
