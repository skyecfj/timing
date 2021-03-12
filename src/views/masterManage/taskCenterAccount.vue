<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">标题</div>
                <el-input size="small"  v-model.trim="accountTitle" placeholder="请输入" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">用户名</div>
                <el-input size="small"  v-model.trim="userName" placeholder="请输入" clearable></el-input>
            </div>
            <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="reset"  class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
                <el-button size="small"   @click="newAdd" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="accountTitle" label="标题" min-width="60px">
                </el-table-column>
                <el-table-column prop="userName" label="用户名" min-width="60px">
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="80px">
                </el-table-column>
                <el-table-column prop="createUser" label="创建人" min-width="50px">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" min-width="50px" sortable>
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
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
        <el-dialog :visible.sync="accountDialog" class="accountDialogContent" :title="accountDialogTitle">
            <el-form :model="taskAccountForm"  :rules="rules" ref="taskAccountForm" label-width="80px">
                <el-form-item label="标题" prop="accountTitle">
                    <el-input size="small"  v-model.trim="taskAccountForm.accountTitle" :disabled="isDisabled" clearable  :placeholder="isDisabled?'':'请输入'" ></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input size="small"  v-model.trim="taskAccountForm.userName" :disabled="isDisabled" clearable  :placeholder="isDisabled?'':'请输入'" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="!isEdit">
                    <el-input size="small"  :type="oldPwdType" v-model="taskAccountForm.password" :disabled="isDisabled"
                     :placeholder="isDisabled?'':'请输入'" >
                    <span v-show="oldPwdType == 'text'" slot="suffix" @click="checkOldPwd" class="cursorPointer"><i  class="fa fa-eye" ></i></span>
                    <span v-show="oldPwdType == 'password'" slot="suffix" @click="checkOldPwd" class="cursorPointer"><i  class="fa fa-eye-slash" ></i></span>
                    </el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input size="small"  v-model.trim="taskAccountForm.description" :disabled="isDisabled" clearable :autosize="{minRows:4}" :placeholder="isDisabled?'':'请输入(1-100位)'" type="textarea" :maxlength="100"></el-input>
                </el-form-item>
                <div v-if="isEdit">
                    <el-button size="small"  @click="showPassword" type="text">修改密码</el-button>
                </div>
                <div v-if="isShowPassword" >
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input size="small"  :type="oldPwdType" v-model="taskAccountForm.oldPassword" :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'">
                         <span v-show="oldPwdType == 'text'" slot="suffix" @click="checkOldPwd" class="cursorPointer"><i  class="fa fa-eye" ></i></span>
                         <span v-show="oldPwdType == 'password'" slot="suffix" @click="checkOldPwd" class="cursorPointer"><i  class="fa fa-eye-slash" ></i></span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input size="small" :type="newPwdType" v-model="taskAccountForm.newPassword" :disabled="isDisabled"
                        :placeholder="isDisabled?'':'请输入'">
                         <span v-show="newPwdType == 'text'" slot="suffix" @click="checkNewPwd" class="cursorPointer"><i  class="fa fa-eye" ></i></span>
                         <span v-show="newPwdType == 'password'" slot="suffix" @click="checkNewPwd" class="cursorPointer"><i  class="fa fa-eye-slash" ></i></span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input size="small" :type="confirmPwdType" v-model="taskAccountForm.confirmPassword" :disabled="isDisabled"  :placeholder="isDisabled?'':'请输入'" >
                            <span v-show="confirmPwdType == 'text'" slot="suffix" @click="checkConfirmPwd" class="cursorPointer"><i  class="fa fa-eye" ></i></span>
                            <span v-show="confirmPwdType == 'password'" slot="suffix" @click="checkConfirmPwd" class="cursorPointer"><i  class="fa fa-eye-slash" ></i></span>
                        </el-input>
                    </el-form-item>
                </div>
                 <el-form-item label="更新时间" v-if="isDisabled || isEdit">
                    <el-input size="small"  v-model="taskAccountForm.modifyTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新人" v-if="isDisabled || isEdit">
                    <el-input size="small"  v-model="taskAccountForm.modifyUser" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="accountDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  @click="newAddForm()" class="c-button c-button--primary">保存</el-button>
            </div>
        </el-dialog>
        <!--新增-->
    </div>
