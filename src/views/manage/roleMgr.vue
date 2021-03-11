<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>角色名称</div></el-col>
                <el-col :span="6"><div></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <template>
                        <el-input size="small"
                                placeholder="请输入"
                                v-model.trim="roleName"
                                clearable>
                        </el-input>
                    </template>
                </el-col>
                <el-col :span="6">
                    <el-button size="small"  @click="getRoleList" class="c-button c-button--primary">查询</el-button>
                    <el-button size="small"  @click="reset" class="c-button c-button--plain">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewIcon">
                <el-button size="small"  type="success" @click="downloadRole" class="c-button"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                <el-button size="small"  type="success" @click="updateRole" class="c-button">新增角色</el-button>
                <el-button size="small"  type="danger" @click="batchRemove" class="c-button">删除选中</el-button>
            </div>
            <el-table
                    :data="tableData"
                    tooltip-effect="dark"
                    border
                    class="viewTable"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="description" label="说明"></el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间"></el-table-column>
                <el-table-column prop="modifiedUser" label="更新人"></el-table-column>
                <el-table-column prop="operate" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="updateRole(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.roleId)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizesList"
                        :page-size="pageSize"
                        class="gross"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    import  tempIp from '../../model/tempIp'
    export default {
        name: "roleMgr",
        data() {
            return {
                multipleSelection: [],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                roleName: '',
                roleID: []
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getRoleList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getRoleList();
            },
            updateRole(index,rows){
                if(rows){
                    this.$router.push({name:'editRole',query:{roleId:rows.roleId},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name:'addRole',params:{parentRoute:this.$route.fullPath}});
                }
            },
            reset(){
                this.roleName =''
                // this.getRoleList()
            },
            getRoleList(param){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'roleName',
                        value:this.roleName
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getRoleList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                        that.totalRecords = 0;
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            removeRow(id) {
                this.roleID = [id];
                var that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteRole({'roleID':this.roleID},function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getRoleList();
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                            that.getRoleList();
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            batchRemove(){
                var selectItems = [];
                this.multipleSelection.forEach((item,index) => {
                    selectItems.push(item.roleId)
                });
                var that = this;

                if( selectItems.length < 1 ){
                    this.common.messageUtil({
                        type: 'info',
                        message: '请在列表中选择角色'
                    });
                }else{
                    this.$confirm('确定删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        ip.deleteRole({'roleID':selectItems},function (res) {
                            if(res.code === 200){
                                that.common.messageUtil({
                                    type: 'success',
                                    message: res.data
                                });
                                that.getRoleList();
                            }else{
                                that.common.messageUtil({
                                    type: 'info',
                                    message: res.msg
                                });
                                that.getRoleList();
                            }
                        });
                    }).catch(() => {
                        this.common.messageUtil({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            downloadRole(){
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'roleName',
                        value:this.roleName
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                window.location.href = tempIp.master_ip + '/role-info/download'+tem
            }
        },
        mounted(){
            this.getRoleList();
        },
        beforeRouteLeave(to, from, next) {
            // console.log('topath',to.path)
            if (to.path === '/manage/editRole' ||to.path === '/manage/addRole') {
                this.$store.dispatch('delCashedViews', from.name);
                from.meta.keepAlive = false;
            }else{
                from.meta.keepAlive = true;
            }
            next();
        },
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/manage';
</style>
