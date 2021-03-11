<template>
    <div class="mainContent">
         <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">名称</div>
                <el-input v-model.trim="permissionName" placeholder="请输入" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">父节点</div>
                <el-select size="small"  v-model="parentNode" placeholder="请选择" filterable>
                    <el-option v-for="item in parentNodeAllOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">类型</div>
                <el-select size="small"  v-model="permissionType" placeholder="请选择" filterable>
                    <el-option v-for="item in typeAllOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button size="small"  @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"  @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
                <el-button size="small"  @click="newCreate" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="permissionName" label="名称" min-width="50px">
                </el-table-column>
                <el-table-column prop="parentNode" label="父节点" min-width="80px">
                </el-table-column>
                <el-table-column prop="permissionCode" label="权限代码" min-width="50px">
                </el-table-column>
                <el-table-column prop="permissionType" label="类型" min-width="50px">
                </el-table-column>
                <el-table-column prop="path" label="路径" min-width="50px">
                </el-table-column>
                <el-table-column label="操作" min-width="50px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="updateDetail(scope.row.permissionId,true)" v-if="scope.row.updateFlag == 0"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="updateDetail(scope.row.permissionId,false)" class="c-button-icon--primary--opacity c-button-icon-circle" v-if="scope.row.updateFlag == 1"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.permissionId)" v-if="scope.row.updateFlag == 1"><i class="fa fa-trash-alt"></i></el-button>
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
          <el-dialog  :visible.sync="permissionDialog" class="dialogContent" width="70%">
              <div slot="title">
                  {{permissionDialogTitle}}
              </div>
            <el-form :model="permissionForm"  label-width="100px" ref="permissionForm">
                <el-form-item label="名称" :rules="[{required: true, message: '名称不能为空', trigger: 'blur'}]" prop="permissionName">
                    <el-input size="small"  v-model.trim="permissionForm.permissionName" placeholder="请输入名称" clearable :disabled="isDisabled"></el-input>
                </el-form-item>
                <el-form-item label="父节点" :rules="[{required: true, message: '父节点不能为空', trigger: 'blur'}]" prop="parentNode">
                    <el-select size="small"  v-model="permissionForm.parentNode" placeholder="请选择" filterable :disabled="isDisabled">
                        <el-option v-for="item in parentNodeOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" :rules="[{required: true, message: '类型不能为空', trigger: 'blur'}]" prop="permissionType">
                    <el-select size="small"  v-model="permissionForm.permissionType" placeholder="请选择" filterable :disabled="isDisabled">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="路径" :rules="[{required: true, message: '路径不能为空', trigger: 'blur'}]" prop="path">
                    <el-input size="small"  v-model.trim="permissionForm.path" clearable :disabled="isDisabled" placeholder="请输入路径"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="permissionDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  @click="submitForm()" class="c-button c-button--primary">保存</el-button>
            </div>
          </el-dialog>
        <!--新增-->
    </div>
