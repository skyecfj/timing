<!--用户管理-->
<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <!-- <el-col :span="4"><div>财务市场</div></el-col> -->
                <el-col :span="4"><div>角色</div></el-col>
                <el-col :span="6"><div></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <!-- <el-col :span="4">
                    <el-select size="small"  v-model="financeMarket" placeholder="请选择财务市场">
                        <el-option
                                v-for="item in markets"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col> -->
                <el-col :span="4">
                    <el-select size="small"  v-model="roleName" placeholder="请选择角色" filterable>
                        <el-option
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6" class="viewInp">
                    <el-input size="small"
                              placeholder="请输入AD账号/姓名查询"
                              v-model.trim="adOrName"
                              clearable
                              class="ADInp"
                              @keyup.enter.native="queryUser">
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button size="small"  type="success" @click="queryUser" class="c-button">查询</el-button>
                    <el-button size="small"  type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <template>
                <div class="viewIcon">
                    <el-button size="small"  type="success" @click="editUser" class="c-button">新增</el-button>
                    <el-button size="small"  type="success" @click="downloadUser" class="c-button"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                </div>
                <el-table
                        :data="FSCTableData"
                        tooltip-effect="dark"
                        border
                        @selection-change="FSCHandleSelectionChange">
                    <el-table-column prop="userNumber" label="PS ID" width="100"></el-table-column>
                    <el-table-column prop="userName" label="姓名" width="80"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="adAccount" label="AD账号" width="80"></el-table-column>
                    <!-- <el-table-column prop="financeMarket" label="财务市场" width="80"></el-table-column> -->
                    <el-table-column prop="department" label="部门"></el-table-column>
                    <el-table-column prop="organization" label="组织架构"></el-table-column>
                    <el-table-column prop="workStatus" label="在职情况" width="80"></el-table-column>
                    <el-table-column prop="roleName" label="角色">
                        <template slot-scope="scope">
                            <span v-for="role in scope.row.roleName">{{role}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userStatus" label="状态" width="80">
                        <template slot-scope="scope">
                            <span v-if="scope.row.userStatus === 1">正常</span>
                            <span v-else-if="scope.row.userStatus === 0">已停用</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ssoLimit" label="SSO权限" width="80">
                        <template slot-scope="scope">
                            <span v-if="scope.row.ssoLimit === 1" class="open">启用</span>
                            <span v-else-if="scope.row.ssoLimit === 0" class="disabled">禁用</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userStatus" label="操作" width="200">
                        <template slot-scope="scope">
                            <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                                <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                            </el-tooltip>
                            <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                                <el-button size="small"  class="c-button-icon--primary--opacity c-button-icon-circle" @click="editUser(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                            </el-tooltip>
                            <el-tooltip content="复制" placement="top" effect="light" popper-class="table-cell-toolTip">
                                <el-button size="small"  class="c-button-icon--primary--opacity c-button-icon-circle" @click="copyUser(scope.row)"><i class="fa fa-copy"></i></el-button>
                            </el-tooltip>
                            <!--<div class="switchDiv">
                                <el-switch active-text="启用"
                                           inactive-text="停用"
                                           active-color="#1976d2"
                                           inactive-color="#bdbdbd"
                                           active-value="0"
                                           inactive-value="1"
                                           v-model="scope.row.userStatus"
                                           :width=60
                                           @change="changeUserStatus(scope.row.userId, scope.row.userStatus)">
                                </el-switch>
                                {{scope.row.userStatus}}
                            </div>-->
                            <el-button size="small"  type="text" @click="changeUserStatus(scope.row.userId, scope.row.userStatus)">
                                <span v-if="scope.row.userStatus === 1">停用</span>
                                <span v-else-if="scope.row.userStatus === 0">启用</span>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            @size-change="FSCHandleSizeChange"
                            @current-change="FSCHandleCurrentChange"
                            :current-page="FSCCurrentPage"
                            :page-sizes="FSCPageSizesList"
                            :page-size="FSCPageSize"
                            class="gross"
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="FSCTotalRecords">
                    </el-pagination>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    import  tempIp from '../../model/tempIp'
    export default {
        name: "userMgr",
        data() {
            return {
                FSCMultipleSelection: [],
                markets: [{value:'',label:'请选择'}],
                roles: [{value:'',label:'请选择'}],
                FSCCurrentPage: 1,
                FSCPageSizesList: [25, 50, 75, 100, 125],
                FSCPageSize: 25,
                FSCTableData: [],
                FSCTotalRecords: 0,
                financeMarket:'',
                financeMarketName:'',
                roleName: '',
                adOrName: '',
                activeName: 'second',
            }
        },
        methods: {
            checkDetail(rows){
                this.$router.push({name:'checkUser',query:{userId:rows.userId,detail:true},params:{parentRoute:this.$route.fullPath}});
            },
            copyUser(rows){
                this.$router.push({name:'copyUser',query:{userId:rows.userId,copy:true},params:{parentRoute:this.$route.fullPath}});
            },
            editUser(index,rows){
                if(rows){
                    this.$router.push({name:'editUser',query:{userId:rows.userId},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name:'userMgrAdd',params:{parentRoute:this.$route.fullPath}});
                }
            },
            handleClick(tab, event) {
                /*console.log(tab, event);*/
            },
            FSCHandleSelectionChange(val) {
                this.FSCMultipleSelection = val;
            },
            FSCHandleSizeChange(size) {
                this.FSCPageSize = size;
                this.getFSCList();
            },
            FSCHandleCurrentChange(currentPage) {
                this.FSCCurrentPage = currentPage;
                this.getFSCList();
            },
            getSearchCondition(){
                var that = this;
                ip.getFinanceMarketNames(function (res) {
                    res.data.forEach(function (item,index) {
                        if(item){
                            that.markets.push({
                                value:item,
                                label:item
                            })
                        }
                    })
                });
                ip.getRoleNames(function (res) {
                    res.data.forEach(function (item,index) {
                        that.roles.push({
                            value:item,
                            label:item
                        })
                    })
                    that.roles.push({value:0,label:'未配置角色'})
                })
            },
            getFSCList(param){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.FSCCurrentPage
                    },
                    {
                        name:'pageSize',
                        value:this.FSCPageSize
                    },
                    {
                        name:'adOrName',
                        value:this.adOrName
                    }
                ];
                // this.financeMarket||this.financeMarket === 0?condition.push({name:'financeMarket',value:this.financeMarket}):[];
                this.roleName||this.roleName === 0?condition.push({name:'roleName',value:this.roleName}):[];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getFSCList(tem,function (res) {
                    if(res.code === 404){
                        that.FSCTableData = [];
                        that.FSCTotalRecords = 0;
                    }else if(res.code === 200){
                        that.FSCTableData = res.data.list;
                        that.FSCTotalRecords = res.data.totalRecords;
                    }
                })
            },
            queryUser(){
                if(this.activeName === 'first'){
                    /*this.getPSList();*/
                }else if(this.activeName === 'second'){
                    this.getFSCList();
                }
            },
            reset(){
                this.financeMarket = '';
                this.roleName = '';
                this.adOrName = '';
                // if(this.activeName === 'first'){
                //     /*this.getPSList(true);*/
                // }else if(this.activeName === 'second'){
                //     this.getFSCList(true);
                // }
            },
            downloadUser(){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.FSCCurrentPage
                    },
                    {
                        name:'pageSize',
                        value:this.FSCPageSize
                    },
                    {
                        name:'adOrName',
                        value:this.adOrName
                    }
                ];
                // this.financeMarket||this.financeMarket === 0?condition.push({name:'financeMarket',value:this.financeMarket}):[];
                this.roleName||this.roleName === 0?condition.push({name:'roleName',value:this.roleName}):[];
                tem = this.common.joinSearchParam(condition);
                window.location.href = tempIp.master_ip + '/user/export'+tem;
            },
            changeUserStatus(userId, userStatus){
                var that = this;
                var tem = [];
                var newUserStatus = '';
                if(userStatus === 0){
                    newUserStatus = 1;
                }else if(userStatus === 1){
                    newUserStatus = 0;
                }
                var condition = [
                    {
                        name:'userId',
                        value:userId
                    },
                    {
                        name:'userStatus',
                        value:newUserStatus
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                ip.updateUserStatus(tem,function (res) {
                    if(res.code === 200){
                        that.common.messageUtil({
                            type: 'success',
                            message: res.data
                        });
                        that.getFSCList(true);
                    }else{
                        that.common.messageUtil({
                            type: 'info',
                            message: res.msg
                        });
                        that.getFSCList(true);
                    }
                })
            }
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            this.getFSCList();
        },
        activated(){
            if(this.$route.meta.isBack){
                this.getFSCList();
            }
            this.$route.meta.isBack = false;
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/manage';
    .switchDiv{
        display: inline-block;
        margin-left: 10px;
    }
    .ADInp{
        width: 200px;
    }
</style>
