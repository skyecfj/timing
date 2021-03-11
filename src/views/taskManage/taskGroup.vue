<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">任务组</div>
                <el-input v-model="groupName" size="small" clearable placeholder="请输入任务组"></el-input>
            </div>
            <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="reset"  class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
                <el-button size="small"   @click="newAdd" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableDataTaskGroup" style="width: 100%" border>
                <el-table-column type="index" label="ID" width="50px">
                </el-table-column>
                <el-table-column prop="groupName" label="组名" min-width="60px">
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="80px">
                </el-table-column>
                <el-table-column prop="modifiedUser" label="最近修改人" min-width="50px">
                </el-table-column>
                <el-table-column prop="modifiedTime" label="最近修改时间" min-width="50px" sortable>
                </el-table-column>
                <el-table-column label="操作" width="220px">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="查看执行记录" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click.native.prevent="viewDetails(scope.row)"><i class="fa fa-toolbox"></i></el-button>
                        </el-tooltip>
                        <el-button @click="executeTask(scope.row.id)" type="text">批量执行</el-button>
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
        <el-dialog :visible.sync="taskGroupDialog" class="dialogContent" width="70%">
            <div slot="title">
                {{taskGroupDialogTitle}}
            </div>
            <el-form :model="taskGroupForm" label-width="110px" :rules="rules" ref="taskGroupForm">
                <el-form-item label="组名" prop="groupName">
                    <el-input size="small"  v-model="taskGroupForm.groupName" clearable  placeholder="请输入组名" ></el-input>
                </el-form-item>
                <div>
                    <el-form-item label="描述" prop="description">
                        <el-input size="small"  v-model="taskGroupForm.description" clearable  :autosize="{minRows:8}"
                        placeholder="请输入(1-100位)" type="textarea" :maxlength="100"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="关联任务">
                         <el-select size="small"  v-model="taskGroupForm.taskIds" placeholder="请选择" filterable multiple>
                            <el-option
                                    v-for="item in relyTasksOption"
                                    :key="item.code"
                                    :label="item.message"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="taskGroupDialog = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  @click="newAddForm()" class="c-button c-button--primary">保存</el-button>
            </div>
        </el-dialog>
        <!--新增-->
        <!--执行-->
        <el-dialog title="批量执行" :visible.sync="dialogFormVisibleAC" class="dialogContent executeDialog" width="70%">
            <el-form :model="formAC" ref="formAC">
                <el-form-item label="参数 :" label-width="80px" >
                    <el-input size="small"  type="textarea" v-model="formAC.param" :autosize="{ minRows: 4}" >
                    </el-input>
                </el-form-item>
                <span class="tip">批量执行只执行非数据源接入任务</span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="dialogFormVisibleAC = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="submitFormExecute()" class="c-button c-button--primary">确定</el-button>
            </div>
        </el-dialog>
        <!--执行-->
    </div>