</template>
<script>
    import api from '../../model/api'
    export default {
        name:'permission',
        data(){
            return {
                isDisabled:false,
                isEdit:false,
                pageSizeList:[25, 50, 75, 100, 125],
                totalRecords:0,
                currentPage: 1,
                pageSize:25,
                marketName:'',
                updatePerson:'',
                permissionDialog:false,
                permissionDialogTitle:'',
                permissionForm:{},
                originalPermissionForm:{},
                parentNodeOption:[],
                typeOptions:[],
                parentNodeAllOption:[
                  {
                    value:'',
                    label:'请选择'
                  }
                ],
                typeAllOptions:[
                 {
                    value:'',
                    label:'请选择'
                 }
                ],
                tableData:[],
                permissionName:'',
                parentNode:'',
                permissionType:''
            }
        },
        beforeMount(){
            this.getPermissionList()
            this.getOption()
            this.getPermissionInfoListNode()
        },
        methods:{
            search(){
               this.currentPage = 1
               this.getPermissionList()
            },
            reset(){
                this.permissionName = ''
                this.parentNode = ''
                this.permissionType = ''
            },
            handleSizeChange(val){
                this.pageSize = val
                this.getPermissionList()
            },
            handleCurrentChange(val){
                this.currentPage = val
                this.getPermissionList()
            },
            getPermissionInfoListNode(){
                var that = this
                api.getPermissionInfoListNode(function(res){
                    that.parentNodeOption = []
                    that.parentNodeAllOption = [{value:'',label:'请选择'}]
                    res.data.forEach(function(item,index){
                        that.parentNodeOption.push({
                            value:item.id,
                            label:item.name
                        })
                        that.parentNodeAllOption.push({
                            value:item.id,
                            label:item.name
                        })
                    })
                })
            },
            getOption(){
                var that = this
                api.getDictionaryByNumber('PERMISSION',function(res){
                that.typeOptions = []
                res.data.forEach(function(item,index){
                    that.typeOptions.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        }
                    )
                    that.typeAllOptions.push(
                        {
                            value:item.id,
                            label:item.dictionaryEntryName
                        }
                    )
                  })
               })
            },
            getPermissionList(){
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
                    name:'permissionName',
                    value:this.permissionName
                },
                {
                    name:'parentNode',
                    value:this.parentNode
                },
                {
                    name:'permissionType',
                    value:this.permissionType
                }
            ]
            api.getPermissionInfoList(this.common.joinSearchParam(param),function(res){
                that.tableData = [];
                that.totalRecords = 0
                if(res.code == 200)
                {
                    that.tableData = res.data.list;
                    that.totalRecords = res.data.totalRecords;
                }
                else if(res.code != 404){
                    that.common.messageUtil({
                        message: text,
                        type: type
                    });
                }
             })
            },
            newCreate(){
                this.permissionForm = {}
                this.permissionDialogTitle = '功能权限-新增'
                this.isDisabled = false
                this.permissionDialog = true
                if(this.$refs.permissionForm){
                    this.$refs.permissionForm.clearValidate()
                }
            },
            updateDetail(id,isDisabled){
               var that = this
               this.permissionDialogTitle = isDisabled ? '功能权限-详情':'功能权限-修改'
               this.isDisabled = isDisabled
               this.permissionDialog = true
               if(this.$refs.permissionForm){
                    this.$refs.permissionForm.clearValidate()
                }
               api.getPermissionInfoById(id,function(res){
                   that.permissionForm = res.data
                   that.permissionForm.permissionType =  that.permissionForm.permissionType ? parseInt(that.permissionForm.permissionType) :''
                   that.permissionForm.parentNode = that.permissionForm.parentNode ? parseInt(that.permissionForm.parentNode) :''
                   that.originalPermissionForm = Object.assign({},that.permissionForm)
               })
            },
            deleteRow(id){
                var that = this
                this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    api.deletePermissionInfo(id,function(res){
                    res.code === 200 ? (that.showTips(res.data,'success') ,that.getPermissionList(),that.getPermissionInfoListNode()): that.showTips(res.msg,'warning')
                    })
                }).catch(() => {
                that.showTips('已取消删除','info')
                })
            },
            submitForm(){
                var that = this
                this.$refs.permissionForm.validate((valid) => {
                    if (valid) {
                        api.checkPermissionInfoName(that.permissionForm.permissionName,function(res){
                             that.permissionForm.permissionId && that.originalPermissionForm.permissionName == that.permissionForm.permissionName ? res.data = true :''
                            console.log(res.data)
                            if(!res.data){
                                that.showTips('名称不能重复','warning')
                            }else{
                                if(that.permissionForm.permissionId)
                                {
                                    api.updatePermissionInfo(that.permissionForm,function(res){
                                        res.code === 200 ? (that.showTips(res.data,'success') ,that.getPermissionList(),that.getPermissionInfoListNode()): that.showTips(res.msg,'warning')
                                    })
                                }
                                else{
                                    api.addPermissionInfo(that.permissionForm,function(res){
                                        res.code === 200 ? (that.showTips(res.data,'success') ,that.getPermissionList(),that.getPermissionInfoListNode()): that.showTips(res.msg,'warning')
                                    })
                                }
                                    that.$refs.permissionForm.clearValidate()
                                    that.permissionDialog = false
                            }
                        })

                    }else{
                        return false

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