</template>
<script>
import api from '../../model/api'
 export default {
     name:'taskCenterAccount',
     data(){
          var validOldPassword = (rule, value, callback) => {
            if ((!this.common.isNullString(this.taskAccountForm.confirmPassword) || !this.common.isNullString(this.taskAccountForm.newPassword))
            && this.common.isNullString(this.taskAccountForm.oldPassword)) {
                callback(new Error('旧密码不能为空'));
            }
            else{
                callback();
            }
         };
         var validNewPassword = (rule, value, callback) => {
            if ((!this.common.isNullString(this.taskAccountForm.oldPassword) || !this.common.isNullString(this.taskAccountForm.confirmPassword))
            && this.common.isNullString(this.taskAccountForm.newPassword))
            {
                callback(new Error('新密码不能为空'));
            }
            else if (!this.common.isNullString(this.taskAccountForm.confirmPassword) && this.taskAccountForm.confirmPassword != this.taskAccountForm.newPassword)
            {
                callback(new Error('新密码和确认密码不一致'));
            }
            else{
                callback();
            }
        };
        var validConfirmPassword = (rule, value, callback) => {
            if ((!this.common.isNullString(this.taskAccountForm.oldPassword) || !this.common.isNullString(this.taskAccountForm.newPassword))
            && this.common.isNullString(this.taskAccountForm.confirmPassword))  {
                callback(new Error('确认密码不能为空'));
            }
            else if (!this.common.isNullString(this.taskAccountForm.newPassword) && this.taskAccountForm.confirmPassword != this.taskAccountForm.newPassword) {
                callback(new Error('新密码和确认密码不一致'));
            }
            else{
                callback();
            }
        };

        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         pageLogSize:25,
         // userName:'',
         isDisabled:false,
         taxRateNumber:'',
         accountDialog:false,
         accountDialogTitle:'',
         taskAccountForm:{
             accountTitle:'',
             userName:'',
             password:'',
             description:'',
             oldPassword:'',
             newPassword:'',
             confirmPassword:'',
             modifyTime:'',
             modifyUser:''
         } ,
         tableData:[],
         rules: {
          accountTitle: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          oldPassword:[
            { validator: validOldPassword, trigger: 'blur'}
          ],
          newPassword:[
            { validator: validNewPassword, trigger: 'blur'}
          ],
          confirmPassword:[
            { validator: validConfirmPassword, trigger: 'blur'}
          ]
        },
        isEdit:false,
        isShowPassword:false,
        accountTitle:'',
        userName:'',
        confirmPassword:'',
        oldPwdType:'password',
        newPwdType:'password',
        confirmPwdType:'password'
       }
    },
    beforeMount(){
      this.getTaskAccountList()
    },
     methods:{
         checkOldPwd(){
             this.oldPwdType = this.oldPwdType == 'password' ? 'text':'password'
         },
         checkNewPwd(){
             this.newPwdType = this.newPwdType == 'password' ? 'text':'password'
         },
         checkConfirmPwd(){
             this.confirmPwdType = this.confirmPwdType == 'password' ? 'text':'password'
         },
         showPassword(){
             this.isShowPassword = !this.isShowPassword
         },
         handleSizeChange(val) {
              this.pageSize = val
              this.getTaskAccountList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getTaskAccountList();
         },
         search(){
             this.currentPage = 1
             this.getTaskAccountList();
         },
         reset(){
           this.accountTitle = ''
           this.userName = ''
         },
         checkDetail(rowId,isEdit){
           var that = this
           this.isShowPassword = false
           this.isEdit = isEdit
           this.accountDialogTitle = isEdit ? '任务中心账号-编辑':'任务中心账号-详情';
           this.isDisabled = !isEdit
           this.accountDialog = true
           this.oldPwdType = 'password'
           this.newPwdType = 'password'
           this.confirmPwdType = 'password'
           api.getTaskAccountDetail(rowId,function(res){
              that.taskAccountForm = res.data
              that.taskAccountForm.oldPassword = ''
              that.taskAccountForm.newPassword = ''
              that.taskAccountForm.confirmPassword = ''
           })
           if(this.$refs.taskAccountForm){
                 this.$refs.taskAccountForm.clearValidate()
           }

         },
         deleteRow(rowId){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                api.deleteTaskAccount(rowId,function(res){
                 res.code == 200 ? (that.showTips(res.data,'success'), that.getTaskAccountList()): that.showTips(res.msg,'warning')
               })
        }).catch(() => {
             this.common.messageUtil({
                type: 'info',
                message: '已取消删除'
               });
            });
         },
         newAdd(){
             this.isEdit = false
             this.isDisabled = false
             this.isShowPassword = false
             this.accountDialogTitle = '任务中心账号-新增'
             this.accountDialog = true
             this.oldPwdType = 'password'
             this.newPwdType = 'password'
             this.confirmPwdType = 'password'
             this.taskAccountForm = {}
             if(this.$refs.taskAccountForm){
                 this.$refs.taskAccountForm.clearValidate()
             }
         },
         newAddForm(){
             var that = this
             delete that.taskAccountForm.createUser
             delete that.taskAccountForm.createTime
             delete that.taskAccountForm.modifyTime
             delete that.taskAccountForm.modifyUser
              this.$refs.taskAccountForm.validate((valid) => {
                    if (valid) {
                        if(that.taskAccountForm.id){
                            if(!that.common.isNullString(that.taskAccountForm.oldPassword)){
                                that.taskAccountForm.password = that.taskAccountForm.oldPassword
                            }
                            api.updateTaskAccount(that.taskAccountForm,function(res){
                                 res.code === 200 ? (that.showTips(res.data,'success') ,that.getTaskAccountList(),
                                 that.accountDialog = false): that.showTips(res.msg,'warning')
                            })
                        }
                        else{
                            api.insertTaskAccount(that.taskAccountForm,function(res){
                                res.code === 200 ? (that.showTips(res.data,'success') ,that.getTaskAccountList(),
                                that.accountDialog = false): that.showTips(res.msg,'warning')
                            })
                        }
                    } else {
                        return false;
                    }
            });
         },
         getTaskAccountList(){
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
                    name:'accountTitle',
                    value:this.accountTitle
                 },
                 {
                    name:'userName',
                    value:this.userName
                 }
               ]
               api.getTaskAccountList(this.common.joinSearchParam(param),function(res){
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
    .accountDialogContent {
       .el-select {
                width: 80%
            }
            .el-textarea {
                width: 80%;
            }
            .el-input {
                width: 80%;
            }
    }

</style>
