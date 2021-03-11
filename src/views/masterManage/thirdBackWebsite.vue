<template>
    <div class="thirdBackWebsite">
        <div class="search-content" >
            <div class="selectContent">
                <div class="selectTitle">网站名称</div>
                <el-input size="small" v-model.trim="siteName" placeholder="请输入" :maxlength="50" clearable></el-input>
            </div>
            <el-button size="small"  type="success" class="findButt" @click="getData">查询</el-button>
            <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content" >
            <div class="viewButton">
                <el-button size="small"  @click="openDetailDialog()" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="dynamicData" style="width: 100%" border>
                <el-table-column prop="siteName" label="网站名称" min-width="60px">
                </el-table-column>
                <el-table-column prop="website" label="网址" min-width="60px" sortable>
                </el-table-column>
                <el-table-column prop="account" label="账号" min-width="50px">
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="openDetailDialog(scope.row.id,'detail')"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="openDetailDialog(scope.row.id,'edit')" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" :page-sizes="pageSizesList">
                </el-pagination>
            </div>
        </div>
        <el-dialog :title="dialogFormVisibleTitle" :visible.sync="dialogFormVisible"  class="dialogContent" width="70%">
            <el-form :model="form" label-width="100px" ref="thirdWebsiteForm" :rules="rules">
                <el-form-item label="网站名称" prop="siteName">
                    <el-input type="textarea" autosize resize='none' v-model.trim="form.siteName"  clearable size="small" :placeholder="isDisabled?'':'请输入'" :disabled="isDisabled" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="网址" prop="website">
                    <el-input type="textarea" autosize resize='none' v-model.trim="form.website" clearable size="small" :placeholder="isDisabled?'':'请输入'" :disabled="isDisabled" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input type="textarea" autosize resize='none' v-model.trim="form.account" clearable size="small" :placeholder="isDisabled?'':'请输入'" :disabled="isDisabled" :maxlength="50"></el-input>
                </el-form-item>
                <div>
                    <el-form-item label="备注" prop="remarks">
                    <el-input size="small" type="textarea" v-model="form.remarks" :disabled="isDisabled" :placeholder="isDisabled?'':'请输入(1-100位)'"
                    :maxlength="100" :autosize="{minRows:4,maxRows:10}">
                    </el-input>
                </el-form-item>
                </div>
                <div v-if="isEdit || isDisabled">
                    <el-form-item label="更新时间" >
                    <el-input v-model.trim="form.modifiedTime"  size="small" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="更新人">
                        <el-input v-model.trim="form.modifiedUser"  size="small" disabled></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="editDialog">
                <el-button size="small" @click="dialogFormVisible = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small" type="primary" @click="submitInfo" class="c-button c-button--primary">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import originalTable from'../restaurant/BOHDataMg/originalTable'
    import api from '../../model/api'
    const  defaultForm={
            account:'',
            siteName:'',
            website:'',
            remarks:''
        };
    export default {
        name: "thirdBackWebsite",
        components:{
            originalTable
        },
        data(){
            var validRemark = (rule, value, callback) => {
                if (!this.common.validSpecificSym(value)) {
                    callback(new Error('不能输入特殊字符'));
                }else{
                    callback()
                }
            };
            return{
                dynamicData:[],
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords:0,
                account:'',
                legalCompany:'',
                dialogFormVisible:false,
                dialogFormVisibleTitle:'',
                formLabelWidth: '110px',
                isFestivalCash:false,
                isWeekendCash:false,
                isFestivalAccount:false,
                isWeekendAccount:false,
                status:false,
                editDialog:false,
                form:Object.assign({},defaultForm),
                originForm:{},
                siteName:'',
                isDisabled:false,
                isEdit:false,
                rules:{
                    siteName:[
                        {required: true, message: '网站名称不能为空', trigger: 'blur'}
                    ],
                    website:[
                        {required: true, message: '网址不能为空', trigger: 'blur'}
                    ],
                    account:[
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    remarks:[{ validator: validRemark, trigger: 'blur'}]
                }
            }
        },
        beforeMount(){
            this.getData()
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getData(){
                var that = this
                var param = [
                 {
                    name:'pageIndex',
                    value:this.currentPage
                 },
                 {
                    name:'pageSize',
                    value:this.pageSize
               },{
                   name:'siteName',
                   value:this.siteName
               }
               ]
               api.getThirdRefundPlatformList(this.common.joinSearchParam(param),function(res){
                        that.dynamicData = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.dynamicData = res.data.list;
                             that.totalRecords = res.data.totalRecords;
                        }
                        else if(res.code != 404){
                            that.common.warningMessage(res.msg)
                        }
               })
            },
            reset(){
               this.siteName = '';
            },
            openDetailDialog(rowId,type) {
                this.form = Object.assign({},defaultForm);
                this.dialogFormVisible = true;
                if(type === 'detail'){
                    this.dialogFormVisibleTitle = '第三方退款平台-详情';
                    this.editDialog = false;
                    this.isDisabled = true
                    this.isEdit = false
                    this.getThirdRefundPlatformDetail(rowId)
                }else if(type === 'edit'){
                    this.dialogFormVisibleTitle = '第三方退款平台-编辑';
                    this.editDialog = true;
                    this.isDisabled = false
                    this.isEdit = true
                    this.getThirdRefundPlatformDetail(rowId)
                }else{
                    this.dialogFormVisibleTitle = '第三方退款平台-新增';
                    this.editDialog = true;
                    this.isDisabled = false
                    this.isEdit = false
                    this.originForm = {}
                }
                if(this.$refs.thirdWebsiteForm){
                    this.$refs.thirdWebsiteForm.clearValidate()
                }
            },
            deleteRow(rowId){
                var that = this
                this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteThirdRefundPlatform(rowId,function(res){
                        res.code == 200 ? (that.common.successMessage(res.data), that.getData()): that.common.warningMessage(res.msg)
                        that.dialogFormVisible = false
                    })
                }).catch(() => {
                    that.common.infoMessage('已取消删除')
              })
            },
            getThirdRefundPlatformDetail(rowId){
                var that = this
                api.getThirdRefundPlatformDetail(rowId,function(res){
                    if(res.code == 200){
                        that.form = res.data
                        that.originForm = Object.assign({},res.data)
                    }else{
                        that.common.warningMessage(res.msg)
                    }
                })
            },
            submitInfo(){
                var that = this
                var isSubmit = false
                delete this.form.modifiedTime
                delete this.form.modifiedUser
                this.$refs.thirdWebsiteForm.validate((valid) => {
                    if (valid) {
                         //检查是否重名
                        api.checkThirdRefundPlatformSiteName(that.form.siteName,function(res){
                            if(res.data){
                                isSubmit = res.data
                            }else{//重名
                                //但是是编辑
                                isSubmit = that.originForm.siteName == that.form.siteName ? true : res.data
                            }
                            if(isSubmit){
                                if(that.form.id){
                                    api.updateThirdRefundPlatform(that.form,function(res){
                                    res.code == 200 ? (that.common.successMessage(res.data), that.getData()): that.common.warningMessage(res.msg)
                                    })
                                }else{
                                    api.insertThirdRefundPlatform(that.form,function(res){
                                    res.code == 200 ? (that.common.successMessage(res.data), that.getData()): that.common.warningMessage(res.msg)
                                    })
                                }
                                that.dialogFormVisible = false
                          }else{
                                that.common.warningMessage('该网站名称已经存在')
                          }
                        })
                    }else{
                        return false
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
    .viewButton{
        text-align:right;
        margin-bottom:15px;
    }
</style>
