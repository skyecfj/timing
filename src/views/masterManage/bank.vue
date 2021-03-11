<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>银行JDE号</div></el-col>
                <el-col :span="4"><div>银行账号</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input size="small" placeholder="请输入银行JDE号" v-model.trim="mainJdeAccount" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input size="small" placeholder="请输入银行账号" v-model.trim="depositBankAccount" clearable></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button size="small" type="success" @click="getBankList" class="c-button">查询</el-button>
                    <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small"  type="success" @click="bankUpdate" class="c-button">新增</el-button>
            </div>
            <el-table :data="tableData" tooltip-effect="dark" border>
                <el-table-column prop="mainJdeAccount" label="银行JDE号"></el-table-column>
                <el-table-column prop="depositBankName" label="开户行"></el-table-column>
                <el-table-column prop="depositBankAccount" label="银行账号"></el-table-column>
                <!--<el-table-column prop="brand" label="品牌"></el-table-column>-->
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="bankUpdate(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
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
    export default {
        name: "bank",
        data() {
            return {
                options: [{value:'',label:'请选择'}],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                mainJdeAccount: '',
                depositBankAccount: '',
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getBankList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getBankList();
            },
            checkDetail(rows){
                this.$router.push({name:'bankDetail',query:{bankId:rows.bankId,detail:true},params:{parentRoute:this.$route.fullPath}});
            },
            bankUpdate(index,rows){
                if(rows){
                    this.$router.push({name:'bankEdit',query:{bankId:rows.bankId},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name:'bankAdd',params:{parentRoute:this.$route.fullPath}});
                }
            },
            getBankList(param){
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
                        name:'mainJdeAccount',
                        value:this.mainJdeAccount
                    },
                    {
                        name:'depositBankAccount',
                        value:this.depositBankAccount
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getBankList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            reset(){
                this.depositBankAccount = '';
                this.mainJdeAccount = '';
                // this.getBankList(true);
            }
        },
        beforeRouteLeave(to,from,next){
            if(to.path === '/masterManage/bankAdd' || to.path === '/masterManage/bankEdit'){
                this.$store.dispatch('delCashedViews', from.name);
                from.meta.keepAlive = false;
            }else{
                from.meta.keepAlive = true;
            }
            next();
        },
        mounted(){
            this.getBankList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>