</template>
<script>
import api from '../../model/api'
const defaultTaskGroupForm = {
    groupName:'',
    description:'',
    taskIds:[]
}
 export default {
     name:'taskGroup',
     data(){
         var validRemark = (rule, value, callback) => {
            if (!this.common.validSpecificSym(value)) {
                callback(new Error('不能输入特殊字符'));
            }else{
                callback()
            }
        };
        return {
         dialogFormVisibleAC:false,
         groupName:'',
         relyTasksOption:[],
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         pageLogSize:25,
         isAdd:false,
         taskGroupDialog:false,
         taskGroupDialogTitle:'',
         taskGroupForm: Object.assign({},defaultTaskGroupForm) ,
         tableDataTaskGroup:[],
         rules: {
          groupName: [
            { required: true, message: '组名不能为空', trigger: 'blur' }
          ],
          description: [
              { validator: validRemark, trigger: 'blur'}
          ]
        },
        formAC:{
            param:'{}',
            finalResultEnable:1,
            groupId:''
        }
       }
    },
    beforeMount(){
      this.getTaskGroupList()
      var that = this
    },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getTaskGroupList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getTaskGroupList();
         },
         search(){
             this.getTaskGroupList();
         },
         reset(){
           this.currentPage = 1
           this.groupName = ''
         },
         viewDetails(row){
          var taskIds = []
          var that = this
          api.getTaskGroupIds(row.id,function(res){
               if(res.code == 200){
                   if(that.common.isNullString(res.data.taskIds) || res.data.taskIds == '[]')
                   {
                       that.common.warningMessage('任务组没有配置任务')
                   }else{
                       that.$router.push({name: 'taskDetailList',query:{taskId:res.data.taskIds},params:{parentRoute:that.$route.fullPath}})
                   }
               }else{
                   that.common.warningMessage(res.msg)
               }
           })
         },
         executeTask(rowId){
             if(this.$refs.formAC){
                 this.$refs.formAC.clearValidate()
             }
             this.formAC.param = '{}'
             this.dialogFormVisibleAC = true
             this.formAC.groupId = rowId
         },
         submitFormExecute(){
             var that = this
             api.batchExecuteTaskGroup(this.formAC,function(res){
               res.code == 200 ? (that.common.successMessage(res.data),that.dialogFormVisibleAC = false):(that.common.warningMessage(res.msg),that.dialogFormVisibleAC = false)
             })
         },
         checkDetail(row,isEdit){
           var that = this
           this.isAdd = false
           this.taskGroupDialogTitle = isEdit ? '任务组-编辑':'任务组-详情';
           this.taskGroupDialog = true
           if(this.$refs.taskGroupForm){
                 this.$refs.taskGroupForm.clearValidate()
           }
           api.getPageSearch(3, function (res){
              that.relyTasksOption = res.data.task
           })
           api.getTaskGroupIds(row.id,function(res){
               if(that.common.isNullString(res.data.taskIds)){
                   res.data.taskIds = []
               }
               that.taskGroupForm = res.data
           })
         },
         deleteRow(taxGroupId){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                api.deleteTaskGroup(taxGroupId,function(res){
                 res.code == 200 ? (that.showTips(res.data,'success'), that.getTaskGroupList()): that.showTips(res.msg,'warning')
               })
        }).catch(() => {
             this.common.messageUtil({
                type: 'info',
                message: '已取消删除'
               });
            });
         },
         newAdd(){
             var that = this
             this.isAdd = true
             this.taskGroupDialogTitle = '任务组-新增'
             this.taskGroupDialog = true
             if(this.$refs.taskGroupForm){
                 this.$refs.taskGroupForm.clearValidate()
             }
             api.getPageSearch(3, function (res){
              that.relyTasksOption = res.data.task
             })
             this.taskGroupForm = Object.assign({},defaultTaskGroupForm)
         },
         newAddForm(){
             var that = this
              this.$refs.taskGroupForm.validate((valid) => {
                    if (valid) {
                        if(that.isAdd){
                            api.addTaskGroup(that.taskGroupForm,function(res){
                            res.code === 200 ? (that.showTips(res.data,'success') ,that.getTaskGroupList()): that.showTips(res.msg,'warning')
                            })
                        }
                        else{
                            api.updateTaskGroup(that.taskGroupForm,function(res){
                            res.code === 200 ? (that.showTips(res.data,'success') ,that.getTaskGroupList()): that.showTips(res.msg,'warning')
                            })
                        }
                        that.$refs.taskGroupForm.clearValidate()
                        that.taskGroupDialog = false
                    } else {
                        return false;
                    }
            });
         },
         getTaskGroupList(){
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
                    name:'groupName',
                    value:this.groupName
                }]
                console.log('paramparam',param)
               api.getTaskGroupList(this.common.joinSearchParam(param),function(res){
                        that.tableDataTaskGroup = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.tableDataTaskGroup = res.data.list;
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
    .dialogContent .el-dialog .el-form .el-form-item {
        width:95%
    }
    .tip{
        color:#F72E62;
        margin-left: 80px;
        font-size:12px;
    }
    .executeDialog{
        .el-form-item{
            margin-bottom:5px
        }
    }
</style>
